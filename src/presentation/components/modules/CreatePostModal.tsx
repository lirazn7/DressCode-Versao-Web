"use client";

import React, { useState, useRef } from "react";
import { Image as ImageIcon, Shirt, Loader2, X } from "lucide-react";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useCloset } from "@/presentation/hooks/useCloset";
import { ClosetPickerModal } from "@/presentation/components/modules/ClosetPickerModal";
import { createPostUseCase, storageRepository } from "@/presentation/di/Registry";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const { user } = useAuth();
  const { items: closetItems } = useCloset(user?.id);

  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedClosetIds, setSelectedClosetIds] = useState<string[]>([]);
  
  const [isClosetPickerOpen, setIsClosetPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleToggleClosetItem = (itemId: string) => {
    setSelectedClosetIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Por favor, selecione uma imagem para o seu look.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // 1. Upload da foto do look para o Firebase Storage
      const path = `posts/${user.id}/look_${Date.now()}.${selectedFile.name.split(".").pop()}`;
      const imageUrl = await storageRepository.uploadFile(path, selectedFile);

      // 2. Executa o caso de uso para criar o post
      await createPostUseCase.execute({
        userId: user.id,
        authorName: user.displayName || user.username,
        authorUsername: user.username,
        authorPicture: user.profilePicture,
        imageUrl,
        caption,
        closetItemIds: selectedClosetIds,
      });

      // Limpa os estados locais e notifica o pai
      setCaption("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedClosetIds([]);
      onPostCreated();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao publicar o look.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-lg bg-[#18142a] border border-[#2a2447] rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto scrollbar-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2a2447] pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Publicar Novo Look</h3>
              <p className="text-xs text-gray-400">Compartilhe seu outfit com a comunidade</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white w-8 h-8 rounded-full bg-[#0f0c1b] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMessage && (
            <div className="bg-red-950/50 border border-red-800/60 text-red-200 text-xs p-3 rounded-xl text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Seletor da Imagem Principal do Look */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all aspect-video overflow-hidden ${
                previewUrl
                  ? "border-purple-500 bg-black/40"
                  : "border-[#2a2447] bg-[#0f0c1b] hover:border-purple-500/50"
              }`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview Look"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#18142a] border border-[#2a2447] flex items-center justify-center mx-auto text-purple-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-200">Clique para selecionar a foto</p>
                    <p className="text-[10px] text-gray-500">Formats: JPG, PNG, WEBP (máx. 5MB)</p>
                  </div>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />

            {/* Ação para Taggear Peças do Closet */}
            <div className="flex items-center justify-between bg-[#0f0c1b] p-3.5 rounded-2xl border border-[#2a2447]">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                <Shirt className="w-4 h-4 text-purple-400" />
                <span>Peças Marcadas ({selectedClosetIds.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setIsClosetPickerOpen(true)}
                className="px-3 py-1.5 bg-[#18142a] hover:bg-[#241c3f] border border-[#2a2447] text-purple-300 font-bold text-xs rounded-xl transition-all"
              >
                + Marcar do Closet
              </button>
            </div>

            {/* Legenda do Look */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                  Legenda / Estilo
                </label>
                <span className={`text-[10px] ${caption.length > 500 ? "text-red-400 font-bold" : "text-gray-500"}`}>
                  {caption.length}/500
                </span>
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Descreva seu look, a ocasião ou a inspiração do dia..."
                rows={3}
                maxLength={500}
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
                    <span>Publicando...</span>
                  </>
                ) : (
                  "Publicar Look"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Seletor do Closet */}
      <ClosetPickerModal
        isOpen={isClosetPickerOpen}
        items={closetItems}
        selectedIds={selectedClosetIds}
        onClose={() => setIsClosetPickerOpen(false)}
        onToggleSelect={handleToggleClosetItem}
      />
    </>
  );
};