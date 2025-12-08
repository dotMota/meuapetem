class CustomCursor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.initCursor();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    pointer-events: none; /* Deixa o clique passar */
                    z-index: 99999;
                    mix-blend-mode: difference; /* Garante visibilidade em fundo claro/escuro */
                }

                /* A Bolinha Pequena (Centro) */
                .dot {
                    position: fixed;
                    top: 0; left: 0;
                    width: 8px; height: 8px;
                    background-color: #c5a065;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    transition: transform 0.1s;
                }

                /* O Círculo Grande (Seguidor) */
                .circle {
                    position: fixed;
                    top: 0; left: 0;
                    width: 40px; height: 40px;
                    border: 1px solid rgba(197, 160, 101, 0.5);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    transition: width 0.3s, height 0.3s, background-color 0.3s, transform 0.15s ease-out;
                }

                /* Estado Hover (Quando passa em links/botões) */
                :host(.hovering) .circle {
                    width: 80px;
                    height: 80px;
                    background-color: rgba(197, 160, 101, 0.1);
                    border-color: #c5a065;
                    backdrop-filter: blur(2px);
                }
                
                /* Esconde em telas touch/celular */
                @media (hover: none) {
                    :host { display: none; }
                }
            </style>

            <div class="circle" id="circle"></div>
            <div class="dot" id="dot"></div>
        `;
    }

    initCursor() {
        const circle = this.shadowRoot.getElementById('circle');
        const dot = this.shadowRoot.getElementById('dot');

        // Move o cursor
        window.addEventListener('mousemove', (e) => {
            // Move a bolinha instantaneamente
            dot.style.left = `${e.clientX}px`;
            dot.style.top = `${e.clientY}px`;

            // Move o círculo com um leve delay (efeito fluido)
            // setTimeout ajuda a descolar um pouco do mouse nativo visualmente
            setTimeout(() => {
                circle.style.left = `${e.clientX}px`;
                circle.style.top = `${e.clientY}px`;
            }, 10);
            
            this.checkHover(e);
        });
    }

    // Verifica se estamos passando por cima de algo clicável
    checkHover(e) {
        // composedPath() pega todos os elementos abaixo do mouse, 
        // inclusive os que estão dentro de Shadow DOMs (nossos componentes)
        const path = e.composedPath();
        
        let isHovering = false;

        for (const el of path) {
            if (el instanceof HTMLElement) {
                const tag = el.tagName.toLowerCase();
                // Lista de coisas que ativam o cursor
                if (
                    tag === 'a' || 
                    tag === 'button' || 
                    tag === 'select' ||
                    tag === 'input' ||
                    el.classList.contains('hover-target') || // Classe manual
                    el.getAttribute('onclick') // Elementos com clique inline
                ) {
                    isHovering = true;
                    break;
                }
            }
        }

        if (isHovering) {
            this.classList.add('hovering');
        } else {
            this.classList.remove('hovering');
        }
    }
}

customElements.define('custom-cursor', CustomCursor);