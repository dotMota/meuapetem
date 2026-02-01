/**
 * <gallery-section>
 * Attributes: subtitle, title
 * Slots: items (gallery-item children)
 * Child <gallery-item> attributes: image, title, text
 * Events: dispatches window 'open-lightbox' on item click.
 */
// --- ITEM (CARD INDIVIDUAL) ---
class GalleryItem extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }

    connectedCallback() {
        const image = this.getAttribute('image') || '';
        const title = this.getAttribute('title') || '';
        const text = this.getAttribute('text') || '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block; position: relative; width: 40vw; height: 60vh; 
                    flex-shrink: 0; scroll-snap-align: center;
                    
                    /* SEMÂNTICA: Fundo do Card */
                    background: var(--bg-section-main, var(--color-surface-800, #111));
                    border-right: 1px solid var(--color-border-light, rgba(255, 255, 255, 0.1));
                    
                    overflow: hidden; box-sizing: border-box;
                    filter: grayscale(100%) brightness(0.5); transform: scale(0.9);
                    transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
                    cursor: zoom-in;
                    
                    /* Variáveis Internas */
                    --accent: var(--color-highlight, #c5a065);
                    --txt-main: var(--color-text-primary, #fff);
                }

                :host(.active) {
                    filter: grayscale(0%) brightness(1); transform: scale(1.05);
                    border: 1px solid var(--accent); z-index: 5;
                    box-shadow: 0 15px 50px rgba(0,0,0,0.9);
                }

                .bg-img {
                    width: 100%; height: 100%; object-fit: cover;
                    object-position: bottom center; position: absolute; top: 0; left: 0; display: block;
                    transition: transform 0.5s ease;
                }
                :host(:hover) .bg-img { transform: scale(1.05); }

                .caption {
                    position: absolute; bottom: 0; left: 0; width: 100%; padding: 2rem;
                    background: linear-gradient(to top, var(--color-overlay-strong, rgba(0,0,0,0.95)), transparent);
                    opacity: 0; transition: 0.4s ease; transform: translateY(20px); pointer-events: none;
                }
                :host(.active) .caption { opacity: 1; transform: translateY(0); }

                .tt { 
                    font-family: var(--font-display, serif); 
                    color: var(--txt-main); font-size: 1.8rem; margin: 0; line-height: 1.1; 
                }
                .txt { 
                    font-family: var(--font-body, sans-serif); 
                    color: var(--accent); font-size: 0.85rem; 
                    margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 2px; 
                }

                @media (max-width: 768px) { :host { width: 80vw; height: 50vh; } }
            </style>
            <img class="bg-img" src="${image}" alt="${title}">
            <div class="caption"><h3 class="tt">${title}</h3><p class="txt">${text}</p></div>
        `;
    }
}
customElements.define('gallery-item', GalleryItem);


// --- SEÇÃO (CARROSSEL) ---
class GallerySection extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }

    connectedCallback() { this.render(); this.initLogic(); }

    render() {
        const subtitle = this.getAttribute('subtitle') || '';
        const title = this.getAttribute('title') || '';

        this.shadowRoot.innerHTML = `
            <style>
                :host { 
                    display: block; 
                    background-color: var(--bg-page-body, var(--color-surface-950, #050505)); 
                    position: relative; width: 100%; overflow: hidden;
                    
                    --accent: var(--color-highlight, #c5a065);
                    --txt-main: var(--color-text-primary, #fff);
                    --txt-sec: var(--color-text-secondary, #a0a0a0);
                }
                
                .wrapper { display: flex; height: 90vh; width: 100%; align-items: center; position: relative; }
                
                .intro { 
                    flex: 0 0 30%; padding: 0 4%; z-index: 10; 
                    background: var(--bg-page-body, var(--color-surface-950, #050505)); 
                    height: 100%; display: flex; flex-direction: column; justify-content: center; 
                    box-shadow: 10px 0 30px rgba(0,0,0,0.5); 
                }
                
                .sub { color: var(--accent); text-transform: uppercase; letter-spacing: 4px; font-size: 0.8rem; margin-bottom: 1rem; font-family: var(--font-body, sans-serif); display: block; }
                .tit { font-family: var(--font-display, serif); font-size: 3.5rem; color: var(--txt-main); margin: 0; line-height: 1.1; font-weight: 400; }
                .hint { color: var(--txt-sec); margin-top: 2rem; font-family: var(--font-body, sans-serif); text-transform: uppercase; font-size: 0.7rem; letter-spacing: 2px; }
                
                .track-container { flex: 1; height: 100%; min-width: 0; overflow-x: auto; overflow-y: hidden; display: flex; align-items: center; scroll-snap-type: x mandatory; scroll-behavior: smooth; scrollbar-width: none; cursor: grab; }
                .track-container::-webkit-scrollbar { display: none; }
                .track-container.dragging { scroll-snap-type: none; scroll-behavior: auto; cursor: grabbing; }
                .track { display: flex; gap: 2rem; padding-left: 10vw; padding-right: 10vw; box-sizing: border-box; }

                .nav-btn { 
                    position: absolute; top: 50%; transform: translateY(-50%); z-index: 20; width: 60px; height: 60px; 
                    border-radius: 50%; border: 1px solid var(--color-border-lighter, rgba(255, 255, 255, 0.2)); 
                    background: var(--color-overlay-medium, rgba(0, 0, 0, 0.5)); backdrop-filter: blur(5px); 
                    color: var(--color-white, #fff); cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; 
                }
                .nav-btn:hover { background: var(--accent); border-color: var(--accent); color: var(--color-black, #000); transform: translateY(-50%) scale(1.1); }
                .nav-btn svg { width: 24px; height: 24px; fill: currentColor; }
                .prev { left: 32%; } .next { right: 2%; }

                @media (max-width: 768px) {
                    /* Ajuste de padding para não cortar o fundo */
                    .wrapper { flex-direction: column; height: auto; padding-bottom: 6rem; }
                    
                    .intro { width: 100%; padding: 4rem 2rem; height: auto; border-bottom: 1px solid var(--color-surface-600, #222); box-sizing: border-box; }
                    .track-container { width: 100%; height: 60vh; }
                    .track { padding-left: 12.5vw; padding-right: 12.5vw; }
                    .nav-btn { display: none; } .tit { font-size: 2.5rem; }
                }
            </style>

            <div class="wrapper">
                <div class="intro">
                    <span class="sub">${subtitle}</span>
                    <h2 class="tit">${title}</h2>
                    <div class="hint">← Deslize ou use as setas →</div>
                </div>
                <button class="nav-btn prev" id="btnPrev"><svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg></button>
                <button class="nav-btn next" id="btnNext"><svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></button>
                <div class="track-container" id="scrollContainer">
                    <div class="track"><slot name="items"></slot></div>
                </div>
            </div>
        `;
    }

    initLogic() {
        const slider = this.shadowRoot.getElementById('scrollContainer');
        const btnPrev = this.shadowRoot.getElementById('btnPrev');
        const btnNext = this.shadowRoot.getElementById('btnNext');
        const slot = this.shadowRoot.querySelector('slot[name="items"]');

        let isDown = false, startX, scrollLeft;
        let isDragging = false;

        // Lógica de Arrastar (Drag)
        slider.addEventListener('mousedown', (e) => {
            isDown = true; isDragging = false;
            slider.classList.add('dragging');
            startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft;
        });

        const stopDrag = () => { if (!isDown) return; isDown = false; slider.classList.remove('dragging'); };
        slider.addEventListener('mouseleave', stopDrag);
        slider.addEventListener('mouseup', stopDrag);

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5;
            if (Math.abs(walk) > 5) isDragging = true;
            slider.scrollLeft = scrollLeft - walk;
        });

        // Clique para abrir Lightbox (se não estiver arrastando)
        slot.addEventListener('click', (e) => {
            if (isDragging) return;
            const item = e.target.closest('gallery-item');
            if (item) {
                const src = item.getAttribute('image');
                const title = item.getAttribute('title');
                window.dispatchEvent(new CustomEvent('open-lightbox', {
                    detail: { src, title }
                }));
            }
        });

        // Navegação por Botões
        const scrollAmount = () => { const f = slot.assignedElements()[0]; return f ? f.offsetWidth + 32 : 0; };
        btnNext.addEventListener('click', () => {
            const max = slider.scrollWidth - slider.clientWidth;
            if (slider.scrollLeft >= max - 50) slider.scrollTo({ left: 0, behavior: 'smooth' });
            else slider.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
        });
        btnPrev.addEventListener('click', () => {
            if (slider.scrollLeft <= 50) slider.scrollTo({ left: slider.scrollWidth, behavior: 'smooth' });
            else slider.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
        });

        // Observer para ativar o item central
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('active');
                else e.target.classList.remove('active');
            });
        }, { root: slider, threshold: 0.6 });

        slot.addEventListener('slotchange', () => { slot.assignedElements().forEach(el => obs.observe(el)); });
    }
}
customElements.define('gallery-section', GallerySection);
