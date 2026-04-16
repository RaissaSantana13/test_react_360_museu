'use client';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Calendar,
  Check,
  Lock,
  Settings2,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { useDictionary } from '../../../service/providers/i18n-providers';

interface PermissionMatrixProps {
  roleName: string; // Ex: "Administrador"
}

export default function PermissionMatrixForm({
  roleName,
}: PermissionMatrixProps) {
  const dict = useDictionary();
  const nav = dict.navigation;

  // Definimos os recursos baseados nas seções do seu sistema
  const resources = [
    { id: 'dashboard', label: nav.dashboards, icon: ShieldCheck },
    { id: 'usuarios', label: nav.usuario.usuario, icon: User },
    { id: 'contatos', label: nav.contato.contato, icon: Settings2 },
    { id: 'eventos', label: nav.eventos, icon: Calendar },
  ];

  // Ações padrão da matriz
  const actions = [
    { id: 'view', label: 'Visualizar' },
    { id: 'create', label: 'Criar' },
    { id: 'edit', label: 'Editar' },
    { id: 'delete', label: 'Excluir' },
  ];

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Matriz de Permissões</h3>
        </div>
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary border-primary/20"
        >
          Perfil: {roleName}
        </Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[300px]">Recurso / Módulo</TableHead>
            {actions.map((action) => (
              <TableHead key={action.id} className="text-center">
                {action.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id} className="hover:bg-accent/5">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md">
                    <resource.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>{resource.label}</span>
                </div>
              </TableCell>

              {actions.map((action) => (
                <TableCell
                  key={`${resource.id}-${action.id}`}
                  className="text-center"
                >
                  <div className="flex justify-center">
                    <Checkbox
                      id={`${resource.id}-${action.id}`}
                      // Aqui você ligaria com o estado das permissões do seu banco
                      defaultChecked={roleName === 'Administrador'}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-4 bg-muted/20 border-t text-xs text-muted-foreground flex justify-between">
        <span>
          As alterações nesta matriz afetam todos os usuários vinculados a este
          perfil.
        </span>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" /> Permitido
          </div>
          <div className="flex items-center gap-1">
            <X className="h-3 w-3 text-red-500" /> Negado
          </div>
        </div>
      </div>
    </div>
  );
}
