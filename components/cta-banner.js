class CtaBanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Precisa de ajuda?';
        const text = this.getAttribute('text') || '';
        const btnText = this.getAttribute('btn-text') || 'Fale Conosco';
        // Mantemos o atributo link como fallback visual, mas o clique será interceptado
        const link = this.getAttribute('link') || '#';

        this.shadowRoot.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap');

            :host {
                display: block;
                background-color: var(--highlight-color, #FF6F61);
                color: #000; /* Contraste preto no coral */
                padding: 4rem 5%;
            }

            .container {
                max-width: 1400px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 2rem;
            }

            .content {
                flex: 1;
                min-width: 300px;
            }

            h3 {
                font-family: var(--font-title, 'Space Grotesk', sans-serif);
                font-size: 2rem;
                margin: 0 0 1rem 0;
                font-weight: 700;
                letter-spacing: -0.5px;
            }

            p {
                font-family: var(--font-text, sans-serif);
                font-size: 1.1rem;
                margin: 0;
                max-width: 600px;
                line-height: 1.5;
                font-weight: 500;
            }

            /* Botão Estilo "Pílula" Invertida */
            .btn {
                background: #000;
                color: #fff;
                padding: 18px 40px;
                border-radius: 50px;
                font-family: var(--font-text, sans-serif);
                font-weight: 700;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                white-space: nowrap;
                cursor: pointer; /* Garante cursor de clique */
            }

            .btn:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            }

            @media (max-width: 768px) {
                .container { flex-direction: column; align-items: flex-start; }
                .btn { width: 100%; justify-content: center; }
            }
        </style>

        <div class="container">
            <div class="content">
                <h3>${title}</h3>
                <p>${text}</p>
            </div>
            
            <a href="${link}" class="btn" id="ctaBtn">
                ${btnText}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
        </div>
        `;

        // LÓGICA DE INTERCEPTAÇÃO
        const btn = this.shadowRoot.getElementById('ctaBtn');

        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Impede de ir para o href (WhatsApp)
            // Dispara o evento que o contact.js está ouvindo
            window.dispatchEvent(new CustomEvent('open-contact-popup'));
        });
    }
}
customElements.define('cta-banner', CtaBanner);