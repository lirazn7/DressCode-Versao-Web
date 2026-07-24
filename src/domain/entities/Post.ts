export interface Post {
  id: string;
  userId: string;
  authorName: string;
  authorUsername: string;
  authorPicture?: string;
  imageUrl: string;
  caption: string;
  closetItemIds?: string[]; // IDs das peças do closet vinculadas ao look
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
}

export type CreatePostDTO = {
  userId: string;
  authorName: string;
  authorUsername: string;
  authorPicture?: string;
  imageUrl: string;
  caption: string;
  closetItemIds?: string[];
};