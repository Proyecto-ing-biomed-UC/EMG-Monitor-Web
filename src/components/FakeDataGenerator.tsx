// src/components/FakeDataGenerator.tsx
import React, { useState, useEffect } from 'react';
import DataCapture from './DataCapture';

interface RandomData {
  channel_1: number;
  channel_2: number;
  channel_3: number;
  channel_4: number;
  channel_5: number;
  channel_6: number;
  channel_7: number;
  channel_8: number;
  channel_9: number;  // Giroscopio X
  channel_10: number; // Giroscopio Y
  channel_11: number; // Giroscopio Z
  time: number;       // Tiempo
}

const FakeDataGenerator: React.FC = () => {
  const [data, setData] = useState<RandomData[]>([]);  // Estado para almacenar datos aleatorios

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Genera datos aleatorios para los canales
      const randomData: RandomData = {
        channel_1: Math.random() * 100,
        channel_2: Math.random() * 100,
        channel_3: Math.random() * 100,
        channel_4: Math.random() * 100,
        channel_5: Math.random() * 100,
        channel_6: Math.random() * 100,
        channel_7: Math.random() * 100,
        channel_8: Math.random() * 100,
        channel_9: Math.random() * 100,   // Giroscopio X
        channel_10: Math.random() * 100,  // Giroscopio Y
        channel_11: Math.random() * 100,  // Giroscopio Z
        time: Date.now(),                 // Tiempo actual en milisegundos
      };

      // Actualiza el estado con los nuevos datos
      setData((prevData) => [...prevData, randomData]);

      // Limitar el tamaño de los datos para evitar un consumo excesivo de memoria
      if (data.length > 100) {
        setData((prevData) => prevData.slice(1));
      }
    }, 200);  // Genera nuevos datos cada 200 ms (5 veces por segundo)

    // Limpiar intervalo cuando se desmonta el componente
    return () => clearInterval(intervalId);
  }, [data]);

  return (
    <>
      {/* <h2 className="text-2xl font-bold mb-4 text-teal-400">Simulador de Datos Aleatorios de Canales</h2> */}
      {/* Renderiza el componente DataCapture con los datos simulados */}
    <DataCapture simulatedData={data} />
    </>
  );
};

export default FakeDataGenerator;
