import React, { useRef, useLayoutEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Shoe3D(props) {
  const { scene } = useGLTF('/unused_blue_vans_shoe.glb');
  const ref = useRef();
  const [loaded, setLoaded] = useState(false);
  const isMobile = props.isMobile || false;
  const baseRotY = isMobile ? 0 : -Math.PI / 2;

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.rotation.x = 0;
      ref.current.rotation.y = baseRotY;
      setTimeout(() => setLoaded(true), 100);
    }
  }, [baseRotY]);

  useFrame((state) => {
    if (!ref.current) return;

    const baseY = props.position ? props.position[1] : -0.5;
    const targetScale = props.scale || 1;
    const floatHeight = Math.sin(state.clock.elapsedTime) * 0.1;

    ref.current.position.y = baseY + floatHeight;
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const rotationSpeed = scrollY * 0.002;
    ref.current.rotation.y = baseRotY + rotationSpeed;

    const scale = loaded ? targetScale : 0;
    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, scale, 0.1);
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, scale, 0.1);
    ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, scale, 0.1);
  });

  return <primitive ref={ref} object={scene} {...props} scale={0} />;
}

useGLTF.preload('/unused_blue_vans_shoe.glb');
