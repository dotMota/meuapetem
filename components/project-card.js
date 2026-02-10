class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Projeto';
        const vibe = this.getAttribute('vibe') || 'Lifestyle Urbano';
        const image = this.getAttribute('image') || '';
        const link = this.getAttribute('link') || '#';
        const price = this.getAttribute('price') || 'Consulte';
        const tags = (this.getAttribute('tags') || '').split(',').map((tag) => tag.trim()).filter(Boolean);

        this.shadowRoot.innerHTML = `
        <style>
            :host { display: block; height: 600px; position: relative; border-radius: 16px; overflow: hidden; }
            .bg { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; }
            :host(:hover) .bg { transform: scale(1.1); }
            .overlay { position: absolute; inset: 0; background: linear-gradient(to top, #000 0%, rgba(0,0,0,0.5) 50%, transparent 100%); }
            .content { position: absolute; bottom: 0; left: 0; width: 100%; padding: 2rem; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px; }
            .vibe-tag { color: var(--color-accent-primary, var(--highlight-color, #c5a065)); font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; }
            h3 { margin: 0; color: var(--color-text-primary, #fff); font-family: var(--font-title); font-size: 2rem; }
            .tags-container { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 5px; }
            .tag { background: rgba(255,255,255,0.1); backdrop-filter: blur(5px); padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; color: #ddd; border: 1px solid rgba(255,255,255,0.2); }
            .cta-btn { margin-top: 15px; padding: 15px; background: var(--color-text-primary, #fff); color: var(--color-surface-base, var(--bg-page-body, #000)); text-align: center; border-radius: 8px; font-weight: 700; text-decoration: none; text-transform: uppercase; transform: translateY(20px); opacity: 0; transition: all 0.4s; }
            :host(:hover) .cta-btn { transform: translateY(0); opacity: 1; }
            .cta-btn:hover { background: var(--color-accent-primary, var(--highlight-color, #c5a065)); }
            .price { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.8); color: var(--color-text-primary, #fff); padding: 8px 15px; border-radius: 8px; font-weight: 600; }
        </style>

        <img class="bg" loading="lazy" src="${image}" alt="${title}">
        <div class="overlay"></div>
        <div class="price"><slot name="price">${price}</slot></div>
        <div class="content">
            <span class="vibe-tag"><slot name="vibe">${vibe}</slot></span>
            <h3><slot name="title">${title}</slot></h3>
            <div class="tags-container">
                <slot name="tags">${tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</slot>
            </div>
            <a href="${link}" class="cta-btn"><slot name="cta-text">Me mostre este apê</slot></a>
        </div>`;
    }
}
customElements.define('project-card', ProjectCard);
