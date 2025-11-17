'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Cliente, Cuenta } from '@/lib/types';

interface CuentaFormProps {
  cuenta?: Cuenta;
  clientes: Cliente[];
  onSave: (cuenta: Omit<Cuenta, 'id'>) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function CuentaForm({
  cuenta,
  clientes,
  onSave,
  onClose,
  isOpen,
}: CuentaFormProps) {
  const [form, setForm] = useState<any>({
    numeroCuenta: '',
    clienteId: '',
    tipo: 'Ahorro',
    moneda: 'BOB',
    saldoActual: 0,
    estado: 'Activa',
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cuenta) {
      setForm(cuenta);
    } else {
      setForm({
        numeroCuenta: '',
        clienteId: '',
        tipo: 'Ahorro',
        moneda: 'BOB',
        saldoActual: 0,
        estado: 'Activa',
      });
    }
    setErrores({});
  }, [cuenta, isOpen]);

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!form.numeroCuenta.trim())
      nuevosErrores.numeroCuenta = 'El número de cuenta es requerido';
    if (!form.clienteId) nuevosErrores.clienteId = 'Debes seleccionar un cliente';
    if (form.saldoActual < 0)
      nuevosErrores.saldoActual = 'El saldo no puede ser negativo';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) {
      onSave({
        ...form,
        saldoActual: parseFloat(form.saldoActual),
      });
      onClose();
    }
  };

  const generarNumeroCuenta = () => {
    const numero = '100' + Math.random().toString().slice(2, 13);
    setForm({ ...form, numeroCuenta: numero });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {cuenta ? 'Editar Cuenta' : 'Nueva Cuenta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Cliente</label>
              <select
                value={form.clienteId}
                onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md text-sm bg-background ${
                  errores.clienteId ? 'border-destructive' : 'border-input'
                }`}
              >
                <option value="">Seleccionar cliente...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.apellidos}
                  </option>
                ))}
              </select>
              {errores.clienteId && (
                <p className="text-xs text-destructive mt-1">{errores.clienteId}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tipo de Cuenta</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
              >
                <option>Ahorro</option>
                <option>Corriente</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Moneda</label>
              <select
                value={form.moneda}
                onChange={(e) => setForm({ ...form, moneda: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
              >
                <option>BOB</option>
                <option>USD</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Saldo Inicial</label>
              <Input
                type="number"
                step="0.01"
                value={form.saldoActual}
                onChange={(e) =>
                  setForm({ ...form, saldoActual: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
                className={errores.saldoActual ? 'border-destructive' : ''}
              />
              {errores.saldoActual && (
                <p className="text-xs text-destructive mt-1">
                  {errores.saldoActual}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">
                Número de Cuenta
              </label>
              <div className="flex gap-2">
                <Input
                  value={form.numeroCuenta}
                  onChange={(e) =>
                    setForm({ ...form, numeroCuenta: e.target.value })
                  }
                  placeholder="Generar automáticamente"
                  disabled={!cuenta}
                  className={errores.numeroCuenta ? 'border-destructive' : ''}
                />
                {!cuenta && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generarNumeroCuenta}
                  >
                    Generar
                  </Button>
                )}
              </div>
              {errores.numeroCuenta && (
                <p className="text-xs text-destructive mt-1">
                  {errores.numeroCuenta}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              {cuenta ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
