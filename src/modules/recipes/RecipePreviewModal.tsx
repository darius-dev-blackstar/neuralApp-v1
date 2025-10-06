import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  Calendar, 
  User, 
  Pill,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface RecipePreviewModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipePreviewModal({ recipe, isOpen, onClose }: RecipePreviewModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Resetear estados cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      setIsError(false);
    }
  }, [isOpen]);

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "N/A";
    }
  };

  // Función para imprimir
  const handlePrint = () => {
    try {
      // Crear una ventana nueva para imprimir
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: "Error",
          description: "No se pudo abrir la ventana de impresión",
          variant: "destructive",
        });
        return;
      }

      const printContent = generatePrintContent();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } catch (error) {
      console.error('Error printing:', error);
      toast({
        title: "Error",
        description: "Error al imprimir la receta",
        variant: "destructive",
      });
    }
  };

  // Función para descargar PDF
  const handleDownloadPDF = async () => {
    try {
      setIsLoading(true);
      
      // Por ahora, usar una implementación simple con window.print
      // En el futuro se puede integrar jsPDF o html2canvas
      toast({
        title: "Funcionalidad en desarrollo",
        description: "La descarga de PDF estará disponible próximamente",
        variant: "default",
      });
      
      // Simular carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Error al descargar el PDF",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generar contenido para impresión
  const generatePrintContent = () => {
    if (!recipe) return '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Receta Médica - ${recipe.paciente?.firstName || 'N/A'} ${recipe.paciente?.lastName || 'N/A'}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #458BFF;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .clinic-name {
              font-size: 24px;
              font-weight: bold;
              color: #458BFF;
              margin-bottom: 10px;
            }
            .clinic-info {
              font-size: 14px;
              color: #666;
            }
            .recipe-title {
              font-size: 20px;
              font-weight: bold;
              text-align: center;
              margin: 30px 0;
              color: #333;
            }
            .patient-info, .doctor-info {
              margin: 20px 0;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 8px;
            }
            .info-title {
              font-weight: bold;
              color: #458BFF;
              margin-bottom: 10px;
            }
            .medication-details {
              margin: 30px 0;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .medication-item {
              margin: 15px 0;
              padding: 10px;
              background: white;
              border-left: 4px solid #458BFF;
            }
            .medication-label {
              font-weight: bold;
              color: #333;
            }
            .medication-value {
              color: #666;
              margin-left: 10px;
            }
            .observations {
              margin: 20px 0;
              padding: 15px;
              background: #fff3cd;
              border-radius: 8px;
              border-left: 4px solid #FF7829;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">Vista Médica</div>
            <div class="clinic-info">Sistema de Gestión Médica</div>
          </div>
          
          <div class="recipe-title">RECETA MÉDICA</div>
          
          <div class="patient-info">
            <div class="info-title">DATOS DEL PACIENTE</div>
            <div><strong>Nombre:</strong> ${recipe.paciente?.firstName || 'N/A'} ${recipe.paciente?.lastName || 'N/A'}</div>
            <div><strong>Email:</strong> ${recipe.paciente?.email || 'N/A'}</div>
          </div>
          
          <div class="doctor-info">
            <div class="info-title">DATOS DEL MÉDICO</div>
            <div><strong>Nombre:</strong> ${recipe.doctor?.firstName || 'N/A'} ${recipe.doctor?.lastName || 'N/A'}</div>
            <div><strong>Email:</strong> ${recipe.doctor?.email || 'N/A'}</div>
          </div>
          
          <div class="medication-details">
            <div class="info-title">MEDICAMENTO PRESCRITO</div>
            <div class="medication-item">
              <span class="medication-label">Medicamento:</span>
              <span class="medication-value">${recipe.medicamento || 'N/A'}</span>
            </div>
            <div class="medication-item">
              <span class="medication-label">Dosis:</span>
              <span class="medication-value">${recipe.dosis || 'N/A'}</span>
            </div>
            <div class="medication-item">
              <span class="medication-label">Frecuencia:</span>
              <span class="medication-value">${recipe.frecuencia || 'N/A'}</span>
            </div>
            <div class="medication-item">
              <span class="medication-label">Duración:</span>
              <span class="medication-value">${recipe.duracion || 'N/A'}</span>
            </div>
          </div>
          
          ${recipe.observaciones ? `
            <div class="observations">
              <div class="info-title">OBSERVACIONES</div>
              <div>${recipe.observaciones}</div>
            </div>
          ` : ''}
          
          <div class="footer">
            <div>Fecha de emisión: ${formatDate(recipe.createdAt)}</div>
            <div>Receta generada por Vista Médica - Sistema de Gestión Médica</div>
          </div>
        </body>
      </html>
    `;
  };

  // Renderizar contenido del modal
  const renderModalContent = () => {
    if (!recipe) {
      return (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay receta para previsualizar</h3>
          <p className="text-gray-600">Selecciona una receta de la lista para ver su contenido</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <Alert variant="destructive">
            <AlertDescription>
              Error al cargar la previsualización de la receta
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header de la receta */}
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold text-primary mb-2">Vista Médica</h2>
          <p className="text-sm text-gray-600">Sistema de Gestión Médica</p>
          <h3 className="text-xl font-semibold text-gray-900 mt-4">RECETA MÉDICA</h3>
        </div>

        {/* Información del médico y paciente - lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta del Médico */}
          <Card className="rounded-xl shadow-sm border-l-4 border-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-blue-700">Datos del Médico</CardTitle>
              <User className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <Label className="text-gray-500">Nombre:</Label>
                <p className="font-medium text-gray-900">
                  {recipe.doctor?.firstName || 'N/A'} {recipe.doctor?.lastName || 'N/A'}
                </p>
              </div>
              <div>
                <Label className="text-gray-500">Email:</Label>
                <p className="font-medium text-gray-900">{recipe.doctor?.email || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Tarjeta del Paciente */}
          <Card className="rounded-xl shadow-sm border-l-4 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-green-700">Datos del Paciente</CardTitle>
              <User className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <Label className="text-gray-500">Nombre:</Label>
                <p className="font-medium text-gray-900">
                  {recipe.paciente?.firstName || 'N/A'} {recipe.paciente?.lastName || 'N/A'}
                </p>
              </div>
              <div>
                <Label className="text-gray-500">Email:</Label>
                <p className="font-medium text-gray-900">{recipe.paciente?.email || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalles del medicamento */}
        <Card className="rounded-xl shadow-sm border-l-4 border-orange-500">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-orange-700 flex items-center gap-2">
              <Pill className="h-5 w-5 text-orange-500" />
              Medicamento Prescrito
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Medicamento</Label>
                <p className="text-sm text-gray-900 font-medium">{recipe.medicamento || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Dosis</Label>
                <p className="text-sm text-gray-900">{recipe.dosis || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Frecuencia</Label>
                <p className="text-sm text-gray-900">{recipe.frecuencia || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Duración</Label>
                <p className="text-sm text-gray-900">{recipe.duracion || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observaciones */}
        {recipe.observaciones && (
          <Card className="rounded-xl shadow-sm border-l-4 border-yellow-500">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-yellow-700 flex items-center gap-2">
                <FileText className="h-5 w-5 text-yellow-500" />
                Observaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-gray-900 whitespace-pre-wrap">{recipe.observaciones}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fecha de emisión */}
        <div className="text-center text-sm text-gray-600 border-t pt-4">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Fecha de emisión: {formatDate(recipe.createdAt)}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo semitransparente */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4">
        <Card className="rounded-2xl shadow-xl bg-white overflow-hidden">
          {/* Header del modal */}
          <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Previsualización de Receta
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-200 hover:scale-105 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>

          {/* Contenido del modal */}
          <CardContent className="p-6 max-h-[70vh] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-gray-600">Cargando previsualización...</p>
              </div>
            ) : (
              renderModalContent()
            )}
          </CardContent>

          {/* Footer con botones */}
          {recipe && !isError && (
            <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </Button>
              <Button
                onClick={handleDownloadPDF}
                disabled={isLoading}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Descargar PDF
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
