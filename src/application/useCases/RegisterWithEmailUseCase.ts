import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { RegisterDTO, User } from "../../domain/entities/User";

export class RegisterWithEmailUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(data: RegisterDTO): Promise<User> {
    if (!data.email || !data.pass || !data.username) {
      throw new Error("Todos os campos (e-mail, senha e nome de usuário) são obrigatórios.");
    }
    return await this.authRepository.registerWithEmail(data);
  }
}