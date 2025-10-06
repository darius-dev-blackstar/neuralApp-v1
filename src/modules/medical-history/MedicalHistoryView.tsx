import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Clipboard, 
  FileText, 
  User, 
  Calendar,
  AlertCircle,
  Loader2,
  Edit,
  Printer,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { medicalHistoryService, MedicalHistoryData } from "./medicalHistoryService";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cedula?: string;
  dateOfBirth?: string;
  medicalHistory?: string;
}

interface MedicalHistoryViewProps {
  patient: Patient;
  onEdit?: () => void;
}

export default function MedicalHistoryView({ patient, onEdit }: MedicalHistoryViewProps) {
  const { toast } = useToast();
  const [historyData, setHistoryData] = useState<MedicalHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar historia médica
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await medicalHistoryService.getMedicalHistory(patient.id);
        setHistoryData(data);
        
      } catch (error: any) {
        console.error('Error loading medical history:', error);
        setError(error.response?.data?.error || "Error cargando historia médica");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [patient.id]);

  // Formatear fecha
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

  // Generar contenido para impresión
  const generatePrintContent = () => {
    if (!historyData) return '';

    const printData = {
      paciente: `${patient.firstName} ${patient.lastName}`,
      cedula: patient.cedula || 'N/A',
      fecha: formatDate(historyData.fechaActualizacion || new Date().toISOString()),
      ...historyData
    };

    return `
      <html>
      <head>
        <title>Historia Médica - ${printData.paciente}</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 40px; color: #333; line-height: 1.6; }
          .container { max-width: 800px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #458BFF; margin: 0; font-size: 28px; }
          .header p { margin: 5px 0; font-size: 14px; color: #666; }
          .section-title { border-bottom: 2px solid #458BFF; padding-bottom: 8px; margin-top: 30px; margin-bottom: 20px; font-size: 18px; color: #458BFF; }
          .patient-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .info-row { display: flex; margin-bottom: 8px; }
          .info-label { font-weight: bold; width: 150px; color: #555; }
          .info-value { color: #333; }
          .content-section { margin: 20px 0; }
          .content-text { background: #fff; padding: 15px; border-radius: 8px; border-left: 4px solid #458BFF; min-height: 100px; white-space: pre-wrap; }
          .empty-content { color: #999; font-style: italic; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
          @media print {
            body { margin: 0; -webkit-print-color-adjust: exact; }
            .container { border: none; box-shadow: none; padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HISTORIA MÉDICA</h1>
            <p>Clínica Vista Médica</p>
            <p>Fecha de Emisión: ${printData.fecha}</p>
          </div>

          <div class="patient-info">
            <div class="info-row">
              <span class="info-label">Paciente:</span>
              <span class="info-value">${printData.paciente}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Cédula:</span>
              <span class="info-value">${printData.cedula}</span>
            </div>
          </div>

          <div class="section-title">ANTECEDENTES PERSONALES</div>
          <div class="content-section">
            <div class="content-text ${!printData.antecedentesPersonales ? 'empty-content' : ''}">
              ${printData.antecedentesPersonales || 'No registrado'}
            </div>
          </div>

          <div class="section-title">ANTECEDENTES FAMILIARES</div>
          <div class="content-section">
            <div class="content-text ${!printData.antecedentesFamiliares ? 'empty-content' : ''}">
              ${printData.antecedentesFamiliares || 'No registrado'}
            </div>
          </div>

          <div class="section-title">ANTECEDENTES RELATADOS POR EL PACIENTE</div>
          <div class="content-section">
            <div class="content-text ${!printData.antecedentesNarrados ? 'empty-content' : ''}">
              ${printData.antecedentesNarrados || 'No registrado'}
            </div>
          </div>

          <div class="section-title">ALERGIAS</div>
          <div class="content-section">
            <div class="content-text ${!printData.alergias ? 'empty-content' : ''}">
              ${printData.alergias || 'No registrado'}
            </div>
          </div>

          <div class="section-title">MEDICAMENTOS ACTUALES</div>
          <div class="content-section">
            <div class="content-text ${!printData.medicamentosActuales ? 'empty-content' : ''}">
              ${printData.medicamentosActuales || 'No registrado'}
            </div>
          </div>

          <div class="section-title">OBSERVACIONES GENERALES</div>
          <div class="content-section">
            <div class="content-text ${!printData.observacionesGenerales ? 'empty-content' : ''}">
              ${printData.observacionesGenerales || 'No registrado'}
            </div>
          </div>

          <div class="footer">
            <p>Documento generado por el sistema Vista Médica</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Función para imprimir
  const handlePrint = () => {
    const printContent = generatePrintContent();
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      toast({
        title: "Error",
        description: "No se pudo abrir la ventana de impresión. Por favor, permite pop-ups.",
        variant: "destructive",
      });
    }
  };

  // Función para descargar PDF (placeholder)
  const handleDownloadPDF = async () => {
    toast({
      title: "Funcionalidad en desarrollo",
      description: "La descarga de PDF estará disponible pronto.",
      variant: "default",
    });
  };

  // Renderizar contenido según el estado
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando historia médica...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-300" />
          <p className="text-lg font-medium text-gray-900 mb-2">Error cargando historia médica</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="hover:scale-105 transition-all duration-200"
          >
            Reintentar
          </Button>
        </div>
      );
    }

    if (!historyData) {
      return (
        <div className="text-center py-12">
          <Clipboard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay historia médica registrada</h3>
          <p className="text-gray-600 mb-4">
            La historia médica de {patient.firstName} aún no ha sido registrada
          </p>
          {onEdit && (
            <Button 
              onClick={onEdit}
              className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
            >
              <Edit className="w-4 h-4 mr-2" />
              Crear Historia Médica
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Información del paciente */}
        <Card className="rounded-xl shadow-sm border-l-4 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-blue-700">Datos del Paciente</CardTitle>
            <User className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Nombre:</p>
                <p className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
              </div>
              <div>
                <p className="text-gray-500">Cédula:</p>
                <p className="font-medium text-gray-900">{patient.cedula || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Email:</p>
                <p className="font-medium text-gray-900">{patient.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Última Actualización:</p>
                <p className="font-medium text-gray-900">
                  {formatDate(historyData.fechaActualizacion)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Antecedentes Personales */}
        <Card className="rounded-xl shadow-sm border-l-4 border-green-500">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-green-700 flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-green-500" />
              Antecedentes Personales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">
                {historyData.antecedentesPersonales || 'No registrado'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Antecedentes Familiares */}
        <Card className="rounded-xl shadow-sm border-l-4 border-purple-500">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-purple-700 flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-purple-500" />
              Antecedentes Familiares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">
                {historyData.antecedentesFamiliares || 'No registrado'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Antecedentes Relatados por el Paciente */}
        <Card className="rounded-xl shadow-sm border-l-4 border-orange-500">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-orange-700 flex items-center gap-2">
              <User className="h-5 w-5 text-orange-500" />
              Antecedentes Relatados por el Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-gray-900 whitespace-pre-wrap">
                {historyData.antecedentesNarrados || 'No registrado'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alergias */}
        <Card className="rounded-xl shadow-sm border-l-4 border-red-500">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-red-700 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Alergias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-gray-900 whitespace-pre-wrap">
                {historyData.alergias || 'No registrado'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Medicamentos Actuales */}
        <Card className="rounded-xl shadow-sm border-l-4 border-indigo-500">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-indigo-700 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              Medicamentos Actuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <p className="text-gray-900 whitespace-pre-wrap">
                {historyData.medicamentosActuales || 'No registrado'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Observaciones Generales */}
        <Card className="rounded-xl shadow-sm border-l-4 border-gray-500">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-700 flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-gray-500" />
              Observaciones Generales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">
                {historyData.observacionesGenerales || 'No registrado'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          {onEdit && (
            <Button
              onClick={onEdit}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
            >
              <Edit className="w-4 h-4" />
              Editar Historia
            </Button>
          )}
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
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="rounded-2xl shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Clipboard className="w-5 h-5 text-primary" />
          Historia Médica Completa
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
