import { FirebasePostRepository } from "@/infrastructure/repositories/FirebasePostRepository";
import { FirebaseAuthRepository } from "@/infrastructure/repositories/FirebaseAuthRepository";
import { FirebaseUserRepository } from "@/infrastructure/repositories/FirebaseUserRepository";
import { FirebaseClosetRepository } from "@/infrastructure/repositories/FirebaseClosetRepository";

import { GetFeedPostsUseCase } from "@/application/useCases/GetFeedPostsUseCase";
import { CreatePostUseCase } from "@/application/useCases/CreatePostUseCase";
import { LoginWithEmailUseCase } from "@/application/useCases/LoginWithEmailUseCase";
import { LoginWithGoogleUseCase } from "@/application/useCases/LoginWithGoogleUseCase";
import { RegisterWithEmailUseCase } from "@/application/useCases/RegisterWithEmailUseCase";
import { LogoutUseCase } from "@/application/useCases/LogoutUseCase";
import { GetUserProfileUseCase } from "@/application/useCases/GetUserProfileUseCase";
import { GetClosetItemsUseCase } from "@/application/useCases/GetClosetItemsUseCase";
import { AddClosetItemUseCase } from "@/application/useCases/AddClosetItemUseCase";

// Instâncias de Infraestrutura
export const postRepository = new FirebasePostRepository();
export const authRepository = new FirebaseAuthRepository();
export const userRepository = new FirebaseUserRepository();
export const closetRepository = new FirebaseClosetRepository();

// Injeção de Dependência nos Use Cases
export const getFeedPostsUseCase = new GetFeedPostsUseCase(postRepository);
export const createPostUseCase = new CreatePostUseCase(postRepository);

export const loginWithEmailUseCase = new LoginWithEmailUseCase(authRepository);
export const loginWithGoogleUseCase = new LoginWithGoogleUseCase(authRepository);
export const registerWithEmailUseCase = new RegisterWithEmailUseCase(authRepository);
export const logoutUseCase = new LogoutUseCase(authRepository);

export const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
export const getClosetItemsUseCase = new GetClosetItemsUseCase(closetRepository);
export const addClosetItemUseCase = new AddClosetItemUseCase(closetRepository);