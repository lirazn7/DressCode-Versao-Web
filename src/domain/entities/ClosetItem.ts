export type ClosetCategory = "tops" | "bottoms" | "shoes" | "jackets" | "accessories";

export interface ClosetItem {
  id: string;
  userId: string;
  name: string;
  category: ClosetCategory;
  brand?: string;
  imageUrl: string;
  createdAt: Date;
}

export type CreateClosetItemDTO = Omit<ClosetItem, "id" | "createdAt">;