import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, Calendar, Video, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guias de Viagem e Roteiros | RoteiroApp",
  description: "Roteiros completos, guias de destinos, dicas de viagem e mais — criados pela equipe RoteiroApp para ajudar você a planejar a viagem perfeita.",
  openGraph: {
    title: "Guias de Viagem | RoteiroApp",
    description: "Roteiros e dicas para suas próximas viagens nacionais e internacionais.",
  },
};

export const dynamic = "force-dynamic";

export default async function PostsListPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: {
      title: true, slug: true, excerpt: true, coverImage: true,
      destination: true, tags: true, videoUrl: true, featured: true, createdAt: true,
      author: { select: { name: true } },
    },
  });

  const featured = posts.filter(p => p.featured);
  const rest = posts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-600">
              <span className="text-white text-xs font-black">R</span>
            </div>
            <span className="font-bold text-gray-900 text-sm group-hover:text-blue-600">RoteiroApp</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Guias de Viagem & Roteiros</h1>
          <p className="text-gray-600 text-lg">Dicas, roteiros e experiências reais para planejar sua próxima aventura.</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold">Em breve!</p>
            <p className="text-sm mt-1">Nossos guias de viagem estão sendo preparados.</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div className="mb-10">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-current" /> Em destaque
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featured.map(post => (
                    <PostCard key={post.slug} post={post} featured />
                  ))}
                </div>
              </div>
            )}

            {/* All posts */}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Todos os guias</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map(post => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white text-center">
          <p className="font-black text-2xl mb-2">Planeje sua viagem agora</p>
          <p className="text-blue-200 mb-6">Crie roteiros, controle gastos e organize tudo com o RoteiroApp — grátis.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition-colors">
            Criar conta grátis →
          </Link>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, featured = false }: {
  post: { slug: string; title: string; excerpt: string | null; coverImage: string | null; destination: string | null; tags: string; videoUrl: string | null; featured: boolean; createdAt: Date | string; author: { name: string | null } };
  featured?: boolean;
}) {
  const tags = post.tags ? post.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [];

  return (
    <Link href={`/posts/${post.slug}`} className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 ${featured ? "flex flex-col" : "flex flex-col"}`}>
      {post.coverImage ? (
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className={`bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center ${featured ? "aspect-video" : "h-32"}`}>
          <span className="text-white/30 text-4xl font-black">R</span>
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {post.destination && (
            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-600">
              <MapPin className="h-2.5 w-2.5" /> {post.destination}
            </span>
          )}
          {post.videoUrl && (
            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-violet-600">
              <Video className="h-2.5 w-2.5" /> Vídeo
            </span>
          )}
        </div>
        <h2 className={`font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-2 ${featured ? "text-lg" : "text-sm"}`}>
          {post.title}
        </h2>
        {post.excerpt && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>}
        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5" />
            {new Date(post.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          {tags[0] && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold border border-blue-100">{tags[0]}</span>}
        </div>
      </div>
    </Link>
  );
}
