import { Post, CreatePostDTO } from "../../domain/entities/Post";
import { IPostRepository } from "../../domain/repositories/IPostRepository";

export class CreatePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(postData: CreatePostDTO): Promise<Post> {
    // A Camada de Aplicação é o lugar perfeito para validações de negócio
    if (!postData.imageUrl || postData.imageUrl.trim() === "") {
      throw new Error("Um post precisa obrigatoriamente de uma imagem.");
    }

    if (!postData.authorId) {
      throw new Error("Usuário não autenticado.");
    }

    // Se as regras de negócio passarem, delegamos a persistência para a ''infraestrutura
    return await this.postRepository.createPost(postData);
  }
}