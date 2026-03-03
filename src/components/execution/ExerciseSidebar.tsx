import { Video, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkoutExercise } from "@/data/mock-workout-execution";

interface ExerciseSidebarProps {
  exercises: WorkoutExercise[];
  currentIndex: number;
  completedIds: Set<string>;
  onSelect: (index: number) => void;
}

export const ExerciseSidebar = ({
  exercises,
  currentIndex,
  completedIds,
  onSelect,
}: ExerciseSidebarProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-none">
      {exercises.map((ex, i) => {
        const isCurrent = i === currentIndex;
        const isDone = completedIds.has(ex.id);
        return (
          <button
            key={ex.id}
            onClick={() => onSelect(i)}
            className={cn(
              "flex min-w-[48px] flex-col items-center gap-1 rounded-lg border p-2 text-center transition-all",
              isCurrent && "border-primary bg-primary/10 shadow-sm",
              isDone && !isCurrent && "border-primary/30 bg-primary/5",
              !isCurrent && !isDone && "border-border bg-card hover:bg-accent"
            )}
          >
            <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold">
              {isDone ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <span className="text-muted-foreground">{i + 1}</span>
              )}
            </div>
            {ex.videoUrl && <Video className="h-3 w-3 text-muted-foreground" />}
          </button>
        );
      })}
    </div>
  );
};
