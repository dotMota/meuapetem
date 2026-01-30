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
        const tabName = this.getAttribute('name') || '';

        const ensureSlot = (slotName, tag, value) => {
            if (!value || this.querySelector(`[slot="${slotName}"]`)) return;
            const el = document.createElement(tag);
            el.setAttribute('slot', slotName);
            el.textContent = value;
            this.appendChild(el);
        };

        ensureSlot('tab', 'span', tabName);
        ensureSlot('title', 'h3', title);
        ensureSlot('desc', 'span', desc);
        ensureSlot('label-area', 'span', 'Área Privativa');
        ensureSlot('area', 'span', area);
        ensureSlot('label-dorms', 'span', 'Dormitórios');
        ensureSlot('dorms', 'span', dorms);
        ensureSlot('label-vagas', 'span', 'Vagas');
        ensureSlot('vagas', 'span', vagas || '-');
        ensureSlot('label-extra', 'span', extraLabel);
        ensureSlot('extra', 'span', extraVal);
        ensureSlot('button-text', 'span', btnText);

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
                .tt, ::slotted([slot="title"]) { font-family: var(--font-title, serif); font-size: 2.2rem; margin: 0 0 1rem 0; color: var(--txt-main); }
                .desc, ::slotted([slot="desc"]) { font-family: var(--font-text, sans-serif); font-size: 1rem; color: var(--txt-sec); line-height: 1.6; margin-bottom: 2.5rem; display: block; }

                .specs-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;
                    border-top: 1px solid rgba(255,255,255,0.1); 
                    padding-top: 2rem; margin-bottom: 2.5rem;
                }
                .spec-item { display: flex; flex-direction: column; gap: 5px; }
                .label,
                ::slotted([slot="label"]),
                ::slotted([slot="label-area"]),
                ::slotted([slot="label-dorms"]),
                ::slotted([slot="label-vagas"]),
                ::slotted([slot="label-extra"]) {
                    font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; color: var(--txt-sec);
                    font-family: var(--font-text, sans-serif); font-weight: 600;
                }
                .val,
                ::slotted([slot="value"]),
                ::slotted([slot="dorms"]),
                ::slotted([slot="vagas"]),
                ::slotted([slot="extra"]) {
                    font-family: var(--font-text, sans-serif); font-size: 1.1rem; color: var(--txt-main); font-weight: 400;
                }
                ::slotted([slot="area"]) { font-family: var(--font-text, sans-serif); font-size: 1.1rem; color: var(--accent); font-weight: 600; }
                .val.gold { color: var(--accent); font-weight: 600; }

                .action-btn, ::slotted([slot="button-text"]) {
                    display: inline-block; padding-bottom: 5px; border-bottom: 1px solid var(--accent);
                    color: var(--txt-main); text-decoration: none; text-transform: uppercase;
                    letter-spacing: 2px; font-size: 0.8rem; cursor: pointer;
                    font-family: var(--font-text, sans-serif); transition: color 0.3s;
                }
                .action-btn:hover { color: var(--accent); }
                ::slotted([slot="tab"]) { display: none; }

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
                    <slot name="title"></slot>
                    <slot name="desc"></slot>
                    <div class="specs-grid">
                        <div class="spec-item"><span class="label"><slot name="label-area"></slot></span><span class="val gold"><slot name="area"></slot></span></div>
                        <div class="spec-item"><span class="label"><slot name="label-dorms"></slot></span><span class="val"><slot name="dorms"></slot></span></div>
                        <div class="spec-item"><span class="label"><slot name="label-vagas"></slot></span><span class="val"><slot name="vagas"></slot></span></div>
                        <div class="spec-item"><span class="label"><slot name="label-extra"></slot></span><span class="val"><slot name="extra"></slot></span></div>
                    </div>
                    <a class="action-btn" id="bookBtn"><slot name="button-text"></slot></a>
                </div>
            </div>
        `;

        this.initCarousel();

        // --- MENSAGEM INTELIGENTE (CONDICIONAL) ---
        this.shadowRoot.getElementById('bookBtn').onclick = () => {
            // 1. Nome do Projeto
            const section = this.closest('plans-section');
            const projectSlot = section ? section.querySelector('[slot="project"]') : null;
            const project = projectSlot ? projectSlot.textContent.trim() : 'deste empreendimento';

            // 2. Perfil (Só adiciona se for Elev)
            const persona = localStorage.getItem('site-persona');
            let intentString = '';

            // AQUI ESTÁ A CORREÇÃO: Só aplica o sufixo se o projeto contiver "Elev"
            if (project.includes('Elev')) {
                if (persona === 'investor') intentString = ' para investimento';
                else if (persona === 'resident') intentString = ' para moradia';
            }

            // 3. Monta a mensagem final
            const titleSlot = this.querySelector('[slot="title"]');
            const planTitle = titleSlot ? titleSlot.textContent.trim() : 'esta planta';
            const msg = `Olá! Estou vendo o projeto ${project}${intentString}. Gostei da planta ${planTitle} e gostaria de receber o Book Digital.`;

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
            const titleSlot = this.querySelector('[slot="title"]');
            const planTitle = titleSlot ? titleSlot.textContent.trim() : 'Planta';
            window.dispatchEvent(new CustomEvent('open-lightbox', {
                detail: { src: imgs[this.slideIndex].src, title: planTitle }
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
        const project = this.getAttribute('project') || '';

        if (highlight && !this.querySelector('[slot="highlight"]')) {
            const span = document.createElement('span');
            span.setAttribute('slot', 'highlight');
            span.textContent = highlight;
            this.appendChild(span);
        }
        if (title && !this.querySelector('[slot="title"]')) {
            const h2 = document.createElement('h2');
            h2.setAttribute('slot', 'title');
            h2.textContent = title;
            this.appendChild(h2);
        }
        if (project && !this.querySelector('[slot="project"]')) {
            const span = document.createElement('span');
            span.setAttribute('slot', 'project');
            span.textContent = project;
            this.appendChild(span);
        }

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
                .hl, ::slotted([slot="highlight"]) { color: var(--accent); text-transform: uppercase; letter-spacing: 4px; font-size: 0.8rem; display: block; margin-bottom: 0.5rem; font-family: var(--font-text, sans-serif); }
                .tt, ::slotted([slot="title"]) { font-family: var(--font-title, serif); font-size: 3rem; margin: 0; line-height: 1; font-weight: 400; color: var(--txt-main); }
                
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
                    <div><slot name="highlight"></slot><slot name="title"></slot></div>
                    <div class="tabs" id="tabs"></div>
                </div>
                <slot name="project"></slot>
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
                const tabSlot = item.querySelector('[slot="tab"]');
                btn.innerText = tabSlot ? tabSlot.textContent.trim() : 'Opção';
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
