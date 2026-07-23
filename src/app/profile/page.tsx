"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useProfile } from "@/presentation/hooks/useProfile";
import { useCloset } from "@/presentation/hooks/useCloset";
import { ProfileHeader } from "@/presentation/components/modules/ProfileHeader";
import { ClosetGrid } from "@/presentation/components/modules/ClosetGrid";
import { PostCard } from "@/presentation/components/modules/PostCard";
import { SegmentedTabs } from "@/presentation/components/ui/SegmentedTabs";
import { ClosetCategory } from "@/domain/entities/ClosetItem";

type ProfileTab = "looks" | "closet";

export default function ProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ProfileTab>("looks");
  const [selectedCategory, setSelectedCategory] = useState<ClosetCategory | undefined>(undefined);

  const { profile, userPosts, isLoading: profileLoading } = useProfile(user?.id);
  const { items: closetItems, isLoading: closetLoading } = useCloset(user?.id, selectedCategory);

  if (authLoading || profileLoading) {
    return (
      <main className="min-h-screen bg-[#0f0c1b] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400 animate-pulse">Carregando perfil...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0f0c1b] flex items-center justify-center p-4">
        <div className="text-center bg-[#18142a] p-8 rounded-3xl border border-[#2a2447] space-y-4 max-w-md w-full">
          <p className="text-gray-300 text-sm">Você precisa estar logado para ver seu perfil.</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
          >
            Ir para Login
          </button>
        </div>
      </main>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-[#0f0c1b] text-gray-100 p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header do Perfil */}
        {profile && (
          <ProfileHeader
            profile={profile}
            isOwner={true}
            onLogout={handleLogout}
          />
        )}

        {/* Alternador de Abas principais (Looks vs Closet) */}
        <SegmentedTabs<ProfileTab>
          options={[
            { id: "looks", label: "Looks Publicados", badgeCount: userPosts.length },
            { id: "closet", label: "Meu Closet", badgeCount: closetItems.length },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
        />

        {/* Conteúdo da Aba 1: Looks Publicados */}
        {activeTab === "looks" && (
          <div className="space-y-4">
            {userPosts.length === 0 ? (
              <div className="text-center py-16 bg-[#18142a] rounded-3xl border border-[#2a2447] p-8">
                <p className="text-gray-400 text-xs">Você ainda não publicou nenhum look.</p>
              </div>
            ) : (
              userPosts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        )}

        {/* Conteúdo da Aba 2: Meu Closet */}
        {activeTab === "closet" && (
          <div className="space-y-4">
            {/* Filtros de Categoria */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {(["all", "tops", "bottoms", "shoes", "jackets", "accessories"] as const).map((cat) => {
                const isCatActive =
                  cat === "all" ? selectedCategory === undefined : selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === "all" ? undefined : cat)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize whitespace-nowrap transition-all ${
                      isCatActive
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                        : "bg-[#18142a] text-gray-400 border border-[#2a2447] hover:text-white"
                    }`}
                  >
                    {cat === "all" ? "Todas as peças" : cat}
                  </button>
                );
              })}
            </div>

            {/* Grade de Itens do Closet */}
            <ClosetGrid items={closetItems} isLoading={closetLoading} />
          </div>
        )}
      </div>
    </main>
  );
}