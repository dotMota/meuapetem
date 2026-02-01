/**
 * <manifesto-section>
 * Attributes: title, highlight, text
 */
class ManifestoSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Manifesto';
        const highlight = this.getAttribute('highlight') || ''; // A parte colorida do título
        const text = this.getAttribute('text') || '';

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                padding: 8rem 5%;
                background-color: var(--bg-section-main, #141414);
                text-align: center;
                color: var(--color-text-primary, #fff);
            }

            .container {
                max-width: 900px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                gap: 2rem;
                align-items: center;
            }

            h2 {
                font-family: var(--font-title, sans-serif);
                font-size: clamp(2rem, 4vw, 3.5rem);
                line-height: 1.2;
                margin: 0;
                font-weight: 700;
            }

            .highlight {
                color: var(--highlight-color, #FF6F61);
                position: relative;
                display: inline-block;
            }
            
            /* Detalhe sutil sublinhado (opcional) */
            .highlight::after {
                content: '';
                display: block;
                width: 100%;
                height: 3px;
                background: currentColor;
                margin-top: 5px;
                opacity: 0.3;
            }

            p {
                font-family: var(--font-text, sans-serif);
                font-size: clamp(1.1rem, 1.5vw, 1.3rem);
                line-height: 1.6;
                color: var(--color-text-secondary, #a1a1aa);
                max-width: 750px;
                margin: 0;
            }

            /* Elemento decorativo pequeno */
            .divider {
                width: 2px;
                height: 60px;
                background: linear-gradient(to bottom, var(--highlight-color), transparent);
                margin-bottom: 1rem;
            }

            @media (max-width: 768px) {
                :host { padding: 5rem 5%; }
            }
        </style>

        <div class="container">
            <div class="divider"></div>
            <h2>
                ${title} <span class="highlight">${highlight}</span>
            </h2>
            <p>${text}</p>
        </div>
        `;
    }
}
customElements.define('manifesto-section', ManifestoSection);