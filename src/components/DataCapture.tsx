// src/components/DataCapture.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import useMQTT from '../hooks/useMQTT';
import MQTTSuscriber from '../hooks/MQTTSuscriber';
import RecordingIndicator from './RecordingIndicator';
import ConnectionIndicator from './ConnectionIndicator';
import ChannelControls from './ChannelControls';
import DataChart from './DataChart';

interface DataCaptureProps {
  simulatedData?: any[]; // Prop opcional para datos simulados
}

const DataCapture: React.FC<DataCaptureProps> = ({ simulatedData }) => {
  const { data: mqttData, isConnected } = useMQTT(); // Hook personalizado para MQTT
  const [data, setData] = useState<any[]>([]); // Estado para datos de visualización
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null); // Estado para almacenar el tiempo de inicio
  const [selectedChannels, setSelectedChannels] = useState({
    channel_1: true,
    channel_2: true,
    channel_3: true,
    channel_4: true,
    channel_5: false,
    channel_6: false,
    channel_7: false,
    channel_8: false,
    channel_9: false,
    channel_10: false,
    channel_11: false,
    channel_12: false,
  });

  const [channelNames, setChannelNames] = useState({
    channel_1: 'Channel 1',
    channel_2: 'Channel 2',
    channel_3: 'Channel 3',
    channel_4: 'Channel 4',
    channel_5: 'Channel 5',
    channel_6: 'Channel 6',
    channel_7: 'Channel 7',
    channel_8: 'Channel 8',
    channel_9: 'Giroscopio X',
    channel_10: 'Giroscopio Y',
    channel_11: 'Giroscopio Z',
    time: 'Time',
  });

  useEffect(() => {
    if (isRecording && startTime !== null) {
      const updatedData = (simulatedData || mqttData).map((d) => ({
        ...d,
        relativeTime: ((d.time - startTime) / 1000).toFixed(2), // Calcula el tiempo relativo en segundos
      }));
      setData(updatedData);
    }
  }, [simulatedData, mqttData, isRecording, startTime]);

  const handleStartCapture = () => {
    setIsRecording(true);
    setStartTime(Date.now()); // Establece el tiempo de inicio cuando comienza la grabación
    console.log('Iniciar captura de datos');
  };

  const handleStopCapture = () => {
    setIsRecording(false);
    console.log('Pausar grabación de datos');
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-500 to-teal-600 p-6 mt-16">
      <div className="container mx-auto p-6 bg-zinc-800/90 rounded-lg shadow-xl backdrop-blur-sm w-full max-w-7xl">
        <h2 className="text-3xl font-bold mb-6 text-teal-400">CIERVO: Gráfico EMG</h2>

        {/* Indicadores de Estado */}
        <div className="flex flex-wrap items-center mb-6 space-y-4 lg:space-y-0 lg:space-x-6">
          <RecordingIndicator isRecording={isRecording} />
          <ConnectionIndicator isConnected={isConnected} />
        </div>

        {/* Controles de Captura de Datos */}
        <div className="flex flex-wrap space-x-4 mb-6">
          <Button onClick={handleStartCapture} className="bg-teal-500 hover:bg-teal-600 text-white">Iniciar Toma de Datos</Button>
          <Button onClick={handleStopCapture} className="bg-red-500 hover:bg-red-600 text-white">Pausar Grabación</Button>
        </div>

        {/* Controles de Canales */}
        <ChannelControls
          selectedChannels={selectedChannels}
          channelNames={channelNames}
          handleChannelToggle={handleChannelToggle}
          handleChannelNameChange={handleChannelNameChange}
        />

        {/* Gráficos de Canales */}
        <div className="mt-8">
          <DataChart
            data={data}
            selectedChannels={selectedChannels}
            channelNames={channelNames}
          />
        </div>
      </div>
    </div>
  );
};

export default DataCapture;
