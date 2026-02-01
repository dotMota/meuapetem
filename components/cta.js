/**
 * <cta-section>
 * Attributes: highlight, title, text, button-text, project
 * Events: dispatches window 'open-contact-popup' on CTA click.
 */
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
        const project = this.getAttribute('project') || document.title;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: var(--bg-gradient, var(--color-surface-800, #111));
                    padding: var(--section-padding, 8rem 10%);
                    border-top: var(--border-top, 1px solid var(--color-surface-600, #222)); 
                    text-align: center;
                }
                .container { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
                
                .hl { 
                    color: var(--highlight-color, #c5a065); 
                    font-family: var(--font-text, sans-serif);
                    text-transform: uppercase; letter-spacing: 4px; font-size: 0.8rem; font-weight: 600; display: block; 
                }
                .tt { 
                    font-family: var(--font-title, serif); 
                    font-size: 3rem; color: var(--color-text-primary, var(--color-white, #fff)); margin: 0; line-height: 1.1; font-weight: 400; 
                }
                .txt { 
                    font-family: var(--font-text, sans-serif);
                    font-size: 1.1rem; 
                    color: var(--text-color, #ccc); 
                    line-height: 1.6; max-width: 600px; margin: 0; font-weight: 300; 
                }
                
                .btn {
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
                    color: var(--color-black, #000); padding: 1.2rem 5rem; 
                }
                
                @media (max-width: 768px) {
                    :host { padding: 5rem 5%; }
                    .tt { font-size: 2.5rem; }
                    .btn:hover { padding: 1.2rem 4rem; }
                }
            </style>

            <div class="container">
                <span class="hl">${highlight}</span>
                <h2 class="tt">${title}</h2>
                <p class="txt">${text}</p>
                <button class="btn" id="actionBtn">${btnText}</button>
            </div>
        `;

        this.shadowRoot.getElementById('actionBtn').onclick = () => {
            const persona = localStorage.getItem('site-persona');
            let intentString = '';

            // Lógica Condicional aqui também
            if (project.includes('Elev')) {
                if (persona === 'investor') intentString = ' para investimento';
                else if (persona === 'resident') intentString = ' para moradia';
            }

            const msg = `Olá! Estou vendo o projeto ${project}${intentString}. Gostaria de ${btnText}.`;

            window.dispatchEvent(new CustomEvent('open-contact-popup', {
                detail: { message: msg }
            }));
        };
    }
}
customElements.define('cta-section', CtaSection);
