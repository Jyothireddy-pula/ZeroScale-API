// @ts-nocheck
import Redis from 'redis';

let redisClient: any = null;

export const connectRedis = async (): Promise<any> => {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  redisClient = Redis.createClient({
    url: redisUrl,
    socket: {
      connectTimeout: 5000,
    },
  });

  redisClient.on('error', (err: Error) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Redis Client Connected');
  });

  await redisClient.connect();
  return redisClient;
};

export const getCache = async (key: string): Promise<string | null> => {
  try {
    const client = await connectRedis();
    return await client.get(key);
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const setCache = async (
  key: string,
  value: string,
  ttl: number = 300
): Promise<void> => {
  try {
    const client = await connectRedis();
    await client.setEx(key, ttl, value);
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    const client = await connectRedis();
    await client.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
};

export const invalidatePattern = async (pattern: string): Promise<void> => {
  try {
    const client = await connectRedis();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error('Cache pattern delete error:', error);
  }
};
