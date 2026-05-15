'use client';

import '@google/model-viewer';

const SUPABASE_CDN_URL =
  'https://bpilpivecdbczmkkfdzo.supabase.co/storage/v1/object/public/modelos';

export function ModelSupabase() {
  return (
    <section className="w-full py-12 bg-muted/50 flex flex-col items-center">
      <div className="container px-4 md:px-6 mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Modelo 3D
        </h2>

        <p className="mt-4 text-muted-foreground">
          Explore o modelo interativo em 3D.
        </p>
      </div>

      <div className="w-full max-w-5xl rounded-xl overflow-hidden border shadow-lg bg-white">
        <model-viewer
          src={`${SUPABASE_CDN_URL}/`}
          alt="Modelo 3D"
          auto-rotate
          camera-controls
          ar
          ar-modes="webxr scene-viewer quick-look"
          shadow-intensity="1"
          style={{
            width: '100%',
            height: '500px',
            backgroundColor: '#ffffff',
          }}
        />
      </div>
    </section>
  );
}
