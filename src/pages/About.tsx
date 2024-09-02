// src/pages/About.tsx
import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-500 to-zinc-900 text-white px-4 py-8">
      <h1 className="text-5xl font-bold mb-4">Sobre Nosotros</h1>
      <p className="text-lg max-w-2xl text-center">
        Ciervo es un proyecto multidisciplinario enfocado en el desarrollo de una prótesis de pierna transfemoral para mejorar la calidad de la vida de las personas que tengan esta discapacidad
      </p>
    </div>
  );
};

export default About;
