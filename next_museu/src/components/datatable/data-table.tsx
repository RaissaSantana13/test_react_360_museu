'use client';

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { DataTablePagination } from './pagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState<string>('');
  const table = useReactTable({
    state: {
      pagination,
      sorting,
      rowSelection,
      globalFilter,
    },
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const value = String(row.getValue(columnId)).toLowerCase();
      return value.includes(filterValue.toLowerCase());
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Pesquisa"
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid gap-4 md:hidden">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map(row => (
            <Card key={row.id}>
              <CardContent className="space-y-3 p-4">
                {row.getVisibleCells().map(cell => (
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
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
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
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map(cell => (
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
    </div>
  );
}
