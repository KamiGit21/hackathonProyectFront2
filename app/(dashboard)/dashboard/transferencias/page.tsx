'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { TransferenciaTabs } from '@/components/transferencias/transferencia-tabs';
import { TransferenciasTabla } from '@/components/transferencias/transferencias-tabla';
import {
  listarCuentas,
  listarTransferencias,
  transferirInterno,
  transferirTerceros,
  transferirInterbancario,
} from '@/lib/api';
import { Cuenta, Transferencia } from '@/lib/types';

export default function TransferenciasPage() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cu, t] = await Promise.all([listarCuentas(), listarTransferencias()]);
      setCuentas(cu.filter(c => c.estado === 'Activa'));
      setTransferencias(t);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferir = async (tipo: string, data: any) => {
    try {
      setProcesando(true);
      setError(null);

      let nuevaTransferencia: Transferencia;

      if (tipo === 'propia') {
        nuevaTransferencia = await transferirInterno({
          cuentaOrigenId: data.cuentaOrigen,
          cuentaDestinoId: data.cuentaDestino,
          destino: data.cuentaDestino,
          monto: data.monto,
          descripcion: data.descripcion,
          estado: 'Exitoso',
          fecha: new Date().toISOString().split('T')[0],
        });
      } else if (tipo === 'terceros') {
        nuevaTransferencia = await transferirTerceros({
          cuentaOrigenId: data.cuentaOrigen,
          destino: data.destino,
          monto: data.monto,
          descripcion: data.descripcion,
          estado: 'Exitoso',
          fecha: new Date().toISOString().split('T')[0],
        });
      } else {
        nuevaTransferencia = await transferirInterbancario({
          cuentaOrigenId: data.cuentaOrigen,
          destino: `${data.banco} - ${data.destino}`,
          monto: data.monto,
          descripcion: data.descripcion,
          estado: 'Exitoso',
          fecha: new Date().toISOString().split('T')[0],
        });
      }

      setTransferencias([nuevaTransferencia, ...transferencias]);
      cargarDatos();
    } catch (err) {
      setError('Error al procesar la transferencia');
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  if (loading && transferencias.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Transferencias</h1>
          <p className="text-muted-foreground mt-1">
            Realiza transferencias internas, a terceros u otros bancos
          </p>
        </div>

        {error && (
          <div className="flex gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {cuentas.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No hay cuentas activas disponibles
          </Card>
        ) : (
          <>
            <Card className="p-6">
              <TransferenciaTabs
                cuentas={cuentas}
                onTransferir={handleTransferir}
                loading={procesando}
              />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Historial de Transferencias</h2>
              <TransferenciasTabla transferencias={transferencias} />
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
