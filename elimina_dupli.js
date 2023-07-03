const amqp = require('amqplib');

async function conectarRabbit() {
  try {
    // Conexión al servidor RabbitMQ
    const conexion = await amqp.connect('amqp://localhost');
    const canal = await conexion.createChannel();

    // Declaración de la cola
    const nombreCola = 'Monitor';
    await canal.assertQueue(nombreCola, { durable: false });

    console.log('Conexión a RabbitMQ establecida. Esperando mensajes...');

    // Almacenar IDs de mensajes procesados
    const mensajesProcesados = new Set();

    // Consumir mensajes de la cola
    canal.consume(nombreCola, (mensaje) => {
      const contenido = mensaje.content.toString();
      const idMensaje = mensaje.properties.id;

      // Verificar si el mensaje ya fue procesado
      if (mensajesProcesados.has(idMensaje)) {
        console.log(`Mensaje duplicado recibido, descartando: ${contenido}`);
        canal.ack(mensaje);
        return;
      }

      console.log(`Mensaje recibido: ${contenido}`);

      // Hacer algo con el mensaje recibido

      // Agregar el ID del mensaje a los mensajes procesados
      mensajesProcesados.add(idMensaje);

      // Confirmar recepción del mensaje
      canal.ack(mensaje);
    });
  } catch (error) {
    console.error('Error al conectar a RabbitMQ:', error);
  }
}

// Conectar al servidor RabbitMQ
conectarRabbit();
