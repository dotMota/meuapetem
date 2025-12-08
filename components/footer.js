class FooterSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const brand = this.getAttribute('brand') || '';
        const address = this.getAttribute('address') || '';
        const broker = this.getAttribute('broker') || '';
        const copyright = this.getAttribute('copyright') || '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--bg-color, #1a0b12);
                    padding: 5rem 10%;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: center;
                    --font-brand: serif;
                    --font-text: sans-serif;
                }
                .container { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }

                .brand {
                    font-family: var(--font-brand); font-size: 1.5rem; color: #666;
                    margin: 0 0 1rem 0; font-weight: 400; letter-spacing: 1px;
                }
                .addr {
                    font-family: var(--font-text); font-size: 0.9rem; color: #eaeaea;
                    margin: 0; line-height: 1.6;
                }
                .broker {
                    font-family: var(--font-text); font-size: 0.7rem; color: #666;
                    text-transform: uppercase; letter-spacing: 1px; margin-top: 0.5rem;
                }
                .copy {
                    font-family: var(--font-text); font-size: 0.7rem; color: #444;
                    margin-top: 3rem;
                }
                @media (max-width: 768px) { :host { padding: 3rem 5%; } }
            </style>

            <div class="container">
                <h2 class="brand">${brand}</h2>
                <p class="addr">${address}</p>
                <p class="broker">${broker}</p>
                <p class="copy">${copyright}</p>
            </div>
        `;
    }
}
customElements.define('footer-section', FooterSection);