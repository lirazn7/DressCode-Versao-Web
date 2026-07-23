"use client";

import React from "react";
import { ClosetItem } from "@/domain/entities/ClosetItem";

interface ClosetGridProps {
  items: ClosetItem[];
  isLoading: boolean;
}

export const ClosetGrid: React.FC<ClosetGridProps> = ({ items, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-8">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="aspect-square bg-[#18142a] rounded-2xl border border-[#2a2447] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-[#18142a] rounded-3xl border border-[#2a2447] p-8 space-y-2">
        <p className="text-2xl">👔</p>
        <p className="text-gray-400 text-xs">
          Nenhuma peça cadastrada nesta categoria do closet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="group bg-[#18142a] rounded-2xl border border-[#2a2447] overflow-hidden shadow-lg hover:border-purple-600/50 transition-all duration-300"
        >
          <div className="aspect-square bg-[#0f0c1b] relative overflow-hidden flex items-center justify-center">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-2xl opacity-40">🧥</span>
            )}

            <span className="absolute top-2 right-2 text-[9px] uppercase tracking-wider font-bold bg-[#0f0c1b]/80 backdrop-blur-md text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
              {item.category}
            </span>
          </div>

          <div className="p-3 space-y-0.5">
            <h4 className="text-xs font-bold text-white truncate">
              {item.name}
            </h4>
            {item.brand && (
              <p className="text-[10px] text-gray-400 truncate">{item.brand}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};