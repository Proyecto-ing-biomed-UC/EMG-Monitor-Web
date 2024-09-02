// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/DashBoard';
import NotFound from '../pages/NotFound';
import PrivateRoute from './PrivateRoute'; // Importa el componente de ruta privada
import { useAuth } from '../context/AuthContext'; // Importa el hook de autenticación
import CiervoLogin from '../CiervoLogin';
import About from '../pages/About';
import DataCapture from '../components/DataCapture';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth(); // Verifica si el usuario está autenticado

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<CiervoLogin />} />
      <Route path="/about" element={<About />} />
      {/* Protege la ruta del Dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/data-capture" element={<DataCapture />} />
      {/* Ruta para manejar páginas no encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

