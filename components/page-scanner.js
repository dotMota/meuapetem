class PageScanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // LISTA EXATA DOS ARQUIVOS NA PASTA PROJECTS
        this.projectFiles = [
            'quarten.html',
            'granoscar.html',
            'elevButanta.html',
            'elevSacoma.html'
        ];
    }

    async connectedCallback() {
        if (!customElements.get('project-card')) {
            console.error('Erro: Importe project-card.js no head.');
            return;
        }

        const currentFile = window.location.pathname.split('/').pop();
        const filterCategory = this.getAttribute('category'); // 'rare' ou 'smart'

        // Verifica se estamos na Home ou numa página interna
        const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');

        this.shadowRoot.innerHTML = `
            <style>
                :host { 
                    display: block; 
                    padding: 6rem 5%; 
                    background: var(--bg-section-main, #141414); 
                    border-top: 1px solid rgba(255,255,255,0.05); 
                }
                .container { max-width: 1400px; margin: 0 auto; }
                
                /* Títulos Diferentes para Home e Internas */
                .section-header { margin-bottom: 3rem; }
                h3 { font-family: var(--font-title, serif); font-size: 2rem; color: #fff; margin: 0; }
                span { 
                    color: var(--highlight-color, #c5a065); 
                    text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 0.5rem;
                }

                .grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
                    gap: 2rem; 
                }
                
                .error-msg { color: #ff6b6b; background: rgba(255,0,0,0.1); padding: 1rem; border-radius: 4px; }
            </style>
            <div class="container">
                <div class="section-header">
                    <span>${isHome ? 'Coleção' : 'Continue Explorando'}</span>
                    <h3>${isHome ? (filterCategory === 'rare' ? 'The Rare Collection' : 'Smart Living') : 'Veja Também'}</h3>
                </div>
                <div class="grid" id="grid">
                    </div>
            </div>
        `;

        const grid = this.shadowRoot.getElementById('grid');

        // Verifica protocolo (Evita erro de CORS local)
        if (window.location.protocol === 'file:') {
            grid.innerHTML = '<div class="error-msg">⚠️ O sistema de vitrine precisa de um servidor local (Live Server) para funcionar. Não roda direto do arquivo.</div>';
            return;
        }

        let foundCount = 0;

        for (const file of this.projectFiles) {
            // Pula o próprio arquivo se estiver dentro dele
            if (file === currentFile) continue;

            try {
                // Define o caminho para buscar o arquivo
                const pathPrefix = isHome ? 'projects/' : './';

                const response = await fetch(pathPrefix + file);
                if (!response.ok) throw new Error('404');

                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                const category = doc.querySelector('meta[name="product-category"]')?.content;

                if (category === filterCategory) {
                    const title = doc.querySelector('title').innerText.split('|')[0].trim();
                    const vibe = doc.querySelector('meta[name="product-vibe"]')?.content || 'Ver Projeto';
                    const tags = doc.querySelector('meta[name="product-tags"]')?.content || '';

                    // Ajuste inteligente de imagem
                    let image = doc.querySelector('meta[property="og:image"]')?.content;
                    if (image && isHome) {
                        // Se estou na home, '../media' vira './media'
                        image = image.replace('../media', './media');
                    }

                    const card = document.createElement('project-card');
                    card.setAttribute('title', title);
                    card.setAttribute('vibe', vibe);
                    card.setAttribute('image', image);
                    card.setAttribute('tags', tags);
                    card.setAttribute('link', pathPrefix + file);
                    card.setAttribute('price', 'Conhecer');

                    grid.appendChild(card);
                    foundCount++;
                }

            } catch (err) {
                console.warn(`Erro ao ler ${file}:`, err);
            }
        }

        if (foundCount === 0) {
            this.style.display = 'none'; // Esconde a seção se não achar nada
        }
    }
}
customElements.define('page-scanner', PageScanner);