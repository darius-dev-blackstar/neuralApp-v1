import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Save,
  X,
  UserCheck,
  Stethoscope
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { constanciasService, CreateConstanciaData } from "./constanciasService";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  cedula: string;
  email: string;
  phone: string;
  address: string;
}

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mpps?: string;
  cm?: string;
}

interface ConstanciaCreateModalProps {
  patient: Patient;
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (constancia: any) => void;
}

export default function ConstanciaCreateModal({ 
  patient, 
  doctor, 
  isOpen, 
  onClose, 
  onSuccess 
}: ConstanciaCreateModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedConstancia, setSavedConstancia] = useState<any>(null);

  // Estado para campos manuales
  const [formData, setFormData] = useState({
    diagnostico: '',
    reposoDesde: '',
    reposoHasta: '',
    diasReposo: 0
  });

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        diagnostico: '',
        reposoDesde: '',
        reposoHasta: '',
        diasReposo: 0
      });
      setSavedConstancia(null);
    }
  }, [isOpen]);

  // Calcular edad del paciente
  const calculateAge = (birthDate: string): number => {
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return 0;
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return "N/A";
    }
  };

  // Manejar cambios en campos manuales
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calcular días de reposo automáticamente
  useEffect(() => {
    if (formData.reposoDesde && formData.reposoHasta) {
      try {
        const desde = new Date(formData.reposoDesde);
        const hasta = new Date(formData.reposoHasta);
        const diffTime = Math.abs(hasta.getTime() - desde.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días
        
        if (diffDays > 0) {
          setFormData(prev => ({
            ...prev,
            diasReposo: diffDays
          }));
        }
      } catch (error) {
        console.error('Error calculating days:', error);
      }
    }
  }, [formData.reposoDesde, formData.reposoHasta]);

  // Validar formulario
  const validateForm = () => {
    if (!formData.diagnostico.trim()) {
      toast({
        title: "Error de validación",
        description: "El diagnóstico es requerido",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.reposoDesde) {
      toast({
        title: "Error de validación",
        description: "La fecha de inicio del reposo es requerida",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.reposoHasta) {
      toast({
        title: "Error de validación",
        description: "La fecha de fin del reposo es requerida",
        variant: "destructive",
      });
      return false;
    }
    if (formData.diasReposo <= 0) {
      toast({
        title: "Error de validación",
        description: "Los días de reposo deben ser mayor a 0",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // Función para guardar la constancia
  const handleSaveConstancia = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSaving(true);
      
      const constanciaData: CreateConstanciaData = {
        pacienteId: patient.id,
        tipo: 'reposo',
        diagnostico: formData.diagnostico,
        reposoDesde: formData.reposoDesde,
        reposoHasta: formData.reposoHasta,
        diasReposo: formData.diasReposo,
        observaciones: formData.diagnostico
      };
      
      const savedConstancia = await constanciasService.createConstancia(constanciaData);
      setSavedConstancia(savedConstancia);
      
      toast({
        title: "Éxito",
        description: "Constancia de reposo guardada correctamente",
        variant: "default",
      });
      
    } catch (error: any) {
      console.error('Error saving constancia:', error);
      
      if (error.response?.status === 401) {
        toast({
          title: "Sesión expirada",
          description: "Por favor inicia sesión nuevamente",
          variant: "destructive",
        });
        
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        window.location.href = "/login";
        return;
      }
      
      toast({
        title: "Error",
        description: "Error al guardar la constancia",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Constancia de Reposo Médico - ${patient.firstName} ${patient.lastName}</title>
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
              <span class="info-value">${patient.firstName} ${patient.lastName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Edad:</span>
              <span class="info-value">${calculateAge(patient.dateOfBirth)} años</span>
            </div>
            <div class="info-row">
              <span class="info-label">Cédula de Identidad:</span>
              <span class="info-value">${patient.cedula || 'N/A'}</span>
            </div>
          </div>
          
          <div class="doctor-info">
            <div class="info-title">DATOS DEL MÉDICO</div>
            <div class="info-row">
              <span class="info-label">Médico Tratante:</span>
              <span class="info-value">${doctor.firstName} ${doctor.lastName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">MPPS:</span>
              <span class="info-value">${doctor.mpps || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">CM:</span>
              <span class="info-value">${doctor.cm || 'N/A'}</span>
            </div>
          </div>
          
          <div class="diagnostico">
            <div class="info-title">DIAGNÓSTICO:</div>
            <div>${formData.diagnostico}</div>
          </div>
          
          <div class="reposo-period">
            <div class="info-title">PERÍODO DE REPOSO:</div>
            <div class="info-row">
              <span class="info-label">Desde:</span>
              <span class="info-value">${formatDate(formData.reposoDesde)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Hasta:</span>
              <span class="info-value">${formatDate(formData.reposoHasta)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Días de reposo:</span>
              <span class="info-value">${formData.diasReposo} días</span>
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
            <div>Fecha de elaboración: ${formatDate(new Date().toISOString())}</div>
            <div>Constancia generada por Vista Médica</div>
          </div>
        </body>
      </html>
    `;
  };

  // Función para continuar después de guardar
  const handleContinue = () => {
    if (onSuccess) {
      onSuccess(savedConstancia);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg bg-white">
        {/* Header del modal */}
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Crear Constancia de Reposo</h2>
                <p className="text-sm text-gray-600">Complete los datos para generar la constancia médica</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 space-y-6">
          {/* Mensaje de éxito cuando se guarda */}
          {savedConstancia && (
            <Alert className="border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ✅ Constancia de reposo guardada exitosamente. Ahora puedes imprimir o descargar el documento.
              </AlertDescription>
            </Alert>
          )}

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
                    {doctor.firstName} {doctor.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">MPPS</Label>
                  <p className="text-sm text-gray-900">{doctor.mpps || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">CM</Label>
                  <p className="text-sm text-gray-900">{doctor.cm || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-sm text-gray-900">{doctor.email || 'N/A'}</p>
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
                    {patient.firstName} {patient.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Edad</Label>
                  <p className="text-sm text-gray-900">{calculateAge(patient.dateOfBirth)} años</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Cédula de Identidad</Label>
                  <p className="text-sm text-gray-900">{patient.cedula || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-sm text-gray-900">{patient.email || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campos manuales */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-orange-700 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Información del Reposo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Diagnóstico */}
              <div className="space-y-2">
                <Label htmlFor="diagnostico" className="text-sm font-medium text-gray-700">
                  Diagnóstico *
                </Label>
                <Textarea
                  id="diagnostico"
                  value={formData.diagnostico}
                  onChange={(e) => handleInputChange('diagnostico', e.target.value)}
                  placeholder="Ingrese el diagnóstico del paciente..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Fechas de reposo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reposoDesde" className="text-sm font-medium text-gray-700">
                    Reposo Desde *
                  </Label>
                  <Input
                    id="reposoDesde"
                    type="date"
                    value={formData.reposoDesde}
                    onChange={(e) => handleInputChange('reposoDesde', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reposoHasta" className="text-sm font-medium text-gray-700">
                    Reposo Hasta *
                  </Label>
                  <Input
                    id="reposoHasta"
                    type="date"
                    value={formData.reposoHasta}
                    onChange={(e) => handleInputChange('reposoHasta', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Días de reposo */}
              <div className="space-y-2">
                <Label htmlFor="diasReposo" className="text-sm font-medium text-gray-700">
                  Días de Reposo
                </Label>
                <Input
                  id="diasReposo"
                  type="number"
                  value={formData.diasReposo}
                  onChange={(e) => handleInputChange('diasReposo', parseInt(e.target.value) || 0)}
                  placeholder="Se calcula automáticamente"
                  className="w-full"
                  readOnly
                />
                <p className="text-xs text-gray-500">
                  Se calcula automáticamente basado en las fechas seleccionadas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Fecha de elaboración */}
          <div className="text-center text-sm text-gray-600 border-t pt-4">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha de elaboración: {formatDate(new Date().toISOString())}
            </div>
          </div>
        </div>

        {/* Footer del modal */}
        <div className="sticky bottom-0 bg-white z-10 p-6 border-t border-gray-100 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="hover:scale-105 transition-all duration-200"
            >
              Cancelar
            </Button>
            
            {!savedConstancia ? (
              // Botón antes de guardar
              <Button
                onClick={handleSaveConstancia}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Guardar Constancia
              </Button>
            ) : (
              // Botones después de guardar
              <>
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
                <Button
                  onClick={handleContinue}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                >
                  Continuar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
