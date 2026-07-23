"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/hooks/useAuth";
import { Input } from "@/presentation/components/ui/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { loginWithEmail, loginWithGoogle, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await loginWithEmail({ email, pass });
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Falha ao realizar login. Verifique suas credenciais.");
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao conectar com o Google.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0c1b] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#18142a] border border-[#2a2447] p-8 rounded-3xl shadow-2xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-500 tracking-wider">
            DRESSCODE
          </h1>
          <p className="text-xs text-gray-400">Entre para explorar e compartilhar seus looks</p>
        </div>

        {/* Alerta de Erro */}
        {errorMessage && (
          <div className="bg-red-950/50 border border-red-800/60 text-red-200 text-xs p-3 rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        {/* Botão Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3 bg-[#241c3f] hover:bg-[#2d234f] text-white text-xs font-bold rounded-xl border border-[#3b3260] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          Entrar com o Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-[#2a2447]"></div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">ou</span>
          <div className="flex-1 h-[1px] bg-[#2a2447]"></div>
        </div>

        {/* Form Email/Senha */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Link para Cadastro */}
        <div className="text-center text-xs text-gray-400 pt-2">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-purple-400 font-semibold hover:underline">
            Cadastre-se
          </Link>
        </div>
      </div>
    </main>
  );
}