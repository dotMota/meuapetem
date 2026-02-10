export type Corretor = {
  id: string;
  nome: string;
  cargo: string;
  whatsapp: string;
  email: string;
};

export type Produto = {
  id: string;
  titulo: string;
  tipo: "Lançamento" | "Pronto" | "Locação";
  cidade: string;
  bairro: string;
  preco: string;
  destaque: string;
};

export type IdentidadeVisual = {
  corPrimaria: string;
  corSecundaria: string;
  logoTexto: string;
  slogan: string;
};

export type Imobiliaria = {
  id: string;
  nome: string;
  slug: string;
  cidadeBase: string;
  plano: "Starter" | "Pro" | "Enterprise";
  identidade: IdentidadeVisual;
  corretores: Corretor[];
  produtos: Produto[];
};
