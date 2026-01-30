class HeroBrand extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const phrases = ["Luz Natural", "Espaço para Criar", "Silêncio para Refletir", "Alma", "História"];

        this.shadowRoot.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap');

            :host { 
                display: block; 
                position: relative; 
                height: 95vh; 
                width: 100%; 
                overflow: hidden; 
                background-color: #050505;
                --mouse-x: 0.5;
                --mouse-y: 0.5;
            }

            /* --- CAMADA 1: O GRID VIVO (Deslizando) --- */
            .grid-pattern {
                position: absolute; inset: -50%; width: 200%; height: 200%;
                background-size: 80px 80px;
                background-image:
                    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                
                /* Animação de "viagem" no grid */
                animation: gridMove 60s linear infinite;
                transform: perspective(500px) rotateX(20deg); /* Perspectiva 3D Tech */
                opacity: 0.6;
                mask-image: radial-gradient(circle, black 30%, transparent 70%);
            }

            @keyframes gridMove {
                0% { transform: perspective(500px) rotateX(20deg) translateY(0); }
                100% { transform: perspective(500px) rotateX(20deg) translateY(-80px); }
            }

            /* --- CAMADA 2: LUZ PULSANTE (A Alma) --- */
            .glow-spot {
                position: absolute;
                top: 50%; left: 50%;
                width: 60vw; height: 60vw;
                background: radial-gradient(circle, var(--highlight-color, #FF6F61) 0%, transparent 60%);
                opacity: 0.15;
                filter: blur(100px);
                transform: translate(-50%, -50%) scale(1);
                animation: pulseGlow 8s ease-in-out infinite alternate;
                pointer-events: none;
            }

            @keyframes pulseGlow {
                0% { opacity: 0.1; transform: translate(-50%, -50%) scale(0.9); }
                100% { opacity: 0.25; transform: translate(-50%, -50%) scale(1.1); }
            }

            /* --- CAMADA 3: FORMAS GEOMÉTRICAS (Flutuantes + Parallax) --- */
            .shape {
                position: absolute;
                border: 1px solid rgba(255,255,255,0.1);
                pointer-events: none;
                transition: transform 0.1s linear; /* Suavidade para o mouse */
            }

            .shape-circle {
                width: 500px; height: 500px;
                border-radius: 50%;
                bottom: -150px; left: -100px;
                border-color: rgba(255, 111, 97, 0.3); /* Coral */
                animation: floatCircle 20s infinite linear;
            }

            .shape-square {
                width: 200px; height: 200px;
                top: 15%; right: 20%;
                border: 1px solid rgba(255,255,255,0.15);
                transform: rotate(45deg);
                animation: floatSquare 25s infinite ease-in-out;
            }

            .shape-line {
                width: 2px; height: 300px;
                background: linear-gradient(to bottom, transparent, var(--highlight-color), transparent);
                left: 20%; top: 10%;
                opacity: 0.5;
                animation: floatLine 15s infinite ease-in-out;
            }

            /* Animações Independentes para parecer orgânico */
            @keyframes floatCircle {
                0% { transform: translate(0, 0) rotate(0deg); }
                50% { transform: translate(20px, -20px) rotate(180deg); }
                100% { transform: translate(0, 0) rotate(360deg); }
            }
            @keyframes floatSquare {
                0% { transform: rotate(45deg) translateY(0); }
                50% { transform: rotate(50deg) translateY(-30px); }
                100% { transform: rotate(45deg) translateY(0); }
            }
            @keyframes floatLine {
                0% { transform: translateY(0); height: 300px; }
                50% { transform: translateY(50px); height: 200px; }
                100% { transform: translateY(0); height: 300px; }
            }


            /* --- CONTEÚDO (Texto) --- */
            .content {
                position: relative; z-index: 10; height: 100%;
                display: flex; flex-direction: column; justify-content: center;
                padding: 0 5%; max-width: 1400px; margin: 0 auto;
            }

            .brand-tag, ::slotted([slot="tag"]) {
                color: var(--highlight-color); font-family: var(--font-text);
                font-weight: 700; letter-spacing: 4px; text-transform: uppercase;
                font-size: 0.9rem; margin-bottom: 1.5rem;
                display: flex; align-items: center; gap: 10px;
                opacity: 0; animation: fadeUp 1s ease 0.5s forwards;
            }
            .brand-tag::before { content: ''; width: 40px; height: 2px; background: var(--highlight-color); }

            h1, ::slotted([slot="title"]) {
                font-family: var(--font-title); 
                font-size: clamp(3.5rem, 7vw, 6rem);
                color: #fff; line-height: 1.1; margin: 0 0 2rem 0;
                opacity: 0; animation: fadeUp 1s ease 0.7s forwards;
            }

            .dynamic-wrapper { display: block; min-height: 1.2em; }
            .dynamic-text { color: var(--highlight-color); }

            .cursor {
                display: inline-block; width: 3px; height: 0.8em;
                background: var(--highlight-color); margin-left: 5px;
                animation: blink 1s infinite;
            }
            @keyframes blink { 50% { opacity: 0; } }

            p, ::slotted([slot="text"]) {
                font-family: var(--font-text); font-size: 1.2rem; color: #e0e0e0;
                max-width: 500px; line-height: 1.6; margin-bottom: 3rem;
                opacity: 0; animation: fadeUp 1s ease 0.9s forwards;
            }

            .cta-group, ::slotted([slot="actions"]) { 
                display: flex; gap: 20px; flex-wrap: wrap; 
                opacity: 0; animation: fadeUp 1s ease 1.1s forwards;
            }
            ::slotted([slot="phrases"]) { display: none; }

            .btn {
                padding: 18px 40px; border-radius: 50px; font-weight: 600; text-decoration: none;
                transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;
                font-size: 0.9rem; cursor: pointer; position: relative; overflow: hidden;
            }
            ::slotted(.btn) {
                padding: 18px 40px; border-radius: 50px; font-weight: 600; text-decoration: none;
                transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;
                font-size: 0.9rem; cursor: pointer; position: relative; overflow: hidden;
            }

            .btn-primary { background: var(--highlight-color); color: #000; border: 2px solid var(--highlight-color); }
            .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255, 111, 97, 0.3); }

            .btn-secondary { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.3); }
            .btn-secondary:hover { border-color: #fff; background: rgba(255,255,255,0.1); }
            ::slotted(.btn-primary) { background: var(--highlight-color); color: #000; border: 2px solid var(--highlight-color); }
            ::slotted(.btn-primary:hover) { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255, 111, 97, 0.3); }

            ::slotted(.btn-secondary) { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.3); }
            ::slotted(.btn-secondary:hover) { border-color: #fff; background: rgba(255,255,255,0.1); }

            @keyframes fadeUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @media(max-width: 768px) {
                h1 { font-size: 2.5rem; }
                .shape-circle { width: 300px; height: 300px; left: -50px; }
                .shape-square { width: 100px; height: 100px; top: 10%; right: 10%; }
            }
        </style>

        <div class="grid-pattern"></div>
        <div class="glow-spot"></div>
        
        <div class="shape shape-circle" id="c1"></div>
        <div class="shape shape-square" id="s1"></div>
        <div class="shape shape-line"></div>
        
        <div class="content">
            <slot name="tag"></slot>
            <h1>
                <slot name="title"></slot>
                <span class="dynamic-wrapper">
                    <span id="typewriter" class="dynamic-text"></span><span class="cursor"></span>
                </span>
            </h1>
            <slot name="text"></slot>
            <div class="cta-group">
                <slot name="actions"></slot>
            </div>
        </div>
        <slot name="phrases"></slot>
        `;

        const phrasesSlot = this.querySelector('[slot="phrases"]');
        if (phrasesSlot) {
            const customPhrases = Array.from(phrasesSlot.children)
                .map((node) => node.textContent.trim())
                .filter(Boolean);
            if (customPhrases.length) phrases.splice(0, phrases.length, ...customPhrases);
        }

        // 1. LÓGICA DE DIGITAÇÃO (Typewriter)
        const el = this.shadowRoot.getElementById('typewriter');
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                el.innerText = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                el.innerText = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            let typeSpeed = isDeleting ? 50 : 100;
            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000; isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; typeSpeed = 500;
            }
            setTimeout(type, typeSpeed);
        }
        type();

        // 2. LÓGICA DE PARALLAX (Segue o Mouse)
        const host = this.shadowRoot.host; // O elemento <hero-brand>
        const c1 = this.shadowRoot.getElementById('c1');
        const s1 = this.shadowRoot.getElementById('s1');

        document.addEventListener('mousemove', (e) => {
            // Calcula a posição do mouse relativa ao centro da tela
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            // Move as formas levemente na direção oposta
            if (c1) c1.style.transform = `translate(${x * 2}px, ${y * 2}px) rotate(${x}deg)`;
            if (s1) s1.style.transform = `translate(${x}px, ${y}px) rotate(${45 + x}deg)`;
        });
    }
}
customElements.define('hero-brand', HeroBrand);
