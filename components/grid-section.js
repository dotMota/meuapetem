class GridSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || '';
        const subtitle = this.getAttribute('subtitle') || '';
        const bgColor = this.getAttribute('bg-color') || 'transparent';

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                padding: 6rem 5%;
                background: ${bgColor};
            }

            .header {
                margin-bottom: 3rem;
                max-width: 1200px;
                margin-left: auto;
                margin-right: auto;
            }

            h2 {
                font-family: var(--font-title, sans-serif);
                font-size: 2.5rem;
                color: #fff;
                margin: 0;
            }

            .subtitle {
                display: block;
                font-family: var(--font-text, sans-serif);
                color: var(--highlight-color, orange);
                text-transform: uppercase;
                letter-spacing: 2px;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
                font-weight: 700;
            }

            /* O Grid Mágico */
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 2rem;
                max-width: 1400px;
                margin: 0 auto;
            }

            @media (max-width: 768px) {
                h2 { font-size: 2rem; }
                .grid { grid-template-columns: 1fr; }
            }
        </style>

        <div class="header">
            ${subtitle ? `<span class="subtitle">${subtitle}</span>` : ''}
            ${title ? `<h2>${title}</h2>` : ''}
        </div>

        <div class="grid">
            <slot></slot>
        </div>
        `;
    }
}

customElements.define('grid-section', GridSection);