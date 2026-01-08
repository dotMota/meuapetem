class FloatingActions extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEvents();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    z-index: 9000;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 10px;
                    font-family: 'Manrope', sans-serif;
                }

                /* Botão Isca (Tabela) */
                .bait-btn {
                    background: #fff;
                    color: #000;
                    padding: 10px 20px;
                    border-radius: 50px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    text-decoration: none;
                    animation: pulse 3s infinite;
                    border: 1px solid var(--color-highlight, #FF6F61);
                }
                
                .bait-btn:hover {
                    transform: scale(1.05);
                    background: var(--color-highlight, #FF6F61);
                    color: #fff;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
                }

                /* Botão WhatsApp (Principal) */
                .fab {
                    width: 60px;
                    height: 60px;
                    background-color: #25d366;
                    border-radius: 50%;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    text-decoration: none;
                    color: white;
                    font-size: 30px;
                }

                .fab:hover {
                    transform: scale(1.1);
                    background-color: #20ba5a;
                }

                .fab svg {
                    width: 32px;
                    height: 32px;
                    fill: currentColor;
                }

                @media (max-width: 768px) {
                    :host { bottom: 1.5rem; right: 1.5rem; }
                    .bait-btn { padding: 8px 16px; font-size: 0.8rem; }
                    .fab { width: 50px; height: 50px; }
                    .fab svg { width: 26px; height: 26px; }
                }
            </style>

            <div class="bait-btn" id="baitTrigger">
                <span>📄</span> Baixar Tabela
            </div>

            <a class="fab" id="waTrigger">
                <svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.357 1.849 6.069l-1.2 4.368 4.459-1.164zm12.382-7.575c-.197-.426-.957-1.18-1.164-1.353-.208-.173-.418-.215-.626-.215-.213 0-.422.043-.633.26-.209.213-.831.831-.957 1.002-.124.172-.249.183-.456.043-.207-.133-1.134-.413-2.158-1.334-.799-.71-1.34-1.597-1.492-1.858-.152-.261-.01-."/></svg>
            </a>
        `;
    }

    addEvents() {
        // O botão Tabela abre o Form
        this.shadowRoot.getElementById('baitTrigger').onclick = () => {
            window.dispatchEvent(new CustomEvent('open-contact-popup', {
                detail: { type: 'lead_magnet', message: 'Interesse em Baixar Tabela de Preços' }
            }));
        };

        // O botão WhatsApp abre o Form também (mas a pessoa pode clicar em "WhatsApp Direto" lá dentro se quiser)
        // Isso força a pessoa a ver o form antes. Se preferir direto, mude abaixo para window.open no link do whats.
        this.shadowRoot.getElementById('waTrigger').onclick = () => {
            window.dispatchEvent(new CustomEvent('open-contact-popup', {
                detail: { type: 'general', message: 'Olá, gostaria de atendimento.' }
            }));
        };
    }
}
customElements.define('floating-actions', FloatingActions);