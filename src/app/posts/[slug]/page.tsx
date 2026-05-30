import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Tag, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, coverImage: true, destination: true },
  });
  if (!post) return { title: "Post não encontrado" };
  return {
    title: `${post.title} | RoteiroApp`,
    description: post.excerpt ?? `Guia de viagem: ${post.destination ?? "destino"} — RoteiroApp`,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

function getVideoEmbed(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const ytShort = url.match(/youtube\.com\/shorts\/([^?&\s]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
  return null;
}

function renderContent(content: string): string {
  // Simple markdown-like rendering
  return content
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-800 mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-700">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="space-y-1 my-3">$&</ul>')
    .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed my-3">')
    .replace(/^/, '<p class="text-gray-700 leading-relaxed my-3">')
    .replace(/$/, '</p>');
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: {
      title: true, slug: true, content: true, excerpt: true,
      coverImage: true, destination: true, tags: true, videoUrl: true,
      featured: true, createdAt: true,
      author: { select: { name: true } },
    },
  });

  if (!post) notFound();

  const tags = post.tags ? post.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
  const embedUrl = post.videoUrl ? getVideoEmbed(post.videoUrl) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-600">
              <span className="text-white text-xs font-black">R</span>
            </div>
            <span className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">RoteiroApp</span>
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/posts" className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Guias de viagem
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-10">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          {post.destination && (
            <span className="flex items-center gap-1 font-medium text-blue-600">
              <MapPin className="h-3.5 w-3.5" /> {post.destination}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
          {post.author.name && <span>por <strong className="text-gray-700">{post.author.name}</strong></span>}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-5">{post.title}</h1>

        {post.excerpt && <p className="text-lg text-gray-600 leading-relaxed mb-6 border-l-4 border-blue-500 pl-4">{post.excerpt}</p>}

        {/* Cover image */}
        {post.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-gray-200">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Video embed */}
        {post.videoUrl && (
          <div className="mb-8">
            {embedUrl ? (
              <div className="rounded-2xl overflow-hidden aspect-video bg-black">
                <iframe src={embedUrl} className="w-full h-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen title={post.title} />
              </div>
            ) : (
              <a href={post.videoUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors w-fit">
                <ExternalLink className="h-4 w-4" /> Assistir vídeo relacionado
              </a>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-100">
            <Tag className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
            {tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white text-center">
          <p className="font-black text-xl mb-2">Pronto para planejar sua viagem?</p>
          <p className="text-blue-200 text-sm mb-5">Use o RoteiroApp para criar seu roteiro, controlar gastos e organizar tudo em um lugar.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors">
            Criar roteiro grátis →
          </Link>
        </div>
      </article>
    </div>
  );
}
