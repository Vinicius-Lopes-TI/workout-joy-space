import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VideoPlayer } from "@/components/execution/VideoPlayer";
import { FocusMode } from "@/components/execution/FocusMode";
import { SetLogger } from "@/components/execution/SetLogger";
import { RestTimer } from "@/components/execution/RestTimer";
import { ExerciseSidebar } from "@/components/execution/ExerciseSidebar";
import { WorkoutComplete } from "@/components/execution/WorkoutComplete";
import {
  mockWorkoutSession,
  type SetLog,
  type ExerciseLog,
} from "@/data/mock-workout-execution";
import { toast } from "sonner";

const WorkoutExecution = () => {
  const navigate = useNavigate();
  const { exercises, workoutName, date } = mockWorkoutSession;

  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [showRest, setShowRest] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Logs per exercise
  const [logs, setLogs] = useState<ExerciseLog[]>(() =>
    exercises.map((ex) => ({
      exerciseId: ex.id,
      sets: Array.from({ length: ex.sets }, (_, i): SetLog => ({
        setNumber: i + 1,
        weight: null,
        completed: false,
      })),
    }))
  );

  const currentExercise = exercises[currentIdx];
  const currentLog = logs[currentIdx];

  // Elapsed time
  useEffect(() => {
    if (!started || completed) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [started, completed]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Completed exercise ids
  const completedIds = useMemo(() => {
    const ids = new Set<string>();
    logs.forEach((log) => {
      if (log.sets.every((s) => s.completed)) ids.add(log.exerciseId);
    });
    return ids;
  }, [logs]);

  const progressPercent = (completedIds.size / exercises.length) * 100;

  const handleUpdateWeight = useCallback(
    (setNumber: number, weight: number) => {
      setLogs((prev) =>
        prev.map((log, i) =>
          i !== currentIdx
            ? log
            : {
                ...log,
                sets: log.sets.map((s) =>
                  s.setNumber === setNumber ? { ...s, weight } : s
                ),
              }
        )
      );
    },
    [currentIdx]
  );

  const handleToggleComplete = useCallback(
    (setNumber: number) => {
      setLogs((prev) =>
        prev.map((log, i) => {
          if (i !== currentIdx) return log;
          const newSets = log.sets.map((s) =>
            s.setNumber === setNumber ? { ...s, completed: !s.completed } : s
          );
          return { ...log, sets: newSets };
        })
      );

      // Check if this was a completion (not un-completion)
      const currentSet = currentLog.sets.find((s) => s.setNumber === setNumber);
      if (currentSet && !currentSet.completed) {
        // Show rest timer
        setShowRest(true);
      }
    },
    [currentIdx, currentLog]
  );

  const handleNav = useCallback(
    (dir: -1 | 1) => {
      const next = currentIdx + dir;
      if (next < 0 || next >= exercises.length) return;
      setCurrentIdx(next);
      setShowRest(false);
    },
    [currentIdx, exercises.length]
  );

  const handleFinish = () => {
    const result = {
      workout: workoutName,
      date,
      totalTime: formatTime(elapsedSeconds),
      logs,
    };
    console.log("🏋️ Treino finalizado:", JSON.stringify(result, null, 2));
    toast.success("Treino concluído com sucesso!");
    navigate("/");
  };

  // Check if all done
  useEffect(() => {
    if (started && completedIds.size === exercises.length) {
      setCompleted(true);
    }
  }, [started, completedIds.size, exercises.length]);

  if (completed) {
    return (
      <div className="min-h-screen bg-background">
        <WorkoutComplete
          totalTime={formatTime(elapsedSeconds)}
          totalExercises={exercises.length}
          onFinish={handleFinish}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Focus mode overlay */}
      {focusMode && currentExercise && (
        <FocusMode exercise={currentExercise} onClose={() => setFocusMode(false)} />
      )}

      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="truncate text-sm font-bold">{workoutName}</h1>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
          {started && (
            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold tabular-nums text-primary">
              {formatTime(elapsedSeconds)}
            </span>
          )}
        </div>
        {started && <Progress value={progressPercent} className="h-1 rounded-none" />}
      </header>

      <main className="mx-auto max-w-3xl px-4 py-4">
        {/* Start button */}
        {!started && (
          <div className="mb-6 flex flex-col items-center gap-4 py-8 animate-in fade-in duration-500">
            <p className="text-sm text-muted-foreground">Pronto para treinar?</p>
            <Button
              size="lg"
              className="gap-2 px-8 text-base shadow-lg"
              onClick={() => {
                setStarted(true);
                toast("Treino iniciado! Vamos lá! 💪");
              }}
            >
              <Play className="h-5 w-5 fill-current" />
              Iniciar Treino
            </Button>
          </div>
        )}

        {/* Exercise sidebar */}
        <ExerciseSidebar
          exercises={exercises}
          currentIndex={currentIdx}
          completedIds={completedIds}
          onSelect={(i) => {
            setCurrentIdx(i);
            setShowRest(false);
          }}
        />

        {/* Video */}
        <div className="mt-4">
          <VideoPlayer
            videoUrl={currentExercise.videoUrl}
            exerciseName={currentExercise.name}
            onFocusMode={() => setFocusMode(true)}
          />
        </div>

        {/* Exercise info */}
        <Card className="mt-4">
          <CardContent className="space-y-3 pt-4 pb-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-bold leading-tight">{currentExercise.name}</h2>
              {(currentExercise.executionType === "Bi-set" || currentExercise.executionType === "Tri-set") && (
                <Badge variant="secondary">{currentExercise.executionType}</Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span><strong className="text-foreground">{currentExercise.sets}</strong> séries</span>
              <span><strong className="text-foreground">{currentExercise.reps}</strong> reps</span>
              <span><strong className="text-foreground">{currentExercise.restSeconds}s</strong> descanso</span>
              {currentExercise.executionType !== "Normal" && (
                <Badge variant="outline" className="text-xs">{currentExercise.executionType}</Badge>
              )}
            </div>

            {currentExercise.observations && (
              <p className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
                💡 {currentExercise.observations}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Set logger */}
        <div className="mt-4">
          <SetLogger
            sets={currentLog.sets}
            disabled={!started}
            onUpdateWeight={handleUpdateWeight}
            onToggleComplete={handleToggleComplete}
          />
        </div>

        {/* Rest timer */}
        {showRest && started && (
          <div className="mt-4">
            <RestTimer
              seconds={currentExercise.restSeconds}
              onComplete={() => setShowRest(false)}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex gap-3 pb-6">
          <Button
            variant="outline"
            className="flex-1 gap-1"
            disabled={currentIdx === 0}
            onClick={() => handleNav(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button
            className="flex-1 gap-1"
            disabled={currentIdx === exercises.length - 1}
            onClick={() => handleNav(1)}
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default WorkoutExecution;
