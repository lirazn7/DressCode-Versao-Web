import { IClosetRepository } from "@/domain/repositories/IClosetRepository";
import { ClosetItem, ClosetCategory } from "@/domain/entities/ClosetItem";

export class GetClosetItemsUseCase {
  constructor(private readonly closetRepository: IClosetRepository) {}

  async execute(userId: string, category?: ClosetCategory): Promise<ClosetItem[]> {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório.");
    }
    return await this.closetRepository.getItemsByUserId(userId, category);
  }
}