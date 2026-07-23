import { useState, useEffect, useCallback } from "react";
import { Post } from "../../domain/entities/Post";
import { getFeedPostsUseCase } from "../di/Registry";

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // O Hook não sabe que é Firebase. Ele só chama o Use Case!
      const data = await getFeedPostsUseCase.execute(20);
      setPosts(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar a vitrine.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca os posts assim que o componente for montado
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, isLoading, error, refetch: fetchPosts };
}