"use client";

import React from "react";
import { UserProfile } from "@/domain/entities/UserProfile";
import { Avatar } from "@/presentation/components/ui/Avatar";

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwner?: boolean;
  onEditProfile?: () => void;
  onLogout?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isOwner = false,
  onEditProfile,
  onLogout,
}) => {
  return (
    <div className="bg-[#18142a] rounded-3xl border border-[#2a2447] p-6 space-y-6 shadow-xl">
      {/* Informações do Usuário */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        <Avatar
          src={profile.profilePicture}
          username={profile.username}
          size="lg"
        />

        <div className="flex-1 space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                {profile.displayName || profile.username}
              </h2>
              <p className="text-xs text-purple-400 font-semibold">
                @{profile.username}
              </p>
            </div>

            {isOwner && (
              <div className="flex items-center gap-2 self-center sm:self-auto">
                {onEditProfile && (
                  <button
                    onClick={onEditProfile}
                    className="px-3.5 py-2 bg-[#241c3f] hover:bg-[#2d234f] border border-[#3b3260] text-gray-200 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                  >
                    ✏️ Editar Perfil
                  </button>
                )}
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                    title="Sair da conta"
                  >
                    Sair
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Biografia */}
          <p className="text-xs text-gray-300 pt-2 leading-relaxed max-w-lg">
            {profile.bio || "Sem biografia cadastrada."}
          </p>
        </div>
      </div>

      {/* Barra de Métricas */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#2a2447] text-center">
        <div className="p-2 bg-[#0f0c1b]/50 rounded-2xl border border-[#2a2447]/50">
          <span className="block text-lg font-black text-white">
            {profile.postsCount}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Looks
          </span>
        </div>
        <div className="p-2 bg-[#0f0c1b]/50 rounded-2xl border border-[#2a2447]/50">
          <span className="block text-lg font-black text-white">
            {profile.followersCount}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Seguidores
          </span>
        </div>
        <div className="p-2 bg-[#0f0c1b]/50 rounded-2xl border border-[#2a2447]/50">
          <span className="block text-lg font-black text-white">
            {profile.followingCount}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Seguindo
          </span>
        </div>
      </div>
    </div>
  );
};