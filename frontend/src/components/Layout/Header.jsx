import React, { useState } from 'react';
import { Box, Settings, Menu, X, HelpCircle, Download, Share2, Github, ExternalLink } from 'lucide-react';
import { apiService } from '../../services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleExportSettings = async () => {
    try {
      const settings = await apiService.exportSettings();
      const dataStr = JSON.stringify(settings, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', '3d-viewer-settings.json');
      linkElement.click();
    } catch (error) {
      console.error('Error exporting settings:', error);
      alert('Failed to export settings');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '3D Product Viewer',
        text: 'Check out this amazing 3D Product Viewer built with Three.js!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-white to-gray-50 shadow-lg border-b border-gray-200/80 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-md">
                    <Box className="w-7 h-7 text-white" />
                  </div>
                  {/* <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full border-3 border-white shadow-sm"></div> */}
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    3D Product Viewer
                  </h1>
                  <p className="text-sm text-gray-500 hidden sm:block mt-0.5">
                    Interactive 3D Model Viewer with MERN + Three.js
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              <button
                onClick={() => setShowHelp(true)}
                className="flex items-center px-4 py-2.5 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-xl transition-all group"
              >
                <div className="relative">
                  <HelpCircle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  {/* <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div> */}
                </div>
                <span className="font-medium">Help</span>
              </button>
              
              <button
                onClick={handleExportSettings}
                className="flex items-center px-4 py-2.5 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-xl transition-all group"
              >
                <div className="relative">
                  <Download className="w-5 h-5 mr-3 group-hover:translate-y-0.5 transition-transform" />
                  {/* <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div> */}
                </div>
                <span className="font-medium">Export</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2.5 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-xl transition-all group"
              >
                <div className="relative">
                  <Share2 className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                  {/* <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div> */}
                </div>
                <span className="font-medium">Share</span>
              </button>
              
              <button className="flex items-center px-4 py-2.5 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-xl transition-all group">
                <div className="relative">
                  <Settings className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                  {/* <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div> */}
                </div>
                <span className="font-medium">Settings</span>
              </button>
              
              <div className="h-8 w-px bg-gray-300 mx-2"></div>
              
              <a 
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Github className="w-5 h-5 mr-2.5" />
                <span>View Source</span>
                <ExternalLink className="w-4 h-4 ml-2 opacity-80" />
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-3">
              <button
                onClick={() => setShowHelp(true)}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-all"
                aria-label="Help"
              >
                <HelpCircle className="w-5.5 h-5.5 text-gray-700" />
              </button>
              <a 
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-medium rounded-xl shadow-md"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/80 bg-white/95 backdrop-blur-sm animate-slideDown">
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setShowHelp(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-all active:scale-95"
                >
                  <div className="p-3 bg-primary-100 rounded-lg mb-3">
                    <HelpCircle className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="font-medium text-gray-800">Help</span>
                  <span className="text-xs text-gray-500 mt-1">Documentation</span>
                </button>
                
                <button
                  onClick={() => {
                    handleExportSettings();
                    setIsMenuOpen(false);
                  }}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-all active:scale-95"
                >
                  <div className="p-3 bg-primary-100 rounded-lg mb-3">
                    <Download className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="font-medium text-gray-800">Export</span>
                  <span className="text-xs text-gray-500 mt-1">Settings</span>
                </button>
                
                <button
                  onClick={() => {
                    handleShare();
                    setIsMenuOpen(false);
                  }}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-all active:scale-95"
                >
                  <div className="p-3 bg-primary-100 rounded-lg mb-3">
                    <Share2 className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="font-medium text-gray-800">Share</span>
                  <span className="text-xs text-gray-500 mt-1">Viewer</span>
                </button>
                
                <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-all active:scale-95">
                  <div className="p-3 bg-primary-100 rounded-lg mb-3">
                    <Settings className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="font-medium text-gray-800">Settings</span>
                  <span className="text-xs text-gray-500 mt-1">Application</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent">
                    Help & Documentation
                  </h2>
                  <p className="text-gray-500 mt-1">Everything you need to know about using the 3D Viewer</p>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2.5 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
                  aria-label="Close help"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-8">
                <section className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full mr-3"></div>
                    3D Viewer Controls
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-bold">↻</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Rotate</h4>
                        <p className="text-sm text-gray-600">Left click + drag</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-bold">⊕</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Zoom</h4>
                        <p className="text-sm text-gray-600">Scroll wheel or pinch</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-bold">↔</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Pan</h4>
                        <p className="text-sm text-gray-600">Right click + drag</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-bold">⟲</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Reset</h4>
                        <p className="text-sm text-gray-600">Double click anywhere</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3"></div>
                    Supported File Formats
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold">.glb</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">GLB Format</h4>
                          <p className="text-sm text-gray-600">Binary (Recommended)</p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center">
                          {/* <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div> */}
                          Single file format
                        </li>
                        <li className="flex items-center">
                          {/* <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div> */}
                          Faster loading
                        </li>
                        <li className="flex items-center">
                          {/* <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div> */}
                          Smaller file size
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold">.gltf</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">GLTF Format</h4>
                          <p className="text-sm text-gray-600">JSON + External files</p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          Human readable
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          External assets
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          Better compression
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
                    Keyboard Shortcuts
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: 'W', action: 'Toggle Wireframe', color: 'from-purple-100 to-purple-50' },
                      { key: 'G', action: 'Toggle Grid', color: 'from-blue-100 to-blue-50' },
                      { key: 'R', action: 'Reset Camera', color: 'from-green-100 to-green-50' },
                      { key: 'F', action: 'Fit to View', color: 'from-orange-100 to-orange-50' },
                      { key: 'H', action: 'Toggle Help', color: 'from-pink-100 to-pink-50' },
                      { key: 'ESC', action: 'Close Panels', color: 'from-red-100 to-red-50' },
                      { key: 'Space', action: 'Play/Pause', color: 'from-cyan-100 to-cyan-50' },
                      { key: 'L', action: 'Toggle Lights', color: 'from-yellow-100 to-yellow-50' }
                    ].map((shortcut, index) => (
                      <div key={index} className={`bg-gradient-to-r ${shortcut.color} rounded-xl p-4 border border-gray-100`}>
                        <kbd className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-lg font-bold text-gray-800 font-mono block text-center mb-2 shadow-sm">
                          {shortcut.key}
                        </kbd>
                        <p className="text-sm text-gray-700 text-center font-medium">{shortcut.action}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mr-3"></div>
                    Troubleshooting Guide
                  </h3>
                  <div className="space-y-3">
                    <details className="group border border-gray-200 rounded-xl overflow-hidden hover:border-primary-200 transition-colors">
                      <summary className="p-5 cursor-pointer font-medium bg-gradient-to-r from-gray-50 to-white hover:from-primary-50/30 list-none flex items-center justify-between">
                        <span className="text-gray-800">Model not loading?</span>
                        <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center group-open:rotate-180 transition-transform">
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </summary>
                      <div className="p-5 pt-0 border-t border-gray-200">
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                              Check if file format is supported (.glb or .gltf)
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                              Ensure file size is under 50MB
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                              Try compressing your model before upload
                            </li>
                          </ul>
                        </div>
                      </div>
                    </details>
                    
                    <details className="group border border-gray-200 rounded-xl overflow-hidden hover:border-primary-200 transition-colors">
                      <summary className="p-5 cursor-pointer font-medium bg-gradient-to-r from-gray-50 to-white hover:from-primary-50/30 list-none flex items-center justify-between">
                        <span className="text-gray-800">Performance issues?</span>
                        <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center group-open:rotate-180 transition-transform">
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </summary>
                      <div className="p-5 pt-0 border-t border-gray-200">
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              Reduce polygon count of your model
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              Use compressed textures (JPEG/PNG)
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              Close other GPU-intensive applications
                            </li>
                          </ul>
                        </div>
                      </div>
                    </details>
                  </div>
                </section>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Need more help?</h4>
                      <p className="text-gray-600 text-sm">Contact our support team for immediate assistance</p>
                    </div>
                    <a 
                      href="mailto:support@example.com"
                      className="mt-4 sm:mt-0 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all inline-flex items-center"
                    >
                      Contact Support
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;