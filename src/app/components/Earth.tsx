"use client";
import { OrbitControls, useAnimations, useGLTF, Stars, SpotLight} from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { backIn } from 'framer';
import { userAgent } from 'next/server';
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three';

const Light = () => {
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const dierctLightRef = useRef<THREE.DirectionalLight | null>(null);
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
      const offset = new THREE.Vector3(); // 오프셋 설정
      dierctLightRef.current.position.copy(camera.position).add(offset);
      // 조명이 행성을 항상 비추도록 설정
      dierctLightRef.current.target.position.copy(planetPosition);
      dierctLightRef.current.target.updateMatrixWorld();
    }
  });
  
  return (
    <mesh>
      <SpotLight ref={spotLightRef} color='#00BFFF' angle={Math.PI/2.2}/>
      <directionalLight ref={dierctLightRef} intensity={50} castShadow />
    </mesh>
  );
}

const latLongToVector3 = (lat:any,lon:any,radius:any) => {
  const phi = ((lat+ 0.25) * Math.PI) / 180;
  const theta = (((lon-90) - 180) * Math.PI) / 180;
  const x = -(radius * Math.cos(phi) * Math.cos(theta));
  const y = radius * Math.sin(phi);
  const z = radius * Math.cos(phi) * Math.sin(theta);
  return new THREE.Vector3(x,y,z);
}

interface PinProps {
  lat: number;
  lon: number;
  radius: number;
}

const Pin: React.FC<PinProps> = (props) => {
  const pinRef = useRef<THREE.Sprite>(null!);
  const destinationIcon = useLoader(THREE.TextureLoader, '/destination.png');
  const { camera } = useThree();

  useEffect(() => {
    // props.radius에 대한 타입 검사를 추가합니다.
    if (typeof props.radius === 'number') {
      const position = latLongToVector3(props.lat, props.lon, props.radius);
      const lineEnd = position.clone().multiplyScalar(1.1);

      if (pinRef.current) {
        pinRef.current.position.copy(position);
      }
    }
  }, [props.lat, props.lon, props.radius]);

  useFrame(() => {
    if (pinRef.current) {
      const distance = pinRef.current.position.distanceTo(camera.position);
      const scale = Math.max(0.05,Math.log(distance))/3; // 거리가 증가할수록 스케일 감소
      pinRef.current.scale.set(scale, scale*1.5, scale);
    }
  });  

  return (
    <sprite ref={pinRef} renderOrder={1}>
      <spriteMaterial attach='material' map={destinationIcon} color={'red'}/>
    </sprite>
  );
}
const Earth = () => {
  const model = useGLTF('/earth/scene.gltf');
  const camera = useThree((state) => state.camera);
  const [radius, setRadius] = useState(2.14);

  useFrame(() => {
    const dis = Math.sqrt(Math.pow(camera.position.x,2) + Math.pow(camera.position.y,2) + Math.pow(camera.position.z,2));
    const newRadius = 2.13 + (0.03 * dis);
    setRadius(newRadius);
  });

  return (
    <mesh receiveShadow castShadow>
        <Pin lat={37.5} lon={127.5} radius={radius}/>
        <primitive object={model.scene} scale={0.0005} />
    </mesh>
  );
};

const Atmosphere = () => {

  return(
    <mesh receiveShadow castShadow>
        <ambientLight intensity={10}/>
        <sphereGeometry args={[2.16, 64, 64]}/>
        <meshPhongMaterial color='skyblue' opacity={1} transparent side={THREE.BackSide}/>
    </mesh>
  )
}

const Cloud = () => {
  const cloudRef = useRef<THREE.Mesh | null>(null!);
  const cloud = useLoader(THREE.TextureLoader, '/earth/textures/cloud.png');

  useFrame(({clock}) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y = clock.getElapsedTime() * 0.008;
    }
  });

  return(
    <mesh ref={cloudRef} renderOrder={0} receiveShadow castShadow>
        <sphereGeometry args={[2.14, 32, 32]}/>
        <meshPhongMaterial map={cloud} transparent opacity={0.9}/>
    </mesh>
  )};

export const EarthCanvas = () => {
  const localCanvas = useRef<HTMLCanvasElement>(null!);
  return (
    <Canvas>
      <OrbitControls
        minPolarAngle={0.5}
        maxPolarAngle={2}
        minDistance={2}
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