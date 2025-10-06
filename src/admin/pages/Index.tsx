import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">neuralApp</h1>
          <p className="text-muted-foreground">Sistema de gestión médica</p>
        </div>
        <Button onClick={() => navigate("/admin")} size="lg">
          Acceder al Panel Administrativo
        </Button>
      </div>
    </div>
  );
};

export default Index;
