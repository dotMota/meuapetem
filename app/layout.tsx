import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Meu Apê Tem | Plataforma para Corretores",
  description:
    "Plataforma em Next.js para assinantes e corretores criarem páginas imobiliárias com gestão centralizada."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
