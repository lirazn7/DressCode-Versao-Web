"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useFeed } from "@/presentation/hooks/useFeed";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useModal } from "@/presentation/contexts/ModalContext";
import { PostCard } from "@/presentation/components/modules/PostCard";
import { CreatePostModal } from "@/presentation/components/modules/CreatePostModal";

export default function FeedPage() {
  const { posts, isLoading, error, refetch: refetchPosts } = useFeed();
  const { user } = useAuth();
  const { isCreatePostOpen, openCreatePostModal, closeCreatePostModal } = useModal();

  return (
    <main className="min-h-screen bg-[#0f0c1b] text-gray-100 p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Banner Superior / Call to Action */}
        <div className="bg-[#18142a] border border-[#2a2447] rounded-3xl p-5 flex items-center justify-between shadow-xl">
          <div>
            <h2 className="text-base font-bold text-white">O que você está vestindo hoje?</h2>
            <p className="text-xs text-gray-400">Inspire a comunidade publicando seu outfit</p>
          </div>
          {user && (
            <button
              onClick={openCreatePostModal}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Look</span>
            </button>
          )}
        </div>

        {/* Feed de Publicações */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-400 animate-pulse">Carregando feed...</p>
          </div>
        ) : error ? (
          <div className="bg-red-950/40 border border-red-800/50 text-red-300 p-4 rounded-2xl text-center text-xs">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-[#18142a] rounded-3xl border border-[#2a2447] p-8 space-y-3">
            <p className="text-gray-400 text-xs">Nenhum look foi publicado ainda.</p>
            {user && (
              <button
                onClick={openCreatePostModal}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all"
              >
                Seja o primeiro a publicar!
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criação de Post (Alimentado pelo ModalContext Global) */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={closeCreatePostModal}
        onPostCreated={refetchPosts}
      />
    </main>
  );
}