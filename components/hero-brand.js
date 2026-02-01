/**
 * <hero-brand>
 * Attributes: none (content is built from project pages)
 */
class HeroBrand extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // LISTA CENTRALIZADA (A mesma lógica do page-scanner)
        // Se criar um imóvel novo, adicione o nome do arquivo aqui
        this.projectFiles = [
            'quarten.html',
            'granoscar.html',
            'elevButanta.html',
            'elevSacoma.html',
            'elevAltoIpiranga.html',
            'vilaBoulevardMooca.html',
            'peninsulaVilaMadalena.html'
        ];

        this.slides = [];
        this.currentIndex = 0;
        this.timer = null;
    }

    async connectedCallback() {
        // 1. Renderiza a estrutura vazia (Loading...)
        this.renderSkeleton();

        // 2. Busca os dados reais dos imóveis
        await this.fetchProjectsData();

        // 3. Renderiza o carrossel real se achou imóveis
        if (this.slides.length > 0) {
            this.render();
            this.startAutoSlide();
            this.addEvents();
        } else {
            // Fallback se der erro na leitura (mostra só a marca)
            this.renderFallback();
        }
    }

    disconnectedCallback() {
        this.stopAutoSlide();
    }

    // --- O CÉREBRO DA OPERAÇÃO ---
    async fetchProjectsData() {
        const pathPrefix = 'projects/'; // Como estamos na home, a pasta é projects/

        // Cria uma lista de promessas para ler todos ao mesmo tempo (rápido)
        const promises = this.projectFiles.map(async (file) => {
            try {
                const response = await fetch(pathPrefix + file);
                if (!response.ok) return null;

                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                // Extrai as meta tags (Open Graph) que já existem nas suas páginas
                // Título: "Nome do Prédio | MeuApêTem" -> Pega só o nome
                const fullTitle = doc.querySelector('title')?.innerText || '';
                const title = fullTitle.split('|')[0].trim().toUpperCase();

                // Imagem de Capa (og:image)
                let image = doc.querySelector('meta[property="og:image"]')?.content;
                if (image) {
                    // Corrige o caminho relativo (de ../media para ./media)
                    image = image.replace('../media', './media');
                } else {
                    return null; // Sem imagem não serve pra Hero
                }

                // Tag/Vibe
                const tag = doc.querySelector('meta[name="product-vibe"]')?.content || 'EXCLUSIVO';

                // Subtítulo (pega a description ou cria um genérico)
                const desc = doc.querySelector('meta[name="description"]')?.content || 'O imóvel ideal para você.';

                return {
                    title: title,
                    subtitle: desc.split('.')[0], // Pega só a primeira frase pra não ficar longo
                    image: image,
                    link: pathPrefix + file,
                    tag: tag.toUpperCase()
                };

            } catch (e) {
                console.warn('Erro ao ler imóvel para Hero:', file);
                return null;
            }
        });

        const results = await Promise.all(promises);

        // Filtra os nulos e embaralha
        const validSlides = results.filter(s => s !== null);
        this.slides = this.shuffleArray(validSlides);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startAutoSlide() {
        this.timer = setInterval(() => this.nextSlide(), 6000);
    }

    stopAutoSlide() {
        if (this.timer) clearInterval(this.timer);
    }

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

        if (slidesElements.length === 0) return;

        slidesElements.forEach((el, index) => {
            if (index === this.currentIndex) el.classList.add('active');
            else el.classList.remove('active');
        });

        dots.forEach((dot, index) => {
            if (index === this.currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    renderSkeleton() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; height: 100vh; background: var(--color-black, #000); }
            </style>
        `;
    }

    renderFallback() {
        this.shadowRoot.innerHTML = `
        <style>
            :host { display: block; height: 100vh; background: var(--color-surface-800, #111); color: var(--color-white, #fff); display: flex; align-items: center; justify-content: center; font-family: sans-serif; }
            h1 { font-size: 3rem; text-transform: uppercase; letter-spacing: 5px; }
        </style>
        <div><h1>MEUAPÊTEM</h1></div>
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host { 
                display: block; 
                height: 100vh; 
                width: 100%; 
                position: relative; 
                overflow: hidden; 
                background: var(--color-black, #000);
                --highlight: var(--color-highlight, #FF6F61);
            }

            .carousel-container { width: 100%; height: 100%; position: relative; }

            .slide {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                opacity: 0; transition: opacity 1.2s ease-in-out;
                z-index: 1; pointer-events: none;
            }

            .slide.active { opacity: 1; z-index: 2; pointer-events: all; }

            .bg-image {
                width: 100%; height: 100%; object-fit: cover;
                transform: scale(1.1); transition: transform 8s ease;
                filter: brightness(0.65);
            }

            .slide.active .bg-image { transform: scale(1); filter: brightness(0.5); }

            .overlay {
                position: absolute; inset: 0;
                background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.4) 100%);
            }

            .content {
                position: absolute; bottom: 20%; left: 5%; width: 90%; max-width: 900px;
                z-index: 10; color: var(--color-white, #fff);
                opacity: 0; transform: translateY(40px);
                transition: all 0.8s ease 0.3s;
            }

            .slide.active .content { opacity: 1; transform: translateY(0); }

            .tag {
                background: var(--highlight); color: var(--color-black, #000);
                padding: 6px 14px; font-family: 'Manrope', sans-serif;
                font-weight: 800; text-transform: uppercase; font-size: 0.75rem;
                letter-spacing: 2px; display: inline-block; margin-bottom: 1.5rem;
                border-radius: 2px;
            }

            h1 {
                font-family: 'Space Grotesk', sans-serif;
                font-size: clamp(2.5rem, 6vw, 5.5rem);
                margin: 0; line-height: 0.95; text-transform: uppercase;
                letter-spacing: -2px;
            }

            h2 {
                font-family: 'Manrope', sans-serif;
                font-size: clamp(1rem, 2vw, 1.4rem);
                margin: 1.5rem 0 2.5rem 0; font-weight: 300;
                color: var(--color-surface-200, #ddd); max-width: 700px; line-height: 1.5;
            }

            .btn {
                display: inline-flex; align-items: center; gap: 12px;
                padding: 1.2rem 3rem; border: 1px solid rgba(255,255,255,0.4);
                color: var(--color-white, #fff); text-decoration: none; text-transform: uppercase;
                font-family: 'Space Grotesk', sans-serif; letter-spacing: 3px;
                font-size: 0.9rem; font-weight: 600;
                transition: all 0.3s ease; background: rgba(255,255,255,0.05);
                backdrop-filter: blur(5px);
            }

            .btn:hover {
                background: var(--color-white, #fff); color: var(--color-black, #000); border-color: var(--color-white, #fff);
                padding-right: 4rem; transform: translateY(-3px);
            }
            
            .nav-btn {
                position: absolute; top: 50%; transform: translateY(-50%);
                background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                color: var(--color-white, #fff); width: 60px; height: 60px; border-radius: 50%;
                cursor: pointer; z-index: 20; display: flex;
                align-items: center; justify-content: center;
                transition: 0.3s; backdrop-filter: blur(4px); font-size: 1.5rem;
            }
            .nav-btn:hover { background: var(--highlight); border-color: var(--highlight); color: var(--color-black, #000); }
            .prev { left: 2rem; }
            .next { right: 2rem; }

            .dots {
                position: absolute; bottom: 3rem; left: 50%; transform: translateX(-50%);
                display: flex; gap: 12px; z-index: 20;
            }
            .dot {
                width: 6px; height: 6px; border-radius: 50%;
                background: rgba(255,255,255,0.2); cursor: pointer; transition: 0.4s;
            }
            .dot.active { background: var(--highlight); transform: scale(1.6); }

            @media (max-width: 768px) {
                .nav-btn { display: none; }
                .content { bottom: 25%; }
                h1 { font-size: 3rem; letter-spacing: -1px; }
            }
        </style>

        <div class="carousel-container">
            ${this.slides.map((slide, index) => `
                <div class="slide ${index === 0 ? 'active' : ''}">
                    <img src="${slide.image}" class="bg-image" alt="${slide.title}">
                    <div class="overlay"></div>
                    <div class="content">
                        <span class="tag">${slide.tag}</span>
                        <h1>${slide.title}</h1>
                        <h2>${slide.subtitle}</h2>
                        <a href="${slide.link}" class="btn">
                            Ver Projeto <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            `).join('')}

            <button class="nav-btn prev" id="prevBtn">❮</button>
            <button class="nav-btn next" id="nextBtn">❯</button>

            <div class="dots">
                ${this.slides.map((_, index) => `
                    <div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
                `).join('')}
            </div>
        </div>
        `;
    }

    addEvents() {
        this.shadowRoot.getElementById('prevBtn')?.addEventListener('click', () => {
            this.stopAutoSlide(); this.prevSlide();
        });

        this.shadowRoot.getElementById('nextBtn')?.addEventListener('click', () => {
            this.stopAutoSlide(); this.nextSlide();
        });

        const dots = this.shadowRoot.querySelectorAll('.dot');
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                this.stopAutoSlide();
                this.currentIndex = parseInt(e.target.dataset.index);
                this.updateSlide();
            });
        });
    }
}
customElements.define('hero-brand', HeroBrand);
