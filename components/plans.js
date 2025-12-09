// --- ITEM INDIVIDUAL (O Apartamento) ---
class PlanItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.slideIndex = 0;
        this.interval = null;
    }

    connectedCallback() {
        const title = this.getAttribute('title') || '';
        const desc = this.getAttribute('desc') || '';
        const area = this.getAttribute('area') || '';
        const dorms = this.getAttribute('dorms') || '';
        const vagas = this.getAttribute('vagas') || '';
        const extraLabel = this.getAttribute('extra-label') || '';
        const extraVal = this.getAttribute('extra-val') || '';
        const btnText = this.getAttribute('button-text') || 'Solicitar Book Digital';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: none; width: 100%; animation: fadeUp 0.6s ease;
                    --accent: var(--color-highlight, #c5a065);
                    --txt-main: var(--color-text-primary, #fff);
                    --txt-sec: var(--color-text-secondary, #a0a0a0);
                    --bg-card: var(--bg-page-body, #050505);
                }
                :host([active]) { display: block; }

                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }

                .carousel-box {
                    position: relative; width: 100%; padding-bottom: 75%;
                    background: var(--bg-card); overflow: hidden; border-radius: 2px;
                }
                .slide-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
                
                ::slotted([slot="image"]) {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    object-fit: contain; opacity: 0; transition: opacity 0.8s ease;
                    background: var(--bg-card); display: block; cursor: zoom-in;
                }
                ::slotted(.active-slide) { opacity: 1; z-index: 1; }

                .nav { position: absolute; bottom: 20px; right: 20px; z-index: 10; display: flex; gap: 10px; }
                button {
                    width: 40px; height: 40px; border-radius: 50%;
                    border: 1px solid var(--accent); color: var(--accent);
                    background: rgba(0,0,0,0.5); cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.2rem; transition: 0.3s;
                }
                button:hover { background: var(--accent); color: #000; }

                .info-box { color: var(--txt-main); }
                .tt { font-family: var(--font-title, serif); font-size: 2.2rem; margin: 0 0 1rem 0; color: var(--txt-main); }
                .desc { font-family: var(--font-text, sans-serif); font-size: 1rem; color: var(--txt-sec); line-height: 1.6; margin-bottom: 2.5rem; display: block; }

                .specs-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;
                    border-top: 1px solid rgba(255,255,255,0.1); 
                    padding-top: 2rem; margin-bottom: 2.5rem;
                }
                .spec-item { display: flex; flex-direction: column; gap: 5px; }
                .label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; color: var(--txt-sec); font-family: var(--font-text, sans-serif); font-weight: 600; }
                .val { font-family: var(--font-text, sans-serif); font-size: 1.1rem; color: var(--txt-main); font-weight: 400; }
                .val.gold { color: var(--accent); font-weight: 600; }

                .action-btn {
                    display: inline-block; padding-bottom: 5px; border-bottom: 1px solid var(--accent);
                    color: var(--txt-main); text-decoration: none; text-transform: uppercase;
                    letter-spacing: 2px; font-size: 0.8rem; cursor: pointer;
                    font-family: var(--font-text, sans-serif); transition: color 0.3s;
                }
                .action-btn:hover { color: var(--accent); }

                @media (max-width: 768px) {
                    .grid { grid-template-columns: 1fr; gap: 2rem; }
                    .carousel-box { padding-bottom: 80%; }
                    .specs-grid { gap: 1.5rem; }
                }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            </style>

            <div class="grid">
                <div class="carousel-box" id="cBox">
                    <div class="slide-wrapper" id="slideWrapper">
                        <slot name="image"></slot>
                    </div>
                    <div class="nav">
                        <button id="prev">←</button>
                        <button id="next">→</button>
                    </div>
                </div>

                <div class="info-box">
                    <h3 class="tt">${title}</h3>
                    <span class="desc">${desc}</span>
                    <div class="specs-grid">
                        <div class="spec-item"><span class="label">Área Privativa</span><span class="val gold">${area}</span></div>
                        <div class="spec-item"><span class="label">Dormitórios</span><span class="val">${dorms}</span></div>
                        <div class="spec-item"><span class="label">Vagas</span><span class="val">${vagas}</span></div>
                        <div class="spec-item"><span class="label">${extraLabel}</span><span class="val">${extraVal}</span></div>
                    </div>
                    <a class="action-btn" id="bookBtn">${btnText}</a>
                </div>
            </div>
        `;

        this.initCarousel();

        // --- MENSAGEM INTELIGENTE (CONDICIONAL) ---
        this.shadowRoot.getElementById('bookBtn').onclick = () => {
            // 1. Nome do Projeto
            const section = this.closest('plans-section');
            const project = section ? section.getAttribute('project') : 'deste empreendimento';

            // 2. Perfil (Só adiciona se for Elev)
            const persona = localStorage.getItem('site-persona');
            let intentString = '';

            // AQUI ESTÁ A CORREÇÃO: Só aplica o sufixo se o projeto contiver "Elev"
            if (project.includes('Elev')) {
                if (persona === 'investor') intentString = ' para investimento';
                else if (persona === 'resident') intentString = ' para moradia';
            }

            // 3. Monta a mensagem final
            const msg = `Olá! Estou vendo o projeto ${project}${intentString}. Gostei da planta ${title} e gostaria de receber o Book Digital.`;

            window.dispatchEvent(new CustomEvent('open-contact-popup', {
                detail: { message: msg }
            }));
        };
    }

    initCarousel() {
        const slot = this.shadowRoot.querySelector('slot[name="image"]');
        let imgs = [];

        slot.addEventListener('slotchange', () => {
            imgs = slot.assignedElements();
            if (imgs.length) imgs[0].classList.add('active-slide');
        });

        const show = (idx) => {
            if (!imgs.length) return;
            imgs.forEach(el => el.classList.remove('active-slide'));
            this.slideIndex = (idx + imgs.length) % imgs.length;
            imgs[this.slideIndex].classList.add('active-slide');
        };

        this.shadowRoot.getElementById('next').onclick = (e) => { e.stopPropagation(); clearInterval(this.interval); show(this.slideIndex + 1); };
        this.shadowRoot.getElementById('prev').onclick = (e) => { e.stopPropagation(); clearInterval(this.interval); show(this.slideIndex - 1); };

        const slideWrapper = this.shadowRoot.getElementById('slideWrapper');
        slideWrapper.addEventListener('click', () => {
            if (!imgs.length) return;
            window.dispatchEvent(new CustomEvent('open-lightbox', {
                detail: { src: imgs[this.slideIndex].src, title: this.getAttribute('title') || 'Planta' }
            }));
        });

        const startAuto = () => this.interval = setInterval(() => show(this.slideIndex + 1), 4000);
        startAuto();
        const box = this.shadowRoot.getElementById('cBox');
        box.onmouseenter = () => clearInterval(this.interval);
        box.onmouseleave = startAuto;
    }
}
customElements.define('plan-item', PlanItem);


// --- SEÇÃO PRINCIPAL ---
class PlansSection extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() { this.render(); this.initTabs(); }

    render() {
        const highlight = this.getAttribute('highlight') || '';
        const title = this.getAttribute('title') || '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--bg-section-main, #141414);
                    padding: 6rem 10%;
                    --accent: var(--color-highlight, #c5a065);
                    --txt-main: var(--color-text-primary, #fff);
                    --txt-sec: var(--color-text-secondary, #666);
                }
                .header {
                    display: flex; justify-content: space-between; align-items: flex-end;
                    flex-wrap: wrap; gap: 2rem; margin-bottom: 4rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2rem;
                }
                .hl { color: var(--accent); text-transform: uppercase; letter-spacing: 4px; font-size: 0.8rem; display: block; margin-bottom: 0.5rem; font-family: var(--font-text, sans-serif); }
                .tt { font-family: var(--font-title, serif); font-size: 3rem; margin: 0; line-height: 1; font-weight: 400; color: var(--txt-main); }
                
                .tabs { display: flex; gap: 2rem; }
                button {
                    background: none; border: none; 
                    color: var(--txt-sec); 
                    font-family: var(--font-title, serif);
                    font-size: 1.5rem; cursor: pointer; padding-bottom: 0.5rem;
                    position: relative; transition: 0.3s;
                }
                button.active { color: var(--accent); }
                button.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--accent); }
                
                @media(max-width: 768px) {
                    :host { padding: 4rem 5%; }
                    .header { flex-direction: column; align-items: flex-start; }
                    .tabs { width: 100%; overflow-x: auto; padding-bottom: 5px; }
                    button { font-size: 1.2rem; white-space: nowrap; }
                }
            </style>
            <div class="wrapper">
                <div class="header">
                    <div><span class="hl">${highlight}</span><h2 class="tt">${title}</h2></div>
                    <div class="tabs" id="tabs"></div>
                </div>
                <slot name="content"></slot>
            </div>
        `;
    }

    initTabs() {
        const slot = this.shadowRoot.querySelector('slot[name="content"]');
        const tabsDiv = this.shadowRoot.getElementById('tabs');
        slot.addEventListener('slotchange', () => {
            const items = slot.assignedElements();
            if (!items.length) return;
            tabsDiv.innerHTML = '';
            items.forEach((item, i) => {
                const btn = document.createElement('button');
                btn.innerText = item.getAttribute('name');
                btn.onclick = () => {
                    this.shadowRoot.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                    items.forEach(el => el.removeAttribute('active'));
                    btn.classList.add('active');
                    item.setAttribute('active', '');
                };
                if (i === 0) btn.click();
                tabsDiv.appendChild(btn);
            });
        });
    }
}
customElements.define('plans-section', PlansSection);