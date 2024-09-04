// src/components/DataChart.tsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataChartProps {
  data: any[];
  selectedChannels: Record<string, boolean>;
  channelNames: Record<string, string>;
}

const DataChart: React.FC<DataChartProps> = ({ data, selectedChannels, channelNames }) => {
  const [yMin, setYMin] = useState<number>(-100);  // Valor mínimo del eje Y
  const [yMax, setYMax] = useState<number>(100);   // Valor máximo del eje Y

  // Estado para almacenar colores fijos para cada canal
  const [channelColors, setChannelColors] = useState<Record<string, string>>({});

  // Asigna colores fijos a cada canal al montar el componente
  useEffect(() => {
    const colors: Record<string, string> = {
      channel_1: '#FF0000',   // Rojo
      channel_2: '#00FF00',   // Verde
      channel_3: '#0000FF',   // Azul
      channel_4: '#FF00FF',   // Magenta
      channel_5: '#00FFFF',   // Cian
      channel_6: '#FFFF00',   // Amarillo
      channel_7: '#800080',   // Púrpura
      channel_8: '#FFA500',   // Naranja
      channel_9: '#8B4513',   // Marrón
      channel_10: '#4682B4',  // Azul Acero
      channel_11: '#2E8B57',  // Verde Mar
      channel_12: '#DC143C',  // Carmesí
    };

    setChannelColors(colors);
  }, []);

  const handleYMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYMin(Number(e.target.value));
  };

  const handleYMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYMax(Number(e.target.value));
  };

  return (
    <div className="w-full h-96">
      {/* Controles para ajustar el rango del eje Y */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="text-white mr-2">Y Min:</label>
          <input
            type="number"
            value={yMin}
            onChange={handleYMinChange}
            className="w-20 p-1 rounded bg-zinc-700 text-white border border-teal-400"
          />
        </div>
        <div>
          <label className="text-white mr-2">Y Max:</label>
          <input
            type="number"
            value={yMax}
            onChange={handleYMaxChange}
            className="w-20 p-1 rounded bg-zinc-700 text-white border border-teal-400"
          />
        </div>
      </div>

      {/* Gráfico de líneas */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="relativeTime"  // Usa el tiempo relativo para el eje X
            tickFormatter={(value) => `${value} s`} // Muestra el tiempo en segundos
            stroke="#fff"   // Color de los valores del eje X
          />
          <YAxis
            domain={[yMin, yMax]}  // Rango del eje Y
            tickFormatter={(value) => value.toString()} // Muestra los valores del eje Y
            stroke="#fff"   // Color de los valores del eje Y
          />
          <Tooltip />
          <Legend />
          {Object.keys(selectedChannels).map((channel, index) =>
            selectedChannels[channel] ? (
              <Line
                key={channel}
                type="monotone"
                dataKey={channel}
                stroke={channelColors[channel]}  // Usa el color fijo para cada canal
                name={channelNames[channel]}  // Nombre del canal en la leyenda
              />
            ) : null,
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataChart;

