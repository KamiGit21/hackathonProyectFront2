'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { PrestamosTabla } from '@/components/prestamos/prestamos-tabla';
import { PrestamoForm } from '@/components/prestamos/prestamo-form';
import {
  listarPrestamos,
  crearSolicitudPrestamo,
  listarClientes,
} from '@/lib/api';
import { Prestamo, Cliente } from '@/lib/types';
import { Plus } from 'lucide-react';

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [p, c] = await Promise.all([listarPrestamos(), listarClientes()]);
      setPrestamos(p);
      setClientes(c);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (data: any) => {
    try {
      const nuevoPrestamo = await crearSolicitudPrestamo(data);
      setPrestamos([nuevoPrestamo, ...prestamos]);
    } catch (err) {
      setError('Error al crear la solicitud');
      console.error(err);
    }
  };

  if (loading && prestamos.length === 0) {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Préstamos</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona solicitudes y aprobación de préstamos
            </p>
          </div>
          <Button
            onClick={() => setFormOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Solicitud
          </Button>
        </div>

        {error && (
          <div className="flex gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Total de Solicitudes</p>
              <p className="text-2xl font-bold">{prestamos.length}</p>
            </Card>
            <Card className="p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Aprobadas</p>
              <p className="text-2xl font-bold text-green-600">
                {prestamos.filter(p => p.estado === 'Aprobado').length}
              </p>
            </Card>
            <Card className="p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">En Evaluación</p>
              <p className="text-2xl font-bold text-yellow-600">
                {prestamos.filter(p => p.estado === 'En evaluación').length}
              </p>
            </Card>
          </div>

          <PrestamosTabla prestamos={prestamos} clientes={clientes} />
        </Card>

        <PrestamoForm
          clientes={clientes}
          onSave={handleCrear}
          onClose={() => setFormOpen(false)}
          isOpen={formOpen}
        />
      </div>
    </DashboardLayout>
  );
}
