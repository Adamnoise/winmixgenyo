// /src/components/ContentCreator/Forms/TableForm.tsx
import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Bár nincs használva a kódban, de importálva volt
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useContent } from "@/context/ContentContext";
import { TableContent } from "@/types/content"; // Importáld a TableContent típust
import { Trash2 } from "lucide-react";

// Módosított séma: oszlopoknak van id-ja és fejléce
const tableFormSchema = z.object({
  title: z.string().min(1, "A cím megadása kötelező."),
  columns: z.array(z.object({
    id: z.string(), // Egyedi azonosító az oszlophoz
    header: z.string().min(1, "A fejléc megadása kötelező."),
  })).min(1, "Legalább egy oszlopot meg kell adni."),
  // Az adat objektum kulcsai az oszlop id-k lesznek
  data: z.array(z.record(z.string(), z.string())).min(1, "Legalább egy adatsort meg kell adni."),
});

type TableFormValues = z.infer<typeof tableFormSchema>;

interface TableFormProps {
  onSubmitSuccess?: () => void;
  initialData?: Partial<TableContent>; // Lehetőség kezdeti adatok megadására (szerkesztéshez)
}

export function TableForm({ onSubmitSuccess, initialData }: TableFormProps) {
  const { addContent } = useContent();

  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      // Ha van initialData, átalakítjuk az oszlopokat id-vel
      columns: initialData?.columns?.map(header => ({ id: uuidv4(), header })) || [{ id: uuidv4(), header: "" }],
      // Ha van initialData, átalakítjuk az adatokat (feltételezve, hogy a initialData.data kulcsai a fejlécek voltak)
      // Ez a rész bonyolult lehet, ha a kezdeti adat struktúrája más.
      // Egyszerűsítés: Kezdetben csak egy üres sort adunk hozzá, ha nincs initialData.
      data: initialData?.data?.map(row => {
          // Ez a transzformáció feltételezi, hogy a initialData.columns és initialData.data
          // indexei megegyeznek, és a kulcsok a fejlécek. Óvatosan kell kezelni!
          const newRow: Record<string, string> = {};
          initialData.columns?.forEach((header, index) => {
              const colId = form.getValues('columns')[index]?.id; // Próbáljuk megkeresni az ID-t
              if (colId && row[header] !== undefined) {
                  newRow[colId] = row[header];
              }
          });
          return newRow;
      }) || [{}], // Kezdődjön egy üres sorral, ha nincs adat
    },
  });

  const { fields: columnFields, append: appendColumn, remove: removeColumn } = useFieldArray({
    control: form.control,
    name: "columns",
  });

  const { fields: dataFields, append: appendData, remove: removeData } = useFieldArray({
    control: form.control,
    name: "data",
  });

  // Amikor új oszlopot adunk hozzá, gondoskodunk róla, hogy a meglévő sorok is megkapják az új (üres) cellát
  const handleAddColumn = () => {
    const newColId = uuidv4();
    appendColumn({ id: newColId, header: "" });
    // Frissítjük a meglévő adatsorokat az új oszlophoz tartozó kulccsal
    dataFields.forEach((_, rowIndex) => {
      form.setValue(`data.${rowIndex}.${newColId}`, ""); // Üres értékkel inicializáljuk
    });
  };

  // Amikor oszlopot törlünk, a hozzá tartozó adatokat is törölni kell a sorokból
  const handleRemoveColumn = (index: number) => {
      const colIdToRemove = form.getValues(`columns.${index}.id`);
      removeColumn(index);
      // Töröljük a kulcsot minden adatsorból
      const currentData = form.getValues('data');
      const updatedData = currentData.map(row => {
          const newRow = {...row};
          delete newRow[colIdToRemove];
          return newRow;
      });
      form.setValue('data', updatedData); // Frissítjük a form állapotát
  };


  // Amikor új sort adunk hozzá, inicializáljuk az összes létező oszlophoz tartozó cellát
  const handleAddRow = () => {
    const newRow: Record<string, string> = {};
    columnFields.forEach(col => {
      newRow[col.id] = ""; // Inicializálás üres stringgel
    });
    appendData(newRow);
  };


  function onSubmit(values: TableFormValues) {
    // Itt átalakíthatod a `values`-t, ha a ContentContext más formátumot vár
    // Például, ha a context a `columns`-t csak string[]-ként (fejlécek) várja,
    // és a `data`-t továbbra is header-kulcsos objektumként.
    // De ideális esetben a context is az ID-alapú struktúrát fogadja.

    // Feltételezzük, hogy a Context a TableContent típust várja,
    // amihez a columns csak a fejléceket tartalmazza string[]-ként.
    const contentToAdd: Omit<TableContent, 'id' | 'type'> = {
        title: values.title,
        columns: values.columns.map(col => col.header), // Csak a fejléceket adjuk át
        // Az adatokat visszaalakítjuk header-alapú kulcsokra (ha szükséges)
        // Ez feltételezi, hogy a ContentDisplay a header-alapú kulcsokat várja.
        // Ha a Display is az ID-ket használja, ez a transzformáció nem kell.
        data: values.data.map(row => {
            const newRow: Record<string, string> = {};
            values.columns.forEach(col => {
                newRow[col.header] = row[col.id] || ""; // Visszaalakítás header kulcsra
            });
            return newRow;
        })
    };

    addContent({ type: "table", ...contentToAdd });
    console.log("Table form submitted:", contentToAdd);
    onSubmitSuccess?.(); // Callback hívása siker esetén
     // form.reset(); // Opcionális: ürítsd a formot küldés után
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Táblázat Címe</FormLabel>
              <FormControl>
                <Input placeholder="Táblázat címe..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Oszlopok kezelése */}
        <div>
          <Label className="mb-2 block">Oszlopok</Label>
          {columnFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <FormField
                control={form.control}
                name={`columns.${index}.header`}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    {index === 0 && <FormLabel className="sr-only">Oszlop Fejléc</FormLabel> }
                    <FormControl>
                      <Input placeholder={`Oszlop ${index + 1} fejléce`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Rejtett mező az ID tárolására (nem szerkeszthető) */}
              <input type="hidden" {...form.register(`columns.${index}.id`)} />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveColumn(index)}
                disabled={columnFields.length <= 1} // Ne engedd törölni az utolsó oszlopot
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddColumn}
            className="mt-2"
          >
            Oszlop hozzáadása
          </Button>
        </div>

        {/* Adatok kezelése */}
        <div>
          <Label className="mb-2 block">Adatsorok</Label>
          {dataFields.map((rowField, rowIndex) => (
            <div key={rowField.id} className="flex items-start space-x-2 mb-4 border p-2 rounded">
               <div className="flex-grow grid gap-2" style={{ gridTemplateColumns: `repeat(${columnFields.length}, 1fr)` }}>
                 {columnFields.map((colField, colIndex) => (
                   <FormField
                     key={`${rowField.id}-${colField.id}`} // Kulcs az oszlop id-val
                     control={form.control}
                     // A név most már az oszlop ID-t használja
                     name={`data.${rowIndex}.${colField.id}`}
                     render={({ field }) => (
                       <FormItem>
                          {rowIndex === 0 && <FormLabel className="text-xs truncate" title={form.getValues(`columns.${colIndex}.header`)}>{form.getValues(`columns.${colIndex}.header`)}</FormLabel>}
                         <FormControl>
                           <Input placeholder={`Sor ${rowIndex + 1}, Oszlop ${colIndex + 1}`} {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 ))}
               </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeData(rowIndex)}
                disabled={dataFields.length <= 1} // Ne engedd törölni az utolsó sort sem
                 className="mt-1" // Kis igazítás
              >
                 <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRow}
             className="mt-2"
          >
            Sor hozzáadása
          </Button>
        </div>


        <Button type="submit">Táblázat hozzáadása</Button>
      </form>
    </Form>
  );
}
