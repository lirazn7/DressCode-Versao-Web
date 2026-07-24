"use client";

import React, { useState, useEffect, useRef } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { UserProfile, UpdateUserProfileDTO } from "@/domain/entities/UserProfile";
import { Input } from "@/presentation/components/ui/Input";
import { Avatar } from "@/presentation/components/ui/Avatar";
import { uploadProfilePictureUseCase } from "@/presentation/di/Registry";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
      setProfilePicture(profile.profilePicture || "");
      setPreviewUrl(profile.profilePicture || null);
      setSelectedFile(null);
    }
  }, [profile]);

  if (!isOpen) return null;

  // Handler acionado quando o usuário escolhe um arquivo no computador
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Cria uma URL local temporária para exibir o pré-visualização (preview) imediata
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      let finalPictureUrl = profilePicture;

      // Se o usuário selecionou um arquivo novo, realiza o upload no Firebase Storage primeiro
      if (selectedFile) {
        finalPictureUrl = await uploadProfilePictureUseCase.execute(profile.id, selectedFile);
      }

      // Persiste a atualização dos dados do perfil no Firestore
      await onSubmit({
        displayName,
        bio,
        profilePicture: finalPictureUrl,
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
            <p className="text-xs text-gray-400">Personalize sua foto, nome e biografia</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg w-8 h-8 rounded-full bg-[#0f0c1b] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-950/50 border border-red-800/60 text-red-200 text-xs p-3 rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Seletor Visual de Foto de Perfil com Preview Instantâneo */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div 
              className="relative group cursor-pointer" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar
                src={previewUrl || undefined}
                username={profile.username}
                size="lg"
              />
              <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity border-2 border-purple-500">
                <Camera className="w-6 h-6 text-white" />
                <span className="text-[9px] font-bold text-white mt-1">Alterar</span>
              </div>
            </div>

            {/* Input nativo oculto acionado pelo clique na foto */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              {selectedFile ? `Selecionado: ${selectedFile.name}` : "Escolher foto do dispositivo"}
            </button>
          </div>

          <Input
            label="Nome de Exibição"
            placeholder="Seu nome ou apelido"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          {/* Biografia */}
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
              placeholder="Conte um pouco sobre seu estilo, influências ou marcas favoritas..."
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
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};