'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validación básica
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email inválido');
      setLoading(false);
      return;
    }

    // Simulación de login
    await new Promise(resolve => setTimeout(resolve, 800));

    // Credentials de prueba
    if (email === 'admin@chunobank.com' && password === 'password') {
      router.push('/dashboard');
    } else {
      setError('Email o contraseña incorrectos');
    }

    setLoading(false);
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

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email o Usuario</label>
              <Input
                type="email"
                placeholder="admin@chunobank.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Demo: admin@chunobank.com
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contraseña</label>
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">Demo: password</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              Sistema de demostración para hackathon académico
            </p>
            <p className="mt-2 text-xs">© 2025 CHUNO Bank</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
