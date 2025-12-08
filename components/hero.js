class HeroSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const img = this.getAttribute('image') || '';
        const height = this.getAttribute('height') || '100vh';
        const highlight = this.getAttribute('highlight') || '';
        const subtitle = this.getAttribute('subtitle') || '';
        const title = this.getAttribute('title') || '';
        const text = this.getAttribute('text') || '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    height: ${height};
                    position: relative;
                    overflow: hidden;
                    
                    /* SEMÂNTICA: Usa a cor de fundo global */
                    background-color: var(--bg-page-body, #050505); 
                    
                    /* Mapeamento Interno */
                    --font-h: var(--font-display, serif);
                    --font-p: var(--font-body, sans-serif);
                    --color-hl: var(--color-highlight, #c5a065);
                    --color-txt: var(--color-text-primary, #fff);
                }

                .bg {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    object-fit: cover; z-index: 0;
                    filter: brightness(0.6);
                    pointer-events: none;
                    user-select: none;
                }

                .content {
                    position: relative; z-index: 1; height: 100%;
                    display: flex; flex-direction: column;
                    justify-content: center; align-items: center;
                    text-align: center; 
                    color: var(--color-txt); 
                    padding: 0 5%;
                    cursor: default;
                }

                .hl {
                    color: var(--color-hl);
                    font-family: var(--font-p);
                    text-transform: uppercase; letter-spacing: 4px;
                    font-size: 0.8rem; font-weight: 600;
                    margin-bottom: 1rem; display: block;
                    user-select: none; 
                }

                .sub {
                    font-family: var(--font-h);
                    font-size: 1.2rem; letter-spacing: 2px;
                    text-transform: uppercase; margin-bottom: 0.5rem; display: block;
                    user-select: none;
                }

                .tt {
                    font-family: var(--font-h);
                    font-size: clamp(3rem, 8vw, 6rem);
                    margin: 0 0 1.5rem 0; line-height: 1; font-weight: 400;
                    text-decoration: none; pointer-events: none; user-select: none;
                }

                .txt {
                    font-family: var(--font-p);
                    font-size: 1.1rem; max-width: 600px;
                    line-height: 1.6; 
                    color: var(--color-txt); 
                    opacity: 0.9;
                    font-weight: 300; margin: 0;
                    cursor: default;
                }
            </style>

            <img class="bg" src="${img}" alt="Hero Background">
            
            <div class="content">
                <span class="hl">${highlight}</span>
                <span class="sub">${subtitle}</span>
                <h1 class="tt">${title}</h1>
                <p class="txt">${text}</p>
            </div>
        `;
    }
}
customElements.define('hero-section', HeroSection);