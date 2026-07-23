 import { User } from "./User";

export interface Post {
  id: string;
  authorId: string;
  authorUsername: string;
  authorProfilePicture?: string;
  imageUrl: string;
  description: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
}

// Um tipo utilitário para quando formos criar um post (o ID e os contadores são gerados depois)
export type CreatePostDTO = Omit<Post, 'id' | 'likesCount' | 'commentsCount' | 'createdAt'>;