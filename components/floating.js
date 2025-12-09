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
                    position: fixed; bottom: 2rem; right: 2rem; z-index: 9998;
                    display: flex; flex-direction: column; gap: 15px;
                }
                .btn {
                    width: 50px; height: 50px; border-radius: 50%; border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5); color: #fff; transition: transform 0.3s;
                }
                .btn:hover { transform: translateY(-3px); }
                .share { background: #333; width: 40px; height: 40px; align-self: center; }
                .whatsapp { background: #25d366; width: 60px; height: 60px; font-size: 30px; }
                svg { width: 50%; height: 50%; fill: currentColor; }

                /* --- CORREÇÃO MOBILE: SOBE PARA NÃO ENCOBRIR PERSONA SWITCHER --- */
                @media (max-width: 768px) {
                    :host { bottom: 100px; right: 1rem; }
                }
            </style>

            <button class="btn share" id="shareBtn" title="Compartilhar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </button>
            <button class="btn whatsapp" id="whatsBtn" title="WhatsApp">
                <svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.357 1.849 6.069l-1.2 4.368 4.459-1.164zm12.382-7.575c-.197-.426-.957-1.18-1.164-1.353-.208-.173-.418-.215-.626-.215-.213 0-.422.043-.633.26-.209.213-.831.831-.957 1.002-.124.172-.249.183-.456.043-.207-.133-1.134-.413-2.158-1.334-.799-.71-1.34-1.597-1.492-1.858-.152-.261-.01-."/></svg>
            </button>
        `;
    }

    addEvents() {
        this.shadowRoot.getElementById('shareBtn').onclick = async () => {
            try { await navigator.share({ title: document.title, url: window.location.href }); }
            catch { navigator.clipboard.writeText(window.location.href); alert('Link copiado!'); }
        };
        this.shadowRoot.getElementById('whatsBtn').onclick = () => {
            window.dispatchEvent(new CustomEvent('open-contact-popup'));
        };
    }
}
customElements.define('floating-actions', FloatingActions);