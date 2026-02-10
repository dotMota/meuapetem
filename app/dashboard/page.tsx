import Link from "next/link";
import { Nav } from "@/components/nav";
import { imobiliarias } from "@/lib/data";

export default function DashboardPage() {
  return (
    <main>
      <Nav />
      <section className="container page-header">
        <h1>Painel da Plataforma para Imobiliárias</h1>
        <p>
          Gerencie imobiliárias da sua rede, equipe de corretores e páginas públicas de produtos.
        </p>
      </section>

      <section className="container cards">
        <article className="card">
          <p>Imobiliárias ativas</p>
          <h3>{imobiliarias.length}</h3>
          <small>Operações com páginas publicadas</small>
        </article>
        <article className="card">
          <p>Total de corretores</p>
          <h3>{imobiliarias.reduce((acc, item) => acc + item.corretores.length, 0)}</h3>
          <small>Equipe total cadastrada</small>
        </article>
        <article className="card">
          <p>Produtos publicados</p>
          <h3>{imobiliarias.reduce((acc, item) => acc + item.produtos.length, 0)}</h3>
          <small>Entre lançamentos, prontos e locação</small>
        </article>
      </section>

      <section className="container panel">
        <h2>Imobiliárias da plataforma</h2>
        <table>
          <thead>
            <tr>
              <th>Imobiliária</th>
              <th>Cidade base</th>
              <th>Plano</th>
              <th>Corretores</th>
              <th>Produtos</th>
              <th>Página pública</th>
            </tr>
          </thead>
          <tbody>
            {imobiliarias.map((imobiliaria) => (
              <tr key={imobiliaria.id}>
                <td>{imobiliaria.nome}</td>
                <td>{imobiliaria.cidadeBase}</td>
                <td>{imobiliaria.plano}</td>
                <td>{imobiliaria.corretores.length}</td>
                <td>{imobiliaria.produtos.length}</td>
                <td>
                  <Link href={`/imobiliarias/${imobiliaria.slug}`}>Abrir página</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
