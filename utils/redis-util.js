// Redis를 위한 유틸 함수 작성
// Redis에 Refresh Token을 저장할 것이기 때문에, 미리 Redis를 셋팅

const redis = require("redis");
require("dotenv").config();

// Rdeis 클래스 선언
class RedisClientRepository {
  constructor() {
    this.redisClient = redis.createClient({
      url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
      legacyMode: true,
    });
    this.redisConnected = false;
  }

  initialize = async () => {
    this.redisClient.on("connect", () => {
      this.redisConnected = true;
      console.info("Redis connected!");
    });
    this.redisClient.on("error", (err) => {
      console.error("Redis Client Error", err);
    });
    if (!this.redisConnected) this.redisClient.connect().then(); // redis v4 연결 (비동기)
  };

  setData = async (key, value) => {
    await this.initialize();
    await this.redisClient.v4.set(key, value);
    this.redisClient.quit(); // Redis 연결 종료
  };

  getData = async (key) => {
    await this.initialize();
    const getDatas = await this.redisClient.v4.get(key);
    this.redisClient.quit(); // Redis 연결 종료
    return getDatas;
  };

  delData = async (key) => {
    await this.initialize();
    await this.redisClient.v4.del(key);
    this.redisClient.quit(); // Redis 연결 종료
  };
}

module.exports = RedisClientRepository;
