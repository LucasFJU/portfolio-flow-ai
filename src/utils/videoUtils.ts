// Video parsing utilities for YouTube and Vimeo
export function parseVideoUrl(url: string): { type: 'youtube' | 'vimeo' | null; id: string | null } {
  if (!url) return { type: null, id: null };

  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) return { type: 'youtube', id: match[1] };
  }

  // Vimeo patterns
  const vimeoPatterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ];

  for (const pattern of vimeoPatterns) {
    const match = url.match(pattern);
    if (match) return { type: 'vimeo', id: match[1] };
  }

  return { type: null, id: null };
}

export function getVideoEmbedUrl(url: string): string | null {
  const { type, id } = parseVideoUrl(url);
  
  if (!type || !id) return null;

  if (type === 'youtube') {
    return `https://www.youtube.com/embed/${id}`;
  }
  
  if (type === 'vimeo') {
    return `https://player.vimeo.com/video/${id}`;
  }

  return null;
}

export function getVideoThumbnail(url: string): string | null {
  const { type, id } = parseVideoUrl(url);
  
  if (!type || !id) return null;

  if (type === 'youtube') {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  
  // Vimeo thumbnails require an API call, return placeholder
  if (type === 'vimeo') {
    return null;
  }

  return null;
}

export function isValidVideoUrl(url: string): boolean {
  const { type, id } = parseVideoUrl(url);
  return type !== null && id !== null;
}
