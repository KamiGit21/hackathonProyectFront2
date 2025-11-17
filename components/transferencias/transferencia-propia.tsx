'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Cuenta } from '@/lib/types';

interface TransferenciaPropiaProps {
  cuentas: Cuenta[];
  onTransferir: (data: any) => Promise<void>;
  loading?: boolean;
}

export function TransferenciaPropia({
  cuentas,
  onTransferir,
  loading = false,
}: TransferenciaPropiaProps) {
  const [cuentaOrigen, setCuentaOrigen] = useState(cuentas[0]?.id || '');
  const [cuentaDestino, setCuentaDestino] = useState(
    cuentas.length > 1 ? cuentas[1].id : ''
  );
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const cuentaOrigenObj = cuentas.find(c => c.id === cuentaOrigen);
  const cuentaDestinoObj = cuentas.find(c => c.id === cuentaDestino);

  const validar = () => {
    if (!cuentaOrigen) {
      setError('Selecciona una cuenta origen');
      return false;
    }
    if (!cuentaDestino) {
      setError('Selecciona una cuenta destino');
      return false;
    }
    if (cuentaOrigen === cuentaDestino) {
      setError('Las cuentas origen y destino no pueden ser iguales');
      return false;
    }
    if (!monto || parseFloat(monto) <= 0) {
      setError('Ingresa un monto válido');
      return false;
    }
    if (cuentaOrigenObj && parseFloat(monto) > cuentaOrigenObj.saldoActual) {
      setError('Saldo insuficiente');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validar()) return;

    try {
      await onTransferir({
        cuentaOrigen,
        cuentaDestino,
        monto: parseFloat(monto),
        descripcion,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setMonto('');
      setDescripcion('');
    } catch (err) {
      setError('Error al procesar la transferencia');
    }
  };

  const cuentasDisponibles = cuentas.filter(c => c.estado === 'Activa');

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Transferir entre mis cuentas</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="flex gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Transferencia realizada exitosamente</span>
          </div>
        )}

        {error && (
          <div className="flex gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Cuenta Origen</label>
            <select
              value={cuentaOrigen}
              onChange={(e) => setCuentaOrigen(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
            >
              {cuentasDisponibles.map(c => (
                <option key={c.id} value={c.id}>
                  {c.numeroCuenta} - {c.moneda} {c.saldoActual.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Cuenta Destino</label>
            <select
              value={cuentaDestino}
              onChange={(e) => setCuentaDestino(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
            >
              {cuentasDisponibles
                .filter(c => c.id !== cuentaOrigen)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.numeroCuenta} - {c.moneda} {c.saldoActual.toFixed(2)}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Monto</label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-muted rounded-md text-sm font-medium">
                {cuentaOrigenObj?.moneda || 'BOB'}
              </span>
              <Input
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium mb-1 block">
              Descripción (Opcional)
            </label>
            <Input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Pago de deuda personal"
            />
          </div>

          {monto && (
            <div className="col-span-2 bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Saldo disponible en cuenta origen:{' '}
                <span className="font-semibold text-foreground">
                  {cuentaOrigenObj?.moneda} {cuentaOrigenObj?.saldoActual.toFixed(2)}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Saldo después de transferencia:{' '}
                <span className="font-semibold text-foreground">
                  {cuentaOrigenObj?.moneda}{' '}
                  {((cuentaOrigenObj?.saldoActual || 0) - parseFloat(monto || '0')).toFixed(2)}
                </span>
              </p>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || cuentasDisponibles.length < 2}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? 'Procesando...' : 'Transferir'}
        </Button>
      </form>
    </Card>
  );
}
