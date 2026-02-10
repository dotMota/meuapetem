class HeroBrand extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.slides = [];
        this.currentIndex = 0;
        this.timer = null;
    }

    async connectedCallback() {
        this.renderSkeleton();

        if (!window.ProductIndexService) {
            console.error('Erro: Importe services/product-index.service.js antes do hero-brand.js.');
            this.renderFallback();
            return;
        }

        this.slides = await window.ProductIndexService.getHeroSlides();

        if (this.slides.length > 0) {
            this.render();
            this.startAutoSlide();
            this.addEvents();
            return;
        }

        this.renderFallback();
    }

    disconnectedCallback() {
        this.stopAutoSlide();
    }

    startAutoSlide() { this.timer = setInterval(() => this.nextSlide(), 6000); }
    stopAutoSlide() { if (this.timer) clearInterval(this.timer); }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlide();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlide();
    }

    updateSlide() {
        const slidesElements = this.shadowRoot.querySelectorAll('.slide');
        const dots = this.shadowRoot.querySelectorAll('.dot');
        slidesElements.forEach((el, index) => el.classList.toggle('active', index === this.currentIndex));
        dots.forEach((dot, index) => dot.classList.toggle('active', index === this.currentIndex));
    }

    renderSkeleton() {
        this.shadowRoot.innerHTML = `<style>:host { display: block; height: 100vh; background: #000; }</style>`;
    }

    renderFallback() {
        this.shadowRoot.innerHTML = `
        <style>
            :host { display: block; height: 100vh; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-family: sans-serif; }
            h1 { font-size: 3rem; text-transform: uppercase; letter-spacing: 5px; }
        </style>
        <div><h1>MEUAPÊTEM</h1></div>`;
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host { display: block; height: 100vh; width: 100%; position: relative; overflow: hidden; background: #000; --highlight: var(--color-accent-primary, var(--color-highlight, #FF6F61)); }
            .carousel-container { width: 100%; height: 100%; position: relative; }
            .slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 1.2s ease-in-out; z-index: 1; pointer-events: none; }
            .slide.active { opacity: 1; z-index: 2; pointer-events: all; }
            .bg-image { width: 100%; height: 100%; object-fit: cover; transform: scale(1.1); transition: transform 8s ease; filter: brightness(0.65); }
            .slide.active .bg-image { transform: scale(1); filter: brightness(0.5); }
            .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.4) 100%); }
            .content { position: absolute; bottom: 20%; left: 5%; width: 90%; max-width: 900px; z-index: 10; color: #fff; opacity: 0; transform: translateY(40px); transition: all 0.8s ease 0.3s; }
            .slide.active .content { opacity: 1; transform: translateY(0); }
            .tag { background: var(--highlight); color: #000; padding: 6px 14px; font-family: 'Manrope', sans-serif; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 2px; display: inline-block; margin-bottom: 1.5rem; border-radius: 2px; }
            h1 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 5.5rem); margin: 0; line-height: 0.95; text-transform: uppercase; letter-spacing: -2px; }
            h2 { font-family: 'Manrope', sans-serif; font-size: clamp(1rem, 2vw, 1.4rem); margin: 1.5rem 0 2.5rem 0; font-weight: 300; color: #ddd; max-width: 700px; line-height: 1.5; }
            .btn { display: inline-flex; align-items: center; gap: 12px; padding: 1.2rem 3rem; border: 1px solid rgba(255,255,255,0.4); color: #fff; text-decoration: none; text-transform: uppercase; font-family: 'Space Grotesk', sans-serif; letter-spacing: 3px; font-size: 0.9rem; font-weight: 600; transition: all 0.3s ease; background: rgba(255,255,255,0.05); backdrop-filter: blur(5px); }
            .btn:hover { background: #fff; color: #000; border-color: #fff; padding-right: 4rem; transform: translateY(-3px); }
            .controls { position: absolute; bottom: 7%; right: 5%; z-index: 20; display: flex; gap: 10px; }
            .ctrl-btn { width: 44px; height: 44px; border: 1px solid rgba(255,255,255,0.4); background: rgba(0,0,0,0.3); color: #fff; cursor: pointer; font-size: 1rem; transition: all 0.3s ease; }
            .ctrl-btn:hover { background: var(--highlight); color: #000; border-color: var(--highlight); }
            .dots { position: absolute; bottom: 9%; left: 5%; z-index: 20; display: flex; gap: 8px; }
            .dot { width: 26px; height: 3px; background: rgba(255,255,255,0.3); border: none; cursor: pointer; transition: all 0.3s ease; }
            .dot.active { background: var(--highlight); width: 46px; }
            @media (max-width: 768px) { .content { bottom: 23%; } .controls { bottom: 5%; right: 5%; } .dots { bottom: 5.5%; left: 5%; } h1 { line-height: 1; letter-spacing: -1px; } }
        </style>

        <div class="carousel-container">
            ${this.slides.map((slide, index) => `
                <div class="slide ${index === 0 ? 'active' : ''}">
                    <img class="bg-image" src="${slide.image}" alt="${slide.title}">
                    <div class="overlay"></div>
                    <div class="content">
                        <span class="tag">${slide.tag}</span>
                        <h1>${slide.title}</h1>
                        <h2>${slide.subtitle}</h2>
                        <a href="${slide.link}" class="btn" part="btn-primary">Conhecer Empreendimento</a>
                    </div>
                </div>
            `).join('')}

            <div class="controls">
                <button class="ctrl-btn" id="prev">&#8592;</button>
                <button class="ctrl-btn" id="next">&#8594;</button>
            </div>

            <div class="dots">
                ${this.slides.map((_, index) => `<button class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>`).join('')}
            </div>

        </div>`;
    }

    addEvents() {
        this.shadowRoot.getElementById('next')?.addEventListener('click', () => { this.stopAutoSlide(); this.nextSlide(); this.startAutoSlide(); });
        this.shadowRoot.getElementById('prev')?.addEventListener('click', () => { this.stopAutoSlide(); this.prevSlide(); this.startAutoSlide(); });

        this.shadowRoot.querySelectorAll('.dot').forEach((dot) => {
            dot.addEventListener('click', () => {
                this.stopAutoSlide();
                this.currentIndex = Number(dot.dataset.index);
                this.updateSlide();
                this.startAutoSlide();
            });
        });
    }
}
customElements.define('hero-brand', HeroBrand);
