(function initPlatformAuth(global) {
  const SESSION_KEY = 'meuapetem-platform-session';

  function login(email, password) {
    const broker = global.PlatformService.findBrokerByEmail(email);

    if (!broker || broker.password !== password) {
      throw new Error('Credenciais inválidas.');
    }

    const session = {
      brokerId: broker.id,
      email: broker.email,
      name: broker.name,
      slug: broker.slug,
      loginAt: Date.now()
    };

    global.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function logout() {
    global.sessionStorage.removeItem(SESSION_KEY);
  }

  function getSession() {
    try {
      const raw = global.sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function requireSession() {
    const session = getSession();

    if (!session) {
      throw new Error('Sessão ausente.');
    }

    return session;
  }

  global.PlatformAuthService = {
    SESSION_KEY,
    login,
    logout,
    getSession,
    requireSession
  };
})(window);
