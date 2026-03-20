import React, { useRef, useLayoutEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Shoe3D(props) {
  const { scene } = useGLTF('/unused_blue_vans_shoe.glb');
  const ref = useRef();
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.rotation.x = 0;
      ref.current.rotation.y = -Math.PI / 2;
      setTimeout(() => setLoaded(true), 100);
    }
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const rotationSpeed = scrollY * 0.002;
    ref.current.rotation.y = -Math.PI / 2 + rotationSpeed;
    const floatHeight = Math.sin(state.clock.elapsedTime) * 0.1;
    ref.current.position.y = (props.position ? props.position[1] : -0.5) + floatHeight;
    const targetScale = loaded ? (props.scale || 1) : 0;
    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.1);
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, targetScale, 0.1);
    ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, targetScale, 0.1);
  });

  return <primitive ref={ref} object={scene} {...props} scale={0} />;
}

useGLTF.preload('/unused_blue_vans_shoe.glb');
