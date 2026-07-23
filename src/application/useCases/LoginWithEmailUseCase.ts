import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { LoginCredentials, User } from "../../domain/entities/User";

export class LoginWithEmailUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<User> {
    if (!credentials.email || !credentials.pass) {
      throw new Error("E-mail e senha são obrigatórios.");
    }
    return await this.authRepository.loginWithEmail(credentials);
  }
}