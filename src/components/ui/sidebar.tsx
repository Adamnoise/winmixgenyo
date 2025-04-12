// /src/components/ui/sidebar.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Feltételezve, hogy létezik és helyes
import { sidebarVariants } from "./sidebar.utils"; // Importáljuk a külön definiált variánsokat

// --- Sidebar Root ---

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {} // Használjuk a külső variánsokat

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, collapsible = false, ...props }, ref) => {
    // Fontos: Ez a komponens a globális CSS-ben definiált
    // --sidebar-width és --sidebar-collapse-width CSS változókra támaszkodik!
    return (
      <div
        ref={ref}
        className={cn(sidebarVariants({ collapsible }), className)}
        data-collapsed={collapsible} // Adat attribútum a CSS számára
        {...props}
      >
        {children}
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

// --- Sidebar Header ---

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 border-b", className)} // Alap stílusok
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

// --- Sidebar Content ---

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto p-4", className)} // Alap stílusok
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

// --- Sidebar Footer ---

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 border-t", className)} // Alap stílusok
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  type SidebarProps, // Exportáljuk a típust is
};
