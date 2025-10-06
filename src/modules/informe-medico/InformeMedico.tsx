import React, { useState, useEffect } from 'react';
import InformeMedicoList from './InformeMedicoList';
import InformeMedicoModal from './InformeMedicoModal';
import InformeMedicoPreview from './InformeMedicoPreview';
import { InformeMedico } from './useInformeMedico';

interface InformeMedicoProps {
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
}

export default function InformeMedico({
  patientId,
  patientData,
  doctorData
}: InformeMedicoProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedInforme, setSelectedInforme] = useState<InformeMedico | null>(null);
  const [refreshList, setRefreshList] = useState(0); // Estado para refrescar la lista

  // Validar que el patientId esté presente
  useEffect(() => {
    console.log('🏥 InformeMedico inicializado con patientId:', patientId);
    console.log('🩺 ID de paciente recibido:', patientId); // Log específico solicitado
    console.log('👤 Datos del paciente:', patientData);
    console.log('👨‍⚕️ Datos del médico:', doctorData);

    if (!patientId) {
      console.error('❌ Error: patientId no está definido');
    }
  }, [patientId, patientData, doctorData]);

  // Manejar creación de nuevo informe
  const handleCreateInforme = () => {
    console.log('🆕 Creando nuevo informe para paciente:', patientId);
    
    if (!patientId) {
      console.error('❌ Error: No se puede crear informe sin patientId');
      alert('Error: ID del paciente no está definido');
      return;
    }
    
    setSelectedInforme(null);
    setShowCreateModal(true);
  };

  // Manejar visualización de informe
  const handleViewInforme = (informe: InformeMedico) => {
    setSelectedInforme(informe);
    setShowPreviewModal(true);
  };

  // Manejar éxito al guardar informe
  const handleInformeSuccess = (informe: InformeMedico) => {
    console.log('✅ Informe creado exitosamente:', informe);
    console.log('🔄 Refrescando lista de informes...');
    
    setShowCreateModal(false);
    setSelectedInforme(informe);
    setShowPreviewModal(true);
    setRefreshList(prev => prev + 1); // Incrementar refreshKey para refrescar la lista
  };

  // Manejar impresión
  const handlePrint = () => {
    window.print();
  };

  // Manejar descarga de PDF
  const handleDownloadPDF = () => {
    // TODO: Implementar generación de PDF
    console.log('Generando PDF del informe médico...');
    // Por ahora, solo mostrar un mensaje
    alert('Funcionalidad de PDF en desarrollo');
  };

  return (
    <div className="space-y-6">
      {/* Lista de informes médicos */}
      <InformeMedicoList
        patientId={patientId}
        onCreateInforme={handleCreateInforme}
        onViewInforme={handleViewInforme}
        refreshKey={refreshList}
      />

      {/* Modal de creación/edición */}
      <InformeMedicoModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleInformeSuccess}
        patientId={patientId}
        patientData={patientData}
        doctorData={doctorData}
        informeToEdit={undefined}
      />

      {/* Modal de previsualización */}
      <InformeMedicoPreview
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        informe={selectedInforme}
        onPrint={handlePrint}
        onDownloadPDF={handleDownloadPDF}
      />
    </div>
  );
}
