// pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import LogoBordeBlancoCiervo from '../assets/logo_borde_blanco_ciervo.png';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-500 to-zinc-900 text-white">
    
      <img src={LogoBordeBlancoCiervo} alt="Bioradio" className="w-32 h-32" />
      <h1 className="text-5xl font-bold">Bioradio versión Ciervo</h1>
      <p className="mt-4 text-xl">Una solución para un futuro mejor.</p>
      <Link to="/about" className="mt-8 px-6 py-3 bg-teal-600 rounded text-white hover:bg-teal-700 transition">
        Conoce más acerca del equipo
      </Link>
    </div>
  );
};

export default Home;
