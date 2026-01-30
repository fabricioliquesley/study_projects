import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(durationInMs: number, showHours = false) {
  const hours = Math.floor(durationInMs / (60 * 60 * 1000));
  const minutes = Math.floor((durationInMs % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((durationInMs % (60 * 1000)) / 1000);

  const formatNumber = (number: number) => number.toString().padStart(2, "0");

  if (hours > 0 || showHours) {
    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
  }

  return `${formatNumber(minutes)}:${formatNumber(seconds)}`;
}

export function formatLevel(level: string) {
  return level.charAt(0) + level.slice(1).toLowerCase();
}

export function formatPrice(price: number) {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
