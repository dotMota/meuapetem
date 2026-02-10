import Link from "next/link";
import { Nav } from "@/components/nav";

export default function AssinantePage() {
  return (
    <main>
      <Nav />
      <section className="container page-header">
        <h1>Módulo migrado</h1>
        <p>
          O antigo painel de assinante foi incorporado ao novo Painel da Plataforma para
          Imobiliárias.
        </p>
        <Link href="/dashboard" className="btn primary">
          Ir para painel da imobiliária
        </Link>
      </section>
    </main>
  );
}
