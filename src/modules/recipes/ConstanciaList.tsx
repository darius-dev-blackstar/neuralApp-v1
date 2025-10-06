import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Calendar, 
  User, 
  Eye, 
  AlertCircle, 
  Loader2,
  Clock,
  CalendarDays,
  Trash2,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { constanciasService, Constancia } from "./constanciasService";
import ConstanciaViewModal from "./ConstanciaViewModal";

interface ConstanciaListProps {
  patientId: string;
  patientName?: string;
  onRefresh?: () => void;
  onCreateConstancia?: () => void;
}

export default function ConstanciaList({ patientId, patientName, onRefresh, onCreateConstancia }: ConstanciaListProps) {
  const { toast } = useToast();
  const [constancias, setConstancias] = useState<Constancia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConstancia, setSelectedConstancia] = useState<Constancia | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Cargar constancias del paciente
  const loadConstancias = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await constanciasService.getConstancias(1, 100, patientId);
      
      // La API devuelve un objeto con constancias array
      const constanciasData = response?.constancias || [];
      
      // Validar que sea un array y filtrar elementos válidos
      const validConstancias = Array.isArray(constanciasData) 
        ? constanciasData.filter(constancia => constancia && constancia.id) 
        : [];
      
      setConstancias(validConstancias);
      
    } catch (error: any) {
      console.error('Error loading constancias:', error);
      
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
      const errorMessage = error.response?.data?.error || "Error cargando constancias";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar constancias al montar el componente
  useEffect(() => {
    if (patientId && patientId.trim() !== '') {
      loadConstancias();
    } else {
      console.warn('ConstanciaList: patientId is not defined or empty');
      setLoading(false);
      setError('ID del paciente no válido');
    }
  }, [patientId]);

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "N/A";
    }
  };

  // Función para formatear período de reposo
  const formatReposoPeriod = (constancia: Constancia) => {
    if (!constancia.reposoDesde || !constancia.reposoHasta) {
      return "N/A";
    }
    
    try {
      const desde = new Date(constancia.reposoDesde).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short"
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

  // Función para ver detalle de constancia
  const handleViewConstancia = (constancia: Constancia) => {
    setSelectedConstancia(constancia);
    setIsViewModalOpen(true);
  };

  // Función para cerrar el modal de visualización
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedConstancia(null);
  };

  // Función para eliminar constancia
  const handleDeleteConstancia = async (constancia: Constancia) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar esta constancia de ${constancia.tipo}?`)) {
      return;
    }

    try {
      await constanciasService.deleteConstancia(constancia.id);
      
      toast({
        title: "Éxito",
        description: "Constancia eliminada correctamente",
        variant: "default",
      });
      
      // Recargar la lista
      loadConstancias();
      
    } catch (error: any) {
      console.error('Error deleting constancia:', error);
      
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
        description: "Error al eliminar la constancia",
        variant: "destructive",
      });
    }
  };

  // Renderizar contenido según el estado
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center text-gray-500 py-8">
          <Loader2 className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Cargando constancias...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 py-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-300" />
          <p className="text-lg font-medium">Error cargando constancias.</p>
          <p className="text-sm">{error || "Intenta nuevamente."}</p>
          <Button 
            onClick={loadConstancias} 
            variant="outline" 
            className="mt-4 hover:scale-105 transition-all duration-200"
          >
            Reintentar
          </Button>
        </div>
      );
    }

    if (!constancias || constancias.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No hay constancias registradas.</p>
          <p className="text-sm">Crea una nueva constancia para este paciente.</p>
          <Button 
            onClick={loadConstancias} 
            variant="outline" 
            className="mt-4 hover:scale-105 transition-all duration-200"
          >
            Actualizar
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Historial de Constancias ({constancias.length})
          </h3>
          <div className="flex gap-2">
            {onCreateConstancia && (
              <Button 
                onClick={onCreateConstancia}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Crear Constancia
              </Button>
            )}
            <Button 
              onClick={loadConstancias} 
              variant="outline" 
              size="sm"
              className="hover:scale-105 transition-all duration-200"
            >
              Actualizar
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Tipo</TableHead>
                <TableHead>Diagnóstico</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Días</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
                <TableBody>
                  {constancias.map((constancia) => (
                    <TableRow 
                      key={constancia.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewConstancia(constancia)}
                    >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      {constancia.tipo || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                    {constancia.diagnostico || 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatReposoPeriod(constancia)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {constancia.diasReposo || 'N/A'} días
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoColor(constancia.estado)}>
                      {constancia.estado || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {formatDate(constancia.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewConstancia(constancia)}
                        className="hover:bg-blue-50 hover:text-blue-600 hover:scale-105 transition-all duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteConstancia(constancia)}
                        className="hover:bg-red-50 hover:text-red-600 hover:scale-105 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <Card className="rounded-2xl shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Historial de Constancias
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>

      {/* Modal de visualización */}
      <ConstanciaViewModal
        constancia={selectedConstancia}
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
      />
    </Card>
  );
}
