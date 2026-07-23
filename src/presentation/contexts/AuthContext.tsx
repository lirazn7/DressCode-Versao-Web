"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User, LoginCredentials, RegisterDTO } from "@/domain/entities/User";
import {
  loginWithEmailUseCase,
  loginWithGoogleUseCase,
  registerWithEmailUseCase,
  logoutUseCase,
  authRepository,
} from "@/presentation/di/Registry";

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  loginWithEmail: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (data: RegisterDTO) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Escuta alterações de sessão via Repositório de Autenticação
    const unsubscribe = authRepository.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const authenticatedUser = await loginWithEmailUseCase.execute(credentials);
      setUser(authenticatedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const authenticatedUser = await loginWithGoogleUseCase.execute();
      setUser(authenticatedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmail = async (data: RegisterDTO) => {
    setIsLoading(true);
    try {
      const newUser = await registerWithEmailUseCase.execute(data);
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUseCase.execute();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithEmail,
        loginWithGoogle,
        registerWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};