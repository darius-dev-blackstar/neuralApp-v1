import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Clipboard, 
  Save, 
  Loader2, 
  AlertCircle, 
  FileText,
  User,
  Calendar,
  Stethoscope
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "../../services/auth";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cedula?: string;
  dateOfBirth?: string;
  medicalHistory?: string;
}

interface MedicalHistoryFormProps {
  patient: Patient;
  onSuccess?: (updatedHistory: string) => void;
  onCancel?: () => void;
}

interface FormData {
  antecedentesPersonales: string;
  antecedentesFamiliares: string;
  antecedentesNarrados: string;
  alergias: string;
  medicamentosActuales: string;
  observacionesGenerales: string;
}

interface FormErrors {
  antecedentesPersonales?: string;
  antecedentesFamiliares?: string;
  antecedentesNarrados?: string;
  alergias?: string;
  medicamentosActuales?: string;
  observacionesGenerales?: string;
}

export default function MedicalHistoryForm({ patient, onSuccess, onCancel }: MedicalHistoryFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    antecedentesPersonales: '',
    antecedentesFamiliares: '',
    antecedentesNarrados: '',
    alergias: '',
    medicamentosActuales: '',
    observacionesGenerales: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Cargar historia médica existente
  useEffect(() => {
    if (patient.medicalHistory) {
      try {
        const historyData = JSON.parse(patient.medicalHistory);
        setFormData({
          antecedentesPersonales: historyData.antecedentesPersonales || '',
          antecedentesFamiliares: historyData.antecedentesFamiliares || '',
          antecedentesNarrados: historyData.antecedentesNarrados || '',
          alergias: historyData.alergias || '',
          medicamentosActuales: historyData.medicamentosActuales || '',
          observacionesGenerales: historyData.observacionesGenerales || ''
        });
      } catch (error) {
        console.error('Error parsing medical history:', error);
        // Si no se puede parsear, usar el texto como antecedentes narrados
        setFormData(prev => ({
          ...prev,
          antecedentesNarrados: patient.medicalHistory || ''
        }));
      }
    }
  }, [patient.medicalHistory]);

  // Manejar cambios en los inputs
  const handleInputChange = (field: keyof FormData, value: string) => {
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
    const newErrors: FormErrors = {};
    
    // Validar longitud máxima de campos de texto
    if (formData.antecedentesNarrados.length > 5000) {
      newErrors.antecedentesNarrados = "Los antecedentes narrados no pueden exceder 5000 caracteres";
    }
    
    if (formData.antecedentesPersonales.length > 2000) {
      newErrors.antecedentesPersonales = "Los antecedentes personales no pueden exceder 2000 caracteres";
    }
    
    if (formData.antecedentesFamiliares.length > 2000) {
      newErrors.antecedentesFamiliares = "Los antecedentes familiares no pueden exceder 2000 caracteres";
    }
    
    if (formData.alergias.length > 1000) {
      newErrors.alergias = "Las alergias no pueden exceder 1000 caracteres";
    }
    
    if (formData.medicamentosActuales.length > 1000) {
      newErrors.medicamentosActuales = "Los medicamentos actuales no pueden exceder 1000 caracteres";
    }
    
    if (formData.observacionesGenerales.length > 2000) {
      newErrors.observacionesGenerales = "Las observaciones generales no pueden exceder 2000 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar historia médica
  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor, corrige los errores antes de guardar",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      const historyData = {
        antecedentesPersonales: formData.antecedentesPersonales,
        antecedentesFamiliares: formData.antecedentesFamiliares,
        antecedentesNarrados: formData.antecedentesNarrados,
        alergias: formData.alergias,
        medicamentosActuales: formData.medicamentosActuales,
        observacionesGenerales: formData.observacionesGenerales,
        fechaActualizacion: new Date().toISOString()
      };

      const response = await apiClient.put(`/api/patients/${patient.id}`, {
        medicalHistory: JSON.stringify(historyData)
      });

      toast({
        title: "Éxito",
        description: "Historia médica guardada correctamente",
        variant: "default",
      });

      // Mostrar previsualización inmediatamente
      handlePrint();
      
      if (onSuccess) {
        onSuccess(JSON.stringify(historyData));
      }
      
    } catch (error: any) {
      console.error('Error saving medical history:', error);
      
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
        description: error.response?.data?.error || "Error al guardar la historia médica",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Generar contenido para impresión
  const generatePrintContent = () => {
    const printData = {
      paciente: `${patient.firstName} ${patient.lastName}`,
      cedula: patient.cedula || 'N/A',
      fecha: new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      ...formData
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
          .content-text { background: #fff; padding: 15px; border-radius: 8px; border-left: 4px solid #458BFF; min-height: 100px; }
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
            <div class="content-text">${printData.antecedentesPersonales || 'No registrado'}</div>
          </div>

          <div class="section-title">ANTECEDENTES FAMILIARES</div>
          <div class="content-section">
            <div class="content-text">${printData.antecedentesFamiliares || 'No registrado'}</div>
          </div>

          <div class="section-title">ANTECEDENTES RELATADOS POR EL PACIENTE</div>
          <div class="content-section">
            <div class="content-text">${printData.antecedentesNarrados || 'No registrado'}</div>
          </div>

          <div class="section-title">ALERGIAS</div>
          <div class="content-section">
            <div class="content-text">${printData.alergias || 'No registrado'}</div>
          </div>

          <div class="section-title">MEDICAMENTOS ACTUALES</div>
          <div class="content-section">
            <div class="content-text">${printData.medicamentosActuales || 'No registrado'}</div>
          </div>

          <div class="section-title">OBSERVACIONES GENERALES</div>
          <div class="content-section">
            <div class="content-text">${printData.observacionesGenerales || 'No registrado'}</div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Historia Médica</h2>
        <p className="text-gray-600">Información médica completa de {patient.firstName} {patient.lastName}</p>
      </div>

      {/* Información del paciente */}
      <Card className="rounded-xl shadow-sm border-l-4 border-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium text-blue-700">Datos del Paciente</CardTitle>
          <User className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-500">Nombre:</Label>
              <p className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
            </div>
            <div>
              <Label className="text-gray-500">Cédula:</Label>
              <p className="font-medium text-gray-900">{patient.cedula || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-gray-500">Email:</Label>
              <p className="font-medium text-gray-900">{patient.email}</p>
            </div>
            <div>
              <Label className="text-gray-500">Fecha de Nacimiento:</Label>
              <p className="font-medium text-gray-900">
                {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString("es-ES") : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Historia Médica */}
      <Card className="rounded-xl shadow-sm border-l-4 border-green-500">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-green-700 flex items-center gap-2">
            <Clipboard className="h-5 w-5 text-green-500" />
            Información Médica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Antecedentes Personales */}
          <div className="space-y-2">
            <Label htmlFor="antecedentesPersonales" className="text-sm font-medium text-gray-700">
              Antecedentes Personales
            </Label>
            <Textarea
              id="antecedentesPersonales"
              value={formData.antecedentesPersonales}
              onChange={(e) => handleInputChange('antecedentesPersonales', e.target.value)}
              placeholder="Enfermedades previas, cirugías, hospitalizaciones..."
              rows={4}
              className={`resize-none ${errors.antecedentesPersonales ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.antecedentesPersonales && (
              <p className="text-red-500 text-xs">{errors.antecedentesPersonales}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.antecedentesPersonales.length}/2000 caracteres
            </p>
          </div>

          {/* Antecedentes Familiares */}
          <div className="space-y-2">
            <Label htmlFor="antecedentesFamiliares" className="text-sm font-medium text-gray-700">
              Antecedentes Familiares
            </Label>
            <Textarea
              id="antecedentesFamiliares"
              value={formData.antecedentesFamiliares}
              onChange={(e) => handleInputChange('antecedentesFamiliares', e.target.value)}
              placeholder="Enfermedades hereditarias, antecedentes familiares relevantes..."
              rows={4}
              className={`resize-none ${errors.antecedentesFamiliares ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.antecedentesFamiliares && (
              <p className="text-red-500 text-xs">{errors.antecedentesFamiliares}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.antecedentesFamiliares.length}/2000 caracteres
            </p>
          </div>

          {/* Antecedentes Relatados por el Paciente */}
          <div className="space-y-2">
            <Label htmlFor="antecedentesNarrados" className="text-sm font-medium text-gray-700">
              Antecedentes Relatados por el Paciente <span className="text-orange-500">*</span>
            </Label>
            <Textarea
              id="antecedentesNarrados"
              value={formData.antecedentesNarrados}
              onChange={(e) => handleInputChange('antecedentesNarrados', e.target.value)}
              placeholder="Desarrolla aquí los antecedentes narrados por el paciente en sus propias palabras..."
              rows={6}
              className={`resize-none ${errors.antecedentesNarrados ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.antecedentesNarrados && (
              <p className="text-red-500 text-xs">{errors.antecedentesNarrados}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.antecedentesNarrados.length}/5000 caracteres
            </p>
          </div>

          {/* Alergias */}
          <div className="space-y-2">
            <Label htmlFor="alergias" className="text-sm font-medium text-gray-700">
              Alergias
            </Label>
            <Textarea
              id="alergias"
              value={formData.alergias}
              onChange={(e) => handleInputChange('alergias', e.target.value)}
              placeholder="Alergias conocidas a medicamentos, alimentos, etc..."
              rows={3}
              className={`resize-none ${errors.alergias ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.alergias && (
              <p className="text-red-500 text-xs">{errors.alergias}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.alergias.length}/1000 caracteres
            </p>
          </div>

          {/* Medicamentos Actuales */}
          <div className="space-y-2">
            <Label htmlFor="medicamentosActuales" className="text-sm font-medium text-gray-700">
              Medicamentos Actuales
            </Label>
            <Textarea
              id="medicamentosActuales"
              value={formData.medicamentosActuales}
              onChange={(e) => handleInputChange('medicamentosActuales', e.target.value)}
              placeholder="Medicamentos que el paciente está tomando actualmente..."
              rows={3}
              className={`resize-none ${errors.medicamentosActuales ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.medicamentosActuales && (
              <p className="text-red-500 text-xs">{errors.medicamentosActuales}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.medicamentosActuales.length}/1000 caracteres
            </p>
          </div>

          {/* Observaciones Generales */}
          <div className="space-y-2">
            <Label htmlFor="observacionesGenerales" className="text-sm font-medium text-gray-700">
              Observaciones Generales
            </Label>
            <Textarea
              id="observacionesGenerales"
              value={formData.observacionesGenerales}
              onChange={(e) => handleInputChange('observacionesGenerales', e.target.value)}
              placeholder="Observaciones adicionales del médico..."
              rows={4}
              className={`resize-none ${errors.observacionesGenerales ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.observacionesGenerales && (
              <p className="text-red-500 text-xs">{errors.observacionesGenerales}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.observacionesGenerales.length}/2000 caracteres
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="hover:scale-105 transition-all duration-200"
          >
            Cancelar
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
        >
          <FileText className="w-4 h-4" />
          Imprimir
        </Button>
        <Button
          onClick={handleDownloadPDF}
          disabled={loading}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          Descargar PDF
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Guardar Historia
        </Button>
      </div>
    </div>
  );
}
