# Auditoria: conteúdo via HTML/JS + slots e variáveis de cor/fonte

## Objetivo
Garantir que **todo conteúdo seja passado por HTML/JS usando slots** (em vez de atributos) e que **cores/fontes venham das variáveis definidas na página do produto**, sem hardcode em componentes. Este documento **não altera o código**, apenas lista o que precisa ser ajustado.

## 1) Componentes que ainda recebem conteúdo via atributos (precisam migrar para slots)
Abaixo estão os componentes que atualmente leem dados com `getAttribute(...)`. O ajuste necessário é **substituir esses atributos por conteúdo em slots** (textos, imagens, links e listas), mantendo o comportamento existente.

- **`components/cta.js`**: `highlight`, `title`, `text`, `button-text`, `project`.
- **`components/footer.js`**: `project`, `broker`, `root-path`.
- **`components/preloader.js`**: `project`.
- **`components/gallery.js`**:
  - `gallery-item`: `image`, `title`, `text`.
  - seção de galeria: `subtitle`, `title`.
- **`components/chapter-section.js`**: `title`, `tag` (o `id` estrutural pode permanecer como atributo, mas o texto deve vir de slot).
- **`components/page-scanner.js`**: `category` (se esse filtro precisa ser customizável, deve vir de slot ou de um script dedicado na página).
- **`components/cta-banner.js`**: `title`, `text`, `btn-text`, `link`.
- **`components/contact.js`**: `photo`, `name`, `creci`, `email`, `phone`.
- **`components/project-card.js`**: `title`, `vibe`, `image`, `link`, `price`, `tags`.
- **`components/showcase.js`**: `highlight`, `title`, `text`, `button-text`, `button-link`.
- **`components/curator-review.js`**: `phrases`, `curator`, `pros`, `cons`.
- **`components/persona-switcher.js`**: `modes`.
- **`components/grid-section.js`**: `title`, `subtitle`, `bg-color`.
- **`components/manifesto.js`**: `title`, `highlight`, `text`.
- **`components/region.js`**: `image`, `highlight`, `title`, `text`, `lat`, `lng`, `zoom`, `pois` (dados do mapa devem vir de slot ou de um script dedicado na página).
- **`components/stats.js`**: `number`, `label`.
- **`components/team.js`**:
  - `team-member`: `role`, `name`, `text`, `image`.
  - seção do time: `highlight`, `title`.
- **`components/hero.js`**: `image`, `title`, `text`, `highlight`, `subtitle`, `curator-badge`.
- **`components/marquee.js`**: `text`, `speed`.
- **`components/plans.js`**:
  - `plan-item`: `title`, `desc`, `area`, `dorms`, `vagas`, `extra-label`, `extra-val`, `button-text`.
  - seção de plantas: `highlight`, `title`.
- **`components/menu.js`**: `logo`, `parent-text`, `parent-link`, `image`.
- **`components/hero-brand.js`**: `image`.
- **`components/hero-manual.js`**: `title`, `subtitle`.
- **`components/trust.js`**: `title`, `img`, `alt`.
- **`components/video.js`**: `cover`, `src`, `title`.
- **`components/related.js`**: `current`, `category`.

> **Nota:** o uso de `slot` já existe em várias páginas (`projects/*.html`, `index.html`, `manual-start.html`, etc.), então a migração deve manter o padrão de slots como fonte principal de conteúdo.

## 2) Componentes com cores/fontes hardcoded (devem ler variáveis da página)
Esses arquivos ainda definem **cores, gradientes, fontes ou imports** diretamente no componente. O ajuste necessário é substituir valores fixos por **variáveis CSS definidas na página do produto** (ex.: `--font-title`, `--font-text`, `--color-highlight`, `--color-text-primary`, `--bg-section-main`, etc.).

- **`components/hero.js`**: cores e fontes fixas em `.seal-label`, `.seal-brand`, `h1`, `p` e `.highlight` (mesmo com fallback, há valores fixos como `#fff`/`#ccc`).
- **`components/hero-brand.js`**: `@import` de fonte externa e várias cores fixas (`#050505`, `rgba(255,255,255,0.1)`, etc.).
- **`components/hero-manual.js`**: fontes fixas (`Space Grotesk`, `Manrope`) e cores fixas.
- **`components/footer.js`**: cores fixas (`#fff`, `#a1a1aa`) e fonte específica (`Space Grotesk`) no `.brand-parent`.
- **`components/contact.js`**: cores fixas (backgrounds, bordas, texto), fontes fixas (`serif`), e cores específicas do WhatsApp.
- **`components/curator-review.js`**: cores fixas e acento coral fixo.
- **`components/project-card.js`**: gradientes e cores fixas em overlay, tags e CTA.
- **`components/menu.js`**: cores fixas em hover/active e fontes fixas (`Space Grotesk`).
- **`components/cta-banner.js`**: cores de fundo fixas.
- **`components/cookie.js`**, **`components/lightbox.js`**, **`components/floating.js`**, **`components/region.js`**, **`components/marquee.js`**: múltiplas cores fixas (fundos, bordas, textos) e fontes `sans-serif` hardcoded.
- **`components/components.js`** (itens genéricos): cores e fontes fixas (`#c5a065`, `#ccc`, etc.).

## 3) Recomendações de padronização (para documentar a mudança)
1. **Conteúdo**: todo texto/imagem/link/lista deve sair de atributo e passar por **slots**.
2. **Estilos**: toda cor e fonte deve sair do componente e vir de **variáveis CSS definidas na página do produto**.
3. **Dados estruturais (mapa, filtros, etc.)**: idealmente definidos por JS no HTML da página do produto, evitando atributos customizados nos componentes.

---

Se precisar, posso detalhar um plano de migração por componente (com nomes de slots sugeridos) sem alterar o código.
