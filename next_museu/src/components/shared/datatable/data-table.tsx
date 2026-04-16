'use client';

import { ColumnDef, SortingState, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter, useSearchParams } from 'next/navigation';

import React, { ReactNode } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { DataTablePagination } from './pagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  children?: ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  pageSize,
  children,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = React.useState<SortingState>([]);

  //cd const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [search, setSearch] = React.useState(searchParams.get('search') ?? '');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    params.set('page', '1');

    router.push(`?${params.toString()}`);
  }, 500);

  const handleSearch = (value: string) => {
    setSearch(value);
    debouncedSearch(value);
  };

  const table = useReactTable({
    data,
    columns,
    pageCount,

    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },

    manualPagination: true,
    manualSorting: true,

    getCoreRowModel: getCoreRowModel(),

    onPaginationChange: (updater) => {
      const current = table.getState().pagination;

      const newPagination = typeof updater === 'function' ? updater(current) : updater;

      const params = new URLSearchParams(searchParams);

      params.set('page', String(newPagination.pageIndex + 1));
      params.set('pageSize', String(newPagination.pageSize));

      router.push(`?${params.toString()}`);
    },

    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;

      setSorting(newSorting);

      const params = new URLSearchParams(searchParams);

      if (newSorting.length > 0) {
        params.set('sort', newSorting[0].id);
        params.set('order', newSorting[0].desc ? 'desc' : 'asc');
      } else {
        params.delete('sort');
        params.delete('order');
      }

      router.push(`?${params.toString()}`);
    },
  });

  return (
    <>
      <div
        role="toolbar"
        aria-label="Ferramentas da tabela"
        className="flex flex-row gap-3 md:flex-row md:items-center md:justify-between py-4"
      >
        <div className="flex items-center gap-2">
          <label
            htmlFor="datatable-search"
            className="text-primary text-sm font-medium whitespace-nowrap"
            aria-label="Pesquisar Registros"
          >
            Pesquisar Registros:
          </label>

          <Input
            id="datatable-search"
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
            aria-label="Digite a informação desejada"
          />
        </div>
        <div className="flex items-center gap-2">{children}</div>
      </div>
      <div className="grid gap-4 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Card key={row.id}>
              <CardContent className="space-y-3 p-4">
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id}>
                    <p className="text-xs text-muted-foreground">
                      {typeof cell.column.columnDef.header === 'string' ? cell.column.columnDef.header : cell.column.id}
                    </p>
                    <div className="font-medium">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">Sem Registros ....</p>
        )}
      </div>
      <div className="hidden md:block">
        <div className="w-full overflow-x-auto overflow-hidden rounded-md border">
          <Table className="min-w-[800px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getCoreRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Sem Registros ....
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <DataTablePagination table={table} />
      </div>
    </>
  );
}
