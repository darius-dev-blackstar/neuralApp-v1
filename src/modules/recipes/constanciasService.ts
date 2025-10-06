import apiClient from '../../services/auth';

export interface Constancia {
  id: string;
  pacienteId: string;
  doctorId: string;
  tipo: string;
  diagnostico: string;
  reposoDesde: string | null;
  reposoHasta: string | null;
  diasReposo: number | null;
  observaciones: string | null;
  estado: string;
  createdAt: string;
  updatedAt: string;
  paciente?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    cedula: string | null;
    dateOfBirth: string | null;
  };
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateConstanciaData {
  pacienteId: string;
  tipo: string;
  diagnostico: string;
  reposoDesde?: string;
  reposoHasta?: string;
  diasReposo?: number;
  observaciones?: string;
}

export interface UpdateConstanciaData {
  tipo?: string;
  diagnostico?: string;
  reposoDesde?: string;
  reposoHasta?: string;
  diasReposo?: number;
  observaciones?: string;
  estado?: string;
}

export interface ConstanciasResponse {
  constancias: Constancia[];
  total: number;
  page: number;
  limit: number;
}

export const constanciasService = {
  // Crear nueva constancia
  async createConstancia(data: CreateConstanciaData): Promise<Constancia> {
    const response = await apiClient.post('/api/constancias', data);
    return response.data;
  },

  // Obtener constancias del doctor
  async getConstancias(page: number = 1, limit: number = 10, pacienteId?: string): Promise<ConstanciasResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (pacienteId) {
      params.append('paciente_id', pacienteId);
    }

    const response = await apiClient.get(`/api/constancias?${params}`);
    return response.data;
  },

  // Obtener constancia específica
  async getConstancia(id: string): Promise<Constancia> {
    const response = await apiClient.get(`/api/constancias/${id}`);
    return response.data;
  },

  // Actualizar constancia
  async updateConstancia(id: string, data: UpdateConstanciaData): Promise<Constancia> {
    const response = await apiClient.put(`/api/constancias/${id}`, data);
    return response.data;
  },

  // Eliminar constancia
  async deleteConstancia(id: string): Promise<void> {
    await apiClient.delete(`/api/constancias/${id}`);
  }
};
