(function () {
    const ADS_ID = 'AW-17794513059';
    const CLARITY_ID = 'uyd6e6odr2';

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

    initGoogleAds();
    initClarity();
})();
