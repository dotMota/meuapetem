import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { imobiliarias } from "@/lib/data";

type Props = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return imobiliarias.map((imobiliaria) => ({ slug: imobiliaria.slug }));
}

export default function ImobiliariaPage({ params }: Props) {
  const imobiliaria = imobiliarias.find((item) => item.slug === params.slug);

  if (!imobiliaria) {
    notFound();
  }

  return (
    <main>
      <Nav />
      <section
        className="container page-header brand-block"
        style={{
          borderColor: imobiliaria.identidade.corPrimaria
        }}
      >
        <p className="brand-logo" style={{ color: imobiliaria.identidade.corPrimaria }}>
          {imobiliaria.identidade.logoTexto}
        </p>
        <h1>{imobiliaria.nome}</h1>
        <p>{imobiliaria.identidade.slogan}</p>
      </section>

      <section className="container panel">
        <h2>Produtos em destaque</h2>
        <div className="grid-3">
          {imobiliaria.produtos.map((produto) => (
            <article
              key={produto.id}
              className="feature"
              style={{ borderColor: imobiliaria.identidade.corSecundaria }}
            >
              <span className="tag">{produto.tipo}</span>
              <h3>{produto.titulo}</h3>
              <p>
                {produto.bairro}, {produto.cidade}
              </p>
              <p>{produto.destaque}</p>
              <strong>{produto.preco}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="container panel">
        <h2>Corretores da imobiliária</h2>
        <ul>
          {imobiliaria.corretores.map((corretor) => (
            <li key={corretor.id}>
              <strong>{corretor.nome}</strong> — {corretor.cargo} • {corretor.email}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
