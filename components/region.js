class RegionSection extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); this.mapInitialized = false; }

    static get observedAttributes() { return ['lat', 'lng', 'address']; }

    connectedCallback() { this.render(); }

    render() {
        const bgImage = this.getAttribute('image') || '';
        const highlight = this.getAttribute('highlight') || '';
        const title = this.getAttribute('title') || '';
        const text = this.getAttribute('text') || '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block; position: relative; height: 100vh; width: 100%;
                    overflow: hidden; 
                    background: var(--bg-page-body, #050505); 
                    font-family: var(--font-text, sans-serif);
                    
                    --accent: var(--color-highlight, #c5a065);
                    --txt-main: var(--color-text-primary, #fff);
                    --txt-sec: var(--color-text-secondary, #ccc);
                }
                #map-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; background: var(--bg-page-body); }
                
                .cover {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10;
                    transition: opacity 1s ease, visibility 1s ease;
                    display: flex; align-items: flex-end; justify-content: flex-end; padding: 5%; box-sizing: border-box;
                }
                .cover-bg {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                    object-fit: cover;
                    /* --- AJUSTE SOLICITADO --- */
                    object-position: bottom center;
                    
                    z-index: -1; filter: brightness(0.6); transition: transform 20s ease;
                }
                
                .info-card {
                    background: rgba(15, 15, 15, 0.95);
                    backdrop-filter: blur(10px); padding: 3rem;
                    border: 1px solid rgba(255, 255, 255, 0.1); width: 100%; max-width: 450px;
                    color: #fff; text-align: left; transform: translateY(0); transition: transform 1s ease, opacity 1s ease;
                }
                
                :host(.map-active) .cover { opacity: 0; visibility: hidden; pointer-events: none; }
                :host(.map-active) .info-card { transform: translateY(50px); opacity: 0; }
                
                .hl { color: var(--accent); font-family: var(--font-text, sans-serif); text-transform: uppercase; letter-spacing: 4px; font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 1rem; }
                .tt { font-family: var(--font-title, serif); font-size: 2.5rem; margin: 0 0 1rem 0; line-height: 1.1; color: var(--txt-main); }
                .txt { font-family: var(--font-text, sans-serif); color: var(--txt-sec); font-size: 1rem; line-height: 1.6; font-weight: 300; display: block; }
                
                .btn-line {
                    display: inline-block; margin-top: 2rem; text-transform: uppercase; letter-spacing: 2px;
                    font-size: 0.8rem; color: var(--txt-main); text-decoration: none; 
                    border-bottom: 1px solid var(--accent); padding-bottom: 5px; cursor: pointer; transition: 0.3s;
                }
                .btn-line:hover { color: var(--accent); }

                .map-frame { width: 100%; height: 100%; border: 0; filter: grayscale(0.2) contrast(1.05); }

                @media (max-width: 768px) {
                    .cover { padding: 0; align-items: flex-end; }
                    .info-card { max-width: 100%; border: none; padding: 2rem 1.5rem; }
                }
            </style>

            <div id="map-container"></div>
            <div class="cover">
                <img src="${bgImage}" class="cover-bg" alt="Mapa">
                <div class="info-card">
                    <span class="hl">${highlight}</span>
                    <h2 class="tt">${title}</h2>
                    <p class="txt">${text}</p>
                    <a class="btn-line" id="btnExplorar">Explorar Vizinhança</a>
                </div>
            </div>
        `;
        this.shadowRoot.getElementById('btnExplorar').addEventListener('click', () => this.activateMap());
    }

    activateMap() {
        this.classList.add('map-active');
        this.initGoogleMap();
    }

    initGoogleMap() {
        if (this.mapInitialized) return;
        this.mapInitialized = true;

        const lat = parseFloat(this.getAttribute('lat')) || -23.5505;
        const lng = parseFloat(this.getAttribute('lng')) || -46.6333;
        const address = this.getAttribute('address') || this.getAttribute('highlight') || '';
        const query = address.trim() ? `${address}, São Paulo - SP` : `${lat},${lng}`;

        const mapContainer = this.shadowRoot.getElementById('map-container');
        const iframe = document.createElement('iframe');
        iframe.className = 'map-frame';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.title = 'Mapa do Google com localização do empreendimento';
        iframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=17&output=embed`;
        mapContainer.replaceChildren(iframe);
    }
}
customElements.define('region-section', RegionSection);
