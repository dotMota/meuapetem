class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title');
        const vibe = this.getAttribute('vibe') || 'Lifestyle Urbano';
        const image = this.getAttribute('image');
        const link = this.getAttribute('link') || '#';
        const price = this.getAttribute('price') || 'Consulte';
        const tags = (this.getAttribute('tags') || '').split(',').filter(Boolean);

        if (image && !this.querySelector('[slot="image"]')) {
            const img = document.createElement('img');
            img.setAttribute('slot', 'image');
            img.src = image;
            img.alt = title || '';
            this.appendChild(img);
        }
        if (price && !this.querySelector('[slot="price"]')) {
            const span = document.createElement('span');
            span.setAttribute('slot', 'price');
            span.textContent = price;
            this.appendChild(span);
        }
        if (vibe && !this.querySelector('[slot="vibe"]')) {
            const span = document.createElement('span');
            span.setAttribute('slot', 'vibe');
            span.textContent = vibe;
            this.appendChild(span);
        }
        if (title && !this.querySelector('[slot="title"]')) {
            const h3 = document.createElement('h3');
            h3.setAttribute('slot', 'title');
            h3.textContent = title;
            this.appendChild(h3);
        }
        if (tags.length && !this.querySelector('[slot="tags"]')) {
            tags.forEach(tag => {
                const span = document.createElement('span');
                span.setAttribute('slot', 'tags');
                span.className = 'tag';
                span.textContent = tag.trim();
                this.appendChild(span);
            });
        }
        if (link && !this.querySelector('[slot="link"]')) {
            const a = document.createElement('a');
            a.setAttribute('slot', 'link');
            a.href = link;
            this.appendChild(a);
        }
        if (!this.querySelector('[slot="link-text"]')) {
            const span = document.createElement('span');
            span.setAttribute('slot', 'link-text');
            span.textContent = 'Me mostre este apê';
            this.appendChild(span);
        }

        this.shadowRoot.innerHTML = `
        <style>
            :host { display: block; height: 600px; position: relative; border-radius: 16px; overflow: hidden; }
            ::slotted([slot="image"]) { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; display: block; }
            :host(:hover) ::slotted([slot="image"]) { transform: scale(1.1); }
            .overlay { position: absolute; inset: 0; background: linear-gradient(to top, #000 0%, rgba(0,0,0,0.5) 50%, transparent 100%); }
            .content { position: absolute; bottom: 0; left: 0; width: 100%; padding: 2rem; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px; }
            .vibe-tag, ::slotted([slot="vibe"]) { color: var(--highlight-color); font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; }
            h3, ::slotted([slot="title"]) { margin: 0; color: #fff; font-family: var(--font-title); font-size: 2rem; }
            .tags-container { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 5px; }
            .tag { background: rgba(255,255,255,0.1); backdrop-filter: blur(5px); padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; color: #ddd; border: 1px solid rgba(255,255,255,0.2); }
            ::slotted(.tag) { background: rgba(255,255,255,0.1); backdrop-filter: blur(5px); padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; color: #ddd; border: 1px solid rgba(255,255,255,0.2); }
            .cta-btn { margin-top: 15px; padding: 15px; background: #fff; color: #000; text-align: center; border-radius: 8px; font-weight: 700; text-decoration: none; text-transform: uppercase; transform: translateY(20px); opacity: 0; transition: all 0.4s; }
            :host(:hover) .cta-btn { transform: translateY(0); opacity: 1; }
            .cta-btn:hover { background: var(--highlight-color); }
            .price, ::slotted([slot="price"]) { position: absolute; top: 20px; right: 20px; background: #000; color: #fff; padding: 8px 15px; border-radius: 8px; font-weight: 600; }
        </style>

        <slot name="image"></slot>
        
        <div class="overlay"></div>
        <slot name="price"></slot>
        <div class="content">
            <slot name="vibe"></slot>
            <slot name="title"></slot>
            <div class="tags-container">
                <slot name="tags"></slot>
            </div>
            <a href="#" class="cta-btn" id="cardLink"><slot name="link-text"></slot></a>
        </div>
        `;

        const linkSlot = this.querySelector('[slot="link"]');
        if (linkSlot && linkSlot.getAttribute('href')) {
            this.shadowRoot.getElementById('cardLink').href = linkSlot.getAttribute('href');
        }
    }
}
customElements.define('project-card', ProjectCard);
