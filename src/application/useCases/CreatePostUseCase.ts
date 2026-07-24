import { IPostRepository } from "@/domain/repositories/IPostRepository";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { CreatePostDTO, Post } from "@/domain/entities/Post";

export class CreatePostUseCase {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: CreatePostDTO): Promise<Post> {
    if (!dto.userId) {
      throw new Error("ID do usuário é obrigatório para publicar um look.");
    }

    if (!dto.imageUrl || dto.imageUrl.trim() === "") {
      throw new Error("É necessário incluir uma foto para publicar um look.");
    }

    if (dto.caption && dto.caption.length > 500) {
      throw new Error("A legenda deve ter no máximo 500 caracteres.");
    }

    // 1. Cria a publicação no repositório de posts
    const newPost = await this.postRepository.createPost({
      ...dto,
      caption: dto.caption.trim(),
      closetItemIds: dto.closetItemIds || [],
    });

    // 2. Incrementa o contador de posts do usuário
    try {
      const userProfile = await this.userRepository.getUserProfileById(dto.userId);
      if (userProfile) {
        await this.userRepository.updateProfile(dto.userId, {
          postsCount: (userProfile.postsCount || 0) + 1,
        });
      }
    } catch (error) {
      console.warn("Não foi possível atualizar o contador de posts do perfil:", error);
    }

    return newPost;
  }
}