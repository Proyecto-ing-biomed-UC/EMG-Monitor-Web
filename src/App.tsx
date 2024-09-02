// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'; // Importa el componente de rutas
import { AuthProvider } from './context/AuthContext'; // Importa el AuthProvider
import NavBar from './components/NavBar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <AppRoutes /> {/* Usa el componente de rutas aquí */}
      </Router>
    </AuthProvider>
  );
}

export default App;
