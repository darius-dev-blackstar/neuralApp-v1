import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield, Stethoscope, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Intentar autenticación real primero
      try {
        const response = await authService.login({ email, password });
        
        // Guardar tokens y datos del usuario
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("userRole", response.user.role);
        localStorage.setItem("userName", response.user.name);
        
        // Redirigir según el rol
        if (response.user.role === "ADMIN") {
          window.location.href = "https://admin.neuralapp.cloud";
        } else {
          navigate("/");
        }
        return;
      } catch (apiError: any) {
        // Si la API falla, usar credenciales demo como fallback
        console.warn("API authentication failed, falling back to demo credentials:", apiError.message);
        
        // Fallback a credenciales demo
        if (email === "doctor@neuralapp.cloud" && password === "Doctor123!") {
          localStorage.setItem("accessToken", "demo-access-token");
          localStorage.setItem("refreshToken", "demo-refresh-token");
          localStorage.setItem("userRole", "DOCTOR");
          localStorage.setItem("userName", "Dr. Demo Doctor");
          
          navigate("/");
        } else if (email === "admin@neuralapp.cloud" && password === "ArpA4cvR$") {
          localStorage.setItem("accessToken", "demo-admin-token");
          localStorage.setItem("refreshToken", "demo-admin-refresh-token");
          localStorage.setItem("userRole", "ADMIN");
          localStorage.setItem("userName", "Admin Demo");
          
          window.location.href = "https://admin.neuralapp.cloud";
        } else {
          setError("Credenciales inválidas. Usa las credenciales demo para probar el sistema.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'doctor') => {
    if (role === 'admin') {
      setEmail('admin@neuralapp.cloud');
      setPassword('ArpA4cvR$');
    } else {
      setEmail('doctor@neuralapp.cloud');
      setPassword('Doctor123!');
    }
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="w-full max-w-md space-y-8 px-4">
        {/* Logo NeuralApp */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="h-10 w-10" style={{ color: '#458BFF' }} />
            <h1 className="text-3xl font-bold" style={{ color: '#201E1C' }}>NeuralApp</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-2" style={{ color: '#201E1C' }}>
            Iniciar Sesión
          </h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Accede a tu panel de administración médica
          </p>
        </div>

        {/* Card de Login */}
        <Card className="rounded-2xl shadow-lg" style={{ 
          backgroundColor: '#FFFFFF',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center" style={{ color: '#201E1C' }}>Iniciar Sesión</CardTitle>
            <CardDescription className="text-center" style={{ color: '#6B7280' }}>
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="rounded-lg" style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription style={{ color: '#DC2626' }}>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: '#201E1C' }}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{
                    borderColor: '#E5E7EB',
                    backgroundColor: '#FFFFFF',
                    color: '#201E1C'
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: '#201E1C' }}>Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 pr-12"
                    style={{
                      borderColor: '#E5E7EB',
                      backgroundColor: '#FFFFFF',
                      color: '#201E1C'
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: '#6B7280' }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full transition-all duration-200"
                disabled={loading || !email || !password}
                style={{
                  backgroundColor: loading ? '#9CA3AF' : '#458BFF',
                  color: '#FFFFFF',
                  opacity: (!email || !password || loading) ? 0.6 : 1,
                  cursor: (!email || !password || loading) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Verificando...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Credenciales Demo */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: '#E5E7EB' }} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2" style={{ backgroundColor: '#FFFFFF', color: '#6B7280' }}>
                    Credenciales Demo
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fillDemoCredentials('admin')}
                  className="p-3 transition-colors duration-200"
                  style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" style={{ color: '#DC2626' }} />
                    <div className="text-left">
                      <p className="text-xs font-medium" style={{ color: '#DC2626' }}>Admin</p>
                      <p className="text-xs" style={{ color: '#B91C1C' }}>admin@neuralapp.cloud / ArpA4cvR$</p>
                    </div>
                  </div>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fillDemoCredentials('doctor')}
                  className="p-3 transition-colors duration-200"
                  style={{ backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }}
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="h-4 w-4" style={{ color: '#458BFF' }} />
                    <div className="text-left">
                      <p className="text-xs font-medium" style={{ color: '#458BFF' }}>Doctor</p>
                      <p className="text-xs" style={{ color: '#2563EB' }}>doctor@neuralapp.cloud / Doctor123!</p>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
