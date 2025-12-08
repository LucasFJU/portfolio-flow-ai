import { getVideoEmbedUrl, getVideoThumbnail } from '@/utils/videoUtils';
import { Play } from 'lucide-react';
import { useState } from 'react';

interface VideoEmbedProps {
  url: string;
  showThumbnail?: boolean;
  className?: string;
}

export function VideoEmbed({ url, showThumbnail = false, className = '' }: VideoEmbedProps) {
  const [showVideo, setShowVideo] = useState(!showThumbnail);
  const embedUrl = getVideoEmbedUrl(url);
  const thumbnail = getVideoThumbnail(url);

  if (!embedUrl) {
    return null;
  }

  if (showThumbnail && !showVideo && thumbnail) {
    return (
      <div 
        className={`relative cursor-pointer group ${className}`}
        onClick={() => setShowVideo(true)}
      >
        <img 
          src={thumbnail} 
          alt="Video thumbnail" 
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors rounded-lg">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-primary-foreground ml-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative aspect-video ${className}`}>
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video embed"
      />
    </div>
  );
}
