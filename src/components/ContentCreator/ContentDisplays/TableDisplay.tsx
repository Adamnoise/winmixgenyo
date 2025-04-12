// /src/components/ContentCreator/ContentDisplays/TableDisplay.tsx
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Feltételezve, hogy a @/ alias helyesen van konfigurálva

// Generikus típust vezetünk be az adatsorokhoz
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  caption?: string; // Opcionális táblázat felirat
}

// A komponens most már generikus
export function TableDisplay<TData, TValue>({
  columns = [], // Alapértelmezett üres tömb
  data = [], // Alapértelmezett üres tömb
  caption,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border my-4">
      <Table>
        {caption && <caption className="mt-4 text-sm text-muted-foreground">{caption}</caption>}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nincs megjeleníthető adat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Az exportált komponens nevének meg kell egyeznie a fájlnévvel (általános konvenció)
// Ha ezt a komponenst ContentDisplay-ként akarod használni, akkor vagy átnevezed a fájlt/komponenst,
// vagy egy wrapper komponenst hozol létre. Itt TableDisplay-nek hagytam.
export default TableDisplay;
