import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { corretores } from "@/lib/data";

type Props = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return corretores.map((corretor) => ({ slug: corretor.slug }));
}

export default function CorretorPage({ params }: Props) {
  const corretor = corretores.find((item) => item.slug === params.slug);

  if (!corretor) {
    notFound();
  }

  return (
    <main>
      <Nav />
      <section className="container page-header">
        <h1>{corretor.nome}</h1>
        <p>
          {corretor.cidade} • {corretor.especialidade}
        </p>
      </section>

      <section className="container panel">
        <h2>Perfil do corretor</h2>
        <p>{corretor.descricao}</p>
        <ul>
          <li>Clientes ativos: {corretor.clientesAtivos}</li>
          <li>Planos vendidos: {corretor.planosVendidos}</li>
          <li>
            WhatsApp: <a href={`https://wa.me/55${corretor.whatsapp}`}>{corretor.whatsapp}</a>
          </li>
        </ul>
        <Link href="/dashboard" className="btn">
          Voltar para dashboard
        </Link>
      </section>
    </main>
  );
}
