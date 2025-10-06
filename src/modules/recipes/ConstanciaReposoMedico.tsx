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
  Save
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

interface ConstanciaReposoMedicoProps {
  patient: Patient;
  doctor: Doctor;
  onClose?: () => void;
  onSuccess?: (constancia: any) => void;
}

interface ReposoData {
  // Campos automáticos
  pacienteNombre: string;
  pacienteEdad: number;
  pacienteCedula: string;
  medicoNombre: string;
  medicoMpps: string;
  medicoCm: string;
  fechaElaboracion: string;
  
  // Campos manuales
  diagnostico: string;
  reposoDesde: string;
  reposoHasta: string;
  diasReposo: number;
}

export default function ConstanciaReposoMedico({ patient, doctor, onClose, onSuccess }: ConstanciaReposoMedicoProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [savedConstancia, setSavedConstancia] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Estado para campos manuales
  const [formData, setFormData] = useState({
    diagnostico: '',
    reposoDesde: '',
    reposoHasta: '',
    diasReposo: 0
  });

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

  // Generar datos para PDF
  const generateReposoData = (): ReposoData => {
    return {
      // Campos automáticos
      pacienteNombre: `${patient.firstName} ${patient.lastName}`,
      pacienteEdad: calculateAge(patient.dateOfBirth),
      pacienteCedula: patient.cedula || 'N/A',
      medicoNombre: `${doctor.firstName} ${doctor.lastName}`,
      medicoMpps: doctor.mpps || 'N/A',
      medicoCm: doctor.cm || 'N/A',
      fechaElaboracion: formatDate(new Date().toISOString()),
      
      // Campos manuales
      diagnostico: formData.diagnostico,
      reposoDesde: formatDate(formData.reposoDesde),
      reposoHasta: formatDate(formData.reposoHasta),
      diasReposo: formData.diasReposo
    };
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

      const reposoData = generateReposoData();
      const printContent = generatePrintContent(reposoData);
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
  const generatePrintContent = (data: ReposoData) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Constancia de Reposo Médico - ${data.pacienteNombre}</title>
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
            .clinic-info {
              font-size: 14px;
              color: #666;
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
            .reposo-details {
              margin: 30px 0;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
              background: #fff;
            }
            .diagnostico {
              margin: 20px 0;
              padding: 15px;
              background: #fff3cd;
              border-radius: 8px;
              border-left: 4px solid #FF7829;
            }
            .diagnostico-label {
              font-weight: bold;
              color: #FF7829;
              margin-bottom: 10px;
            }
            .reposo-period {
              margin: 20px 0;
              padding: 15px;
              background: #d1ecf1;
              border-radius: 8px;
              border-left: 4px solid #458BFF;
            }
            .reposo-period-label {
              font-weight: bold;
              color: #458BFF;
              margin-bottom: 10px;
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
              .no-print { display: none; }
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
              <span class="info-value">${data.pacienteNombre}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Edad:</span>
              <span class="info-value">${data.pacienteEdad} años</span>
            </div>
            <div class="info-row">
              <span class="info-label">Cédula de Identidad:</span>
              <span class="info-value">${data.pacienteCedula}</span>
            </div>
          </div>
          
          <div class="doctor-info">
            <div class="info-title">DATOS DEL MÉDICO</div>
            <div class="info-row">
              <span class="info-label">Médico Tratante:</span>
              <span class="info-value">${data.medicoNombre}</span>
            </div>
            <div class="info-row">
              <span class="info-label">MPPS:</span>
              <span class="info-value">${data.medicoMpps}</span>
            </div>
            <div class="info-row">
              <span class="info-label">CM:</span>
              <span class="info-value">${data.medicoCm}</span>
            </div>
          </div>
          
          <div class="reposo-details">
            <div class="diagnostico">
              <div class="diagnostico-label">DIAGNÓSTICO:</div>
              <div>${data.diagnostico || 'No especificado'}</div>
            </div>
            
            <div class="reposo-period">
              <div class="reposo-period-label">PERÍODO DE REPOSO:</div>
              <div class="info-row">
                <span class="info-label">Desde:</span>
                <span class="info-value">${data.reposoDesde}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Hasta:</span>
                <span class="info-value">${data.reposoHasta}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Días de reposo:</span>
                <span class="info-value">${data.diasReposo} días</span>
              </div>
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
            <div>Fecha de elaboración: ${data.fechaElaboracion}</div>
            <div>Constancia generada por Vista Médica - Sistema de Gestión Médica</div>
          </div>
        </body>
      </html>
    `;
  };

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
        observaciones: formData.diagnostico // Usar diagnóstico como observaciones por ahora
      };
      
      const savedConstancia = await constanciasService.createConstancia(constanciaData);
      setSavedConstancia(savedConstancia);
      
      toast({
        title: "Éxito",
        description: "Constancia de reposo guardada correctamente",
        variant: "default",
      });
      
      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess(savedConstancia);
      }
      
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

  // Función para previsualizar PDF
  const handlePreviewPDF = () => {
    if (!validateForm()) return;
    
    const reposoData = generateReposoData();
    console.log('Datos para PDF:', reposoData);
    
    toast({
      title: "Datos generados",
      description: "Los datos están listos para la plantilla de PDF. Revisa la consola.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-primary mb-2">Vista Médica</h2>
        <p className="text-sm text-gray-600">Sistema de Gestión Médica</p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">CONSTANCIA DE REPOSO MÉDICO</h3>
      </div>

      {/* Información del paciente */}
      <Card className="bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <User className="w-5 h-5" />
            Datos del Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Información del médico */}
      <Card className="bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <User className="w-5 h-5" />
            Datos del Médico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

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

      {/* Mensaje de éxito cuando se guarda */}
      {savedConstancia && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✅ Constancia de reposo guardada exitosamente. Ahora puedes imprimir o descargar el documento.
          </AlertDescription>
        </Alert>
      )}

      {/* Fecha de elaboración */}
      <div className="text-center text-sm text-gray-600 border-t pt-4">
        <div className="flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          Fecha de elaboración: {formatDate(new Date().toISOString())}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:scale-105 transition-all duration-200"
          >
            Cancelar
          </Button>
        )}
        
        {!savedConstancia ? (
          // Botones antes de guardar
          <>
            <Button
              variant="outline"
              onClick={handlePreviewPDF}
              className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              Previsualizar PDF
            </Button>
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
          </>
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
          </>
        )}
      </div>
    </div>
  );
}
