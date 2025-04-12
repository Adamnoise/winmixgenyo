import * as React from "react";
import {
	Controller,
	ControllerProps,
	FieldPath,
	FieldValues,
	FormProvider, // Fontos a példa és a useFormContext miatt
	useFormContext,
} from "react-hook-form";
import { Slot } from "@radix-ui/react-slot"; // A FormControl-hoz

// --- Típusdefiníciók ---

/**
 * Az űrlap mező kontextusának értéke.
 * Tartalmazza a mező nevét.
 */
type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues, // Alapértelmezett generikus hozzáadva
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>, // Alapértelmezett generikus hozzáadva
> = {
	name: TName;
};

/**
 * Az űrlap elem (item) kontextusának értéke.
 * Tartalmazza az elem egyedi azonosítóját.
 */
type FormItemContextValue = {
	id: string;
};

// --- Kontextusok ---

/**
 * Kontextus az űrlap mező nevének megosztására.
 * `null` alapértelmezett értékkel, a hookban ellenőrizzük.
 */
const FormFieldContext = React.createContext<FormFieldContextValue<any, any> | null>(
	null,
);

/**
 * Kontextus az űrlap elem egyedi azonosítójának megosztására.
 * `null` alapértelmezett értékkel, a hookban ellenőrizzük.
 */
const FormItemContext = React.createContext<FormItemContextValue | null>(null);

// --- Hook ---

/**
 * Egyéni hook az űrlap mezővel kapcsolatos információk és állapot lekérdezésére.
 * Használata szigorúan <FormItem> és <FormField> komponenseken belül ajánlott.
 */
export const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext);
	const itemContext = React.useContext(FormItemContext);
	// A useFormContext a mező állapotának lekérdezésére szolgál.
	// A TFieldValues típust implicit módon a FormProvider biztosítja (ha használjuk).
	const { getFieldState, formState } = useFormContext(); // Feltételezi a FormProvider meglétét

	// Szigorúbb ellenőrzések a kontextusok meglétére és tartalmára
	if (!fieldContext) {
		throw new Error(
			"useFormField hiba: A hook csak egy <FormField> komponensen belül használható.",
		);
	}
	// A 'name' ellenőrzése a FormField komponens felelőssége (propként kötelező)
	// Itt feltételezzük, hogy a kontextusban már helyes érték van.

	if (!itemContext) {
		throw new Error(
			"useFormField hiba: A hook csak egy <FormItem> komponensen belül használható.",
		);
	}
    // Az itemContext.id ellenőrzése itt már nem szükséges, mert a FormItem garantálja

	const fieldState = getFieldState(fieldContext.name, formState);
	const { id } = itemContext;

	return {
		id, // Az input elemhez (FormControl Slot gyermeke kapja)
		name: fieldContext.name, // A mező neve
		formItemId: `${id}-form-item`, // A teljes FormItem wrapper ID-ja
		formDescriptionId: `${id}-form-item-description`, // A FormDescription ID-ja
		formMessageId: `${id}-form-item-message`, // A FormMessage ID-ja
		...fieldState, // RHF mezőállapot (error, invalid, isTouched, isDirty stb.)
        // Az aliasok már implicit módon benne vannak a ...fieldState-ben, de explicit is maradhatnak, ha kell
        // invalid: fieldState.invalid,
        // isDirty: fieldState.isDirty,
        // isTouched: fieldState.isTouched,
        // error: fieldState.error,
	};
};

// --- Komponensek ---

/**
 * `FormField` komponens:
 * Összeköti a React Hook Form `Controller`-t a mező kontextusával.
 * Biztosítja a `FormFieldContext`-et a `name` proppal.
 */
export const FormField = <
	TFieldValues extends FieldValues = FieldValues, // Alapértelmezett generikus
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>, // Alapértelmezett generikus
>({
	...props // ControllerProps<TFieldValues, TName> típusú, a 'name' kötelező
}: ControllerProps<TFieldValues, TName>) => {
	// A contextValue típusa a komponens használatakor megadott TFieldValues/TName lesz.
	// Biztosítjuk, hogy a 'name' létezik (TypeScript szinten a ControllerProps ezt kikényszeríti)
	const contextValue = React.useMemo(() => ({ name: props.name }), [props.name]);

	return (
		<FormFieldContext.Provider value={contextValue}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	);
};
// Nincs szükség displayName-re generikus funkció komponenseknél

/**
 * `FormItem` komponens:
 * Logikai csoport egy űrlap elem köré (pl. label, input, message).
 * Generálja az egyedi ID-t és biztosítja a `FormItemContext`-et.
 */
export const FormItem = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => { // children implicit módon a props része
	const id = React.useId();
	// useMemo itt is hasznos lehet, ha a kontextusra érzékeny gyermekek vannak
	const contextValue = React.useMemo(() => ({ id }), [id]);

	return (
		<FormItemContext.Provider value={contextValue}>
			<div ref={ref} className={className} {...props} id={`${id}-form-item`} />
            {/* Az id={`${id}-form-item`} itt a div-en van, ahogy a hook is generálja */}
		</FormItemContext.Provider>
	);
});
FormItem.displayName = "FormItem";


/**
 * `FormLabel` komponens:
 * Megjeleníti a mező címkéjét, automatikusan összekapcsolva a `FormControl`-ban lévő inputtal (`htmlFor`).
 */
export const FormLabel = React.forwardRef<
	HTMLLabelElement,
	React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
	const { error, id } = useFormField(); // Az input `id`-ja kell a `htmlFor`-hoz

	return (
		<label
			ref={ref}
			className={className}
			htmlFor={id} // Összekapcsolás az inputtal (amit a FormControl/Slot gyermeke kap)
			data-invalid={error ? "true" : undefined} // Jelzés, ha a mező érvénytelen
			{...props}
		/>
	);
});
FormLabel.displayName = "FormLabel";

