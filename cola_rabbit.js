const axios = require('axios');

// Configuración de RabbitMQ
const rabbitmqUrl = 'http://192.168.100.134:15672';
const username = 'michael';
const password = 'michael';
const virtualHost = '/';
const queueName = 'myQueue';

const checkQueue = async () => {
  const auth = {
    username,
    password
  };

  try {
    const response = await axios.get(`${rabbitmqUrl}/api/queues/${encodeURIComponent(virtualHost)}/${queueName}`, { auth });
    const queueData = response.data;

    if (queueData.messages > 0) {
      console.log(`La cola ${queueName} tiene mensajes pendientes`);
    } else {
      console.log(`La cola ${queueName} está vacía`);
    }
  } catch (error) {
    console.error('Error al verificar la cola:', error);
  }
};

// Llamar a la función para verificar la cola
checkQueue();
