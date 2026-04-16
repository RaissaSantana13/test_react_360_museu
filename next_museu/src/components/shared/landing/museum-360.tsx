'use client';

import { useEffect, useRef } from 'react';
import 'pannellum/src/css/pannellum.css';

export function Museum360() {
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    const loadPannellum = async () => {
      await import('pannellum');

      const lib = (window as any).pannellum;

      if (lib && viewerRef.current) {
        lib.viewer(viewerRef.current, {
          default: {
            firstScene: 'sala1',
            sceneFadeDuration: 1000,
            autoLoad: true,
          },
          scenes: {
            sala1: {
              title: 'Sala 1',
              type: 'equirectangular',
              panorama: '/assets/imagem1.jpg',
              hotSpots: [
                {
                  pitch: 0,
                  yaw: 182,
                  type: 'scene',
                  text: 'Ir para Sala 2',
                  sceneId: 'sala2',
                },
                {
                  pitch: 3,
                  yaw: -96,
                  type: 'scene',
                  text: 'Ir para Sala 3',
                  sceneId: 'sala3',
                },
              ],
            },
            sala2: {
              title: 'Sala 2',
              type: 'equirectangular',
              panorama: '/assets/imagem2.jpg',
              hotSpots: [
                {
                  pitch: 0,
                  yaw: -171,
                  type: 'scene',
                  text: 'Voltar para Sala 1',
                  sceneId: 'sala1',
                },
              ],
            },
            sala3: {
              title: 'Sala 3',
              type: 'equirectangular',
              panorama: '/assets/imagem3.jpg',
              hotSpots: [
                {
                  pitch: 0,
                  yaw: -29,
                  type: 'scene',
                  text: 'Voltar para Sala 1',
                  sceneId: 'sala1',
                },
              ],
            },
          },
        });
      }
    };

    loadPannellum();

    return () => {
      
    };
  }, []);

  return (
    <section className="w-full py-12 bg-muted/50 flex flex-col items-center">
      <div className="container px-4 md:px-6 mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Tour Virtual 360°
        </h2>
        <p className="mt-4 text-muted-foreground">
          Explore as salas do nosso museu sem sair de casa.
        </p>
      </div>
      <div
        ref={viewerRef}
        className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden border shadow-lg bg-black"
        style={{ height: '500px' }}
      />
    </section>
  );
}
