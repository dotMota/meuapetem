# MeuApêTem — Plataforma de Curadoria Imobiliária

Site institucional/comercial da MeuApêTem com landing principal e páginas de produto, construído em **HTML + CSS + Web Components nativos (Vanilla JS)**, sem build step.

## Visão geral

O projeto é orientado a:

- **Curadoria por categoria** (`start`, `comfort`, `signature`, `invest`).
- **Arquitetura HTML-first** para edição rápida de conteúdo.
- **Componentização via Custom Elements** para reuso de blocos visuais.
- **Tematização por variáveis CSS** definidas por página de produto.
- **Indexação centralizada de produtos** por service (`services/product-index.service.js`).

---

## Stack e princípios

- **Frontend:** HTML5, CSS3, JavaScript ES Modules-like (scripts globais carregados por `<script src>`).
- **Componentes:** Web Components com Shadow DOM (`components/*.js`).
- **Sem framework e sem bundler:** deploy estático (compatível com GitHub Pages / CDN estático).

Princípios aplicados no código:

1. **HTMLS + SLOTS**
   - Conteúdo é injetável por slots quando o componente permite.
   - Fallback por atributos é mantido para compatibilidade com páginas já em produção.

2. **Tema por variáveis semânticas**
   - As cores ficam na página de produto (`:root`) e os componentes consomem variáveis semânticas.
   - Exemplo de cadeia de fallback: `--color-accent-primary -> --color-highlight`.

3. **Baixo risco em produção**
   - Refactors preservam API pública dos componentes (atributos existentes continuam válidos).

---

## Estrutura real do repositório

```text
.
├── index.html
├── manual-mcmv.html
├── brand.html
├── politica.html
├── projects/
│   ├── quarten.html
│   ├── granoscar.html
│   ├── elevButanta.html
│   ├── elevSacoma.html
│   ├── elevAltoIpiranga.html
│   ├── vilaBoulevardMooca.html
│   └── peninsulaVilaMadalena.html
├── components/
│   ├── hero-brand.js
│   ├── page-scanner.js
│   ├── project-card.js
│   ├── hero.js
│   ├── gallery.js
│   ├── plans.js
│   ├── cta.js
│   ├── trust.js
│   └── ... (demais componentes de UI)
├── services/
│   └── product-index.service.js
├── media/
│   ├── utils/
│   └── [pastas de empreendimentos]
└── README.md
```

---

## Arquitetura dos blocos principais

### 1) Service de indexação (camada de domínio leve)

`services/product-index.service.js` centraliza:

- Lista de páginas de produto indexáveis.
- Parsing de metadados (`title`, `description`, `meta[name="product-category"]`, `product-vibe`, `product-tags`, `og:image`).
- Normalização de caminho de imagem para contexto home/página interna.
- Cache em memória por contexto.
- API pública:
  - `ProductIndexService.getProjectsByCategory(category)`
  - `ProductIndexService.getHeroSlides()`
  - `ProductIndexService.CATEGORY_DETAILS`

### 2) Componentes consumidores do service

- **`components/page-scanner.js`**
  - Renderiza prateleira por categoria.
  - Usa `project-card` para cada item.
  - Suporta slots de cabeçalho (`kicker`, `title`, `description`).

- **`components/hero-brand.js`**
  - Hero/carrossel da home com dados reais indexados.
  - CTA e navegação entre slides.

- **`components/project-card.js`**
  - Card de produto com slots: `price`, `vibe`, `title`, `tags`, `cta-text`.
  - Fallback por atributos para compatibilidade.

---

## Convenções de tema (obrigatório)

Definir no `:root` de cada página de produto:

```css
:root {
  --color-accent-primary: #D4AF37;   /* cor principal */
  --color-text-primary: #F5F5F7;     /* texto principal */
  --color-text-secondary: #A1A1AA;   /* texto secundário */
  --color-surface-base: #0a0a0a;     /* fundo base */
  --color-surface-section: #141414;  /* fundo de seções */
  --color-surface-trust: #261019;    /* fundo da seção trust */

  /* compatibilidade legado */
  --color-highlight: var(--color-accent-primary);
  --bg-page-body: var(--color-surface-base);
  --bg-section-main: var(--color-surface-section);
}
```

