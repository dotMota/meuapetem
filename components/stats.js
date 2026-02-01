/**
 * <stats-section>
 * Slots: items (stat-item children)
 * Child <stat-item> attributes: number, label
 */
// --- ITEM (Número + Texto) ---
class StatItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const number = this.getAttribute('number') || '';
        const label = this.getAttribute('label') || '';

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; transition: transform 0.3s ease; text-align: center; }
                :host(:hover) { transform: translateY(-5px); }
                
                .number {
                    /* Variáveis de Fonte e Cor */
                    font-family: var(--font-title, serif);
                    color: var(--highlight-color, #c5a065);
                    font-size: var(--number-size, clamp(3rem, 5vw, 4rem));
                    
                    margin: 0 0 0.5rem 0; line-height: 1; font-weight: 400; display: block;
                }
                .label {
                    /* Variáveis de Texto */
                    font-family: var(--font-text, sans-serif);
                    color: var(--text-color, #a0a0a0);
                    font-size: var(--label-size, 1rem);
                    
                    margin: 0; font-weight: 300; display: block;
                }
            </style>
            
            <span class="number">${number}</span>
            <span class="label">${label}</span>
        `;
    }
}
customElements.define('stat-item', StatItem);


// --- SEÇÃO (Container) ---
class StatsSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    /* Fundo e Bordas configuráveis */
                    background-color: var(--bg-color, #0f0f0f);
                    padding: var(--section-padding, 10rem 10%);
                    border-top: var(--border-top, 1px solid #222);
                }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    text-align: center; gap: 2rem;
                    max-width: 1200px; margin: 0 auto;
                }
                @media (max-width: 768px) {
                    :host { padding: 5rem 5%; }
                    .grid { grid-template-columns: 1fr; gap: 4rem; }
                }
            </style>
            <div class="grid"><slot name="items"></slot></div>
        `;
    }
}
customElements.define('stats-section', StatsSection);