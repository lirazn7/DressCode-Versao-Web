import { User } from "./User";

export interface UserProfile extends User {
  bio?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}