> Regra: componentes **não devem** hardcodar cores da marca do empreendimento; devem consumir variáveis.

---

## Padrão de uso de slots

Exemplo com `project-card`:

```html
<project-card
  title="Quarten Ibirapuera"
  vibe="Refúgio Urbano"
  image="../media/Quarten_Ibirapuera/fachadas/detalhe_fachada.webp"
  tags="Bosque Privativo, Wellness"
  link="quarten.html"
  price="Conhecer"
>
  <span slot="cta-text">Me mostre este apê</span>
</project-card>
```

---

## Metadados mínimos por página de produto

Cada arquivo em `projects/*.html` deve conter:

- `<title>Nome do Projeto | ...</title>`
- `<meta name="description" content="...">`
- `<meta property="og:image" content="...">`
- `<meta name="product-category" content="start|comfort|signature|invest">`
- `<meta name="product-vibe" content="...">`
- `<meta name="product-tags" content="tag1, tag2">`

Sem esses metadados, indexação e vitrine podem falhar parcialmente.

---

## Como adicionar novo empreendimento

1. Criar `projects/novoProjeto.html` baseado em um produto existente.
2. Adicionar mídias em `media/Novo_Projeto/`.
3. Configurar variáveis de tema no `:root` da página.
4. Preencher metadados de indexação.
5. Incluir `novoProjeto.html` em `PROJECT_FILES` no `product-index.service.js`.
6. Validar localmente com servidor estático.

---

## Desenvolvimento local

Subir servidor local na raiz do projeto:

```bash
python3 -m http.server 4173 --directory /workspace/meuapetem
```

Acessar:

- Home: `http://127.0.0.1:4173/index.html`
- Produto: `http://127.0.0.1:4173/projects/quarten.html`

### Checks rápidos de sintaxe JS

```bash
node --check services/product-index.service.js
node --check components/page-scanner.js
node --check components/hero-brand.js
node --check components/project-card.js
```

---

## Diretrizes de manutenção contínua

- Evitar `style="..."` inline em páginas/componentes.
- Priorizar classes CSS e variáveis semânticas.
- Ao refatorar componente, manter compatibilidade com atributos existentes.
- Evitar duplicação de lógica entre componentes; mover regra de domínio para `services/`.
- Garantir que alterações visuais em componentes críticos sejam validadas com screenshot.

---

## Observações de produção

- O projeto está em operação com tráfego real; mudanças devem priorizar **compatibilidade retroativa**.
- Erros de asset ausente (ex.: imagem com path inválido) devem ser tratados como correção de conteúdo, sem acoplar workaround no componente.

---

## Extensão SaaS (Platform)

Para iniciar a evolução no modelo do tutorial de referência (Platforms Starter Kit), foi adicionada uma camada de plataforma multi-tenant em modo progressivo, sem quebrar o site atual:

- `platform.html`: landing da plataforma SaaS, proposta de valor e planos de assinatura.
- `dashboard.html`: painel de controle para corretor editar marca, tema e componentes ativos.
- `tenant.html`: página pública por corretor (`?slug=...`) renderizada a partir da configuração salva.
- `services/platform.service.js`: service de tenants, assinaturas, seed de dados e persistência (`localStorage`).
- `services/platform-auth.service.js`: autenticação simplificada de sessão (`sessionStorage`).

### Como testar o fluxo SaaS localmente

1. Suba o servidor estático:

```bash
python3 -m http.server 4173 --directory /workspace/meuapetem
```

2. Acesse:

- Landing da plataforma: `http://127.0.0.1:4173/platform.html`
- Painel: `http://127.0.0.1:4173/dashboard.html`
- Tenant demo: `http://127.0.0.1:4173/tenant.html?slug=studio`

3. Login demo no painel:

- E-mail: `demo@meuapetem.com`
- Senha: `demo123`

> Observação: nesta etapa o backend é simulado no browser para validar UX, arquitetura e modelo de produto. Próximo passo recomendado é migrar persistência/autenticação para API real (ex.: Next.js + Postgres + Auth) mantendo o mesmo contrato de dados.
