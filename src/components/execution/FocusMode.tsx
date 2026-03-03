import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { WorkoutExercise } from "@/data/mock-workout-execution";

interface FocusModeProps {
  exercise: WorkoutExercise;
  onClose: () => void;
}

const getEmbedUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("youtube.com/embed")) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
};

export const FocusMode = ({ exercise, onClose }: FocusModeProps) => {
  const embedUrl = getEmbedUrl(exercise.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-foreground/95 animate-in fade-in duration-300">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-background">{exercise.name}</h2>
          {(exercise.executionType === "Bi-set" || exercise.executionType === "Tri-set") && (
            <Badge variant="secondary" className="text-xs">{exercise.executionType}</Badge>
          )}
        </div>
        <Button size="icon" variant="ghost" onClick={onClose} className="text-background hover:bg-background/10">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Video */}
      <div className="flex flex-1 items-center justify-center px-2">
        <div className="w-full max-w-4xl">
          <AspectRatio ratio={16 / 9}>
            {embedUrl ? (
              <iframe
                src={`${embedUrl}?autoplay=1&rel=0`}
                title={exercise.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full rounded-lg"
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg bg-background/10 text-background/50">
                Sem vídeo
              </div>
            )}
          </AspectRatio>
        </div>
      </div>

      {/* Bottom info */}
      <div className="flex items-center justify-center gap-6 px-4 py-4 text-background/80">
        <span className="text-sm">{exercise.sets} séries</span>
        <span className="text-sm">{exercise.reps} reps</span>
        <span className="text-sm">{exercise.restSeconds}s descanso</span>
      </div>
    </div>
  );
};
