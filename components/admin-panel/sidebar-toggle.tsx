import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <Button
      onClick={() => setIsOpen?.()}
      className="rounded-xl w-9 h-9 text-zinc-400 cursor-pointer hover:text-zinc-500 hover:bg-zinc-50 transition-all"
      variant="ghost"
      size="icon"
    >
      <PanelLeft className="h-5 w-5" />
    </Button>
  );
}
