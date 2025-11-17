'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Cuenta } from '@/lib/types';

interface PagosFormProps {
  cuentas: Cuenta[];
  onPagar: (
    cuentaId: string,
    servicio: string,
    codigo: string,
    monto: number,
    descripcion: string
  ) => Promise<void>;
  loading?: boolean;
}

export function PagosForm({
  cuentas,
  onPagar,
  loading = false,
}: PagosFormProps) {
  const [servicio, setServicio] = useState('Luz');
  const [cuentaId, setCuentaId] = useState(cuentas[0]?.id || '');
  const [codigo, setCodigo] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!cuentaId) nuevosErrores.cuentaId = 'Debes seleccionar una cuenta';
    if (!codigo.trim()) nuevosErrores.codigo = 'El código de suministro es requerido';
    if (!monto || parseFloat(monto) <= 0) nuevosErrores.monto = 'Ingresa un monto válido';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      await onPagar(cuentaId, servicio, codigo, parseFloat(monto), descripcion);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setCodigo('');
      setMonto('');
      setDescripcion('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Realizar Pago de Servicio</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="flex gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Pago procesado correctamente</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Cuenta a Debitar</label>
            <select
              value={cuentaId}
              onChange={(e) => setCuentaId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-sm bg-background ${
                errores.cuentaId ? 'border-destructive' : 'border-input'
              }`}
            >
              {cuentas.map(c => (
                <option key={c.id} value={c.id}>
                  {c.numeroCuenta} - {c.moneda} {c.saldoActual.toFixed(2)}
                </option>
              ))}
            </select>
            {errores.cuentaId && (
              <p className="text-xs text-destructive mt-1">{errores.cuentaId}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Tipo de Servicio</label>
            <select
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
            >
              <option>Luz</option>
              <option>Agua</option>
              <option>Teléfono</option>
              <option>Gas</option>
              <option>Internet</option>
              <option>Otro</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Código de Suministro / Nro Referencia
            </label>
            <Input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej: LUZ-123456"
              className={errores.codigo ? 'border-destructive' : ''}
            />
            {errores.codigo && (
              <p className="text-xs text-destructive mt-1">{errores.codigo}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Monto</label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-muted rounded-md text-sm font-medium">
                Bs.
              </span>
              <Input
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
                className={errores.monto ? 'border-destructive' : ''}
              />
            </div>
            {errores.monto && (
              <p className="text-xs text-destructive mt-1">{errores.monto}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium mb-1 block">
              Descripción (Opcional)
            </label>
            <Input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Pago factura mensual"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || cuentas.length === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? 'Procesando...' : 'Enviar Pago'}
        </Button>
      </form>
    </Card>
  );
}
