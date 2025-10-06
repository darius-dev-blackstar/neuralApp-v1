import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PatientList from "@/modules/patients/PatientList";
import PatientForm from "@/modules/patients/PatientForm";
import PatientDetailView from "@/modules/patients/PatientDetailView";
import { Patient, CreatePatientData, UpdatePatientData, patientsService } from "@/modules/patients/patientsService";

type ViewMode = 'list' | 'detail' | 'form';

export default function Pacientes() {
  const { toast } = useToast();
  
  // Estados principales
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Estados para paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Estados para modal de formulario
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Cargar pacientes al montar el componente
  useEffect(() => {
    loadPatients();
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await patientsService.getPatients({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        sortBy,
        sortOrder,
      });
      
      setPatients(response.patients || []);
      setTotalPages(Math.ceil((response.total || 0) / 10));
    } catch (error: any) {
      console.error('Error loading patients:', error);
      
      // Manejar errores específicos
      if (error.response?.status === 401) {
        toast({
          title: "Sesión expirada",
          description: "Por favor inicia sesión nuevamente",
          variant: "destructive",
        });
        // Logout automático
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        window.location.href = "/login";
        return;
      }
      
      setError(error);
      setPatients([]);
      setTotalPages(1);
      
      toast({
        title: "Error",
        description: error.message || "Error al cargar los pacientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Datos demo como fallback
  const getDemoPatients = (): Patient[] => [
    {
      id: 1,
      firstName: "María",
      lastName: "González",
      email: "maria.gonzalez@email.com",
      phone: "+34 612 345 678",
      cedula: "12345678",
      address: "Calle Mayor 123, Madrid, 28001",
      birthDate: "1985-03-15",
      status: "Activo",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      firstName: "Carlos",
      lastName: "Rodríguez",
      email: "carlos.rodriguez@email.com",
      phone: "+34 623 456 789",
      cedula: "87654321",
      address: "Avenida de la Paz 45, Barcelona, 08001",
      birthDate: "1990-07-22",
      status: "Activo",
      createdAt: "2024-01-16T14:20:00Z",
      updatedAt: "2024-01-16T14:20:00Z",
    },
    {
      id: 3,
      firstName: "Ana",
      lastName: "Martínez",
      email: "ana.martinez@email.com",
      phone: "+34 634 567 890",
      cedula: "11223344",
      address: "Plaza España 7, Valencia, 46001",
      birthDate: "1978-11-10",
      status: "Activo",
      createdAt: "2024-01-17T09:15:00Z",
      updatedAt: "2024-01-17T09:15:00Z",
    },
    {
      id: 4,
      firstName: "Luis",
      lastName: "Fernández",
      email: "luis.fernandez@email.com",
      phone: "+34 645 678 901",
      cedula: "55667788",
      address: "Calle Gran Vía 89, Sevilla, 41001",
      birthDate: "1995-05-30",
      status: "Inactivo",
      createdAt: "2024-01-18T16:45:00Z",
      updatedAt: "2024-01-18T16:45:00Z",
    },
  ];

  // Handlers para PatientList
  const handleAddPatient = () => {
    setFormMode('create');
    setSelectedPatient(null);
    setIsFormModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setFormMode('edit');
    setSelectedPatient(patient);
    setIsFormModalOpen(true);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewMode('detail');
  };

  const handleDeletePatient = async (id: string) => {
    try {
      await patientsService.deletePatient(id);
      toast({
        title: "Éxito",
        description: "Paciente eliminado correctamente",
      });
      loadPatients();
    } catch (error: any) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el paciente",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleSort = (sortBy: 'name' | 'createdAt', sortOrder: 'asc' | 'desc') => {
    setSortBy(sortBy);
    setSortOrder(sortOrder);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handlers para PatientForm
  const handleFormSubmit = async (data: CreatePatientData | UpdatePatientData) => {
    try {
      setFormLoading(true);
      
      if (formMode === 'create') {
        const newPatient = await patientsService.createPatient(data as CreatePatientData);
        toast({
          title: "Éxito",
          description: "Paciente creado correctamente",
        });
        setIsFormModalOpen(false);
        loadPatients();
        return newPatient;
      } else {
        const updatedPatient = await patientsService.updatePatient(data as UpdatePatientData);
        toast({
          title: "Éxito",
          description: "Paciente actualizado correctamente",
        });
        
        // Actualizar el paciente seleccionado inmediatamente
        setSelectedPatient(updatedPatient);
        // También actualizar en la lista de pacientes
        setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
        
        setIsFormModalOpen(false);
        return updatedPatient;
      }
    } catch (error: any) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: error.message || "Error al guardar el paciente",
        variant: "destructive",
      });
      throw error; // Re-throw para que PatientForm maneje el error
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormModalOpen(false);
    setSelectedPatient(null);
  };

  // Handler para PatientDetailView
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedPatient(null);
  };

  // Handler para actualizar paciente desde PatientDetailView
  const handlePatientUpdate = (updatedPatient: Patient) => {
    setSelectedPatient(updatedPatient);
    // También actualizar en la lista de pacientes
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  // Renderizar vista según el modo
  if (viewMode === 'detail' && selectedPatient) {
    return (
      <PatientDetailView
        patient={selectedPatient}
        onBack={handleBackToList}
        onPatientUpdate={handlePatientUpdate}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" style={{ backgroundColor: '#F5F5F5', minHeight: '100vh', padding: '1.5rem' }}>
      <PatientList
        patients={patients}
        loading={loading}
        error={error}
        onAddPatient={handleAddPatient}
        onEditPatient={handleEditPatient}
        onViewPatient={handleViewPatient}
        onDeletePatient={handleDeletePatient}
        onSearch={handleSearch}
        onSort={handleSort}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modal de formulario */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {formMode === 'create' ? 'Nuevo Paciente' : 'Editar Paciente'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {formMode === 'create' 
                ? 'Completa el formulario para añadir un nuevo paciente' 
                : 'Actualiza la información del paciente'
              }
            </DialogDescription>
          </DialogHeader>

          <PatientForm
            patient={selectedPatient}
            mode={formMode}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
