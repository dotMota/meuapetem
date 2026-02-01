/**
 * <contact-popup>
 * Attributes: photo, name, creci
 * Events: listens for window 'open-contact-popup' (detail: { message, project })
 */
class ContactPopup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.masterNumber = "5511957800534"; 
        this.formAction = "https://formsubmit.co/meuapetem@gmail.com";
        this.googleAdsId = "AW-17794513059"; 
        this.conversionLabel = "w2ExCN2Ust8bEKPxiqVC";
    }

    connectedCallback() {
        this.render();
        this.addEvents();
        this.applyPhoneMask();

        window.addEventListener('open-contact-popup', (e) => {
            const data = e.detail || {};
            let pageTitle = document.title.split('|')[0].trim();
            const currentContext = data.project || pageTitle;
            const actionSource = data.message || 'Contato Geral';

            const inputPage = this.shadowRoot.getElementById('inputPage');
            const inputAction = this.shadowRoot.getElementById('inputAction');
            const inputMessage = this.shadowRoot.getElementById('inputMessage');

            if (inputPage) inputPage.value = currentContext;
            if (inputAction) inputAction.value = actionSource;
            if (inputMessage) inputMessage.value = `Lead: ${currentContext} | Via: ${actionSource}`;

            this.open();
        });
    }

    open() { 
        this.shadowRoot.getElementById('overlay').classList.add('active'); 
        document.body.style.overflow = 'hidden'; 
    }
    
    close() { 
        this.shadowRoot.getElementById('overlay').classList.remove('active'); 
        document.body.style.overflow = ''; 
    }

    applyPhoneMask() {
        const phoneInput = this.shadowRoot.getElementById('phoneInput');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 10) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            } else if (value.length > 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
            } else if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            }
            e.target.value = value;
        });
    }

    trackConversion() {
        if (typeof gtag === 'function') {
            const fullTag = `${this.googleAdsId}/${this.conversionLabel}`;
            gtag('event', 'conversion', { 'send_to': fullTag });
        }
    }

    render() {
        const photo = this.getAttribute('photo') || '../media/utils/logo-perfil.svg';
        const name = this.getAttribute('name') || 'MeuApêTem';
        const creci = this.getAttribute('creci') || 'CRECI 315675';
        
        // Mensagem mais natural para o cliente iniciar a conversa
        const whatsappRedirect = `https://wa.me/${this.masterNumber}?text=Ol%C3%A1%2C+gostaria+de+saber+os+valores+e+disponibilidade+de+unidades.`;

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; --accent: var(--color-highlight, #FF6F61); font-family: 'Manrope', sans-serif; }
                .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; pointer-events: none; transition: all 0.3s ease; }
                .overlay.active { opacity: 1; visibility: visible; pointer-events: all; }
                .modal { background: var(--bg-page-body, var(--color-surface-900, #0a0a0a)); border: 1px solid var(--color-white-10, rgba(255,255,255,0.1)); width: 90%; max-width: 850px; display: grid; grid-template-columns: 1fr 1.5fr; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); transform: translateY(20px); transition: transform 0.4s ease; }
                .overlay.active .modal { transform: translateY(0); }
                .broker-col { background: var(--color-surface-800, #111); padding: 3rem 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-right: 1px solid var(--color-surface-600, #222); }
                .photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent); margin-bottom: 1.5rem; }
                .name { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; color: var(--color-white, #fff); margin: 0; }
                .creci { color: var(--color-surface-300, #666); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 2rem; }
                
                /* Lista de Benefícios atualizada para VENDAS */
                .benefit-list { text-align: left; color: var(--color-surface-200, #999); font-size: 0.9rem; list-style: none; padding: 0; }
                .benefit-list li { margin-bottom: 0.8rem; display: flex; align-items: center; gap: 8px; }
                .benefit-list li span { color: var(--accent); font-weight: bold; }

                .form-col { padding: 3rem; position: relative; }
                .close-btn { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: var(--color-surface-200, #777); font-size: 2rem; line-height: 1; cursor: pointer; z-index: 10; transition: 0.2s; }
                .close-btn:hover { color: var(--color-white, #fff); transform: rotate(90deg); }

                h3 { margin: 0 0 1.5rem 0; color: var(--color-white, #fff); font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; }
                .form-group { margin-bottom: 1.2rem; }
                label { display: block; color: var(--color-surface-200, #777); font-size: 0.8rem; margin-bottom: 0.5rem; }
                input { width: 100%; padding: 12px; background: var(--color-surface-700, #1a1a1a); border: 1px solid var(--color-surface-500, #333); border-radius: 6px; color: var(--color-white, #fff); box-sizing: border-box; }
                input:focus { border-color: var(--accent); outline: none; }
                
                .btn-submit { width: 100%; padding: 14px; background: var(--accent); color: var(--color-black, #000); font-weight: 700; border: none; border-radius: 6px; cursor: pointer; text-transform: uppercase; transition: 0.3s; margin-top: 10px; }
                .btn-submit:hover { filter: brightness(1.1); transform: translateY(-2px); }
                
                .alt-action { margin-top: 1.5rem; text-align: center; font-size: 0.85rem; color: var(--color-surface-300, #666); border-top: 1px solid var(--color-surface-600, #222); padding-top: 1.5rem; }
                .alt-action a { color: var(--color-white, #fff); text-decoration: none; border-bottom: 1px dotted var(--color-surface-300, #666); transition: 0.2s; }

                @media (max-width: 768px) { 
                    .modal { grid-template-columns: 1fr; width: 95%; max-height: 90vh; overflow-y: auto; } 
                    .broker-col { display: none; } 
                    .form-col { padding: 2rem 1.5rem; } 
                }
            </style>

            <div class="overlay" id="overlay">
                <div class="modal">
                    <div class="broker-col">
                        <img class="photo" src="${photo}" alt="${name}">
                        <h3 class="name">${name}</h3>
                        <span class="creci">${creci}</span>
                        <ul class="benefit-list">
                            <li><span>✓</span> Disponibilidade de Unidades</li>
                            <li><span>✓</span> Condições de Pagamento</li>
                            <li><span>✓</span> Agendamento de Visita</li>
                        </ul>
                    </div>
                    
                    <div class="form-col">
                        <button class="close-btn" id="close">×</button>
                        
                        <h3>Consultar Valores</h3>
                        <p style="color: var(--color-surface-200, #888); font-size: 0.9rem; margin-bottom: 1.5rem;">Preencha para receber atendimento exclusivo sobre as unidades disponíveis.</p>
                        
                        <form action="${this.formAction}" method="POST">
                            <input type="hidden" name="_next" value="${whatsappRedirect}">
                            <input type="hidden" name="_captcha" value="false">
                            
                            <input type="hidden" name="Produto_Pagina" id="inputPage">
                            <input type="hidden" name="Botao_Clicado" id="inputAction">
                            <input type="hidden" name="Resumo_Lead" id="inputMessage">

                            <div class="form-group">
                                <label>Seu Nome</label>
                                <input type="text" name="name" required placeholder="Como podemos te chamar?">
                            </div>

                            <div class="form-group">
                                <label>Seu WhatsApp</label>
                                <input type="tel" name="phone" id="phoneInput" required placeholder="(11) 99999-9999" maxlength="15">
                            </div>

                            <button type="submit" class="btn-submit">Ver Disponibilidade</button>
                        </form>

                        <div class="alt-action">
                            Prefere ligar? <a href="tel:${this.masterNumber}" target="_blank">Ligar Agora</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addEvents() {
        const closeBtn = this.shadowRoot.getElementById('close');
        if(closeBtn) closeBtn.onclick = () => this.close();
        
        const overlay = this.shadowRoot.getElementById('overlay');
        if(overlay) overlay.onclick = (e) => { 
            if (e.target.id === 'overlay') this.close(); 
        };

        const form = this.shadowRoot.querySelector('form');
        if(form) {
            form.addEventListener('submit', () => {
                this.trackConversion();
            });
        }
    }
}
customElements.define('contact-popup', ContactPopup);
