class ContactPopup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.masterNumber = "5511957800534"; // Número mestre
        this.currentMessage = '';
    }

    connectedCallback() {
        this.render();
        this.addEvents();

        window.addEventListener('open-contact-popup', (e) => {
            const data = e.detail || {};
            this.currentMessage = this.generateMessage(data);
            this.updateLinks();
            this.open();
        });
    }

    generateMessage(data) {
        if (data.message) return data.message;

        const persona = localStorage.getItem('site-persona');
        const project = data.project || 'MeuApêTem';

        let profileText = "";
        if (project.toLowerCase().includes("elev")) {
            profileText = persona === 'investor' ? " para investimento" : " para moradia";
        }

        switch (data.type) {
            case 'plan':
                return `Olá! Estou vendo o projeto *${project}*${profileText}. Gostei da planta *${data.title}* e gostaria de receber o Book Digital.`;
            case 'cta':
                return `Olá! Estou vendo o projeto *${project}*${profileText}. Gostaria de ${data.action || 'mais informações'}.`;
            case 'consultancy':
                return "Olá! Estou navegando no site MeuApêTem e gostaria de uma consultoria para encontrar o imóvel ideal.";
            default:
                return "Olá! Gostaria de saber mais sobre os imóveis da MeuApêTem.";
        }
    }

    open() { this.shadowRoot.getElementById('overlay').classList.add('active'); document.body.style.overflow = 'hidden'; this.resetView(); }
    close() { this.shadowRoot.getElementById('overlay').classList.remove('active'); document.body.style.overflow = ''; }

    updateLinks() {
        const encodedMsg = encodeURIComponent(this.currentMessage);
        const fullUrl = `https://wa.me/${this.masterNumber}?text=${encodedMsg}`;

        const btnWa = this.shadowRoot.getElementById('triggerWa');
        if (btnWa) btnWa.onclick = () => {
            if (window.innerWidth <= 768) { window.open(fullUrl, '_blank'); }
            else { this.toggleQrView(); }
        };

        const linkWeb = this.shadowRoot.getElementById('linkWeb');
        if (linkWeb) linkWeb.href = fullUrl;

        const qrImg = this.shadowRoot.getElementById('qrImg');
        if (qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${fullUrl}`;
    }

    toggleQrView() { this.shadowRoot.getElementById('actionsContainer').classList.toggle('show-qr'); }
    resetView() { this.shadowRoot.getElementById('actionsContainer').classList.remove('show-qr'); }

    render() {
        // --- DADOS PADRÃO CENTRALIZADOS AQUI ---
        // Se o HTML não tiver atributo, usa estes valores:
        const photoSlot = this.querySelector('[slot="photo"]');
        const nameSlot = this.querySelector('[slot="name"]');
        const creciSlot = this.querySelector('[slot="creci"]');
        const emailSlot = this.querySelector('[slot="email"]');
        const phoneSlot = this.querySelector('[slot="phone"]');

        const photo = photoSlot?.getAttribute('src') || '../media/utils/logo-perfil.svg';
        const name = nameSlot?.textContent?.trim() || 'MeuApêTem';
        const creci = creciSlot?.textContent?.trim() || 'CRECI 315675';
        const email = emailSlot?.textContent?.trim() || 'meuapetem@gmail.com';
        const phone = phoneSlot?.textContent?.trim() || '11 95780-0534';
        const phoneClean = phone.replace(/\D/g, '');

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; --accent: var(--color-highlight, #c5a065); --bg-dark: var(--bg-page-body, #050505); font-family: sans-serif; }
                .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; pointer-events: none; transition: all 0.3s ease; }
                .overlay.active { opacity: 1; visibility: visible; pointer-events: all; }
                .modal { background: linear-gradient(145deg, #1f1f1f, #0f0f0f); border: 1px solid rgba(197, 160, 101, 0.3); padding: 3rem; border-radius: 8px; width: 90%; max-width: 800px; position: relative; transform: scale(0.95); transition: transform 0.3s ease; box-shadow: 0 20px 60px rgba(0,0,0,0.8); }
                .overlay.active .modal { transform: scale(1); }
                .close-btn { position: absolute; top: 1rem; right: 1.5rem; background: none; border: none; color: #666; font-size: 2rem; cursor: pointer; transition: 0.3s; z-index: 10; }
                .close-btn:hover { color: var(--accent); }
                .grid { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 3rem; align-items: stretch; }
                .broker-col { text-align: center; border-right: 1px solid rgba(255,255,255,0.1); padding-right: 2rem; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 250px; }
                .photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent); margin-bottom: 1rem; background: var(--bg-dark); }
                .name { font-family: serif; font-size: 1.8rem; color: #fff; margin: 0; line-height: 1.2; }
                .creci { color: #888; font-size: 0.8rem; display: block; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1.5rem; }
                .contact-row { color: #ccc; font-size: 0.9rem; margin-bottom: 8px; }
                .contact-row strong { color: var(--accent); margin-right: 5px; }
                .actions-col { position: relative; display: flex; flex-direction: column; justify-content: center; min-height: 250px; }
                .view-default, .view-qr { width: 100%; display: flex; flex-direction: column; gap: 1rem; transition: opacity 0.4s ease, transform 0.4s ease; }
                .view-default { opacity: 1; transform: translateY(0); pointer-events: all; }
                .view-qr { opacity: 0; transform: translateY(20px); pointer-events: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%; align-items: center; justify-content: center; text-align: center; background: var(--bg-dark); z-index: 5; }
                .actions-col.show-qr .view-default { opacity: 0; transform: translateY(-20px); pointer-events: none; }
                .actions-col.show-qr .view-qr { opacity: 1; transform: translateY(0); pointer-events: all; }
                .action-btn { display: flex; align-items: center; justify-content: center; width: 100%; padding: 1rem; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; cursor: pointer; transition: 0.3s; box-sizing: border-box; }
                .action-btn:hover { background: var(--accent); border-color: var(--accent); color: #000; }
                .wa-btn { width: 100%; padding: 1rem; background: rgba(37, 211, 102, 0.1); border: 1px solid #25d366; color: #25d366; text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; box-sizing: border-box; }
                .wa-btn:hover { background: #25d366; color: #fff; }
                .qr-img { width: 140px; height: 140px; border: 4px solid #fff; border-radius: 4px; margin-bottom: 1rem; object-fit: contain; background: #fff; }
                .qr-text { color: #aaa; font-size: 0.9rem; margin-bottom: 1rem; }
                .back-link { color: #666; font-size: 0.8rem; text-decoration: underline; cursor: pointer; margin-top: 1rem; }
                @media (max-width: 768px) { .modal { padding: 2rem; max-height: 90vh; overflow-y: auto; } .grid { grid-template-columns: 1fr; gap: 2rem; } .broker-col { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2rem; padding-right: 0; min-height: auto; } }
            </style>
            <div class="overlay" id="overlay">
                <div class="modal">
                    <button class="close-btn" id="close">×</button>
                    <div class="grid">
                        <div class="broker-col">
                            <img class="photo" src="${photo}" alt="${name}" onerror="this.style.display='none'">
                            <h3 class="name">${name}</h3>
                            <span class="creci">${creci}</span>
                            <div class="contact-list">
                                ${phone ? `<div class="contact-row"><strong>Tel:</strong> ${phone}</div>` : ''}
                                ${email ? `<div class="contact-row"><strong>Email:</strong> ${email}</div>` : ''}
                            </div>
                        </div>
                        <div class="actions-col" id="actionsContainer">
                            <div class="view-default">
                                ${email ? `<a href="mailto:${email}" class="action-btn">Enviar E-mail</a>` : ''}
                                ${phone ? `<a href="tel:+55${phoneClean}" class="action-btn">Ligar Agora</a>` : ''}
                                <button class="wa-btn" id="triggerWa">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.357 1.849 6.069l-1.2 4.368 4.459-1.164zm12.382-7.575c-.197-.426-.957-1.18-1.164-1.353-.208-.173-.418-.215-.626-.215-.213 0-.422.043-.633.26-.209.213-.831.831-.957 1.002-.124.172-.249.183-.456.043-.207-.133-1.134-.413-2.158-1.334-.799-.71-1.34-1.597-1.492-1.858-.152-.261-.01-."/></svg>
                                    Iniciar Conversa no WhatsApp
                                </button>
                            </div>
                            <div class="view-qr">
                                <div class="qr-text">Escaneie para falar com <strong>${name}</strong></div>
                                <img src="" class="qr-img" id="qrImg" alt="QR Code">
                                <a href="#" target="_blank" class="wa-btn" id="linkWeb" style="width: auto; padding: 0.8rem 2rem;">Abrir WhatsApp Web</a>
                                <div class="back-link" id="backBtn">Voltar para opções</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addEvents() {
        this.shadowRoot.getElementById('close').onclick = () => this.close();
        this.shadowRoot.getElementById('overlay').onclick = (e) => { if (e.target.id === 'overlay') this.close(); };
        this.shadowRoot.getElementById('backBtn').onclick = () => this.resetView();
    }
}
customElements.define('contact-popup', ContactPopup);
