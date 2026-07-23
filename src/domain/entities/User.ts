export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  profilePicture?: string;
  createdAt?: Date;
}

// Data Transfer Objects (DTOs) para os Use Cases de Autenticação
export interface LoginCredentials {
  email: string;
  pass: string;
}

export interface RegisterDTO {
  email: string;
  pass: string;
  username: string;
}