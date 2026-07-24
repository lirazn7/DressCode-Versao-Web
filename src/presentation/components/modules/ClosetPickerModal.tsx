"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { ClosetItem } from "@/domain/entities/ClosetItem";

interface ClosetPickerModalProps {
  isOpen: boolean;
  items: ClosetItem[];
  selectedIds: string[];
  onClose: () => void;
  onToggleSelect: (itemId: string) => void;
}

export const ClosetPickerModal: React.FC<ClosetPickerModalProps> = ({
  isOpen,
  items,
  selectedIds,
  onClose,
  onToggleSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#18142a] border border-[#2a2447] rounded-3xl p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2447] pb-4 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-white">Marcar Peças do Closet</h3>
            <p className="text-xs text-gray-400">
              Selecione as peças do seu guarda-roupa que compõem este look
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white w-8 h-8 rounded-full bg-[#0f0c1b] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de Peças */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1 scrollbar-none">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              Sua coleção está vazia. Cadastre peças no seu closet primeiro!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => onToggleSelect(item.id)}
                    className={`relative cursor-pointer rounded-2xl overflow-hidden border transition-all group ${
                      isSelected
                        ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20 scale-[0.98]"
                        : "border-[#2a2447] bg-[#0f0c1b] hover:border-gray-600"
                    }`}
                  >
                    <div className="aspect-square relative bg-[#18142a]">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1 shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-bold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-purple-400 font-semibold capitalize">
                        {item.category}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Botão de Finalização */}
        <div className="pt-3 border-t border-[#2a2447] shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95"
          >
            Concluir Seleção ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
};