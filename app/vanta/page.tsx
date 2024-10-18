"use client";

import { useEffect, useRef, useState } from 'react';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';
import Link from 'next/link';

export default function VantaPage() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const myRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: myRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x3fd3ff,
          points: 16.00,
          maxDistance: 20.00,
          spacing: 15.00
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={myRef} className="h-screen w-full">
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">Vanta.js NET Effect</h1>
          <p className="mb-8 text-lg text-white">This background is created using Vanta.js</p>
          <Link href="/" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Go back to custom 3D background
          </Link>
        </div>
      </div>
    </div>
  );
}