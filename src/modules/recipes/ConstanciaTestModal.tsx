import React from 'react';
import ConstanciaViewModal from './ConstanciaViewModal';

// Componente de prueba para verificar que el modal funciona
export default function ConstanciaTestModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Datos de prueba
  const testConstancia = {
    id: "test-123",
    pacienteId: "patient-123",
    doctorId: "doctor-123",
    tipo: "reposo",
    diagnostico: "Gripe común con fiebre alta",
    reposoDesde: "2024-01-15T00:00:00.000Z",
    reposoHasta: "2024-01-20T00:00:00.000Z",
    diasReposo: 6,
    observaciones: "Reposo absoluto recomendado",
    estado: "activa",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
    paciente: {
      id: "patient-123",
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan.perez@email.com",
      cedula: "V-12345678",
      dateOfBirth: "1990-05-15T00:00:00.000Z"
    },
    doctor: {
      id: "doctor-123",
      firstName: "Dr. María",
      lastName: "González",
      email: "maria.gonzalez@neuralapp.cloud"
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Prueba del Modal de Constancia</h1>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Abrir Modal de Prueba
      </button>
      
      <ConstanciaViewModal
        constancia={testConstancia}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
