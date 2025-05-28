"use client";
import { usePathname, useRouter } from "next/navigation";
import { Home, List, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 w-full max-w-md mx-auto bg-white border-t shadow-lg flex justify-around py-2 z-30">
      <button onClick={() => router.push("/")} className={cn("flex flex-col items-center text-xs", pathname === "/" && "text-primary")}>
        <Home size={20} /> Dashboard
      </button>
      <button onClick={() => router.push("/agenda")} className={cn("flex flex-col items-center text-xs", pathname === "/agenda" && "text-primary")}>
        <List size={20} /> Agenda
      </button>
      <button onClick={() => router.push("/perfil")} className={cn("flex flex-col items-center text-xs", pathname === "/perfil" && "text-primary")}>
        <User size={20} /> Perfil
      </button>
    </nav>
  );
}
