import { IClosetRepository } from "@/domain/repositories/IClosetRepository";
import { ClosetItem, CreateClosetItemDTO } from "@/domain/entities/ClosetItem";

export class AddClosetItemUseCase {
  constructor(private readonly closetRepository: IClosetRepository) {}

  async execute(dto: CreateClosetItemDTO): Promise<ClosetItem> {
    if (!dto.userId) {
      throw new Error("O ID do usuário é obrigatório.");
    }

    if (!dto.name || dto.name.trim().length < 2) {
      throw new Error("O nome da peça deve conter pelo menos 2 caracteres.");
    }

    if (!dto.category) {
      throw new Error("A categoria da peça é obrigatória.");
    }

    const sanitizedDTO: CreateClosetItemDTO = {
      ...dto,
      name: dto.name.trim(),
      brand: dto.brand?.trim() || "",
      imageUrl: dto.imageUrl?.trim() || "",
    };

    return await this.closetRepository.addItem(sanitizedDTO);
  }
}