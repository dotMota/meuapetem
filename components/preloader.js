class SitePreloader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const projectAttr = this.getAttribute('project') || '';
        if (projectAttr && !this.querySelector('[slot="project"]')) {
            const span = document.createElement('span');
            span.setAttribute('slot', 'project');
            span.textContent = projectAttr;
            this.appendChild(span);
        }
        const projectSlot = this.querySelector('[slot="project"]');
        const project = projectSlot ? projectSlot.textContent.trim() : '';

        // Lógica de Exibição
        const contentHtml = project
            ? `
                <div class="text-group">
                    <span class="brand">MeuApêTem</span>
                    <span class="divider">/</span>
                    <span class="project">${project}</span>
                </div>
              `
            : `
                <div class="text-group">
                    <span class="brand">MeuApêTem</span>
                </div>
              `;

        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap');

                :host {
                    position: fixed; top: 0; left: 0;
                    width: 100%; height: 100vh;
                    z-index: 999999; 
                    background-color: var(--bg-page-body, #0a0a0a);
                    display: flex; justify-content: center; align-items: center;
                    transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1);
                }

                :host(.loaded) {
                    transform: translateY(-100%);
                }

                .container {
                    text-align: center;
                    overflow: hidden; 
                }

                .text-group {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    /* Fonte Padrão da Marca (MeuApêTem) */
                    font-family: 'Space Grotesk', sans-serif;
                    color: #fff;
                    font-size: clamp(1.5rem, 4vw, 2.5rem);
                    opacity: 0;
                    transform: translateY(30px);
                    animation: textReveal 0.8s ease forwards 0.3s;
                }

                .brand { font-weight: 700; letter-spacing: -1px; }
                
                .divider { 
                    color: rgba(255,255,255,0.3); 
                    font-weight: 300; 
                    transform: skew(-15deg);
                }

                .project { 
                    color: var(--highlight-color, #FF6F61); 
                    
                    /* --- AQUI ESTÁ A MÁGICA --- */
                    /* Usa a fonte definida na página do projeto (Ex: Cinzel no Quarten) */
                    font-family: var(--font-title, 'Space Grotesk', sans-serif);
                    
                    font-weight: 400;
                    text-transform: uppercase; /* Garante elegância */
                }

                .progress-bar {
                    position: absolute; bottom: 0; left: 0;
                    height: 4px; background: var(--highlight-color, #FF6F61);
                    width: 0%;
                    transition: width 0.2s ease;
                }

                @keyframes textReveal {
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .text-group { flex-direction: column; gap: 5px; }
                    .divider { display: none; }
                    .project { font-size: 1.2em; }
                }
            </style>

            <div class="container">
                ${contentHtml}
            </div>
            <div class="progress-bar" id="bar"></div>
        `;

        this.initLoader();
    }

    initLoader() {
        const bar = this.shadowRoot.getElementById('bar');
        let width = 0;

        const interval = setInterval(() => {
            if (width >= 90) clearInterval(interval);
            width += Math.random() * 10;
            bar.style.width = width + '%';
        }, 200);

        window.addEventListener('load', () => {
            clearInterval(interval);
            bar.style.width = '100%';

            setTimeout(() => {
                this.classList.add('loaded');
                setTimeout(() => {
                    this.style.display = 'none';
                }, 900);
            }, 600);
        });
    }
}

customElements.define('site-preloader', SitePreloader);
