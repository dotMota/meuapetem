# 🏢 MeuApêTem - Plataforma de Experiência Imobiliária

> "Não vendemos apenas paredes e janelas, mas a luz da manhã que atravessa os cômodos."

Bem-vindo ao repositório oficial do **MeuApêTem**. Este projeto não é apenas um site imobiliário; é uma plataforma de curadoria experiencial projetada para humanizar a jornada de compra do primeiro imóvel, conectando pessoas a espaços onde suas histórias serão vividas.

---

## 📄 Descrição do Projeto

A **MeuApêTem** é uma solução digital que rejeita a frieza do mercado imobiliário tradicional. Utilizamos tecnologia web moderna para criar uma vitrine imersiva, focada em sensações e experiências de vida, e não apenas em especificações técnicas.

**Objetivo:** Transformar a busca por um lar em uma experiência de autodescobrimento, simples e transparente.

---

## 🌟 Conceito e Essência

A marca existe na intersecção entre *habitat* e *identidade*.

### Pilares da Marca

* **Autenticidade Descomplicada:** Rejeitamos o "imobiliariês". Falamos de pessoas para pessoas, de forma direta e honesta.
* **Curadoria Experiencial:** Filtramos imóveis pelo que eles proporcionam (home office produtivo, espaço para pets, silêncio para refletir), indo além da metragem quadrada.
* **Transparência Radical:** A tecnologia serve para mostrar a verdade, sem letras miúdas ou surpresas desagradáveis.

---

## 🏗️ Arquitetura Técnica (HTML-First)

Para garantir performance máxima, SEO impecável e facilidade de manutenção por qualquer membro da equipe (devs ou estagiários), adotamos a arquitetura **HTML-First com Web Components Nativos**.

### Por que HTML-First?

1.  **Zero Dependências:** Não usamos frameworks pesados (React, Vue, Angular). Apenas o navegador e Javascript puro (Vanilla JS).
2.  **Resiliência:** Se o JavaScript falhar, o conteúdo crítico (texto e imagens) continua visível e legível no HTML.
3.  **Manutenção Simples:** Para alterar um texto, preço ou imagem, basta editar o arquivo `.html`. Não é necessário conhecer lógica de programação complexa ou "buildar" o projeto.

---

## 📂 Estrutura de Pastas

A organização do projeto é estrita para manter a escalabilidade.

```text
MeuApêTem/
│
├── index.html              # Vitrine Principal (Landing Page da Marca)
├── README.md               # Este guia de documentação
│
├── css/
│   └── global.css          # Design System (Variáveis CSS, Fontes, Resets)
│
├── media/                  # Repositório Central de Assets
│   ├── utils/              # Logos, ícones de UI, favicons, social assets
│   ├── quarten/            # [PROJETO] Imagens do Quarten Ibirapuera
│   ├── aire/               # [PROJETO] Imagens do Aire (Futuro lançamento)
│   └── [novo-projeto]/     # Crie uma pasta nova para cada novo prédio
│
├── _components/            # Lógica JS (Web Components) - NÚCLEO DO SISTEMA
│   ├── hero-banner.js      # Banner principal com suporte a vídeo/imagem
│   ├── resort-gallery.js   # Galeria de slides infinita e arrastável
│   ├── floor-plans.js      # Visualizador de plantas com abas
│   └── site-footer.js      # Rodapé padrão
│
└── projects/               # Páginas de Produto (Landing Pages Individuais)
    ├── quarten.html        # Página do produto Quarten
    └── template.html       # Arquivo base para novos lançamentos
```
## 🎨 Padrões de Desenvolvimento (Code Standards)

Para manter a consistência e escalabilidade do projeto, seguimos regras estritas de nomenclatura e estrutura.

### 1. Idioma

* **Código (Lógica):** Todo JavaScript, nomes de classes CSS, IDs e atributos HTML customizados devem ser escritos em **INGLÊS**.
    * ✅ **Correto:** `accent-color`, `initGallery()`, `background-image`, `floor-plans`
    * ❌ **Errado:** `cor-destaque`, `iniciarGaleria()`, `imagem-fundo`, `plantas-baixas`
* **Conteúdo (Texto):** Todo texto visível ao cliente final e comentários explicativos no código devem ser escritos em **PORTUGUÊS**.

