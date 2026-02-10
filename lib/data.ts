import { Assinante, Corretor } from "@/lib/types";

export const corretores: Corretor[] = [
  {
    id: "1",
    nome: "Fernanda Rocha",
    slug: "fernanda-rocha",
    cidade: "São Paulo",
    especialidade: "Apartamentos compactos",
    planosVendidos: 34,
    clientesAtivos: 18,
    descricao:
      "Atendimento consultivo para investidores e compradores de primeira viagem em SP.",
    whatsapp: "11999990001"
  },
  {
    id: "2",
    nome: "Carlos Mendes",
    slug: "carlos-mendes",
    cidade: "Campinas",
    especialidade: "Minha Casa Minha Vida",
    planosVendidos: 21,
    clientesAtivos: 11,
    descricao: "Especialista em financiamento habitacional e imóveis de ticket médio.",
    whatsapp: "19999990002"
  },
  {
    id: "3",
    nome: "Marina Lopes",
    slug: "marina-lopes",
    cidade: "Santos",
    especialidade: "Imóveis de praia",
    planosVendidos: 19,
    clientesAtivos: 9,
    descricao: "Curadoria de imóveis para moradia e temporada no litoral.",
    whatsapp: "13999990003"
  }
];

export const assinanteMock: Assinante = {
  nome: "João Assinante",
  email: "joao@meuapetem.com.br",
  plano: "Pro Growth",
  status: "ativo",
  renovacao: "15/03/2026",
  leadsNoMes: 42
};
