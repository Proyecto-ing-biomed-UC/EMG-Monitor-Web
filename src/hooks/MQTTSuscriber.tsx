import React, { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import DataCapture from '../components/DataCapture';  // Importa tu componente de captura de datos

// Configuración del broker MQTT
const BROKER_HOST = '100.90.57.1';
const BROKER_PORT = 8083;
const MQTT_TOPIC = 'data';

// Definir los canales según tu configuración
const EMG_CHANNELS = [1, 2, 3, 4, 5, 6, 7, 8];  // Canales para EMG
const ACC_CHANNELS = [9, 10, 11];               // Canales para ACC (Giroscopio)
const TIME_CHANNEL = 22;                        // Canal para el tiempo
const NUM_CHANNELS = EMG_CHANNELS.length + ACC_CHANNELS.length + 1; // +1 para el canal de tiempo

// Función para decodificar los datos binarios a flotantes de precisión media
const decodeMQTTMessage = (message: Buffer): (number | null)[] => {
  try {
    // Verificar si el tamaño del buffer es divisible por 2 (2 bytes por cada float16)
    if (message.length % 2 !== 0) {
      console.warn('Mensaje recibido con tamaño incorrecto:', message.length);
      return Array(NUM_CHANNELS).fill(null);
    }

    // Decodifica los datos como Uint16Array (2 bytes por número)
    const uint16Array = new Uint16Array(message.buffer, message.byteOffset, message.byteLength / 2);

    // Convertir cada Uint16 a Float32 (no soportado directamente en JS, así que convertimos a Float32)
    const dataArray: number[] = Array.from(uint16Array).map((value) => float16ToFloat32(value));

    // Verifica si se decodificaron suficientes canales
    if (dataArray.length >= NUM_CHANNELS) {
      return dataArray.map((value) => (isNaN(value) ? null : value)); // Reemplaza NaN con null
    } else {
      console.warn('Mensaje recibido incompleto o corrupto.');
      return Array(NUM_CHANNELS).fill(null); // Rellena con null si hay datos incompletos
    }
  } catch (error) {
    console.error('Error al decodificar el mensaje MQTT:', error);
    return Array(NUM_CHANNELS).fill(null); // Devuelve un array de null si ocurre un error
  }
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

const MQTTSuscriber: React.FC = () => {
  const [emgData, setEmgData] = useState<(number | null)[][]>([]);  // Estado para datos EMG
  const [accData, setAccData] = useState<(number | null)[][]>([]);  // Estado para datos de acelerómetro
  const [timeData, setTimeData] = useState<(number | null)[]>([]);  // Estado para datos de tiempo

  useEffect(() => {
    // Configuración del cliente MQTT
    const client: MqttClient = mqtt.connect(`ws://${BROKER_HOST}:${BROKER_PORT}/mqtt`, {
      reconnectPeriod: 1000,
      connectTimeout: 4000,
      clean: true,
    });

    // Manejo de la conexión al broker
    client.on('connect', () => {
      console.log('Conectado al broker MQTT');
      client.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          console.error('Error al suscribirse al topic:', err);
        } else {
          console.log(`Suscrito al topic: ${MQTT_TOPIC}`);
        }
      });
    });

    // Manejo de los mensajes recibidos
    client.on('message', (topic, message) => {
      if (topic === MQTT_TOPIC) {
        console.log(`Mensaje recibido en ${topic}`);
        const decodedData = decodeMQTTMessage(message); // Decodifica el mensaje
        console.log('Datos decodificados:', decodedData);

        // Separar los datos por tipo de canal
        const emgValues = EMG_CHANNELS.map((channelIndex) => decodedData[channelIndex - 1]); // Ajusta índices
        const accValues = ACC_CHANNELS.map((channelIndex) => decodedData[channelIndex - 1]); // Ajusta índices
        const timeValue = decodedData[TIME_CHANNEL - 1]; // Ajusta índice para el canal de tiempo

        // Actualizar los estados con los datos separados
        setEmgData((prevData) => [...prevData, emgValues]);
        setAccData((prevData) => [...prevData, accValues]);
        setTimeData((prevData) => [...prevData, timeValue]);

        // Limitar el tamaño de los datos para evitar un consumo excesivo de memoria
        if (emgData.length > 100) {
          setEmgData((prevData) => prevData.slice(1));
          setAccData((prevData) => prevData.slice(1));
          setTimeData((prevData) => prevData.slice(1));
        }
      }
    });

    // Manejo de la desconexión
    client.on('close', () => {
      console.log('Conexión cerrada con el broker MQTT');
    });

    // Manejo de errores
    client.on('error', (error) => {
      console.error('Error de conexión con MQTT:', error);
      client.end(); // Cierra la conexión en caso de error
    });

    // Manejo de la reconexión
    client.on('reconnect', () => {
      console.log('Intentando reconectar al broker MQTT...');
    });

    // Limpiar la conexión al desmontar el componente
    return () => {
      if (client) {
        client.end(true, () => {
          console.log('Desconectado del broker MQTT');
        });
      }
    };
  }, [emgData, accData, timeData]);

  return (
    <div>
      <h2>Conectando a MQTT Broker...</h2>
      {/* Renderiza el componente DataCapture con los datos recibidos */}
      <DataCapture emgData={emgData} accData={accData} timeData={timeData} />
    </div>
  );
};

export default MQTTSuscriber;
