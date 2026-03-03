import { useState } from "react";
import { Play, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoPlayerProps {
  videoUrl: string;
  exerciseName: string;
  onFocusMode: () => void;
}

const getEmbedUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("youtube.com/embed")) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
};

export const VideoPlayer = ({ videoUrl, exerciseName, onFocusMode }: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const embedUrl = getEmbedUrl(videoUrl);

  if (!videoUrl) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl border bg-muted shadow-md">
        <AspectRatio ratio={16 / 9}>
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <Play className="h-12 w-12 opacity-30" />
            <p className="text-sm">Sem vídeo disponível</p>
          </div>
        </AspectRatio>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl border shadow-lg">
      <AspectRatio ratio={16 / 9}>
        {!playing ? (
          <button
            onClick={() => setPlaying(true)}
            className="group relative flex h-full w-full items-center justify-center bg-foreground/5 transition-colors hover:bg-foreground/10"
            aria-label={`Reproduzir vídeo: ${exerciseName}`}
          >
            <img
              src={`https://img.youtube.com/vi/${embedUrl.split("/embed/")[1]}/hqdefault.jpg`}
              alt={exerciseName}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="absolute inset-0 bg-foreground/30" />
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-xl transition-transform group-hover:scale-110">
              <Play className="h-7 w-7 fill-current" />
            </div>
          </button>
        ) : (
          <>
            {loading && (
              <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-none" />
            )}
            <iframe
              src={`${embedUrl}?autoplay=1&rel=0`}
              title={exerciseName}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              onLoad={() => setLoading(false)}
            />
          </>
        )}
      </AspectRatio>
      <Button
        size="sm"
        variant="secondary"
        className="absolute bottom-3 right-3 z-20 gap-1.5 opacity-90 shadow-md hover:opacity-100"
        onClick={onFocusMode}
      >
        <Maximize2 className="h-3.5 w-3.5" />
        Modo Foco
      </Button>
    </div>
  );
};
