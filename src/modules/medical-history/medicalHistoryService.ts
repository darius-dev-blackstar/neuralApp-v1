import apiClient from "../../services/auth";

export interface MedicalHistoryData {
  antecedentesPersonales: string;
  antecedentesFamiliares: string;
  antecedentesNarrados: string;
  alergias: string;
  medicamentosActuales: string;
  observacionesGenerales: string;
  fechaActualizacion: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cedula?: string;
  dateOfBirth?: string;
  medicalHistory?: string;
}

const handleApiError = (error: any) => {
  console.error('API Error:', error);
  if (error.response?.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  }
  throw error;
};

export const medicalHistoryService = {
  async getMedicalHistory(patientId: string): Promise<MedicalHistoryData | null> {
    try {
      const response = await apiClient.get(`/api/patients/${patientId}`);
      const patient = response.data;
      
      if (patient.medicalHistory) {
        try {
          return JSON.parse(patient.medicalHistory);
        } catch (error) {
          console.error('Error parsing medical history:', error);
          return null;
        }
      }
      
      return null;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  async updateMedicalHistory(patientId: string, historyData: MedicalHistoryData): Promise<Patient> {
    try {
      const response = await apiClient.put(`/api/patients/${patientId}`, {
        medicalHistory: JSON.stringify(historyData)
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  async getPatient(patientId: string): Promise<Patient> {
    try {
      const response = await apiClient.get(`/api/patients/${patientId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};
