import { useNavigate } from "react-router-dom";
import { AlertTriangle, Heart, Pill, Scissors, Clock, Cigarette, Wine, Moon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Student } from "@/data/mock-students";

interface Props {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const severityColor: Record<string, string> = {
  high: "bg-destructive text-destructive-foreground",
  medium: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  low: "bg-secondary text-secondary-foreground",
};

export function StudentRestrictionModal({ student, open, onOpenChange }: Props) {
  const navigate = useNavigate();

  if (!student) return null;

  const handleCreateWorkout = () => {
    onOpenChange(false);
    navigate(`/treinos/novo/${student.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {student.avatarInitials}
            </div>
            <div>
              <DialogTitle className="text-xl">{student.name}</DialogTitle>
              <DialogDescription>
                {student.age} anos · {student.experience}
                {student.hasAlert && (
                  <span className="ml-2 inline-flex items-center gap-1 font-semibold text-destructive">
                    <AlertTriangle className="h-3.5 w-3.5" /> Atenção especial
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Restrictions */}
        <section>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <AlertTriangle className="h-4 w-4" /> Restrições
          </h4>
          <div className="space-y-3">
            {student.restrictions.map((r, i) => (
              <div key={i} className="rounded-lg border bg-card p-3">
                <div className="mb-1 flex items-center gap-2">
                  <Badge className={severityColor[r.severity]}>{r.type}</Badge>
                  <span className="text-xs text-muted-foreground capitalize">
                    {r.severity === "high" ? "Alta" : r.severity === "medium" ? "Média" : "Baixa"} severidade
                  </span>
                </div>
                <p className="text-sm text-foreground">{r.description}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Health History */}
        <section>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Heart className="h-4 w-4" /> Histórico de Saúde
          </h4>
          <ul className="space-y-1">
            {student.health.conditions.map((c, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {c}
              </li>
            ))}
          </ul>
        </section>

        {/* Medications & Surgeries */}
        {(student.health.medications.length > 0 || student.health.surgeries.length > 0) && (
          <>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              {student.health.medications.length > 0 && (
                <section>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Pill className="h-4 w-4" /> Medicamentos
                  </h4>
                  <ul className="space-y-1">
                    {student.health.medications.map((m, i) => (
                      <li key={i} className="text-sm">{m}</li>
                    ))}
                  </ul>
                </section>
              )}
              {student.health.surgeries.length > 0 && (
                <section>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Scissors className="h-4 w-4" /> Cirurgias
                  </h4>
                  <ul className="space-y-1">
                    {student.health.surgeries.map((s, i) => (
                      <li key={i} className="text-sm">{s}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </>
        )}

        <Separator />

        {/* Habits */}
        <section>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Clock className="h-4 w-4" /> Hábitos
          </h4>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm">
              <Cigarette className="h-4 w-4 text-muted-foreground" />
              {student.health.habits.smokes ? "Fumante" : "Não fuma"}
            </div>
            <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm">
              <Wine className="h-4 w-4 text-muted-foreground" />
              {student.health.habits.drinks ? "Consome álcool" : "Não bebe"}
            </div>
            <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm">
              <AlertTriangle className={`h-4 w-4 ${student.health.habits.hasFainted ? "text-destructive" : "text-muted-foreground"}`} />
              {student.health.habits.hasFainted ? "Já desmaiou" : "Nunca desmaiou"}
            </div>
            <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm">
              <Moon className="h-4 w-4 text-muted-foreground" />
              {student.health.habits.sleepHours}h de sono
            </div>
          </div>
        </section>

        <Separator />

        {/* Observations */}
        <section>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Observações
          </h4>
          <p className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed">{student.observations}</p>
        </section>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={handleCreateWorkout}>
            Cadastrar treino
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
