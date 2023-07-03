const amqp = require('amqplib/callback_api');
const mysql = require('mysql2/promise');

const options = {
  clientProperties: {
    connection_name: 'producer-service'
  }
};

// Configuración de la conexión a MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'basedatos1',
  port:3306,
};

amqp.connect('amqp://michael:michael@192.168.100.134', options, (error, connection) => {
  if (error) {
    throw error;
  }

  connection.createChannel((connErr, channel) => {
    if (connErr) {
      throw connErr;
    }

    channel.assertQueue('Monitor', { durable: true });

    channel.prefetch(100);

    // Crear el pool de conexiones para MySQL
    const pool = mysql.createPool(dbConfig);

    channel.consume('Monitor', (msg) => {
      valor = msg.content.toString().substring(0, msg.content.toString().length - 1);
       valor= `[${valor}]`;

    console.log(valor);
      const data = JSON.parse(valor);      

      if (Array.isArray(data)) {
        // Si data es una matriz, recorrer cada objeto JSON
        data.forEach((item) => {
          pool.execute('INSERT INTO datos (id, nombre,nacionalidad,cedula, direccion,telefono, correo) VALUES (?, ?,?, ?,?, ?,?)', [item.id, item.Nombre, item.Nacionalidad, item.Cedula, item.Direccion, item.Telefono, item.Correo])
            .then(([result]) => {
              console.log('Datos guardados en MySQL:', result);
            })
            .catch((error) => {
              console.error('Error al guardar datos en MySQL:', error);
            });
        });
      } else {
        // Si data es un objeto JSON individual
        pool.execute('INSERT INTO datos (id, nombre) VALUES (?, ?)', [data.id, data.Nombre])
          .then(([result]) => {
            console.log('Datos guardados en MySQL:', result);
          })
          .catch((error) => {
            console.error('Error al guardar datos en MySQL:', error);
          });
      }
      // Asegurarse de enviar el acuse de recibo (acknowledgement) al servidor RabbitMQ
      channel.ack(msg);
    });
  });
});
