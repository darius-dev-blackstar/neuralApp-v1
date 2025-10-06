import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Eye, Trash2, ChevronUp, ChevronDown, AlertCircle } from "lucide-react";
import { Patient } from "./patientsService";

interface PatientListProps {
  patients: Patient[];
  loading: boolean;
  error?: Error | null;
  onAddPatient: () => void;
  onEditPatient: (patient: Patient) => void;
  onViewPatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => Promise<void>;
  onSearch: (searchTerm: string) => void;
  onSort: (sortBy: 'name' | 'createdAt', sortOrder: 'asc' | 'desc') => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PatientList({
  patients,
  loading,
  error,
  onAddPatient,
  onEditPatient,
  onViewPatient,
  onDeletePatient,
  onSearch,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
}: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSort = (field: 'name' | 'createdAt') => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
    onSort(field, newOrder);
  };

  const handleDeleteClick = (id: string) => {
    setDeletePatientId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deletePatientId) {
      await onDeletePatient(deletePatientId);
      setDeletePatientId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES");
    } catch {
      return "Fecha inválida";
    }
  };

  const SortButton = ({ field, children }: { field: 'name' | 'createdAt'; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      <span className="flex items-center gap-1">
        {children}
        {sortBy === field && (
          sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
        )}
      </span>
    </Button>
  );

  // Función para renderizar el contenido principal
  const renderContent = () => {
    // Estado de carga
    if (loading) {
      return (
        <div className="text-center text-gray-500 py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Cargando pacientes...</p>
        </div>
      );
    }

    // Estado de error
    if (error) {
      return (
        <div className="text-center text-red-500 py-12">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-300" />
          <p className="text-lg font-medium">Error cargando pacientes</p>
          <p className="text-sm mt-2">{error.message || "Intenta nuevamente."}</p>
        </div>
      );
    }

    // Verificar que patients es un array válido
    if (!Array.isArray(patients)) {
      return (
        <div className="text-center text-gray-500 py-12">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No se pudieron cargar los datos</p>
          <p className="text-sm mt-2">Revisa la conexión o inicia sesión nuevamente.</p>
        </div>
      );
    }

    // Sin pacientes
    if (patients.length === 0) {
      return (
        <div className="text-center text-gray-500 py-12">
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No hay pacientes registrados</p>
          <p className="text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
        </div>
      );
    }

    // Con pacientes - mostrar tabla
    return (
      <>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <SortButton field="name">Nombre</SortButton>
              </TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>
                <SortButton field="createdAt">Fecha Registro</SortButton>
              </TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow 
                key={patient.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onViewPatient(patient)}
              >
                <TableCell className="font-medium">
                  {patient.firstName || 'N/A'} {patient.lastName || 'N/A'}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {patient.cedula || 'N/A'}
                </TableCell>
                <TableCell>{patient.phone || 'N/A'}</TableCell>
                <TableCell>{patient.email || 'N/A'}</TableCell>
                <TableCell>{formatDate(patient.createdAt || '')}</TableCell>
                <TableCell>
                  <Badge 
                    variant={patient.status === "Activo" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {patient.status || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewPatient(patient);
                      }}
                      className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPatient(patient);
                      }}
                      className="h-8 w-8 hover:bg-green-50 hover:text-green-600"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(patient.id);
                      }}
                      className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="hover:scale-105 transition-all duration-200"
              >
                Anterior
              </Button>
              
              {/* Números de página */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className={`w-8 h-8 p-0 hover:scale-105 transition-all duration-200 ${
                        currentPage === page 
                          ? 'bg-primary text-white' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="hover:scale-105 transition-all duration-200"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600 mt-1">Gestiona la información de tus pacientes</p>
        </div>
        <Button 
          onClick={onAddPatient} 
          className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
        >
          <Plus className="mr-2" size={18} />
          Nuevo Paciente
        </Button>
      </div>

      {/* Card principal */}
      <Card className="rounded-2xl shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar paciente por nombre, apellido, cédula o email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-gray-200 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <AlertDialog open={!!deletePatientId} onOpenChange={() => setDeletePatientId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900">
              ¿Seguro que deseas eliminar este paciente?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Esta acción no se puede deshacer. Se eliminará permanentemente toda la información del paciente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="hover:scale-105 transition-all duration-200"
              onClick={() => setDeletePatientId(null)}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-all duration-200"
            >
              Eliminar Paciente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}