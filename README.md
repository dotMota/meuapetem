# Meu Apê Tem Platform (Next.js + Vercel)

Migração da base estática para uma plataforma SaaS em **Next.js** pronta para deploy na **Vercel**.

## Módulos implementados

- Landing page da plataforma (`/`)
- Painel do assinante (`/assinante`)
- Dashboard de corretores (`/dashboard`)
- Página pública por corretor (`/corretores/[slug]`)
- API inicial de corretores (`/api/corretores`)

## Rodando localmente

```bash
npm install
npm run dev
```

## Deploy na Vercel

1. Suba este repositório no GitHub.
2. Importe na Vercel.
3. Framework detectado: Next.js.
4. Build command: `npm run build`.

## Próximos passos sugeridos

- Integrar autenticação (NextAuth/Clerk/Auth.js)
- Persistência real com Postgres (Prisma + Neon/Supabase)
- RBAC (admin, assinante, corretor)
- Área de criação/edição de páginas por corretor com editor visual
