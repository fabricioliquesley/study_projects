import { env } from "@/env";

export const api = (path: string, init?: RequestInit) => {
  const baseURL = env.NEXT_PUBLIC_API_BASE_URL;
  const url = new URL("/api".concat(path), baseURL);

  return fetch(url, init);
};
