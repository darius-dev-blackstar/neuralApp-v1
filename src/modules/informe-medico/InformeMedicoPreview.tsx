import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  User, 
  Calendar, 
  Stethoscope,
  Pill,
  ClipboardList
} from 'lucide-react';
import { InformeMedico } from './useInformeMedico';

interface InformeMedicoPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  informe: InformeMedico | null;
  onPrint?: () => void;
  onDownloadPDF?: () => void;
}

export default function InformeMedicoPreview({
  isOpen,
  onClose,
  informe,
  onPrint,
  onDownloadPDF
}: InformeMedicoPreviewProps) {
  
  if (!informe) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-600">No hay informe para previsualizar</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  // Renderizar contenido del informe
  const renderInformeContent = () => {
    return (
      <div className="space-y-6">
        {/* Header del informe */}
        <div className="text-center border-b pb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">Sistema de Gestión Médica</h2>
          <p className="text-sm text-gray-600 mb-4">Centro Médico NeuralApp</p>
          <h3 className="text-xl font-semibold text-gray-900">INFORME MÉDICO</h3>
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
                  {informe.doctor?.firstName || 'N/A'} {informe.doctor?.lastName || 'N/A'}
                </p>
              </div>
              <div>
                <Label className="text-gray-500">Email:</Label>
                <p className="font-medium text-gray-900">{informe.doctor?.email || 'N/A'}</p>
              </div>
              {informe.doctor?.mpps && (
                <div>
                  <Label className="text-gray-500">MPPS:</Label>
                  <p className="font-medium text-gray-900">{informe.doctor.mpps}</p>
                </div>
              )}
              {informe.doctor?.cm && (
                <div>
                  <Label className="text-gray-500">CM:</Label>
                  <p className="font-medium text-gray-900">{informe.doctor.cm}</p>
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
                  {informe.paciente?.firstName || 'N/A'} {informe.paciente?.lastName || 'N/A'}
                </p>
              </div>
              <div>
                <Label className="text-gray-500">Cédula:</Label>
                <p className="font-medium text-gray-900">{informe.paciente?.cedula || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-gray-500">Edad:</Label>
                <p className="font-medium text-gray-900">
                  {calculateAge(informe.paciente?.dateOfBirth || '')} años
                </p>
              </div>
              <div>
                <Label className="text-gray-500">Fecha de nacimiento:</Label>
                <p className="font-medium text-gray-900">
                  {informe.paciente?.dateOfBirth ? formatDate(informe.paciente.dateOfBirth) : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Motivo de consulta */}
        <Card className="rounded-xl shadow-sm border-l-4 border-purple-500">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-purple-700 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-purple-500" />
              Motivo de Consulta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-gray-900 whitespace-pre-wrap">{informe.motivoConsulta || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Examen físico */}
        <Card className="rounded-xl shadow-sm border-l-4 border-orange-500">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-orange-700 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-orange-500" />
              Examen Físico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-gray-900 whitespace-pre-wrap">{informe.examenFisico || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Diagnóstico */}
        <Card className="rounded-xl shadow-sm border-l-4 border-red-500">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-red-700 flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-500" />
              Diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-gray-900 whitespace-pre-wrap">{informe.diagnostico || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Indicaciones/Tratamiento */}
        <Card className="rounded-xl shadow-sm border-l-4 border-green-500">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-green-700 flex items-center gap-2">
              <Pill className="h-5 w-5 text-green-500" />
              Indicaciones / Tratamiento Sugerido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-gray-900 whitespace-pre-wrap">{informe.indicacionesTratamiento || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Pie de página con fecha y firma */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Fecha del Informe</span>
              </div>
              <p className="text-sm text-gray-900">{formatDate(informe.fechaInforme)}</p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Firma del Médico</span>
              </div>
              <div className="border-b border-gray-300 w-32 mx-auto mb-2"></div>
              <p className="text-sm text-gray-900">{informe.firmaMedico || 'Dr. ' + (informe.doctor?.firstName || '') + ' ' + (informe.doctor?.lastName || '')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Previsualización del Informe Médico
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contenido del informe */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            {renderInformeContent()}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-center gap-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
            >
              <X className="w-4 h-4" />
              Cerrar
            </Button>
            <Button
              variant="outline"
              onClick={onPrint}
              className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            <Button
              onClick={onDownloadPDF}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
