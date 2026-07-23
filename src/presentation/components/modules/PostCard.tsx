"use client";

import React from "react";
import { Post } from "../../../domain/entities/Post";
import { Avatar } from "../ui/Avatar";

interface PostCardProps {
  post: Post;
}

/**
 * Componente de Apresentação para um Post individual da Vitrine.
 * Encapsula o layout e interações do post mantendo o SOLID.
 */
export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="bg-[#18142a] rounded-2xl border border-[#2a2447] overflow-hidden shadow-xl hover:border-purple-800/40 transition-all duration-300">
      {/* Cabeçalho do Card */}
      <div className="flex items-center gap-3 p-4">
        <Avatar
          src={post.authorProfilePicture}
          username={post.authorUsername}
          size="md"
        />
        <div>
          <p className="font-semibold text-sm text-white hover:text-purple-400 transition-colors cursor-pointer">
            @{post.authorUsername}
          </p>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
            DressCode Look
          </span>
        </div>
      </div>

      {/* Imagem do Look (Suporta URL e Base64 vindo do Mobile) */}
      <div className="aspect-[4/5] bg-[#0f0c1b] relative overflow-hidden flex items-center justify-center">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.description || "Look publicado no DressCode"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-xs gap-2">
            <span>📷</span>
            <span>Sem imagem disponível</span>
          </div>
        )}
      </div>

      {/* Rodapé e Engajamento */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-6 text-xs font-semibold text-gray-300">
          <button className="flex items-center gap-1.5 hover:text-pink-500 transition-colors group">
            <span className="group-hover:scale-125 transition-transform">❤️</span>
            <strong className="text-white">{post.likesCount}</strong>
          </button>
          <button className="flex items-center gap-1.5 hover:text-purple-400 transition-colors group">
            <span className="group-hover:scale-125 transition-transform">💬</span>
            <strong className="text-white">{post.commentsCount}</strong>
          </button>
        </div>

        {/* Legenda do Look */}
        {post.description && (
          <p className="text-sm text-gray-300 leading-relaxed">
            <span className="font-semibold text-white mr-2">
              @{post.authorUsername}
            </span>
            {post.description}
          </p>
        )}
      </div>
    </article>
  );
};