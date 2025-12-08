class SiteMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpen = false;
    }

    connectedCallback() {
        this.render();
        this.initEvents();
    }

    render() {
        const logo = this.getAttribute('logo') || 'QUARTEN.';
        const menuLabel = this.getAttribute('label-menu') || 'Menu';
        const closeLabel = this.getAttribute('label-close') || 'Fechar';
        const image = this.getAttribute('image') || 'media/boulevart.webp';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 0; left: 0; width: 100%;
                    z-index: 9999; /* Z-Index altíssimo para garantir que fique sobre tudo */
                    
                    /* Efeito de inversão de cor (apenas quando fechado) */
                    mix-blend-mode: difference;
                    color: #fff;
                    font-family: sans-serif;
                    --gold: #c5a065;
                }

                /* CORREÇÃO DO BUG: Quando rola OU quando abre, desliga o blend mode */
                :host(.scrolled),
                :host(.menu-open) {
                    mix-blend-mode: normal !important;
                }

                /* HEADER (Barra Fixa) */
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 2rem 3rem;
                    transition: all 0.4s ease;
                }

                /* Quando rola a página */
                :host(.scrolled) .header {
                    padding: 1.2rem 3rem;
                    background: rgba(20, 10, 15, 0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }

                /* Quando o menu está aberto, o header fica transparente para integrar com o overlay */
                :host(.menu-open) .header {
                    background: transparent;
                    border-bottom: none;
                    box-shadow: none;
                }

                .logo {
                    font-family: serif; font-weight: 700; letter-spacing: 2px;
                    font-size: 1.2rem; text-decoration: none; color: #fff;
                    text-transform: uppercase; cursor: pointer;
                }

                .menu-btn {
                    font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px;
                    cursor: pointer; color: #fff; background: none; border: none;
                    font-family: sans-serif; padding: 10px;
                }

                /* OVERLAY (Menu Aberto) */
                .overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100vh;
                    background: #1a0b12; /* Fundo Sólido */
                    z-index: -1; /* Fica atrás do header (que está dentro do host) */
                    
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    
                    opacity: 0; visibility: hidden;
                    transition: opacity 0.5s ease, visibility 0.5s ease;
                }

                .overlay.open { opacity: 1; visibility: visible; }

                /* Navegação */
                .nav-col {
                    display: flex; flex-direction: column; justify-content: center;
                    padding-left: 10vw; position: relative;
                }

                .close-btn {
                    position: absolute; top: 2rem; right: 4rem;
                    font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px;
                    cursor: pointer; color: #fff; background: none; border: none; z-index: 10;
                }

                /* Imagem Lateral */
                .visual-col {
                    position: relative; height: 100%; overflow: hidden;
                    border-left: 1px solid rgba(255, 255, 255, 0.05);
                }
                .menu-img {
                    width: 100%; height: 100%; object-fit: cover;
                    opacity: 0; transform: scale(1.1);
                    transition: opacity 1s ease, transform 1.5s ease;
                }
                .overlay.open .menu-img { opacity: 1; transform: scale(1); }

                /* Links */
                ::slotted(a) {
                    font-family: serif; font-size: clamp(2rem, 3.5vw, 4rem);
                    color: rgba(255, 255, 255, 0.3); text-decoration: none;
                    transition: color 0.4s, transform 0.3s; cursor: pointer;
                    display: block; margin-bottom: 1.5rem;
                }
                ::slotted(a:hover) { color: #fff; transform: translateX(10px); }

                @media (max-width: 768px) {
                    .header { padding: 1.5rem; }
                    .overlay { grid-template-columns: 1fr; }
                    .visual-col { display: none; }
                    .nav-col { padding-left: 2rem; align-items: flex-start; }
                    .close-btn { right: 1.5rem; top: 1.5rem; }
                }
            </style>

            <header class="header">
                <a class="logo" href="#home">${logo}</a>
                <button class="menu-btn" id="openBtn">${menuLabel}</button>
            </header>

            <div class="overlay" id="menuOverlay">
                <div class="nav-col">
                    <button class="close-btn" id="closeBtn">${closeLabel}</button>
                    <nav id="navLinks"><slot name="links"></slot></nav>
                </div>
                <div class="visual-col">
                    <img src="${image}" class="menu-img" alt="Menu Decor">
                </div>
            </div>
        `;
    }

    initEvents() {
        const overlay = this.shadowRoot.getElementById('menuOverlay');
        const openBtn = this.shadowRoot.getElementById('openBtn');
        const closeBtn = this.shadowRoot.getElementById('closeBtn');
        const linksSlot = this.shadowRoot.querySelector('slot[name="links"]');

        const toggleMenu = () => {
            this.isOpen = !this.isOpen;
            
            if (this.isOpen) {
                overlay.classList.add('open');
                this.classList.add('menu-open'); // Adiciona classe no PAI para desligar o blend-mode
                document.body.style.overflow = 'hidden';
            } else {
                overlay.classList.remove('open');
                this.classList.remove('menu-open'); // Remove classe
                document.body.style.overflow = '';
            }
        };

        openBtn.addEventListener('click', toggleMenu);
        closeBtn.addEventListener('click', toggleMenu);

        // Fecha ao clicar num link
        linksSlot.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') toggleMenu();
        });

        // Scroll Effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) this.classList.add('scrolled');
            else this.classList.remove('scrolled');
        });
    }
}

customElements.define('site-menu', SiteMenu);