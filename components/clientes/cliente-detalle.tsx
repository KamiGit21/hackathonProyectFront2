'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Cliente } from '@/lib/types';

interface ClienteDetalleProps {
  cliente: Cliente | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClienteDetalle({
  cliente,
  isOpen,
  onClose,
}: ClienteDetalleProps) {
  if (!cliente) return null;

  const estadoLabel = cliente.estado === 'ACTIVO' ? 'Activo' : 'Inactivo';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles del Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header con info principal */}
          <div className="flex items-start justify-between pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold">
                {cliente.nombre} {cliente.apellidos}
              </h2>
              <p className="text-muted-foreground">{cliente.email}</p>
            </div>
            <Badge
              variant="default"
              className={
                cliente.estado === 'ACTIVO'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }
            >
              {estadoLabel}
            </Badge>
          </div>

          {/* Información personal */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">CI/NIT</p>
              <p className="font-semibold">{cliente.ci_nit}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
              <p className="font-semibold">{cliente.telefono}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Fecha de Nacimiento
              </p>
              <p className="font-semibold">{cliente.fecha_nacimiento}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Fecha de Alta</p>
              <p className="font-semibold">{cliente.fecha_alta}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Dirección</p>
              <p className="font-semibold">{cliente.direccion}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
