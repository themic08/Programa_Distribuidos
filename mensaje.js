const amqp = require('amqplib');

// Configuración de RabbitMQ
const rabbitmqUrl = 'amqp://michael:michael@192.168.100.134:15672';
const exchangeName = 'myExchange';
const routingKey = 'myQueue';

// Mensaje a enviar
const message = 'Hola, RabbitMQ!';

// Conectarse a RabbitMQ y enviar el mensaje
amqp.connect(rabbitmqUrl)
  .then(connection => connection.createChannel())
  .then(channel => {
    // Declarar el intercambio
    channel.assertExchange(exchangeName, 'direct', { durable: false });

    // Publicar el mensaje en el intercambio
    channel.publish(exchangeName, routingKey, Buffer.from(message));

    console.log('Mensaje enviado correctamente a RabbitMQ');
    process.exit(0); // Salir del programa después de enviar el mensaje
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1); // Salir del programa con un código de error en caso de fallo
  });
