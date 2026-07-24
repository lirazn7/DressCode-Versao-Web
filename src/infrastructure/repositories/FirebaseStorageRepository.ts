import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/infrastructure/firebase/config";
import { IStorageRepository } from "@/domain/repositories/IStorageRepository";

export class FirebaseStorageRepository implements IStorageRepository {
  async uploadFile(path: string, file: File): Promise<string> {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  }
}