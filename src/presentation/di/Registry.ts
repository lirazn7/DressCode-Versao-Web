import { FirebasePostRepository } from "../../infrastructure/repositories/FirebasePostRepository";
import { GetFeedPostsUseCase } from "../../application/useCases/GetFeedPostsUseCase";
import { CreatePostUseCase } from "../../application/useCases/CreatePostUseCase";

// 1. Instanciamos a nossa infraestrutura concreta (O Adaptador)
// Trabalhamos como um Singleton simples para não recriar a conexão a cada renderização
const postRepository = new FirebasePostRepository();

// 2. Injetamos o repositório nos Casos de Uso
export const getFeedPostsUseCase = new GetFeedPostsUseCase(postRepository);
export const createPostUseCase = new CreatePostUseCase(postRepository);