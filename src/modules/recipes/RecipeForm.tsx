import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Download, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/services/auth";

interface RecipeFormProps {
  patientId: string;
  patientName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface RecipeData {
  paciente_id: string;
  medicamento: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  observaciones: string;
}

export default function RecipeForm({ 
  patientId, 
  patientName, 
  onSuccess, 
  onCancel 
}: RecipeFormProps) {
  const { toast } = useToast();
  
  // Estados del formulario
  const [formData, setFormData] = useState<RecipeData>({
    paciente_id: patientId,
    medicamento: "",
    dosis: "",
    frecuencia: "",
    duracion: "",
    observaciones: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Manejar cambios en los inputs
  const handleInputChange = (field: keyof RecipeData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.medicamento.trim()) {
      newErrors.medicamento = "El medicamento es requerido";
    }
    
    if (!formData.dosis.trim()) {
      newErrors.dosis = "La dosis es requerida";
    }
    
    if (!formData.frecuencia.trim()) {
      newErrors.frecuencia = "La frecuencia es requerida";
    }
    
    if (!formData.duracion.trim()) {
      newErrors.duracion = "La duración es requerida";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiClient.post('/api/recipes', formData);
      
      // Éxito
      toast({
        title: "Éxito",
        description: "Receta guardada correctamente",
      });
      
      // Limpiar formulario
      setFormData({
        paciente_id: patientId,
        medicamento: "",
        dosis: "",
        frecuencia: "",
        duracion: "",
        observaciones: ""
      });
      
      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error('Error saving recipe:', error);
      
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
      toast({
        title: "Error",
        description: error.message || "Error al guardar receta, intente nuevamente",
        variant: "destructive",
      });
      
    } finally {
      setLoading(false);
    }
  };

  // Manejar cancelar
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ backgroundColor: '#F5F5F5', minHeight: '100vh', padding: '1.5rem' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Receta Médica</h1>
          <p className="text-gray-600 mt-1">
            {patientName ? `Para: ${patientName}` : 'Crear receta médica para el paciente'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="hover:scale-105 transition-all duration-200"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="outline"
            className="hover:scale-105 transition-all duration-200"
            disabled={loading}
          >
            <Download className="mr-2" size={18} />
            Descargar PDF
          </Button>
        </div>
      </div>

      {/* Card principal */}
      <Card className="rounded-2xl shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full" style={{ backgroundColor: '#EFF6FF' }}>
              <FileText className="h-6 w-6" style={{ color: '#458BFF' }} />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Información de la Receta
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Completa los datos del medicamento y prescripción médica
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Medicamento */}
            <div className="space-y-2">
              <Label htmlFor="medicamento" className="text-sm font-medium text-gray-900">
                Medicamento *
              </Label>
              <Input
                id="medicamento"
                type="text"
                placeholder="Ej: Paracetamol, Ibuprofeno..."
                value={formData.medicamento}
                onChange={(e) => handleInputChange('medicamento', e.target.value)}
                className={`border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  errors.medicamento 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:border-primary focus:ring-primary'
                }`}
                disabled={loading}
              />
              {errors.medicamento && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.medicamento}
                </p>
              )}
            </div>

            {/* Dosis */}
            <div className="space-y-2">
              <Label htmlFor="dosis" className="text-sm font-medium text-gray-900">
                Dosis *
              </Label>
              <Input
                id="dosis"
                type="text"
                placeholder="Ej: 500mg, 1 comprimido..."
                value={formData.dosis}
                onChange={(e) => handleInputChange('dosis', e.target.value)}
                className={`border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  errors.dosis 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:border-primary focus:ring-primary'
                }`}
                disabled={loading}
              />
              {errors.dosis && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.dosis}
                </p>
              )}
            </div>

            {/* Frecuencia */}
            <div className="space-y-2">
              <Label htmlFor="frecuencia" className="text-sm font-medium text-gray-900">
                Frecuencia *
              </Label>
              <Input
                id="frecuencia"
                type="text"
                placeholder="Ej: Cada 8 horas, 2 veces al día..."
                value={formData.frecuencia}
                onChange={(e) => handleInputChange('frecuencia', e.target.value)}
                className={`border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  errors.frecuencia 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:border-primary focus:ring-primary'
                }`}
                disabled={loading}
              />
              {errors.frecuencia && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.frecuencia}
                </p>
              )}
            </div>

            {/* Duración */}
            <div className="space-y-2">
              <Label htmlFor="duracion" className="text-sm font-medium text-gray-900">
                Duración *
              </Label>
              <Input
                id="duracion"
                type="text"
                placeholder="Ej: 7 días, 2 semanas..."
                value={formData.duracion}
                onChange={(e) => handleInputChange('duracion', e.target.value)}
                className={`border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  errors.duracion 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:border-primary focus:ring-primary'
                }`}
                disabled={loading}
              />
              {errors.duracion && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.duracion}
                </p>
              )}
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones" className="text-sm font-medium text-gray-900">
                Observaciones
              </Label>
              <Textarea
                id="observaciones"
                placeholder="Instrucciones adicionales, precauciones, efectos secundarios..."
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                className="border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors min-h-[100px]"
                disabled={loading}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="hover:scale-105 transition-all duration-200"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#9CA3AF" : "#458BFF",
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2" size={18} />
                    Guardar Receta
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
