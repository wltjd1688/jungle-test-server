"use client";
import { OrbitControls, useAnimations, useGLTF, Stars, SpotLight} from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { backIn } from 'framer';
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three';

const Light = () => {
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const dierctLightRef = useRef<THREE.directionalLight | null>(null);
  const { camera } = useThree();
  const planetPosition = new THREE.Vector3(); // 행성의 위치를 저장할 변수

  useFrame(() => {
    if (spotLightRef.current) {
      // 카메라와 행성 사이의 거리 계산
      const distanceToPlanet = camera.position.distanceTo(planetPosition);
  
      // 스포트라이트의 X축 위치 계산
      const spotlightX = camera.position.x / distanceToPlanet;
      const spotlightY = camera.position.y / distanceToPlanet;
      const spotlightZ = camera.position.z / distanceToPlanet;
  
      // 스포트라이트 위치 업데이트
      spotLightRef.current.position.x = spotlightX;
      spotLightRef.current.position.y = spotlightY;
      spotLightRef.current.position.z = spotlightZ;
  
      // 스포트라이트가 행성을 향하도록 설정 (필요한 경우)
      spotLightRef.current.target.position.copy(planetPosition);
      spotLightRef.current.target.updateMatrixWorld();
    }
  });

  useFrame(() => {
    if (dierctLightRef.current) {
      // 조명이 카메라를 따라가면서 상대적으로 왼쪽 대각선 위에 위치하도록 설정
      dierctLightRef.current.position.copy(camera.position);
    }
  });
  
  return (
    <mesh>
      <SpotLight ref={spotLightRef} color='#00BFFF' angle={Math.PI/2.2}/>
      <directionalLight ref={dierctLightRef} intensity={60} castShadow />
    </mesh>
  );
}
const Earth = () => {
  const model = useGLTF('/earth/scene.gltf')

  return (
    <mesh receiveShadow castShadow>
        <primitive object={model.scene} scale={0.0005} />
    </mesh>
  );
};

const Atmosphere = () => {

  return(
    <mesh receiveShadow castShadow>
        <ambientLight intensity={1}/>
        <sphereGeometry args={[2.17, 32, 32]}/>
        <meshPhongMaterial color='white' opacity={1} transparent={true} side={THREE.BackSide}/>
    </mesh>
  )
}

const Cloud = () => {
  const cloudRef = useRef<THREE.Mesh | null>(null!);
  const cloud = useLoader(THREE.TextureLoader, '/earth/textures/cloud.png');

  useFrame(({clock}) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y = clock.getElapsedTime() * 0.005;
    }
  });

  return(
    <mesh ref={cloudRef} receiveShadow castShadow>
        <sphereGeometry args={[2.16, 32, 32]}/>
        <meshPhongMaterial map={cloud} transparent opacity={0.9}/>
    </mesh>
  )};

export const EarthCanvas = () => {
  return (
    <Canvas>
      <OrbitControls
        enablePan={false}
        minPolarAngle={0.5}
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
      <Cloud />
      <Atmosphere /> 
    </Canvas>
  )
}