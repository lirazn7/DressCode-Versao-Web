import { Post, CreatePostDTO } from "../entities/Post";

export interface IPostRepository {
  /**
   * Busca os posts para alimentar a Vitrine (Feed)
   */
  getFeedPosts(limit?: number): Promise<Post[]>;

  /**
   * Cria um novo post no banco de dados
   */
  createPost(postData: CreatePostDTO): Promise<Post>;

  /**
   * Busca os posts de um usuário específico para a tela de Perfil
   */
  getPostsByUserId(userId: string): Promise<Post[]>;
}