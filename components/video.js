/**
 * <video-section>
 * Attributes: cover, src, title
 */
class VideoSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const cover = this.getAttribute('cover') || '';
        const src = this.getAttribute('src') || '';
        const title = this.getAttribute('title') || 'Assista ao Filme';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: var(--bg-page-body, var(--color-black, #000));
                    
                    /* --- AQUI ESTÁ A MUDANÇA (Margens de Segurança) --- */
                    padding: 6rem 5%; /* Cria o espaço em volta */
                    height: auto; /* A altura será definida pelo aspecto do vídeo */
                    
                    /* Variáveis Internas */
                    --accent: var(--color-highlight, #c5a065);
                    --font: var(--font-display, serif);
                }

                .wrapper {
                    position: relative;
                    width: 100%;
                    
                    /* --- CONTAINER "PREMIUM" --- */
                    max-width: 1200px; /* Não deixa esticar demais em telas grandes */
                    margin: 0 auto;    /* Centraliza */
                    aspect-ratio: 16 / 9; /* Garante formato de vídeo (sem faixas pretas) */
                    
                    /* Acabamento */
                    border-radius: 20px;
                    overflow: hidden; /* Corta o conteúdo arredondado */
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    background: var(--color-black, #000);

                    display: flex; align-items: center; justify-content: center;
                }

                /* A CAPA (FOTO) */
                .poster {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    object-fit: cover; 
                    z-index: 1; 
                    transition: opacity 0.5s;
                }
                
                /* Efeito de hover na capa */
                .poster:hover { transform: scale(1.02); transition: transform 0.6s; }

                /* BOTÃO PLAY */
                .play-btn {
                    position: absolute; width: 90px; height: 90px;
                    border: 1px solid rgba(255,255,255,0.3); 
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; 
                    z-index: 10;
                    background: rgba(0,0,0,0.2); 
                    backdrop-filter: blur(10px);
                    transition: all 0.4s ease;
                }
                .play-btn:hover {
                    border-color: var(--accent); 
                    transform: scale(1.1); 
                    background: var(--accent);
                }
                .play-btn svg { width: 30px; height: 30px; fill: var(--color-white, #fff); margin-left: 5px; transition: fill 0.3s; }
                .play-btn:hover svg { fill: var(--color-black, #000); }

                /* TÍTULO */
                .label {
                    position: absolute; bottom: 2rem; color: var(--color-white, #fff);
                    font-family: var(--font); 
                    letter-spacing: 3px; text-transform: uppercase;
                    font-size: 0.9rem; z-index: 10; pointer-events: none;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.8);
                }

                /* TELA DO VÍDEO */
                .video-container {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    z-index: 5; 
                    background: var(--color-black, #000);
                    
                    opacity: 0; 
                    pointer-events: none;
                    transition: opacity 0.5s ease;
                }
                
                :host(.playing) .video-container {
                    opacity: 1; pointer-events: all;
                }

                :host(.playing) .poster,
                :host(.playing) .play-btn,
                :host(.playing) .label {
                    opacity: 0; pointer-events: none;
                }
                
                iframe, video { width: 100%; height: 100%; border: none; }
            </style>

            <div class="wrapper">
                <img src="${cover}" class="poster" alt="Capa do Vídeo">

                <div class="play-btn" id="playBtn">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <span class="label">${title}</span>

                <div class="video-container" id="videoContainer"></div>
            </div>
        `;

        this.initLogic(src);
    }

    initLogic(src) {
        const btn = this.shadowRoot.getElementById('playBtn');
        const container = this.shadowRoot.getElementById('videoContainer');
        const isYoutube = src.includes('youtube.com') || src.includes('youtu.be');

        btn.addEventListener('click', () => {
            this.classList.add('playing');

            if (isYoutube) {
                let videoId = '';
                if (src.includes('v=')) videoId = src.split('v=')[1].split('&')[0];
                else if (src.includes('youtu.be/')) videoId = src.split('youtu.be/')[1];

                container.innerHTML = `
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>`;
            } else {
                container.innerHTML = `<video controls autoplay playsinline><source src="${src}" type="video/mp4"></video>`;
            }
        });
    }
}
customElements.define('video-section', VideoSection);
