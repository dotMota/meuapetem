class PageScanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // LISTA MESTRA DE PROJETOS (Você só edita aqui quando criar um arquivo novo)
        this.projectFiles = [
            'quarten.html',
            'granoscar.html',
            'elevButanta.html',
            'elevSacoma.html'
        ];
    }

    async connectedCallback() {
        // Verifica se o card existe
        if (!customElements.get('project-card')) {
            console.error('Erro: Importe project-card.js no head.');
            return;
        }

        const currentFile = window.location.pathname.split('/').pop(); // Nome do arquivo atual
        const filterCategory = this.getAttribute('category'); // 'rare' ou 'smart'

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; padding: 4rem 5%; background: var(--bg-section-main, #141414); border-top: 1px solid rgba(255,255,255,0.1); }
                .container { max-width: 1400px; margin: 0 auto; }
                h3 { font-family: var(--font-title, serif); font-size: 2rem; color: #fff; margin-bottom: 2rem; }
                .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; }
            </style>
            <div class="container">
                <h3>Veja Também</h3>
                <div class="grid" id="grid">Carregando projetos...</div>
            </div>
        `;

        const grid = this.shadowRoot.getElementById('grid');
        grid.innerHTML = ''; // Limpa o loading

        // --- A MÁGICA ACONTECE AQUI ---
        for (const file of this.projectFiles) {
            // 1. Pula a página atual (não mostrar ela mesma)
            if (file === currentFile) continue;

            try {
                // 2. Vai buscar o arquivo HTML
                // Ajuste de caminho: se estamos na index, é "projects/", se estamos em projects, é "./"
                const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
                const pathPrefix = isHome ? 'projects/' : './';
                const imagePrefix = isHome ? '' : '../'; // Ajuste chato de caminho de imagem

                const response = await fetch(pathPrefix + file);
                const htmlText = await response.text();

                // 3. Transforma o texto em um "Documento Virtual" para ler
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                // 4. "Rouba" as informações do Head
                const category = doc.querySelector('meta[name="product-category"]')?.content;

                // Só mostra se for da categoria que pedimos
                if (category === filterCategory) {
                    const title = doc.querySelector('title').innerText.split('|')[0].trim();
                    const vibe = doc.querySelector('meta[name="product-vibe"]')?.content || 'Lançamento';
                    const tags = doc.querySelector('meta[name="product-tags"]')?.content || '';

                    // Pega a imagem e corrige o caminho dela (remove os ../ se estivermos na home)
                    let image = doc.querySelector('meta[property="og:image"]')?.content;
                    if (image && isHome) image = image.replace('../', './');

                    // Cria o Card
                    const card = document.createElement('project-card');
                    card.setAttribute('title', title);
                    card.setAttribute('vibe', vibe);
                    card.setAttribute('image', image);
                    card.setAttribute('tags', tags);
                    card.setAttribute('link', pathPrefix + file);
                    card.setAttribute('price', 'Ver Detalhes');

                    grid.appendChild(card);
                }

            } catch (err) {
                console.warn(`Não consegui ler o projeto ${file}:`, err);
            }
        }
    }
}
customElements.define('page-scanner', PageScanner);
