import { Card, CardContent } from "@/components/ui/card";
import { DownloadForm } from "@/components/download-form";
import { VideoPreview } from "@/components/video-preview";
import { DownloadHistory } from "@/components/download-history";
import { StatisticsDashboard } from "@/components/statistics-dashboard";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { AdvancedAnalytics } from "@/components/advanced-analytics";
import { FavoritesPanel } from "@/components/favorites-panel";
import { useState } from "react";
import { SiTiktok, SiYoutube } from "react-icons/si";

export interface TikTokMetadata {
  duration: string;
  videoSize: string;
  audioSize: string;
  resolution: string;
  format: string;
  codec: string;
  fps: number;
  bitrate: string;
  width: number;
  height: number;
  audioCodec: string;
  audioChannels: number;
  audioSampleRate: string;
  availableResolutions?: string[];
}

export interface TikTokStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  favorites: number;
}

export interface TikTokCreator {
  username: string;
  nickname: string;
  avatar?: string;
  verified?: boolean;
  subscribers?: number;
}

export interface TikTokAudio {
  title: string;
  author: string;
}

export interface TikTokImage {
  url: string;
  width: number;
  height: number;
}

export interface TikTokData {
  platform?: 'tiktok' | 'youtube';
  contentType: "video" | "slideshow" | "audio" | "shorts";
  videoUrl: string;
  audioUrl: string;
  thumbnail: string;
  title: string;
  description: string;
  metadata: TikTokMetadata;
  creator: TikTokCreator;
  stats: TikTokStats;
  audio: TikTokAudio;
  hashtags: string[];
  uploadDate: string;
  videoId: string;
  images?: TikTokImage[];
  categories?: string[];
  tags?: string[];
  isLive?: boolean;
  ageRestricted?: boolean;
}

export default function Home() {
  const [previewData, setPreviewData] = useState<TikTokData | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-cyan-950/20 p-4 md:p-8">
      <KeyboardShortcuts />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-red-400 bg-clip-text text-transparent" data-testid="text-title">
            Video Downloader
          </h1>
          <p className="text-gray-400 flex items-center justify-center gap-3" data-testid="text-subtitle">
            <span className="flex items-center gap-1">
              <SiTiktok className="h-4 w-4 text-cyan-400" />
              TikTok
            </span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1">
              <SiYoutube className="h-4 w-4 text-red-500" />
              YouTube
            </span>
          </p>
          <p className="text-gray-500 text-sm">
            Download videos, images and music easily
          </p>
        </div>

        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm" data-testid="card-download-form">
          <CardContent className="pt-6">
            <DownloadForm onPreview={setPreviewData} />
          </CardContent>
        </Card>

        {previewData && (
          <Card className={`bg-black/40 backdrop-blur-sm ${previewData.platform === 'youtube' ? 'border-red-500/30' : 'border-purple-500/30'}`} data-testid="card-preview">
            <CardContent className="pt-6">
              <VideoPreview data={previewData} />
            </CardContent>
          </Card>
        )}

        <StatisticsDashboard />
        
        <AdvancedAnalytics />
        
        <FavoritesPanel />
        
        <DownloadHistory />
      </div>
    </div>
  );
}
