class ChapterSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // Pega os atributos passados no HTML
        const title = this.getAttribute('title') || '';
        const tag = this.getAttribute('tag') || '';
        const id = this.getAttribute('id') || '';
        const isReverse = this.hasAttribute('reverse');

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                padding: 7rem 5%;
                max-width: 1200px;
                margin: 0 auto;
                border-bottom: 1px solid rgba(255,255,255,0.05);
            }

            /* Container Grid */
            .chapter-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 5rem;
                align-items: center;
            }

            /* Inversão Visual (Zig-Zag) */
            .chapter-grid.reverse {
                direction: rtl;
            }
            .chapter-grid.reverse > * {
                direction: ltr; /* Texto volta ao normal */
            }

            /* Tipografia */
            h2 {
                font-family: var(--font-title, 'Space Grotesk', sans-serif);
                font-size: 2.8rem;
                color: #fff;
                margin: 0 0 1.5rem 0;
                line-height: 1.1;
                letter-spacing: -1px;
            }

            .tag {
                color: var(--color-highlight, #FF6F61);
                font-family: var(--font-title, 'Space Grotesk', sans-serif);
                text-transform: uppercase;
                letter-spacing: 2px;
                font-size: 0.8rem;
                font-weight: 700;
                margin-bottom: 1rem;
                display: block;
            }

            /* Área Visual (Card) */
            .visual-wrapper {
                background: var(--bg-card, #141414);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 24px;
                padding: 3rem;
                box-shadow: 0 30px 60px rgba(0,0,0,0.4);
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                box-sizing: border-box;
            }

            /* Slots de Texto */
            ::slotted(p) {
                color: var(--color-text-secondary, #A1A1AA);
                font-family: var(--font-text, 'Manrope', sans-serif);
                font-size: 1.15rem;
                line-height: 1.8;
                margin-bottom: 1.5rem;
            }
            ::slotted(strong) {
                color: #fff;
                font-weight: 600;
            }
            ::slotted(ul) {
                color: var(--color-text-secondary, #A1A1AA);
                font-family: var(--font-text, 'Manrope', sans-serif);
                font-size: 1.1rem;
                line-height: 1.8;
                padding-left: 1.2rem;
                margin-bottom: 1.5rem;
            }
            ::slotted(li) {
                margin-bottom: 0.5rem;
            }

            /* Responsividade */
            @media (max-width: 900px) {
                :host { padding: 4rem 5%; }
                .chapter-grid { grid-template-columns: 1fr; gap: 3rem; }
                .chapter-grid.reverse { direction: ltr; } /* Desfaz zig-zag no mobile */
                h2 { font-size: 2.2rem; }
                .visual-wrapper { padding: 2rem; }
            }
        </style>

        <section id="${id}" class="chapter-grid ${isReverse ? 'reverse' : ''}">
            <div class="content-col">
                ${tag ? `<span class="tag">${tag}</span>` : ''}
                <h2>${title}</h2>
                <slot name="text"></slot>
            </div>

            <div class="visual-col">
                <div class="visual-wrapper">
                    <slot name="visual"></slot>
                </div>
            </div>
        </section>
        `;
    }
}

customElements.define('chapter-section', ChapterSection);