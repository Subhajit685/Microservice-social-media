import amqplib from "amqplib";

let connection = null;
let channel = null;

const EXCHANGE_NAME = "social_media";

export const getconnection = async () => {
  try {
    connection = await amqplib.connect(process.env.RABBITMQ_URL);

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err);
    });

    connection.on("close", () => {
      console.warn("RabbitMQ connection closed. App should handle reconnection.");
      // Optionally trigger reconnection logic here
    });

    channel = await connection.createChannel();

    channel.on("error", (err) => {
      console.error("RabbitMQ channel error:", err);
    });

    channel.on("close", () => {
      console.warn("RabbitMQ channel closed.");
    });

    await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });

    console.log("RabbitMQ connected");
    return channel;
  } catch (error) {
    console.error("RabbitMQ connection failed:", error);
    // Optionally retry connection after a delay
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

export const consumeEvent = async (callback) => {
  if (!channel) {
    await getconnection();
  }

  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, "#");
  channel.consume(q.queue, (msg) => {
    const routingKey = msg.fields.routingKey; 
    const data = JSON.parse(msg.content.toString());
    console.log(routingKey);
    callback(routingKey, data)
    channel.ack(msg);
  });
};
