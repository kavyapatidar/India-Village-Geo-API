const memoryCache = new Map();

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url: url.replace(/\/$/, ""), token };
}

async function redisCommand(command) {
  const config = getRedisConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([command])
  });

  if (!response.ok) {
    throw new Error(`Redis command failed with status ${response.status}`);
  }

  const [payload] = await response.json();
  return payload?.result;
}

function getMemoryValue(key) {
  const hit = memoryCache.get(key);

  if (!hit) {
    return null;
  }

  if (hit.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }

  return hit.value;
}

async function getJson(key) {
  try {
    const redisValue = await redisCommand(["GET", key]);
    if (redisValue) {
      return JSON.parse(redisValue);
    }
  } catch (error) {
    console.error("Redis cache read failed:", error.message);
  }

  return getMemoryValue(key);
}

async function setJson(key, value, ttlSeconds = 300) {
  const serialized = JSON.stringify(value);

  try {
    await redisCommand(["SET", key, serialized, "EX", ttlSeconds]);
  } catch (error) {
    console.error("Redis cache write failed:", error.message);
  }

  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
}

async function rememberJson(key, ttlSeconds, loader) {
  const cached = await getJson(key);

  if (cached) {
    return { value: cached, cache: "HIT" };
  }

  const value = await loader();
  await setJson(key, value, ttlSeconds);

  return { value, cache: "MISS" };
}

async function incrementDailyCounter(key, ttlSeconds) {
  try {
    const result = await redisCommand(["INCR", key]);
    await redisCommand(["EXPIRE", key, ttlSeconds]);
    return Number(result);
  } catch (error) {
    console.error("Redis rate limit failed:", error.message);
  }

  const current = Number(getMemoryValue(key) || 0) + 1;
  memoryCache.set(key, {
    value: current,
    expiresAt: Date.now() + ttlSeconds * 1000
  });

  return current;
}

module.exports = {
  getJson,
  setJson,
  rememberJson,
  incrementDailyCounter
};
