"use client";

import React, { useState } from "react";
import { ClosetCategory, CreateClosetItemDTO } from "@/domain/entities/ClosetItem";
import { Input } from "@/presentation/components/ui/Input";

interface AddClosetItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CreateClosetItemDTO, "userId">) => Promise<void>;
}

const CATEGORIES: { id: ClosetCategory; label: string; icon: string }[] = [
  { id: "tops", label: "Camisas & Tops", icon: "👕" },
  { id: "bottoms", label: "Calças & Saias", icon: "👖" },
  { id: "shoes", label: "Calçados", icon: "👟" },
  { id: "jackets", label: "Casacos & Jaquetas", icon: "🧥" },
  { id: "accessories", label: "Acessórios", icon: "🕶️" },
];

export const AddClosetItemModal: React.FC<AddClosetItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClosetCategory>("tops");
  const [brand, setBrand] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        name,
        category,
        brand,
        imageUrl,
      });

      // Limpa os campos após o envio
      setName("");
      setBrand("");
      setImageUrl("");
      setCategory("tops");
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Falha ao adicionar peça ao closet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#18142a] border border-[#2a2447] rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2a2447] pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Adicionar Peça ao Closet</h3>
            <p className="text-xs text-gray-400">Cadastre um item no seu guarda-roupa digital</p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Seleção de Categoria */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30"
                        : "bg-[#0f0c1b]/60 border-[#2a2447] text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="truncate text-[10px]">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Input
            label="Nome da Peça *"
            placeholder="Ex: Jaqueta Jeans Oversized"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Marca / Estilista (Opcional)"
            placeholder="Ex: Zara, Nike, Thrift/Brechó"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          <Input
            label="URL da Foto da Peça"
            placeholder="https://sua-imagem.com/foto.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

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
              {isSubmitting ? "Salvando..." : "Adicionar Peça"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};