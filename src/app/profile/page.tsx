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
import { AddClosetItemModal } from "@/presentation/components/modules/AddClosetItemModal";
import { EditProfileModal } from "@/presentation/components/modules/EditProfileModal";
import { ClosetCategory, CreateClosetItemDTO } from "@/domain/entities/ClosetItem";

// 👇 Garanta que UserProfile esteja sendo importado aqui!
import { UserProfile, UpdateUserProfileDTO } from "@/domain/entities/UserProfile";
type ProfileTab = "looks" | "closet";

export default function ProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ProfileTab>("looks");
  const [selectedCategory, setSelectedCategory] = useState<ClosetCategory | undefined>(undefined);
  const [isClosetModalOpen, setIsClosetModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const { profile, userPosts, isLoading: profileLoading, updateProfile } = useProfile(user?.id, user);
  const { items: closetItems, isLoading: closetLoading, addItem } = useCloset(user?.id, selectedCategory);

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

  // Objeto de perfil ativo garantido sem quebra de UI
  const activeProfile: UserProfile = profile || {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName || user.username,
    bio: "", // Fallback padrão, pois a entidade base 'User' não possui o campo 'bio'
    profilePicture: user.profilePicture || "",
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date(),
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleAddClosetItem = async (itemData: Omit<CreateClosetItemDTO, "userId">) => {
    await addItem(itemData);
  };

  const handleUpdateProfile = async (data: Omit<UpdateUserProfileDTO, "userId">) => {
    await updateProfile(data);
  };

  return (
    <main className="min-h-screen bg-[#0f0c1b] text-gray-100 p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Cabeçalho do Perfil (Garantido) */}
        <ProfileHeader
          profile={activeProfile}
          isOwner={true}
          onEditProfile={() => setIsEditProfileModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Alternador de Abas */}
        <SegmentedTabs<ProfileTab>
          options={[
            { id: "looks", label: "Looks Publicados", badgeCount: userPosts.length },
            { id: "closet", label: "Meu Closet", badgeCount: closetItems.length },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
        />

        {/* Aba 1: Looks Publicados */}
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

        {/* Aba 2: Meu Closet */}
        {activeTab === "closet" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 bg-[#18142a] p-4 rounded-2xl border border-[#2a2447]">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Filtros do Guarda-Roupa
              </span>
              <button
                onClick={() => setIsClosetModalOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>+</span>
                <span>Nova Peça</span>
              </button>
            </div>

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

            <ClosetGrid items={closetItems} isLoading={closetLoading} />
          </div>
        )}
      </div>

      {/* Modal de Cadastro de Peças no Closet */}
      <AddClosetItemModal
        isOpen={isClosetModalOpen}
        onClose={() => setIsClosetModalOpen(false)}
        onSubmit={handleAddClosetItem}
      />

      {/* Modal de Edição de Perfil */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        profile={activeProfile}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSubmit={handleUpdateProfile}
      />
    </main>
  );
}