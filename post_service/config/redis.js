import { createClient } from 'redis';

export const client = createClient({
    username: 'default',
    password: '8KXsXD6gLeknbiw4RvB4XODkKsWRU21h',
    socket: {
        host: 'redis-14257.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 14257
    }
});

client.on('error', err => console.log('Redis Client Error', err));

export const connectRedis = async () => {
    if (!client.isOpen) {
        await client.connect();
        console.log('✅ Redis connected');
    }
};