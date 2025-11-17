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
import { Eye, Lock, Unlock, DollarSign, Minus } from 'lucide-react';
import { Cuenta, Cliente } from '@/lib/types';

interface CuentasTablaProps {
  cuentas: Cuenta[];
  clientes: Cliente[];
  onOperacion: (tipo: 'depositar' | 'retirar', cuenta: Cuenta) => void;
  onBloquear: (cuenta: Cuenta) => void;
  onDesbloquear: (cuenta: Cuenta) => void;
  onVer: (cuenta: Cuenta) => void;
}

export function CuentasTabla({
  cuentas,
  clientes,
  onOperacion,
  onBloquear,
  onDesbloquear,
  onVer,
}: CuentasTablaProps) {
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroCuenta, setFiltroCuenta] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Activa' | 'Bloqueada'>('Todos');

  const cuentasFiltradas = useMemo(() => {
    return cuentas.filter(cuenta => {
      const cliente = clientes.find(c => c.id === cuenta.clienteId);
      const matchCliente = !filtroCliente ||
        (cliente?.nombre + ' ' + cliente?.apellidos)
          .toLowerCase()
          .includes(filtroCliente.toLowerCase());
      const matchCuenta = filtroCuenta === '' || cuenta.numeroCuenta.includes(filtroCuenta);
      const matchEstado = filtroEstado === 'Todos' || cuenta.estado === filtroEstado;
      return matchCliente && matchCuenta && matchEstado;
    });
  }, [cuentas, clientes, filtroCliente, filtroCuenta, filtroEstado]);

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellidos}` : 'N/A';
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Filtrar por Cliente</label>
          <Input
            placeholder="Buscar por cliente..."
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Filtrar por Nro Cuenta</label>
          <Input
            placeholder="Número de cuenta..."
            value={filtroCuenta}
            onChange={(e) => setFiltroCuenta(e.target.value)}
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
            <option>Activa</option>
            <option>Bloqueada</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nro Cuenta</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Moneda</TableHead>
              <TableHead>Saldo Actual</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cuentasFiltradas.map((cuenta) => (
              <TableRow key={cuenta.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-sm">{cuenta.numeroCuenta}</TableCell>
                <TableCell>{getClienteName(cuenta.clienteId)}</TableCell>
                <TableCell>{cuenta.tipo}</TableCell>
                <TableCell>{cuenta.moneda}</TableCell>
                <TableCell className="font-semibold">
                  {cuenta.moneda} {cuenta.saldoActual.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={cuenta.estado === 'Activa' ? 'default' : 'secondary'}
                    className={
                      cuenta.estado === 'Activa'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {cuenta.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{cuenta.fechaCreacion}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onVer(cuenta)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onOperacion('depositar', cuenta)}
                      disabled={cuenta.estado !== 'Activa'}
                      title="Depositar"
                    >
                      <DollarSign className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onOperacion('retirar', cuenta)}
                      disabled={cuenta.estado !== 'Activa'}
                      title="Retirar"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    {cuenta.estado === 'Activa' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onBloquear(cuenta)}
                        title="Bloquear"
                        className="text-destructive"
                      >
                        <Lock className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDesbloquear(cuenta)}
                        title="Desbloquear"
                        className="text-accent"
                      >
                        <Unlock className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {cuentasFiltradas.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No se encontraron cuentas
        </div>
      )}
    </div>
  );
}
