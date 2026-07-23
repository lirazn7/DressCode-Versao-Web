import { useState, useEffect, useCallback } from "react";
import { Post } from "../../domain/entities/Post";
import { getFeedPostsUseCase } from "../di/Registry";

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    // Garante que só executaremos a chamada no navegador (Client-side)
    if (typeof window === "undefined") return;

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🚀 [useFeed] Solicitando posts da Vitrine via UseCase...");
      const data = await getFeedPostsUseCase.execute(20);
      setPosts(data);
    } catch (err: any) {
      console.error("💥 [useFeed] Falha ao carregar feed:", err);
      setError(err.message || "Não foi possível carregar a vitrine.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, isLoading, error, refetch: fetchPosts };
}