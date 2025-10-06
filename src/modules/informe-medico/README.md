# Módulo Informe Médico

Este módulo proporciona funcionalidad completa para la gestión de informes médicos dentro del sistema de gestión médica.

## Estructura del Módulo

```
src/modules/informe-medico/
├── InformeMedico.tsx              # Componente principal
├── InformeMedicoList.tsx          # Lista de informes médicos
├── InformeMedicoModal.tsx         # Modal de creación/edición
├── InformeMedicoPreview.tsx       # Previsualización del informe
└── useInformeMedico.ts            # Hook para manejo de estado y API
```

## Funcionalidades

### ✅ CRUD Completo
- **Crear**: Nuevo informe médico con validación completa
- **Leer**: Lista de informes con paginación y filtros
- **Actualizar**: Edición de informes existentes
- **Eliminar**: Eliminación con confirmación

### ✅ Campos del Informe
- **Motivo de consulta** (requerido)
- **Examen físico** (requerido)
- **Diagnóstico** (requerido)
- **Indicaciones/Tratamiento** (requerido)
- **Fecha del informe** (requerido)
- **Firma del médico** (opcional)

### ✅ Previsualización y Exportación
- **Previsualización**: Modal con diseño tipo hoja médica oficial
- **Impresión**: Función de impresión nativa del navegador
- **PDF**: Preparado para generación de PDF (pendiente implementación)

### ✅ Integración
- **PatientDetailView**: Integrado como nueva pestaña "Informes Médicos"
- **Datos automáticos**: Información del paciente y médico cargada automáticamente
- **Consistencia visual**: Mantiene el diseño del sistema existente

## Uso

### Importación
```tsx
import InformeMedico from '../informe-medico/InformeMedico';
```

### Props Requeridas
```tsx
<InformeMedico
  patientId={patient.id}
  patientData={{
    firstName: patient.firstName,
    lastName: patient.lastName,
    cedula: patient.cedula || '',
    dateOfBirth: patient.dateOfBirth || ''
  }}
  doctorData={{
    firstName: "Dr. John",
    lastName: "Smith",
    email: "doctor@neuralapp.cloud",
    mpps: "12345",
    cm: "CM-67890"
  }}
/>
```

## API Endpoints

El módulo utiliza los siguientes endpoints:

- `GET /api/medical-reports?paciente_id={id}` - Obtener informes por paciente
- `POST /api/medical-reports` - Crear nuevo informe
- `PUT /api/medical-reports/{id}` - Actualizar informe
- `DELETE /api/medical-reports/{id}` - Eliminar informe
- `GET /api/medical-reports/{id}` - Obtener informe por ID

## Validaciones

### Campos Requeridos
- Motivo de consulta
- Examen físico
- Diagnóstico
- Indicaciones/Tratamiento
- Fecha del informe

### Validaciones Adicionales
- Formato de fecha válido
- Campos no vacíos después de trim
- Manejo de errores de red y servidor

## Manejo de Errores

### Tipos de Error
- **401**: No autorizado
- **404**: Recurso no encontrado
- **502**: Servidor no disponible
- **ECONNREFUSED**: Conexión rechazada
- **ECONNABORTED**: Tiempo de conexión agotado

### Notificaciones
- Toast de éxito al guardar/actualizar/eliminar
- Toast de error con mensaje descriptivo
- Estados de carga con spinners

## Estilos

### Diseño Consistente
- Utiliza Tailwind CSS
- Componentes de shadcn/ui
- Colores del sistema (primary, secondary, etc.)
- Animaciones y transiciones suaves

### Responsive
- Grid adaptativo para móviles
- Modales responsivos
- Tablas con scroll horizontal en móviles

## Próximas Mejoras

### Funcionalidades Pendientes
- [ ] Generación real de PDF con jsPDF
- [ ] Edición de informes existentes
- [ ] Búsqueda y filtros avanzados
- [ ] Exportación masiva de informes
- [ ] Plantillas de informes personalizables

### Optimizaciones
- [ ] Lazy loading de componentes
- [ ] Cache de informes
- [ ] Paginación del lado del servidor
- [ ] Compresión de imágenes

## Testing

### Casos de Prueba Recomendados
1. **Creación**: Crear informe con todos los campos
2. **Validación**: Intentar guardar sin campos requeridos
3. **Lista**: Verificar carga y visualización de informes
4. **Previsualización**: Abrir modal de preview
5. **Eliminación**: Eliminar informe con confirmación
6. **Errores**: Simular errores de red y servidor

### Verificación Manual
1. Abrir aplicación en `http://localhost:8080`
2. Ir a Pacientes → Seleccionar paciente
3. Hacer clic en pestaña "Informes Médicos"
4. Crear nuevo informe médico
5. Verificar previsualización
6. Probar funcionalidades de impresión y PDF
