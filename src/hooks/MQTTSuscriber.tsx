import React, { useEffect } from 'react';
import mqtt from 'mqtt';

const BROKER_HOST = '100.90.57.1';
const BROKER_PORT = 8083;

const MqttSuscriber: React.FC = () => {
  useEffect(() => {
    // Configuración de opciones para manejar reconexiones y otros parámetros
    const client = mqtt.connect(`ws://${BROKER_HOST}:${BROKER_PORT}/mqtt`, {
      reconnectPeriod: 1000, // Intenta reconectar cada 1000 ms
      connectTimeout: 4000,  // Tiempo de espera para la conexión (ms)
      clean: true,           // Sesión limpia para evitar mensajes retenidos
    });

    // Al conectarse al broker
    client.on('connect', () => {
      console.log('Conectado al broker MQTT');
      
      // Suscribirse a un topic
      client.subscribe('data', (err) => {
        if (err) {
          console.error('Error al suscribirse al topic:', err);
        } else {
          console.log('Suscrito al topic correctamente');
        }
      });
    });

    // Al recibir un mensaje
    client.on('message', (topic, message) => {
      console.log(`Mensaje recibido en ${topic}: ${message.toString()}`);
      // Manejar el mensaje recibido aquí
    });

    // Manejar la desconexión del broker
    client.on('close', () => {
      console.log('Conexión cerrada con el broker MQTT');
    });

    // Manejar errores
    client.on('error', (error) => {
      console.error('Error de conexión con MQTT:', error);
      client.end(); // Cierra la conexión en caso de error para evitar bucles
    });

    // Manejar la reconexión
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
  }, []);

  return <div>Conectando a MQTT Broker...</div>;
};

export default MqttSuscriber;
