class SiteAnalytics extends HTMLElement {
    constructor() {
        super();
        this.sessionData = {
            source: 'direct',
            medium: 'none',
            campaign: 'none',
            device: 'desktop',
            referrer: document.referrer || 'direct'
        };
        this.scrolled50 = false;
        this.scrolled90 = false;
        this.galleryInteracted = false;
        this.lastScrollTop = 0;
        this.idleTimer = null;
        this.isIdle = false;
    }

    connectedCallback() {
        this.initSession();
        this.initTrackers();
        console.log('[Analytics] Big Brother Mode: ON 👁️');
    }

    initSession() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('utm_source')) {
            this.sessionData.source = params.get('utm_source');
            this.sessionData.medium = params.get('utm_medium') || 'none';
            this.sessionData.campaign = params.get('utm_campaign') || 'none';
        }

        const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.sessionData.device = isMobile ? 'mobile' : 'desktop';

        // Envia Performance (LCP/Load Time) simulado
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        this.sendEvent('performance', 'load_time', `${loadTime}ms`);

        this.sendEvent('session', 'start', `Device: ${this.sessionData.device} | Source: ${this.sessionData.source}`);
    }

    initTrackers() {
        // 1. Cliques
        document.addEventListener('click', (e) => this.trackClicks(e));

        // 2. Scroll e Comportamento de Leitura
        window.addEventListener('scroll', () => {
            this.trackScroll();
            this.resetIdleTimer();
        });

        // 3. Galeria e Lightbox
        this.observeGallery();
        this.observeLightbox();

        // 4. ✨ NOVAS METRICAS "HARDCORE" ✨

        // A. Visibilidade da Aba (Trocou de site?)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.sendEvent('engagement', 'tab_hidden', 'User switched tab');
            } else {
                this.sendEvent('engagement', 'tab_visible', 'User returned');
            }
        });

        // B. Cópia de Texto (Intenção de salvar info)
        document.addEventListener('copy', () => {
            const selection = document.getSelection().toString();
            if (selection.length > 0 && selection.length < 100) {
                this.sendEvent('intent', 'text_copy', `Copied: "${selection}"`);
            } else {
                this.sendEvent('intent', 'text_copy', 'Copied large text block');
            }
        });

        // C. Tentativa de Print/Screenshot (Teclado)
        window.addEventListener('keyup', (e) => {
            if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey)) {
                this.sendEvent('intent', 'screenshot_attempt', 'User pressed Screenshot keys');
            }
        });

        // D. Monitor de Ociosidade (Mouse/Touch parado)
        document.addEventListener('mousemove', () => this.resetIdleTimer());
        document.addEventListener('touchstart', () => this.resetIdleTimer());
        this.resetIdleTimer(); // Inicia contagem

        // E. Monitor de Erros JS (O site "peidou"?)
        window.addEventListener('error', (e) => {
            this.sendEvent('technical', 'js_error', `${e.message} at ${e.filename}:${e.lineno}`);
        });

        // F. Escuta quando o cliente troca a chave "Morar/Investir"
        window.addEventListener('persona-changed', (e) => {
            const mode = e.detail.mode; // 'resident' ou 'investor'
            const label = mode === 'investor' ? 'Perfil: Investidor' : 'Perfil: Morador';

            // Envia para o GA4 como uma SEGMENTAÇÃO de usuário
            this.sendEvent('segmentation', 'select_persona', label);

            // Opcional: Salva na sessão para usar em outros eventos (ex: contato)
            this.sessionData.persona = mode;
        });
    }

    // --- LOGICA DE OCIOSIDADE ---
    resetIdleTimer() {
        if (this.isIdle) {
            // Se estava idle e voltou, marca retorno
            const timeInactive = (Date.now() - this.idleStartTime) / 1000;
            if (timeInactive > 60) { // Só avisa se ficou fora muito tempo
                this.sendEvent('engagement', 'user_active_again', `Return after ${Math.floor(timeInactive)}s`);
            }
            this.isIdle = false;
        }

        clearTimeout(this.idleTimer);
        this.idleStartTime = Date.now();

        // Define 60 segundos para considerar "Ausente"
        this.idleTimer = setTimeout(() => {
            this.isIdle = true;
            this.sendEvent('engagement', 'user_idle', 'Inactive for 60s');
        }, 60000);
    }

    // --- RASTREAMENTO DE SCROLL INTELIGENTE ---
    trackScroll() {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const scrollCurrent = window.scrollY;
        const scrollPercentage = (scrollCurrent / scrollTotal) * 100;

        // Profundidade
        if (scrollPercentage >= 50 && !this.scrolled50) {
            this.sendEvent('scroll', 'depth', '50% - Manifesto Lida');
            this.scrolled50 = true;
        }
        if (scrollPercentage >= 90 && !this.scrolled90) {
            this.sendEvent('scroll', 'depth', '90% - Footer Alcançado');
            this.scrolled90 = true;
        }

        // Detectar "Scroll Rápido para Cima" (Interesse súbito em rever algo)
        const st = window.pageYOffset || document.documentElement.scrollTop;
        if (st < this.lastScrollTop - 50) { // 50px de "pulo" para cima
            // Debounce simples para não flodar
            if (!this.scrollUpTimer) {
                this.scrollUpTimer = setTimeout(() => {
                    this.sendEvent('behavior', 'scroll_up', 'Fast review (User went back up)');
                    this.scrollUpTimer = null;
                }, 1000);
            }
        }
        this.lastScrollTop = st <= 0 ? 0 : st;
    }

    // --- RASTREAMENTO DE CLIQUES ---
    trackClicks(e) {
        const target = e.target.closest('a, button, site-menu a, .img-wrapper');
        if (!target) return;

        let category = 'interaction';
        let action = 'click';
        let label = target.innerText.trim() || target.getAttribute('aria-label') || 'element';

        if (target.closest('site-menu')) {
            category = 'navigation'; action = 'menu_click'; label = `Menu: ${target.innerText}`;
        } else if (target.href && target.href.includes('wa.me')) {
            category = 'lead'; action = 'whatsapp_click';
        } else if (target.href && target.href.includes('tel:')) {
            category = 'lead'; action = 'phone_click';
        } else if (target.closest('cta-section') || target.closest('hero-section')) {
            category = 'conversion'; action = 'cta_click'; label = `CTA: ${label}`;
        }

        this.sendEvent(category, action, label);
    }

    // --- RASTREAMENTO DE GALERIA ---
    observeGallery() {
        const gallery = document.querySelector('gallery-section') || document.querySelector('showcase-section');
        if (!gallery) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.galleryInteracted) {
                    this.sendEvent('gallery', 'view', 'Gallery Visible on Screen');
                    this.galleryInteracted = true;
                }
            });
        }, { threshold: 0.5 });
        observer.observe(gallery);

        gallery.addEventListener('touchstart', () => {
            if (!this.galleryScrolled) {
                this.sendEvent('gallery', 'interaction', 'User Swiped Gallery');
                this.galleryScrolled = true;
            }
        }, { passive: true });
    }

    observeLightbox() {
        const lightbox = document.querySelector('lightbox-viewer');
        if (!lightbox) return;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    const isActive = lightbox.hasAttribute('active') || lightbox.style.display === 'block';
                    if (isActive) this.sendEvent('gallery', 'zoom', 'Lightbox Opened (Full Screen)');
                }
            });
        });
        observer.observe(lightbox, { attributes: true, attributeFilter: ['active', 'style', 'open'] });
    }

    sendEvent(category, action, label) {
        if (typeof gtag === 'function') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label,
                'device_type': this.sessionData.device,
                'traffic_source': this.sessionData.source
            });
            // Habilite esta linha se quiser ver no console do navegador
            // console.log(`📡 [Analytics] ${category} > ${action} > ${label}`);
        }
    }

}
customElements.define('site-analytics', SiteAnalytics);