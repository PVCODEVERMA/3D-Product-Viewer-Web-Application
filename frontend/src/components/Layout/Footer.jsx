// src/components/Layout/Footer.js
import React, { useState } from 'react';
import { Github, Globe, Mail, Heart, Code, Shield, ExternalLink } from 'lucide-react';

const Footer = () => {
  const [currentYear] = useState(new Date().getFullYear());

  const technologies = [
    { name: 'React', color: 'text-blue-500' },
    { name: 'Three.js', color: 'text-green-500' },
    { name: 'Node.js', color: 'text-green-600' },
    { name: 'Express', color: 'text-gray-600' },
    { name: 'MongoDB', color: 'text-green-700' },
    { name: 'TypeScript', color: 'text-blue-600' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">3D Product Viewer</h3>
                <p className="text-gray-400 text-sm">MERN + Three.js Test Assignment</p>
              </div>
            </div>
            <p className="text-gray-300">
              A fully functional 3D product viewer demonstrating modern web development with 3D graphics capabilities.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center text-sm text-gray-400">
                <Shield className="w-4 h-4 mr-1" />
                <span>Secure Uploads</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Heart className="w-4 h-4 mr-1 text-red-400" />
                <span>Open Source</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://threejs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Three.js Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/mrdoob/three.js"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Three.js GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://react-three-fiber.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  React Three Fiber
                </a>
              </li>
              <li>
                <a
                  href="https://modelviewer.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  3D Model Viewer Examples
                </a>
              </li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Built With</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {technologies.map((tech) => (
                <span
                  key={tech.name}
                  className={`px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm ${tech.color} text-sm font-medium`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Github className="w-5 h-5" />
                <a
                  href="https://github.com/yourusername/3d-product-viewer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-300 transition-colors"
                >
                  View Source Code
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5" />
                <a
                  href="https://quleep.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-300 transition-colors"
                >
                  Visit Quleep
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5" />
                <a
                  href="mailto:hr@quleep.in"
                  className="hover:text-primary-300 transition-colors"
                >
                  Contact: hr@quleep.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400">
                © {currentYear} 3D Product Viewer. Test assignment for Full Stack Developer position.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                This project is for demonstration purposes only.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Reference Sites:</span>
              <a
                href="https://arnxt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-300 hover:text-primary-200 text-sm flex items-center"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Arnxt
              </a>
              <a
                href="https://quleep.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-300 hover:text-primary-200 text-sm flex items-center"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Quleep
              </a>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary-300">3D</div>
            <div className="text-gray-400 text-sm">Real-time Rendering</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary-300">100%</div>
            <div className="text-gray-400 text-sm">Client-side Processing</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary-300">50MB</div>
            <div className="text-gray-400 text-sm">Max File Size</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary-300">2</div>
            <div className="text-gray-400 text-sm">Supported Formats</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;