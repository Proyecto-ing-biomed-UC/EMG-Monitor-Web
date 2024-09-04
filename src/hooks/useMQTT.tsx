// src/hooks/useMQTT.ts
import { useState, useEffect } from 'react';
import mqtt, { MqttClient } from 'mqtt';

interface MQTTData {
  [key: string]: number | string;
}

const useMQTT = () => {
  const [data, setData] = useState<MQTTData[]>([]); // Datos de EMG y giroscopio procesados para mostrar en el gráfico
  const [isConnected, setIsConnected] = useState(false); // Estado de conexión MQTT
  const [buffer, setBuffer] = useState<MQTTData[]>([]); // Buffer para almacenar los datos entrantes

  useEffect(() => {
    const brokerHost = import.meta.env.VITE_BROKER_HOST || 'ws://localhost:9001';
    const brokerTopic = import.meta.env.VITE_MQTT_TOPIC || 'data';

    const client: MqttClient = mqtt.connect(brokerHost);

    client.on('connect', () => {
      console.log('Conectado al broker MQTT');
      setIsConnected(true);
      client.subscribe(brokerTopic, (err) => {
        if (err) {
          console.error('Error al suscribirse al tópico MQTT:', err);
        } else {
          console.log(`Suscrito al tópico: ${brokerTopic}`);
        }
      });
    });

    client.on('message', (topic, message) => {
      try {
        const dataArray = message.toString().split(',').map(Number);
        const dataObject: MQTTData = {
          channel_1: dataArray[0],
          channel_2: dataArray[1],
          channel_3: dataArray[2],
          channel_4: dataArray[3],
          channel_5: dataArray[4],
          channel_6: dataArray[5],
          channel_7: dataArray[6],
          channel_8: dataArray[7],
          channel_9: dataArray[8],
          channel_10: dataArray[9],  // Giroscopio X
          channel_11: dataArray[10], // Giroscopio Y
          channel_12: dataArray[11], // Giroscopio Z
          time: dataArray[12],       // Tiempo
        };

        // Acumula datos en el buffer
        setBuffer((prevBuffer) => [...prevBuffer, dataObject]);
      } catch (error) {
        console.error('Error al procesar los datos MQTT:', error);
      }
    });

    client.on('close', () => {
      console.log('Desconectado del broker MQTT');
      setIsConnected(false);
    });

    // Limpiar la conexión al desmontar el componente
    return () => {
      client.end();
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (buffer.length > 0) {
        // Toma 5 datos aleatorios del buffer o calcula el promedio
        const sampledData = sampleOrAverageData(buffer, 5);
        setData((prevData) => [...prevData, sampledData]);
        setBuffer([]); // Limpiar el buffer después de procesar los datos
      }
    }, 200); // Intervalo de 200 ms para actualizar 5 datos por segundo

    return () => clearInterval(intervalId);
  }, [buffer]);

  const sampleOrAverageData = (buffer: MQTTData[], sampleSize: number): MQTTData => {
    if (buffer.length <= sampleSize) {
      return buffer.reduce((acc, cur, idx) => {
        if (idx === 0) return cur;
        Object.keys(acc).forEach((key) => {
          acc[key] = ((Number(acc[key]) + Number(cur[key])) / 2).toFixed(2); // Calcular promedio
        });
        return acc;
      });
    } else {
      const sampledBuffer = buffer.sort(() => 0.5 - Math.random()).slice(0, sampleSize); // Seleccionar aleatoriamente
      return sampledBuffer.reduce((acc, cur, idx) => {
        if (idx === 0) return cur;
        Object.keys(acc).forEach((key) => {
          acc[key] = ((Number(acc[key]) + Number(cur[key])) / 2).toFixed(2); // Calcular promedio
        });
        return acc;
      });
    }
  };

  return { data, isConnected };
};

export default useMQTT;
