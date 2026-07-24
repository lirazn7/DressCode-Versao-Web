"use client";

import { useState, useEffect, useCallback } from "react";
import { ClosetItem, ClosetCategory, CreateClosetItemDTO } from "@/domain/entities/ClosetItem";
import { getClosetItemsUseCase, addClosetItemUseCase } from "@/presentation/di/Registry";

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

  const addItem = async (itemData: Omit<CreateClosetItemDTO, "userId">) => {
    if (!userId) throw new Error("Usuário não autenticado.");

    const newItem = await addClosetItemUseCase.execute({
      ...itemData,
      userId,
    });

    // Atualização reativa do estado local
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  return {
    items,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    error,
    addItem,
    refetchCloset: fetchCloset,
  };
};