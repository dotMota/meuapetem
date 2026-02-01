/**
 * <floating-actions>
 * Attributes: none
 * Events: dispatches window 'open-contact-popup' for CTA, chat, and WhatsApp actions.
 */
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
                    bottom: 2.5rem;
                    right: 2.5rem;
                    z-index: 9000;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 15px;
                    font-family: 'Manrope', sans-serif;
                    pointer-events: none;
                }

                /* Container que segura tudo para animar a entrada */
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 15px;
                    
                    /* Começa escondido para baixo */
                    transform: translateY(150%);
                    opacity: 0;
                    animation: slideUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 3s forwards; /* Delay de 3s */
                }

                /* Balão de Fala do Corretor */
                .chat-bubble {
                    background: var(--color-white, #fff);
                    color: var(--color-black, #000);
                    padding: 12px 20px;
                    border-radius: 20px 20px 0 20px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: -5px;
                    opacity: 0;
                    transform: scale(0.8);
                    transform-origin: bottom right;
                    animation: popIn 0.5s ease 5s forwards; /* Aparece 2s depois do botão */
                    border: 1px solid var(--color-surface-200, #eee);
                    pointer-events: auto;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .chat-bubble::after {
                    content: '👋';
                    font-size: 1.2em;
                }

                /* Botão "Consultar Valores" (Antigo Baixar Tabela) */
                .bait-btn {
                    pointer-events: auto;
                    background: var(--color-white, #fff);
                    color: var(--color-black, #000);
                    padding: 12px 24px;
                    border-radius: 50px;
                    font-weight: 800;
                    font-size: 0.9rem;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    border: 2px solid var(--color-highlight, #FF6F61);
                    transition: transform 0.2s ease;
                }
                
                .bait-btn:hover {
                    transform: scale(1.05);
                    background: var(--color-highlight, #FF6F61);
                    color: var(--color-white, #fff);
                }

                /* Botão WhatsApp */
                .fab {
                    pointer-events: auto;
                    width: 70px;
                    height: 70px;
                    background-color: var(--color-success, #25d366);
                    border-radius: 50%;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    text-decoration: none;
                    color: var(--color-white, #fff);
                    position: relative;
                }

                .fab:hover { transform: scale(1.1); }

                .fab svg { width: 38px; height: 38px; fill: currentColor; }
                
                /* Notificação Vermelha */
                .badge {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: var(--color-danger, red);
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    border: 2px solid var(--color-white, #fff);
                    animation: pulseBadge 2s infinite;
                }

                @keyframes slideUp {
                    to { transform: translateY(0); opacity: 1; }
                }

                @keyframes popIn {
                    to { opacity: 1; transform: scale(1); }
                }
                
                @keyframes pulseBadge {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }

                @media (max-width: 768px) {
                    :host { bottom: 1.5rem; right: 1.5rem; }
                    .chat-bubble { font-size: 0.85rem; padding: 10px 16px; }
                    .bait-btn { padding: 10px 20px; font-size: 0.85rem; }
                    .fab { width: 60px; height: 60px; }
                    .fab svg { width: 30px; height: 30px; }
                }
            </style>

            <div class="container">
                <div class="chat-bubble" id="msgTrigger">
                    Olá! Posso ajudar?
                </div>

                <div class="bait-btn" id="baitTrigger">
                    <span>💲</span> 
                    <div>CONSULTAR VALORES</div>
                </div>

                <a class="fab" id="waTrigger">
                    <div class="badge"></div>
                    <svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.357 1.849 6.069l-1.2 4.368 4.459-1.164zm12.382-7.575c-.197-.426-.957-1.18-1.164-1.353-.208-.173-.418-.215-.626-.215-.213 0-.422.043-.633.26-.209.213-.831.831-.957 1.002-.124.172-.249.183-.456.043-.207-.133-1.134-.413-2.158-1.334-.799-.71-1.34-1.597-1.492-1.858-.152-.261-.01-."/></svg>
                </a>
            </div>
        `;
    }

    addEvents() {
        // Todos abrem o form, mas com mensagens diferentes
        
        this.shadowRoot.getElementById('baitTrigger').onclick = () => {
            window.dispatchEvent(new CustomEvent('open-contact-popup', {
                detail: { type: 'lead_magnet', message: 'Interesse em: Consultar Valores e Condições' }
            }));
        };

        this.shadowRoot.getElementById('msgTrigger').onclick = () => {
            window.dispatchEvent(new CustomEvent('open-contact-popup', {
                detail: { type: 'chat', message: 'Respondeu ao chamado: "Posso ajudar?"' }
            }));
        };

        this.shadowRoot.getElementById('waTrigger').onclick = () => {
             window.dispatchEvent(new CustomEvent('open-contact-popup', {
                detail: { type: 'general', message: 'Clicou no ícone do WhatsApp' }
            }));
        };
    }
}
customElements.define('floating-actions', FloatingActions);
