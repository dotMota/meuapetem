class CookieBanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // Se já aceitou, nem renderiza
        if (localStorage.getItem('cookies-accepted')) return;

        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed; bottom: 2rem; left: 2rem; right: 2rem; z-index: 9990;
                    display: flex; justify-content: center;
                    font-family: sans-serif;
                }
                .banner {
                    background: rgba(20, 20, 20, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1.5rem;
                    border-radius: 4px;
                    max-width: 500px;
                    display: flex; flex-direction: column; gap: 1rem;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    animation: slideUp 0.5s ease-out;
                }
                .text { color: #ccc; font-size: 0.85rem; line-height: 1.5; margin: 0; }
                .actions { display: flex; gap: 1rem; align-items: center; }
                
                .btn-accept {
                    background: #c5a065; color: #000; border: none;
                    padding: 0.8rem 2rem; text-transform: uppercase; font-size: 0.75rem;
                    font-weight: bold; letter-spacing: 1px; cursor: pointer;
                    transition: 0.3s; flex: 1;
                }
                .btn-accept:hover { background: #fff; }

                .btn-close {
                    background: transparent; border: 1px solid #333; color: #888;
                    padding: 0.8rem; cursor: pointer; text-transform: uppercase; font-size: 0.7rem;
                }
                .btn-close:hover { color: #fff; border-color: #fff; }

                @media (max-width: 768px) {
                    :host { left: 1rem; right: 1rem; bottom: 1rem; }
                }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            </style>

            <div class="banner" id="banner">
                <p class="text">
                    Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de privacidade.
                </p>
                <div class="actions">
                    <button class="btn-close" id="deny">Fechar</button>
                    <button class="btn-accept" id="accept">Concordar e Continuar</button>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById('accept').onclick = () => {
            localStorage.setItem('cookies-accepted', 'true');
            this.remove();
        };
        this.shadowRoot.getElementById('deny').onclick = () => {
            this.remove();
        };
    }
}
customElements.define('cookie-banner', CookieBanner);