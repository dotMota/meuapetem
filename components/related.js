/**
 * <related-products>
 * Attributes: current, category
 * Dependencies: requires project-card to be registered.
 */
class RelatedProducts extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // Verifica dependência
        if (!customElements.get('project-card')) {
            console.error('ERRO: O script "project-card.js" não foi importado nesta página. A vitrine não funcionará.');
            this.shadowRoot.innerHTML = '<p style="color:red; padding: 2rem;">Erro: Importe o project-card.js no head.</p>';
            return;
        }

        const currentId = this.getAttribute('current');
        const category = this.getAttribute('category');

        // Banco de Dados Centralizado
        const products = [
            // --- RARE COLLECTION (Alto Padrão) ---
            {
                id: 'quarten',
                category: 'rare',
                title: 'Quarten Ibirapuera',
                vibe: 'Refúgio Urbano',
                // Caminho relativo para quem está na pasta /projects/
                image: '../media/quarten/hero.jpg',
                link: 'quarten.html',
                tags: 'Bosque Privativo, Wellness'
            },
            {
                id: 'granoscar',
                category: 'rare',
                title: 'Granoscar',
                vibe: 'Ícone do Ibirapuera',
                image: '../media/granoscar/fachada.webp',
                link: 'granoscar.html',
                tags: 'Perkins&Will, Hanazaki'
            },
            // --- SMART LIVING (Econômicos) ---
            {
                id: 'elev-butanta',
                category: 'smart',
                title: 'Elev Butantã',
                vibe: 'Metrô na Porta',
                image: '../media/ElevButanta/aereaLazer.webp',
                link: 'elevButanta.html',
                tags: '4 Passos do Metrô, USP'
            },
            {
                id: 'elev-sacoma',
                category: 'smart',
                title: 'Elev Park Sacomã',
                vibe: 'Sucesso de Vendas',
                image: '../media/elev-sacoma/fachada.webp',
                link: 'elevSacoma.html',
                tags: 'Escritura Grátis, Lazer'
            }
        ];

        const related = products.filter(p => p.category === category && p.id !== currentId);

        if (related.length === 0) {
            this.style.display = 'none';
            return;
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 6rem 5%;
                    background-color: var(--bg-section-main, #0f0f0f);
                    border-top: 1px solid var(--color-border-light, rgba(255,255,255,0.1));
                }
                .container { max-width: 1200px; margin: 0 auto; }
                
                .header { margin-bottom: 3rem; }
                h3 { 
                    font-family: var(--font-title, serif); 
                    font-size: 2rem; color: var(--color-text-primary, var(--color-white, #fff)); margin: 0; 
                }
                .sub {
                    color: var(--highlight-color, #c5a065);
                    text-transform: uppercase; letter-spacing: 2px;
                    font-size: 0.8rem; font-family: var(--font-text, sans-serif);
                    font-weight: 700; display: block; margin-bottom: 0.5rem;
                }

                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }
                
                /* Ajuste para quando tiver poucos itens (não esticar demais) */
                @media (min-width: 768px) {
                    .grid { justify-content: start; }
                    project-card { max-width: 400px; }
                }
            </style>

            <div class="container">
                <div class="header">
                    <span class="sub">Continue a Experiência</span>
                    <h3>Você também pode gostar</h3>
                </div>
                <div class="grid">
                    ${related.map(p => `
                        <project-card
                            title="${p.title}"
                            vibe="${p.vibe}"
                            image="${p.image}"
                            tags="${p.tags}"
                            link="${p.link}"
                            price="Ver Projeto"
                        ></project-card>
                    `).join('')}
                </div>
            </div>
        `;
    }
}
customElements.define('related-products', RelatedProducts);
