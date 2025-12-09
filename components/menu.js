class SiteMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpen = false;
    }

    connectedCallback() {
        const logoText = this.getAttribute('logo') || '';
        const parentText = this.getAttribute('parent-text') || '';
        const parentLink = this.getAttribute('parent-link') || '';
        const image = this.getAttribute('image') || null;

        this.shadowRoot.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap');

            * { box-sizing: border-box; margin: 0; padding: 0; }

            :host {
                position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
                height: 90px;
                display: block;
            }

            /* --- FUNDO DA BARRA (COR DINÂMICA) --- */
            .nav-bg {
                position: absolute; inset: 0;
                background: transparent;
                backdrop-filter: blur(0px);
                border-bottom: 1px solid transparent;
                transition: all 0.4s ease;
                z-index: 0;
            }

            :host(.scrolled) .nav-bg {
                /* AQUI ESTÁ A CORREÇÃO: Usa a variável da marca (Vinho ou Preto) */
                background: var(--bg-brand-dark, #050505);
                opacity: 0.95; /* Leve transparência */
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .nav-container {
                position: relative; z-index: 1;
                width: 100%; height: 100%; padding: 0 5%;
                display: flex; justify-content: space-between; align-items: center;
                max-width: 100vw;
            }

            /* Branding */
            .brand-group { display: flex; align-items: center; gap: 15px; }

            .brand-main {
                font-family: var(--font-title, serif);
                font-size: 1.4rem; font-weight: 700; color: #fff;
                text-decoration: none; letter-spacing: 1px; white-space: nowrap;
            }

            .divider { font-size: 1.4rem; color: rgba(255,255,255,0.3); font-weight: 300; }

            .brand-parent {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 1.1rem; font-weight: 700; 
                color: var(--highlight-color, #FF6F61);
                text-decoration: none; transition: opacity 0.3s; white-space: nowrap;
            }
            .brand-parent:hover { opacity: 0.8; }

            /* Botão Menu */
            .menu-btn {
                background: transparent;
                border: 1px solid rgba(255,255,255,0.3);
                color: #fff;
                padding: 10px 25px;
                border-radius: 50px;
                font-family: var(--font-text, sans-serif);
                font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px;
                cursor: pointer; transition: all 0.3s ease; font-weight: 600;
            }
            .menu-btn:hover { background: #fff; color: #000; border-color: #fff; }

            /* --- OVERLAY (MENU ABERTO) --- */
            .overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                /* Fundo também usa a cor da marca */
                background: var(--bg-brand-dark, #050505);
                z-index: -1;
                padding-top: 90px;
                
                display: grid;
                grid-template-columns: 1fr 1fr;
                
                opacity: 0; visibility: hidden; pointer-events: none;
                transition: opacity 0.4s ease, visibility 0.4s;
                
                overflow-x: hidden;
                overflow-y: auto; /* Permite rolar se necessário */
                
                /* Esconde a barra de rolagem visualmente, mas mantém a função */
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none;  /* IE/Edge */
            }
            .overlay::-webkit-scrollbar { display: none; /* Chrome/Safari */ }

            .overlay.active { opacity: 1; visibility: visible; pointer-events: all; }

            /* Conteúdo */
            .menu-content {
                display: flex; flex-direction: column; 
                justify-content: center; align-items: flex-start;
                padding-left: 10%; width: 100%;
                transform: translateY(20px); transition: transform 0.5s ease;
            }
            .overlay.active .menu-content { transform: translateY(0); }

            /* Imagem */
            .menu-image-wrapper {
                height: 100%; width: 100%;
                position: relative; overflow: hidden;
                border-left: 1px solid rgba(255,255,255,0.1);
                transform: translateX(50px); opacity: 0;
                transition: all 0.6s ease 0.1s;
            }
            .overlay.active .menu-image-wrapper { transform: translateX(0); opacity: 1; }

            .menu-img-full {
                width: 100%; height: 100%; object-fit: cover;
                filter: brightness(0.6) contrast(1.1);
            }

            /* Links */
            .back-link {
                display: inline-flex; align-items: center; gap: 10px;
                font-family: 'Space Grotesk', sans-serif;
                font-size: 1rem; color: var(--highlight-color, #FF6F61);
                text-decoration: none; margin-bottom: 2rem;
                padding: 8px 20px; border: 1px solid currentColor; border-radius: 50px;
                transition: all 0.3s;
            }
            .back-link:hover { background: var(--highlight-color); color: #000; }

            ::slotted(a) {
                font-family: var(--font-title); font-size: 3rem; color: rgba(255,255,255,0.4);
                text-decoration: none; margin: 0; transition: color 0.3s, transform 0.3s;
                display: block; line-height: 1.2;
            }
            ::slotted(a:hover) { color: #fff; transform: translateX(10px); }

            @media (max-width: 900px) {
                .overlay { grid-template-columns: 1fr; }
                .menu-image-wrapper { display: none; }
                .menu-content { align-items: center; padding-left: 0; padding-bottom: 50px; }
                ::slotted(a) { font-size: 2rem; text-align: center; }
                .brand-parent, .divider { display: none; }
            }
        </style>

        <div class="nav-bg"></div>
        
        <div class="nav-container">
            <div class="brand-group">
                <a href="#" class="brand-main">${logoText}</a>
                ${parentText ? `
                    <span class="divider">/</span>
                    <a href="${parentLink}" class="brand-parent">${parentText}</a>
                ` : ''}
            </div>
            <button class="menu-btn" id="toggleBtn">Menu</button>
        </div>

        <div class="overlay" id="overlay">
            <div class="menu-content">
                ${parentLink ? `<a href="${parentLink}" class="back-link">← Voltar para Coleção</a>` : ''}
                <slot name="links"></slot>
            </div>
            <div class="menu-image-wrapper">
                ${image ? `<img src="${image}" class="menu-img-full" alt="Menu Visual">` : ''}
            </div>
        </div>
        `;

        const btn = this.shadowRoot.getElementById('toggleBtn');
        const overlay = this.shadowRoot.getElementById('overlay');

        const toggleMenu = () => {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                overlay.classList.add('active');
                btn.textContent = 'Fechar';
                btn.style.background = '#fff';
                btn.style.color = '#000';

                // Trava Rolagem
                document.documentElement.style.overflow = 'hidden';
                document.body.style.overflow = 'hidden';
            } else {
                overlay.classList.remove('active');
                btn.textContent = 'Menu';
                btn.style.background = '';
                btn.style.color = '';

                // Libera Rolagem
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
            }
        };

        btn.addEventListener('click', toggleMenu);

        this.shadowRoot.querySelector('slot').assignedElements().forEach(link => {
            link.addEventListener('click', () => {
                if (this.isOpen) toggleMenu();
            });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) this.classList.add('scrolled');
            else this.classList.remove('scrolled');
        });
    }
}
customElements.define('site-menu', SiteMenu);