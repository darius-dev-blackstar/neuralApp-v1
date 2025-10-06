import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Calendar, 
  User, 
  Printer, 
  Download, 
  AlertCircle,
  Loader2,
  Clock,
  CalendarDays,
  X,
  UserCheck,
  Stethoscope,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Constancia } from "./constanciasService";

interface ConstanciaViewModalProps {
  constancia: Constancia | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConstanciaViewModal({ 
  constancia, 
  isOpen, 
  onClose 
}: ConstanciaViewModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

  // Formatear período de reposo
  const formatReposoPeriod = () => {
    if (!constancia?.reposoDesde || !constancia?.reposoHasta) {
      return "N/A";
    }
    
    try {
      const desde = new Date(constancia.reposoDesde).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      const hasta = new Date(constancia.reposoHasta).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      
      return `${desde} - ${hasta}`;
    } catch {
      return "N/A";
    }
  };

  // Función para obtener el color del badge según el estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-800';
      case 'vencida':
        return 'bg-red-100 text-red-800';
      case 'cancelada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Función para imprimir
  const handlePrint = () => {
    try {
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
        description: "Error al imprimir la constancia",
        variant: "destructive",
      });
    }
  };

  // Función para descargar PDF
  const handleDownloadPDF = async () => {
    try {
      setIsLoading(true);
      
      toast({
        title: "Funcionalidad en desarrollo",
        description: "La descarga de PDF estará disponible próximamente",
        variant: "default",
      });
      
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
    if (!constancia) return '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Constancia de Reposo Médico - ${constancia.paciente?.firstName} ${constancia.paciente?.lastName}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
              color: #333;
              line-height: 1.6;
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
            .document-title {
              font-size: 20px;
              font-weight: bold;
              text-align: center;
              margin: 30px 0;
              color: #333;
              text-transform: uppercase;
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
              font-size: 16px;
            }
            .info-row {
              margin: 8px 0;
              display: flex;
              justify-content: space-between;
            }
            .info-label {
              font-weight: bold;
              color: #333;
            }
            .info-value {
              color: #666;
            }
            .diagnostico {
              margin: 20px 0;
              padding: 15px;
              background: #fff3cd;
              border-radius: 8px;
              border-left: 4px solid #FF7829;
            }
            .reposo-period {
              margin: 20px 0;
              padding: 15px;
              background: #d1ecf1;
              border-radius: 8px;
              border-left: 4px solid #458BFF;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            .signature-section {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .signature-box {
              text-align: center;
              border-top: 1px solid #333;
              width: 200px;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">Vista Médica</div>
            <div class="clinic-info">Sistema de Gestión Médica</div>
          </div>
          
          <div class="document-title">Constancia de Reposo Médico</div>
          
          <div class="patient-info">
            <div class="info-title">DATOS DEL PACIENTE</div>
            <div class="info-row">
              <span class="info-label">Nombre completo:</span>
              <span class="info-value">${constancia.paciente?.firstName || 'N/A'} ${constancia.paciente?.lastName || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Cédula de Identidad:</span>
              <span class="info-value">${constancia.paciente?.cedula || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${constancia.paciente?.email || 'N/A'}</span>
            </div>
          </div>
          
          <div class="doctor-info">
            <div class="info-title">DATOS DEL MÉDICO</div>
            <div class="info-row">
              <span class="info-label">Médico Tratante:</span>
              <span class="info-value">${constancia.doctor?.firstName || 'N/A'} ${constancia.doctor?.lastName || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${constancia.doctor?.email || 'N/A'}</span>
            </div>
          </div>
          
          <div class="diagnostico">
            <div class="info-title">DIAGNÓSTICO:</div>
            <div>${constancia.diagnostico || 'N/A'}</div>
          </div>
          
          <div class="reposo-period">
            <div class="info-title">PERÍODO DE REPOSO:</div>
            <div class="info-row">
              <span class="info-label">Desde:</span>
              <span class="info-value">${constancia.reposoDesde ? formatDate(constancia.reposoDesde) : 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Hasta:</span>
              <span class="info-value">${constancia.reposoHasta ? formatDate(constancia.reposoHasta) : 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Días de reposo:</span>
              <span class="info-value">${constancia.diasReposo || 'N/A'} días</span>
            </div>
          </div>
          
          <div class="signature-section">
            <div class="signature-box">
              <div>_________________________</div>
              <div>Firma del Médico</div>
            </div>
            <div class="signature-box">
              <div>_________________________</div>
              <div>Sello y Firma</div>
            </div>
          </div>
          
          <div class="footer">
            <div>Fecha de elaboración: ${formatDate(constancia.createdAt)}</div>
            <div>Constancia generada por Vista Médica</div>
          </div>
        </body>
      </html>
    `;
  };

  if (!isOpen || !constancia) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg bg-white">
        {/* Header del modal */}
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Constancia de Reposo</h2>
                <p className="text-sm text-gray-600">
                  {constancia.paciente?.firstName} {constancia.paciente?.lastName} - {formatDate(constancia.createdAt)}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 space-y-6">
          {/* Estado de la constancia */}
          <div className="flex items-center justify-between">
            <Badge className={getEstadoColor(constancia.estado)}>
              {constancia.estado || 'N/A'}
            </Badge>
            <div className="text-sm text-gray-600">
              ID: {constancia.id.slice(-8)}
            </div>
          </div>

          {/* Tarjetas de información */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tarjeta del Doctor */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Datos del Médico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Médico Tratante</Label>
                  <p className="text-sm text-gray-900 font-medium">
                    {constancia.doctor?.firstName || 'N/A'} {constancia.doctor?.lastName || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-sm text-gray-900">{constancia.doctor?.email || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Fecha de Emisión</Label>
                  <p className="text-sm text-gray-900">{formatDate(constancia.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tarjeta del Paciente */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Datos del Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nombre completo</Label>
                  <p className="text-sm text-gray-900 font-medium">
                    {constancia.paciente?.firstName || 'N/A'} {constancia.paciente?.lastName || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Cédula de Identidad</Label>
                  <p className="text-sm text-gray-900">{constancia.paciente?.cedula || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-sm text-gray-900">{constancia.paciente?.email || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información del reposo */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-orange-700 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Información del Reposo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Diagnóstico */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Diagnóstico</Label>
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-900">{constancia.diagnostico || 'N/A'}</p>
                </div>
              </div>

              {/* Período de reposo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Reposo Desde</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-900">
                      {constancia.reposoDesde ? formatDate(constancia.reposoDesde) : 'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Reposo Hasta</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-900">
                      {constancia.reposoHasta ? formatDate(constancia.reposoHasta) : 'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Días de Reposo</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-900">{constancia.diasReposo || 'N/A'} días</p>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {constancia.observaciones && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Observaciones</Label>
                  <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-900">{constancia.observaciones}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer del modal */}
        <div className="sticky bottom-0 bg-white z-10 p-6 border-t border-gray-100 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="hover:scale-105 transition-all duration-200"
            >
              Cerrar
            </Button>
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
        </div>
      </div>
    </div>
  );
}
