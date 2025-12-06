import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, useGLTF, Html, Sky } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ url, wireframe, color }) => {
  const { scene } = useGLTF(url);
  const meshRef = useRef(null);

  useFrame(() => {
    // Optional animation
    // if (meshRef.current) meshRef.current.rotation.y += 0.002;
  });

  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material;

        if (Array.isArray(material)) {
          material.forEach(mat => {
            mat.wireframe = wireframe;
            if (!wireframe) mat.color.set(color);
          });
        } else if (material) {
          material.wireframe = wireframe;
          if (!wireframe) material.color.set(color);
        }
      }
    });
  }, [wireframe, color, clonedScene]);

  return <primitive ref={meshRef} object={clonedScene} />;
};

const LoadingFallback = () => (
  <Html center>
    <div className="flex flex-col items-center bg-white/90 p-6 rounded-lg shadow-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p className="mt-4 text-gray-700 font-medium">Loading 3D model...</p>
      <p className="text-sm text-gray-500">Please wait</p>
    </div>
  </Html>
);

const ErrorFallback = ({ error }) => (
  <Html center>
    <div className="flex flex-col items-center bg-red-50 p-6 rounded-lg shadow-lg border border-red-200">
      <div className="text-red-500 text-3xl mb-3">⚠️</div>
      <p className="text-red-700 font-medium">Failed to load model</p>
      <p className="text-sm text-red-600 mt-2">{error}</p>
      <p className="text-xs text-gray-500 mt-4">Try a different model or URL</p>
    </div>
  </Html>
);

const ThreeViewer = ({ modelUrl, settings }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setHasError(false);
    setErrorMessage('');
  }, [modelUrl]);

  const handleError = (error) => {
    console.error('Three.js error:', error);
    setHasError(true);
    setErrorMessage(error.message || 'Failed to load 3D model');
  };

  return (
    <Canvas
      shadows
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ background: settings.backgroundColor }}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      className={`cursor-${isDragging ? 'grabbing' : 'grab'}`}
    >
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
      />

      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <pointLight position={[10, -10, 10]} intensity={0.3} color="#ff6b6b" />

      <Suspense fallback={<LoadingFallback />}>
        {!hasError ? (
          <Model 
            url={modelUrl} 
            wireframe={settings.wireframeMode}
            color={settings.materialColor}
          />
        ) : (
          <ErrorFallback error={errorMessage} />
        )}
      </Suspense>

      {settings.showGrid && (
        <Grid
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={3}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={30}
          fadeStrength={1}
        />
      )}

      <OrbitControls
        enableZoom
        enablePan
        enableRotate
        zoomSpeed={0.6}
        panSpeed={0.5}
        rotateSpeed={0.8}
        maxDistance={20}
        minDistance={2}
        onError={handleError}
      />

      <Environment preset="city" />

      <Sky
        distance={450000}
        sunPosition={[100, 10, 100]}
        inclination={0}
        azimuth={0.25}
      />
    </Canvas>
  );
};

// Preload models
useGLTF.preload(
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb'
);

export default ThreeViewer;
