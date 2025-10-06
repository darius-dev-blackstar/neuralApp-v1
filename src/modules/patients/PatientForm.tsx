import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Patient, CreatePatientData, UpdatePatientData } from "./patientsService";

interface PatientFormProps {
  patient?: Patient | null;
  mode: "create" | "edit";
  onSubmit: (data: CreatePatientData | UpdatePatientData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cedula: string;
  address: string;
  dateOfBirth: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  cedula?: string;
  address?: string;
  dateOfBirth?: string;
}

export default function PatientForm({ patient, mode, onSubmit, onCancel, loading = false }: PatientFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cedula: "",
    address: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");

  // Cargar datos del paciente si está en modo edición
  useEffect(() => {
    if (patient && mode === "edit") {
      setFormData({
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        cedula: patient.cedula,
        address: patient.address,
        dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : "",
      });
    }
  }, [patient, mode]);

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres";
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no tiene un formato válido";
    }

    // Validar teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!/^[\+]?[0-9\-\s]+$/.test(formData.phone)) {
      newErrors.phone = "El teléfono solo puede contener números, espacios, guiones y el signo +";
    }

    // Validar cédula
    if (!formData.cedula.trim()) {
      newErrors.cedula = "La cédula de identidad es requerida";
    } else if (!/^[0-9]+$/.test(formData.cedula)) {
      newErrors.cedula = "La cédula solo puede contener números";
    } else if (formData.cedula.length < 7 || formData.cedula.length > 12) {
      newErrors.cedula = "La cédula debe tener entre 7 y 12 dígitos";
    }

    // Validar dirección
    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "La dirección debe tener al menos 10 caracteres";
    }

    // Validar fecha de nacimiento
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "La fecha de nacimiento es requerida";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 0 || age > 120) {
        newErrors.dateOfBirth = "La fecha de nacimiento no es válida";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Limpiar error general
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitError("");
      
      if (mode === "create") {
        await onSubmit(formData as CreatePatientData);
      } else {
        await onSubmit({ ...formData, id: patient!.id } as UpdatePatientData);
      }
    } catch (error: any) {
      setSubmitError(error.message || "Error al guardar el paciente");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            Nombre *
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="Nombre del paciente"
            className={`transition-colors ${errors.firstName ? 'border-red-500 focus:border-red-500' : ''}`}
            disabled={loading}
          />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Apellido */}
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Apellido *
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Apellido del paciente"
            className={`transition-colors ${errors.lastName ? 'border-red-500 focus:border-red-500' : ''}`}
            disabled={loading}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="email@ejemplo.com"
            className={`transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
            disabled={loading}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Teléfono de contacto *
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+34 612 345 678"
            className={`transition-colors ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
            disabled={loading}
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Cédula */}
        <div className="space-y-2">
          <Label htmlFor="cedula" className="text-sm font-medium text-gray-700">
            Cédula de identidad *
          </Label>
          <Input
            id="cedula"
            value={formData.cedula}
            onChange={(e) => handleInputChange("cedula", e.target.value.replace(/\D/g, ''))}
            placeholder="12345678"
            className={`transition-colors ${errors.cedula ? 'border-red-500 focus:border-red-500' : ''}`}
            disabled={loading}
          />
          {errors.cedula && (
            <p className="text-sm text-red-600">{errors.cedula}</p>
          )}
        </div>

        {/* Fecha de Nacimiento */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
            Fecha de nacimiento *
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className={`transition-colors ${errors.dateOfBirth ? 'border-red-500 focus:border-red-500' : ''}`}
            disabled={loading}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>
      </div>

      {/* Dirección */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium text-gray-700">
          Dirección de residencia *
        </Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          placeholder="Calle, número, ciudad, código postal..."
          rows={3}
          className={`transition-colors ${errors.address ? 'border-red-500 focus:border-red-500' : ''}`}
          disabled={loading}
        />
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="px-6"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="px-6 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {mode === "create" ? "Creando..." : "Guardando..."}
            </div>
          ) : (
            mode === "create" ? "Crear Paciente" : "Guardar Cambios"
          )}
        </Button>
      </div>
    </form>
  );
}
