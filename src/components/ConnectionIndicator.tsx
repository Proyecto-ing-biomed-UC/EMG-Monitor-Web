// src/components/ConnectionIndicator.tsx
import React from 'react';

interface ConnectionIndicatorProps {
  isConnected: boolean;
}

const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({ isConnected }) => {
  return (
    <div className="flex items-center space-x-2 mr-6">
      <div className={`h-4 w-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="text-white">{isConnected ? 'Conectado al Broker' : 'Desconectado del Broker'}</span>
    </div>
  );
};

export default ConnectionIndicator;
