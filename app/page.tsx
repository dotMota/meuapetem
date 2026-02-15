import Link from "next/link";
import { Nav } from "@/components/nav";

export default function HomePage() {
  return (
    <main>
      <Nav />
      <section className="hero container">
        <span className="tag">Next.js + Vercel Ready</span>
        <h1>Plataforma para imobiliárias venderem com marca própria.</h1>
        <p>
          Sua imobiliária cria páginas de produtos, personaliza identidade visual e organiza os
          corretores em um único painel, com arquitetura pronta para escalar na Vercel.
        </p>
        <div className="actions">
          <Link href="/dashboard" className="btn primary">
            Ver painel da imobiliária
          </Link>
          <Link href="/imobiliarias/urbaniza-imoveis" className="btn">
            Ver exemplo de página pública
          </Link>
        </div>
      </section>

      <section className="container grid-3">
        <article className="feature">
          <h2>Identidade visual por imobiliária</h2>
          <p>
            Cada operação define logo, cores e slogan para publicar páginas alinhadas ao seu
            posicionamento.
          </p>
        </article>
        <article className="feature">
          <h2>Portfólio de produtos</h2>
          <p>
            Monte páginas com lançamentos, prontos e locação para gerar leads de forma organizada.
          </p>
        </article>
        <article className="feature">
          <h2>Gestão de equipe comercial</h2>
          <p>Adicione corretores internos e distribua atendimento mantendo o padrão da imobiliária.</p>
        </article>
      </section>
    </main>
  );
}
