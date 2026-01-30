class MarqueeScroll extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const slotText = this.textContent.trim();
        const textContent = slotText || 'Experience The Rare';
        // Repetimos o texto 4 vezes para garantir que cubra telas grandes (loop visual)
        const repeatedText = (textContent + ' ').repeat(4);

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    overflow: hidden;
                    background: #000;
                    border-top: 1px solid #222;
                    border-bottom: 1px solid #222;
                    padding: 4rem 0;
                    
                    /* --- VARIÁVEIS DE ESTILO (Padrões) --- */
                    --font-family: sans-serif; 
                    --font-size: 8rem;
                    /* ATUALIZADO: Agora usa a cor de destaque do tema */
                    --stroke-color: var(--highlight-color, #c5a065); 
                }

                .marquee-container {
                    display: flex;
                    width: fit-content;
                    /* Animação linear infinita */
                    animation: scrollText var(--marquee-speed, 30s) linear infinite;
                }

                .marquee-text {
                    font-family: var(--font-family);
                    font-size: var(--font-size);
                    
                    /* Estilo Vazado (Outline) */
                    color: transparent; 
                    -webkit-text-stroke: 1px var(--stroke-color);
                    
                    text-transform: uppercase;
                    white-space: nowrap;
                    line-height: 1;
                }

                @keyframes scrollText {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); } 
                }
            </style>

            <div class="marquee-container">
                <span class="marquee-text">${repeatedText}</span>
                <span class="marquee-text">${repeatedText}</span>
            </div>
        `;
    }
}

customElements.define('marquee-scroll', MarqueeScroll);
