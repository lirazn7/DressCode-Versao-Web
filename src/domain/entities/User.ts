export interface User {
  id: string;
  username: string;
  profilePictureUrl?: string;
  bio?: string;
  createdAt: Date;
}