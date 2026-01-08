class ContactPopup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.masterNumber = "5511957800534"; // Seu número
        this.formAction = "https://formsubmit.co/meuapetem@gmail.com"; // Serviço de Form
    }

    connectedCallback() {
        this.render();
        this.addEvents();

        window.addEventListener('open-contact-popup', (e) => {
            const data = e.detail || {};
            // Preenche o campo oculto de interesse/mensagem
            const msgInput = this.shadowRoot.getElementById('inputMessage');
            if (msgInput) msgInput.value = this.generateMessage(data);

            this.open();
        });
    }

    generateMessage(data) {
        if (data.message) return data.message;
        const project = data.project || 'Site MeuApêTem';
        return `Lead vindo do interesse em: ${project}. Tipo: ${data.type || 'Geral'}`;
    }

    open() {
        this.shadowRoot.getElementById('overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.shadowRoot.getElementById('overlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    render() {
        // Pega dados do HTML ou usa padrão
        const photo = this.getAttribute('photo') || '../media/utils/logo-perfil.svg';
        const name = this.getAttribute('name') || 'MeuApêTem';
        const creci = this.getAttribute('creci') || 'CRECI 315675';

        // FormSubmit Config:
        // _next: Redireciona para o WhatsApp após o envio do form (Estratégia Double-Conversion)
        // _captcha: false para não irritar o cliente
        const whatsappRedirect = `https://wa.me/${this.masterNumber}?text=Ol%C3%A1%2C+acabei+de+preencher+o+formul%C3%A1rio+no+site+e+gostaria+de+atendimento.`;

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; --accent: var(--color-highlight, #FF6F61); --bg-dark: #141414; font-family: 'Manrope', sans-serif; }
                
                .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; pointer-events: none; transition: all 0.3s ease; }
                .overlay.active { opacity: 1; visibility: visible; pointer-events: all; }
                
                .modal { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); width: 90%; max-width: 850px; display: grid; grid-template-columns: 1fr 1.5fr; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); transform: translateY(20px); transition: transform 0.4s ease; }
                .overlay.active .modal { transform: translateY(0); }

                /* Coluna Esquerda (Corretor) */
                .broker-col { background: #111; padding: 3rem 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-right: 1px solid #222; }
                .photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent); margin-bottom: 1.5rem; }
                .name { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; color: #fff; margin: 0 0 0.5rem 0; }
                .creci { color: #666; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2rem; }
                .benefit-list { text-align: left; color: #999; font-size: 0.9rem; line-height: 1.6; }
                .benefit-list li { margin-bottom: 0.5rem; list-style: none; }
                .benefit-list i { color: var(--accent); margin-right: 8px; }

                /* Coluna Direita (Formulário) */
                .form-col { padding: 3rem; position: relative; }
                .close-btn { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #555; font-size: 1.5rem; cursor: pointer; transition: 0.2s; }
                .close-btn:hover { color: #fff; }

                h3 { margin: 0 0 1.5rem 0; color: #fff; font-family: 'Space Grotesk', sans-serif; font-weight: 500; font-size: 1.4rem; }
                
                .form-group { margin-bottom: 1.2rem; }
                label { display: block; color: #777; font-size: 0.8rem; margin-bottom: 0.5rem; margin-left: 5px; }
                input { width: 100%; padding: 12px; background: #1a1a1a; border: 1px solid #333; border-radius: 6px; color: #fff; font-family: inherit; font-size: 0.95rem; box-sizing: border-box; transition: 0.3s; }
                input:focus { border-color: var(--accent); outline: none; background: #222; }

                .btn-submit { width: 100%; padding: 14px; background: var(--accent); color: #000; font-weight: 700; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; transition: 0.3s; margin-top: 1rem; }
                .btn-submit:hover { filter: brightness(1.1); transform: translateY(-2px); }

                .alt-action { margin-top: 1.5rem; text-align: center; font-size: 0.85rem; color: #666; border-top: 1px solid #222; padding-top: 1.5rem; }
                .alt-action a { color: #fff; text-decoration: none; border-bottom: 1px dotted #666; transition: 0.2s; }
                .alt-action a:hover { color: var(--accent); border-color: var(--accent); }

                @media (max-width: 768px) {
                    .modal { grid-template-columns: 1fr; width: 95%; height: auto; max-height: 90vh; overflow-y: auto; }
                    .broker-col { padding: 2rem; display: none; /* Esconde foto no mobile para focar no form */ }
                    .form-col { padding: 2rem 1.5rem; }
                }
            </style>

            <div class="overlay" id="overlay">
                <div class="modal">
                    <button class="close-btn" id="close">×</button>
                    
                    <div class="broker-col">
                        <img class="photo" src="${photo}" alt="${name}">
                        <h3 class="name">${name}</h3>
                        <span class="creci">${creci}</span>
                        <ul class="benefit-list">
                            <li>✓ Acesso a Tabela Zero</li>
                            <li>✓ Plantas e Books em PDF</li>
                            <li>✓ Atendimento Consultivo</li>
                        </ul>
                    </div>

                    <div class="form-col">
                        <h3>Receba as Tabelas e Books</h3>
                        
                        <form action="${this.formAction}" method="POST">
                            <input type="hidden" name="_next" value="${whatsappRedirect}">
                            <input type="hidden" name="_captcha" value="false">
                            <input type="hidden" name="_subject" value="Novo Lead Site - MeuApêTem">
                            <input type="hidden" name="_template" value="table">
                            <input type="hidden" name="Mensagem" id="inputMessage" value="">

                            <div class="form-group">
                                <label>Seu Nome</label>
                                <input type="text" name="name" required placeholder="Como prefere ser chamado?">
                            </div>

                            <div class="form-group">
                                <label>Seu WhatsApp (com DDD)</label>
                                <input type="tel" name="phone" required placeholder="(11) 99999-9999">
                            </div>

                            <button type="submit" class="btn-submit">Ver Preços e Plantas</button>
                        </form>

                        <div class="alt-action">
                            Prefere falar agora? <a href="https://wa.me/${this.masterNumber}" target="_blank">Clique para WhatsApp Direto</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addEvents() {
        this.shadowRoot.getElementById('close').onclick = () => this.close();

        // Fecha ao clicar fora
        this.shadowRoot.getElementById('overlay').onclick = (e) => {
            if (e.target.id === 'overlay') this.close();
        };
    }
}
customElements.define('contact-popup', ContactPopup);