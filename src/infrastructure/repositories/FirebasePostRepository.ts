import { collection, getDocs, addDoc, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { Post, CreatePostDTO } from "../../domain/entities/Post";
import { IPostRepository } from "../../domain/repositories/IPostRepository";

export class FirebasePostRepository implements IPostRepository {
  private readonly collectionRef = collection(db, "posts");

  async getFeedPosts(maxLimit: number = 10): Promise<Post[]> {
    const q = query(this.collectionRef, orderBy("createdAt", "desc"), limit(maxLimit));
    const snapshot = await getDocs(q);

    // Mapeamos o retorno do Firebase para a nossa Entidade de Domínio
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        authorId: data.authorId,
        authorUsername: data.authorUsername,
        authorProfilePicture: data.authorProfilePicture,
        imageUrl: data.imageUrl,
        description: data.description,
        likesCount: data.likesCount || 0,
        commentsCount: data.commentsCount || 0,
        createdAt: data.createdAt.toDate(), // Convertendo o Timestamp do Firestore para Date do JS
      } as Post;
    });
  }

  async createPost(postData: CreatePostDTO): Promise<Post> {
    const newPostData = {
      ...postData,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date(),
    };

    const docRef = await addDoc(this.collectionRef, newPostData);

    return {
      id: docRef.id,
      ...newPostData
    };
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    const q = query(
      this.collectionRef, 
      where("authorId", "==", userId), 
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Post[];
  }
}