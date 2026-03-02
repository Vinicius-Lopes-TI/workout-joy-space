import { Trash2, ChevronUp, ChevronDown, GripVertical, Link as LinkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Exercise } from "@/data/mock-workout";

const EXECUTION_TYPES = [
  { value: "Normal", label: "Normal" },
  { value: "Drop-set", label: "Drop-set" },
  { value: "Bi-set", label: "Bi-set" },
  { value: "Tri-set", label: "Tri-set" },
  { value: "Rest-pause", label: "Rest-pause" },
  { value: "Set 21", label: "Set 21" },
] as const;

const GROUP_COLORS: Record<number, string> = {
  1: "border-l-blue-500",
  2: "border-l-emerald-500",
  3: "border-l-amber-500",
  4: "border-l-purple-500",
  5: "border-l-rose-500",
};

const GROUP_BG: Record<number, string> = {
  1: "bg-blue-500/10",
  2: "bg-emerald-500/10",
  3: "bg-amber-500/10",
  4: "bg-purple-500/10",
  5: "bg-rose-500/10",
};

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  total: number;
  onUpdate: (id: string, field: keyof Exercise, value: string | number) => void;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export const ExerciseCard = ({
  exercise,
  index,
  total,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: ExerciseCardProps) => {
  const needsGroup = exercise.executionType === "Bi-set" || exercise.executionType === "Tri-set";
  const groupColor = exercise.groupId ? GROUP_COLORS[exercise.groupId] || "border-l-primary" : "";
  const groupBg = exercise.groupId ? GROUP_BG[exercise.groupId] || "" : "";

  return (
    <Card
      className={`relative transition-all border-l-4 ${groupColor || "border-l-transparent"} ${groupBg}`}
    >
      {exercise.groupId && (
        <div className="absolute -top-2.5 left-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
          Grupo {exercise.groupId}
        </div>
      )}

      <CardContent className="p-4 pt-5">
        {/* Header with order controls */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">
              #{index + 1}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={index === 0}
              onClick={() => onMoveUp(index)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={index === total - 1}
              onClick={() => onMoveDown(index)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onRemove(exercise.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Exercise name */}
        <div className="mb-3">
          <Label className="text-xs text-muted-foreground">Nome do exercício</Label>
          <Input
            placeholder="Ex: Supino reto com barra"
            value={exercise.name}
            onChange={(e) => onUpdate(exercise.id, "name", e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Series / Reps / Rest */}
        <div className="mb-3 grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">Séries</Label>
            <Input
              type="number"
              min={1}
              placeholder="4"
              value={exercise.sets || ""}
              onChange={(e) => onUpdate(exercise.id, "sets", Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Repetições</Label>
            <Input
              placeholder="12"
              value={exercise.reps}
              onChange={(e) => onUpdate(exercise.id, "reps", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Descanso (s)</Label>
            <Input
              type="number"
              min={0}
              placeholder="60"
              value={exercise.restSeconds || ""}
              onChange={(e) => onUpdate(exercise.id, "restSeconds", Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>

        {/* Execution type + Group */}
        <div className={`mb-3 grid gap-2 ${needsGroup ? "grid-cols-2" : "grid-cols-1"}`}>
          <div>
            <Label className="text-xs text-muted-foreground">Tipo de execução</Label>
            <Select
              value={exercise.executionType}
              onValueChange={(v) => onUpdate(exercise.id, "executionType", v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXECUTION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {needsGroup && (
            <div>
              <Label className="text-xs text-muted-foreground">Grupo</Label>
              <Select
                value={String(exercise.groupId || 1)}
                onValueChange={(v) => onUpdate(exercise.id, "groupId", Number(v))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((g) => (
                    <SelectItem key={g} value={String(g)}>
                      Grupo {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Video link */}
        <div className="mb-3">
          <Label className="text-xs text-muted-foreground">
            <LinkIcon className="mr-1 inline h-3 w-3" />
            Link de vídeo
          </Label>
          <Input
            type="url"
            placeholder="https://youtube.com/..."
            value={exercise.videoUrl}
            onChange={(e) => onUpdate(exercise.id, "videoUrl", e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Observations */}
        <div>
          <Label className="text-xs text-muted-foreground">Observações</Label>
          <Textarea
            placeholder="Atenção à execução, amplitude..."
            value={exercise.observations}
            onChange={(e) => onUpdate(exercise.id, "observations", e.target.value)}
            className="mt-1 min-h-[60px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};
