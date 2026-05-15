'use client';

import { Center, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';

const SUPABASE_CDN_URL =
  'https://bpilpivecdbczmkkfdzo.supabase.co/storage/v1/object/public/modelos';

function TrainModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} dispose={null} />;
}

export function ModelSupabase() {
  const modelUrl = `${SUPABASE_CDN_URL}/trem.glb.glb`;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return (
    <section className="w-full py-12 bg-zinc-900 text-zinc-100 flex flex-col items-center">
      <div className="container px-4 md:px-6 mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
          Modelo 3D Interativo
        </h2>
        <p className="mt-4 text-zinc-400">
          Explore o modelo interativo em 3D renderizado com React Three Fiber.
        </p>
      </div>

      <div className="w-full max-w-5xl h-[550px] rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#121214] relative">
        {isMounted ? (
          <Canvas camera={{ position: [0, 1.2, 3.2], fov: 40 }} shadows>
            <color attach="background" args={['#121214']} />
            <ambientLight intensity={1.1} />

            <directionalLight
              position={[6, 12, 6]}
              intensity={2.8}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />

            <hemisphereLight
              color="#ffffff"
              groundColor="#232329"
              intensity={0.6}
            />

            <Suspense fallback={null}>
              <Center>
                <TrainModel url={modelUrl} />
              </Center>
            </Suspense>

            <OrbitControls
              makeDefault
              enablePan={true}
              enableZoom={true}
              minDistance={0.5}
              maxDistance={1}
              autoRotate={true}
              autoRotateSpeed={0.4}
            />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-950/50 animate-pulse">
            <p className="text-zinc-500">A carregar ambiente 3D...</p>
          </div>
        )}
      </div>
    </section>
  );
}

useGLTF.preload(`${SUPABASE_CDN_URL}/trem.glb.glb`);
