"use client";

import React, { createContext, useContext, useState } from "react";

interface ModalContextData {
  isCreatePostOpen: boolean;
  openCreatePostModal: () => void;
  closeCreatePostModal: () => void;
}

const ModalContext = createContext<ModalContextData>({} as ModalContextData);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const openCreatePostModal = () => setIsCreatePostOpen(true);
  const closeCreatePostModal = () => setIsCreatePostOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isCreatePostOpen,
        openCreatePostModal,
        closeCreatePostModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal deve ser utilizado dentro de um ModalProvider");
  }
  return context;
};