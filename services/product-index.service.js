(function () {
    const PROJECT_FILES = [
        'quarten.html',
        'granoscar.html',
        'elevButanta.html',
        'elevSacoma.html',
        'elevAltoIpiranga.html',
        'vilaBoulevardMooca.html',
        'peninsulaVilaMadalena.html',
    ];

    const CATEGORY_DETAILS = {
        signature: {
            title: 'SIGNATURE',
            desc: 'Alto e Altíssimo Padrão. Luxo e design autoral para quem busca exclusividade e sofisticação.',
        },
        comfort: {
            title: 'COMFORT',
            desc: 'Médio Padrão com foco em Família. Plantas inteligentes de 2 e 3 dormitórios onde o bem-estar é prioridade.',
        },
        start: {
            title: 'START',
            desc: 'Econômicos e Primeiro Imóvel (MCMV). A porta de entrada para sair do aluguel.',
        },
        invest: {
            title: 'INVEST',
            desc: 'Foco total em Investimento e Rentabilidade. Studios e compactos em regiões de alta demanda.',
        },
    };

    const cache = new Map();

    const shuffle = (arr) => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    const getCurrentFile = () => window.location.pathname.split('/').pop();

    const isHomePage = () => (
        window.location.pathname.endsWith('index.html')
        || window.location.pathname.endsWith('/')
        || window.location.pathname.endsWith('manual-mcmv.html')
    );

    const getPathPrefix = () => (isHomePage() ? 'projects/' : './');

    const normalizeImagePath = (imagePath, homeContext) => {
        if (!imagePath) return imagePath;
        return homeContext ? imagePath.replace('../media', './media') : imagePath;
    };

    const parseProjectDocument = (doc, fileName, context) => {
        const category = doc.querySelector('meta[name="product-category"]')?.content;
        const fullTitle = doc.querySelector('title')?.innerText || '';
        const title = fullTitle.split('|')[0].trim();
        const vibe = doc.querySelector('meta[name="product-vibe"]')?.content || 'Ver Projeto';
        const tags = doc.querySelector('meta[name="product-tags"]')?.content || '';
        const description = doc.querySelector('meta[name="description"]')?.content || 'O imóvel ideal para você.';
        const image = normalizeImagePath(doc.querySelector('meta[property="og:image"]')?.content, context.home);

        if (!title || !image) return null;

        return {
            file: fileName,
            title,
            vibe,
            tags,
            category,
            description,
            image,
            link: `${context.pathPrefix}${fileName}`,
        };
    };

    const getContext = () => ({
        currentFile: getCurrentFile(),
        home: isHomePage(),
        pathPrefix: getPathPrefix(),
    });

    const fetchAllProjects = async () => {
        const context = getContext();
        const cacheKey = `${context.pathPrefix}::${context.home}`;
        if (cache.has(cacheKey)) return cache.get(cacheKey);

        const reads = PROJECT_FILES.map(async (fileName) => {
            try {
                const response = await fetch(`${context.pathPrefix}${fileName}`);
                if (!response.ok) return null;
                const htmlText = await response.text();
                const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                return parseProjectDocument(doc, fileName, context);
            } catch (error) {
                console.warn('Erro ao indexar projeto:', fileName, error);
                return null;
            }
        });

        const projects = (await Promise.all(reads)).filter(Boolean);
        cache.set(cacheKey, projects);
        return projects;
    };

    const getProjectsByCategory = async (category) => {
        const context = getContext();
        const projects = await fetchAllProjects();
        return projects.filter((project) => project.category === category && project.file !== context.currentFile);
    };

    const getHeroSlides = async () => {
        const projects = await fetchAllProjects();
        return shuffle(projects).map((project) => ({
            title: project.title.toUpperCase(),
            subtitle: project.description.split('.')[0],
            image: project.image,
            link: project.link,
            tag: project.vibe.toUpperCase(),
        }));
    };

    window.ProductIndexService = {
        PROJECT_FILES,
        CATEGORY_DETAILS,
        isHomePage,
        getProjectsByCategory,
        getHeroSlides,
    };
})();
