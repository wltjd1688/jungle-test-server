"use client";
import { OrbitControls, useAnimations, useGLTF, Stars} from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import React, { useEffect, useRef } from 'react'
import { GLTFLoader }from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Vector3 } from 'three';


const Light = () => {
  const lightRef = useRef<THREE.SpotLight | null>(null);
  const {camera} = useThree();

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.copy(camera.position);
    }
  });

  return (
    <spotLight ref={lightRef} color="white" intensity={800} distance={50} angle={1} penumbra={20} position={[90,90,90]}/>
  );
}
const Earth = () => {
  const model = useGLTF('/earth/scene.gltf')

  const earthRef = useRef<THREE.Object3D | null>(null);

  useFrame(({clock})=>{
    if(earthRef.current){
      earthRef.current.rotation.x = 0.4;
      earthRef.current.rotation.y = clock.getElapsedTime()*0.08;
    }
  });

  return (
    <mesh>
      <primitive ref={earthRef} object={model.scene} scale={0.0005} />
    </mesh>
  );
};
export const ChatBorCanvas = () => {
  return (
    <Canvas>
      <OrbitControls
        enableZoom={true}
      />
      <ambientLight intensity={50}/>
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
