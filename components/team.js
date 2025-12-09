// --- COMPONENTE 1: O MEMBRO (Slide Individual) ---
class TeamMember extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const role = this.getAttribute('role') || '';
        const name = this.getAttribute('name') || '';
        const text = this.getAttribute('text') || '';
        const image = this.getAttribute('image') || '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: none;
                    width: 100%;
                    opacity: 0;
                    transition: opacity 0.8s ease;
                }
                :host([active]) {
                    display: block;
                    opacity: 1;
                }

                .slide-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6rem;
                    align-items: center;
                    min-height: 500px;
                }

                /* ESQUERDA: TEXTO */
                .info-content {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .role {
                    font-size: 0.75rem; 
                    color: var(--text-color-muted, #a0a0a0); 
                    text-transform: uppercase; letter-spacing: 3px;
                    margin-bottom: 1rem; display: block;
                    border-left: 1px solid var(--highlight-color, #c5a065); 
                    padding-left: 15px; font-family: var(--font-text, sans-serif);
                }

                .name {
                    font-size: 2.5rem; 
                    font-family: var(--font-title, serif); 
                    color: var(--highlight-color, #c5a065);
                    margin: 0 0 1.5rem 0; line-height: 1.1; font-weight: 400;
                }

                .text {
                    font-size: 1rem; 
                    color: var(--text-color, #ccc); 
                    line-height: 1.8;
                    font-family: var(--font-text, sans-serif); 
                    font-weight: 300; max-width: 90%;
                }

                /* DIREITA: IMAGEM */
                .img-wrapper {
                    width: 100%;
                    /* --- ALTERAÇÃO AQUI: FORÇA QUADRADO --- */
                    aspect-ratio: 1 / 1; 
                    height: auto; /* Remove altura fixa para respeitar a proporção */
                    /* -------------------------------------- */
                    overflow: hidden; position: relative;
                    border: 1px solid rgba(197, 160, 101, 0.2);
                }

                .member-img {
                    width: 100%; height: 100%; 
                    object-fit: cover;
                    /* --- AJUSTE PARA PESSOAS (Foca no Rosto) --- */
                    object-position: top center; 
                    
                    filter: grayscale(100%); transform: scale(1);
                    transition: filter 1.5s ease, transform 1.5s ease;
                    display: block;
                }

                :host([active]) .member-img {
                    filter: grayscale(0%); transform: scale(1.05);
                }

                @media (max-width: 768px) {
                    .slide-grid { grid-template-columns: 1fr; gap: 3rem; }
                    /* Remove altura fixa no mobile também, mantendo quadrado */
                    .img-wrapper { order: -1; aspect-ratio: 1 / 1; height: auto; }
                    .info-content { padding-right: 0; }
                }
            </style>

            <div class="slide-grid">
                <div class="info-content">
                    <span class="role">${role}</span>
                    <h3 class="name">${name}</h3>
                    <p class="text">${text}</p>
                </div>
                <div class="img-wrapper">
                    <img class="member-img" src="${image}" alt="${name}">
                </div>
            </div>
        `;
    }
}
customElements.define('team-member', TeamMember);


// --- COMPONENTE 2: A SEÇÃO (Container - Sem alterações) ---
class TeamSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentIndex = 0;
        this.timer = null;
        this.duration = 8000;
    }

    connectedCallback() {
        this.render();
        this.initCarousel();
    }

    render() {
        const highlight = this.getAttribute('highlight') || '';
        const title = this.getAttribute('title') || '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--bg-color, #0f0f0f);
                    padding: 8rem 10%;
                    border-top: 1px solid #222;
                    --gold: var(--highlight-color, #c5a065);
                }

                .header {
                    margin-bottom: 4rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 2rem;
                }
                .hl {
                    color: var(--gold); text-transform: uppercase; letter-spacing: 4px; 
                    font-size: 0.7rem; display: block; margin-bottom: 0.5rem; font-family: var(--font-text, sans-serif);
                }
                .tt {
                    font-family: var(--font-title, serif); font-size: 3rem; margin: 0; 
                    color: #fff; line-height: 1.1; font-weight: 400;
                }

                .slides-container {
                    position: relative;
                    min-height: 500px;
                    display: flex;
                    flex-direction: column;
                }

                .progress-track {
                    position: relative;
                    width: calc(50% - 3rem); 
                    height: 1px;
                    background: #333;
                    margin-top: 2rem;
                }
                
                .progress-bar {
                    height: 100%;
                    background: var(--gold);
                    width: 0%;
                }

                @media (max-width: 768px) {
                    :host { padding: 4rem 5%; }
                    .slides-container { min-height: auto; }
                    .progress-track { width: 100%; margin-top: 2rem; }
                }
            </style>

            <div class="wrapper">
                <div class="header">
                    <span class="hl">${highlight}</span>
                    <h2 class="tt">${title}</h2>
                </div>

                <div class="slides-container">
                    <slot name="members"></slot>
                    <div class="progress-track">
                        <div class="progress-bar" id="bar"></div>
                    </div>
                </div>
            </div>
        `;
    }

    initCarousel() {
        const slot = this.shadowRoot.querySelector('slot[name="members"]');
        const bar = this.shadowRoot.getElementById('bar');

        slot.addEventListener('slotchange', () => {
            const items = slot.assignedElements();
            if (!items.length) return;

            const showSlide = (index) => {
                items.forEach(el => el.removeAttribute('active'));
                this.currentIndex = index % items.length;
                items[this.currentIndex].setAttribute('active', '');

                bar.style.transition = 'none';
                bar.style.width = '0%';
                void bar.offsetWidth;
                bar.style.transition = `width ${this.duration}ms linear`;
                bar.style.width = '100%';
            };

            showSlide(0);

            if (this.timer) clearInterval(this.timer);
            this.timer = setInterval(() => {
                showSlide(this.currentIndex + 1);
            }, this.duration);
        });
    }
}
customElements.define('team-section', TeamSection);