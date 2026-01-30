class SiteMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpen = false;
        this.scrollHandler = null;
    }

    connectedCallback() {
        const logoText = this.getAttribute('logo') || '';
        const parentText = this.getAttribute('parent-text') || '';
        const parentLink = this.getAttribute('parent-link') || '';
        const image = this.getAttribute('image') || null;

        if (logoText && !this.querySelector('[slot="logo"]')) {
            const a = document.createElement('a');
            a.setAttribute('slot', 'logo');
            a.href = '#';
            a.textContent = logoText;
            this.appendChild(a);
        }
        if (parentText && !this.querySelector('[slot="parent"]')) {
            const a = document.createElement('a');
            a.setAttribute('slot', 'parent');
            a.href = parentLink || '#';
            a.textContent = parentText;
            this.appendChild(a);
        }
        if (parentLink && !this.querySelector('[slot="back-link"]')) {
            const a = document.createElement('a');
            a.setAttribute('slot', 'back-link');
            a.className = 'back-link';
            a.href = parentLink;
            a.textContent = '← Voltar para Coleção';
            this.appendChild(a);
        }
        if (image && !this.querySelector('[slot="image"]')) {
            const img = document.createElement('img');
            img.setAttribute('slot', 'image');
            img.src = image;
            img.alt = 'Menu Visual';
            this.appendChild(img);
        }

        this.shadowRoot.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap');

            * { box-sizing: border-box; margin: 0; padding: 0; }

            :host {
                position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
                height: 90px;
                display: block;
            }

            .nav-bg {
                position: absolute; inset: 0;
                background: transparent;
                backdrop-filter: blur(0px);
                border-bottom: 1px solid transparent;
                transition: all 0.4s ease;
                z-index: 0;
            }

            :host(.scrolled) .nav-bg {
                background: var(--bg-brand-dark, #050505);
                opacity: 0.95; 
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .nav-container {
                position: relative; z-index: 1;
                width: 100%; height: 100%; padding: 0 5%;
                display: flex; justify-content: space-between; align-items: center;
                max-width: 100vw;
            }

            .brand-group { display: flex; align-items: center; gap: 15px; }

            .brand-main {
                font-family: var(--font-title, serif);
                font-size: 1.4rem; font-weight: 700; color: #fff;
                text-decoration: none; letter-spacing: 1px; white-space: nowrap;
            }
            ::slotted([slot="logo"]) {
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
            ::slotted([slot="parent"]) {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 1.1rem; font-weight: 700; 
                color: var(--highlight-color, #FF6F61);
                text-decoration: none; transition: opacity 0.3s; white-space: nowrap;
            }

            .desktop-links {
                display: none;
                gap: 2rem;
                align-items: center;
            }
            
            .desktop-links a {
                color: rgba(255,255,255,0.7);
                text-decoration: none;
                font-family: var(--font-text, sans-serif);
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 500;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
                padding: 5px 0;
            }
            
            .desktop-links a:hover {
                color: var(--highlight-color, #fff);
                transform: translateY(-2px);
            }

            .desktop-links a.active {
                color: var(--highlight-color, #FF6F61);
                font-weight: 700;
            }
            
            .desktop-links a::after {
                content: ''; position: absolute; bottom: 0; left: 0; 
                width: 0%; height: 2px; 
                background: var(--highlight-color, #FF6F61);
                transition: width 0.3s ease;
            }
            .desktop-links a.active::after { width: 100%; }

            .menu-btn {
                background: transparent;
                border: 1px solid rgba(255,255,255,0.3);
                color: #fff;
                padding: 10px 25px;
                border-radius: 50px;
                font-family: var(--font-text, sans-serif);
                font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px;
                cursor: pointer; transition: all 0.3s ease; font-weight: 600;
                display: block;
            }
            .menu-btn:hover { background: #fff; color: #000; border-color: #fff; }

            @media (min-width: 1024px) {
                .menu-btn { display: none; }
                .desktop-links { display: flex; }
            }

            .overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                background: var(--bg-brand-dark, #050505);
                z-index: -1; padding-top: 90px;
                display: grid; grid-template-columns: 1fr 1fr;
                opacity: 0; visibility: hidden; pointer-events: none;
                transition: opacity 0.4s ease, visibility 0.4s;
                overflow-x: hidden; overflow-y: auto;
            }
            .overlay.active { opacity: 1; visibility: visible; pointer-events: all; }

            .menu-content {
                display: flex; flex-direction: column; 
                justify-content: center; align-items: flex-start;
                padding-left: 10%; width: 100%;
                transform: translateY(20px); transition: transform 0.5s ease;
            }
            .overlay.active .menu-content { transform: translateY(0); }

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
            ::slotted([slot="image"]) {
                width: 100%; height: 100%; object-fit: cover;
                filter: brightness(0.6) contrast(1.1);
                display: block;
            }

            ::slotted(a) {
                font-family: var(--font-title, serif); font-size: 3rem; color: rgba(255,255,255,0.4);
                text-decoration: none; margin: 0; transition: color 0.3s, transform 0.3s;
                display: block; line-height: 1.2;
            }
            
            ::slotted(a.active) {
                color: var(--highlight-color, #FF6F61) !important;
                padding-left: 20px; border-left: 2px solid var(--highlight-color, #FF6F61);
            }
            ::slotted(a:hover) { color: #fff; transform: translateX(10px); }
            
            .back-link {
                display: inline-flex; align-items: center; gap: 10px;
                font-family: 'Space Grotesk', sans-serif;
                font-size: 1rem; color: var(--highlight-color, #FF6F61);
                text-decoration: none; margin-bottom: 2rem;
                padding: 8px 20px; border: 1px solid currentColor; border-radius: 50px;
                transition: all 0.3s;
            }
            ::slotted(.back-link) {
                display: inline-flex; align-items: center; gap: 10px;
                font-family: 'Space Grotesk', sans-serif;
                font-size: 1rem; color: var(--highlight-color, #FF6F61);
                text-decoration: none; margin-bottom: 2rem;
                padding: 8px 20px; border: 1px solid currentColor; border-radius: 50px;
                transition: all 0.3s;
            }

            @media (max-width: 900px) {
                .overlay { grid-template-columns: 1fr; }
                .menu-image-wrapper { display: none; }
                .menu-content { align-items: center; padding-left: 0; padding-bottom: 50px; }
                ::slotted(a) { font-size: 2rem; text-align: center; }
                ::slotted(a.active) { padding-left: 0; border-left: none; color: #fff !important; opacity: 1; }
                .brand-parent, .divider { display: none; }
            }
        </style>

        <div class="nav-bg"></div>
        
        <div class="nav-container">
            <div class="brand-group">
                <slot name="logo"></slot>
                <span class="divider">/</span>
                <slot name="parent"></slot>
            </div>

            <div class="desktop-links" id="desktopNav"></div>

            <button class="menu-btn" id="toggleBtn">Menu</button>
        </div>

        <div class="overlay" id="overlay">
            <div class="menu-content">
                <slot name="back-link"></slot>
                <slot name="links"></slot>
            </div>
            <div class="menu-image-wrapper">
                <slot name="image"></slot>
            </div>
        </div>
        `;

        this.initLogic();
        this.cloneLinksForDesktop();
        this.initAutoClick();

        setTimeout(() => this.initScrollSpy(), 500);
        window.addEventListener('load', () => this.initScrollSpy());

        const parentSlot = this.querySelector('[slot="parent"]');
        const divider = this.shadowRoot.querySelector('.divider');
        if (!parentSlot || !parentSlot.textContent.trim()) {
            if (divider) divider.style.display = 'none';
        }
    }

    initLogic() {
        const btn = this.shadowRoot.getElementById('toggleBtn');
        const overlay = this.shadowRoot.getElementById('overlay');
        const slot = this.shadowRoot.querySelector('slot[name="links"]'); // Pega os links

        const toggleMenu = () => {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                overlay.classList.add('active');
                btn.textContent = 'Fechar';
                btn.style.background = '#fff'; btn.style.color = '#000';
                document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden';
            } else {
                overlay.classList.remove('active');
                btn.textContent = 'Menu';
                btn.style.background = ''; btn.style.color = '';
                document.documentElement.style.overflow = ''; document.body.style.overflow = '';
            }
        };

        btn.addEventListener('click', toggleMenu);

        // --- CORREÇÃO AQUI: FECHAR AO CLICAR ---
        slot.addEventListener('click', (e) => {
            // Se clicar em qualquer link (A) dentro do menu, fecha
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                if (this.isOpen) toggleMenu();
            }
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) this.classList.add('scrolled');
            else this.classList.remove('scrolled');
        });
    }

    cloneLinksForDesktop() {
        const slot = this.shadowRoot.querySelector('slot[name="links"]');
        const desktopContainer = this.shadowRoot.getElementById('desktopNav');

        slot.addEventListener('slotchange', () => {
            const nodes = slot.assignedElements();
            desktopContainer.innerHTML = '';

            nodes.forEach(node => {
                const clone = node.cloneNode(true);
                clone.removeAttribute('slot');
                if (node.hasAttribute('onclick')) clone.onclick = node.onclick;
                desktopContainer.appendChild(clone);
            });

            this.initScrollSpy();
            this.initAutoClick();
        });
    }

    initScrollSpy() {
        const slot = this.shadowRoot.querySelector('slot[name="links"]');
        const mobileLinks = slot ? slot.assignedElements() : [];
        const desktopLinks = Array.from(this.shadowRoot.querySelectorAll('.desktop-links a'));
        const allLinks = [...mobileLinks, ...desktopLinks];

        const targetIds = allLinks
            .map(link => link.getAttribute('href'))
            .filter(href => href && href.startsWith('#') && href.length > 1)
            .map(href => href.substring(1));

        if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);

        this.scrollHandler = () => {
            let currentId = '';

            targetIds.forEach(id => {
                const section = document.getElementById(id);
                if (section) {
                    const sectionTop = section.offsetTop;
                    if (window.scrollY >= (sectionTop - 150)) {
                        currentId = id;
                    }
                }
            });

            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                const lastLink = allLinks.reverse().find(link => {
                    const href = link.getAttribute('href');
                    return href && href.startsWith('#');
                });
                if (lastLink) currentId = lastLink.getAttribute('href').substring(1);
            }

            allLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === '#' + currentId) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', this.scrollHandler);
        this.scrollHandler();
    }

    initAutoClick() {
        setTimeout(() => {
            const links = [...this.shadowRoot.querySelectorAll('.desktop-links a'), ...this.shadowRoot.querySelector('slot[name="links"]').assignedElements()];
            links.forEach(link => {
                if (link.getAttribute('href') === '#schedule') {
                    link.onclick = (e) => {
                        e.preventDefault();
                        const target = document.getElementById('schedule');
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                            setTimeout(() => {
                                const btn = target.shadowRoot.querySelector('button, .btn, #actionBtn, #ctaBtn');
                                if (btn) btn.click();
                            }, 1000);
                        }
                    };
                }
            });
        }, 500);
    }
}
customElements.define('site-menu', SiteMenu);
