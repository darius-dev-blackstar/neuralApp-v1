import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Calendar, 
  User, 
  Eye, 
  AlertCircle, 
  Loader2,
  Pill
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/services/auth";
import RecipePreviewModal from "./RecipePreviewModal";

interface Recipe {
  id: string;
  pacienteId: string;
  doctorId: string;
  medicamento: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  observaciones: string | null;
  createdAt: string;
  updatedAt: string;
  paciente: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface RecipeListProps {
  patientId: string;
  patientName?: string;
  onRefresh?: () => void;
}

export default function RecipeList({ patientId, patientName, onRefresh }: RecipeListProps) {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar recetas del paciente
  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(`/api/recipes?paciente_id=${patientId}`);
      
      // La API devuelve un objeto con recipes array
      const recipesData = response.data?.recipes || response.data || [];
      
      // Validar que sea un array y filtrar elementos válidos
      const validRecipes = Array.isArray(recipesData) 
        ? recipesData.filter(recipe => recipe && recipe.id) 
        : [];
      
      setRecipes(validRecipes);
      
    } catch (error: any) {
      console.error('Error loading recipes:', error);
      
      // Manejar error 401 (no autorizado)
      if (error.response?.status === 401) {
        toast({
          title: "Sesión expirada",
          description: "Por favor inicia sesión nuevamente",
          variant: "destructive",
        });
        
        // Limpiar tokens y redirigir al login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        window.location.href = "/login";
        return;
      }
      
      // Otros errores
      const errorMessage = error.response?.data?.error || "Error cargando recetas";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar recetas al montar el componente
  useEffect(() => {
    if (patientId && patientId.trim() !== '') {
      loadRecipes();
    } else {
      console.warn('RecipeList: patientId is not defined or empty');
      setLoading(false);
      setError('ID del paciente no válido');
    }
  }, [patientId]);

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "N/A";
    }
  };

  // Función para ver detalle de receta
  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  // Renderizar contenido según el estado
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Cargando recetas...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-300" />
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={loadRecipes} 
            variant="outline" 
            className="mt-4 hover:scale-105 transition-all duration-200"
          >
            Reintentar
          </Button>
        </div>
      );
    }

    if (!recipes || recipes.length === 0) {
      return (
        <div className="text-center py-12">
          <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recetas registradas</h3>
          <p className="text-gray-600 mb-4">
            {patientName ? `No se han encontrado recetas para ${patientName}` : 'No se han encontrado recetas para este paciente'}
          </p>
          <Button 
            onClick={loadRecipes} 
            variant="outline" 
            className="hover:scale-105 transition-all duration-200"
          >
            Actualizar
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Recetas Médicas ({recipes.length})
          </h3>
          <Button 
            onClick={loadRecipes} 
            variant="outline" 
            size="sm"
            className="hover:scale-105 transition-all duration-200"
          >
            Actualizar
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Medicamento</TableHead>
                <TableHead>Dosis</TableHead>
                <TableHead>Frecuencia</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes.map((recipe) => (
                <TableRow 
                  key={recipe.id} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-primary" />
                      {recipe.medicamento || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {recipe.dosis || 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {recipe.frecuencia || 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {recipe.duracion || 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(recipe.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {recipe.doctor?.firstName || 'N/A'} {recipe.doctor?.lastName || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewRecipe(recipe)}
                      className="hover:bg-blue-50 hover:text-blue-600 hover:scale-105 transition-all duration-200"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <Card className="rounded-2xl shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Historial de Recetas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>

      {/* Modal de previsualización */}
      <RecipePreviewModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Card>
  );
}
