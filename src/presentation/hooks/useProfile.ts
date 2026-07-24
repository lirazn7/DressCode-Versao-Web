"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProfile, UpdateUserProfileDTO } from "@/domain/entities/UserProfile";
import { Post } from "@/domain/entities/Post";
import { getUserProfileUseCase, updateUserProfileUseCase, postRepository } from "@/presentation/di/Registry";

export const useProfile = (userId: string | undefined, authUser?: any) => {
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

      if (fetchedProfile) {
        setProfile(fetchedProfile);
      } else if (authUser) {
        // Fallback imediato com os dados de sessão do AuthContext
        setProfile({
          id: authUser.id,
          email: authUser.email,
          username: authUser.username,
          displayName: authUser.displayName || authUser.username,
          bio: authUser.bio || "",
          profilePicture: authUser.profilePicture || "",
          postsCount: 0,
          followersCount: 0,
          followingCount: 0,
          createdAt: new Date(),
        });
      }

      setUserPosts(posts || []);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados do perfil.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, authUser]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const updateProfile = async (data: Omit<UpdateUserProfileDTO, "userId">) => {
    if (!userId) throw new Error("Usuário não autenticado.");

    await updateUserProfileUseCase.execute({
      userId,
      ...data,
    });

    // Atualização reativa em tempo real na UI
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