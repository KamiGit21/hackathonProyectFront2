'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Cuenta } from '@/lib/types';

interface OperacionModalProps {
  tipo: 'depositar' | 'retirar' | null;
  cuenta: Cuenta | null;
  onConfirm: (monto: number) => void;
  onClose: () => void;
  isOpen: boolean;
  loading?: boolean;
}

export function OperacionModal({
  tipo,
  cuenta,
  onConfirm,
  onClose,
  isOpen,
  loading = false,
}: OperacionModalProps) {
  const [monto, setMonto] = useState('');
  const [error, setError] = useState('');

  if (!cuenta || !tipo) return null;

  const handleConfirm = () => {
    setError('');
    const montoNum = parseFloat(monto);

    if (!monto || isNaN(montoNum)) {
      setError('Ingresa un monto válido');
      return;
    }

    if (montoNum <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    if (tipo === 'retirar' && montoNum > cuenta.saldoActual) {
      setError('Saldo insuficiente para esta operación');
      return;
    }

    onConfirm(montoNum);
    setMonto('');
  };

  const handleClose = () => {
    setMonto('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tipo === 'depositar' ? 'Realizar Depósito' : 'Realizar Retiro'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">Número de Cuenta</p>
            <p className="font-mono text-lg font-semibold">{cuenta.numeroCuenta}</p>
            <p className="text-sm text-muted-foreground">
              Saldo Actual: <span className="font-semibold text-foreground">{cuenta.moneda} {cuenta.saldoActual.toFixed(2)}</span>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Monto a {tipo === 'depositar' ? 'Depositar' : 'Retirar'}
            </label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-muted rounded-md text-sm font-medium">
                {cuenta.moneda}
              </span>
              <Input
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
                disabled={loading}
                className={error ? 'border-destructive' : ''}
              />
            </div>
            {error && (
              <p className="text-xs text-destructive mt-1">{error}</p>
            )}
          </div>

          {tipo === 'retirar' && monto && (
            <div className="text-sm">
              <p className="text-muted-foreground">Saldo después de la operación:</p>
              <p className="font-semibold text-lg">
                {cuenta.moneda} {(cuenta.saldoActual - parseFloat(monto)).toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || !monto}
            className="bg-primary text-primary-foreground"
          >
            {loading ? 'Procesando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
