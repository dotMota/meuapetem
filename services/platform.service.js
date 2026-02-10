(function initPlatformService(global) {
  const STORAGE_KEY = 'meuapetem-platform-v1';

  const componentCatalog = {
    hero: {
      label: 'Hero',
      description: 'Primeira dobra com título, subtítulo e CTA principal.'
    },
    highlights: {
      label: 'Destaques',
      description: 'Cards com diferenciais do corretor e nicho de atuação.'
    },
    projects: {
      label: 'Vitrine de imóveis',
      description: 'Lista de oportunidades com foco em conversão.'
    },
    testimonial: {
      label: 'Prova social',
      description: 'Depoimento de cliente para aumentar confiança.'
    },
    contact: {
      label: 'Contato',
      description: 'Bloco de WhatsApp, telefone e e-mail.'
    }
  };

  const templateDefaults = {
    palette: {
      primary: '#D4AF37',
      surface: '#101010',
      card: '#1a1a1a',
      text: '#f5f5f7',
      textSoft: '#b4b4be'
    },
    homepage: {
      title: 'Seu próximo imóvel sem ruído.',
      subtitle: 'Consultoria boutique em lançamentos e oportunidades exclusivas.',
      ctaText: 'Agendar conversa',
      ctaUrl: 'https://wa.me/5500000000000',
      highlights: [
        'Curadoria por perfil de vida',
        'Negociação orientada por dados',
        'Atendimento fim a fim'
      ],
      testimonial: {
        quote: 'A equipe entendeu nosso momento e encontrou o imóvel perfeito em duas semanas.',
        author: 'Camila e Roberto, clientes'
      }
    },
    catalog: [
      {
        title: 'Apartamento compacto perto do metrô',
        tag: 'Start',
        description: 'Ideal para primeira compra com entrada facilitada.'
      },
      {
        title: 'Condomínio club para família',
        tag: 'Comfort',
        description: 'Lazer completo, localização estratégica e ótimo potencial de valorização.'
      },
      {
        title: 'Cobertura exclusiva em bairro nobre',
        tag: 'Signature',
        description: 'Projeto autoral com acabamentos premium e vista aberta.'
      }
    ],
    enabledBlocks: ['hero', 'highlights', 'projects', 'testimonial', 'contact']
  };

  function slugify(text) {
    return String(text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function buildSeed() {
    return {
      brokers: [
        {
          id: 'broker-demo',
          name: 'MeuApêTem Studio',
          email: 'demo@meuapetem.com',
          password: 'demo123',
          plan: 'pro',
          slug: 'studio',
          brand: {
            headline: 'Seu corretor especialista em lançamentos.',
            subheadline: 'Experiência consultiva para compradores exigentes.',
            whatsapp: 'https://wa.me/5511999999999',
            phone: '(11) 99999-9999',
            instagram: '@meuapetem'
          },
          site: templateDefaults
        }
      ],
      subscriptions: {
        starter: {
          name: 'Starter',
          price: 'R$ 149/mês',
          seats: 1
        },
        pro: {
          name: 'Pro',
          price: 'R$ 349/mês',
          seats: 3
        },
        scale: {
          name: 'Scale',
          price: 'R$ 790/mês',
          seats: 10
        }
      }
    };
  }

  function readStore() {
    try {
      const raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seed = buildSeed();
        writeStore(seed);
        return seed;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.brokers)) {
        throw new Error('Formato inválido');
      }

      return parsed;
    } catch (error) {
      const fallback = buildSeed();
      writeStore(fallback);
      return fallback;
    }
  }

  function writeStore(data) {
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function sanitizeEnabledBlocks(blocks) {
    const catalogKeys = Object.keys(componentCatalog);
    return (Array.isArray(blocks) ? blocks : [])
      .filter((key) => catalogKeys.includes(key));
  }

  function createBroker(payload) {
    const store = readStore();
    const slug = slugify(payload.name || payload.slug || 'corretor');

    if (store.brokers.some((broker) => broker.slug === slug)) {
      throw new Error('Já existe um corretor com esse slug.');
    }

    const broker = {
      id: `broker-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      plan: payload.plan || 'starter',
      slug,
      brand: {
        headline: payload.headline || templateDefaults.homepage.title,
        subheadline: payload.subheadline || templateDefaults.homepage.subtitle,
        whatsapp: payload.whatsapp || 'https://wa.me/5500000000000',
        phone: payload.phone || '(00) 00000-0000',
        instagram: payload.instagram || '@seuperfil'
      },
      site: JSON.parse(JSON.stringify(templateDefaults))
    };

    store.brokers.push(broker);
    writeStore(store);
    return broker;
  }

  function findBrokerBySlug(slug) {
    const store = readStore();
    return store.brokers.find((broker) => broker.slug === slug) || null;
  }

  function findBrokerByEmail(email) {
    const store = readStore();
    return store.brokers.find((broker) => broker.email === email) || null;
  }

  function updateBrokerSite(brokerId, patch) {
    const store = readStore();
    const broker = store.brokers.find((item) => item.id === brokerId);

    if (!broker) {
      throw new Error('Corretor não encontrado.');
    }

    if (patch.brand) {
      broker.brand = {
        ...broker.brand,
        ...patch.brand
      };
    }

    if (patch.palette) {
      broker.site.palette = {
        ...broker.site.palette,
        ...patch.palette
      };
    }

    if (patch.homepage) {
      broker.site.homepage = {
        ...broker.site.homepage,
        ...patch.homepage,
        testimonial: {
          ...broker.site.homepage.testimonial,
          ...(patch.homepage.testimonial || {})
        }
      };
    }

    if (patch.enabledBlocks) {
      broker.site.enabledBlocks = sanitizeEnabledBlocks(patch.enabledBlocks);
    }

    writeStore(store);
    return broker;
  }

  global.PlatformService = {
    STORAGE_KEY,
    componentCatalog,
    templateDefaults,
    readStore,
    writeStore,
    createBroker,
    findBrokerBySlug,
    findBrokerByEmail,
    updateBrokerSite,
    slugify
  };
})(window);
