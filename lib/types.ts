// Tipos principales para CHUNO Bank

export interface Cliente {
  id: string;
  nombre: string;
  apellidos?: string;
  ci_nit?: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: string; // "YYYY-MM-DD"
  direccion?: string;
  estado: 'ACTIVO' | 'INACTIVO';
  fecha_alta?: string;       // "YYYY-MM-DD" u otra ISO
}

export interface Cuenta {
  id: string;
  numeroCuenta: string;
  clienteId: string;
  tipo: 'Ahorro' | 'Corriente';
  moneda: 'BOB' | 'USD';
  saldoActual: number;
  estado: 'Activa' | 'Bloqueada';
  fechaCreacion: string;
}

export interface PagoServicio {
  id: string;
  cuentaId: string;
  tipoServicio: 'Luz' | 'Agua' | 'Teléfono' | 'Gas' | 'Internet' | 'Otro';
  codigoSuministro: string;
  monto: number;
  estado: 'Exitoso' | 'Fallido' | 'Pendiente';
  fecha: string;
  descripcion?: string;
}

export interface Transferencia {
  id: string;
  cuentaOrigenId: string;
  cuentaDestinoId?: string;
  destino: string; // Número de cuenta o email
  tipo: 'Propia' | 'Terceros' | 'Otros Bancos';
  monto: number;
  descripcion: string;
  estado: 'Exitoso' | 'Fallido' | 'Pendiente';
  fecha: string;
}

export interface Prestamo {
  id: string;
  clienteId: string;
  montoSolicitado: number;
  plazoMeses: number;
  tasaAnual: number;
  estado: 'En evaluación' | 'Aprobado' | 'Rechazado';
  fechaSolicitud: string;
  montoMensual?: number;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
}
