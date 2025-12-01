import { z } from "zod";

export const validateTikTokUrl = z
  .string()
  .min(1, "URL is required")
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return parsed.hostname.includes("tiktok.com");
      } catch {
        return false;
      }
    },
    {
      message: "Please enter a valid TikTok URL",
    }
  );

export const validateYouTubeUrl = z
  .string()
  .min(1, "URL is required")
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return (
          parsed.hostname.includes("youtube.com") ||
          parsed.hostname.includes("youtu.be") ||
          parsed.hostname.includes("youtube-nocookie.com")
        );
      } catch {
        return false;
      }
    },
    {
      message: "Please enter a valid YouTube URL",
    }
  );

export const validateMediaUrl = z
  .string()
  .min(1, "URL is required")
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return (
          parsed.hostname.includes("tiktok.com") ||
          parsed.hostname.includes("youtube.com") ||
          parsed.hostname.includes("youtu.be") ||
          parsed.hostname.includes("youtube-nocookie.com")
        );
      } catch {
        return false;
      }
    },
    {
      message: "Please enter a valid TikTok or YouTube URL",
    }
  );

export type Platform = "tiktok" | "youtube" | "unknown";

export function detectPlatform(url: string): Platform {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("tiktok.com")) {
      return "tiktok";
    }
    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtu.be") ||
      parsed.hostname.includes("youtube-nocookie.com")
    ) {
      return "youtube";
    }
    return "unknown";
  } catch {
    return "unknown";
  }
}

export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:v=|\/)([0-9A-Za-z_-]{11})/,
    /youtu\.be\/([0-9A-Za-z_-]{11})/,
    /youtube\.com\/embed\/([0-9A-Za-z_-]{11})/,
    /youtube\.com\/shorts\/([0-9A-Za-z_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

export function isValidYouTubeId(id: string): boolean {
  return /^[0-9A-Za-z_-]{11}$/.test(id);
}
