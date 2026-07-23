import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { IClosetRepository } from "@/domain/repositories/IClosetRepository";
import { ClosetItem, CreateClosetItemDTO, ClosetCategory } from "@/domain/entities/ClosetItem";

export class FirebaseClosetRepository implements IClosetRepository {
  private collectionRef = collection(db, "closet");

  async getItemsByUserId(userId: string, category?: ClosetCategory): Promise<ClosetItem[]> {
    try {
      let q = query(this.collectionRef, where("userId", "==", userId));
      
      if (category) {
        q = query(this.collectionRef, where("userId", "==", userId), where("category", "==", category));
      }

      const snapshot = await getDocs(q);

      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId,
          name: data.name || data.titulo || "Peça de Roupa",
          category: data.category || "tops",
          brand: data.brand || data.marca || "",
          imageUrl: data.imageUrl || data.imageuri || data.image || "",
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        };
      });
    } catch (error) {
      console.error("💥 [FirebaseClosetRepository] Erro ao buscar itens do closet:", error);
      return [];
    }
  }

  async addItem(item: CreateClosetItemDTO): Promise<ClosetItem> {
    const docRef = await addDoc(this.collectionRef, {
      ...item,
      createdAt: new Date().toISOString(),
    });

    return {
      id: docRef.id,
      ...item,
      createdAt: new Date(),
    };
  }

  async deleteItem(itemId: string): Promise<void> {
    const itemRef = doc(db, "closet", itemId);
    await deleteDoc(itemRef);
  }
}