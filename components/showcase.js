class ShowcaseSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.carouselInterval = null;
        this.observer = null;
    }

    connectedCallback() {
        const highlight = this.getAttribute('highlight') || '';
        const title = this.getAttribute('title') || '';
        const text = this.getAttribute('text') || '';
        const btnText = this.getAttribute('button-text') || 'Saiba Mais';
        const btnLink = this.getAttribute('button-link') || '#';

        this.render(highlight, title, text, btnText, btnLink);
        this.initCarousel();
        this.initScrollReveal();
    }

    disconnectedCallback() {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
            this.carouselInterval = null;
        }

        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }

    render(hl, tt, txt, btnTxt, btnHref) {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    /* SEMÂNTICA: Fundo de Seção Principal */
                    background-color: var(--bg-section-main, #0f0f0f);
                    padding: 8rem 10%;
                    overflow: hidden;
                    
                    /* Variáveis Internas Mapeadas */
                    --font-h: var(--font-display, serif);
                    --font-p: var(--font-body, sans-serif);
                    --color-hl: var(--color-highlight, #c5a065);
                    --color-txt: var(--color-text-secondary, #a0a0a0);
                    --color-title: var(--color-text-primary, #fff);
                }

                .grid {
                    display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 4rem;
                    align-items: center; max-width: 1400px; margin: 0 auto;
                }

                .image-container {
                    position: relative; height: 70vh; overflow: hidden;
                    border-radius: 2px; 
                    /* Fundo enquanto carrega a imagem */
                    background: var(--bg-page-body, #050505); 
                }

                .reveal-curtain {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: var(--bg-section-main, #0f0f0f); z-index: 5;
                    transform-origin: bottom; transition: transform 1.5s cubic-bezier(0.19, 1, 0.22, 1);
                }
                .visible .reveal-curtain { transform: scaleY(0); }

                .carousel-track {
                    display: flex; height: 100%; width: 100%;
                    transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
                }

                ::slotted([slot="gallery"]) {
                    width: 100%; height: 100%; object-fit: cover;
                    flex-shrink: 0; display: block;
                    cursor: zoom-in; /* Mantém o Lightbox funcional */
                }

                .text-box {
                    /* Fundo semi-transparente escuro para leitura */
                    background: rgba(15, 15, 15, 0.95); 
                    padding: 4rem;
                    margin-left: -100px; z-index: 10;
                    border-left: 1px solid var(--color-hl);
                    backdrop-filter: blur(10px); position: relative;
                    opacity: 0; transform: translateY(30px); transition: all 1s ease 0.5s;
                }
                .visible .text-box { opacity: 1; transform: translateY(0); }

                /* Tipografia */
                .hl { 
                    color: var(--color-hl); font-family: var(--font-p); 
                    text-transform: uppercase; letter-spacing: 4px; font-size: 0.7rem; 
                    font-weight: 600; display: block; margin-bottom: 1.5rem; 
                }
                .tt { 
                    font-family: var(--font-h); font-size: 2.5rem; 
                    color: var(--color-title); margin: 0 0 1.5rem 0; line-height: 1.2; font-weight: 400; 
                }
                .txt { 
                    font-family: var(--font-p); color: var(--color-txt); 
                    line-height: 1.8; font-size: 1rem; margin-bottom: 2rem; 
                }
                
                .btn { 
                    display: inline-block; color: var(--color-title); text-decoration: none; 
                    text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; 
                    padding-bottom: 5px; border-bottom: 1px solid var(--color-hl); 
                    cursor: pointer; font-family: var(--font-p); transition: color 0.3s; 
                }
                .btn:hover { color: var(--color-hl); }

                @media (max-width: 768px) {
                    :host { padding: 4rem 5%; }
                    .grid { grid-template-columns: 1fr; gap: 0; }
                    .image-container { height: 50vh; }
                    .text-box { margin: -50px 20px 0 20px; padding: 2rem; }
                }
            </style>

            <div class="grid" id="container">
                <div class="image-container">
                    <div class="reveal-curtain"></div>
                    <div class="carousel-track" id="track">
                        <slot name="gallery"></slot> 
                    </div>
                </div>

                <div class="text-box">
                    <span class="hl">${hl}</span>
                    <h2 class="tt">${tt}</h2>
                    <p class="txt">${txt}</p>
                    <a class="btn" href="${btnHref}">${btnTxt}</a>
                </div>
            </div>
        `;
    }

    initScrollReveal() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.shadowRoot.getElementById('container').classList.add('visible');
                }
            });
        }, { threshold: 0.2 });
        this.observer.observe(this);
    }

    initCarousel() {
        const slot = this.shadowRoot.querySelector('slot[name="gallery"]');

        slot.addEventListener('click', (e) => {
            const img = e.target;
            if (img && img.tagName === 'IMG') {
                window.dispatchEvent(new CustomEvent('open-lightbox', {
                    detail: {
                        src: img.src,
                        title: img.alt || this.getAttribute('title'),
                    },
                }));
            }
        });

        slot.addEventListener('slotchange', () => {
            const images = slot.assignedElements();
            if (images.length === 0) return;

            if (this.carouselInterval) {
                clearInterval(this.carouselInterval);
            }

            const track = this.shadowRoot.getElementById('track');
            let currentIndex = 0;

            this.carouselInterval = setInterval(() => {
                currentIndex += 1;
                if (currentIndex >= images.length) currentIndex = 0;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
            }, 4000);
        });
    }
}
customElements.define('showcase-section', ShowcaseSection);
