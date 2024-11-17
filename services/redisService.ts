import { Redis } from "@upstash/redis";

class RedisService {
  private redis: Redis;
  constructor() {
    // Initialize Redis instance
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  async get(key: string) {
    return this.redis.get(key);
  }
  async set(key: string, value: string, second: number) {
    return await this.redis.set(key, value, { ex: second });
  }
  async delete(key: string) {
    return this.redis.del(key);
  }
}
const redisService = new RedisService();
export default redisService;
