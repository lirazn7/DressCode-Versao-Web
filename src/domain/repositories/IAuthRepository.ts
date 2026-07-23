import { User, LoginCredentials, RegisterDTO } from "../entities/User";

export interface IAuthRepository {
  loginWithEmail(credentials: LoginCredentials): Promise<User>;
  registerWithEmail(data: RegisterDTO): Promise<User>;
  loginWithGoogle(): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}