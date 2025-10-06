// Ejemplo de uso del RecipeForm dentro del módulo de pacientes
// Este archivo muestra cómo integrar el RecipeForm en el PatientDetailView

import RecipeForm from "@/modules/recipes/RecipeForm";

// Ejemplo de uso en PatientDetailView.tsx
export default function PatientDetailView({ patient, onBack }) {
  const [showRecipeForm, setShowRecipeForm] = useState(false);

  const handleRecipeSuccess = () => {
    setShowRecipeForm(false);
    // Mostrar mensaje de éxito o actualizar datos
  };

  const handleRecipeCancel = () => {
    setShowRecipeForm(false);
  };

  if (showRecipeForm) {
    return (
      <RecipeForm
        patientId={patient.id}
        patientName={`${patient.firstName} ${patient.lastName}`}
        onSuccess={handleRecipeSuccess}
        onCancel={handleRecipeCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Contenido existente del PatientDetailView */}
      
      {/* Botón para crear receta */}
      <Button
        onClick={() => setShowRecipeForm(true)}
        className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
      >
        <FileText className="mr-2" size={18} />
        Nueva Receta
      </Button>
    </div>
  );
}
