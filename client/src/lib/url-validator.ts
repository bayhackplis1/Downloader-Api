export interface ValidationResult {
  isValid: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
  platform?: 'tiktok' | 'youtube' | 'unknown';
}

export function validateTikTokUrl(url: string): ValidationResult {
  if (!url || url.trim() === '') {
    return {
      isValid: false,
      message: 'Please enter a URL',
      type: 'error',
      platform: 'unknown'
    };
  }

  const trimmedUrl = url.trim();
  
  const tiktokPatterns = [
    /^https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com\/.+/i,
    /^https?:\/\/m\.tiktok\.com\/.+/i,
  ];

  const isValidTikTok = tiktokPatterns.some(pattern => pattern.test(trimmedUrl));

  if (!isValidTikTok) {
    return {
      isValid: false,
      message: 'Invalid TikTok URL format',
      type: 'error',
      platform: 'unknown'
    };
  }

  if (trimmedUrl.includes('/music/')) {
    return {
      isValid: true,
      message: 'Audio track detected',
      type: 'warning',
      platform: 'tiktok'
    };
  }

  if (trimmedUrl.includes('/@')) {
    return {
      isValid: true,
      message: 'Valid TikTok video URL',
      type: 'success',
      platform: 'tiktok'
    };
  }

  return {
    isValid: true,
    message: 'Valid TikTok URL',
    type: 'success',
    platform: 'tiktok'
  };
}

export function validateYouTubeUrl(url: string): ValidationResult {
  if (!url || url.trim() === '') {
    return {
      isValid: false,
      message: 'Please enter a URL',
      type: 'error',
      platform: 'unknown'
    };
  }

  const trimmedUrl = url.trim();
  
  const youtubePatterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}/i,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]{11}/i,
    /^https?:\/\/youtu\.be\/[\w-]{11}/i,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]{11}/i,
    /^https?:\/\/(www\.)?youtube-nocookie\.com\/embed\/[\w-]{11}/i,
    /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]{11}/i,
    /^https?:\/\/m\.youtube\.com\/watch\?v=[\w-]{11}/i,
  ];

  const isValidYouTube = youtubePatterns.some(pattern => pattern.test(trimmedUrl));

  if (!isValidYouTube) {
    return {
      isValid: false,
      message: 'Invalid YouTube URL format',
      type: 'error',
      platform: 'unknown'
    };
  }

  if (trimmedUrl.includes('/shorts/')) {
    return {
      isValid: true,
      message: 'YouTube Shorts detected',
      type: 'success',
      platform: 'youtube'
    };
  }

  return {
    isValid: true,
    message: 'Valid YouTube video URL',
    type: 'success',
    platform: 'youtube'
  };
}

export function validateMediaUrl(url: string): ValidationResult {
  if (!url || url.trim() === '') {
    return {
      isValid: false,
      message: 'Please enter a URL',
      type: 'error',
      platform: 'unknown'
    };
  }

  const trimmedUrl = url.trim();
  
  const tiktokPatterns = [
    /^https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com\/.+/i,
    /^https?:\/\/m\.tiktok\.com\/.+/i,
  ];

  const youtubePatterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}/i,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]{11}/i,
    /^https?:\/\/youtu\.be\/[\w-]{11}/i,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]{11}/i,
    /^https?:\/\/(www\.)?youtube-nocookie\.com\/embed\/[\w-]{11}/i,
    /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]{11}/i,
    /^https?:\/\/m\.youtube\.com\/watch\?v=[\w-]{11}/i,
  ];

  const isTikTok = tiktokPatterns.some(pattern => pattern.test(trimmedUrl));
  const isYouTube = youtubePatterns.some(pattern => pattern.test(trimmedUrl));

  if (isTikTok) {
    if (trimmedUrl.includes('/music/')) {
      return {
        isValid: true,
        message: 'TikTok audio track detected',
        type: 'warning',
        platform: 'tiktok'
      };
    }
    return {
      isValid: true,
      message: 'Valid TikTok video URL',
      type: 'success',
      platform: 'tiktok'
    };
  }

  if (isYouTube) {
    if (trimmedUrl.includes('/shorts/')) {
      return {
        isValid: true,
        message: 'YouTube Shorts detected',
        type: 'success',
        platform: 'youtube'
      };
    }
    return {
      isValid: true,
      message: 'Valid YouTube video URL',
      type: 'success',
      platform: 'youtube'
    };
  }

  return {
    isValid: false,
    message: 'Please enter a valid TikTok or YouTube URL',
    type: 'error',
    platform: 'unknown'
  };
}

export function detectPlatform(url: string): 'tiktok' | 'youtube' | 'unknown' {
  if (!url) return 'unknown';
  
  const trimmedUrl = url.trim().toLowerCase();
  
  if (trimmedUrl.includes('tiktok.com')) {
    return 'tiktok';
  }
  
  if (trimmedUrl.includes('youtube.com') || trimmedUrl.includes('youtu.be') || trimmedUrl.includes('youtube-nocookie.com')) {
    return 'youtube';
  }
  
  return 'unknown';
}
