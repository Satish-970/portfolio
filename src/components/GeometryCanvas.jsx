import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial, Float, Sphere } from '@react-three/drei';

const Geometry = () => (
  <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points stride={3} frustumCulled={false}>
        <Sphere args={[1, 48, 48]} scale={1.2}>
          <PointMaterial transparent color="#e8b84b" size={0.03} sizeAttenuation depthWrite={false} />
        </Sphere>
      </Points>
    </group>
  </Float>
);

const GeometryCanvas = () => (
  <div style={{ width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center' }}>
    <Canvas camera={{ position:[0,0,5], fov:45 }} style={{ background:'transparent' }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[0,10,5]} intensity={1.5} color="#e8b84b" />
        <pointLight position={[-10,0,-10]} intensity={1.5} />
        <Geometry />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={3} />
      </Suspense>
    </Canvas>
  </div>
);

export default GeometryCanvas;
