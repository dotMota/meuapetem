class PageScanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        if (!customElements.get('project-card')) {
            console.error('Erro: Importe project-card.js no head.');
            return;
        }

        const categorySlot = this.querySelector('[slot="category"]');
        const filterCategory = categorySlot ? categorySlot.textContent.trim() : (this.getAttribute('category') || null);
        const dataSource = this.getAttribute('data-src');

        // Verifica se estamos na Home ou numa página interna
        const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
        const isProjectPage = window.location.pathname.includes('/projects/');
        const assetPrefix = isProjectPage ? '../' : './';
        const dataPath = dataSource || (isProjectPage ? '../data/projects.json' : 'data/projects.json');

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
                    <span>${isHome ? (filterCategory ? 'Coleção' : 'Coleção Completa') : 'Continue Explorando'}</span>
                    <h3>${isHome ? (filterCategory === 'rare' ? 'The Rare Collection' : (filterCategory === 'smart' ? 'Smart Living' : 'Todos os Projetos')) : 'Veja Também'}</h3>
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
        let hasError = false;

        try {
            const response = await fetch(dataPath);
            if (!response.ok) throw new Error('404');

            const projects = await response.json();
            const normalizedFilter = filterCategory ? filterCategory.toLowerCase() : null;

            projects.forEach(project => {
                const category = (project.category || '').toLowerCase();
                if (normalizedFilter && category !== normalizedFilter) return;

                const title = project.title || 'Projeto';
                const vibe = project.vibe || 'Ver Projeto';
                const tags = Array.isArray(project.tags) ? project.tags : [];
                const image = project.image ? `${assetPrefix}${project.image}` : '';
                const link = project.path ? `${assetPrefix}${project.path}` : '#';

                const card = document.createElement('project-card');
                const tagMarkup = tags
                    .filter(Boolean)
                    .map(tag => `<span class="tag" slot="tags">${tag.trim()}</span>`)
                    .join('');
                card.innerHTML = `
                    <img slot="image" src="${image}" alt="${title}" loading="lazy">
                    <span slot="price">Conhecer</span>
                    <span slot="vibe">${vibe}</span>
                    <h3 slot="title">${title}</h3>
                    ${tagMarkup}
                    <a slot="link" href="${link}"></a>
                    <span slot="link-text">Me mostre este apê</span>
                `;

                grid.appendChild(card);
                foundCount++;
            });
        } catch (err) {
            console.warn(`Erro ao ler ${dataPath}:`, err);
            grid.innerHTML = '<div class="error-msg">⚠️ Não foi possível carregar a vitrine de projetos.</div>';
            hasError = true;
        }

        if (!hasError && foundCount === 0) {
            this.style.display = 'none'; // Esconde a seção se não achar nada
        }
    }
}
customElements.define('page-scanner', PageScanner);
