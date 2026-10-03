import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCredits(userId: string): Promise<number> {
  const credits = await redis.get<number>(`credits:${userId}`);
  return credits ?? 0;
}

export async function addCredits(userId: string, amount: number): Promise<number> {
  const newTotal = await redis.incrby(`credits:${userId}`, amount);
  return newTotal;
}

export async function useCredit(userId: string): Promise<boolean> {
  const current = await getCredits(userId);
  if (current < 1) return false;
  await redis.decr(`credits:${userId}`);
  return true;
}
