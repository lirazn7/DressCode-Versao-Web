"use client";

import { useFeed } from "../presentation/hooks/useFeed";
import { PostCard } from "../presentation/components/modules/PostCard";

export default function VitrineScreen() {
  const { posts, isLoading, error, refetch } = useFeed();

  return (
    <main className="min-h-screen bg-[#0f0c1b] text-gray-100 p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Top Bar / Branding */}
        <header className="flex items-center justify-between border-b border-[#2a2447] pb-4 mb-6">
          <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-500">
            DRESSCODE
          </h1>
          <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold bg-purple-950/80 px-3 py-1 rounded-full border border-purple-700/50">
            Vitrine
          </span>
        </header>

        {/* Estado de Carregamento (Loading State) */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 animate-pulse font-medium">
              Carregando os melhores looks...
            </p>
          </div>
        )}

        {/* Estado de Erro (Error State) */}
        {error && !isLoading && (
          <div className="bg-red-950/40 border border-red-800/50 text-red-200 p-6 rounded-2xl text-center space-y-3 backdrop-blur-sm">
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Estado Vazio (Empty State) */}
        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center py-20 bg-[#18142a] rounded-2xl border border-[#2a2447] p-8">
            <p className="text-gray-400 text-sm">
              Nenhum look publicado na vitrine ainda.
            </p>
          </div>
        )}

        {/* Feed de Posts Desacoplado via PostCard Organism */}
        {!isLoading &&
          !error &&
          posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </main>
  );
}