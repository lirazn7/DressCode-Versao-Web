export interface IStorageRepository {
  /**
   * Envia um arquivo para o provedor de armazenamento e retorna a URL pública de acesso.
   * @param path Caminho do diretório de destino (ex: 'profiles/userId/avatar.png')
   * @param file Arquivo File obtido do navegador
   */
  uploadFile(path: string, file: File): Promise<string>;
}