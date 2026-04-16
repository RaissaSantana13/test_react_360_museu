'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Eye, Trash } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../../../../components/ui/badge';
import { Checkbox } from '../../../../components/ui/checkbox';
import { UsuarioList } from '../../../../schemas/Usuario-schemas';

export const columnsUsuario: ColumnDef<UsuarioList>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="selecionar tudo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="selecionar a linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nomeUsuario',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          E-mail
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'ativo',
    header: 'Status',
    cell: ({ row }) => {
      const ativo = row.getValue('ativo');

      return <Badge variant={ativo ? 'default' : 'destructive'}>{ativo ? 'Ativo' : 'Inativo'}</Badge>;
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-center">Ações</div>,
    cell: ({ row }) => {
      const usuario = row.original;

      return (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" asChild title="Visualizar" aria-label="Consultar Registro do Usuário">
            <Link href={`/dashboard/usuario/${usuario.idUsuario}/consultar`}>
              <Eye className="h-4 w-4 text-blue-800" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild title="Editar" aria-label="Editar Registro do Usuário">
            <Link href={`/dashboard/usuario/${usuario.idUsuario}/editar`}>
              <Edit className="h-4 w-4 text-amber-800" />
            </Link>
          </Button>
          <Button variant="destructive" size="icon" title="Excluir">
            <Link href={`/dashboard/usuario/${usuario.idUsuario}/excluir`} aria-label="Excluir Registro do Usuário">
              <Trash className="h-4 w-4 text-red-800" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
