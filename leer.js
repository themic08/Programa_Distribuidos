const amqp = require('amqplib/callback_api');

const options = {
    clientProperties:
    {
        connection_name: 'producer-service'
    }
};

amqp.connect('amqp://michael:michael@192.168.100.134', options, (error, connection) => {
    if (error) {
        throw err;
    }

    connection.createChannel((connErr, channel) => {
        if (connErr) {
            throw connErr;
        }

        channel.assertQueue('Monitor', { durable: true });

        channel.prefetch(100);

        channel.consume('Monitor', (msg) => {
            console.log(msg.content.toString());

            setTimeout(() => {
                channel.ack(msg);
                connection.close();
                process.exit(0);
            }, 500);
        });
    });
});