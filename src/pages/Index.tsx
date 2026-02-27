import { useState, useMemo } from "react";
import { Users, AlertTriangle } from "lucide-react";
import { mockStudents, type Student } from "@/data/mock-students";
import { StudentCard } from "@/components/students/StudentCard";
import { StudentFilters } from "@/components/students/StudentFilters";
import { StudentRestrictionModal } from "@/components/students/StudentRestrictionModal";

const Index = () => {
  const [search, setSearch] = useState("");
  const [restrictionFilter, setRestrictionFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return mockStudents.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchesRestriction =
        restrictionFilter === "all" || s.restrictions.some((r) => r.type === restrictionFilter);
      const matchesExperience =
        experienceFilter === "all" || s.experience === experienceFilter;
      return matchesSearch && matchesRestriction && matchesExperience;
    });
  }, [search, restrictionFilter, experienceFilter]);

  const alertCount = mockStudents.filter((s) => s.hasAlert).length;

  const handleViewRestrictions = (student: Student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <Users className="h-7 w-7 text-primary" />
                Restrições dos Alunos
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Visualize as restrições e inicie o cadastro de treinos personalizados
              </p>
            </div>
            {alertCount > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {alertCount} aluno{alertCount > 1 ? "s" : ""} com atenção especial
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <StudentFilters
          search={search}
          onSearchChange={setSearch}
          restrictionFilter={restrictionFilter}
          onRestrictionFilterChange={setRestrictionFilter}
          experienceFilter={experienceFilter}
          onExperienceFilterChange={setExperienceFilter}
        />

        <p className="mt-4 text-sm text-muted-foreground">
          {filtered.length} aluno{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 font-medium text-muted-foreground">Nenhum aluno encontrado</p>
            <p className="text-sm text-muted-foreground">Tente ajustar os filtros</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onViewRestrictions={handleViewRestrictions}
              />
            ))}
          </div>
        )}
      </main>

      <StudentRestrictionModal
        student={selectedStudent}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Index;
