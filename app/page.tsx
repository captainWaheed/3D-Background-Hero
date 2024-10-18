"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x231651); // Dark purple background

    const particlesCount = 500; // Increased number of particles
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    const spread = 10; // Increased spread for wider distribution
    const layers = 5; // Number of layers

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const layerIndex = Math.floor(i / (particlesCount / layers));
      const layerDepth = (layerIndex - (layers - 1) / 2) * (spread / layers);

      positions[i3] = (Math.random() - 0.5) * spread * (window.innerWidth / window.innerHeight);
      positions[i3 + 1] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = layerDepth + (Math.random() - 0.5) * (spread / layers);
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x4FCBFF, // Light blue color
      size: 0.05,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Create lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x4FCBFF, transparent: true, opacity: 0.2 });
    const lines = new THREE.Group();
    scene.add(lines);

    function connectNearParticles() {
      while (lines.children.length > 0) {
        lines.remove(lines.children[0]);
      }

      for (let i = 0; i < particlesCount; i++) {
        for (let j = i + 1; j < particlesCount; j++) {
          const distance = Math.sqrt(
            Math.pow(positions[i * 3] - positions[j * 3], 2) +
            Math.pow(positions[i * 3 + 1] - positions[j * 3 + 1], 2) +
            Math.pow(positions[i * 3 + 2] - positions[j * 3 + 2], 2)
          );

          if (distance < 1.5) { // Increased connection distance
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]),
              new THREE.Vector3(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2])
            ]);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            lines.add(line);
          }
        }
      }
    }

    connectNearParticles();

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      particleSystem.rotation.y += 0.0005;
      lines.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      particleSystem.rotation.y = mouseX * 0.2;
      particleSystem.rotation.x = mouseY * 0.2;
      lines.rotation.y = mouseX * 0.2;
      lines.rotation.x = mouseY * 0.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 z-0" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">Welcome to My 3D World</h1>
          <p className="mb-8 text-lg text-white">Explore the interactive background!</p>
          <Link href="/vanta" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            See Vanta.js version
          </Link>
        </div>
      </div>
    </div>
  );
}