'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Cliente } from '@/lib/types';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface PrestamoFormProps {
  clientes: Cliente[];
  onSave: (prestamo: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function PrestamoForm({
  clientes,
  onSave,
  onClose,
  isOpen,
}: PrestamoFormProps) {
  const [form, setForm] = useState<any>({
    clienteId: '',
    montoSolicitado: '',
    plazoMeses: 12,
    tasaAnual: 8.5,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        clienteId: '',
        montoSolicitado: '',
        plazoMeses: 12,
        tasaAnual: 8.5,
      });
      setErrores({});
      setSuccess(false);
    }
  }, [isOpen]);

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!form.clienteId) nuevosErrores.clienteId = 'Debes seleccionar un cliente';
    if (!form.montoSolicitado || parseFloat(form.montoSolicitado) <= 0)
      nuevosErrores.montoSolicitado = 'El monto debe ser mayor a 0';
    if (form.plazoMeses < 1 || form.plazoMeses > 360)
      nuevosErrores.plazoMeses = 'El plazo debe estar entre 1 y 360 meses';
    if (form.tasaAnual < 0 || form.tasaAnual > 50)
      nuevosErrores.tasaAnual = 'La tasa debe estar entre 0 y 50%';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) {
      onSave({
        clienteId: form.clienteId,
        montoSolicitado: parseFloat(form.montoSolicitado),
        plazoMeses: parseInt(form.plazoMeses),
        tasaAnual: parseFloat(form.tasaAnual),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }
  };

  const calcularCuota = () => {
    const monto = parseFloat(form.montoSolicitado) || 0;
    const tasa = form.tasaAnual / 100 / 12;
    const meses = parseInt(form.plazoMeses);
    if (monto > 0 && tasa > 0 && meses > 0) {
      return (monto * (tasa * Math.pow(1 + tasa, meses))) / (Math.pow(1 + tasa, meses) - 1);
    }
    return 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nueva Solicitud de Préstamo</DialogTitle>
        </DialogHeader>

        {success && (
          <div className="flex gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Solicitud de préstamo registrada correctamente</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Cliente</label>
              <select
                value={form.clienteId}
                onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md text-sm bg-background ${
                  errores.clienteId ? 'border-destructive' : 'border-input'
                }`}
              >
                <option value="">Seleccionar cliente...</option>
                {clientes
                  .filter(c => c.estado === 'Activo')
                  .map(c => (
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
              <label className="text-sm font-medium mb-1 block">
                Monto Solicitado (Bs.)
              </label>
              <Input
                type="number"
                step="100"
                value={form.montoSolicitado}
                onChange={(e) =>
                  setForm({ ...form, montoSolicitado: e.target.value })
                }
                placeholder="10000"
                className={errores.montoSolicitado ? 'border-destructive' : ''}
              />
              {errores.montoSolicitado && (
                <p className="text-xs text-destructive mt-1">
                  {errores.montoSolicitado}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Plazo (Meses)</label>
              <Input
                type="number"
                min="1"
                max="360"
                value={form.plazoMeses}
                onChange={(e) =>
                  setForm({ ...form, plazoMeses: e.target.value })
                }
                placeholder="12"
                className={errores.plazoMeses ? 'border-destructive' : ''}
              />
              {errores.plazoMeses && (
                <p className="text-xs text-destructive mt-1">
                  {errores.plazoMeses}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tasa Anual (%)</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={form.tasaAnual}
                onChange={(e) =>
                  setForm({ ...form, tasaAnual: e.target.value })
                }
                placeholder="8.5"
                className={errores.tasaAnual ? 'border-destructive' : ''}
              />
              {errores.tasaAnual && (
                <p className="text-xs text-destructive mt-1">
                  {errores.tasaAnual}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Cuota Mensual Estimada
              </label>
              <div className="px-3 py-2 bg-muted rounded-md text-sm font-semibold">
                Bs. {calcularCuota().toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Los préstamos menores a Bs. 10,000 serán evaluados automáticamente como aprobados.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              Solicitar Préstamo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