/**
 * `FormControl` komponens:
 * Wrapper a beviteli vezérlő (pl. <input>, <select>) köré.
 * A `@radix-ui/react-slot` segítségével közvetlenül a gyermek komponensre adja át a prop-okat.
 * Beállítja az akadálymentességi attribútumokat (`id`, `aria-describedby`, `aria-invalid`).
 */
export const FormControl = React.forwardRef<
	React.ElementRef<typeof Slot>, // A Slot gyermekének ref-je (pl. HTMLInputElement)
	React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
	const { error, id, formDescriptionId, formMessageId } = useFormField();

	// Összegyűjtjük azokat az ID-kat, amelyek leírják a mezőt (leírás, hibaüzenet)
	const describedBy = [
		formDescriptionId, // A FormDescription ID-ja (ha létezik)
		error ? formMessageId : undefined, // A FormMessage ID-ja (csak hiba esetén)
	]
		.filter(Boolean) // Eltávolítja az üres vagy undefined értékeket
		.join(" "); // Szóközzel elválasztott stringgé alakítja

	return (
		<Slot
			ref={ref}
			id={id} // Ezt az ID-t kapja meg a Slot gyermeke (pl. <input>)
			aria-describedby={describedBy || undefined} // Beállítás csak akkor, ha van leíró elem
			aria-invalid={error ? true : undefined} // Jelzi az érvénytelenséget (true/undefined)
			{...props}
		/>
	);
});
FormControl.displayName = "FormControl";

/**
 * `FormDescription` komponens:
 * Opcionális leírást vagy segítő szöveget jelenít meg a mezőhöz.
 * Csak akkor renderelődik, ha van `children` tartalma.
 * Az `id`-ja automatikusan hozzáadódik a `FormControl` `aria-describedby` attribútumához.
 */
export const FormDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
	const { formDescriptionId } = useFormField();

	if (!children) {
		return null; // Ne rendereljünk üres <p> elemet
	}

	return (
		<p
			ref={ref}
			id={formDescriptionId} // ID az aria-describedby számára
			className={className}
			{...props}
		>
			{children}
		</p>
	);
});
FormDescription.displayName = "FormDescription";

/**
 * `FormMessage` komponens:
 * Megjeleníti a mező érvényesítési hibaüzenetét (ha van) vagy az explicit `children` tartalmat.
 * Csak akkor renderelődik, ha van hiba vagy `children`.
 * Hiba esetén az `id`-ja automatikusan hozzáadódik a `FormControl` `aria-describedby` attribútumához,
 * és `role="alert"` attribútumot kap az akadálymentesség érdekében.
 */
export const FormMessage = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
	const { error, formMessageId } = useFormField();
	// A megjelenítendő üzenet: Elsőbbség a hibaüzeneté, utána a children.
	const messageContent = error ? String(error?.message) : children;

	if (!messageContent) {
		return null; // Ne rendereljünk semmit, ha nincs hiba és nincs children sem
	}

	return (
		<p
			ref={ref}
			id={formMessageId} // ID az aria-describedby számára (hiba esetén releváns)
			className={className}
			data-invalid={error ? "true" : undefined} // Jelzés hiba esetén (styling célokra)
			role={error ? "alert" : undefined} // Hiba esetén "alert" szerepkör (képernyőolvasóknak)
			{...props}
		>
			{messageContent}
		</p>
	);
});
FormMessage.displayName = "FormMessage";


// --- Példa használat (továbbra is csak illusztráció) ---
/*
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input"; // Feltételezett Input komponens
import { Button } from "@/components/ui/button"; // Feltételezett Button komponens

const formSchema = z.object({
  username: z.string().min(2, { message: "Minimum 2 karakter szükséges." }),
  email: z.string().email({ message: "Érvénytelen email cím." }),
});

type FormValues = z.infer<typeof formSchema>;

function MyForm() {
  // 1. Form inicializálása (useForm)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  // 2. Beküldés kezelő függvény
  function onSubmit(values: FormValues) {
    console.log("Form beküldve:", values);
    // Ide jön a tényleges API hívás vagy adatfeldolgozás
  }

  // 3. JSX struktúra a komponensekkel
  return (
    // A FormProvider kötelező, hogy a useFormContext() működjön a belső komponensekben
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* Felhasználónév mező */}
        <FormField // Controller + Context Provider
          control={form.control} // Kötelező: RHF kontroll objektum
          name="username"       // Kötelező: A mező neve (formSchema alapján)
          render={({ field }) => ( // Render prop a mező UI-jának felépítéséhez
            <FormItem> {/* Csoportosítás + ID Context Provider */}
              <FormLabel>Felhasználónév</FormLabel> {/* Címke (htmlFor automatikus) */}
              <FormControl> {/* Slot wrapper az input köré (aria-* attribútumok) */}
                <Input placeholder="pl. Teszt Elek" {...field} /> {/* A tényleges input */}
              </FormControl>
              <FormDescription> {/* Opcionális segítő szöveg */}
                Ez lesz a nyilvános megjelenítési neved.
              </FormDescription>
              <FormMessage /> {/* Hibaüzenet helye (automatikusan megjelenik hiba esetén) */}
            </FormItem>
          )}
        />

        {/* Email mező */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email cím</FormLabel>
              <FormControl>
                <Input type="email" placeholder="nev@domain.hu" {...field} />
              </FormControl>
              {/* Nincs FormDescription itt */}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Regisztráció</Button>
      </form>
    </FormProvider>
  );
}
*/