import { useState, useEffect, useCallback } from "react";
import { Timer, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface RestTimerProps {
  seconds: number;
  onComplete: () => void;
}

export const RestTimer = ({ seconds, onComplete }: RestTimerProps) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete();
      return;
    }
    const interval = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(interval);
  }, [remaining, onComplete]);

  const progress = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 text-center animate-in slide-in-from-bottom-2 duration-300">
      <div className="mb-2 flex items-center justify-center gap-2 text-sm font-medium text-primary">
        <Timer className="h-4 w-4" />
        Descanso
      </div>
      <p className="text-3xl font-bold tabular-nums text-foreground">
        {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
      </p>
      <Progress value={progress} className="mt-3 h-2" />
      <Button
        variant="ghost"
        size="sm"
        className="mt-3 gap-1 text-muted-foreground"
        onClick={onComplete}
      >
        <SkipForward className="h-3.5 w-3.5" />
        Pular descanso
      </Button>
    </div>
  );
};
