
import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b  from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Something went wrong
              </h2>
              
              <p className="text-gray-600 mb-6">
                The 3D viewer encountered an error. This might be due to:
              </p>
              
              <div className="text-left mb-8">
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></span>
                    <span>Unsupported 3D model format</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></span>
                    <span>Browser WebGL compatibility issues</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></span>
                    <span>Large model exceeding memory limits</span>
                  </li>
                </ul>
              </div>

              {this.state.error && (
                <div className="mb-6 w-full">
                  <details className="bg-gray-50 rounded-lg p-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700">
                      Error Details
                    </summary>
                    <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                  </details>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 btn-primary flex items-center justify-center py-3"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reload Application
                </button>
                
                <button
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="flex-1 btn-secondary flex items-center justify-center py-3"
                >
                  Try Again
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 w-full">
                <p className="text-sm text-gray-500">
                  If the problem persists, please try:
                </p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  <a
                    href="/"
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    Go to Home
                  </a>
                  <button
                    onClick={() => localStorage.clear()}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    Clear Local Data
                  </button>
                  <a
                    href="https://get.webgl.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    Check WebGL Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;