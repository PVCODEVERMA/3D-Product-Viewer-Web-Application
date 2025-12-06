import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle, CheckCircle, XCircle, Box } from 'lucide-react'; 

const ModelUpload = ({ onUpload, isLoading }) => {
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setUploadError(null);
    
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        setUploadError('File is too large. Maximum size is 50MB.');
      } else if (error.code === 'file-invalid-type') {
        setUploadError('Invalid file type. Only GLB and GLTF files are supported.');
      } else {
        setUploadError(error.message);
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        setUploadError('File is too large. Maximum size is 50MB.');
        return;
      }

      // Validate file extension
      const validExtensions = ['.glb', '.gltf'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      if (!validExtensions.includes(fileExtension)) {
        setUploadError('Invalid file type. Only GLB and GLTF files are supported.');
        return;
      }

      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call the upload handler
      onUpload(file);
      
      // Complete progress when done
      setTimeout(() => {
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
        clearInterval(interval);
      }, 2000);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: isLoading,
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <Box className="w-6 h-6 mr-2 text-primary-600" /> {/* Changed to Box */}
        <h3 className="text-lg font-semibold text-gray-900">Upload 3D Model</h3>
      </div>
      
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          ${isDragActive && !isDragReject ? 'border-primary-500 bg-primary-50 scale-[1.02]' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}
        `}
      >
        <input {...getInputProps()} disabled={isLoading} />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              </div>
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: `conic-gradient(#3b82f6 ${uploadProgress * 3.6}deg, #e5e7eb 0deg)`,
                  borderRadius: '50%',
                  width: '5rem',
                  height: '5rem',
                }}
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-600">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
            </div>
            <p className="font-medium text-gray-700">Uploading model...</p>
            <p className="text-sm text-gray-500 mt-1">Please wait</p>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full flex items-center justify-center">
              {isDragActive ? (
                <Upload className="w-10 h-10 text-primary-500 animate-bounce" />
              ) : (
                <Upload className="w-10 h-10 text-primary-400" />
              )}
            </div>
            
            {isDragActive ? (
              <p className="text-primary-600 font-medium text-lg">Drop the file here</p>
            ) : (
              <>
                <p className="font-medium text-gray-700 text-lg">
                  Drag & drop a 3D model file
                </p>
                <p className="text-gray-500 mt-2">or click to browse</p>
              </>
            )}
            
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-center text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                <span className="text-gray-600">Supported formats: .GLB, .GLTF</span>
              </div>
              <div className="flex items-center justify-center text-sm">
                <AlertCircle className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
                <span className="text-gray-600">Maximum file size: 50MB</span>
              </div>
            </div>
          </>
        )}
      </div>

      {uploadError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{uploadError}</p>
        </div>
      )}

      
    </div>
  );
};

export default ModelUpload;