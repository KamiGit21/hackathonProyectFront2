// lib/api/clientes.ts
import { Cliente } from "@/lib/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_AUTH_BASE_URL ??
  "http://localhost:8000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("chuno_token");
}
// ✅ TIPADO EXPLÍCITO
function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}



export async function fetchClientes(): Promise<Cliente[]> {
  const res = await fetch(`${API_URL}/clientes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener clientes");
  }

  return res.json();
}

type ClienteInput = {
  nombre: string;
  apellidos?: string;
  ci_nit?: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  estado: "ACTIVO" | "INACTIVO";
};

export async function createCliente(
  data: ClienteInput
): Promise<Cliente> {
  const res = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al crear cliente: ${errText}`);
  }

  return res.json();
}

export async function updateCliente(
  id: string,
  data: Partial<ClienteInput>
): Promise<Cliente> {
  const res = await fetch(`${API_URL}/clientes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al actualizar cliente: ${errText}`);
  }

  return res.json();
}

export async function deleteCliente(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/clientes/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(),
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al eliminar cliente: ${errText}`);
  }
}
