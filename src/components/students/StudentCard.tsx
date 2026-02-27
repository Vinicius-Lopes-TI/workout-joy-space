import { AlertTriangle, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Student } from "@/data/mock-students";

interface Props {
  student: Student;
  onViewRestrictions: (student: Student) => void;
}

const experienceColor: Record<string, string> = {
  Iniciante: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Intermediário: "bg-sky-500/15 text-sky-700 border-sky-500/30",
  Avançado: "bg-violet-500/15 text-violet-700 border-violet-500/30",
};

const severityColor: Record<string, string> = {
  high: "bg-destructive/15 text-destructive border-destructive/30",
  medium: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  low: "bg-secondary text-secondary-foreground",
};

export function StudentCard({ student, onViewRestrictions }: Props) {
  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      {student.hasAlert && (
        <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm">
          <AlertTriangle className="h-3.5 w-3.5" />
        </div>
      )}
      <CardContent className="p-5">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
            {student.avatarInitials}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold leading-tight">{student.name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{student.age} anos</span>
              <Badge variant="outline" className={experienceColor[student.experience]}>
                {student.experience}
              </Badge>
            </div>
          </div>
        </div>

        {/* Restriction tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {student.restrictions.map((r, i) => (
            <Badge key={i} variant="outline" className={`text-xs ${severityColor[r.severity]}`}>
              {r.type}
            </Badge>
          ))}
        </div>

        {/* Observation summary */}
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {student.observations}
        </p>

        <Button
          className="w-full"
          variant="outline"
          onClick={() => onViewRestrictions(student)}
        >
          <Eye className="mr-2 h-4 w-4" />
          Ver restrições
        </Button>
      </CardContent>
    </Card>
  );
}
