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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Eye } from 'lucide-react';
import { Cliente } from '@/lib/types';

interface ClientesTablaProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
  onView: (cliente: Cliente) => void;
}

export function ClientesTabla({
  clientes,
  onEdit,
  onDelete,
  onView,
}: ClientesTablaProps) {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCi, setFiltroCi] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Activo' | 'Inactivo'>('Todos');

  const clientesFiltrados = useMemo(() => {
    return clientes.filter(cliente => {
      const matchNombre = `${cliente.nombre} ${cliente.apellidos}`
        .toLowerCase()
        .includes(filtroNombre.toLowerCase());
      const matchCI = cliente.ci.includes(filtroCi);
      const matchEstado =
        filtroEstado === 'Todos' || cliente.estado === filtroEstado;
      return matchNombre && matchCI && matchEstado;
    });
  }, [clientes, filtroNombre, filtroCi, filtroEstado]);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Filtrar por Nombre</label>
          <Input
            placeholder="Buscar por nombre..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Filtrar por CI/NIT</label>
          <Input
            placeholder="Buscar por CI/NIT..."
            value={filtroCi}
            onChange={(e) => setFiltroCi(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Estado</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
          >
            <option>Todos</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nro</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>CI/NIT</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de Alta</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesFiltrados.map((cliente, idx) => (
              <TableRow key={cliente.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>{`${cliente.nombre} ${cliente.apellidos}`}</TableCell>
                <TableCell>{cliente.ci}</TableCell>
                <TableCell className="text-sm">{cliente.email}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
                <TableCell>
                  <Badge
                    variant={cliente.estado === 'Activo' ? 'default' : 'secondary'}
                    className={
                      cliente.estado === 'Activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {cliente.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{cliente.fechaAlta}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(cliente)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(cliente)}
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(cliente.id)}
                      title="Eliminar"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {clientesFiltrados.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No se encontraron clientes
        </div>
      )}
    </div>
  );
}
