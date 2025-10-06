import apiClient from '@/services/auth';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cedula: string | null;
  address: string | null;
  dateOfBirth: string | null;
  medicalHistory: string | null;
  status?: "Activo" | "Inactivo";
  createdAt: string;
  updatedAt: string;
  doctorId: string;
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  appointments?: any[];
}

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cedula: string;
  address: string;
  dateOfBirth: string;
}

export interface UpdatePatientData extends Partial<CreatePatientData> {
  id: string;
}

export interface PatientsResponse {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
}

export interface PatientsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const patientsService = {
  // Obtener lista de pacientes con paginación y filtros
  async getPatients(params: PatientsQueryParams = {}): Promise<PatientsResponse> {
    try {
      const response = await apiClient.get('/api/patients', { params });
      
      // La API devuelve un array directamente, no un objeto con patients y total
      const patients = Array.isArray(response.data) ? response.data : [];
      
      // Agregar status por defecto si no existe
      const patientsWithStatus = patients.map((patient: any) => ({
        ...patient,
        status: patient.status || "Activo"
      }));
      
      return {
        patients: patientsWithStatus,
        total: patientsWithStatus.length,
        page: params.page || 1,
        limit: params.limit || 10
      };
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      
      if (error.response?.status === 401) {
        throw new Error('No autorizado');
      } else if (error.response?.status === 403) {
        throw new Error('Acceso denegado');
      } else if (error.response?.status === 502) {
        throw new Error('Servidor no disponible. El backend puede estar caído o en mantenimiento');
      } else if (error.response?.status === 503) {
        throw new Error('Servicio temporalmente no disponible');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Tiempo de conexión agotado. Verifica tu conexión a internet');
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('No se puede conectar al servidor. Verifica que el backend esté ejecutándose');
      } else if (!error.response) {
        throw new Error('Error de conexión. Verifica tu conexión a internet');
      } else {
        throw new Error(`Error del servidor (${error.response.status}). Intenta nuevamente`);
      }
    }
  },

  // Obtener un paciente por ID
  async getPatient(id: string): Promise<Patient> {
    try {
      const response = await apiClient.get(`/api/patients/${id}`);
      return {
        ...response.data,
        status: response.data.status || "Activo"
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Paciente no encontrado');
      } else if (error.response?.status === 401) {
        throw new Error('No autorizado');
      } else if (!error.response) {
        throw new Error('Error de conexión. Verifica tu conexión a internet');
      } else {
        throw new Error('Error del servidor. Intenta nuevamente');
      }
    }
  },

  // Crear nuevo paciente
  async createPatient(data: CreatePatientData): Promise<Patient> {
    try {
      const response = await apiClient.post('/api/patients', data);
      return {
        ...response.data,
        status: response.data.status || "Activo"
      };
    } catch (error: any) {
      if (error.response?.status === 400) {
        const message = error.response.data?.message || 'Datos inválidos';
        throw new Error(message);
      } else if (error.response?.status === 409) {
        throw new Error('Ya existe un paciente con esta cédula o email');
      } else if (error.response?.status === 401) {
        throw new Error('No autorizado');
      } else if (!error.response) {
        throw new Error('Error de conexión. Verifica tu conexión a internet');
      } else {
        throw new Error('Error del servidor. Intenta nuevamente');
      }
    }
  },

  // Actualizar paciente
  async updatePatient(data: UpdatePatientData): Promise<Patient> {
    try {
      const { id, ...updateData } = data;
      const response = await apiClient.put(`/api/patients/${id}`, updateData);
      return {
        ...response.data,
        status: response.data.status || "Activo"
      };
    } catch (error: any) {
      if (error.response?.status === 400) {
        const message = error.response.data?.message || 'Datos inválidos';
        throw new Error(message);
      } else if (error.response?.status === 404) {
        throw new Error('Paciente no encontrado');
      } else if (error.response?.status === 409) {
        throw new Error('Ya existe un paciente con esta cédula o email');
      } else if (error.response?.status === 401) {
        throw new Error('No autorizado');
      } else if (!error.response) {
        throw new Error('Error de conexión. Verifica tu conexión a internet');
      } else {
        throw new Error('Error del servidor. Intenta nuevamente');
      }
    }
  },

  // Eliminar paciente
  async deletePatient(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/patients/${id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Paciente no encontrado');
      } else if (error.response?.status === 401) {
        throw new Error('No autorizado');
      } else if (error.response?.status === 403) {
        throw new Error('No tienes permisos para eliminar este paciente');
      } else if (!error.response) {
        throw new Error('Error de conexión. Verifica tu conexión a internet');
      } else {
        throw new Error('Error del servidor. Intenta nuevamente');
      }
    }
  },
};
