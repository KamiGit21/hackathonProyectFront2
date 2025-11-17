'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Prestamo, Cliente } from '@/lib/types';

interface PrestamosTablaProps {
  prestamos: Prestamo[];
  clientes: Cliente[];
}

export function PrestamosTabla({ prestamos, clientes }: PrestamosTablaProps) {
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'En evaluación' | 'Aprobado' | 'Rechazado'>('Todos');

  const prestamosFiltrados = useMemo(() => {
    return prestamos.filter(p =>
      filtroEstado === 'Todos' || p.estado === filtroEstado
    );
  }, [prestamos, filtroEstado]);

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellidos}` : 'N/A';
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'Aprobado':
        return 'bg-green-100 text-green-800';
      case 'Rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Estado</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as any)}
          className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background max-w-xs"
        >
          <option>Todos</option>
          <option>En evaluación</option>
          <option>Aprobado</option>
          <option>Rechazado</option>
        </select>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Monto Solicitado</TableHead>
              <TableHead>Plazo (Meses)</TableHead>
              <TableHead>Tasa Anual</TableHead>
              <TableHead>Cuota Mensual</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Solicitud</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prestamosFiltrados.map((prestamo) => (
              <TableRow key={prestamo.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-sm">{prestamo.id}</TableCell>
                <TableCell>{getClienteName(prestamo.clienteId)}</TableCell>
                <TableCell className="font-semibold">Bs. {prestamo.montoSolicitado.toFixed(2)}</TableCell>
                <TableCell>{prestamo.plazoMeses}</TableCell>
                <TableCell>{prestamo.tasaAnual.toFixed(2)}%</TableCell>
                <TableCell className="font-semibold">
                  {prestamo.montoMensual
                    ? `Bs. ${prestamo.montoMensual.toFixed(2)}`
                    : '-'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="default"
                    className={getBadgeColor(prestamo.estado)}
                  >
                    {prestamo.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{prestamo.fechaSolicitud}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {prestamosFiltrados.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No se encontraron préstamos
        </div>
      )}
    </div>
  );
}
