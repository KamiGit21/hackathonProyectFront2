'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Cliente } from '@/lib/types';

interface ClienteFormProps {
  cliente?: Cliente;
  onSave: (cliente: Omit<Cliente, 'id'> | Cliente) => void;
  onClose: () => void;
  isOpen: boolean;
}

type ClienteFormState = {
  nombre: string;
  apellidos: string;
  ci_nit: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  direccion: string;
  estado: 'ACTIVO' | 'INACTIVO';
};

export function ClienteForm({
  cliente,
  onSave,
  onClose,
  isOpen,
}: ClienteFormProps) {
  const [form, setForm] = useState<ClienteFormState>({
    nombre: '',
    apellidos: '',
    ci_nit: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    direccion: '',
    estado: 'ACTIVO',
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cliente) {
      setForm({
        nombre: cliente.nombre ?? '',
        apellidos: cliente.apellidos ?? '',
        ci_nit: cliente.ci_nit ?? '',
        email: cliente.email ?? '',
        telefono: cliente.telefono ?? '',
        fecha_nacimiento: cliente.fecha_nacimiento ?? '',
        direccion: cliente.direccion ?? '',
        estado: cliente.estado ?? 'ACTIVO',
      });
    } else {
      setForm({
        nombre: '',
        apellidos: '',
        ci_nit: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        direccion: '',
        estado: 'ACTIVO',
      });
    }
    setErrores({});
  }, [cliente, isOpen]);

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido';
    if (!form.apellidos.trim()) nuevosErrores.apellidos = 'Los apellidos son requeridos';
    if (!form.ci_nit.trim()) nuevosErrores.ci_nit = 'El CI/NIT es requerido';
    if (!form.email.trim()) nuevosErrores.email = 'El email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nuevosErrores.email = 'Email inválido';
    if (!form.telefono.trim()) nuevosErrores.telefono = 'El teléfono es requerido';
    if (!form.direccion.trim()) nuevosErrores.direccion = 'La dirección es requerida';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) {
      // onSave recibirá el objeto directamente compatible con el backend
      onSave(form as any);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nombre</label>
              <Input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Juan"
                className={errores.nombre ? 'border-destructive' : ''}
              />
              {errores.nombre && (
                <p className="text-xs text-destructive mt-1">{errores.nombre}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Apellidos</label>
              <Input
                value={form.apellidos}
                onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                placeholder="Pérez García"
                className={errores.apellidos ? 'border-destructive' : ''}
              />
              {errores.apellidos && (
                <p className="text-xs text-destructive mt-1">{errores.apellidos}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">CI/NIT</label>
              <Input
                value={form.ci_nit}
                onChange={(e) => setForm({ ...form, ci_nit: e.target.value })}
                placeholder="12345678"
                className={errores.ci_nit ? 'border-destructive' : ''}
              />
              {errores.ci_nit && (
                <p className="text-xs text-destructive mt-1">{errores.ci_nit}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Fecha de Nacimiento
              </label>
              <Input
                type="date"
                value={form.fecha_nacimiento}
                onChange={(e) =>
                  setForm({ ...form, fecha_nacimiento: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="correo@email.com"
                className={errores.email ? 'border-destructive' : ''}
              />
              {errores.email && (
                <p className="text-xs text-destructive mt-1">{errores.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Teléfono</label>
              <Input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="76123456"
                className={errores.telefono ? 'border-destructive' : ''}
              />
              {errores.telefono && (
                <p className="text-xs text-destructive mt-1">{errores.telefono}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Dirección</label>
              <Input
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                placeholder="Calle Principal 123"
                className={errores.direccion ? 'border-destructive' : ''}
              />
              {errores.direccion && (
                <p className="text-xs text-destructive mt-1">{errores.direccion}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Estado</label>
              <select
                value={form.estado}
                onChange={(e) =>
                  setForm({ ...form, estado: e.target.value as 'ACTIVO' | 'INACTIVO' })
                }
                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              {cliente ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
