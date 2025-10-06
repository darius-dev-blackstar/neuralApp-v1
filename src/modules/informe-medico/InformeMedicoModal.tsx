import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, User, Calendar, FileText, Save, X } from 'lucide-react';
import { useInformeMedico, CreateInformeMedicoData, UpdateInformeMedicoData, InformeMedico } from './useInformeMedico';
import { useToast } from '@/hooks/use-toast';

interface InformeMedicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (informe: InformeMedico) => void;
  patientId: string;
  patientData: {
    firstName: string;
    lastName: string;
    cedula: string;
    dateOfBirth: string;
  };
  doctorData: {
    firstName: string;
    lastName: string;
    email: string;
    mpps?: string;
    cm?: string;
  };
  informeToEdit?: InformeMedico;
}

interface FormData {
  motivoConsulta: string;
  examenFisico: string;
  diagnostico: string;
  indicacionesTratamiento: string;
  fechaInforme: string;
  firmaMedico: string;
}

interface FormErrors {
  motivoConsulta?: string;
  examenFisico?: string;
  diagnostico?: string;
  indicacionesTratamiento?: string;
  fechaInforme?: string;
}

export default function InformeMedicoModal({
  isOpen,
  onClose,
  onSuccess,
  patientId,
  patientData,
  doctorData,
  informeToEdit
}: InformeMedicoModalProps) {
  const [formData, setFormData] = useState<FormData>({
    motivoConsulta: '',
    examenFisico: '',
    diagnostico: '',
    indicacionesTratamiento: '',
    fechaInforme: new Date().toISOString().split('T')[0],
    firmaMedico: `${doctorData.firstName} ${doctorData.lastName}`
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  
  const { createInforme, updateInforme } = useInformeMedico();
  const { toast } = useToast();

  // Cargar datos del informe si está en modo edición
  useEffect(() => {
    if (informeToEdit) {
      setFormData({
        motivoConsulta: informeToEdit.motivoConsulta || '',
        examenFisico: informeToEdit.examenFisico || '',
        diagnostico: informeToEdit.diagnostico || '',
        indicacionesTratamiento: informeToEdit.indicacionesTratamiento || '',
        fechaInforme: informeToEdit.fechaInforme ? informeToEdit.fechaInforme.split('T')[0] : new Date().toISOString().split('T')[0],
        firmaMedico: informeToEdit.firmaMedico || `${doctorData.firstName} ${doctorData.lastName}`
      });
    } else {
      // Resetear formulario para nuevo informe
      setFormData({
        motivoConsulta: '',
        examenFisico: '',
        diagnostico: '',
        indicacionesTratamiento: '',
        fechaInforme: new Date().toISOString().split('T')[0],
        firmaMedico: `${doctorData.firstName} ${doctorData.lastName}`
      });
    }
    setErrors({});
  }, [informeToEdit, doctorData, isOpen]);

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.motivoConsulta.trim()) {
      newErrors.motivoConsulta = 'El motivo de consulta es requerido';
    }

    if (!formData.examenFisico.trim()) {
      newErrors.examenFisico = 'El examen físico es requerido';
    }

    if (!formData.diagnostico.trim()) {
      newErrors.diagnostico = 'El diagnóstico es requerido';
    }

    if (!formData.indicacionesTratamiento.trim()) {
      newErrors.indicacionesTratamiento = 'Las indicaciones/tratamiento son requeridas';
    }

    if (!formData.fechaInforme) {
      newErrors.fechaInforme = 'La fecha del informe es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calcular edad del paciente
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Guardar informe
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
      
      console.log('💾 Guardando informe para paciente:', patientId);
      console.log('🩺 ID de paciente recibido:', patientId); // Log específico solicitado
      console.log('📋 Datos del formulario:', formData);
      
      const informeData = {
        pacienteId: patientId,  // Corregido: usar patientId como valor
        motivoConsulta: formData.motivoConsulta.trim(),
        examenFisico: formData.examenFisico.trim(),
        diagnostico: formData.diagnostico.trim(),
        indicacionesTratamiento: formData.indicacionesTratamiento.trim(),
        fechaInforme: formData.fechaInforme,
        firmaMedico: formData.firmaMedico.trim()
      };

      console.log('📤 Datos a enviar al backend:', informeData);

      let savedInforme: InformeMedico;
      
      if (informeToEdit) {
        savedInforme = await updateInforme({
          id: informeToEdit.id,
          ...informeData
        });
      } else {
        savedInforme = await createInforme(informeData);
      }

      console.log('✅ Informe guardado exitosamente:', savedInforme);
      onSuccess(savedInforme);
      onClose();
      
    } catch (error: any) {
      console.error('❌ Error guardando informe:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {informeToEdit ? 'Editar Informe Médico' : 'Crear Informe Médico'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {informeToEdit ? 'Modifica los datos del informe médico' : 'Completa los datos del nuevo informe médico'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del médico y paciente */}
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
                    {doctorData.firstName} {doctorData.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Email:</Label>
                  <p className="font-medium text-gray-900">{doctorData.email}</p>
                </div>
                {doctorData.mpps && (
                  <div>
                    <Label className="text-gray-500">MPPS:</Label>
                    <p className="font-medium text-gray-900">{doctorData.mpps}</p>
                  </div>
                )}
                {doctorData.cm && (
                  <div>
                    <Label className="text-gray-500">CM:</Label>
                    <p className="font-medium text-gray-900">{doctorData.cm}</p>
                  </div>
                )}
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
                    {patientData.firstName} {patientData.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Cédula:</Label>
                  <p className="font-medium text-gray-900">{patientData.cedula || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Edad:</Label>
                  <p className="font-medium text-gray-900">
                    {calculateAge(patientData.dateOfBirth)} años
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Fecha de nacimiento:</Label>
                  <p className="font-medium text-gray-900">
                    {patientData.dateOfBirth ? new Date(patientData.dateOfBirth).toLocaleDateString('es-ES') : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campos del formulario */}
          <div className="space-y-6">
            {/* Motivo de consulta */}
            <div className="space-y-2">
              <Label htmlFor="motivoConsulta" className="text-sm font-medium text-gray-700">
                Motivo de consulta *
              </Label>
              <Input
                id="motivoConsulta"
                value={formData.motivoConsulta}
                onChange={(e) => handleInputChange("motivoConsulta", e.target.value)}
                placeholder="Ej: Control de rutina, dolor de cabeza, etc."
                className={`transition-colors ${errors.motivoConsulta ? 'border-red-500 focus:border-red-500' : ''}`}
                disabled={saving}
              />
              {errors.motivoConsulta && (
                <p className="text-sm text-red-600">{errors.motivoConsulta}</p>
              )}
            </div>

            {/* Examen físico */}
            <div className="space-y-2">
              <Label htmlFor="examenFisico" className="text-sm font-medium text-gray-700">
                Examen físico *
              </Label>
              <Textarea
                id="examenFisico"
                value={formData.examenFisico}
                onChange={(e) => handleInputChange("examenFisico", e.target.value)}
                placeholder="Describe los hallazgos del examen físico..."
                rows={4}
                className={`transition-colors ${errors.examenFisico ? 'border-red-500 focus:border-red-500' : ''}`}
                disabled={saving}
              />
              {errors.examenFisico && (
                <p className="text-sm text-red-600">{errors.examenFisico}</p>
              )}
            </div>

            {/* Diagnóstico */}
            <div className="space-y-2">
              <Label htmlFor="diagnostico" className="text-sm font-medium text-gray-700">
                Diagnóstico *
              </Label>
              <Textarea
                id="diagnostico"
                value={formData.diagnostico}
                onChange={(e) => handleInputChange("diagnostico", e.target.value)}
                placeholder="Establece el diagnóstico basado en la evaluación..."
                rows={4}
                className={`transition-colors ${errors.diagnostico ? 'border-red-500 focus:border-red-500' : ''}`}
                disabled={saving}
              />
              {errors.diagnostico && (
                <p className="text-sm text-red-600">{errors.diagnostico}</p>
              )}
            </div>

            {/* Indicaciones/Tratamiento */}
            <div className="space-y-2">
              <Label htmlFor="indicacionesTratamiento" className="text-sm font-medium text-gray-700">
                Indicaciones / Tratamiento sugerido *
              </Label>
              <Textarea
                id="indicacionesTratamiento"
                value={formData.indicacionesTratamiento}
                onChange={(e) => handleInputChange("indicacionesTratamiento", e.target.value)}
                placeholder="Especifica el tratamiento, medicamentos, recomendaciones..."
                rows={4}
                className={`transition-colors ${errors.indicacionesTratamiento ? 'border-red-500 focus:border-red-500' : ''}`}
                disabled={saving}
              />
              {errors.indicacionesTratamiento && (
                <p className="text-sm text-red-600">{errors.indicacionesTratamiento}</p>
              )}
            </div>

            {/* Fecha del informe */}
            <div className="space-y-2">
              <Label htmlFor="fechaInforme" className="text-sm font-medium text-gray-700">
                Fecha del informe *
              </Label>
              <Input
                id="fechaInforme"
                type="date"
                value={formData.fechaInforme}
                onChange={(e) => handleInputChange("fechaInforme", e.target.value)}
                className={`transition-colors ${errors.fechaInforme ? 'border-red-500 focus:border-red-500' : ''}`}
                disabled={saving}
              />
              {errors.fechaInforme && (
                <p className="text-sm text-red-600">{errors.fechaInforme}</p>
              )}
            </div>

            {/* Firma del médico */}
            <div className="space-y-2">
              <Label htmlFor="firmaMedico" className="text-sm font-medium text-gray-700">
                Firma del médico
              </Label>
              <Input
                id="firmaMedico"
                value={formData.firmaMedico}
                onChange={(e) => handleInputChange("firmaMedico", e.target.value)}
                placeholder="Nombre del médico que firma el informe"
                className="transition-colors"
                disabled={saving}
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="hover:scale-105 transition-all duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
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
              {informeToEdit ? 'Actualizar Informe' : 'Guardar Informe'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
