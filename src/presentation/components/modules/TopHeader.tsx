"use client";

import React from "react";
import Link from "next/link";
import { LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/presentation/hooks/useAuth";
import { Avatar } from "@/presentation/components/ui/Avatar";

export const TopHeader: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#18142a]/80 backdrop-blur-md border-b border-[#2a2447] px-4 md:px-8 py-3.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Identidade Visual / Logo da Marca */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-purple-400">
            DressCode
          </span>
        </Link>

        {/* Área do Usuário Logado */}
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Avatar src={user.profilePicture} username={user.username} size="sm" />
              <span className="text-xs font-semibold text-gray-200 hidden sm:inline">
                @{user.username}
              </span>
            </Link>

            <button
              onClick={logout}
              title="Sair da conta"
              className="p-2 text-gray-400 hover:text-red-400 rounded-xl bg-[#0f0c1b] border border-[#2a2447] hover:border-red-900/50 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
            >
              Entrar
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};