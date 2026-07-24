"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProfile, UpdateUserProfileDTO } from "@/domain/entities/UserProfile";
import { Post } from "@/domain/entities/Post";
import { getUserProfileUseCase, updateUserProfileUseCase, postRepository } from "@/presentation/di/Registry";

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [fetchedProfile, posts] = await Promise.all([
        getUserProfileUseCase.execute(userId),
        postRepository.getPostsByUserId(userId),
      ]);

      setProfile(fetchedProfile);
      setUserPosts(posts);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados do perfil.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const updateProfile = async (data: Omit<UpdateUserProfileDTO, "userId">) => {
    if (!userId) throw new Error("Usuário não autenticado.");

    await updateUserProfileUseCase.execute({
      userId,
      ...data,
    });

    // Atualiza o estado local reativamente
    setProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  return {
    profile,
    userPosts,
    isLoading,
    error,
    updateProfile,
    refetchProfile: fetchProfileData,
  };
};