'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, Wallet, Send, DollarSign, FileText, LogOut, Menu, X } from 'lucide-react';
import { logout } from "@/lib/auth/logout";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
}

export function DashboardLayout({
  children,
  userName = 'Usuario',
  userRole = 'Ejecutivo de banca digital',
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
    { href: '/dashboard/cuentas', label: 'Cuentas', icon: Wallet },
    { href: '/dashboard/pagos', label: 'Pagos de Servicios', icon: DollarSign },
    { href: '/dashboard/transferencias', label: 'Transferencias', icon: Send },
    { href: '/dashboard/prestamos', label: 'Préstamos', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-primary text-primary-foreground transition-transform duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden lg:relative lg:w-64`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-sm font-bold">
              CB
            </div>
            <span className="font-bold text-lg">CHUNO Bank</span>
          </div>

          {/* Menú */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`w-full justify-start gap-3 ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-primary-foreground hover:bg-white/10'
                    }`}
                    onClick={() => {
                      // Cerrar sidebar en mobile
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Botón Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-primary-foreground hover:bg-white/10"
            onClick={() => {
              logout();               // ⬅ limpia token y datos del usuario
              window.location.href = '/login'; // redirige
            }}
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>

        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
            <h1 className="text-xl font-semibold text-foreground">CHUNO Bank</h1>
          </div>

          {/* Info Usuario */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-foreground text-sm">{userName}</p>
              <p className="text-muted-foreground text-xs">{userRole}</p>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              {userName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
