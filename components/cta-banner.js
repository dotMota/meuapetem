class CtaBanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Precisa de ajuda?';
        const text = this.getAttribute('text') || '';
        const btnText = this.getAttribute('btn-text') || 'Fale Conosco';
        const link = this.getAttribute('link') || '#';

        this.shadowRoot.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap');

            /* RESET IMPORTANTE: Garante que padding não aumente a largura */
            * { box-sizing: border-box; }

            :host {
                display: block;
                background-color: var(--highlight-color, #FF6F61);
                color: var(--color-black, #000);
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
                line-height: 1.2;
            }

            p {
                font-family: var(--font-text, sans-serif);
                font-size: 1.1rem;
                margin: 0;
                max-width: 600px;
                line-height: 1.5;
                font-weight: 500;
            }

            /* Botão */
            .btn {
                background: var(--color-black, #000);
                color: var(--color-white, #fff);
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
                cursor: pointer;
                border: none; /* Remove bordas padrão se houver */
            }

            .btn:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            }

            /* --- MOBILE FIX --- */
            @media (max-width: 768px) {
                :host {
                    padding: 3rem 5%; /* Reduz altura do banner */
                }

                .container {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1.5rem;
                }

                .content {
                    min-width: 100%; /* Garante que o texto ocupe a largura */
                }

                h3 { font-size: 1.6rem; }
                p { font-size: 1rem; }

                .btn {
                    width: 100%; /* Ocupa toda a largura disponível */
                    justify-content: center;
                    padding: 16px 20px; /* Reduz padding interno para não estourar */
                    font-size: 0.95rem;
                }
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
        // Lógica de Interceptação do Clique (Popup)
        const btn = this.shadowRoot.getElementById('ctaBtn');
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Mensagem natural para consultoria geral
            window.dispatchEvent(new CustomEvent('open-contact-popup', {
                detail: { message: "Olá! Estou navegando no site da MeuApêTem e gostaria de ajuda para encontrar o imóvel ideal para mim." }
            }));
        });
    }
}
customElements.define('cta-banner', CtaBanner);
