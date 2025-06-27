import { ThemeControls } from "@/components/ui/theme-controls";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DynamicTitle } from "@/components/ui/dynamic-title";

// Desktop Header (used within SidebarProvider)
export async function DesktopHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="font-semibold text-lg">
          <DynamicTitle />
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeControls />
      </div>
    </header>
  );
}

// Mobile Header (used outside SidebarProvider)
export async function MobileHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <h1 className="font-semibold text-lg">
          <DynamicTitle />
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeControls />
      </div>
    </header>
  );
}

// Default export for backward compatibility
export default function Header() {
  return (
    <div className="md:hidden">
      <MobileHeader />
    </div>
  );
}
