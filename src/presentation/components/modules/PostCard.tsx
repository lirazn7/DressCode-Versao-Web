"use client";

import React from "react";
import { Heart, MessageCircle, Share2, Shirt } from "lucide-react";
import { Post } from "@/domain/entities/Post";
import { Avatar } from "@/presentation/components/ui/Avatar";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onCommentClick?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onCommentClick,
}) => {
  return (
    <article className="bg-[#18142a] border border-[#2a2447] rounded-3xl overflow-hidden shadow-xl transition-all hover:border-[#3b3266]">
      {/* Header do Card - Dados do Autor */}
      <div className="flex items-center justify-between p-4 border-b border-[#2a2447]/50">
        <div className="flex items-center gap-3">
          <Avatar
            src={post.authorPicture}
            username={post.authorUsername}
            size="md"
          />
          <div>
            <h4 className="text-xs font-bold text-white leading-tight">
              {post.authorName}
            </h4>
            <p className="text-[10px] text-purple-400 font-medium">
              @{post.authorUsername}
            </p>
          </div>
        </div>
      </div>

      {/* Imagem Principal do Look */}
      <div className="relative aspect-square w-full bg-[#0f0c1b] overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.caption || "Look publicado no DressCode"}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Ações e Interações */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike && onLike(post.id)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-pink-500 transition-colors group"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold">{post.likesCount}</span>
            </button>

            <button
              onClick={() => onCommentClick && onCommentClick(post.id)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-purple-400 transition-colors group"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold">{post.commentsCount}</span>
            </button>
          </div>

          {post.closetItemIds && post.closetItemIds.length > 0 && (
            <div className="flex items-center gap-1 text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold">
              <Shirt className="w-3 h-3" />
              <span>{post.closetItemIds.length} {post.closetItemIds.length === 1 ? "peça" : "peças"}</span>
            </div>
          )}
        </div>

        {/* Legenda do Post */}
        {post.caption && (
          <p className="text-xs text-gray-300 leading-relaxed">
            <span className="font-bold text-white mr-1 shadow-sm">
              @{post.authorUsername}
            </span>
            {post.caption}
          </p>
        )}
      </div>
    </article>
  );
};