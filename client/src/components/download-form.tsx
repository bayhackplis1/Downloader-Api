import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { TikTokData } from "@/pages/home";
import { apiRequest } from "@/lib/queryClient";
import { validateMediaUrl as validateUrl, type ValidationResult, detectPlatform } from "@/lib/url-validator";
import { getRecentUrls, addRecentUrl } from "@/lib/recent-urls";
import { Loader2, CheckCircle2, XCircle, AlertCircle, Clock, X } from "lucide-react";
import { SiTiktok, SiYoutube } from "react-icons/si";
import { useState, useEffect } from "react";

const formSchema = z.object({
  url: z.string().min(1, "URL is required"),
});

type FormSchema = z.infer<typeof formSchema>;

interface DownloadFormProps {
  onPreview: (data: TikTokData) => void;
}

export function DownloadForm({ onPreview }: DownloadFormProps) {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [showRecent, setShowRecent] = useState(false);
  const [recentUrls, setRecentUrls] = useState(getRecentUrls());
  const [currentPlatform, setCurrentPlatform] = useState<'tiktok' | 'youtube' | 'unknown'>('unknown');

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const currentUrl = form.watch("url");

  useEffect(() => {
    if (currentUrl && currentUrl.length > 10) {
      const result = validateUrl(currentUrl);
      setValidation(result);
      setCurrentPlatform(result.platform || 'unknown');
    } else {
      setValidation(null);
      setCurrentPlatform('unknown');
    }
  }, [currentUrl]);

  useEffect(() => {
    const pendingUrl = localStorage.getItem("pendingVideoUrl");
    if (pendingUrl) {
      localStorage.removeItem("pendingVideoUrl");
      form.setValue("url", pendingUrl);
      setTimeout(() => {
        const platform = detectPlatform(pendingUrl);
        fetchMutation.mutate({ url: pendingUrl, platform });
      }, 100);
    }
  }, []);

  const fetchMutation = useMutation({
    mutationFn: async ({ url, platform }: { url: string; platform: string }) => {
      const endpoint = platform === 'youtube' ? '/api/youtube/info' : '/api/tiktok/info';
      const res = await apiRequest("POST", endpoint, { url });
      return res.json();
    },
    onSuccess: (data: TikTokData) => {
      onPreview(data);
      addRecentUrl(currentUrl, data.title);
      setRecentUrls(getRecentUrls());
      const platformName = currentPlatform === 'youtube' ? 'YouTube' : 'TikTok';
      toast({
        title: `${platformName} video found!`,
        description: "You can now download the video or audio.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  async function onSubmit(data: FormSchema) {
    const platform = detectPlatform(data.url);
    if (platform === 'unknown') {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid TikTok or YouTube URL",
        variant: "destructive",
      });
      return;
    }
    fetchMutation.mutate({ url: data.url, platform });
    setShowRecent(false);
  }

  const handleRecentClick = (url: string) => {
    form.setValue("url", url);
    setShowRecent(false);
  };

  const getValidationIcon = () => {
    if (!validation) return null;
    if (validation.type === 'success') return <CheckCircle2 className="h-4 w-4 text-green-400" />;
    if (validation.type === 'error') return <XCircle className="h-4 w-4 text-red-400" />;
    return <AlertCircle className="h-4 w-4 text-yellow-400" />;
  };

  const getValidationColor = () => {
    if (!validation) return '';
    if (validation.type === 'success') return 'border-green-500/40';
    if (validation.type === 'error') return 'border-red-500/40';
    return 'border-yellow-500/40';
  };

  const getPlatformIcon = () => {
    if (currentPlatform === 'tiktok') {
      return <SiTiktok className="h-5 w-5 text-cyan-400" />;
    }
    if (currentPlatform === 'youtube') {
      return <SiYoutube className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  const getPlatformColor = () => {
    if (currentPlatform === 'youtube') {
      return 'border-red-500/40';
    }
    if (currentPlatform === 'tiktok') {
      return 'border-cyan-500/40';
    }
    return '';
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                    {getPlatformIcon()}
                  </div>
                  <Input
                    placeholder="Paste TikTok or YouTube URL here..."
                    {...field}
                    className={`h-12 cyber-input text-lg ${currentPlatform !== 'unknown' ? 'pl-10' : ''} pr-20 ${getValidationColor()} ${getPlatformColor()}`}
                    onFocus={() => setShowRecent(true)}
                    data-testid="input-url"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {field.value && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-cyan-400/60 hover:text-cyan-400"
                        onClick={() => {
                          form.setValue("url", "");
                          setValidation(null);
                          setCurrentPlatform('unknown');
                        }}
                        data-testid="button-clear-url"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    {getValidationIcon()}
                  </div>
                  {validation && (
                    <div className={`text-xs mt-1 flex items-center gap-1 ${
                      validation.type === 'success' ? 'text-green-400' : 
                      validation.type === 'error' ? 'text-red-400' : 
                      'text-yellow-400'
                    }`}>
                      {validation.platform === 'youtube' && <SiYoutube className="h-3 w-3" />}
                      {validation.platform === 'tiktok' && <SiTiktok className="h-3 w-3" />}
                      {validation.message}
                    </div>
                  )}
                </div>
              </FormControl>
              {showRecent && recentUrls.length > 0 && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-cyan-500/30 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                  data-testid="dropdown-recent-urls"
                >
                  <div className="p-2 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2 text-xs text-cyan-400/60">
                      <Clock className="h-3 w-3" />
                      Recent URLs
                    </div>
                  </div>
                  {recentUrls.map((recent, index) => {
                    const platform = detectPlatform(recent.url);
                    return (
                      <button
                        key={index}
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-cyan-500/10 transition-colors border-b border-cyan-500/10 last:border-0"
                        onClick={() => handleRecentClick(recent.url)}
                        data-testid={`button-recent-${index}`}
                      >
                        <div className="flex items-center gap-2">
                          {platform === 'youtube' && <SiYoutube className="h-4 w-4 text-red-500 flex-shrink-0" />}
                          {platform === 'tiktok' && <SiTiktok className="h-4 w-4 text-cyan-400 flex-shrink-0" />}
                          <div className="text-sm text-cyan-300 truncate">
                            {recent.title || recent.url}
                          </div>
                        </div>
                        <div className="text-xs text-cyan-500/60 truncate mt-0.5 pl-6">
                          {recent.url}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={`w-full h-12 ${currentPlatform === 'youtube' ? 'bg-red-600 hover:bg-red-700' : 'cyber-button'}`}
          disabled={fetchMutation.isPending || (validation !== null && validation.type === 'error')}
          data-testid="button-submit"
        >
          {fetchMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <span className="flex items-center gap-2">
              {currentPlatform === 'youtube' && <SiYoutube className="h-4 w-4" />}
              {currentPlatform === 'tiktok' && <SiTiktok className="h-4 w-4" />}
              GET DOWNLOAD LINKS
            </span>
          )}
        </Button>
      </form>
      {showRecent && recentUrls.length > 0 && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowRecent(false)}
        />
      )}
    </Form>
  );
}
