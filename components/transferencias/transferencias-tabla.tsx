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
import { Transferencia } from '@/lib/types';

interface TransferenciasTablaProps {
  transferencias: Transferencia[];
}

export function TransferenciasTabla({
  transferencias,
}: TransferenciasTablaProps) {
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Exitoso' | 'Fallido' | 'Pendiente'>('Todos');

  const transferenciasFiltradas = useMemo(() => {
    return transferencias.filter(t => {
      const matchTipo = filtroTipo === 'Todos' || t.tipo === filtroTipo;
      const matchEstado = filtroEstado === 'Todos' || t.estado === filtroEstado;
      return matchTipo && matchEstado;
    });
  }, [transferencias, filtroTipo, filtroEstado]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Tipo</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
          >
            <option>Todos</option>
            <option>Propia</option>
            <option>Terceros</option>
            <option>Otros Bancos</option>
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
              <TableHead>Tipo</TableHead>
              <TableHead>Cuenta Origen</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Descripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transferenciasFiltradas.map((t) => (
              <TableRow key={t.id} className="hover:bg-muted/30">
                <TableCell className="text-sm">{t.fecha}</TableCell>
                <TableCell className="text-sm">{t.tipo}</TableCell>
                <TableCell className="font-mono text-xs">
                  {t.cuentaOrigenId}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {t.destino}
                </TableCell>
                <TableCell className="font-semibold">Bs. {t.monto.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      t.estado === 'Exitoso'
                        ? 'default'
                        : t.estado === 'Fallido'
                        ? 'secondary'
                        : 'outline'
                    }
                    className={
                      t.estado === 'Exitoso'
                        ? 'bg-green-100 text-green-800'
                        : t.estado === 'Fallido'
                        ? 'bg-red-100 text-red-800'
                        : ''
                    }
                  >
                    {t.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {t.descripcion || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {transferenciasFiltradas.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No se encontraron transferencias
        </div>
      )}
    </div>
  );
}
