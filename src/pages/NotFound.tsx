// pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Página no encontrada.</p>
        <Link to="/" className="text-teal-600 hover:underline">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
