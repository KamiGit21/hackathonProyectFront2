// Servicios Mock API para CHUNO Bank
import {
  Cliente,
  Cuenta,
  PagoServicio,
  Transferencia,
  Prestamo,
} from './types';
import {
  clientesSeed,
  cuentasSeed,
  pagosSeed,
  transferenciasSeed,
  prestamosSeed,
} from './mock-data';
import axios from 'axios';
// Simulamos un pequeño delay para parecer realista
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const BASE_URL_PAGOS = 'https://solid-tribble-7j6464x4wxrcwjp-8003.app.github.dev';

// CLIENTES
let clientes: Cliente[] = [...clientesSeed];

export async function listarClientes(): Promise<Cliente[]> {
  await delay(300);
  return clientes;
}

export async function obtenerCliente(id: string): Promise<Cliente | null> {
  await delay(200);
  return clientes.find(c => c.id === id) || null;
}

export async function crearCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
  await delay(300);
  const nuevoCliente: Cliente = {
    ...cliente,
    id: Date.now().toString(),
  };
  clientes.push(nuevoCliente);
  return nuevoCliente;
}

export async function actualizarCliente(
  id: string,
  clienteActualizado: Partial<Cliente>
): Promise<Cliente | null> {
  await delay(300);
  const index = clientes.findIndex(c => c.id === id);
  if (index === -1) return null;
  clientes[index] = { ...clientes[index], ...clienteActualizado };
  return clientes[index];
}

export async function eliminarCliente(id: string): Promise<boolean> {
  await delay(300);
  const index = clientes.findIndex(c => c.id === id);
  if (index === -1) return false;
  clientes.splice(index, 1);
  return true;
}

// CUENTAS
let cuentas: Cuenta[] = [...cuentasSeed];

export async function listarCuentas(): Promise<Cuenta[]> {
  await delay(300);
  return cuentas;
}

export async function obtenerCuenta(id: string): Promise<Cuenta | null> {
  await delay(200);
  return cuentas.find(c => c.id === id) || null;
}

export async function crearCuenta(cuenta: Omit<Cuenta, 'id'>): Promise<Cuenta> {
  await delay(300);
  const nuevaCuenta: Cuenta = {
    ...cuenta,
    id: Date.now().toString(),
  };
  cuentas.push(nuevaCuenta);
  return nuevaCuenta;
}

export async function actualizarCuenta(
  id: string,
  cuentaActualizada: Partial<Cuenta>
): Promise<Cuenta | null> {
  await delay(300);
  const index = cuentas.findIndex(c => c.id === id);
  if (index === -1) return null;
  cuentas[index] = { ...cuentas[index], ...cuentaActualizada };
  return cuentas[index];
}

export async function depositar(cuentaId: string, monto: number): Promise<boolean> {
  await delay(400);
  const cuenta = cuentas.find(c => c.id === cuentaId);
  if (!cuenta) return false;
  cuenta.saldoActual += monto;
  return true;
}

export async function retirar(cuentaId: string, monto: number): Promise<boolean> {
  await delay(400);
  const cuenta = cuentas.find(c => c.id === cuentaId);
  if (!cuenta || cuenta.saldoActual < monto) return false;
  cuenta.saldoActual -= monto;
  return true;
}

// PAGOS DE SERVICIOS
let pagos: PagoServicio[] = [...pagosSeed];

export async function listarPagos(cuentaId?: string): Promise<PagoServicio[]> {
  const url = `${BASE_URL_PAGOS}/api/pagos${cuentaId ? `?cuenta_id=${cuentaId}` : ''}`;
  const res = await axios.get(url);
  return res.data;
}

export async function realizarPagoServicio(pago: {
  cuentaId: string;
  tipoServicio: string;
  codigoSuministro?: string;
  monto: number;
  descripcion?: string;
  estado?: string;
  fecha?: string;
  referencia?: string;
}): Promise<PagoServicio> {
  const payload = {
    cuenta_id: pago.cuentaId,
    tipo_servicio: pago.tipoServicio,
    monto: pago.monto,
    referencia: pago.referencia ?? 'string',
  };
  const res = await axios.post(`${BASE_URL_PAGOS}/api/pagos`, payload);
  return res.data;
}

// TRANSFERENCIAS
let transferencias: Transferencia[] = [...transferenciasSeed];

export async function listarTransferencias(): Promise<Transferencia[]> {
  await delay(300);
  return transferencias;
}

export async function transferirInterno(
  transferencia: Omit<Transferencia, 'id' | 'tipo'>
): Promise<Transferencia> {
  await delay(600);
  const nuevaTransferencia: Transferencia = {
    ...transferencia,
    id: Date.now().toString(),
    tipo: 'Propia',
    estado: 'Exitoso',
  };

  // Procesar transferencia
  await retirar(transferencia.cuentaOrigenId, transferencia.monto);
  if (transferencia.cuentaDestinoId) {
    const cuenta = cuentas.find(c => c.id === transferencia.cuentaDestinoId);
    if (cuenta) {
      cuenta.saldoActual += transferencia.monto;
    }
  }

  transferencias.push(nuevaTransferencia);
  return nuevaTransferencia;
}

export async function transferirTerceros(
  transferencia: Omit<Transferencia, 'id' | 'tipo'>
): Promise<Transferencia> {
  await delay(600);
  const nuevaTransferencia: Transferencia = {
    ...transferencia,
    id: Date.now().toString(),
    tipo: 'Terceros',
    estado: 'Exitoso',
  };
  await retirar(transferencia.cuentaOrigenId, transferencia.monto);
  transferencias.push(nuevaTransferencia);
  return nuevaTransferencia;
}

export async function transferirInterbancario(
  transferencia: Omit<Transferencia, 'id' | 'tipo'>
): Promise<Transferencia> {
  await delay(800);
  const nuevaTransferencia: Transferencia = {
    ...transferencia,
    id: Date.now().toString(),
    tipo: 'Otros Bancos',
    estado: 'Exitoso',
  };
  await retirar(transferencia.cuentaOrigenId, transferencia.monto);
  transferencias.push(nuevaTransferencia);
  return nuevaTransferencia;
}

// PRÉSTAMOS
let prestamos: Prestamo[] = [...prestamosSeed];

export async function listarPrestamos(): Promise<Prestamo[]> {
  await delay(300);
  return prestamos;
}

export async function crearSolicitudPrestamo(
  prestamo: Omit<Prestamo, 'id' | 'estado' | 'fechaSolicitud'>
): Promise<Prestamo> {
  await delay(500);
  
  // Simulación de evaluación básica
  const estado = prestamo.montoSolicitado <= 10000 ? 'Aprobado' : 'En evaluación';
  const montoMensual =
    estado === 'Aprobado'
      ? prestamo.montoSolicitado / prestamo.plazoMeses +
        (prestamo.montoSolicitado * prestamo.tasaAnual) / 100 / 12
      : undefined;

  const nuevoPrestamo: Prestamo = {
    ...prestamo,
    id: Date.now().toString(),
    estado,
    fechaSolicitud: new Date().toISOString().split('T')[0],
    montoMensual,
  };
  prestamos.push(nuevoPrestamo);
  return nuevoPrestamo;
}

// Reiniciar datos (útil para testing)
export function resetearDatos() {
  clientes = [...clientesSeed];
  cuentas = [...cuentasSeed];
  pagos = [...pagosSeed];
  transferencias = [...transferenciasSeed];
  prestamos = [...prestamosSeed];
}
