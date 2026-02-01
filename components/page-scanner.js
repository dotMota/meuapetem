class PageScanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // LISTA EXATA DOS ARQUIVOS NA PASTA PROJECTS
        this.projectFiles = [
            'quarten.html',
            'granoscar.html',
            'elevButanta.html',
            'elevSacoma.html',
            'elevAltoIpiranga.html',
            'vilaBoulevardMooca.html',
            'peninsulaVilaMadalena.html',
        ];
    }

    async connectedCallback() {
        if (!customElements.get('project-card')) {
            console.error('Erro: Importe project-card.js no head.');
            return;
        }

        const currentFile = window.location.pathname.split('/').pop();

        // Pega a categoria definida na tag <page-scanner category="invest">
        const filterCategory = this.getAttribute('category');

        // Verifica se estamos na Home ou numa página interna
        const isHome = window.location.pathname.endsWith('index.html') ||
            window.location.pathname.endsWith('/') ||
            window.location.pathname.endsWith('manual-mcmv.html');

        // --- NOVIDADE: Configuração dos Textos das Linhas ---
        const categoryDetails = {
            'signature': {
                title: 'SIGNATURE',
                desc: 'Alto e Altíssimo Padrão. Luxo e design autoral para quem busca exclusividade e sofisticação.'
            },
            'comfort': {
                title: 'COMFORT',
                desc: 'Médio Padrão com foco em Família. Plantas inteligentes de 2 e 3 dormitórios onde o bem-estar é prioridade.'
            },
            'start': {
                title: 'START',
                desc: 'Econômicos e Primeiro Imóvel (MCMV). A porta de entrada para sair do aluguel.'
            },
            'invest': {
                title: 'INVEST',
                desc: 'Foco total em Investimento e Rentabilidade. Studios e compactos em regiões de alta demanda.'
            }
        };

        // Define os textos atuais baseados no atributo ou usa um padrão se não achar
        const currentInfo = categoryDetails[filterCategory] || { title: 'Nossos Projetos', desc: '' };

        // Lógica de exibição: Se for Home usa os textos novos, se for interna usa "Veja Também"
        const displayKicker = isHome ? 'MEUAPÊTEM' : 'Continue Explorando';
        const displayTitle = isHome ? currentInfo.title : 'Veja Também';
        const displayDesc = isHome ? currentInfo.desc : ''; // Não mostra descrição longa em páginas internas

        this.shadowRoot.innerHTML = `
            <style>
                :host { 
                    display: block; 
                    padding: 6rem 5%; 
                    background: var(--bg-section-main, #141414); 
                    border-top: 1px solid var(--color-border-light, rgba(255,255,255,0.1)); 
                }
                .container { max-width: 1400px; margin: 0 auto; }
                
                .section-header { margin-bottom: 3rem; }
                
                /* Kicker (MeuApêTem) */
                span { 
                    color: var(--highlight-color, #c5a065); 
                    text-transform: uppercase; 
                    letter-spacing: 2px; 
                    font-size: 0.8rem; 
                    font-weight: 700; 
                    display: block; 
                    margin-bottom: 0.5rem;
                }

                /* Título Principal */
                h3 { 
                    font-family: var(--font-title, serif); 
                    font-size: 2rem; 
                    color: var(--color-text-primary, var(--color-white, #fff)); 
                    margin: 0 0 1rem 0; 
                }

                /* Descrição da Categoria */
                .category-desc {
                    color: var(--color-text-secondary, var(--color-surface-150, #a0a0a0));
                    font-family: var(--font-body, sans-serif);
                    font-size: 1rem;
                    line-height: 1.6;
                    max-width: 700px;
                    margin: 0;
                }

                .grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
                    gap: 2rem; 
                }
                
                .error-msg { color: var(--color-danger, #ff6b6b); background: var(--color-danger-soft, rgba(255,0,0,0.1)); padding: 1rem; border-radius: 4px; }
            </style>
            <div class="container">
                <div class="section-header">
                    <span>${displayKicker}</span>
                    <h3>${displayTitle}</h3>
                    ${displayDesc ? `<p class="category-desc">${displayDesc}</p>` : ''}
                </div>
                <div class="grid" id="grid">
                </div>
            </div>
        `;

        const grid = this.shadowRoot.getElementById('grid');

        // Verifica protocolo (Evita erro de CORS local)
        if (window.location.protocol === 'file:') {
            grid.innerHTML = '<div class="error-msg">⚠️ O sistema de vitrine precisa de um servidor local (Live Server) para funcionar. Não roda direto do arquivo.</div>';
            return;
        }

        let foundCount = 0;

        for (const file of this.projectFiles) {
            if (file === currentFile) continue;

            try {
                const pathPrefix = isHome ? 'projects/' : './';
                const response = await fetch(pathPrefix + file);
                if (!response.ok) throw new Error('404');

                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                // Lê a meta tag do arquivo alvo
                const category = doc.querySelector('meta[name="product-category"]')?.content;

                // Compara se a categoria do arquivo é igual a solicitada no componente
                if (category === filterCategory) {
                    const title = doc.querySelector('title').innerText.split('|')[0].trim();
                    const vibe = doc.querySelector('meta[name="product-vibe"]')?.content || 'Ver Projeto';
                    const tags = doc.querySelector('meta[name="product-tags"]')?.content || '';

                    let image = doc.querySelector('meta[property="og:image"]')?.content;
                    if (image && isHome) {
                        image = image.replace('../media', './media');
                    }

                    const card = document.createElement('project-card');
                    card.setAttribute('title', title);
                    card.setAttribute('vibe', vibe);
                    card.setAttribute('image', image);
                    card.setAttribute('tags', tags);
                    card.setAttribute('link', pathPrefix + file);
                    card.setAttribute('price', 'Conhecer');

                    grid.appendChild(card);
                    foundCount++;
                }

            } catch (err) {
                console.warn(`Erro ao ler ${file}:`, err);
            }
        }

        if (foundCount === 0) {
            this.style.display = 'none';
        }
    }
}
customElements.define('page-scanner', PageScanner);
