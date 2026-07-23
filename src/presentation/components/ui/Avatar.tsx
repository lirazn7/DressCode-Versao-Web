"use client";

import React from "react";

interface AvatarProps {
  src?: string;
  username: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Componente Átomo de Avatar.
 * Lógica pura de apresentação com fallback gracioso para iniciais.
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  username,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
  };

  const initial = username ? username.charAt(0).toUpperCase() : "U";

  if (src && src.trim() !== "") {
    return (
      <img
        src={src}
        alt={`Perfil de ${username}`}
        className={`${sizeClasses[size]} rounded-full object-cover border border-[#2a2447] shadow-md`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md border border-purple-400/30`}
    >
      {initial}
    </div>
  );
};