import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { UpdateUserProfileDTO } from "@/domain/entities/UserProfile";

export class UpdateUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: UpdateUserProfileDTO): Promise<void> {
    if (!dto.userId) {
      throw new Error("ID do usuário é obrigatório.");
    }

    if (dto.displayName !== undefined && dto.displayName.trim().length === 0) {
      throw new Error("O nome de exibição não pode ser vazio.");
    }

    if (dto.bio && dto.bio.length > 160) {
      throw new Error("A biografia deve ter no máximo 160 caracteres.");
    }

    const dataToUpdate: Record<string, any> = {};
    if (dto.displayName !== undefined) dataToUpdate.displayName = dto.displayName.trim();
    if (dto.bio !== undefined) dataToUpdate.bio = dto.bio.trim();
    if (dto.profilePicture !== undefined) dataToUpdate.profilePicture = dto.profilePicture.trim();

    await this.userRepository.updateProfile(dto.userId, dataToUpdate);
  }
}