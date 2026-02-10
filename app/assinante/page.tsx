import { Card } from "@/components/card";
import { Nav } from "@/components/nav";
import { assinanteMock } from "@/lib/data";

export default function AssinantePage() {
  return (
    <main>
      <Nav />
      <section className="container page-header">
        <h1>Painel do Assinante</h1>
        <p>Visão rápida da assinatura, status e geração de leads da sua conta.</p>
      </section>

      <section className="container cards">
        <Card title="Plano atual" value={assinanteMock.plano} subtitle="Upgrade disponível" />
        <Card title="Status" value={assinanteMock.status} subtitle="Conta regular" />
        <Card title="Renovação" value={assinanteMock.renovacao} subtitle="Renovação automática" />
        <Card
          title="Leads no mês"
          value={assinanteMock.leadsNoMes}
          subtitle="+18% vs mês anterior"
        />
      </section>

      <section className="container panel">
        <h2>Dados da conta</h2>
        <ul>
          <li>Nome: {assinanteMock.nome}</li>
          <li>E-mail: {assinanteMock.email}</li>
          <li>Suporte prioritário: habilitado</li>
          <li>Integração CRM: em andamento</li>
        </ul>
      </section>
    </main>
  );
}
