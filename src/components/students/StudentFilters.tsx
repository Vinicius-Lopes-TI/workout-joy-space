import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RESTRICTION_TYPES, EXPERIENCE_LEVELS } from "@/data/mock-students";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  restrictionFilter: string;
  onRestrictionFilterChange: (value: string) => void;
  experienceFilter: string;
  onExperienceFilterChange: (value: string) => void;
}

export function StudentFilters({
  search, onSearchChange,
  restrictionFilter, onRestrictionFilterChange,
  experienceFilter, onExperienceFilterChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar aluno por nome..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={restrictionFilter} onValueChange={onRestrictionFilterChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Tipo de restrição" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas restrições</SelectItem>
          {RESTRICTION_TYPES.map((type) => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={experienceFilter} onValueChange={onExperienceFilterChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Experiência" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os níveis</SelectItem>
          {EXPERIENCE_LEVELS.map((level) => (
            <SelectItem key={level} value={level}>{level}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
