import { ClosetItem, CreateClosetItemDTO, ClosetCategory } from "../entities/ClosetItem";

export interface IClosetRepository {
  getItemsByUserId(userId: string, category?: ClosetCategory): Promise<ClosetItem[]>;
  addItem(item: CreateClosetItemDTO): Promise<ClosetItem>;
  deleteItem(itemId: string): Promise<void>;
}