import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

const Earth = () => (
  <Sphere visible args={[1, 100, 200]} scale={1.8}>
    <MeshDistortMaterial
      color="#1a0f00"
      attach="material"
      distort={0.3}
      speed={1.5}
      roughness={0.3}
      metalness={0.9}
      emissive="#e8b84b"
      emissiveIntensity={0.15}
    />
  </Sphere>
);

const EarthCanvas = () => (
  <div style={{ width:'100%', height:'100%', minHeight:'400px' }}>
    <Canvas camera={{ position:[0,0,5], fov:45 }} style={{ background:'transparent' }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[0,10,5]} intensity={2} color="#e8b84b" />
        <pointLight position={[-10,-10,-10]} intensity={1} color="#ff9500" />
        <Earth />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Suspense>
    </Canvas>
  </div>
);

export default EarthCanvas;
