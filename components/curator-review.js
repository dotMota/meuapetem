class CuratorReview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // Dados do Projeto
        const phrases = ["Alma", "Vida"];
        const attrPhrases = this.getAttribute('phrases');
        const attrCurator = this.getAttribute('curator') || 'Equipe MeuApêTem';
        const attrPros = this.getAttribute('pros') || '';
        const attrCons = this.getAttribute('cons') || '';

        if (!this.querySelector('[slot="curator-name"]') && attrCurator) {
            const span = document.createElement('span');
            span.setAttribute('slot', 'curator-name');
            span.textContent = attrCurator;
            this.appendChild(span);
        }
        if (!this.querySelector('[slot="prefix"]')) {
            const span = document.createElement('span');
            span.setAttribute('slot', 'prefix');
            span.textContent = 'Conceito do Imóvel';
            this.appendChild(span);
        }
        if (!this.querySelector('[slot="avatar"]')) {
            const img = document.createElement('img');
            img.setAttribute('slot', 'avatar');
            img.src = '../media/utils/perfilcrop.png';
            img.alt = 'Curador';
            this.appendChild(img);
        }
        if (!this.querySelector('[slot="pros"]') && attrPros) {
            const span = document.createElement('span');
            span.setAttribute('slot', 'pros');
            span.textContent = attrPros;
            this.appendChild(span);
        }
        if (!this.querySelector('[slot="cons"]') && attrCons) {
            const span = document.createElement('span');
            span.setAttribute('slot', 'cons');
            span.textContent = attrCons;
            this.appendChild(span);
        }
        if (!this.querySelector('[slot="phrases"]') && attrPhrases) {
            let parsed = [];
            try { parsed = JSON.parse(attrPhrases); } catch (e) { parsed = []; }
            const container = document.createElement('div');
            container.setAttribute('slot', 'phrases');
            container.innerHTML = parsed.map((p) => `<span>${p}</span>`).join('');
            this.appendChild(container);
        }

        const curatorName = this.querySelector('[slot="curator-name"]')?.textContent?.trim() || 'Equipe MeuApêTem';
        const pros = this.querySelector('[slot="pros"]')?.textContent?.trim() || '';
        const cons = this.querySelector('[slot="cons"]')?.textContent?.trim() || '';
        // Cores (Puxa do CSS Global ou usa padrão)
        const brandColor = 'var(--color-highlight, #c5a065)';
        const accentColor = '#FF6F61'; // Coral Vivo da Marca Mãe

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                padding: 6rem 5%;
                background: #0a0a0a;
                position: relative;
                overflow: hidden;
            }

            /* Fundo Tipográfico Decorativo (Disruptivo) */
            .bg-deco {
                position: absolute;
                top: -10%; left: -5%;
                font-family: var(--font-title, sans-serif);
                font-size: 15rem;
                opacity: 0.03;
                color: #fff;
                white-space: nowrap;
                pointer-events: none;
                z-index: 0;
            }

            .container {
                position: relative;
                z-index: 1;
                max-width: 1200px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4rem;
                align-items: center;
            }

            /* Lado Esquerdo: O Jogo de Palavras */
            .wordplay-area h2 {
                font-family: var(--font-title, sans-serif);
                font-size: clamp(2.5rem, 5vw, 4rem);
                color: #fff;
                line-height: 1.1;
                margin-bottom: 1rem;
            }

            .dynamic-wrapper {
                display: block;
                color: ${brandColor}; /* Cor do Projeto (Dourado) */
                min-height: 1.2em;
            }
            
            .prefix {
                font-size: 1.5rem;
                color: #666;
                display: block;
                margin-bottom: 0.5rem;
                font-family: var(--font-text, sans-serif);
                text-transform: uppercase;
                letter-spacing: 3px;
            }
            ::slotted([slot="prefix"]) {
                font-size: 1.5rem;
                color: #666;
                display: block;
                margin-bottom: 0.5rem;
                font-family: var(--font-text, sans-serif);
                text-transform: uppercase;
                letter-spacing: 3px;
            }

            /* Lado Direito: Transparência Radical (Review) */
            .review-card {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.1);
                padding: 3rem;
                border-radius: 4px; /* Borda reta = mais brutalista/moderno */
                position: relative;
            }
            
            /* Detalhe da Marca Mãe (Coral) */
            .review-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0;
                width: 4px; height: 100%;
                background: ${accentColor};
            }

            .curator-header {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 2rem;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                padding-bottom: 1.5rem;
            }

            .curator-avatar {
                width: 50px; height: 50px;
                border-radius: 50%;
                background: #333;
                object-fit: cover;
            }
            ::slotted([slot="avatar"]) {
                width: 50px; height: 50px;
                border-radius: 50%;
                background: #333;
                object-fit: cover;
            }

            .curator-info h4 { margin: 0; color: #fff; font-family: var(--font-text); font-size: 1.1rem; }
            .curator-info span { color: #888; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }

            .verdict-grid {
                display: grid;
                gap: 1.5rem;
            }

            .verdict-item strong {
                display: block;
                font-family: var(--font-title);
                font-size: 1.2rem;
                margin-bottom: 0.5rem;
            }
            
            .verdict-item.love strong { color: ${brandColor}; } /* Dourado */
            .verdict-item.know strong { color: ${accentColor}; } /* Coral (Atenção) */

            .verdict-item p {
                color: #ccc;
                font-family: var(--font-text);
                font-size: 0.95rem;
                line-height: 1.6;
                margin: 0;
            }

            /* Cursor Piscante */
            .cursor {
                display: inline-block;
                width: 3px; height: 1em;
                background: ${brandColor};
                animation: blink 1s infinite;
                vertical-align: middle;
                margin-left: 5px;
            }
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

            @media (max-width: 900px) {
                .container { grid-template-columns: 1fr; }
                .bg-deco { font-size: 8rem; top: 0; }
            }
            ::slotted([slot="phrases"]) { display: none; }
        </style>

        <div class="bg-deco">MEUAPÊTEM</div>

        <div class="container">
            <div class="wordplay-area">
                <slot name="prefix"></slot>
                <h2>
                    MeuApêTem...<br>
                    <span class="dynamic-wrapper">
                        <span id="typewriter"></span><span class="cursor"></span>
                    </span>
                </h2>
            </div>

            <div class="review-card">
                <div class="curator-header">
                    <slot name="avatar"></slot>
                    <div class="curator-info">
                        <h4>${curatorName}</h4>
                        <span>Curadoria Oficial</span>
                    </div>
                </div>

                <div class="verdict-grid">
                    <div class="verdict-item love">
                        <strong>O que amamos (Highlight)</strong>
                        <p>${pros}</p>
                    </div>

                    <div class="verdict-item know">
                        <strong>O que você precisa saber (Real Talk)</strong>
                        <p>${cons}</p>
                    </div>
                </div>
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

        // Lógica de Digitação
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

            let typeSpeed = isDeleting ? 30 : 80;

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2500; // Leitura
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }
}
customElements.define('curator-review', CuratorReview);
