"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/hooks/useAuth";
import { NavLink } from "@/presentation/components/ui/NavLink";
import { Avatar } from "@/presentation/components/ui/Avatar";

export const Navbar: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f0c1b]/80 backdrop-blur-md border-b border-[#2a2447]">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Branding / Logo */}
        <Link
          href="/"
          className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-500 hover:opacity-90 transition-opacity"
        >
          DRESSCODE
        </Link>

        {/* Links de Navegação Principal */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink href="/" icon="🏠">
            Feed
          </NavLink>
          {user && (
            <NavLink href="/profile" icon="👤">
              Meu Closet
            </NavLink>
          )}
        </nav>

        {/* Estado da Sessão do Usuário */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-[#18142a] animate-pulse border border-[#2a2447]" />
          ) : user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 group p-1 pr-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <Avatar
                  src={user.profilePicture}
                  username={user.username}
                  size="sm"
                />
                <span className="text-xs font-bold text-gray-200 hidden sm:inline group-hover:text-purple-300 transition-colors">
                  @{user.username}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-xs font-bold text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                title="Sair da conta"
              >
                🚪
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/30 active:scale-95"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};