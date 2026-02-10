import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Meu Apê Tem | Plataforma para Imobiliárias",
  description:
    "Plataforma em Next.js para imobiliárias criarem páginas de produtos com identidade visual própria e gestão da equipe de corretores."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
