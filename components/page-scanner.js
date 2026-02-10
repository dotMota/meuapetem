class PageScanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        if (!window.ProductIndexService) {
            console.error('Erro: Importe services/product-index.service.js antes do page-scanner.js.');
            return;
        }
        if (!customElements.get('project-card')) {
            console.error('Erro: Importe project-card.js no head.');
            return;
        }

        const category = this.getAttribute('category');
        const isHome = window.ProductIndexService.isHomePage();
        const info = window.ProductIndexService.CATEGORY_DETAILS[category] || { title: 'Nossos Projetos', desc: '' };

        this.renderStructure({
            kicker: isHome ? 'MEUAPÊTEM' : 'Continue Explorando',
            title: isHome ? info.title : 'Veja Também',
            desc: isHome ? info.desc : '',
        });

        const grid = this.shadowRoot.getElementById('grid');
        if (window.location.protocol === 'file:') {
            grid.innerHTML = '<div class="error-msg">⚠️ O sistema de vitrine precisa de servidor local para funcionar.</div>';
            return;
        }

        const projects = await window.ProductIndexService.getProjectsByCategory(category);
        if (!projects.length) {
            this.style.display = 'none';
            return;
        }

        projects.forEach((project) => {
            const card = document.createElement('project-card');
            card.setAttribute('title', project.title);
            card.setAttribute('vibe', project.vibe);
            card.setAttribute('image', project.image);
            card.setAttribute('tags', project.tags);
            card.setAttribute('link', project.link);
            card.setAttribute('price', 'Conhecer');

            const cta = document.createElement('span');
            cta.slot = 'cta-text';
            cta.textContent = 'Me mostre este apê';
            card.appendChild(cta);

            grid.appendChild(card);
        });
    }

    renderStructure({ kicker, title, desc }) {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; padding: 6rem 5%; background: var(--color-surface-section, var(--bg-section-main, #141414)); border-top: 1px solid rgba(255,255,255,0.05); }
                .container { max-width: 1400px; margin: 0 auto; }
                .section-header { margin-bottom: 3rem; }
                .kicker { color: var(--color-accent-primary, var(--highlight-color, #c5a065)); text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 0.5rem; }
                h3 { font-family: var(--font-title, serif); font-size: 2rem; color: var(--color-text-primary, #fff); margin: 0 0 1rem 0; }
                .category-desc { color: var(--color-text-secondary, #a0a0a0); font-family: var(--font-text, sans-serif); font-size: 1rem; line-height: 1.6; max-width: 700px; margin: 0; }
                .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; }
                .error-msg { color: #ff6b6b; background: rgba(255,0,0,0.1); padding: 1rem; border-radius: 4px; }
            </style>
            <div class="container">
                <div class="section-header">
                    <slot name="kicker"><span class="kicker">${kicker}</span></slot>
                    <slot name="title"><h3>${title}</h3></slot>
                    ${desc ? `<slot name="description"><p class="category-desc">${desc}</p></slot>` : ''}
                </div>
                <div class="grid" id="grid"></div>
            </div>
        `;
    }
}
customElements.define('page-scanner', PageScanner);
