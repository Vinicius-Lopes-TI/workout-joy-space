import { PartyPopper, Clock, Dumbbell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WorkoutCompleteProps {
  totalTime: string;
  totalExercises: number;
  onFinish: () => void;
}

export const WorkoutComplete = ({ totalTime, totalExercises, onFinish }: WorkoutCompleteProps) => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 animate-in fade-in zoom-in-95 duration-500">
      <Card className="w-full max-w-sm text-center shadow-xl">
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <PartyPopper className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Treino Finalizado!</h2>
          <p className="text-sm text-muted-foreground">Parabéns! Você completou todos os exercícios.</p>

          <div className="mt-2 flex gap-6">
            <div className="flex flex-col items-center gap-1">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-bold">{totalTime}</span>
              <span className="text-xs text-muted-foreground">Tempo total</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Dumbbell className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-bold">{totalExercises}</span>
              <span className="text-xs text-muted-foreground">Exercícios</span>
            </div>
          </div>

          <Button className="mt-4 w-full gap-2" size="lg" onClick={onFinish}>
            <CheckCircle2 className="h-5 w-5" />
            Concluir Treino
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
