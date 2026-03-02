import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Save, X, Dumbbell } from "lucide-react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { mockStudents } from "@/data/mock-students";
import {
  DIVISION_TYPES,
  createEmptyExercise,
  mockExercises,
  type Exercise,
} from "@/data/mock-workout";
import { ExerciseCard } from "@/components/workout/ExerciseCard";

const NewWorkout = () => {
  const { alunoId } = useParams();
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState(alunoId || "");
  const [workoutName, setWorkoutName] = useState("");
  const [division, setDivision] = useState("A");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [active, setActive] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);

  const bottomRef = useRef<HTMLDivElement>(null);

  const handleAddExercise = useCallback(() => {
    const newExercise = createEmptyExercise();
    setExercises((prev) => [...prev, newExercise]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  const handleRemoveExercise = useCallback((id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
    toast("Exercício removido");
  }, []);

  const handleUpdateExercise = useCallback(
    (id: string, field: keyof Exercise, value: string | number) => {
      setExercises((prev) =>
        prev.map((e) => {
          if (e.id !== id) return e;
          const updated = { ...e, [field]: value };
          // Clear groupId when switching away from Bi-set/Tri-set
          if (field === "executionType" && value !== "Bi-set" && value !== "Tri-set") {
            updated.groupId = null;
          }
          // Set default groupId when switching to Bi-set/Tri-set
          if (field === "executionType" && (value === "Bi-set" || value === "Tri-set") && !e.groupId) {
            updated.groupId = 1;
          }
          return updated;
        })
      );
    },
    []
  );

  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return;
    setExercises((prev) => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  }, []);

  const handleMoveDown = useCallback((index: number) => {
    setExercises((prev) => {
      if (index >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  }, []);

  const handleSave = () => {
    const workout = {
      name: workoutName,
      division,
      startDate,
      active,
      studentId,
      exercises,
    };
    console.log("💾 Treino salvo:", JSON.stringify(workout, null, 2));
    toast.success("Treino salvo com sucesso!", {
      description: `${exercises.length} exercício(s) cadastrados`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="flex items-center gap-2 text-lg font-bold">
                <Dumbbell className="h-5 w-5 text-primary" />
                Cadastrar Treino
              </h1>
            </div>
          </div>

          {/* Student select */}
          <Select value={studentId} onValueChange={setStudentId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione aluno" />
            </SelectTrigger>
            <SelectContent>
              {mockStudents.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name.split(" ").slice(0, 2).join(" ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {/* Section 1 - Workout info */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informações do Treino</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Nome do treino</Label>
              <Input
                placeholder="Ex: Treino A – Peito e Tríceps"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Divisão</Label>
                <Select value={division} onValueChange={setDivision}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIVISION_TYPES.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Data de início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "mt-1 w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Status do treino</p>
                <p className="text-xs text-muted-foreground">
                  {active ? "Treino ativo para o aluno" : "Treino inativo"}
                </p>
              </div>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          </CardContent>
        </Card>

        {/* Section 2 - Exercises */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold">
            Exercícios ({exercises.length})
          </h2>
          <Button size="sm" onClick={handleAddExercise}>
            <Plus className="mr-1 h-4 w-4" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-4">
          {exercises.length === 0 && (
            <div className="rounded-lg border-2 border-dashed p-8 text-center">
              <Dumbbell className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">
                Nenhum exercício adicionado
              </p>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleAddExercise}>
                <Plus className="mr-1 h-4 w-4" />
                Adicionar exercício
              </Button>
            </div>
          )}

          {exercises.map((exercise, idx) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={idx}
              total={exercises.length}
              onUpdate={handleUpdateExercise}
              onRemove={handleRemoveExercise}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 mt-6 flex gap-3 border-t bg-background py-4">
          <Button className="flex-1" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Treino
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NewWorkout;
