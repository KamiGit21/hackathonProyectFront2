'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    const roles = params.get('roles')?.split(',') ?? [];
    const email = params.get('email');

    if (!token) {
      router.replace('/login');
      return;
    }

    // Guardar token y roles
    localStorage.setItem('chuno_token', token);
    localStorage.setItem('chuno_roles', JSON.stringify(roles));
    localStorage.setItem('chuno_email', email ?? '');

    // Solo permitir si es ADMIN
    if (!roles.includes('ADMIN')) {
      alert('Acceso denegado: no eres ADMIN');
      router.replace('/login');
      return;
    }

    // Redirigir al dashboard
    router.replace('/dashboard');
  }, [router, params]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Procesando autenticación...</p>
    </div>
  );
}
