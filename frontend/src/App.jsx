import React, { useState, useEffect } from 'react';
import ThreeViewer from './components/ThreeViewer/ThreeViewer';
import ControlPanel from './components/UI/ControlPanel';
import ModelUpload from './components/UI/ModelUpload';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import { api } from './services/api';
import './App.css';
function App() {
  const [currentModel, setCurrentModel] = useState(null);
  const [models, setModels] = useState([]);
  const [viewerSettings, setViewerSettings] = useState({
    backgroundColor: '#f8fafc',
    wireframeMode: false,
    materialColor: '#3b82f6',
    showGrid: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSavedSettings();
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const defaultModels = [
        {
          id: '1',
          name: 'Suzanne Monkey',
          url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
          thumbnail: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=300&fit=crop',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Duck Model',
          url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Duck/glTF-Binary/Duck.glb',
          thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=300&fit=crop',
          createdAt: new Date().toISOString(),
        }
      ];
      setModels(defaultModels);
      if (!currentModel && defaultModels.length > 0) {
        setCurrentModel(defaultModels[0]);
      }
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const loadSavedSettings = async () => {
    try {
      const settings = await api.getViewerSettings();
      if (settings) {
        setViewerSettings(settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleModelUpload = async (file) => {
    setIsLoading(true);
    try {
      // For demo purposes, create a local URL
      const modelUrl = URL.createObjectURL(file);
      const uploadedModel = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: modelUrl,
        thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=300&fit=crop',
        createdAt: new Date().toISOString(),
      };
      setCurrentModel(uploadedModel);
      setModels(prev => [uploadedModel, ...prev]);
      await saveSettings();
    } catch (error) {
      console.error('Error uploading model:', error);
      alert('Failed to upload model. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelSelect = (model) => {
    setCurrentModel(model);
    saveSettings();
  };

  const handleSettingsChange = (newSettings) => {
    setViewerSettings(prev => ({ ...prev, ...newSettings }));
  };

  const saveSettings = async () => {
    try {
      await api.saveViewerSettings({
        ...viewerSettings,
        modelId: currentModel?.id,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(saveSettings, 1000);
    return () => clearTimeout(timeoutId);
  }, [viewerSettings]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <ControlPanel
              settings={viewerSettings}
              onSettingsChange={handleSettingsChange}
              onSave={saveSettings}
            />
            
            <ModelUpload
              onUpload={handleModelUpload}
              isLoading={isLoading}
            />
            
            {/* Model Library */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Model Library</h3>
              <div className="space-y-3">
                {models.map(model => (
                  <button
                    key={model.id}
                    onClick={() => handleModelSelect(model)}
                    className={`w-full flex items-center p-3 rounded-lg border transition-colors ${
                      currentModel?.id === model.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded mr-3 overflow-hidden">
                      <img
                        src={model.thumbnail}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{model.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(model.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Panel - 3D Viewer */}
          <div className="lg:col-span-3">
            <div className="card p-0 overflow-hidden">
              <div className="h-[600px] relative">
                {currentModel ? (
                  <ThreeViewer
                    modelUrl={currentModel.url}
                    settings={viewerSettings}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-gray-500 mb-4">No model loaded</p>
                      <p className="text-sm text-gray-400">Upload or select a model to begin</p>
                    </div>
                  </div>
                )}
                
                {/* Viewer Info */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-center space-x-4">
                    <span>Model: {currentModel?.name || 'None'}</span>
                    <span>Controls: Rotate (Click+Drag), Zoom (Scroll), Pan (Right Click+Drag)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;