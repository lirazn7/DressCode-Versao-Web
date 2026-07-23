import { UserProfile } from "../entities/UserProfile";

export interface IUserRepository {
  getUserProfileById(userId: string): Promise<UserProfile | null>;
  getUserProfileByUsername(username: string): Promise<UserProfile | null>;
  updateProfile(userId: string, data: Partial<UserProfile>): Promise<void>;
}