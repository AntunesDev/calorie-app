import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/BottomNav";
import { Flame } from "lucide-react"; // npm install lucide-react

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={cn("min-h-screen bg-gradient-to-b from-primary/10 to-accent/5 font-sans antialiased")}>
        <header className="w-full bg-gradient-to-r from-primary/80 to-accent/80 shadow-md px-4 py-3 flex items-center justify-center sticky top-0 z-20">
          <span className="flex items-center gap-2 font-bold text-xl text-white tracking-tight drop-shadow-sm">
            <Flame size={24} className="text-accent drop-shadow" />
            Controle de Calorias
          </span>
        </header>
        <main className="mx-auto w-full max-w-lg px-3 pb-28 pt-10 mt-4">{children}</main>
        <BottomNav />
        <Toaster />
      </body>
    </html>
  );
}
