"use client";
import { OrbitControls, useAnimations, useGLTF, Stars} from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import React, { useEffect, useRef } from 'react'
import { GLTFLoader }from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Vector3 } from 'three';

const Light = () => {

  return (
    <>
      <directionalLight  position={[-5,4,3]} intensity={120} castShadow />
    </>
  );
}
const Earth = () => {
  const model = useGLTF('/earth/scene.gltf')
  
  const earthRef = useRef<THREE.Object3D | null>(null);

  useFrame(({clock})=>{
    if(earthRef.current){
      earthRef.current.rotation.x = -0.04;
      earthRef.current.rotation.y = clock.getElapsedTime()*0.08;
      earthRef.current.rotation.z = clock.getElapsedTime()*0.02;
    }
  });

  return (
    <>
      <mesh receiveShadow castShadow>
        <primitive ref={earthRef} object={model.scene} scale={0.0005} />
      </mesh>
      <mesh>
        <sphereGeometry args={[model.scene.scale.x*4320, 32, 32]}/>
        <meshBasicMaterial color='blue' transparent opacity={0.1}/>
      </mesh>
    </>
  );
};

export const EarthCanvas = () => {
  return (
    <Canvas>
      <OrbitControls
        enablePan={false}
        minPolarAngle={0.8}
        maxPolarAngle={2}
        minDistance={3}
        maxDistance={5}
      />
      <Light />
      <Stars 
      radius={300} 
      depth={60} 
      count={20000} 
      factor={7} 
      saturation={0}
      fade={true}/>
      <Earth />
    </Canvas>
  )
}