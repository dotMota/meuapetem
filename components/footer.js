class FooterSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const brandAttr = this.getAttribute('brand') || 'MeuApêTem';
        const projectAttr = this.getAttribute('project') || '';
        const brokerAttr = this.getAttribute('broker') || '';
        const rootPath = this.getAttribute('root-path') || '.';

        const ensureSlot = (slotName, tag, text, attrs = {}) => {
            if (!text || this.querySelector(`[slot="${slotName}"]`)) return;
            const el = document.createElement(tag);
            el.setAttribute('slot', slotName);
            el.textContent = text;
            Object.entries(attrs).forEach(([key, value]) => {
                if (value) el.setAttribute(key, value);
            });
            this.appendChild(el);
        };

        ensureSlot('brand', 'span', brandAttr);
        if (projectAttr) ensureSlot('project', 'span', projectAttr);
        if (brokerAttr) ensureSlot('broker', 'span', brokerAttr);
        ensureSlot('description', 'p', 'Curadoria imobiliária que conecta pessoas a espaços com alma.');

        if (!this.querySelector('[slot="nav-links"]')) {
            const navLinks = [
                { href: `${rootPath}/index.html#portfolio`, label: 'Coleção' },
                { href: `${rootPath}/index.html#manifesto`, label: 'Sobre' },
                { href: `${rootPath}/index.html#home`, label: 'Início' }
            ];
            navLinks.forEach(link => {
                const anchor = document.createElement('a');
                anchor.setAttribute('slot', 'nav-links');
                anchor.href = link.href;
                anchor.textContent = link.label;
                this.appendChild(anchor);
            });
        }
        if (!this.querySelector('[slot="support-links"]')) {
            const supportLinks = [
                { href: '#', label: 'Fale Conosco', className: 'contact-trigger' },
                { href: `${rootPath}/politica.html`, label: 'Transparência' }
            ];
            supportLinks.forEach(link => {
                const anchor = document.createElement('a');
                anchor.setAttribute('slot', 'support-links');
                anchor.href = link.href;
                if (link.className) anchor.className = link.className;
                anchor.textContent = link.label;
                this.appendChild(anchor);
            });
        }
        if (!this.querySelector('[slot="social-links"]')) {
            const socialLinks = [
                { href: 'https://instagram.com/meuapetem', label: '@meuapetem', target: '_blank' },
                { href: '#', label: 'LinkedIn' }
            ];
            socialLinks.forEach(link => {
                const anchor = document.createElement('a');
                anchor.setAttribute('slot', 'social-links');
                anchor.href = link.href;
                if (link.target) anchor.target = link.target;
                anchor.textContent = link.label;
                this.appendChild(anchor);
            });
        }

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

            ::slotted([slot="brand"]) { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #fff; }
            .brand-divider { font-size: 1.5rem; color: rgba(255,255,255,0.3); font-weight: 300; }
            ::slotted([slot="project"]) { font-family: var(--font-title, serif); font-size: 1.5rem; color: var(--highlight-color, #c5a065); }
            ::slotted([slot="description"]) { margin: 0; }

            h4 {
                color: #fff;
                margin-bottom: 1.5rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-size: 0.9rem;
                font-family: var(--font-title, sans-serif);
            }
            .link-list { display: flex; flex-direction: column; gap: 0.8rem; }
            ::slotted([slot="nav-links"]),
            ::slotted([slot="support-links"]),
            ::slotted([slot="social-links"]) {
                display: block;
                text-decoration: none;
                color: inherit;
                transition: color 0.3s;
            }
            ::slotted([slot="nav-links"]:hover),
            ::slotted([slot="support-links"]:hover),
            ::slotted([slot="social-links"]:hover) {
                color: var(--highlight-color, #FF6F61);
            }

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
                    <slot name="brand"></slot>
                    <span class="brand-divider" id="brandDivider">/</span>
                    <slot name="project"></slot>
                </h2>
                <slot name="description"></slot>
            </div>
            
            <div>
                <h4>Navegação</h4>
                <div class="link-list">
                    <slot name="nav-links"></slot>
                </div>
            </div>

            <div>
                <h4>Suporte</h4>
                <div class="link-list">
                    <slot name="support-links"></slot>
                </div>
            </div>

            <div>
                <h4>Social</h4>
                <div class="link-list">
                    <slot name="social-links"></slot>
                </div>
            </div>
        </div>

        <div class="bottom-bar">
            <span>© ${new Date().getFullYear()} <span id="brandCopy"></span></span>
            <span><slot name="broker"></slot></span>
        </div>
        `;

        this.querySelectorAll('.contact-trigger').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('open-contact-popup'));
            });
        });

        const projectSlot = this.querySelector('[slot="project"]');
        const divider = this.shadowRoot.getElementById('brandDivider');
        if (!projectSlot || !projectSlot.textContent.trim()) {
            divider.style.display = 'none';
        }

        const brandSlot = this.querySelector('[slot="brand"]');
        const brandCopy = this.shadowRoot.getElementById('brandCopy');
        if (brandSlot && brandCopy) {
            brandCopy.textContent = brandSlot.textContent.trim();
        }
    }
}
customElements.define('footer-section', FooterSection);
