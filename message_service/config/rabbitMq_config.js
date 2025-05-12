import amqplib from "amqplib";

let connection = null;
let channel = null;

const EXCHANGE_NAME = "social_media";

export const getconnection = async () => {
  try {
    connection = await amqplib.connect(process.env.RABBITMQ_URL);

    if (connection) {
      channel = await connection.createChannel();
      await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });
    }

    console.log("rabbitmq connected");
    return channel;
  } catch (error) {
    console.log("rabbitmq error", error);
  }
};

export const publichEvent = async (routingKey, message) => {
  if (!channel) {
    await getconnection();
  }

  channel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message))
  );
  console.log("messge send to the queue from post service");
};

export const consumeEvent = async (routingKey) => {
  if (!channel) {
    await getconnection();
  }

  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content.toString());
    console.log(data);
    channel.ack(msg);
  });
};
