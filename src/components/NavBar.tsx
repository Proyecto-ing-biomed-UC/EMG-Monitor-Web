// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"; // Usando shadcn y tailwind
import { useAuth } from '../context/AuthContext';
import LogoBordeBlancoCiervo from '../assets/logo_borde_blanco_ciervo.png';
const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Maneja la redirección y el cierre de sesión
  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout(); // Cierra sesión
    } else {
      navigate('/login'); // Redirige a inicio de sesión
    }
  };

  return (
    <nav className="bg-zinc-900 text-teal-400 shadow-md fixed w-full z-10 top-0 left-0">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo y Nombre del Equipo */}
        <Link to="/" className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition-colors duration-300">
          <img src={LogoBordeBlancoCiervo} alt="Logo de Ciervo" className="h-8 w-8 inline-block " /> 
          <p className="inline-block ml-2">Ciervo</p>
        </Link>
        
        {/* Secciones del Menú */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-teal-300 transition-colors duration-300">Home</Link>
          <Link to="/data-capture" className="hover:text-teal-300 transition-colors duration-300">Data Capture</Link>
          <Link to="/dashboard" className="hover:text-teal-300 transition-colors duration-300">Dashboard</Link>
          <Link to="/about" className="hover:text-teal-300 transition-colors duration-300">About</Link>
          <Link to="/contact" className="hover:text-teal-300 transition-colors duration-300">Contact</Link>
        </div>

        {/* Botón de Iniciar/Cerrar Sesión */}
        <Button onClick={handleAuthAction} className="bg-teal-500 hover:bg-teal-600 text-zinc-900 font-bold py-2 px-4 rounded-md transition-colors duration-200">
          {isAuthenticated ? 'Log Out' : 'Iniciar Sesión'}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
