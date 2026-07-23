import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { User, LoginCredentials, RegisterDTO } from "../../domain/entities/User";

export class FirebaseAuthRepository implements IAuthRepository {
  private googleProvider = new GoogleAuthProvider();

 private async syncUserInFirestore(firebaseUser: FirebaseUser, customUsername?: string): Promise<User> {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        username: data.username || data.authorUsername || firebaseUser.email?.split("@")[0] || "usuario",
        displayName: data.displayName || firebaseUser.displayName || "",
        profilePicture: data.profilePicture || firebaseUser.photoURL || "",
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      };
    } else {
      // Cria novo usuário no Firestore caso não exista
      const createdDate = new Date();
      const newUsername = customUsername || firebaseUser.email?.split("@")[0] || `user_${Date.now()}`;
      
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        username: newUsername,
        displayName: firebaseUser.displayName || newUsername,
        profilePicture: firebaseUser.photoURL || "",
        createdAt: createdDate,
      };

      await setDoc(userRef, {
        authorUsername: newUser.username,
        username: newUser.username,
        email: newUser.email,
        displayName: newUser.displayName,
        profilePicture: newUser.profilePicture,
        createdAt: createdDate.toISOString(), // Garantido como objeto Date válido
      });

      return newUser;
    }
  }

  async loginWithEmail(credentials: LoginCredentials): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.pass);
    return await this.syncUserInFirestore(userCredential.user);
  }

  async registerWithEmail(data: RegisterDTO): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.pass);
    return await this.syncUserInFirestore(userCredential.user, data.username);
  }

  async loginWithGoogle(): Promise<User> {
    const userCredential = await signInWithPopup(auth, this.googleProvider);
    return await this.syncUserInFirestore(userCredential.user);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async getCurrentUser(): Promise<User | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    return await this.syncUserInFirestore(currentUser);
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const domainUser = await this.syncUserInFirestore(firebaseUser);
        callback(domainUser);
      } else {
        callback(null);
      }
    });
  }
}