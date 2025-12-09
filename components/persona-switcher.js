class PersonaSwitcher extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        console.log('🔧 Persona Switcher: Iniciado!'); // Debug
    }

    connectedCallback() {
        // Tenta ler os modos, se der erro no JSON, usa o padrão
        let modesData;
        try {
            const rawModes = this.getAttribute('modes');
            if (rawModes) modesData = JSON.parse(rawModes);
        } catch (e) {
            console.error('Erro ao ler atributo "modes":', e);
        }

        // Fallback (Padrão se nada for passado)
        this.modes = modesData || [
            { key: 'resident', label: 'Vou Morar' },
            { key: 'investor', label: 'Vou Investir' }
        ];

        this.current = localStorage.getItem('site-persona') || this.modes[0].key;
        this.render();

        // Pequeno delay para garantir que a página ouça o evento
        setTimeout(() => this.dispatchChange(this.current), 100);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    /* Posição segura para Desktop */
                    top: 120px; 
                    right: 20px; 
                    z-index: 10001; /* Z-Index altíssimo para ficar acima do Menu */
                    font-family: sans-serif;
                    display: block; /* Garante que o elemento tenha corpo */
                }

                .switcher-container {
                    background: rgba(10, 10, 10, 0.95); /* Fundo mais sólido */
                    backdrop-filter: blur(12px);
                    padding: 5px;
                    border-radius: 50px;
                    border: 1px solid rgba(255,255,255,0.2);
                    display: flex;
                    gap: 5px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                    transition: transform 0.3s ease;
                }
                
                :host(:hover) .switcher-container { transform: scale(1.02); }

                button {
                    background: transparent;
                    border: none;
                    color: #999;
                    padding: 10px 20px;
                    border-radius: 40px;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }

                button:hover { color: #fff; background: rgba(255,255,255,0.1); }

                /* Botão Ativo */
                button.active {
                    color: #000;
                    background: var(--highlight-color, #FFD700); /* Amarelo Padrão */
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                }

                /* Mobile: Fica embaixo */
                @media(max-width: 768px) {
                    :host { 
                        top: auto; 
                        bottom: 30px; 
                        right: 50%; 
                        transform: translateX(50%); 
                        width: max-content; 
                    }
                    .switcher-container { padding: 4px; }
                    button { padding: 12px 24px; font-size: 0.7rem; }
                }
            </style>

            <div class="switcher-container">
                ${this.modes.map(mode => `
                    <button 
                        class="${mode.key === this.current ? 'active' : ''}" 
                        id="btn-${mode.key}"
                    >
                        ${mode.label}
                    </button>
                `).join('')}
            </div>
        `;

        this.modes.forEach(mode => {
            const btn = this.shadowRoot.getElementById(`btn-${mode.key}`);
            if (btn) btn.addEventListener('click', () => this.switchMode(mode.key));
        });
    }

    switchMode(key) {
        this.current = key;
        localStorage.setItem('site-persona', key);

        this.shadowRoot.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        const activeBtn = this.shadowRoot.getElementById(`btn-${key}`);
        if (activeBtn) activeBtn.classList.add('active');

        this.dispatchChange(key);
    }

    dispatchChange(key) {
        // Dispara evento para a página ouvir
        this.dispatchEvent(new CustomEvent('persona-changed', {
            detail: { mode: key },
            bubbles: true,
            composed: true
        }));
    }
}
customElements.define('persona-switcher', PersonaSwitcher);