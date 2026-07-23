"use client";

import { useState, useEffect, useCallback } from "react";
import { ClosetItem, ClosetCategory } from "@/domain/entities/ClosetItem";
import { getClosetItemsUseCase } from "@/presentation/di/Registry";

export const useCloset = (userId: string | undefined, initialCategory?: ClosetCategory) => {
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ClosetCategory | undefined>(initialCategory);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCloset = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const closetItems = await getClosetItemsUseCase.execute(userId, selectedCategory);
      setItems(closetItems);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar itens do closet.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, selectedCategory]);

  useEffect(() => {
    fetchCloset();
  }, [fetchCloset]);

  return {
    items,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    error,
    refetchCloset: fetchCloset,
  };
};