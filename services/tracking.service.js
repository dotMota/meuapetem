(function () {
    const ADS_ID = 'AW-17794513059';
    const CLARITY_ID = 'uyd6e6odr2';
    const CONSENT_KEY = 'cookies-accepted';

    let initialized = false;

    if (!window.dataLayer) {
        window.dataLayer = [];
    }

    window.gtag = window.gtag || function () {
        window.dataLayer.push(arguments);
    };

    function loadScript(src, isAsync = true) {
        if (document.querySelector(`script[src="${src}"]`)) {
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = isAsync;
        document.head.appendChild(script);
    }

    function initGoogleAds() {
        loadScript(`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`);
        window.gtag('js', new Date());
        window.gtag('config', ADS_ID);
    }

    function initClarity() {
        window.clarity = window.clarity || function () {
            (window.clarity.q = window.clarity.q || []).push(arguments);
        };

        loadScript(`https://www.clarity.ms/tag/${CLARITY_ID}`);
    }

    function initTracking() {
        if (initialized) return;
        initialized = true;
        initGoogleAds();
        initClarity();
    }

    window.initTracking = initTracking;

    if (localStorage.getItem(CONSENT_KEY) === 'true') {
        initTracking();
    }

    window.addEventListener('cookies-accepted', () => {
        localStorage.setItem(CONSENT_KEY, 'true');
        initTracking();
    });
})();
