class CtaSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const highlight = this.getAttribute('highlight') || '';
        const title = this.getAttribute('title') || '';
        const text = this.getAttribute('text') || '';
        const btnText = this.getAttribute('button-text') || 'Saiba Mais';
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
        if (text && !this.querySelector('[slot="text"]')) {
            const p = document.createElement('p');
            p.setAttribute('slot', 'text');
            p.textContent = text;
            this.appendChild(p);
        }
        if (btnText && !this.querySelector('[slot="button-text"]')) {
            const span = document.createElement('span');
            span.setAttribute('slot', 'button-text');
            span.textContent = btnText;
            this.appendChild(span);
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
                    background: var(--bg-gradient, #111);
                    padding: var(--section-padding, 8rem 10%);
                    border-top: var(--border-top, 1px solid #222); 
                    text-align: center;
                }
                .container { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
                
                .hl, ::slotted([slot="highlight"]) { 
                    color: var(--highlight-color, #c5a065); 
                    font-family: var(--font-text, sans-serif);
                    text-transform: uppercase; letter-spacing: 4px; font-size: 0.8rem; font-weight: 600; display: block; 
                }
                .tt, ::slotted([slot="title"]) { 
                    font-family: var(--font-title, serif); 
                    font-size: 3rem; color: #fff; margin: 0; line-height: 1.1; font-weight: 400; 
                }
                .txt, ::slotted([slot="text"]) { 
                    font-family: var(--font-text, sans-serif);
                    font-size: 1.1rem; 
                    color: var(--text-color, #ccc); 
                    line-height: 1.6; max-width: 600px; margin: 0; font-weight: 300; 
                }
                
                .btn, ::slotted([slot="button-text"]) {
                    display: inline-block; margin-top: 2rem; padding: 1.2rem 4rem;
                    background: transparent; 
                    border: 1px solid var(--highlight-color, #c5a065); 
                    color: var(--highlight-color, #c5a065);
                    font-family: var(--font-title, serif); 
                    font-size: 1rem; text-transform: uppercase; letter-spacing: 3px;
                    transition: all 0.4s ease; cursor: pointer;
                }
                .btn:hover { 
                    background: var(--highlight-color, #c5a065); 
                    color: #000; padding: 1.2rem 5rem; 
                }
                
                @media (max-width: 768px) {
                    :host { padding: 5rem 5%; }
                    .tt { font-size: 2.5rem; }
                    .btn:hover { padding: 1.2rem 4rem; }
                }
            </style>

            <div class="container">
                <slot name="highlight"></slot>
                <slot name="title"></slot>
                <slot name="text"></slot>
                <button class="btn" id="actionBtn"><slot name="button-text"></slot></button>
            </div>
            <slot name="project" hidden></slot>
        `;

        this.shadowRoot.getElementById('actionBtn').onclick = () => {
            const projectSlot = this.querySelector('[slot="project"]');
            const project = projectSlot ? projectSlot.textContent.trim() : document.title;
            const persona = localStorage.getItem('site-persona');
            let intentString = '';

            // Lógica Condicional aqui também
            if (project.includes('Elev')) {
                if (persona === 'investor') intentString = ' para investimento';
                else if (persona === 'resident') intentString = ' para moradia';
            }

            const btnSlot = this.querySelector('[slot="button-text"]');
            const btnText = btnSlot ? btnSlot.textContent.trim() : 'Saiba Mais';
            const msg = `Olá! Estou vendo o projeto ${project}${intentString}. Gostaria de ${btnText}.`;

            window.dispatchEvent(new CustomEvent('open-contact-popup', {
                detail: { message: msg }
            }));
        };
    }
}
customElements.define('cta-section', CtaSection);
