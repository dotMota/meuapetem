import Link from "next/link";
import { Nav } from "@/components/nav";

export default function HomePage() {
  return (
    <main>
      <Nav />
      <section className="hero container">
        <span className="tag">Next.js + Vercel Ready</span>
        <h1>Transforme seu site em uma plataforma imobiliária SaaS multi-corretor.</h1>
        <p>
          Esta nova base permite escalar sua operação com painel para assinantes,
          dashboard para corretores e páginas públicas por corretor com URL própria.
        </p>
        <div className="actions">
          <Link href="/assinante" className="btn primary">
            Ver painel do assinante
          </Link>
          <Link href="/dashboard" className="btn">
            Ver dashboard dos corretores
          </Link>
        </div>
      </section>

      <section className="container grid-3">
        <article className="feature">
          <h2>Gestão centralizada</h2>
          <p>Controle planos, assinatura e performance comercial em um único lugar.</p>
        </article>
        <article className="feature">
          <h2>Páginas por corretor</h2>
          <p>
            Cada corretor pode ter uma página própria para captação e divulgação de imóveis.
          </p>
        </article>
        <article className="feature">
          <h2>Arquitetura pronta para Vercel</h2>
          <p>Deploy contínuo, ótimo desempenho e escalabilidade para seu crescimento.</p>
        </article>
      </section>
    </main>
  );
}
