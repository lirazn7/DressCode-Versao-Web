import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/config";
import { Post, CreatePostDTO } from "../../domain/entities/Post";
import { IPostRepository } from "../../domain/repositories/IPostRepository";

export class FirebasePostRepository implements IPostRepository {
  private readonly collectionRef = collection(db, "posts");

  private parseFirestoreDate(rawDate: any): Date {
    if (!rawDate) return new Date();
    if (typeof rawDate.toDate === "function") return rawDate.toDate();
    if (typeof rawDate.seconds === "number") return new Date(rawDate.seconds * 1000);
    const parsed = new Date(rawDate);
    return !isNaN(parsed.getTime()) ? parsed : new Date();
  }

  private parseCount(rawCount: any, fallbackArray?: any[]): number {
    if (typeof rawCount === "number") return rawCount;
    if (Array.isArray(fallbackArray)) return fallbackArray.length;
    if (Array.isArray(rawCount)) return rawCount.length;
    return 0;
  }

  async getFeedPosts(maxLimit: number = 10): Promise<Post[]> {
    console.log("🔍 [FirebasePostRepository] Buscando posts no Firestore...");

    try {
      let snapshot;
      try {
        const q = query(this.collectionRef, orderBy("createdAt", "desc"), limit(maxLimit));
        snapshot = await getDocs(q);
      } catch (orderError) {
        console.warn("⚠️ [FirebasePostRepository] Executando fallback sem ordenação...", orderError);
        const fallbackQuery = query(this.collectionRef, limit(maxLimit));
        snapshot = await getDocs(fallbackQuery);
      }

      return snapshot.docs.map((doc) => {
        const data = doc.data();

        // Mapeamento preciso utilizando os dados reais capturados
        const extractedUsername = 
          data.username || 
          data.authorUsername || 
          data.userName || 
          "usuario_dresscode";

        // Mapeia o campo 'imageuri' em base64 vindo do aplicativo mobile
        const extractedImage = 
          data.imageuri || 
          data.imageUrl || 
          data.image || 
          "";

        // Mapeia 'legenda' e curtidas
        const extractedDescription = data.legenda || data.description || "";
        const extractedLikes = this.parseCount(data.likes_count, data.likedBy);
        const extractedComments = this.parseCount(data.comments_count);

        return {
          id: doc.id,
          authorId: data.userid || data.authorId || "",
          authorUsername: extractedUsername,
          authorProfilePicture: data.authorProfilePicture || "",
          imageUrl: extractedImage,
          description: extractedDescription,
          likesCount: extractedLikes,
          commentsCount: extractedComments,
          createdAt: this.parseFirestoreDate(data.createdAt),
        } as Post;
      });
    } catch (error: any) {
      console.error("💥 [FirebasePostRepository] Erro no Firestore:", error);
      throw error;
    }
  }

  async createPost(postData: CreatePostDTO): Promise<Post> {
    throw new Error("Método não implementado.");
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    throw new Error("Método não implementado.");
  }
}