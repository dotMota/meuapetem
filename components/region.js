class RegionSection extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); this.mapInitialized = false; }

    static get observedAttributes() { return ['lat', 'lng', 'pois']; }

    connectedCallback() { this.render(); }

    render() {
        const bgImage = this.getAttribute('image') || '';
        const highlight = this.getAttribute('highlight') || '';
        const title = this.getAttribute('title') || '';
        const text = this.getAttribute('text') || '';

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
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

                .custom-pin { background-color: var(--accent); border: 3px solid #fff; border-radius: 50%; width: 24px; height: 24px; box-shadow: 0 0 20px rgba(0,0,0,0.8); animation: pulse 2s infinite; }
                .brand-pin { background-color: #666; border: 2px solid #fff; border-radius: 50%; width: 14px; height: 14px; opacity: 0.7; transition: 0.3s; }
                .brand-pin:hover { transform: scale(1.5); background-color: #fff; opacity: 1; }
                .poi-label { background: #000; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 10px; text-transform: uppercase; white-space: nowrap; border: 1px solid #333; font-family: sans-serif; font-weight: bold; }
                .poi-dot { width: 8px; height: 8px; background: #fff; border-radius: 50%; margin: 0 auto 5px auto; box-shadow: 0 0 10px #000; }

                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
                    70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
                }

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
        if (!window.L) this.loadLeafletScript();
        else this.initLeaflet();
    }

    loadLeafletScript() {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => this.initLeaflet();
        document.head.appendChild(script);
    }

    initLeaflet() {
        if (this.mapInitialized) return;
        this.mapInitialized = true;

        const lat = parseFloat(this.getAttribute('lat')) || -23.5505;
        const lng = parseFloat(this.getAttribute('lng')) || -46.6333;
        const zoom = parseInt(this.getAttribute('zoom')) || 15;

        let pois = [];
        try { pois = JSON.parse(this.getAttribute('pois') || '[]'); } catch (e) { }

        const mapContainer = this.shadowRoot.getElementById('map-container');
        const map = L.map(mapContainer, { center: [lat, lng], zoom: zoom, zoomControl: false, scrollWheelZoom: false });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CARTO', maxZoom: 19 }).addTo(map);

        const mainIcon = L.divIcon({ className: 'custom-pin-wrapper', html: '<div class="custom-pin"></div>', iconSize: [24, 24] });
        L.marker([lat, lng], { icon: mainIcon, zIndexOffset: 1000 }).addTo(map);

        const brandProjects = [
            { loc: [-23.6067, -46.6450], title: "Quarten" },
            { loc: [-23.5720, -46.7080], title: "Elev" },
        ];

        brandProjects.forEach(proj => {
            const dist = Math.sqrt(Math.pow(proj.loc[0] - lat, 2) + Math.pow(proj.loc[1] - lng, 2));
            if (dist > 0.001) {
                const brandIcon = L.divIcon({ className: 'brand-pin-wrapper', html: `<div class="brand-pin" title="${proj.title}"></div>`, iconSize: [14, 14] });
                L.marker(proj.loc, { icon: brandIcon }).addTo(map);
            }
        });

        pois.forEach(p => {
            const icon = L.divIcon({
                className: 'poi-wrapper',
                html: `<div style="text-align:center;"><div class="poi-dot"></div><div class="poi-label">${p.title}</div></div>`,
                iconSize: [100, 40]
            });
            L.marker(p.loc, { icon: icon }).addTo(map);
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);
    }
}
customElements.define('region-section', RegionSection);