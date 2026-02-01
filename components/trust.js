/**
 * <trust-section>
 * Slots: items (trust-item children)
 * Child <trust-item> attributes: title, img, alt
 */
// --- ITEM (Empresa) ---
class TrustItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || '';
        const imgSrc = this.getAttribute('img') || '';
        const altText = this.getAttribute('alt') || title;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.7;
                    transition: all 0.3s ease;
                    
                    /* BLINDAGEM CONTRA CLIQUES */
                    cursor: default;      /* Garante setinha normal, não mãozinha */
                    user-select: none;    /* Não deixa selecionar o texto */
                    text-decoration: none; /* Remove sublinhados se houver */
                }

                /* Efeito Visual (Sobe um pouco) */
                :host(:hover) {
                    opacity: 1;
                    transform: translateY(-5px);
                }

                .label {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    color: var(--color-text-secondary, var(--color-surface-150, #a0a0a0));
                    margin-bottom: 1.5rem;
                    display: block;
                    font-family: sans-serif;
                }

                .logo {
                    display: block;
                    height: 60px;
                    width: auto;
                    object-fit: contain;
                    
                    /* BLINDAGEM DA IMAGEM */
                    pointer-events: none; /* A imagem ignora qualquer clique */
                }
            </style>

            <span class="label">${title}</span>
            <img class="logo" src="${imgSrc}" alt="${altText}">
        `;
    }
}
customElements.define('trust-item', TrustItem);


// --- SEÇÃO (Container) ---
class TrustSection extends HTMLElement {
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
                    /* Usa as variáveis globais ou o fallback vinho */
                    background-color: var(--bg-color, #261019);
                    padding: 5rem 10%;
                    border-top: 1px solid var(--color-border-light, rgba(255, 255, 255, 0.1));
                }
                .container {
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    gap: 6rem;
                    flex-wrap: wrap;
                }
                @media (max-width: 768px) {
                    .container { flex-direction: column; align-items: center; gap: 4rem; }
                }
            </style>
            <div class="container">
                <slot name="items"></slot>
            </div>
        `;
    }
}
customElements.define('trust-section', TrustSection);
