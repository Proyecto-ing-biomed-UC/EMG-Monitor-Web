// src/components/DataCapture.tsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button"; // Si usas shadcn, reemplaza con tus propios botones
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // URL de tu backend

interface ChannelData {
  [key: string]: boolean; // Para gestionar la visibilidad de los canales
}

interface ChannelNames {
  [key: string]: string; // Para gestionar los nombres de los canales
}

const DataCapture = () => {
  const [data, setData] = useState<any[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<ChannelData>({
    channel_1: true,
    channel_2: true,
    channel_3: true,
    channel_4: true,
    channel_5: true,
    channel_6: true,
    channel_7: true,
    channel_8: true,
  });

  const [channelNames, setChannelNames] = useState<ChannelNames>({
    channel_1: 'Channel 1',
    channel_2: 'Channel 2',
    channel_3: 'Channel 3',
    channel_4: 'Channel 4',
    channel_5: 'Channel 5',
    channel_6: 'Channel 6',
    channel_7: 'Channel 7',
    channel_8: 'Channel 8',
  });

  useEffect(() => {
    socket.on('dataChannel', (newData) => {
      setData((prevData) => [...prevData, newData]);
    });

    return () => {
      socket.off('dataChannel');
    };
  }, []);

  const handleStartCapture = () => {
    socket.emit('startDataStream');
  };

  const handleStopCapture = () => {
    socket.emit('stopDataStream');
  };

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  const handleChannelNameChange = (channel: string, newName: string) => {
    setChannelNames((prev) => ({
      ...prev,
      [channel]: newName,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-teal-400">Gráficos de Activación Muscular en Tiempo Real</h2>

      {/* Controles de Captura de Datos */}
      <div className="flex space-x-4 mb-6">
        <Button onClick={handleStartCapture} className="bg-teal-500 hover:bg-teal-600 text-white">Iniciar Toma de Datos</Button>
        <Button onClick={handleStopCapture} className="bg-red-500 hover:bg-red-600 text-white">Pausar Grabación</Button>
      </div>

      {/* Casilleros para Seleccionar Canales */}
      <div className="flex flex-wrap space-x-4 mb-4">
        {Object.keys(selectedChannels).map((channel) => (
          <div key={channel} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedChannels[channel]}
              onChange={() => handleChannelToggle(channel)}
              className="form-checkbox h-5 w-5 text-teal-600"
            />
            <input
              type="text"
              value={channelNames[channel]}
              onChange={(e) => handleChannelNameChange(channel, e.target.value)}
              className="border-b-2 bg-transparent border-teal-400 text-green p-1 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Gráficos de Canales */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(selectedChannels).map((channel, index) =>
            selectedChannels[channel] ? (
              <Line
                key={channel}
                type="monotone"
                dataKey={channel}
                stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                name={channelNames[channel]}
              />
            ) : null,
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataCapture;
