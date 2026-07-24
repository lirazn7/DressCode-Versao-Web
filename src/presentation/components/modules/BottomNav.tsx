"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Shirt, User } from "lucide-react";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useModal } from "@/presentation/contexts/ModalContext";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { openCreatePostModal } = useModal();

  // Não exibe a barra inferior em páginas de login/registro se necessário
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#18142a]/90 backdrop-blur-md border-t border-[#2a2447] py-2 px-6">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {/* Item 1: Feed Principal */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 transition-all ${
            pathname === "/" ? "text-purple-400 font-bold" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Feed</span>
        </Link>

        {/* Item 2: Central FAB (Floating Action Button) - Publicar Look */}
        {user && (
          <div className="relative -top-5">
            <button
              onClick={openCreatePostModal}
              aria-label="Criar novo look"
              className="w-14 h-14 bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-purple-600/40 border-4 border-[#0f0c1b] transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Item 3: Perfil / Meu Closet */}
        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 transition-all ${
            pathname === "/profile" ? "text-purple-400 font-bold" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Meu Perfil</span>
        </Link>
      </div>
    </nav>
  );
};