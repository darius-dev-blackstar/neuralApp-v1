import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, FileText, Calendar, User, Trash2, Eye } from 'lucide-react';
import { useInformeMedico, InformeMedico } from './useInformeMedico';
import { useToast } from '@/hooks/use-toast';

interface InformeMedicoListProps {
  patientId: string;
  onCreateInforme: () => void;
  onViewInforme: (informe: InformeMedico) => void;
  refreshKey?: number; // Nuevo prop para refrescar la lista
}

export default function InformeMedicoList({ 
  patientId, 
  onCreateInforme, 
  onViewInforme,
  refreshKey = 0 // Valor por defecto
}: InformeMedicoListProps) {
  const [informes, setInformes] = useState<InformeMedico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getInformesByPaciente, deleteInforme } = useInformeMedico();
  const { toast } = useToast();

  // Cargar informes del paciente
  const loadInformes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando informes para paciente:', patientId);
      
      const data = await getInformesByPaciente(patientId);
      console.log('✅ Informes cargados exitosamente:', data);
      console.log('📊 Cantidad de informes:', data.length);
      setInformes(data);
    } catch (error: any) {
      console.error('❌ Error cargando informes:', error);
      setError(error.message);
      toast({
        title: "Error cargando informes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      console.log('🔄 Refrescando lista de informes para paciente:', patientId, 'refreshKey:', refreshKey);
      loadInformes();
    }
  }, [patientId, refreshKey]); // Agregar refreshKey como dependencia

  // Eliminar informe
  const handleDeleteInforme = async (informeId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este informe médico?')) {
      return;
    }

    try {
      await deleteInforme(informeId);
      await loadInformes(); // Recargar la lista
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Obtener resumen del diagnóstico
  const getDiagnosticoResumen = (diagnostico: string) => {
    if (!diagnostico) return 'Sin diagnóstico';
    return diagnostico.length > 100 
      ? `${diagnostico.substring(0, 100)}...` 
      : diagnostico;
  };

  // Renderizar contenido
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Cargando informes médicos...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">Error cargando informes</p>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
          <Button 
            onClick={loadInformes}
            variant="outline"
            className="hover:scale-105 transition-all duration-200"
          >
            Reintentar
          </Button>
        </div>
      );
    }

    if (!informes || informes.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">No hay informes médicos</p>
            <p className="text-sm text-gray-600">
              Este paciente no tiene informes médicos registrados
            </p>
          </div>
          <Button 
            onClick={onCreateInforme}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Crear primer informe médico
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {informes.map((informe) => (
          <Card key={informe.id} className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Informe Médico
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(informe.fechaInforme)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {informe.doctor?.firstName} {informe.doctor?.lastName}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {informe.motivoConsulta}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewInforme(informe)}
                      className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteInforme(informe.id)}
                      className="hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Diagnóstico:</h4>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {getDiagnosticoResumen(informe.diagnostico)}
                  </p>
                </div>
                {informe.indicacionesTratamiento && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Tratamiento:</h4>
                    <p className="text-sm text-gray-900 bg-green-50 p-3 rounded-lg">
                      {informe.indicacionesTratamiento.length > 80 
                        ? `${informe.indicacionesTratamiento.substring(0, 80)}...` 
                        : informe.indicacionesTratamiento}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header con botón crear */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Informes Médicos</h3>
          <p className="text-sm text-gray-600">
            Documentos clínicos generados después de las consultas
          </p>
        </div>
        <Button 
          onClick={onCreateInforme}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Crear Informe Médico
        </Button>
      </div>

      {/* Lista de informes */}
      {renderContent()}
    </div>
  );
}
