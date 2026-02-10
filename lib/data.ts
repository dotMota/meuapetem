import { Imobiliaria } from "@/lib/types";

export const imobiliarias: Imobiliaria[] = [
  {
    id: "imob-1",
    nome: "Urbaniza Imóveis",
    slug: "urbaniza-imoveis",
    cidadeBase: "São Paulo",
    plano: "Enterprise",
    identidade: {
      corPrimaria: "#1d4ed8",
      corSecundaria: "#0f172a",
      logoTexto: "Urbaniza",
      slogan: "Lançamentos urbanos com performance digital"
    },
    corretores: [
      {
        id: "c1",
        nome: "Fernanda Rocha",
        cargo: "Gerente Comercial",
        whatsapp: "11999990001",
        email: "fernanda@urbaniza.com"
      },
      {
        id: "c2",
        nome: "Mateus Pires",
        cargo: "Consultor de Lançamentos",
        whatsapp: "11999990002",
        email: "mateus@urbaniza.com"
      }
    ],
    produtos: [
      {
        id: "p1",
        titulo: "Reserva Pinheiros",
        tipo: "Lançamento",
        cidade: "São Paulo",
        bairro: "Pinheiros",
        preco: "A partir de R$ 780.000",
        destaque: "2 e 3 dorms, rooftop e coworking"
      },
      {
        id: "p2",
        titulo: "Estação Vila Mariana",
        tipo: "Pronto",
        cidade: "São Paulo",
        bairro: "Vila Mariana",
        preco: "A partir de R$ 650.000",
        destaque: "Próximo ao metrô, alto potencial de locação"
      }
    ]
  },
  {
    id: "imob-2",
    nome: "Costa Sul Negócios Imobiliários",
    slug: "costa-sul-negocios",
    cidadeBase: "Santos",
    plano: "Pro",
    identidade: {
      corPrimaria: "#0f766e",
      corSecundaria: "#134e4a",
      logoTexto: "Costa Sul",
      slogan: "Seu imóvel no litoral com identidade própria"
    },
    corretores: [
      {
        id: "c3",
        nome: "Marina Lopes",
        cargo: "Especialista em Litoral",
        whatsapp: "13999990003",
        email: "marina@costasul.com"
      }
    ],
    produtos: [
      {
        id: "p3",
        titulo: "Vista Mar Ponta da Praia",
        tipo: "Lançamento",
        cidade: "Santos",
        bairro: "Ponta da Praia",
        preco: "A partir de R$ 1.100.000",
        destaque: "Varanda gourmet com vista total para o mar"
      },
      {
        id: "p4",
        titulo: "Residencial Canal 4",
        tipo: "Locação",
        cidade: "Santos",
        bairro: "Embaré",
        preco: "R$ 4.900 / mês",
        destaque: "Apartamento mobiliado, 2 vagas"
      }
    ]
  }
];
