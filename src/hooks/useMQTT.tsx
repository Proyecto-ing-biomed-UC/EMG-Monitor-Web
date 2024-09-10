import { useState, useEffect, useRef } from 'react';
import mqtt, { MqttClient } from 'mqtt';

// Interfaz para los datos procesados
interface MQTTData {
  [key: string]: number | null;
}

// Definir los canales según tu configuración
const EMG_CHANNELS = [1, 2, 3, 4, 5, 6, 7, 8];  // Canales para EMG
const ACC_CHANNELS = [9, 10, 11];               // Canales para ACC (Giroscopio)
const TIME_CHANNEL = 22;                        // Canal para el tiempo
const NUM_CHANNELS = EMG_CHANNELS.length + ACC_CHANNELS.length + 1; // +1 para el canal de tiempo

// Hook para manejar la conexión MQTT y la recepción de datos
const useMQTT = () => {
  const [data, setData] = useState<MQTTData[]>([]); // Datos de EMG y giroscopio procesados
  const [isConnected, setIsConnected] = useState(false); // Estado de conexión MQTT
  const latestDataRef = useRef<MQTTData | null>(null); // Referencia para almacenar el último dato recibido

  useEffect(() => {
    // Configuración del broker MQTT
    const brokerHost = import.meta.env.VITE_BROKER_HOST || 'ws://100.90.57.1:8083/mqtt';
    const brokerTopic = import.meta.env.VITE_MQTT_TOPIC || 'data';

    // Crear un cliente MQTT
    const client: MqttClient = mqtt.connect(brokerHost);

    // Función que maneja la conexión al broker MQTT
    const onConnect = () => {
      console.log('Conectado al broker MQTT');
      setIsConnected(true);
      client.subscribe(brokerTopic, (err) => {
        if (err) {
          console.error('Error al suscribirse al tópico MQTT:', err);
        } else {
          console.log(`Suscrito al tópico: ${brokerTopic}`);
        }
      });
    };

    // Función que maneja los mensajes recibidos del broker MQTT
    const onMessage = (topic: string, message: Buffer) => {
      try {
        // Convertir el mensaje de buffer binario a un array de números (float32)
        const dataArray = decodeMQTTMessage(message);

        if (dataArray.length >= NUM_CHANNELS) { // Asegurarse de que hay suficientes datos
          const dataObject: MQTTData = {
            channel_1: dataArray[EMG_CHANNELS[0] - 1] || null,
            channel_2: dataArray[EMG_CHANNELS[1] - 1] || null,
            channel_3: dataArray[EMG_CHANNELS[2] - 1] || null,
            channel_4: dataArray[EMG_CHANNELS[3] - 1] || null,
            channel_5: dataArray[EMG_CHANNELS[4] - 1] || null,
            channel_6: dataArray[EMG_CHANNELS[5] - 1] || null,
            channel_7: dataArray[EMG_CHANNELS[6] - 1] || null,
            channel_8: dataArray[EMG_CHANNELS[7] - 1] || null,
            channel_9: dataArray[ACC_CHANNELS[0] - 1] || null,  // Goniometro
            channel_10: dataArray[ACC_CHANNELS[1] - 1] || null, // Giroscopio X
            channel_11: dataArray[ACC_CHANNELS[2] - 1] || null, // Giroscopio Y
            time: Date.now(), // tiempo
            // time: dataArray[TIME_CHANNEL - 1] || null,          // Tiempo
          };

          // Guardar el último dato recibido en la referencia
          latestDataRef.current = dataObject;
        } else {
          console.warn('Datos incompletos recibidos:', dataArray);
        }

      } catch (error) {
        console.error('Error al procesar los datos MQTT:', error);
      }
    };

    // Configurar eventos de cliente MQTT
    client.on('connect', onConnect);
    client.on('message', onMessage);

    // Manejar desconexión del cliente MQTT
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
    // Intervalo para actualizar el estado de los datos cada 100 ms
    const intervalId = setInterval(() => {
      if (latestDataRef.current) {
        setData((prevData) => {
          const newData = [...prevData, latestDataRef.current!];
          if (newData.length > 100) {
            newData.shift(); // Limitar la cantidad de datos almacenados
          }
          return newData;
        });
        console.log('Datos mostrados cada 0,1 segundos:', latestDataRef.current);
      }
    }, 100); // Actualización cada 100 ms

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  // Función para decodificar el mensaje MQTT recibido (buffer binario a flotantes)
  const decodeMQTTMessage = (message: Buffer): number[] => {
    const uint16Array = new Uint16Array(message.buffer, message.byteOffset, message.byteLength / 2);
    const dataArray: number[] = Array.from(uint16Array).map((value) => float16ToFloat32(value));
    return dataArray;
  };

  // Función para convertir Uint16 a Float32 simulando la conversión de Float16
  const float16ToFloat32 = (value: number): number => {
    const s = (value & 0x8000) >> 15; // Signo
    const e = (value & 0x7c00) >> 10; // Exponente
    const f = value & 0x03ff;         // Mantisa

    if (e === 0) {
      // Número subnormal
      return (s ? -1 : 1) * 2 ** -14 * (f / 2 ** 10);
    } else if (e === 0x1f) {
      // Infinito o NaN
      return f ? NaN : (s ? -Infinity : Infinity);
    }

    // Número normal
    return (s ? -1 : 1) * 2 ** (e - 15) * (1 + f / 2 ** 10);
  };

  return { data, isConnected };
};

export default useMQTT;
