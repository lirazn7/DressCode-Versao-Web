import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { UserProfile } from "@/domain/entities/UserProfile";

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserProfile | null> {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório.");
    }
    return await this.userRepository.getUserProfileById(userId);
  }
}