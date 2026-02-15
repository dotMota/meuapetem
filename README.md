# Meu Apê Tem Platform (Next.js + Vercel)

Plataforma SaaS em **Next.js** para **imobiliárias** criarem páginas de produtos com identidade visual própria e gestão da equipe comercial.

## Módulos implementados

- Landing da plataforma (`/`)
- Painel central da plataforma para imobiliárias (`/dashboard`)
- Página pública de cada imobiliária com branding e produtos (`/imobiliarias/[slug]`)
- API de imobiliárias (`/api/imobiliarias`)
- API de corretores agregados por imobiliária (`/api/corretores`)

## Rodando localmente

```bash
npm install
npm run dev
```

## Fluxo recomendado para produção

```bash
npm run build
npm start
```

## Deploy na Vercel

1. Suba este repositório no GitHub.
2. Importe o projeto na Vercel.
3. Framework detectado: Next.js.
4. Build command: `npm run build`.

## Próximos passos sugeridos

- Autenticação e autorização por perfil (owner da plataforma, admin da imobiliária, corretor)
- Persistência real com Postgres + Prisma
- CMS para criação de páginas e blocos de produto por imobiliária
- Integração com CRM e captação de leads por produto
