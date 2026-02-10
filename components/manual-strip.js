class ManualStrip extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Dúvidas sobre o Minha Casa Minha Vida?';
        const text = this.getAttribute('text') || 'Juros, Obras e Regras do Jogo. Leia nosso Manual e blinde sua decisão.';
        const cta = this.getAttribute('cta') || 'Ler Guia da Conquista';
        const href = this.getAttribute('href') || '../manual-mcmv.html';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .manual-strip {
                    background: linear-gradient(90deg, rgba(255, 111, 97, 0.1), rgba(20, 20, 20, 0.8));
                    border-left: 2px solid var(--color-highlight, #D4AF37);
                    padding: 1.5rem 2rem;
                    margin: 2rem auto 4rem auto;
                    max-width: 1200px;
                    width: 90%;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                    transition: transform 0.3s ease, background 0.3s ease;
                }

                .manual-strip:hover {
                    transform: translateX(10px);
                    background: linear-gradient(90deg, rgba(255, 111, 97, 0.15), rgba(30, 30, 30, 0.9));
                }

                .manual-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .manual-icon {
                    color: var(--color-highlight, #D4AF37);
                    font-size: 1.5rem;
                }

                .manual-text h3 {
                    margin: 0;
                    font-size: 1rem;
                    font-family: var(--font-title, 'Space Grotesk', sans-serif);
                    color: #fff;
                }

                .manual-text p {
                    margin: 0;
                    font-size: 0.85rem;
                    color: var(--color-text-secondary, #A1A1AA);
                }

                .manual-btn {
                    white-space: nowrap;
                    color: #fff;
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 600;
                    padding: 0.5rem 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    font-family: var(--font-text, 'Manrope', sans-serif);
                }

                .manual-btn:hover {
                    border-color: var(--color-highlight, #D4AF37);
                    color: var(--color-highlight, #D4AF37);
                }

                .manual-arrow {
                    margin-left: 5px;
                    font-size: 0.8em;
                }

                @media (max-width: 768px) {
                    .manual-strip {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                        padding: 1.5rem;
                    }

                    .manual-btn {
                        width: 100%;
                        text-align: center;
                    }
                }
            </style>

            <div class="manual-strip">
                <div class="manual-content">
                    <i class="fas fa-book-reader manual-icon" aria-hidden="true"></i>
                    <div class="manual-text">
                        <h3>${title}</h3>
                        <p>${text}</p>
                    </div>
                </div>
                <a href="${href}" class="manual-btn">${cta} <i class="fas fa-arrow-right manual-arrow" aria-hidden="true"></i></a>
            </div>
        `;
    }
}

customElements.define('manual-strip', ManualStrip);
