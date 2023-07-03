const amqp = require('amqplib/callback_api');

const options = {
  clientProperties:
  {
    connection_name: 'producer-service'
  }
};

amqp.connect('amqp://michael:michael@192.168.100.134', options, (error, connection) => {
  if (error) {
    throw error;
  }

  connection.createChannel((connErr, channel) => {
    if (connErr) {
      throw connErr;
    }

    channel.assertQueue('Monitor', {
      durable: true
    });

    const fs = require('fs');

    // Ruta al archivo que deseas leer
    const rutaArchivo = 'C:/xampp/htdocs/Programacion/pasar.json';

    // Función para leer el archivo
    fs.readFile(rutaArchivo, 'utf8', (error, contenido) => {
      if (error) {
        console.error('Error al leer el archivo:', error);
        return;
      }

      console.log('Contenido del archivo:', contenido);
      channel.sendToQueue('Monitor', Buffer.from(contenido), {
        persistent: true
      });
    });
    
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});