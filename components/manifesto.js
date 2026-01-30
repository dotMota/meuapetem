class ManifestoSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Manifesto';
        const highlight = this.getAttribute('highlight') || '';
        const text = this.getAttribute('text') || '';

        if (title && !this.querySelector('[slot="title"]')) {
            const span = document.createElement('span');
            span.setAttribute('slot', 'title');
            span.innerHTML = title;
            this.appendChild(span);
        }
        if (highlight && !this.querySelector('[slot="highlight"]')) {
            const span = document.createElement('span');
            span.setAttribute('slot', 'highlight');
            span.textContent = highlight;
            this.appendChild(span);
        }
        if (text && !this.querySelector('[slot="text"]')) {
            const p = document.createElement('p');
            p.setAttribute('slot', 'text');
            p.textContent = text;
            this.appendChild(p);
        }

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

            h2, ::slotted([slot="title"]) {
                font-family: var(--font-title, sans-serif);
                font-size: clamp(2rem, 4vw, 3.5rem);
                line-height: 1.2;
                margin: 0;
                font-weight: 700;
            }

            .highlight, ::slotted([slot="highlight"]) {
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

            p, ::slotted([slot="text"]) {
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
                <slot name="title"></slot>
                <slot name="highlight"></slot>
            </h2>
            <slot name="text"></slot>
        </div>
        `;
    }
}
customElements.define('manifesto-section', ManifestoSection);
