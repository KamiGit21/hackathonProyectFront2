'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { PagosForm } from '@/components/pagos/pagos-form';
import { PagosTabla } from '@/components/pagos/pagos-tabla';
import {
  listarCuentas,
  listarPagos,
  realizarPagoServicio,
} from '@/lib/api';
import { Cuenta, PagoServicio } from '@/lib/types';

export default function PagosPage() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [pagos, setPagos] = useState<PagoServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesandoPago, setProcesandoPago] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cu, p] = await Promise.all([listarCuentas(), listarPagos()]);
      setCuentas(cu.filter(c => c.estado === 'Activa'));
      setPagos(p);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePagar = async (
    cuentaId: string,
    servicio: string,
    codigo: string,
    monto: number,
    descripcion: string
  ) => {
    try {
      setProcesandoPago(true);
      setError(null);

      const nuevoPago = await realizarPagoServicio({
        cuentaId,
        tipoServicio: servicio as any,
        codigoSuministro: codigo,
        monto,
        estado: 'Exitoso',
        fecha: new Date().toISOString().split('T')[0],
        descripcion,
      });

      setPagos([nuevoPago, ...pagos]);
      cargarDatos();
    } catch (err) {
      setError('Error al procesar el pago');
      console.error(err);
    } finally {
      setProcesandoPago(false);
    }
  };

  if (loading && pagos.length === 0) {
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
          <h1 className="text-3xl font-bold">Pagos de Servicios</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los pagos de servicios (Luz, Agua, Teléfono, etc.)
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
            <PagosForm
              cuentas={cuentas}
              onPagar={handlePagar}
              loading={procesandoPago}
            />

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Historial de Pagos</h2>
              <PagosTabla pagos={pagos} />
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
