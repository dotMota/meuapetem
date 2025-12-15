class HeroManual extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Manual Start';
        const subtitle = this.getAttribute('subtitle') || '';

        this.shadowRoot.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400&display=swap');

            :host { 
                display: block; 
                position: relative; 
                height: 90vh; /* Um pouco menor que a home para leitura */
                width: 100%; 
                overflow: hidden; 
                background-color: #050505;
            }

            /* --- BACKGROUND GRID (Identidade Visual) --- */
            .grid-pattern {
                position: absolute; inset: -50%; width: 200%; height: 200%;
                background-size: 60px 60px;
                background-image:
                    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                transform: perspective(500px) rotateX(20deg);
                opacity: 0.4;
                mask-image: radial-gradient(circle, black 40%, transparent 80%);
            }

            /* --- LUZ AMBIENTE --- */
            .glow {
                position: absolute; top: -10%; left: 50%;
                width: 60vw; height: 60vw;
                background: radial-gradient(circle, var(--highlight-color, #FF6F61) 0%, transparent 70%);
                opacity: 0.12; filter: blur(80px);
                transform: translateX(-50%);
            }

            /* --- CONTEÚDO --- */
            .content {
                position: relative; z-index: 10; height: 100%;
                display: flex; flex-direction: column; justify-content: center;
                padding: 0 5%; max-width: 1200px; margin: 0 auto;
            }

            h1 {
                font-family: 'Space Grotesk', sans-serif; 
                font-size: clamp(3.5rem, 6vw, 5.5rem);
                color: #fff; line-height: 1.1; margin: 0 0 1.5rem 0;
                letter-spacing: -2px;
                opacity: 0; animation: fadeUp 1s ease 0.3s forwards;
            }

            .subtitle {
                font-family: 'Manrope', sans-serif; 
                font-size: clamp(1.1rem, 1.5vw, 1.3rem); 
                color: #A1A1AA;
                max-width: 600px; line-height: 1.6; margin-bottom: 3rem;
                opacity: 0; animation: fadeUp 1s ease 0.5s forwards;
            }

            /* Highlight na palavra Start se ela existir */
            .highlight { color: var(--highlight-color, #FF6F61); }

            @keyframes fadeUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @media(max-width: 768px) {
                h1 { font-size: 3rem; }
            }
        </style>

        <div class="grid-pattern"></div>
        <div class="glow"></div>
        
        <div class="content">
            <h1>${title}</h1>
            <p class="subtitle">${subtitle}</p>
        </div>
        `;
    }
}
customElements.define('hero-manual', HeroManual);