### 2. Estilização (CSS Variables)

Nunca use cores hexadecimais "hardcoded" (ex: `#c5a065`) diretamente dentro dos componentes ou nas páginas de produto. Use sempre as variáveis semânticas definidas no `:root` de cada arquivo HTML.

| Variável | Descrição |
| :--- | :--- |
| `--accent-color` | Cor principal da marca do empreendimento (botões, destaques, ícones). |
| `--bg-dark` | Cor de fundo predominante da página. |
| `--font-display` | Fonte utilizada para títulos e chamadas. |

---

## 🧩 Guia de Componentes (Como Usar)

Abaixo, a lista dos blocos de construção disponíveis para montar novas páginas.

### Hero Banner (`<hero-banner>`)
A primeira dobra do site. Suporta imagem ou vídeo de fundo.

* **Atributos:** `img-src` (caminho da imagem) ou `video-src` (caminho do vídeo).
* **Slots:** `subtitle`, `title`, `text`.

```html
<hero-banner img-src="../media/quarten/hero.jpg">
    <span slot="subtitle">Coleção Rara</span>
    <h1 slot="title">VIVER <span style="color:var(--accent-color)">BEM</span></h1>
    <p slot="text">Uma descrição envolvente sobre o empreendimento.</p>
</hero-banner>
```

---

### Resort Gallery ('<resort-gallery>')
Galeria horizontal infinita com efeito de arrastar (drag-to-scroll). O componente lê automaticamente qualquer div com a classe slide.

```html
<resort-gallery title="Áreas Comuns" subtitle="Lazer">
    <div class="slide" data-title="Piscina" data-desc="Raia de 25m">
        <img src="../media/quarten/piscina.webp" loading="lazy">
    </div>
    <div class="slide" data-title="Salão" data-desc="Festas">
        <img src="../media/quarten/salao.webp" loading="lazy">
    </div>
</resort-gallery>
```

---

### Floor Plans ('<floor-plans>)
Seção de plantas com abas para troca de metragem e carrossel interno (Render vs Planta Técnica).

```html
<floor-plans title="Plantas">
    <div class="plan-group" data-id="100m" data-btn="100m²">
        <div class="slide"><img src="..." loading="lazy"><span class="caption">Render</span></div>
        <div class="slide"><img src="..." loading="lazy"><span class="caption">Planta</span></div>
        
        <div class="info">
            <h3>Apartamento 100m²</h3>
            <p>Descrição do apartamento...</p>
            <ul>
                <li><span>Área</span><strong>100m²</strong></li>
            </ul>
        </div>
    </div>
</floor-plans>
```

---

## 🚀 Workflow: Criando um Novo Produto

Para lançar um novo prédio (ex: "Gran Cipresso"), siga este passo a passo:

1.  **Mídia:** Crie a pasta `media/gran-cipresso/` e faça upload das imagens otimizadas (preferencialmente `.webp`).
2.  **Página:** Duplique o arquivo `projects/template.html` (ou um existente como `quarten.html`) e renomeie para `gran-cipresso.html`.
3.  **Manifesto:** Abra `painel-projetos.html`, gere o bloco JSON e cole a nova entrada em `data/projects.json`.
4.  **Identidade:** No `<style>` do novo arquivo, altere as cores no `:root`:
    ```css
    :root {
        --accent-color: #2E8B57; /* Verde Cipresso */
        --bg-dark: #121212;
    }
    ```
5.  **Conteúdo:** Atualize os caminhos das imagens (apontando para `../media/gran-cipresso/...`) e os textos dentro dos slots.
6.  **Deploy:** Faça o commit e push para a branch `main`. O GitHub Pages atualizará o site automaticamente em poucos minutos.

---

## 🆘 Suporte e Manutenção

* **Imagens não carregam?** Verifique se o caminho no HTML está subindo um nível (`../`) para sair da pasta `projects` e entrar na pasta `media`.
* **Estilo quebrado?** Verifique se o arquivo `css/global.css` está sendo importado corretamente no `<head>`.
* **Bug no JavaScript?** Os componentes utilizam **Shadow DOM** para isolamento. Um erro dentro de um componente não deve quebrar o resto da página. Verifique o console do navegador (F12) para detalhes.
