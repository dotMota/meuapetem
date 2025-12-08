// --- COMPONENTE 1: O MEMBRO (Slide Individual) ---
class TeamMember extends HTMLElement {
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
                    display: none; /* Escondido por padrão */
                    width: 100%;
                    opacity: 0;
                    transition: opacity 1s ease;
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

                /* --- COLUNA ESQUERDA: TEXTO --- */
                .info-content {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                /* Estilo dos Slots de Texto */
                ::slotted([slot="role"]) {
                    font-size: 0.75rem;
                    color: #a0a0a0;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    margin-bottom: 1rem;
                    display: block;
                    border-left: 1px solid #c5a065; /* Linha dourada vertical */
                    padding-left: 15px;
                    font-family: sans-serif;
                }

                ::slotted([slot="name"]) {
                    font-size: 2.2rem;
                    font-family: serif;
                    color: #c5a065; /* Dourado */
                    margin: 0 0 1.5rem 0;
                    line-height: 1.2;
                    font-weight: 400;
                }

                ::slotted([slot="text"]) {
                    font-size: 1rem;
                    color: #ccc;
                    line-height: 1.8;
                    font-family: sans-serif;
                    font-weight: 300;
                    max-width: 90%;
                }

                /* --- COLUNA DIREITA: IMAGEM --- */
                .img-wrapper {
                    height: 500px;
                    width: 100%;
                    overflow: hidden;
                    position: relative;
                    border: 1px solid rgba(197, 160, 101, 0.2);
                }

                ::slotted([slot="image"]) {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    filter: grayscale(100%); /* Começa preto e branco */
                    transform: scale(1);
                    transition: filter 1.5s ease, transform 1.5s ease;
                    display: block;
                }

                /* Efeito quando ativa: Fica colorido e dá um zoom leve */
                :host([active]) ::slotted([slot="image"]) {
                    filter: grayscale(0%);
                    transform: scale(1.05);
                }

                /* RESPONSIVO */
                @media (max-width: 768px) {
                    .slide-grid { 
                        grid-template-columns: 1fr; 
                        gap: 2rem; 
                        min-height: auto;
                    }
                    .img-wrapper { 
                        height: 350px; 
                        order: -1; /* Imagem vai para cima no celular */
                    }
                    .info-content { padding-right: 0; }
                }
            </style>

            <div class="slide-grid">
                <div class="info-content">
                    <slot name="role"></slot>
                    <slot name="name"></slot>
                    <slot name="text"></slot>
                </div>
                <div class="img-wrapper">
                    <slot name="image"></slot>
                </div>
            </div>
        `;
    }
}
customElements.define('team-member', TeamMember);


// --- COMPONENTE 2: A SEÇÃO (Controlador) ---
class TeamSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentIndex = 0;
        this.timer = null;
        this.duration = 8000; // 8 segundos por slide
    }

    connectedCallback() {
        this.render();
        this.initCarousel();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: #0f0f0f;
                    padding: 8rem 10%;
                    border-top: 1px solid #222;
                    overflow: hidden;
                    --gold: #c5a065;
                }

                /* CABEÇALHO */
                .header {
                    margin-bottom: 4rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 2rem;
                }
                ::slotted([slot="highlight"]) {
                    color: var(--gold); text-transform: uppercase; letter-spacing: 4px; 
                    font-size: 0.7rem; display: block; margin-bottom: 0.5rem; font-family: sans-serif;
                }
                ::slotted([slot="title"]) {
                    font-family: serif; font-size: 3rem; margin: 0; color: #fff; line-height: 1.1; font-weight: 400;
                }

                /* ÁREA DOS SLIDES */
                .slides-container {
                    position: relative;
                    min-height: 500px;
                }

                /* BARRA DE PROGRESSO */
                .progress-track {
                    position: absolute;
                    bottom: -3rem; left: 0;
                    height: 1px; width: 100%;
                    background: #333;
                }
                .progress-bar {
                    height: 100%;
                    background: var(--gold);
                    width: 0%;
                    /* A animação é controlada pelo JS resetando a classe */
                }
                .progress-bar.animating {
                    width: 100%;
                    transition: width 8s linear; /* Tempo igual ao duration */
                }

                @media (max-width: 768px) {
                    :host { padding: 4rem 5%; }
                    .slides-container { min-height: auto; }
                    ::slotted([slot="title"]) { font-size: 2.5rem; }
                }
            </style>

            <div class="wrapper">
                <div class="header">
                    <slot name="highlight"></slot>
                    <slot name="title"></slot>
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

            // Função para trocar o slide
            const showSlide = (index) => {
                // 1. Reseta todos
                items.forEach(el => el.removeAttribute('active'));
                
                // 2. Ativa o atual
                this.currentIndex = index % items.length;
                items[this.currentIndex].setAttribute('active', '');

                // 3. Reinicia a Barra de Progresso (Truque do Reflow)
                bar.classList.remove('animating');
                bar.style.width = '0%';
                void bar.offsetWidth; // Força o navegador a redesenhar (Reflow)
                bar.classList.add('animating');
            };

            // Inicia o primeiro
            showSlide(0);

            // Loop Automático
            this.timer = setInterval(() => {
                showSlide(this.currentIndex + 1);
            }, this.duration);
        });
    }
}
customElements.define('team-section', TeamSection);