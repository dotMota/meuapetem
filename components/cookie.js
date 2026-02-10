class CookieBanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        if (localStorage.getItem('cookies-accepted')) return;

        const isInSubfolder = window.location.pathname.includes('/projects/');
        const linkPath = isInSubfolder ? '../politica.html' : './politica.html';

        this.render(linkPath);
    }

    render(linkPath) {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed; bottom: 2rem; left: 2rem; right: 2rem; z-index: 9990;
                    display: flex; justify-content: center;
                    font-family: 'Manrope', sans-serif;
                }
                .banner {
                    background: rgba(15, 15, 15, 0.98);
                    backdrop-filter: blur(12px);
                    border: 1px solid var(--color-highlight, #FF6F61);
                    padding: 1.5rem;
                    border-radius: 8px;
                    max-width: 600px;
                    display: flex; flex-direction: column; gap: 1rem;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
                    animation: slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .text { color: #ccc; font-size: 0.85rem; line-height: 1.6; margin: 0; }
                
                .text strong { color: #fff; }

                .text a {
                    color: var(--color-highlight, #FF6F61);
                    text-decoration: underline;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .text a:hover { color: #fff; }

                .actions { display: flex; gap: 1rem; align-items: center; margin-top: 0.5rem; }
                
                .btn-accept {
                    background: var(--color-highlight, #FF6F61); color: #000; border: none;
                    padding: 1rem 2rem; text-transform: uppercase; font-size: 0.8rem;
                    font-weight: 700; letter-spacing: 1px; cursor: pointer;
                    transition: all 0.3s; flex: 1; border-radius: 4px;
                }
                .btn-accept:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 111, 97, 0.3); }

                .btn-close {
                    background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #888;
                    padding: 1rem; cursor: pointer; text-transform: uppercase; font-size: 0.75rem;
                    border-radius: 4px; transition: 0.3s;
                }
                .btn-close:hover { color: #fff; border-color: #fff; }

                @media (max-width: 768px) {
                    :host { left: 1rem; right: 1rem; bottom: 1rem; }
                    .banner { padding: 1.2rem; }
                    .actions { flex-direction: column-reverse; }
                    .btn-accept, .btn-close { width: 100%; }
                }
                @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            </style>

            <div class="banner" id="banner">
                <p class="text">
                    <strong>Sua experiência é nossa prioridade.</strong><br>
                    Utilizamos cookies e monitoramento de sessão para entender como você navega e melhorar nossos serviços. 
                    Nenhum dado bancário ou sensível é gravado. Ao continuar, você concorda com nossa 
                    <a href="${linkPath}">Política de Transparência</a>.
                </p>
                <div class="actions">
                    <button class="btn-close" id="deny">Apenas Navegar</button>
                    <button class="btn-accept" id="accept">Concordar e Continuar</button>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById('accept').onclick = () => {
            localStorage.setItem('cookies-accepted', 'true');
            window.dispatchEvent(new CustomEvent('cookies-accepted'));
            this.remove();
        };

        this.shadowRoot.getElementById('deny').onclick = () => {
            // Fecha mas não salva o aceite, então vai aparecer de novo na próxima sessão
            this.remove();
        };
    }
}
customElements.define('cookie-banner', CookieBanner);