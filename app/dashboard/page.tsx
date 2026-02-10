import Link from "next/link";
import { Nav } from "@/components/nav";
import { corretores } from "@/lib/data";

export default function DashboardPage() {
  return (
    <main>
      <Nav />
      <section className="container page-header">
        <h1>Dashboard de Corretores</h1>
        <p>Gerencie corretores parceiros e acompanhe o desempenho de cada página.</p>
      </section>

      <section className="container panel">
        <h2>Corretores cadastrados</h2>
        <table>
          <thead>
            <tr>
              <th>Corretor</th>
              <th>Cidade</th>
              <th>Especialidade</th>
              <th>Clientes ativos</th>
              <th>Página</th>
            </tr>
          </thead>
          <tbody>
            {corretores.map((corretor) => (
              <tr key={corretor.id}>
                <td>{corretor.nome}</td>
                <td>{corretor.cidade}</td>
                <td>{corretor.especialidade}</td>
                <td>{corretor.clientesAtivos}</td>
                <td>
                  <Link href={`/corretores/${corretor.slug}`}>Abrir página</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
