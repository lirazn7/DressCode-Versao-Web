"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, UpdateUserProfileDTO } from "@/domain/entities/UserProfile";
import { Input } from "@/presentation/components/ui/Input";

interface EditProfileModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSubmit: (data: Omit<UpdateUserProfileDTO, "userId">) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSubmit,
}) => {
  const [displayName, setDisplayName] = useState(profile.displayName || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [profilePicture, setProfilePicture] = useState(profile.profilePicture || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
      setProfilePicture(profile.profilePicture || "");
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        displayName,
        bio,
        profilePicture,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao atualizar o perfil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#18142a] border border-[#2a2447] rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header do Modal */}
        <div className="flex items-center justify-between border-b border-[#2a2447] pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Editar Perfil</h3>
            <p className="text-xs text-gray-400">Personalize seus dados visíveis para a comunidade</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg w-8 h-8 rounded-full bg-[#0f0c1b] flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-950/50 border border-red-800/60 text-red-200 text-xs p-3 rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome de Exibição"
            placeholder="Seu nome ou apelido"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <Input
            label="URL da Foto de Perfil"
            placeholder="https://exemplo.com/sua-foto.jpg"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />

          {/* Campo de Biografia */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                Biografia
              </label>
              <span className={`text-[10px] ${bio.length > 160 ? "text-red-400 font-bold" : "text-gray-500"}`}>
                {bio.length}/160
              </span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte um pouco sobre seu estilo, influências ou marca favorita..."
              rows={3}
              maxLength={160}
              className="w-full bg-[#0f0c1b] border border-[#2a2447] focus:border-purple-500 rounded-2xl p-3 text-xs text-gray-100 placeholder-gray-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-3 border-t border-[#2a2447]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#0f0c1b] hover:bg-white/5 border border-[#2a2447] text-gray-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};