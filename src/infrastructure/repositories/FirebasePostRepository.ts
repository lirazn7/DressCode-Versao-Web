import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/infrastructure/firebase/config";
import { IPostRepository } from "@/domain/repositories/IPostRepository";
import { Post, CreatePostDTO } from "@/domain/entities/Post";

export class FirebasePostRepository implements IPostRepository {
  private readonly collectionName = "posts";

  private parseCount(value: any): number {
    if (typeof value === "number") return value;
    if (Array.isArray(value)) return value.length;
    return 0;
  }

  async createPost(dto: CreatePostDTO): Promise<Post> {
    const postData = {
      userId: dto.userId,
      authorName: dto.authorName,
      authorUsername: dto.authorUsername,
      authorPicture: dto.authorPicture || "",
      imageUrl: dto.imageUrl,
      caption: dto.caption,
      closetItemIds: dto.closetItemIds || [],
      likesCount: 0,
      commentsCount: 0,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, this.collectionName), postData);

    return {
      id: docRef.id,
      userId: dto.userId,
      authorName: dto.authorName,
      authorUsername: dto.authorUsername,
      authorPicture: dto.authorPicture,
      imageUrl: dto.imageUrl,
      caption: dto.caption,
      closetItemIds: dto.closetItemIds || [],
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date(),
    };
  }

  async getFeedPosts(): Promise<Post[]> {
    const q = query(
      collection(db, this.collectionName),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();

      return {
        id: docSnapshot.id,
        userId: data.userId || data.authorId || "",
        authorName: data.authorName || data.authorUsername || "Membro DressCode",
        authorUsername: data.authorUsername || "usuario",
        authorPicture: data.authorPicture || data.authorProfilePicture || "",
        imageUrl: data.imageUrl || "",
        caption: data.caption || data.description || "",
        closetItemIds: data.closetItemIds || [],
        likesCount: this.parseCount(data.likesCount ?? data.likes_count),
        commentsCount: this.parseCount(data.commentsCount ?? data.comments_count),
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(),
      };
    });
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    const q = query(
      collection(db, this.collectionName),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();

      return {
        id: docSnapshot.id,
        userId: data.userId || data.authorId || "",
        authorName: data.authorName || data.authorUsername || "Membro DressCode",
        authorUsername: data.authorUsername || "usuario",
        authorPicture: data.authorPicture || data.authorProfilePicture || "",
        imageUrl: data.imageUrl || "",
        caption: data.caption || data.description || "",
        closetItemIds: data.closetItemIds || [],
        likesCount: this.parseCount(data.likesCount ?? data.likes_count),
        commentsCount: this.parseCount(data.commentsCount ?? data.comments_count),
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(),
      };
    });
  }
}