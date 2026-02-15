import { NextResponse } from "next/server";
import { imobiliarias } from "@/lib/data";

export async function GET() {
  const corretores = imobiliarias.flatMap((imobiliaria) =>
    imobiliaria.corretores.map((corretor) => ({
      ...corretor,
      imobiliaria: imobiliaria.nome,
      imobiliariaSlug: imobiliaria.slug
    }))
  );

  return NextResponse.json({ data: corretores });
}
