require("dotenv").config();

// Redis를 위한 유틸 함수 작성
// Redis에 Refresh Token을 저장할 것이기 때문에, 미리 Redis를 셋팅

// Rdeis 클래스 선언
class RedisClientRepository {
  constructor(redis) {
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
    if (!this.redisConnected) {
      this.redisClient.connect().then(); // redis v4 연결 (비동기)
    }
  };

  setData = async (key, value, EXPIRE_TIME) => {
    await this.initialize(); // 한번만 할 수있도록 수정 필요
    // ver.1
    // await this.redisClient.v4.set(key, value); // 키-값 저장가능, 자동소멸 불가능
    // ver.2
    // await this.redisClient.v4.set(key, value, "EX", 120); // 키-값 저장가능, expire time 안먹힘
    // ver.3
    await this.redisClient.v4.set(key, value, "keepttl"); // 키-값 저장 (옵션, 자동소멸 기능 추가)
    await this.redisClient.v4.expire(key, EXPIRE_TIME); // 저장된 키값에 소멸시간 정의
  };

  getData = async (key) => {
    await this.initialize();
    return await this.redisClient.v4.get(key);
    // this.redisClient.quit(); // Redis 연결 종료
  };

  delData = async (key) => {
    await this.initialize();
    await this.redisClient.v4.del(key);
    this.redisClient.quit(); // Redis 연결 종료
  };
}

module.exports = RedisClientRepository;
