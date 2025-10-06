import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, FileText, Pill, Clipboard, Stethoscope } from "lucide-react";
import { Patient } from "./patientsService";
import { patientsService } from "./patientsService";
import PatientForm from "./PatientForm";
import RecipeForm from "../recipes/RecipeForm";
import RecipeList from "../recipes/RecipeList";
import ConstanciaReposoMedico from "../recipes/ConstanciaReposoMedico";
import ConstanciaList from "../recipes/ConstanciaList";
import ConstanciaCreateModal from "../recipes/ConstanciaCreateModal";
import MedicalHistoryForm from "../medical-history/MedicalHistoryForm";
import MedicalHistoryView from "../medical-history/MedicalHistoryView";
import InformeMedico from "../informe-medico/InformeMedico";

interface PatientDetailViewProps {
  patient: Patient;
  onBack: () => void;
  onPatientUpdate?: (updatedPatient: Patient) => void;
}

export default function PatientDetailView({ patient, onBack, onPatientUpdate }: PatientDetailViewProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [refreshRecipes, setRefreshRecipes] = useState(0);
  const [showConstanciaReposo, setShowConstanciaReposo] = useState(false);
  const [refreshConstancias, setRefreshConstancias] = useState(0);
  const [showCreateConstanciaModal, setShowCreateConstanciaModal] = useState(false);
  const [showMedicalHistoryForm, setShowMedicalHistoryForm] = useState(false);
  const [refreshMedicalHistory, setRefreshMedicalHistory] = useState(0);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient>(patient);

  // Actualizar el estado local cuando cambie la prop del paciente
  useEffect(() => {
    setCurrentPatient(patient);
  }, [patient]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Funciones para manejar el formulario de receta
  const handleNewRecipe = () => {
    setShowRecipeForm(true);
  };

  const handleRecipeSuccess = () => {
    setShowRecipeForm(false);
    // Refrescar la lista de recetas
    setRefreshRecipes(prev => prev + 1);
  };

  const handleRecipeCancel = () => {
    setShowRecipeForm(false);
  };

  // Funciones para manejar la constancia de reposo
  const handleNewConstanciaReposo = () => {
    setShowConstanciaReposo(true);
  };

  const handleConstanciaReposoClose = () => {
    setShowConstanciaReposo(false);
  };

  const handleConstanciaReposoSuccess = (constancia: any) => {
    // Refrescar la lista de constancias
    setRefreshConstancias(prev => prev + 1);
  };

  // Funciones para manejar el modal de creación de constancia
  const handleCreateConstancia = () => {
    setShowCreateConstanciaModal(true);
  };

  const handleCloseCreateConstanciaModal = () => {
    setShowCreateConstanciaModal(false);
  };

  const handleCreateConstanciaSuccess = (constancia: any) => {
    // Refrescar la lista de constancias
    setRefreshConstancias(prev => prev + 1);
  };

  // Funciones para manejar la historia médica
  const handleEditMedicalHistory = () => {
    setShowMedicalHistoryForm(true);
  };

  const handleMedicalHistorySuccess = (updatedHistory: string) => {
    setShowMedicalHistoryForm(false);
    // Refrescar la vista de historia médica
    setRefreshMedicalHistory(prev => prev + 1);
  };

  const handleMedicalHistoryCancel = () => {
    setShowMedicalHistoryForm(false);
  };

  // Funciones para manejar la edición del paciente
  const handleEditPatient = () => {
    setShowEditPatientModal(true);
  };

  const handlePatientUpdateSuccess = async (data: any) => {
    try {
      // Actualizar el paciente en el backend
      const updatedPatient = await patientsService.updatePatient(data);
      
      // Actualizar el estado local
      setCurrentPatient(updatedPatient);
      setShowEditPatientModal(false);
      
      // Notificar al componente padre si existe el callback
      if (onPatientUpdate) {
        onPatientUpdate(updatedPatient);
      }
      
      // Mostrar toast de éxito
      toast({
        title: "Éxito",
        description: "Ficha actualizada correctamente",
      });
      
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error; // Re-throw para que PatientForm maneje el error
    }
  };

  const handlePatientUpdateCancel = () => {
    setShowEditPatientModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ backgroundColor: '#F5F5F5', minHeight: '100vh', padding: '1.5rem' }}>
      {/* Header con botón de regreso */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
        >
          <ArrowLeft size={18} />
          Volver
        </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentPatient.firstName} {currentPatient.lastName}
              </h1>
              <p className="text-gray-600 mt-1">
                Paciente desde {formatDate(currentPatient.createdAt)}
              </p>
            </div>
      </div>

      {/* Información básica */}
      <Card className="rounded-2xl shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-primary">
                        {currentPatient.firstName.charAt(0)}{currentPatient.lastName.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentPatient.firstName} {currentPatient.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentPatient.dateOfBirth ? calculateAge(currentPatient.dateOfBirth) : 'N/A'} años
                    </p>
                  </div>
            
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estado</p>
                    <Badge 
                      variant={currentPatient.status === "Activo" ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {currentPatient.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cédula</p>
                    <p className="text-sm text-gray-900">{currentPatient.cedula}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                    <p className="text-sm text-gray-900">{currentPatient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{currentPatient.email}</p>
                  </div>
                </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs principales */}
      <Card className="rounded-2xl shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 rounded-none rounded-t-2xl bg-gray-50">
              <TabsTrigger 
                value="personal" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                style={{ 
                  backgroundColor: activeTab === 'personal' ? '#458BFF' : '#E5E7EB',
                  color: activeTab === 'personal' ? '#FFFFFF' : '#6B7280'
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Datos Personales
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                style={{ 
                  backgroundColor: activeTab === 'history' ? '#458BFF' : '#E5E7EB',
                  color: activeTab === 'history' ? '#FFFFFF' : '#6B7280'
                }}
              >
                <Clipboard className="w-4 h-4 mr-2" />
                Historia Clínica
              </TabsTrigger>
              <TabsTrigger 
                value="appointments"
                className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                style={{ 
                  backgroundColor: activeTab === 'appointments' ? '#458BFF' : '#E5E7EB',
                  color: activeTab === 'appointments' ? '#FFFFFF' : '#6B7280'
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Citas
              </TabsTrigger>
              <TabsTrigger 
                value="prescriptions"
                className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                style={{ 
                  backgroundColor: activeTab === 'prescriptions' ? '#458BFF' : '#E5E7EB',
                  color: activeTab === 'prescriptions' ? '#FFFFFF' : '#6B7280'
                }}
              >
                <Pill className="w-4 h-4 mr-2" />
                Recetas
              </TabsTrigger>
              <TabsTrigger 
                value="certificates"
                className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                style={{ 
                  backgroundColor: activeTab === 'certificates' ? '#458BFF' : '#E5E7EB',
                  color: activeTab === 'certificates' ? '#FFFFFF' : '#6B7280'
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Constancias
              </TabsTrigger>
              <TabsTrigger 
                value="reports"
                className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                style={{ 
                  backgroundColor: activeTab === 'reports' ? '#458BFF' : '#E5E7EB',
                  color: activeTab === 'reports' ? '#FFFFFF' : '#6B7280'
                }}
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Informes Médicos
              </TabsTrigger>
            </TabsList>

            {/* Tab: Datos Personales */}
            <TabsContent value="personal" className="p-6">
              <div className="space-y-6">
                {/* Botón de edición */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleEditPatient}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
                  >
                    <FileText className="w-4 h-4" />
                    Editar ficha del paciente
                  </Button>
                </div>

                {/* Información del paciente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Información Personal</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Nombre completo</p>
                          <p className="text-sm text-gray-900">{currentPatient.firstName} {currentPatient.lastName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Fecha de nacimiento</p>
                          <p className="text-sm text-gray-900">{currentPatient.dateOfBirth ? formatDate(currentPatient.dateOfBirth) : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Edad</p>
                          <p className="text-sm text-gray-900">{currentPatient.dateOfBirth ? calculateAge(currentPatient.dateOfBirth) : 'N/A'} años</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Cédula de identidad</p>
                          <p className="text-sm text-gray-900">{currentPatient.cedula}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Información de Contacto</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Email</p>
                          <p className="text-sm text-gray-900">{currentPatient.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Teléfono</p>
                          <p className="text-sm text-gray-900">{currentPatient.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Dirección</p>
                          <p className="text-sm text-gray-900">{currentPatient.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Historia Clínica */}
            <TabsContent value="history" className="p-6 space-y-6">
              {showMedicalHistoryForm ? (
                <MedicalHistoryForm
                  patient={currentPatient}
                  onSuccess={handleMedicalHistorySuccess}
                  onCancel={handleMedicalHistoryCancel}
                />
              ) : (
                <MedicalHistoryView
                  patient={currentPatient}
                  onEdit={handleEditMedicalHistory}
                  key={refreshMedicalHistory}
                />
              )}
            </TabsContent>

            {/* Tab: Citas */}
            <TabsContent value="appointments" className="p-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Citas Médicas</h3>
                <p className="text-gray-600 mb-4">
                  Las citas de {currentPatient.firstName} se mostrarán aquí
                </p>
                <Button className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200">
                  Nueva Cita
                </Button>
              </div>
            </TabsContent>

            {/* Tab: Recetas */}
            <TabsContent value="prescriptions" className="p-6 space-y-6">
                  {showRecipeForm ? (
                    <RecipeForm
                      patientId={currentPatient.id}
                      patientName={`${currentPatient.firstName} ${currentPatient.lastName}`}
                      onSuccess={handleRecipeSuccess}
                      onCancel={handleRecipeCancel}
                    />
                  ) : (
                    <div className="space-y-6">
                      {/* Botón para crear nueva receta */}
                      <div className="text-center py-8">
                        <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Recetas Médicas</h3>
                        <p className="text-gray-600 mb-4">
                          Gestiona las recetas médicas de {currentPatient.firstName}
                        </p>
                        <Button 
                          onClick={handleNewRecipe}
                          className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
                        >
                          Nueva Receta
                        </Button>
                      </div>

                      {/* Lista de recetas existentes */}
                      <RecipeList
                        patientId={currentPatient.id}
                        patientName={`${currentPatient.firstName} ${currentPatient.lastName}`}
                        key={refreshRecipes} // Forzar re-render cuando cambie refreshRecipes
                      />
                    </div>
                  )}
            </TabsContent>

            {/* Tab: Constancias */}
            <TabsContent value="certificates" className="p-6 space-y-6">
              <div className="space-y-6">
                {/* Botón principal para crear constancia */}
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Constancias Médicas</h3>
                      <p className="text-gray-600 mb-6">
                        Gestiona las constancias médicas de {currentPatient.firstName}
                      </p>
                  <Button 
                    onClick={handleCreateConstancia}
                    className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200 text-lg px-8 py-3"
                    size="lg"
                  >
                    ¡Crear Constancia!
                  </Button>
                </div>

                    {/* Lista de constancias existentes */}
                    <ConstanciaList
                      patientId={currentPatient.id}
                      patientName={`${currentPatient.firstName} ${currentPatient.lastName}`}
                      key={refreshConstancias}
                      onCreateConstancia={handleCreateConstancia}
                    />
              </div>
            </TabsContent>

            {/* Tab: Informes Médicos */}
            <TabsContent value="reports" className="p-6 space-y-6">
              <InformeMedico
                patientId={currentPatient.id}
                patientData={{
                  firstName: currentPatient.firstName,
                  lastName: currentPatient.lastName,
                  cedula: currentPatient.cedula || '',
                  dateOfBirth: currentPatient.dateOfBirth || ''
                }}
                doctorData={{
                  firstName: "Dr. John",
                  lastName: "Smith",
                  email: "doctor@neuralapp.cloud",
                  mpps: "12345",
                  cm: "CM-67890"
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

          {/* Modal de creación de constancia */}
          <ConstanciaCreateModal
            patient={currentPatient}
            doctor={{
              id: "current-doctor",
              firstName: "Dr. John",
              lastName: "Smith",
              email: "doctor@neuralapp.cloud",
              mpps: "12345",
              cm: "CM-67890"
            }}
            isOpen={showCreateConstanciaModal}
            onClose={handleCloseCreateConstanciaModal}
            onSuccess={handleCreateConstanciaSuccess}
          />

          {/* Modal de edición de paciente */}
          <Dialog open={showEditPatientModal} onOpenChange={setShowEditPatientModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Editar Paciente
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Actualiza la información del paciente
                </DialogDescription>
              </DialogHeader>

              <PatientForm
                patient={currentPatient}
                mode="edit"
                onSubmit={handlePatientUpdateSuccess}
                onCancel={handlePatientUpdateCancel}
                loading={false}
              />
            </DialogContent>
          </Dialog>
    </div>
  );
}
