class CustomCursor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.initClickEffect();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none; z-index: 99999;
                    mix-blend-mode: difference;
                }

                /* O círculo do efeito */
                .click-ripple {
                    position: absolute;
                    width: 20px; height: 20px;
                    border-radius: 50%;
                    background: transparent;
                    border: 2px solid var(--color-highlight, #c5a065); /* Dourado */
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 0;
                    transition: transform 0.4s ease-out, opacity 0.4s ease-out;
                }

                /* Classe ativa para animar */
                .click-ripple.active {
                    transform: translate(-50%, -50%) scale(2.5);
                    opacity: 1;
                    background: color-mix(in srgb, var(--color-highlight, #c5a065) 20%, transparent);
                }
            </style>

            <div class="click-ripple" id="ripple"></div>
        `;
    }

    initClickEffect() {
        const ripple = this.shadowRoot.getElementById('ripple');
        let timeout;

        // Ouve cliques na página inteira
        window.addEventListener('click', (e) => {
            // Reposiciona instantaneamente onde foi o clique/toque
            ripple.style.left = `${e.clientX}px`;
            ripple.style.top = `${e.clientY}px`;

            // Remove a classe de animação para resetar (caso clique rápido)
            ripple.classList.remove('active');
            // Força reflow
            void ripple.offsetWidth;

            // Ativa a animação (Aparece e cresce)
            ripple.classList.add('active');

            // Limpa timeout anterior se houver
            clearTimeout(timeout);

            // Desaparece após a animação
            timeout = setTimeout(() => {
                ripple.classList.remove('active');
            }, 400); // Tempo igual ao da transição CSS
        });
    }
}

customElements.define('custom-cursor', CustomCursor);
