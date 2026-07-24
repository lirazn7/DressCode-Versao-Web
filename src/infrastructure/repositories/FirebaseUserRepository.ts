import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { db } from "@/infrastructure/firebase/config";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { UserProfile } from "@/domain/entities/UserProfile";

export class FirebaseUserRepository implements IUserRepository {
  /**
   * Busca o perfil do usuário pelo seu ID único de documento no Firestore.
   * Aplica o padrão Self-Healing/Lazy Initialization se o documento não existir.
   */
  async getUserProfileById(userId: string): Promise<UserProfile | null> {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);

    // Se o perfil ainda não existir no Firestore, cria um registro padrão de imediato
    if (!docSnap.exists()) {
      const defaultProfile: UserProfile = {
        id: userId,
        email: "",
        username: "usuario",
        displayName: "Usuário DressCode",
        bio: "",
        profilePicture: "",
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        createdAt: new Date(),
      };

      await setDoc(userRef, {
        ...defaultProfile,
        createdAt: new Date().toISOString(),
      });

      return defaultProfile;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      email: data.email || "",
      username: data.username || "usuario",
      displayName: data.displayName || data.username || "Usuário",
      bio: data.bio || "",
      profilePicture: data.profilePicture || "",
      postsCount: data.postsCount || 0,
      followersCount: data.followersCount || 0,
      followingCount: data.followingCount || 0,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    };
  }

  /**
   * Busca o perfil do usuário pelo nome de usuário (@username).
   * Satisfaz o contrato da interface IUserRepository.
   */
  async getUserProfileByUsername(username: string): Promise<UserProfile | null> {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();

    return {
      id: docSnap.id,
      email: data.email || "",
      username: data.username || username,
      displayName: data.displayName || data.username || "Usuário",
      bio: data.bio || "",
      profilePicture: data.profilePicture || "",
      postsCount: data.postsCount || 0,
      followersCount: data.followersCount || 0,
      followingCount: data.followingCount || 0,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    };
  }

  /**
   * Atualiza os campos de perfil do usuário no Firestore.
   */
  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
  }
}