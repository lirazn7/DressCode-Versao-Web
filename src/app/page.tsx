"use client"; // Diretiva do Next.js indicando que este é um Client Component

import { useFeed } from "../presentation/hooks/useFeed";

export default function VitrineScreen() {
  // Consumimos nosso hook "limpo"
  const { posts, isLoading, error } = useFeed();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 tracking-wide">
          VITRINE
        </h1>

        {isLoading && (
          <div className="text-center text-gray-500 animate-pulse">
            Carregando looks...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {!isLoading && posts.length === 0 && !error && (
            <p className="text-center text-gray-500">Nenhum post encontrado.</p>
          )}

          {posts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Header do Post */}
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                  {post.authorUsername.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-sm">@{post.authorUsername}</span>
              </div>

              {/* Imagem do Post */}
              <div className="aspect-[4/5] bg-gray-200 relative">
                <img 
                  src={post.imageUrl} 
                  alt={post.description}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Footer do Post (Ações) */}
              <div className="p-4">
                <div className="flex gap-4 mb-3">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors">
                    <span className="font-medium">{post.likesCount}</span> Curtidas
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors">
                    <span className="font-medium">{post.commentsCount}</span> Comentários
                  </button>
                </div>
                <p className="text-sm">
                  <span className="font-semibold mr-2">@{post.authorUsername}</span>
                  {post.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}