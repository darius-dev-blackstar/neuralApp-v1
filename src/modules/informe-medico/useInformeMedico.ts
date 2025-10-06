import { useState, useEffect } from 'react';
import apiClient from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

export interface InformeMedico {
  id: string;
  pacienteId: string;
  doctorId: string;
  motivoConsulta: string;
  examenFisico: string;
  diagnostico: string;
  indicacionesTratamiento: string;
  fechaInforme: string;
  firmaMedico?: string;
  createdAt: string;
  updatedAt: string;
  paciente?: {
    id: string;
    firstName: string;
    lastName: string;
    cedula: string;
    dateOfBirth: string;
  };
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mpps?: string;
    cm?: string;
  };
}

export interface CreateInformeMedicoData {
  pacienteId: string;
  motivoConsulta: string;
  examenFisico: string;
  diagnostico: string;
  indicacionesTratamiento: string;
  fechaInforme: string;
  firmaMedico?: string;
}

export interface UpdateInformeMedicoData extends CreateInformeMedicoData {
  id: string;
}

export const useInformeMedico = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Obtener informes por paciente
  const getInformesByPaciente = async (patientId: string): Promise<InformeMedico[]> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando informes médicos para paciente ID:', patientId);
      
      // Validar que patientId esté definido
      if (!patientId) {
        throw new Error('ID del paciente no está definido');
      }
      
      // Usar endpoint específico de informes médicos
      const response = await apiClient.get(`/api/medical-reports?paciente_id=${patientId}`);
      
      console.log('📋 Respuesta de la API de informes médicos:', response.data);
      
      // Los datos ya vienen en el formato correcto
      const informes = Array.isArray(response.data) ? response.data : [];
      
      console.log('✅ Informes médicos cargados:', informes);
      console.log('📊 Total de informes médicos:', informes.length);
      
      return informes;
    } catch (error: any) {
      console.error('❌ Error fetching medical reports:', error);
      console.error('📊 Error response:', error.response?.data);
      console.error('🔗 Error URL:', error.config?.url);
      
      if (error.response?.status === 401) {
        throw new Error('No autorizado');
      } else if (error.response?.status === 404) {
        throw new Error('Endpoint no encontrado. El backend puede no tener implementado el endpoint /api/medical-reports');
      } else if (error.response?.status === 500) {
        throw new Error('Error del servidor. El backend puede tener problemas con la base de datos o el modelo MedicalReport');
      } else if (error.response?.status === 502) {
        throw new Error('Servidor no disponible. El backend puede estar caído o en mantenimiento');
      } else if (!error.response) {
        throw new Error('Error de conexión. Verifica tu conexión a internet');
      } else {
        throw new Error(`Error del servidor (${error.response.status}). Intenta nuevamente`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo informe médico
  const createInforme = async (data: CreateInformeMedicoData): Promise<InformeMedico> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🏥 Creando informe médico con datos:', data);
      console.log('👤 Paciente ID recibido:', data.pacienteId);
      console.log('🩺 ID de paciente recibido:', data.pacienteId); // Log específico solicitado
      
      // Validar que pacienteId esté presente
      if (!data.pacienteId) {
        throw new Error('ID del paciente no está definido');
      }
      
      // Usar endpoint específico de informes médicos
      const informeData = {
        paciente_id: data.pacienteId,
        motivo_consulta: data.motivoConsulta,
        examen_fisico: data.examenFisico,
        diagnostico: data.diagnostico,
        indicaciones_tratamiento: data.indicacionesTratamiento,
        fecha_informe: data.fechaInforme,
        firma_medico: data.firmaMedico
      };
      
      console.log('📤 Enviando datos de informe médico al backend:', informeData);
      console.log('🔍 Verificando campos requeridos:');
      console.log('  - paciente_id:', informeData.paciente_id);
      console.log('  - motivo_consulta:', informeData.motivo_consulta);
      console.log('  - examen_fisico:', informeData.examen_fisico);
      console.log('  - diagnostico:', informeData.diagnostico);
      console.log('  - indicaciones_tratamiento:', informeData.indicaciones_tratamiento);
      console.log('  - fecha_informe:', informeData.fecha_informe);
      console.log('  - firma_medico:', informeData.firma_medico);
      
      const response = await apiClient.post('/api/medical-reports', informeData);
      
      console.log('📥 Respuesta del backend:', response.data);
      
      // Los datos ya vienen en el formato correcto
      const informe = response.data;
      
      console.log('✅ Informe médico creado:', informe);
      console.log('📊 Informe médico generado con ID:', informe.id);
      
      toast({
        title: "Éxito",
        description: "Informe médico guardado correctamente",
        variant: "default",
      });
      
      return informe;
    } catch (error: any) {
      console.error('❌ Error creating medical report:', error);
      
      if (error.response?.status === 400) {
        const message = error.response.data?.error || 'Datos inválidos';
        throw new Error(message);
      } else if (error.response?.status === 401) {
        throw new Error('No autorizado');
      } else if (error.response?.status === 404) {
        throw new Error('Paciente no encontrado');
      } else if (error.response?.status === 502) {
        throw new Error('Servidor no disponible. El backend puede estar caído o en mantenimiento');
      } else if (!error.response) {
        throw new Error('Error de conexión. Verifica tu conexión a internet');
      } else {
        throw new Error('Error al guardar informe. Intenta nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  // Actualizar informe médico
  const updateInforme = async (data: UpdateInformeMedicoData): Promise<InformeMedico> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Actualizando informe médico:', data.id);
      
      const updateData = {
        motivo_consulta: data.motivoConsulta,
        examen_fisico: data.examenFisico,
        diagnostico: data.diagnostico,
        indicaciones_tratamiento: data.indicacionesTratamiento,
        fecha_informe: data.fechaInforme,
        firma_medico: data.firmaMedico
      };
      
      const response = await apiClient.put(`/api/medical-reports/${data.id}`, updateData);
      
      toast({
        title: "Éxito",
        description: "Informe médico actualizado correctamente",
        variant: "default",
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating medical report:', error);
      
      if (error.response?.status === 400) {
        const message = error.response.data?.error || 'Datos inválidos';
        throw new Error(message);
      } else if (error.response?.status === 401) {
        throw new Error('No autorizado');
      } else if (error.response?.status === 404) {
        throw new Error('Informe médico no encontrado');
      } else if (!error.response) {
        throw new Error('Error de conexión. Verifica tu conexión a internet');
      } else {
        throw new Error('Error al actualizar informe. Intenta nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  // Eliminar informe médico
  const deleteInforme = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🗑️ Eliminando informe médico:', id);
      
      await apiClient.delete(`/api/medical-reports/${id}`);
      
      toast({
        title: "Éxito",
        description: "Informe médico eliminado correctamente",
        variant: "default",
      });
    } catch (error: any) {
      console.error('❌ Error deleting medical report:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Informe médico no encontrado');
      } else if (error.response?.status === 401) {
        throw new Error('No autorizado');
      } else if (error.response?.status === 403) {
        throw new Error('No tienes permisos para eliminar este informe');
      } else if (!error.response) {
        throw new Error('Error de conexión. Verifica tu conexión a internet');
      } else {
        throw new Error('Error al eliminar informe. Intenta nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  // Obtener informe por ID
  const getInformeById = async (id: string): Promise<InformeMedico> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Obteniendo informe médico por ID:', id);
      
      const response = await apiClient.get(`/api/medical-reports/${id}`);
      
      console.log('✅ Informe médico obtenido:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching medical report:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Informe médico no encontrado');
      } else if (error.response?.status === 401) {
        throw new Error('No autorizado');
      } else if (!error.response) {
        throw new Error('Error de conexión. Verifica tu conexión a internet');
      } else {
        throw new Error('Error del servidor. Intenta nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getInformesByPaciente,
    createInforme,
    updateInforme,
    deleteInforme,
    getInformeById,
  };
};
