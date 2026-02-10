export type Corretor = {
  id: string;
  nome: string;
  slug: string;
  cidade: string;
  especialidade: string;
  planosVendidos: number;
  clientesAtivos: number;
  descricao: string;
  whatsapp: string;
};

export type Assinante = {
  nome: string;
  email: string;
  plano: string;
  status: "ativo" | "pendente";
  renovacao: string;
  leadsNoMes: number;
};
