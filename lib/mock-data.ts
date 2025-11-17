import { Cliente, Cuenta, PagoServicio, Transferencia, Prestamo } from './types';

// Datos de prueba iniciales

export const clientesSeed: Cliente[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellidos: 'Pérez García',
    ci: '12345678',
    email: 'juan.perez@email.com',
    telefono: '76123456',
    fechaNacimiento: '1990-05-15',
    direccion: 'Calle Principal 123, La Paz',
    estado: 'Activo',
    fechaAlta: '2023-01-10',
  },
  {
    id: '2',
    nombre: 'María',
    apellidos: 'López Rodríguez',
    ci: '87654321',
    email: 'maria.lopez@email.com',
    telefono: '72654321',
    fechaNacimiento: '1992-08-22',
    direccion: 'Avenida Heroínas 456, Cochabamba',
    estado: 'Activo',
    fechaAlta: '2023-03-05',
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellidos: 'Martínez Sánchez',
    ci: '11111111',
    email: 'carlos.martinez@email.com',
    telefono: '70111111',
    fechaNacimiento: '1988-12-10',
    direccion: 'Calle Murillo 789, Santa Cruz',
    estado: 'Activo',
    fechaAlta: '2023-06-12',
  },
];

export const cuentasSeed: Cuenta[] = [
  {
    id: '1',
    numeroCuenta: '1001234567890',
    clienteId: '1',
    tipo: 'Ahorro',
    moneda: 'BOB',
    saldoActual: 5500.50,
    estado: 'Activa',
    fechaCreacion: '2023-01-15',
  },
  {
    id: '2',
    numeroCuenta: '1001234567891',
    clienteId: '1',
    tipo: 'Ahorro',
    moneda: 'USD',
    saldoActual: 2300.00,
    estado: 'Activa',
    fechaCreacion: '2023-02-20',
  },
  {
    id: '3',
    numeroCuenta: '1001234567892',
    clienteId: '2',
    tipo: 'Ahorro',
    moneda: 'BOB',
    saldoActual: 8750.75,
    estado: 'Activa',
    fechaCreacion: '2023-03-10',
  },
  {
    id: '4',
    numeroCuenta: '1001234567893',
    clienteId: '3',
    tipo: 'Ahorro',
    moneda: 'BOB',
    saldoActual: 12450.00,
    estado: 'Bloqueada',
    fechaCreacion: '2023-06-15',
  },
];

export const pagosSeed: PagoServicio[] = [
  {
    id: '1',
    cuentaId: '1',
    tipoServicio: 'Luz',
    codigoSuministro: 'LUZ-123456',
    monto: 250.00,
    estado: 'Exitoso',
    fecha: '2024-01-10',
    descripcion: 'Pago de factura mensual',
  },
  {
    id: '2',
    cuentaId: '1',
    tipoServicio: 'Agua',
    codigoSuministro: 'AGUA-789012',
    monto: 150.00,
    estado: 'Exitoso',
    fecha: '2024-01-08',
  },
  {
    id: '3',
    cuentaId: '3',
    tipoServicio: 'Internet',
    codigoSuministro: 'NET-345678',
    monto: 199.99,
    estado: 'Exitoso',
    fecha: '2024-01-05',
  },
];

export const transferenciasSeed: Transferencia[] = [
  {
    id: '1',
    cuentaOrigenId: '1',
    cuentaDestinoId: '2',
    destino: '1001234567891',
    tipo: 'Propia',
    monto: 500.00,
    descripcion: 'Transferencia entre mis cuentas',
    estado: 'Exitoso',
    fecha: '2024-01-09',
  },
  {
    id: '2',
    cuentaOrigenId: '1',
    cuentaDestinoId: '3',
    destino: '1001234567892',
    tipo: 'Terceros',
    monto: 300.00,
    descripcion: 'Pago a proveedor',
    estado: 'Exitoso',
    fecha: '2024-01-07',
  },
];

export const prestamosSeed: Prestamo[] = [
  {
    id: '1',
    clienteId: '1',
    montoSolicitado: 5000.00,
    plazoMeses: 24,
    tasaAnual: 8.5,
    estado: 'Aprobado',
    fechaSolicitud: '2024-01-01',
    montoMensual: 225.50,
  },
  {
    id: '2',
    clienteId: '2',
    montoSolicitado: 10000.00,
    plazoMeses: 36,
    tasaAnual: 9.0,
    estado: 'En evaluación',
    fechaSolicitud: '2024-01-05',
  },
];
