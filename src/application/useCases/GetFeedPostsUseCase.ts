import { Post } from "../../domain/entities/Post";
import { IPostRepository } from "../../domain/repositories/IPostRepository";

export class GetFeedPostsUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(limit: number = 10): Promise<Post[]> {
    try {
      console.log(`🎯 [GetFeedPostsUseCase] Executando use case com limite: ${limit}`);
      const posts = await this.postRepository.getFeedPosts(limit);
      return posts;
    } catch (error: any) {
      console.error("❌ [GetFeedPostsUseCase] Erro na camada de aplicação:", error);
      
      // Preserva a mensagem de erro original da infraestrutura para facilidade de debug
      const originalMessage = error?.message || "Falha desconhecida no repositório";
      throw new Error(`Não foi possível carregar a vitrine: ${originalMessage}`);
    }
  }
}