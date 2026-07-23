import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { UserProfile } from "@/domain/entities/UserProfile";

export class FirebaseUserRepository implements IUserRepository {
  async getUserProfileById(userId: string): Promise<UserProfile | null> {
    try {
      const userDocRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) return null;

      const data = userSnapshot.data();

      // Contagem de posts do usuário
      const postsQuery = query(collection(db, "posts"), where("userid", "==", userId));
      const postsSnapshot = await getDocs(postsQuery);

      return {
        id: userId,
        email: data.email || "",
        username: data.username || data.authorUsername || "usuario",
        displayName: data.displayName || data.username || "Usuário DressCode",
        profilePicture: data.profilePicture || data.userPhoto || "",
        bio: data.bio || "Apaixonado por moda e estilo urbano.",
        postsCount: postsSnapshot.size,
        followersCount: data.followersCount || data.followers?.length || 0,
        followingCount: data.followingCount || data.following?.length || 0,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      };
    } catch (error) {
      console.error("💥 [FirebaseUserRepository] Erro ao buscar perfil:", error);
      throw error;
    }
  }

  async getUserProfileByUsername(username: string): Promise<UserProfile | null> {
    throw new Error("Método não implementado.");
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, data);
  }
}