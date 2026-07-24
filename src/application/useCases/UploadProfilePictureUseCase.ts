import { IStorageRepository } from "@/domain/repositories/IStorageRepository";

export class UploadProfilePictureUseCase {
  private readonly ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  private readonly MAX_FILE_SIZE_MB = 5;

  constructor(private readonly storageRepository: IStorageRepository) {}

  async execute(userId: string, file: File): Promise<string> {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório.");
    }

    if (!file) {
      throw new Error("Nenhum arquivo de imagem foi selecionado.");
    }

    // Validação de Formato
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Formato de imagem inválido. Use apenas JPG, PNG ou WEBP.");
    }

    // Validação de Tamanho (máximo 5MB)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > this.MAX_FILE_SIZE_MB) {
      throw new Error(`A imagem deve ter no máximo ${this.MAX_FILE_SIZE_MB}MB.`);
    }

    // Define um caminho único para o arquivo no bucket
    const fileExtension = file.name.split(".").pop();
    const path = `profiles/${userId}/avatar_${Date.now()}.${fileExtension}`;

    return await this.storageRepository.uploadFile(path, file);
  }
}