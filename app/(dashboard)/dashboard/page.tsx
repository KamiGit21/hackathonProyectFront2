'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  listarClientes,
  listarCuentas,
  listarTransferencias,
  listarPagos,
} from '@/lib/api';
import { Cliente, Cuenta, Transferencia, PagoServicio } from '@/lib/types';
import { TrendingUp, Users, Wallet, Activity } from 'lucide-react';

export default function DashboardPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
  const [pagos, setPagos] = useState<PagoServicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [c, cu, t, p] = await Promise.all([
          listarClientes(),
          listarCuentas(),
          listarTransferencias(),
          listarPagos(),
        ]);
        setClientes(c);
        setCuentas(cu);
        setTransferencias(t);
        setPagos(p);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const clientesActivos = clientes.filter(c => c.estado === 'Activo').length;
  const cuentasActivas = cuentas.filter(c => c.estado === 'Activa').length;
  const saldoTotal = cuentas.reduce((sum, c) => sum + c.saldoActual, 0);

  // Datos para gráfico
  const chartData = [
    { name: 'Ene', operaciones: 45 },
    { name: 'Feb', operaciones: 52 },
    { name: 'Mar', operaciones: 48 },
    { name: 'Abr', operaciones: 61 },
    { name: 'May', operaciones: 55 },
    { name: 'Jun', operaciones: 67 },
  ];

  const ultimasOperaciones = [
    ...transferencias.slice(0, 3).map(t => ({
      tipo: 'Transferencia',
      descripcion: `${t.tipo} - ${t.monto} BOB`,
      fecha: t.fecha,
      monto: t.monto,
    })),
    ...pagos.slice(0, 2).map(p => ({
      tipo: 'Pago',
      descripcion: `${p.tipoServicio} - ${p.monto} BOB`,
      fecha: p.fecha,
      monto: p.monto,
    })),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userName="Juan Pérez" userRole="Ejecutivo de banca digital">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Clientes Activos</p>
                <p className="text-2xl font-bold">{clientesActivos}</p>
              </div>
              <Users className="w-8 h-8 text-primary/20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cuentas Activas</p>
                <p className="text-2xl font-bold">{cuentasActivas}</p>
              </div>
              <Wallet className="w-8 h-8 text-primary/20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Saldo Total</p>
                <p className="text-2xl font-bold">Bs. {saldoTotal.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent/20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Operaciones</p>
                <p className="text-2xl font-bold">{transferencias.length + pagos.length}</p>
              </div>
              <Activity className="w-8 h-8 text-primary/20" />
            </div>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Operaciones por Mes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="operaciones"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Distribución de Cuentas</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ activas: cuentasActivas, bloqueadas: cuentas.length - cuentasActivas }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                  }}
                />
                <Bar dataKey="activas" fill="var(--color-primary)" />
                <Bar dataKey="bloqueadas" fill="var(--color-destructive)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Últimas operaciones */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Últimas Operaciones</h2>
          <div className="space-y-3">
            {ultimasOperaciones.length > 0 ? (
              ultimasOperaciones.map((op, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{op.tipo}</p>
                    <p className="text-xs text-muted-foreground">{op.descripcion}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">-Bs. {op.monto.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{op.fecha}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">Sin operaciones</p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
