import { Post } from "../../domain/entities/Post";
import { IPostRepository } from "../../domain/repositories/IPostRepository";

export class GetFeedPostsUseCase {
  // Injeção de Dependência: Recebemos o contrato, não a implementação!
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(limit: number = 10): Promise<Post[]> {
    try {
      // Aqui poderíamos adicionar lógicas extras, como analytics, 
      // métricas de leitura, ou filtros adicionais de negócio.
      return await this.postRepository.getFeedPosts(limit);
    } catch (error) {
      console.error("Erro ao buscar posts do feed:", error);
      throw new Error("Não foi possível carregar a vitrine no momento.");
    }
  }
}