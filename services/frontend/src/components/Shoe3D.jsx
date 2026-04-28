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
    const zoomMax = props.zoomAmount || 2.5;
    const floatHeight = Math.sin(state.clock.elapsedTime) * 0.1;

    if (props.scrollProgress) {
      const progress = props.scrollProgress.get();

      // Zoom da câmera (0% → 30%)
      const zoomP = Math.min(1, progress / 0.3);
      const zoomEased = 1 - Math.pow(1 - zoomP, 3);
      const targetZ = 8 - (zoomEased * zoomMax);
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);

      // Tênis some — opacity do material (0% → 25%)
      const shoeOpacity = Math.max(0, 1 - progress / 0.25);
      ref.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = shoeOpacity;
        }
      });

      // Rotação suave
      const rotation = progress * Math.PI;
      ref.current.rotation.y = baseRotY + rotation;

      // Posição: só flutua
      ref.current.position.y = baseY + floatHeight;

      // Scale in no load
      const scale = loaded ? targetScale : 0;
      ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, scale, 0.1);
      ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, scale, 0.1);
      ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, scale, 0.1);

    } else {
      // Fallback
      const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
      const rotationSpeed = scrollY * 0.002;
      ref.current.rotation.y = baseRotY + rotationSpeed;
      ref.current.position.y = baseY + floatHeight;
      const scale = loaded ? targetScale : 0;
      ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, scale, 0.1);
      ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, scale, 0.1);
      ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, scale, 0.1);
    }
  });

  return <primitive ref={ref} object={scene} {...props} scale={0} />;
}

useGLTF.preload('/unused_blue_vans_shoe.glb');
