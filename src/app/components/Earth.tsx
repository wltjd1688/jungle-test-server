"use client";
import { OrbitControls, useAnimations, useGLTF, Stars, SpotLight, Plane} from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three';
import { gsap } from 'gsap';
import SyncImage from 'public/sync.png';
import Image from 'next/image';

const Light = () => {
  const spotLightRef = useRef<THREE.SpotLight | null>(null!);
  const directLightRef = useRef<THREE.DirectionalLight | null>(null!);
  const { camera } = useThree();
  const planetPosition = new THREE.Vector3(); // 행성의 위치를 저장할 변수

  useFrame(() => {
    if (spotLightRef.current && directLightRef.current) {
      // 카메라와 행성 사이의 거리 계산
      const distanceToPlanet = camera.position.distanceTo(planetPosition);
      directLightRef.current.target.position.copy(new THREE.Vector3(0,0,0));
  
      // 스포트라이트의 X축 위치 계산
      const spotlightX = camera.position.x / distanceToPlanet;
      const spotlightY = camera.position.y / distanceToPlanet;
      const spotlightZ = camera.position.z / distanceToPlanet;
  
      // 스포트라이트 위치 업데이트
      spotLightRef.current.position.x = spotlightX;
      spotLightRef.current.position.y = spotlightY;
      spotLightRef.current.position.z = spotlightZ;
      
      
      directLightRef.current.position.copy(new THREE.Vector3(camera.position.x+2, camera.position.y+2, camera.position.z));
      // 스포트라이트가 행성을 향하도록 설정 (필요한 경우)
      spotLightRef.current.target.position.copy(planetPosition);
    }
  });
  
  return (
    <mesh>
      <SpotLight ref={spotLightRef} color='#00BFFF' angle={Math.PI/2.2}/>
      <directionalLight ref={directLightRef} intensity={90} castShadow />
    </mesh>
  );
}

const EarthlatLongToVector3 = (lat:any,lon:any,radius:any) => {
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
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const sphereRef = useRef<THREE.Mesh>(null!);
  const plateRef = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();

  useEffect(() => {
    if (typeof props.radius === 'number') {
      const position = EarthlatLongToVector3(props.lat, props.lon, props.radius);
      if (groupRef.current) {
        groupRef.current.position.copy(position);
        groupRef.current.lookAt(new THREE.Vector3(0,0,0));
      }
      if (meshRef.current) {
        meshRef.current.rotation.x = 0.2;
        meshRef.current.rotation.y = 1.54;
        meshRef.current.rotation.z = 1.38; 
      }
      if (sphereRef.current) {
        sphereRef.current.position.x = 0;
        sphereRef.current.position.y = 0;
        sphereRef.current.position.z = -0.12; 
      }
    }
  }, [props.lat, props.lon, props.radius]);

  useEffect(() => {
    if (plateRef.current) {
      plateRef.current.rotation.x = 3.14;
    }
  })

  const onPinClick = () => {
    zoomInToLocation(props.lat, props.lon);
  }

  const zoomInToLocation = (lat:any, lon:any) => {
    // 클릭한 지점으로 이동할 카메라 위치 계산
    const intermediatePosition = EarthlatLongToVector3(lat, lon, 5); // 예시 값, 지구 표면에서 높은 위치
  
    // 최종 목적지 위치 계산
    const finalPosition = EarthlatLongToVector3(lat, lon, 2.3); // 지구 표면에서 약간 떨어진 위치
  
    // 클릭한 지점으로 빠르게 이동
    gsap.to(camera.position, {
      x: intermediatePosition.x,
      y: intermediatePosition.y,
      z: intermediatePosition.z,
      duration: 0.6, // 빠른 이동
      ease: "power2.inOut",
      onUpdate: () => camera.lookAt(new THREE.Vector3(0, 0, 0)),
      onComplete: () => {
        // 천천히 최종 목적지로 줌인
        gsap.to(camera.position, {
          x: finalPosition.x,
          y: finalPosition.y,
          z: finalPosition.z,
          duration: 1.5, // 천천히 이동
          ease: "power2.inOut",
          onUpdate: () => camera.lookAt(new THREE.Vector3(0, 0, 0)),
          onComplete: () => {
            // // 지구를 서서히 사라지게 만들기
            // gsap.to(scene.rotation, {
            //   y: Math.PI * 2,
            //   duration: 1.5,
            //   ease: "power2.inOut",
            //   onComplete: () => {
            //     // 2D 지도로 이동
            //     window.location.href = `https://www.example.com/${lat},${lon}`;
            //   }
            // });
          }
        });
      }
    });
  };

  return (
    <group ref={groupRef}>
      {/* 몸통 */}
      <mesh ref={meshRef} onClick={onPinClick}>
        <coneGeometry args={[0.05, 0.15]} />
        <meshBasicMaterial color="red" />       
      </mesh>
      {/* 머리 */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.04]}/>
        <meshBasicMaterial color="blue" />
      </mesh>
    </group>
  );
};


const Earth = () => {
  const model = useGLTF('/earth/scene.gltf');
  const camera = useThree((state) => state.camera);
  const [radius, setRadius] = useState(2.14);
  const { scene } = useThree();

  return (
    <mesh receiveShadow castShadow>
        <primitive object={model.scene} scale={0.0005} />
        {/* <shaderMaterial vertexShader='
        varying vec3 vertexNormal;
        
        void main() {
          vertexNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }'
        fragmentShader='
        varying vec3 vertexNormal;
        void main() {
          float intensity = pow(0.5 - dot(vertexNormal, vec3(0, 0, 1.0)), 0.5);
          gl_EragColor = vec4(0.3, 0.6, 1.0, 1) * intensity;
        }'
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}/> */}
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
  
  return (
    <>
      <Canvas>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={0.5}
          maxPolarAngle={2}
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
        <Pin lat={37.5518911} lon={126.9917937} radius={2.2}/>
        <Pin lat={25.451233} lon={28.111223} radius={2.2}/>
        <Pin lat={0} lon={35} radius={2.2}/>
      </Canvas>
      <button className=' rounded-full bg-white fixed left-3 top-20'>
        <Image src={SyncImage} alt='sync' width={30} height={30}/>
      </button>
    </>
  )
}

export default EarthCanvas;