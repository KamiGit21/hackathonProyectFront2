'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:8000';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Si ya hay token guardado, puedes auto-redirigir al dashboard
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('chuno_token');
    if (token) {
      // aquí podrías opcionalmente validar llamando a /auth/me
      router.replace('/dashboard');
    }
  }, [router]);

  const handleGoogleLogin = () => {
    setError('');
    setLoading(true);

    // Redirige directamente al backend para iniciar el flujo OAuth
    window.location.href = `${AUTH_BASE_URL}/auth/google/login`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">CB</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">CHUNO Bank</h1>
          <p className="text-center text-muted-foreground mb-8">
            Banca Digital Segura
          </p>

          {/* Mensaje de error si algo sale mal */}
          {error && (
            <div className="mb-4 flex gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Botón de login con Google */}
          <div className="space-y-4">
            <Button
              type="button"
              className="w-full bg-white text-black border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {/* Icono de Google “fake” simple con círculo */}
              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 via-yellow-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                G
              </span>
              {loading ? 'Redirigiendo a Google…' : 'Continuar con Google'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Al continuar, se verificará tu cuenta en CHUNO Bank.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>Sistema de demostración para hackathon académico</p>
            <p className="mt-2 text-xs">© 2025 CHUNO Bank</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
