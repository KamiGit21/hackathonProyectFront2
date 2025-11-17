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
import { Input } from '@/components/ui/input';
import { PagoServicio } from '@/lib/types';

interface PagosTablaProps {
  pagos: PagoServicio[];
}

export function PagosTabla({ pagos }: PagosTablaProps) {
  const [filtroServicio, setFiltroServicio] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Exitoso' | 'Fallido' | 'Pendiente'>('Todos');

  const pagosFiltrados = useMemo(() => {
    return pagos.filter(pago => {
      const matchServicio =
        filtroServicio === 'Todos' || pago.tipoServicio === filtroServicio;
      const matchEstado =
        filtroEstado === 'Todos' || pago.estado === filtroEstado;
      return matchServicio && matchEstado;
    });
  }, [pagos, filtroServicio, filtroEstado]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Tipo de Servicio</label>
          <select
            value={filtroServicio}
            onChange={(e) => setFiltroServicio(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
          >
            <option>Todos</option>
            <option>Luz</option>
            <option>Agua</option>
            <option>Teléfono</option>
            <option>Gas</option>
            <option>Internet</option>
            <option>Otro</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Estado</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
          >
            <option>Todos</option>
            <option>Exitoso</option>
            <option>Fallido</option>
            <option>Pendiente</option>
          </select>
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Código Suministro</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Descripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagosFiltrados.map((pago) => (
              <TableRow key={pago.id} className="hover:bg-muted/30">
                <TableCell className="text-sm">{pago.fecha}</TableCell>
                <TableCell>{pago.tipoServicio}</TableCell>
                <TableCell className="font-mono text-sm">
                  {pago.codigoSuministro}
                </TableCell>
                <TableCell className="font-semibold">Bs. {pago.monto.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      pago.estado === 'Exitoso'
                        ? 'default'
                        : pago.estado === 'Fallido'
                        ? 'secondary'
                        : 'outline'
                    }
                    className={
                      pago.estado === 'Exitoso'
                        ? 'bg-green-100 text-green-800'
                        : pago.estado === 'Fallido'
                        ? 'bg-red-100 text-red-800'
                        : ''
                    }
                  >
                    {pago.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {pago.descripcion || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagosFiltrados.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No se encontraron pagos
        </div>
      )}
    </div>
  );
}
