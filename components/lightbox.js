class LightboxViewer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.initEvents();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    --z-index: 10000;
                }

                .overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    backdrop-filter: blur(5px);
                    z-index: var(--z-index);
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; visibility: hidden; pointer-events: none;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                }

                .overlay.active {
                    opacity: 1; visibility: visible; pointer-events: all;
                }

                /* Container da Imagem */
                .img-wrapper {
                    position: relative;
                    max-width: 90vw;
                    max-height: 90vh;
                    transform: scale(0.9);
                    transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
                }

                .overlay.active .img-wrapper {
                    transform: scale(1);
                }

                .full-img {
                    max-width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                    border: 1px solid #333;
                    box-shadow: 0 0 50px rgba(0,0,0,0.8);
                    display: block;
                }

                /* Legenda */
                .caption {
                    color: #fff;
                    font-family: sans-serif;
                    text-align: center;
                    margin-top: 1rem;
                    font-size: 1.2rem;
                    font-weight: 300;
                }

                /* Botão Fechar */
                .close-btn {
                    position: absolute; top: 2rem; right: 2rem;
                    background: none; border: none;
                    color: #fff; font-size: 3rem; cursor: pointer;
                    line-height: 1; transition: transform 0.3s, color 0.3s;
                    z-index: 10;
                }
                .close-btn:hover { color: var(--gold, #c5a065); transform: rotate(90deg); }

                @media (max-width: 768px) {
                    .close-btn { top: 1rem; right: 1rem; font-size: 2.5rem; }
                }
            </style>

            <div class="overlay" id="overlay">
                <button class="close-btn" id="closeBtn">×</button>
                <div class="img-wrapper">
                    <img class="full-img" id="imgDisplay" src="" alt="Full Screen">
                    <div class="caption" id="captionDisplay"></div>
                </div>
            </div>
        `;
    }

    initEvents() {
        const overlay = this.shadowRoot.getElementById('overlay');
        const imgDisplay = this.shadowRoot.getElementById('imgDisplay');
        const captionDisplay = this.shadowRoot.getElementById('captionDisplay');
        const closeBtn = this.shadowRoot.getElementById('closeBtn');

        // Função para fechar
        const close = () => {
            overlay.classList.remove('active');
            // Limpa o src depois da animação para não piscar
            setTimeout(() => { imgDisplay.src = ''; }, 300);
        };

        // Evento Global para Abrir
        window.addEventListener('open-lightbox', (e) => {
            const { src, title } = e.detail;
            if (src) {
                imgDisplay.src = src;
                captionDisplay.textContent = title || '';
                overlay.classList.add('active');
            }
        });

        // Eventos de Fechamento
        closeBtn.onclick = close;
        overlay.onclick = (e) => {
            if (e.target === overlay) close(); // Fecha se clicar fora da foto
        };
        // Fecha com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) close();
        });
    }
}

customElements.define('lightbox-viewer', LightboxViewer);