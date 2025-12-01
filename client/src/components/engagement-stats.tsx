import { TikTokStats } from "@/pages/home";
import { TrendingUp, Percent, Award } from "lucide-react";

interface EngagementStatsProps {
  stats: TikTokStats;
  platform?: 'tiktok' | 'youtube';
}

export function EngagementStats({ stats, platform }: EngagementStatsProps) {
  const isYouTube = platform === 'youtube';
  const calculateEngagementRate = () => {
    if (stats.views === 0) return "0.00";
    const totalEngagements = stats.likes + stats.comments + stats.shares;
    return ((totalEngagements / stats.views) * 100).toFixed(2);
  };

  const getLikesRatio = () => {
    if (stats.views === 0) return "0.00";
    return ((stats.likes / stats.views) * 100).toFixed(2);
  };

  const getCommentsRatio = () => {
    if (stats.likes === 0) return "0.00";
    return ((stats.comments / stats.likes) * 100).toFixed(2);
  };

  const getEngagementLevel = () => {
    const engagementRate = parseFloat(calculateEngagementRate());
    if (engagementRate >= 10) return { label: "Viral", color: "text-pink-400", bg: "bg-pink-500/20", border: "border-pink-500/40" };
    if (engagementRate >= 5) return { label: "Excellent", color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/40" };
    if (engagementRate >= 2) return { label: "Good", color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/40" };
    return { label: "Average", color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/40" };
  };

  const level = getEngagementLevel();

  const borderColor = isYouTube ? 'border-red-500/30' : 'border-cyan-500/30';
  const textColor = isYouTube ? 'text-red-400' : 'text-cyan-400';
  const textColor300 = isYouTube ? 'text-red-300' : 'text-cyan-300';
  const textColor500 = isYouTube ? 'text-red-500/70' : 'text-cyan-500/70';
  const textColor400 = isYouTube ? 'text-red-400/60' : 'text-cyan-400/60';
  const gradientBg = isYouTube 
    ? 'from-red-500/10 via-orange-500/10 to-pink-500/10' 
    : 'from-cyan-500/10 via-purple-500/10 to-pink-500/10';

  return (
    <div className={`bg-gradient-to-r ${gradientBg} backdrop-blur-sm p-6 rounded-lg border ${borderColor} space-y-4`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className={`font-bold ${textColor300} text-lg flex items-center gap-2`}>
          <TrendingUp className="h-5 w-5" />
          Engagement Analytics
        </h3>
        <span className={`px-3 py-1 rounded-full ${level.bg} border ${level.border} ${level.color} text-xs font-bold uppercase tracking-wider flex items-center gap-1`}>
          <Award className="h-3 w-3" />
          {level.label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`bg-black/40 backdrop-blur-sm p-4 rounded-lg border ${borderColor} text-center`}>
          <Percent className={`h-5 w-5 mx-auto mb-2 ${textColor}`} />
          <p className={`text-3xl font-bold ${textColor300} mb-1`}>{calculateEngagementRate()}%</p>
          <p className={`${textColor500} text-xs uppercase tracking-wider`}>Engagement Rate</p>
          <p className={`${textColor400} text-xs mt-1`}>(Likes+Comments+Shares) / Views</p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-pink-500/30 text-center">
          <Percent className="h-5 w-5 mx-auto mb-2 text-pink-400" />
          <p className={`text-3xl font-bold ${textColor300} mb-1`}>{getLikesRatio()}%</p>
          <p className={`${textColor500} text-xs uppercase tracking-wider`}>Like Rate</p>
          <p className={`${textColor400} text-xs mt-1`}>Likes / Views</p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-purple-500/30 text-center">
          <Percent className="h-5 w-5 mx-auto mb-2 text-purple-400" />
          <p className={`text-3xl font-bold ${textColor300} mb-1`}>{getCommentsRatio()}%</p>
          <p className={`${textColor500} text-xs uppercase tracking-wider`}>Comment Rate</p>
          <p className={`${textColor400} text-xs mt-1`}>Comments / Likes</p>
        </div>
      </div>

      <div className={`bg-black/20 p-3 rounded border ${isYouTube ? 'border-red-500/20' : 'border-cyan-500/20'}`}>
        <p className={`${textColor400} text-xs text-center`}>
          <strong className={textColor300}>Pro Tip:</strong> Videos with {'>'}5% engagement rate are considered highly engaging and have viral potential
        </p>
      </div>
    </div>
  );
}
