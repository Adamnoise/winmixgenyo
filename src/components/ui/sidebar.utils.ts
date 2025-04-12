// /src/components/ui/sidebar.utils.ts
import { cva } from "class-variance-authority";

// Itt definiáljuk a Sidebar stílus variánsait
export const sidebarVariants = cva(
  // Alap osztályok, amelyek mindig érvényesülnek
  "flex flex-col h-screen bg-background border-r transition-all duration-300 ease-in-out",
  {
    variants: {
      collapsible: {
        // Stílusok, ha a 'collapsible' prop true
        true: "w-[var(--sidebar-collapse-width,60px)] data-[collapsed=false]:w-[var(--sidebar-width,250px)]",
        // Stílusok, ha a 'collapsible' prop false (vagy nincs megadva)
        false: "w-[var(--sidebar-width,250px)]",
      },
      // Itt lehetne további variánsokat definiálni, pl. 'position': 'left' | 'right'
    },
    defaultVariants: {
      // Alapértelmezett érték a variánsokhoz
      collapsible: false,
    },
  }
);
