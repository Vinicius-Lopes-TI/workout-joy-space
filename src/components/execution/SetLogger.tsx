import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { SetLog } from "@/data/mock-workout-execution";

interface SetLoggerProps {
  sets: SetLog[];
  disabled: boolean;
  onUpdateWeight: (setNumber: number, weight: number) => void;
  onToggleComplete: (setNumber: number) => void;
}

export const SetLogger = ({ sets, disabled, onUpdateWeight, onToggleComplete }: SetLoggerProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Registro de Carga
      </Label>
      <div className="space-y-2">
        {sets.map((set) => (
          <div
            key={set.setNumber}
            className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
              set.completed ? "border-primary/30 bg-primary/5" : "bg-card"
            }`}
          >
            <span className="w-16 text-xs font-medium text-muted-foreground">
              Série {set.setNumber}
            </span>
            <div className="flex flex-1 items-center gap-2">
              <Input
                type="number"
                placeholder="kg"
                className="h-9 w-20 text-center"
                disabled={disabled || set.completed}
                value={set.weight ?? ""}
                onChange={(e) =>
                  onUpdateWeight(set.setNumber, parseFloat(e.target.value) || 0)
                }
              />
              <span className="text-xs text-muted-foreground">kg</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`set-${set.setNumber}`}
                disabled={disabled}
                checked={set.completed}
                onCheckedChange={() => onToggleComplete(set.setNumber)}
              />
              <Label
                htmlFor={`set-${set.setNumber}`}
                className="text-xs text-muted-foreground cursor-pointer"
              >
                OK
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
