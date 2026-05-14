'use client';

import 'pannellum/src/css/pannellum.css';
import { useEffect, useRef } from 'react';

const SUPABASE_CDN_URL =
  'https://bpilpivecdbczmkkfdzo.supabase.co/storage/v1/object/public/fotos-360';

export function Museum360() {
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    let viewer: any;

    const loadPannellum = async () => {
      await import('pannellum');

      const lib = (window as any).pannellum;

      if (lib && viewerRef.current) {
        viewer = lib.viewer(viewerRef.current, {
          default: {
            firstScene: 'imagem1',
            sceneFadeDuration: 1000,
            autoLoad: true,
          },

          scenes: {
            imagem1: {
              title: '',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/Imagem1.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: -2,
                  type: 'scene',
                  text: '',
                  sceneId: 'imagem2',
                },
              ],
            },

            imagem2: {
              title: '',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/Imagem2.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: 71,
                  type: 'scene',
                  text: 'Corredor de Salas',
                  sceneId: 'imagem3',
                },

                {
                  pitch: 0,
                  yaw: -72,
                  type: 'scene',
                  text: 'Corredor de salas',
                  sceneId: '',
                },
                {
                  pitch: 0,
                  yaw: -180,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem1',
                },
              ],
            },

            imagem3: {
              title: 'Corredor de salas',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/ImagemCorredor1.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: -175,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem2',
                },

                {
                  pitch: 0,
                  yaw: -5,
                  type: 'scene',
                  text: '',
                  sceneId: 'imagem4',
                },
              ],
            },

            imagem4: {
              title: '',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/ImagemPortaIndigena.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: 90,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem3',
                },

                {
                  pitch: 2,
                  yaw: 0,
                  type: 'scene',
                  text: 'Entrar na Sala Indígena',
                  sceneId: 'imagem5',
                },
              ],
            },

            imagem5: {
              title: 'Sala Indígena',
              type: 'equirectangular',
              panorama: `${SUPABASE_CDN_URL}/ImagemSalaIndigena.jpg`,

              hotSpots: [
                {
                  pitch: 0,
                  yaw: -180,
                  type: 'scene',
                  text: 'Voltar',
                  sceneId: 'imagem4',
                },
              ],
            },
          },
        });
      }
    };

    loadPannellum();

    return () => {
      if (viewer) {
        viewer.destroy();
      }
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
