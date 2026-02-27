import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewWorkout = () => {
  const { alunoId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold">Cadastrar Treino</h1>
        <p className="mb-6 text-muted-foreground">
          Rota mockada para o aluno <strong>#{alunoId}</strong>
        </p>
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para lista
        </Button>
      </div>
    </div>
  );
};

export default NewWorkout;
