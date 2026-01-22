import { env } from "@/env";

export const api = (path: string, init?: RequestInit) => {
  const baseURL = env.NEXT_PUBLIC_API_URL;
  const url = new URL(path, baseURL);

  return fetch(url, init);
};
