/**
 * <manual-strip>
 * Slots: icon, title, text, cta
 * Style vars: --manual-strip-bg, --manual-strip-bg-hover, --manual-strip-border, --manual-strip-icon, --manual-strip-cta-border
 */
class ManualStrip extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .strip {
                    background: var(--manual-strip-bg, linear-gradient(90deg, rgba(255, 111, 97, 0.1), rgba(20, 20, 20, 0.8)));
                    border-left: 2px solid var(--manual-strip-border, var(--color-highlight, #D4AF37));
                    padding: 1.5rem 2rem;
                    margin: 2rem auto 4rem auto;
                    max-width: 1200px;
                    width: 90%;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                    transition: transform 0.3s ease, background 0.3s ease;
                }

                .strip:hover {
                    transform: translateX(10px);
                    background: var(--manual-strip-bg-hover, linear-gradient(90deg, rgba(255, 111, 97, 0.15), rgba(30, 30, 30, 0.9)));
                }

                .content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .icon {
                    color: var(--manual-strip-icon, var(--color-highlight, #D4AF37));
                    font-size: 1.5rem;
                }

                .text h3 {
                    margin: 0;
                    font-size: 1rem;
                    font-family: var(--font-title, 'Space Grotesk', sans-serif);
                    color: var(--color-white, #fff);
                }

                .text p {
                    margin: 0;
                    font-size: 0.85rem;
                    color: var(--color-text-secondary, #A1A1AA);
                }

                ::slotted([slot="cta"]) {
                    white-space: nowrap;
                    color: var(--color-white, #fff);
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 600;
                    padding: 0.5rem 1rem;
                    border: 1px solid var(--manual-strip-cta-border, rgba(255, 255, 255, 0.2));
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                }

                ::slotted([slot="cta"]:hover) {
                    border-color: var(--manual-strip-border, var(--color-highlight, #D4AF37));
                    color: var(--manual-strip-border, var(--color-highlight, #D4AF37));
                }

                ::slotted([slot=\"icon\"]) {
                    color: inherit;
                }

                @media (max-width: 768px) {
                    .strip {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                        padding: 1.5rem;
                    }

                    ::slotted([slot="cta"]) {
                        width: 100%;
                        text-align: center;
                        justify-content: center;
                    }
                }
            </style>

            <div class="strip">
                <div class="content">
                    <span class="icon"><slot name="icon">📘</slot></span>
                    <div class="text">
                        <h3><slot name="title">Guia completo</slot></h3>
                        <p><slot name="text">Conteúdo e dicas essenciais.</slot></p>
                    </div>
                </div>
                <slot name="cta"></slot>
            </div>
        `;
    }
}

customElements.define('manual-strip', ManualStrip);
