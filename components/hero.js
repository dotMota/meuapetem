class HeroSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const image = this.getAttribute('image') || '';
        const title = this.getAttribute('title') || '';
        const text = this.getAttribute('text') || '';
        const highlight = this.getAttribute('highlight') || '';
        const subtitle = this.getAttribute('subtitle') || '';
        const showBadge = this.getAttribute('curator-badge') === 'true';

        this.shadowRoot.innerHTML = `
        <style>
            :host { display: block; position: relative; height: 95vh; width: 100%; overflow: hidden; }
            
            .hero-bg {
                position: absolute; inset: 0; width: 100%; height: 100%;
                object-fit: cover; 
                /* --- AJUSTE SOLICITADO: FOCA NA BASE DA IMAGEM --- */
                object-position: bottom center;
                z-index: 0;
                transition: transform 10s ease;
            }
            :host(:hover) .hero-bg { transform: scale(1.05); }

            .overlay {
                position: absolute; inset: 0;
                background: linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 100%);
                z-index: 1;
            }

            .content {
                position: relative; z-index: 2;
                height: 100%; display: flex; flex-direction: column;
                justify-content: center; padding: 0 5%;
                max-width: 1200px; margin: 0 auto;
            }

            .subtitle {
                display: block; font-family: var(--font-text, sans-serif);
                color: rgba(255,255,255,0.8); font-size: 0.9rem; letter-spacing: 2px;
                text-transform: uppercase; margin-bottom: 1rem;
                animation: fadeUp 0.8s ease forwards;
            }

            .highlight {
                color: var(--highlight-color, #c5a065);
                font-family: var(--font-text, sans-serif);
                font-weight: 700; letter-spacing: 4px; text-transform: uppercase;
                font-size: 0.85rem; margin-bottom: 0.5rem; display: block;
                animation: fadeUp 0.8s ease forwards;
            }

            h1 {
                font-family: var(--font-title, serif);
                font-size: clamp(3rem, 6vw, 5.5rem);
                color: var(--color-white, #fff); line-height: 1.1; margin: 0 0 1.5rem 0;
                opacity: 0; animation: fadeUp 0.8s ease 0.2s forwards;
            }

            p {
                font-family: var(--font-text, sans-serif);
                font-size: clamp(1rem, 1.2vw, 1.3rem);
                color: rgba(255,255,255,0.9); max-width: 550px; line-height: 1.6;
                margin-bottom: 2rem;
                opacity: 0; animation: fadeUp 0.8s ease 0.4s forwards;
            }

            .curator-seal {
                position: absolute; bottom: 50px; right: 5%; z-index: 3;
                background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                padding: 15px 25px; border-radius: 12px;
                display: flex; align-items: center; gap: 15px;
                opacity: 0; animation: fadeIn 1s ease 1s forwards; transform: translateY(20px);
            }

            @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }

            .seal-text { text-align: right; }
            .seal-label { display: block; font-family: sans-serif; font-size: 0.65rem; color: var(--color-surface-200, #ccc); text-transform: uppercase; letter-spacing: 2px; }
            .seal-brand { font-family: sans-serif; font-size: 1.4rem; color: var(--color-white, #fff); font-weight: 700; line-height: 1; }
            .seal-brand strong { color: var(--highlight-color); }

            .seal-icon {
                width: 40px; height: 40px; background: rgba(255,255,255,0.1);
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                color: var(--highlight-color);
            }

            @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            
            @media(max-width: 768px) {
                .curator-seal { bottom: 20px; right: 20px; padding: 10px 15px; }
                .seal-brand { font-size: 1rem; }
            }
        </style>

        <img class="hero-bg" src="${image}" alt="Background">
        <div class="overlay"></div>
        
        <div class="content">
            ${highlight ? `<span class="highlight">${highlight}</span>` : ''}
            ${subtitle ? `<span class="subtitle">${subtitle}</span>` : ''}
            <h1>${title}</h1>
            <p>${text}</p>
            <slot name="cta"></slot>
        </div>

        ${showBadge ? `
        <div class="curator-seal">
            <div class="seal-text">
                <span class="seal-label">Curadoria Oficial</span>
                <span class="seal-brand">MeuApê<strong>Tem</strong></span>
            </div>
            <div class="seal-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
        </div>
        ` : ''}
        `;
    }
}
customElements.define('hero-section', HeroSection);
