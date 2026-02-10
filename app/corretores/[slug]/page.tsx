import Link from "next/link";
import { Nav } from "@/components/nav";

export default function CorretorLegacyPage({ params }: { params: { slug: string } }) {
  return (
    <main>
      <Nav />
      <section className="container page-header">
        <h1>Rota antiga de corretor</h1>
        <p>
          A rota <code>/corretores/{params.slug}</code> foi substituída por páginas de imobiliária
          com identidade visual e produtos.
        </p>
        <Link href="/dashboard" className="btn primary">
          Ver painel da plataforma
        </Link>
      </section>
    </main>
  );
}
