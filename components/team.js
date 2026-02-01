/**
 * <team-section>
 * Attributes: title
 * Slots: default (team-member children)
 * Child <team-member> attributes: role, name, text, image, inverted (auto).
 */
// --- COMPONENTE 1: O MEMBRO (Linha do Zig-Zag) ---
class TeamMember extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['inverted'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'inverted') this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const role = this.getAttribute('role') || '';
        const name = this.getAttribute('name') || '';
        const text = this.getAttribute('text') || '';
        const image = this.getAttribute('image') || '';

        // Verifica se é invertido (definido pelo elemento pai)
        const isInverted = this.hasAttribute('inverted');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    align-items: center;
                    gap: 4rem;
                    margin-bottom: 5rem;
                    width: 100%;
                }

                /* Inverte a ordem se tiver o atributo 'inverted' */
                :host([inverted]) {
                    flex-direction: row-reverse;
                }

                /* Coluna da Imagem */
                .img-wrapper {
                    flex: 1;
                    width: 100%;
                    overflow: hidden;
                    border-radius: 4px;
                }

                .member-img {
                    width: 100%;
                    height: auto;
                    display: block;
                    filter: grayscale(100%);
                    transition: filter 0.3s ease;
                }

                .member-img:hover {
                    filter: grayscale(0%);
                }

                /* Coluna do Texto */
                .info-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .role {
                    color: var(--highlight-color, #fcd22c);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    display: block;
                    font-family: var(--font-text, sans-serif);
                }

                .name {
                    font-family: var(--font-title, serif);
                    font-size: 2rem;
                    color: var(--color-text-primary, var(--color-white, #fff));
                    margin: 0 0 1rem 0;
                    font-weight: 400;
                }

                .text {
                    color: var(--text-color-secondary, #a1a1aa);
                    font-size: 1rem;
                    line-height: 1.6;
                    font-family: var(--font-text, sans-serif);
                    margin: 0;
                }

                /* Responsivo */
                @media (max-width: 768px) {
                    :host, :host([inverted]) {
                        flex-direction: column;
                        gap: 2rem;
                        margin-bottom: 4rem;
                    }

                    .name { font-size: 1.75rem; }
                }
            </style>

            <div class="img-wrapper">
                <img class="member-img" src="${image}" alt="${name}">
            </div>
            
            <div class="info-content">
                <span class="role">${role}</span>
                <h3 class="name">${name}</h3>
                <p class="text">${text}</p>
            </div>
        `;
    }
}
customElements.define('team-member', TeamMember);


// --- COMPONENTE 2: A SEÇÃO (Container) ---
class TeamSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupZigZag();
    }

    // Detecta os filhos e aplica a inversão nos pares (0, 2, 4 = normal | 1, 3, 5 = invertido)
    setupZigZag() {
        const slot = this.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', () => {
            const nodes = slot.assignedElements();
            nodes.forEach((node, index) => {
                // Se o índice for ímpar (1, 3, 5...), adiciona atributo 'inverted'
                if (index % 2 !== 0) {
                    node.setAttribute('inverted', '');
                } else {
                    node.removeAttribute('inverted');
                }
            });
        });
    }

    render() {
        const title = this.getAttribute('title') || 'Quem Assina';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 6rem 0;
                    background-color: var(--bg-section-main, #161616);
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 5%;
                }

                .header {
                    text-align: center;
                    margin-bottom: 5rem;
                }

                .header h2 {
                    font-family: var(--font-title, serif);
                    font-size: clamp(2rem, 4vw, 3rem);
                    text-transform: uppercase;
                    color: var(--color-text-primary, var(--color-white, #fff));
                    margin: 0 0 1rem 0;
                }

                .divider {
                    height: 2px;
                    width: 60px;
                    background: var(--highlight-color, #fcd22c);
                    margin: 0 auto;
                }
            </style>

            <div class="container">
                <div class="header">
                    <h2>${title}</h2>
                    <div class="divider"></div>
                </div>

                <slot></slot>
            </div>
        `;
    }
}
customElements.define('team-section', TeamSection);
