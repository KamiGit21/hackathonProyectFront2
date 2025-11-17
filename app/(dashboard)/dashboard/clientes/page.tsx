'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ClientesTabla } from '@/components/clientes/clientes-tabla';
import { ClienteForm } from '@/components/clientes/cliente-form';
import { ClienteDetalle } from '@/components/clientes/cliente-detalle';
import {
  listarClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from '@/lib/api';
import { Cliente } from '@/lib/types';
import { Plus, AlertCircle } from 'lucide-react';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modales
  const [formOpen, setFormOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | undefined>(
    undefined
  );
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [clienteDetalle, setClienteDetalle] = useState<Cliente | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState<string | null>(null);

  // Cargar clientes
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listarClientes();
      setClientes(data);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevo = () => {
    setClienteEditando(undefined);
    setFormOpen(true);
  };

  const handleEditar = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setFormOpen(true);
  };

  const handleGuardar = async (clienteData: any) => {
    try {
      if (clienteEditando) {
        await actualizarCliente(clienteEditando.id, clienteData);
      } else {
        await crearCliente(clienteData);
      }
      cargarClientes();
      setFormOpen(false);
    } catch (err) {
      setError('Error al guardar el cliente');
      console.error(err);
    }
  };

  const handleEliminar = async () => {
    if (clienteAEliminar) {
      try {
        await eliminarCliente(clienteAEliminar);
        cargarClientes();
        setDeleteConfirmOpen(false);
        setClienteAEliminar(null);
      } catch (err) {
        setError('Error al eliminar el cliente');
        console.error(err);
      }
    }
  };

  const handleDeleteClick = (id: string) => {
    setClienteAEliminar(id);
    setDeleteConfirmOpen(true);
  };

  const handleVer = (cliente: Cliente) => {
    setClienteDetalle(cliente);
    setDetalleOpen(true);
  };

  if (loading && clientes.length === 0) {
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
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona todos los clientes del banco
            </p>
          </div>
          <Button
            onClick={handleNuevo}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Cliente
          </Button>
        </div>

        {error && (
          <div className="flex gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Card className="p-6">
          <ClientesTabla
            clientes={clientes}
            onEdit={handleEditar}
            onDelete={handleDeleteClick}
            onView={handleVer}
          />
        </Card>

        {/* Modales */}
        <ClienteForm
          cliente={clienteEditando}
          onSave={handleGuardar}
          onClose={() => setFormOpen(false)}
          isOpen={formOpen}
        />

        <ClienteDetalle
          cliente={clienteDetalle}
          isOpen={detalleOpen}
          onClose={() => setDetalleOpen(false)}
        />

        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este cliente? Esta acción no
              se puede deshacer.
            </AlertDialogDescription>
            <div className="flex gap-2 justify-end">
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleEliminar}
                className="bg-destructive text-destructive-foreground"
              >
                Eliminar
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
