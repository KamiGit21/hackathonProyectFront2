'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CuentasTabla } from '@/components/cuentas/cuentas-tabla';
import { CuentaForm } from '@/components/cuentas/cuenta-form';
import { OperacionModal } from '@/components/cuentas/operacion-modal';
import {
  listarCuentas,
  crearCuenta,
  actualizarCuenta,
  depositar,
  retirar,
  listarClientes,
} from '@/lib/api';
import { Cuenta, Cliente } from '@/lib/types';
import { Plus, AlertCircle } from 'lucide-react';

export default function CuentasPage() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modales
  const [formOpen, setFormOpen] = useState(false);
  const [cuentaEditando, setCuentaEditando] = useState<Cuenta | undefined>(undefined);
  const [operacionTipo, setOperacionTipo] = useState<'depositar' | 'retirar' | null>(null);
  const [cuentaOperacion, setCuentaOperacion] = useState<Cuenta | null>(null);
  const [blockOpen, setBlockOpen] = useState(false);
  const [cuentaABloquear, setCuentaABloquear] = useState<Cuenta | null>(null);

  // Cargar datos
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cu, cl] = await Promise.all([
        listarCuentas(),
        listarClientes(),
      ]);
      setCuentas(cu);
      setClientes(cl);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevo = () => {
    setCuentaEditando(undefined);
    setFormOpen(true);
  };

  const handleEditar = (cuenta: Cuenta) => {
    setCuentaEditando(cuenta);
    setFormOpen(true);
  };

  const handleGuardar = async (cuentaData: any) => {
    try {
      if (cuentaEditando) {
        await actualizarCuenta(cuentaEditando.id, cuentaData);
      } else {
        await crearCuenta(cuentaData);
      }
      cargarDatos();
      setFormOpen(false);
    } catch (err) {
      setError('Error al guardar la cuenta');
      console.error(err);
    }
  };

  const handleOperacion = (tipo: 'depositar' | 'retirar', cuenta: Cuenta) => {
    setOperacionTipo(tipo);
    setCuentaOperacion(cuenta);
  };

  const handleConfirmarOperacion = async (monto: number) => {
    if (!cuentaOperacion || !operacionTipo) return;

    try {
      if (operacionTipo === 'depositar') {
        await depositar(cuentaOperacion.id, monto);
      } else {
        await retirar(cuentaOperacion.id, monto);
      }
      cargarDatos();
      setOperacionTipo(null);
      setCuentaOperacion(null);
    } catch (err) {
      setError('Error al procesar la operación');
      console.error(err);
    }
  };

  const handleBloquear = (cuenta: Cuenta) => {
    setCuentaABloquear(cuenta);
    setBlockOpen(true);
  };

  const handleDesbloquear = (cuenta: Cuenta) => {
    handleConfirmarBloqueo(cuenta, 'Activa');
  };

  const handleConfirmarBloqueo = async (cuenta: Cuenta, nuevoEstado: 'Activa' | 'Bloqueada') => {
    try {
      await actualizarCuenta(cuenta.id, { estado: nuevoEstado });
      cargarDatos();
      setBlockOpen(false);
      setCuentaABloquear(null);
    } catch (err) {
      setError('Error al cambiar el estado de la cuenta');
      console.error(err);
    }
  };

  if (loading && cuentas.length === 0) {
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
            <h1 className="text-3xl font-bold">Cuentas de Ahorro</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona todas las cuentas del banco
            </p>
          </div>
          <Button
            onClick={handleNuevo}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Cuenta
          </Button>
        </div>

        {error && (
          <div className="flex gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Card className="p-6">
          <CuentasTabla
            cuentas={cuentas}
            clientes={clientes}
            onOperacion={handleOperacion}
            onBloquear={handleBloquear}
            onDesbloquear={handleDesbloquear}
            onVer={() => {}}
          />
        </Card>

        {/* Modales */}
        <CuentaForm
          cuenta={cuentaEditando}
          clientes={clientes}
          onSave={handleGuardar}
          onClose={() => setFormOpen(false)}
          isOpen={formOpen}
        />

        <OperacionModal
          tipo={operacionTipo}
          cuenta={cuentaOperacion}
          onConfirm={handleConfirmarOperacion}
          onClose={() => {
            setOperacionTipo(null);
            setCuentaOperacion(null);
          }}
          isOpen={operacionTipo !== null}
        />

        <AlertDialog open={blockOpen} onOpenChange={setBlockOpen}>
          <AlertDialogContent>
            <AlertDialogTitle>
              {cuentaABloquear?.estado === 'Activa'
                ? 'Bloquear Cuenta'
                : 'Desbloquear Cuenta'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {cuentaABloquear?.estado === 'Activa'
                ? '¿Estás seguro de que deseas bloquear esta cuenta? Los titulares no podrán hacer operaciones.'
                : '¿Estás seguro de que deseas desbloquear esta cuenta?'}
            </AlertDialogDescription>
            <div className="flex gap-2 justify-end">
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (cuentaABloquear) {
                    handleConfirmarBloqueo(
                      cuentaABloquear,
                      cuentaABloquear.estado === 'Activa'
                        ? 'Bloqueada'
                        : 'Activa'
                    );
                  }
                }}
              >
                Confirmar
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
