import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/presentation/contexts/AuthContext";
import { ModalProvider } from "@/presentation/contexts/ModalContext";
import { TopHeader } from "@/presentation/components/modules/TopHeader";
import { BottomNav } from "@/presentation/components/modules/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DressCode - Rede Social de Moda & Estilo",
  description: "Compartilhe seus looks e organize seu guarda-roupa digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#0f0c1b] text-gray-100 min-h-screen flex flex-col`}>
        <AuthProvider>
          <ModalProvider>
            {/* Top Brand Header */}
            <TopHeader />

            {/* Conteúdo Principal com compensação inferior para o BottomNav */}
            <div className="flex-1 pb-24">
              {children}
            </div>

            {/* Central de Navegação do Rodapé */}
            <BottomNav />
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}