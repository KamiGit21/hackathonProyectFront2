'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransferenciaPropia } from './transferencia-propia';
import { TransferenciaTerceros } from './transferencia-terceros';
import { TransferenciaInterbancaria } from './transferencia-interbancaria';
import { Cuenta } from '@/lib/types';

interface TransferenciaTabsProps {
  cuentas: Cuenta[];
  onTransferir: (tipo: 'propia' | 'terceros' | 'interbancaria', data: any) => Promise<void>;
  loading?: boolean;
}

export function TransferenciaTabs({
  cuentas,
  onTransferir,
  loading = false,
}: TransferenciaTabsProps) {
  return (
    <Tabs defaultValue="propia" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="propia">Entre mis cuentas</TabsTrigger>
        <TabsTrigger value="terceros">A terceros</TabsTrigger>
        <TabsTrigger value="interbancaria">Otros bancos</TabsTrigger>
      </TabsList>

      <TabsContent value="propia" className="mt-6">
        <TransferenciaPropia
          cuentas={cuentas}
          onTransferir={() => onTransferir('propia', {})}
          loading={loading}
        />
      </TabsContent>

      <TabsContent value="terceros" className="mt-6">
        <TransferenciaTerceros
          cuentas={cuentas}
          onTransferir={() => onTransferir('terceros', {})}
          loading={loading}
        />
      </TabsContent>

      <TabsContent value="interbancaria" className="mt-6">
        <TransferenciaInterbancaria
          cuentas={cuentas}
          onTransferir={() => onTransferir('interbancaria', {})}
          loading={loading}
        />
      </TabsContent>
    </Tabs>
  );
}
