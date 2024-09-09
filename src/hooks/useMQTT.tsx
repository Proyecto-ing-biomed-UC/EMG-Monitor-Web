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
    const brokerHost = import.meta.env.VITE_BROKER_HOST || 'ws://100.90.57.1:8083/mqtt';
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
        // Convertir el mensaje a un array de números
        const cleanedMessage = message
          .toString()
          .replace(/\[|\]/g, '') // Eliminar corchetes
          .replace(/\n/g, ' ')   // Reemplazar saltos de línea por espacios
          .trim();

        const dataArray = cleanedMessage.split(/\s+/).map((val) => parseFloat(val)); // Convertir a números

        // Asegúrate de que hay suficientes datos en el array para cada canal
        const dataObject: MQTTData = {};
        try {
          dataObject["channel_1"] = dataArray[0] || null;
          dataObject["channel_2"] = dataArray[1] || null;
          dataObject["channel_3"] = dataArray[2] || null;
          dataObject["channel_4"] = dataArray[3] || null;
          dataObject["channel_5"] = dataArray[4] || null;
          dataObject["channel_6"] = dataArray[5] || null;
          dataObject["channel_7"] = dataArray[6] || null;
          dataObject["channel_8"] = dataArray[7] || null;
          dataObject["channel_9"] = dataArray[8] || null;
          dataObject["channel_10"] = dataArray[9] || null;  // Giroscopio X
          dataObject["channel_11"] = dataArray[10] || null; // Giroscopio Y
          dataObject["channel_12"] = dataArray[11] || null; // Giroscopio Z
          dataObject["time_1"] = dataArray[12] || null;     // Tiempo
          dataObject["time_2"] = dataArray[13] || null;
          dataObject["time_3"] = dataArray[14] || null;
        } catch (e) {
          console.warn("Datos incompletos recibidos:", e, dataArray);
        }

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

  // Procesar los datos del buffer a intervalos regulares
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (buffer.length > 0) {
        // Toma 5 datos aleatorios del buffer o calcula el promedio
        const sampledData = sampleOrAverageData(buffer, 5);
        setData((prevData) => [...prevData, ...sampledData]); // Almacena los datos en el estado
        setBuffer([]); // Limpiar el buffer después de procesar los datos
      }
    }, 200); // Intervalo de 200 ms para actualizar 5 datos por segundo

    return () => clearInterval(intervalId);
  }, [buffer]);

  // Función para seleccionar aleatoriamente o promediar los datos
  const sampleOrAverageData = (buffer: MQTTData[], sampleSize: number): MQTTData[] => {
    if (buffer.length <= sampleSize) {
      return buffer.map((data) => ({ ...data })); // Devuelve los datos si son menos que el tamaño de la muestra
    } else {
      // Selecciona aleatoriamente una muestra o promedia los datos
      const sampledBuffer = buffer.sort(() => 0.5 - Math.random()).slice(0, sampleSize);
      const averagedData: MQTTData = {};

      Object.keys(sampledBuffer[0]).forEach((key) => {
        averagedData[key] = sampledBuffer
          .map((data) => Number(data[key]))
          .reduce((acc, val) => acc + val, 0) / sampledBuffer.length; // Promedia los valores
      });

      return [averagedData]; // Devuelve el promedio como un único elemento en el array
    }
  };

  return { data, isConnected };
};

export default useMQTT;
