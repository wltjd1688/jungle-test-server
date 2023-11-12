"use client";
import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import React, { useEffect } from 'react'
import { GLTFLoader }from 'three/examples/jsm/loaders/GLTFLoader.js';

const Earth = () => {
  const model = useGLTF('/earth/scene.gltf')
  return (
    <mesh>
      <primitive object={model.scene} scale={0.0005} />
    </mesh>
  );
};
export const ChatBorCanvas = () => {
  return (
    <Canvas>
      <OrbitControls
        enableZoom={false}
      />
      <ambientLight />
      <Earth />
    </Canvas>
  )
}
