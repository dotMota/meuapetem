class FooterSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const parentBrand = 'MeuApêTem';
        const project = this.getAttribute('project') || '';
        const creci = this.getAttribute('broker') || 'CRECI 315675';
        // Define o caminho da raiz para os links funcionarem em qualquer pasta
        const rootPath = this.getAttribute('root-path') || '.';

        this.shadowRoot.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap');

            :host {
                display: block;
                background-color: var(--bg-brand-dark, #050505); 
                color: #a1a1aa;
                padding: 5rem 5% 2rem;
                font-family: var(--font-text, sans-serif);
                border-top: 1px solid rgba(255,255,255,0.05);
            }

            .grid {
                display: grid;
                grid-template-columns: 1.5fr 1fr 1fr 1fr;
                gap: 3rem;
                max-width: 1400px;
                margin: 0 auto 4rem;
            }

            .brand-area h2 {
                margin: 0 0 1rem 0;
                display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
            }

            .brand-parent { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #fff; }
            .brand-divider { font-size: 1.5rem; color: rgba(255,255,255,0.3); font-weight: 300; }
            .brand-project { font-family: var(--font-title, serif); font-size: 1.5rem; color: var(--highlight-color, #c5a065); }

            h4 { color: #fff; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem; }
            ul { list-style: none; padding: 0; }
            li { margin-bottom: 0.8rem; }
            a { text-decoration: none; color: inherit; transition: color 0.3s; }
            a:hover { color: var(--highlight-color, #FF6F61); }

            .bottom-bar {
                border-top: 1px solid rgba(255,255,255,0.05);
                padding-top: 2rem;
                display: flex; justify-content: space-between;
                font-size: 0.85rem; opacity: 0.6;
            }

            @media (max-width: 900px) { .grid { grid-template-columns: 1fr 1fr; } }
            @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } .bottom-bar { flex-direction: column; gap: 10px; text-align: center; } }
        </style>

        <div class="grid">
            <div class="brand-area">
                <h2>
                    <span class="brand-parent">${parentBrand}</span>
                    ${project ? `
                        <span class="brand-divider">/</span>
                        <span class="brand-project">${project}</span>
                    ` : ''}
                </h2>
                <p>Curadoria imobiliária que conecta pessoas a espaços com alma.</p>
            </div>
            
            <div>
                <h4>Navegação</h4>
                <ul>
                    <li><a href="${rootPath}/index.html#portfolio">Coleção</a></li>
                    <li><a href="${rootPath}/index.html#manifesto">Sobre</a></li>
                    <li><a href="${rootPath}/index.html#home">Início</a></li>
                </ul>
            </div>

            <div>
                <h4>Suporte</h4>
                <ul>
                    <li><a href="#" class="contact-trigger">Fale Conosco</a></li>
                    <li><a href="${rootPath}/politica.html">Transparência</a></li>
                </ul>
            </div>

            <div>
                <h4>Social</h4>
                <ul>
                    <li><a href="https://instagram.com/meuapetem" target="_blank">@meuapetem</a></li>
                    <li><a href="#">LinkedIn</a></li>
                </ul>
            </div>
        </div>

        <div class="bottom-bar">
            <span>© ${new Date().getFullYear()} ${parentBrand}</span>
            <span>${creci}</span>
        </div>
        `;

        this.shadowRoot.querySelectorAll('.contact-trigger').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('open-contact-popup'));
            });
        });
    }
}
customElements.define('footer-section', FooterSection);