class PersonaSwitcher extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.pageData = null; // Armazena os dados do projeto
    }

    connectedCallback() {
        this.render();
        this.initLogic();
    }

    // --- MÉTODO PÚBLICO: Recebe os dados do HTML ---
    setProjectData(data) {
        this.pageData = data;

        // Carrega o estado salvo ou usa o padrão
        const saved = localStorage.getItem('site-persona') || 'resident';
        this.switchPersona(saved);
    }

    switchPersona(mode) {
        // 1. Salva preferência
        localStorage.setItem('site-persona', mode);

        // 2. Atualiza visual dos botões
        this.shadowRoot.querySelectorAll('.btn').forEach(b => {
            b.classList.toggle('active', b.dataset.mode === mode);
        });

        // 3. Dispara evento (para quem mais estiver ouvindo, ex: Analytics)
        window.dispatchEvent(new CustomEvent('persona-changed', { detail: { mode } }));

        // 4. ATUALIZA A PÁGINA (A Mágica acontece aqui)
        if (this.pageData && this.pageData[mode]) {
            this.updatePageContent(this.pageData[mode]);
        }
    }

    updatePageContent(d) {
        const root = document.documentElement;

        // A. Atualiza Cores (CSS Variables)
        if (d.colors) {
            root.style.setProperty('--color-highlight', d.colors.highlight);
            root.style.setProperty('--bg-section-main', d.colors.bgMain);
            root.style.setProperty('--bg-brand-dark', d.colors.bgDark);
            root.style.setProperty('--color-text-secondary', d.colors.textSec);
        }

        // B. Atualiza Componentes (Hero, Showcase, etc)
        this.refreshElement('home', d.hero);

        if (d.showcase) {
            this.refreshElement('concept', {
                highlight: d.showcase.highlight,
                title: d.showcase.title,
                text: d.showcase.text,
                'button-text': d.showcase.btn
            });
        }

        if (d.region) {
            this.refreshElement('location', {
                highlight: d.region.highlight,
                title: d.region.title,
                text: d.region.text
            });
        }

        if (d.amenities) {
            this.refreshElement('amenities', {
                subtitle: d.amenities.subtitle,
                title: d.amenities.title
            });
        }

        if (d.review) this.refreshElement('review', d.review);

        if (d.cta) {
            this.refreshElement('schedule', {
                highlight: d.cta.highlight,
                title: d.cta.title,
                text: d.cta.text,
                'button-text': d.cta.btn
            });
        }

        // C. Marquee (Requer reinício da animação)
        const marquee = document.getElementById('marquee');
        if (marquee && d.marquee) {
            marquee.setAttribute('text', d.marquee);
            // Truque para reiniciar CSS animation
            const newMarquee = marquee.cloneNode(true);
            marquee.parentNode.replaceChild(newMarquee, marquee);
        }

        // D. Stats (Lista)
        if (d.stats) {
            d.stats.forEach(stat => this.refreshElement(stat.id, { number: stat.n, label: stat.l }));
        }

        // E. Plantas (Lista)
        if (d.plans) {
            d.plans.forEach(plan => {
                this.refreshElement(plan.id, {
                    desc: plan.d,
                    'extra-label': plan.l,
                    'extra-val': plan.v
                });
            });
        }

        // F. Botão do Menu
        const menuBtn = document.getElementById('menu-cta');
        if (menuBtn && d.menuBtn) menuBtn.innerText = d.menuBtn;
    }

    // Utilitário para atualizar Web Components sem recriar se não precisar
    refreshElement(id, attributes) {
        const oldEl = document.getElementById(id);
        if (!oldEl) return;

        // Atualiza atributos
        for (const [key, value] of Object.entries(attributes)) {
            oldEl.setAttribute(key, value);
        }

        // Força re-render clonando o nó (necessário para alguns componentes redesenharem)
        const newEl = oldEl.cloneNode(true);
        oldEl.parentNode.replaceChild(newEl, oldEl);
    }

    initLogic() {
        const btns = this.shadowRoot.querySelectorAll('.btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchPersona(btn.dataset.mode);
            });
        });
    }

    render() {
        // Pega a configuração dos botões do atributo HTML ou usa padrão
        const modes = JSON.parse(this.getAttribute('modes') || '[{"key":"resident","label":"Morar"},{"key":"investor","label":"Investir"}]');

        const buttonsHtml = modes.map(m =>
            `<button class="btn" data-mode="${m.key}">${m.label}</button>`
        ).join('');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
                    z-index: 9990;
                    background: rgba(20, 20, 20, 0.9);
                    backdrop-filter: blur(10px);
                    padding: 5px;
                    border-radius: 50px;
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex; gap: 0;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .btn {
                    background: transparent; border: none;
                    color: var(--color-surface-200, #888);
                    font-family: var(--font-text, sans-serif);
                    font-size: 0.85rem; font-weight: 600;
                    padding: 12px 24px;
                    border-radius: 40px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }
                .btn.active {
                    background: var(--color-highlight, var(--color-white, #fff));
                    color: var(--color-black, #000);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                }
                .btn:hover:not(.active) { color: var(--color-white, #fff); }

                @media (max-width: 768px) {
                    :host { bottom: 1.5rem; width: auto; max-width: 90%; }
                    .btn { padding: 10px 20px; font-size: 0.8rem; }
                }
            </style>
            ${buttonsHtml}
        `;
    }
}
customElements.define('persona-switcher', PersonaSwitcher);
