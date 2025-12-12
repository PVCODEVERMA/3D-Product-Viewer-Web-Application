import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { 
  Grid, 
  Box, 
  Palette, 
  Save,
  Eye,
  EyeOff,
  Download,
  RotateCcw
} from 'lucide-react';

const ControlPanel = ({
  settings,
  onSettingsChange,
  onSave,
}) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [showMaterialPicker, setShowMaterialPicker] = React.useState(false);

  const resetSettings = () => {
    onSettingsChange({
      backgroundColor: '#f8fafc',
      wireframeMode: false,
      materialColor: '#3b82f6',
      showGrid: true,
    });
  };

  const downloadSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = '3d-viewer-settings.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Viewer Controls</h2>
        <div className="flex space-x-2">
          <button
            onClick={resetSettings}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset to default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={downloadSettings}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Download settings"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Background Color */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Palette className="w-5 h-5 mr-2 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Background Color</h3>
            </div>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {showColorPicker ? 'Hide' : 'Show'} Picker
            </button>
          </div>
          
          {showColorPicker && (
            <div className="mb-3">
              <HexColorPicker
                color={settings.backgroundColor}
                onChange={(color) => onSettingsChange({ backgroundColor: color })}
                className="w-full h-32 rounded-lg overflow-hidden border border-gray-300"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer shadow-sm"
              style={{ backgroundColor: settings.backgroundColor }}
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Click to show color picker"
            />
            <input
              type="text"
              value={settings.backgroundColor}
              onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
              className="input-field text-sm"
              placeholder="#ffffff"
            />
          </div>
        </div>
        
        {/* Material Color */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Box className="w-5 h-5 mr-2 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Material Color</h3>
            </div>
            <button
              onClick={() => setShowMaterialPicker(!showMaterialPicker)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {showMaterialPicker ? 'Hide' : 'Show'} Picker
            </button>
          </div>
          
          {showMaterialPicker && (
            <div className="mb-3">
              <HexColorPicker
                color={settings.materialColor}
                onChange={(color) => onSettingsChange({ materialColor: color })}
                className="w-full h-32 rounded-lg overflow-hidden border border-gray-300"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer shadow-sm"
              style={{ backgroundColor: settings.materialColor }}
              onClick={() => setShowMaterialPicker(!showMaterialPicker)}
              title="Click to show color picker"
            />
            <input
              type="text"
              value={settings.materialColor}
              onChange={(e) => onSettingsChange({ materialColor: e.target.value })}
              className="input-field text-sm"
              placeholder="#3b82f6"
            />
          </div>
        </div>
        
        {/* Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Grid className="w-5 h-5 mr-3 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Wireframe Mode</p>
                <p className="text-xs text-gray-500">Show model as wireframe</p>
              </div>
            </div>
            <button
              onClick={() => onSettingsChange({ wireframeMode: !settings.wireframeMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.wireframeMode ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.wireframeMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              {settings.showGrid ? (
                <Eye className="w-5 h-5 mr-3 text-gray-600" />
              ) : (
                <EyeOff className="w-5 h-5 mr-3 text-gray-600" />
              )}
              <div>
                <p className="font-medium text-gray-800">Show Grid</p>
                <p className="text-xs text-gray-500">Display ground grid</p>
              </div>
            </div>
            <button
              onClick={() => onSettingsChange({ showGrid: !settings.showGrid })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showGrid ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showGrid ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onSave}
            className="w-full btn-primary flex items-center justify-center py-3"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Settings
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSettingsChange({ backgroundColor: '#ffffff' })}
              className="btn-secondary py-2 text-sm"
            >
              White BG
            </button>
            <button
              onClick={() => onSettingsChange({ backgroundColor: '#1e293b' })}
              className="btn-secondary py-2 text-sm bg-gray-800 text-white hover:bg-gray-900"
            >
              Dark BG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;