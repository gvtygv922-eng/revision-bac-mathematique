/* Synchronisation optionnelle des sauvegardes avec Supabase. La clé utilisée ici est une clé publishable, jamais une clé secrète. */
(function (G) {
  'use strict';
  const RB = G.RB;
  const S = RB.store;
  const URL = 'https://lqwgwbtdezemfdezpytw.supabase.co';
  const KEY = 'sb_publishable_L5bTBDcfMAoiZePG25czpA_e7ap2dBD';
  const panel = G.document.getElementById('cloud-sync');
  const status = G.document.getElementById('cloud-status');
  const email = G.document.getElementById('cloud-email');
  const password = G.document.getElementById('cloud-password');
  const loginBtn = G.document.getElementById('cloud-login');
  const signupBtn = G.document.getElementById('cloud-signup');
  const logoutBtn = G.document.getElementById('cloud-logout');
  const syncBtn = G.document.getElementById('cloud-sync-now');
  let client = null, session = null, suppress = false, timer = null, busy = false;

  function say(message, error) {
    status.textContent = message;
    status.classList.toggle('cloud-error', !!error);
  }
  function setLoggedIn(on) {
    loginBtn.hidden = signupBtn.hidden = on;
    logoutBtn.hidden = syncBtn.hidden = !on;
    email.disabled = password.disabled = on;
    if (on) say('Connecté : ' + session.user.email + '. Synchronisation activée.');
  }
  function meaningful(data) {
    return data && ((data.history && data.history.length) || Object.keys(data.stats || {}).length || data.current);
  }
  async function fetchBackup() {
    const { data, error } = await client.from('revision_backups').select('backup,updated_at').eq('user_id', session.user.id).maybeSingle();
    if (error) throw error;
    return data;
  }
  async function upload() {
    if (!client || !session || suppress || busy) return;
    busy = true;
    try {
      const { error } = await client.from('revision_backups').upsert({
        user_id: session.user.id,
        backup: JSON.parse(S.exportJSON()),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (error) throw error;
      say('Sauvegarde synchronisée à ' + new Date().toLocaleTimeString('fr-FR') + '.');
    } catch (e) {
      say('Synchronisation impossible : ' + (e.message || 'vérifie la configuration Supabase.'), true);
    } finally { busy = false; }
  }
  async function syncAfterLogin() {
    setLoggedIn(true);
    try {
      const remote = await fetchBackup();
      if (remote && remote.backup) {
        const local = JSON.parse(S.exportJSON());
        if (meaningful(local)) {
          const restore = G.confirm('Une sauvegarde en ligne existe (mise à jour le ' + new Date(remote.updated_at).toLocaleString('fr-FR') + ').\n\nOK = remplacer la progression de cet appareil par la sauvegarde en ligne.\nAnnuler = envoyer la progression de cet appareil vers le cloud.');
          if (restore) {
            suppress = true;
            try { S.importJSON(JSON.stringify(remote.backup)); }
            finally { suppress = false; }
            say('Sauvegarde en ligne restaurée sur cet appareil.');
            if (G.RB_app) G.RB_app.go('home');
          } else {
            await upload();
          }
        } else {
          suppress = true;
          try { S.importJSON(JSON.stringify(remote.backup)); }
          finally { suppress = false; }
          say('Sauvegarde en ligne restaurée sur cet appareil.');
          if (G.RB_app) G.RB_app.go('home');
        }
      } else {
        await upload();
        say('Compte connecté. Ta progression actuelle a été enregistrée en ligne.');
      }
    } catch (e) {
      say('Connexion établie, mais lecture de la sauvegarde impossible : ' + (e.message || 'vérifie que le SQL a été exécuté.'), true);
    }
  }
  function scheduleUpload() {
    if (!client || !session || suppress) return;
    G.clearTimeout(timer);
    timer = G.setTimeout(upload, 1200);
  }
  RB.cloudSync = { scheduleUpload: scheduleUpload };

  if (!G.supabase || !G.supabase.createClient) {
    say('Le module de synchronisation n’a pas pu se charger. Vérifie ta connexion Internet.');
    return;
  }
  client = G.supabase.createClient(URL, KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

  signupBtn.addEventListener('click', async () => {
    const e = email.value.trim(), p = password.value;
    if (!e || p.length < 8) return say('Entre ton e-mail et un mot de passe d’au moins 8 caractères.', true);
    signupBtn.disabled = loginBtn.disabled = true;
    try {
      const { data, error } = await client.auth.signUp({ email: e, password: p });
      if (error) throw error;
      if (data.session) { session = data.session; await syncAfterLogin(); }
      else say('Compte créé. Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.');
    } catch (err) { say(err.message || 'Création du compte impossible.', true); }
    finally { signupBtn.disabled = loginBtn.disabled = false; }
  });
  loginBtn.addEventListener('click', async () => {
    const e = email.value.trim(), p = password.value;
    if (!e || !p) return say('Entre ton e-mail et ton mot de passe.', true);
    signupBtn.disabled = loginBtn.disabled = true;
    try {
      const { data, error } = await client.auth.signInWithPassword({ email: e, password: p });
      if (error) throw error;
      session = data.session;
      await syncAfterLogin();
    } catch (err) { say(err.message || 'Connexion impossible.', true); }
    finally { signupBtn.disabled = loginBtn.disabled = false; }
  });
  logoutBtn.addEventListener('click', async () => {
    await client.auth.signOut(); session = null; setLoggedIn(false); say('Déconnecté. La progression reste sur cet appareil.');
  });
  syncBtn.addEventListener('click', upload);
  client.auth.getSession().then(async ({ data, error }) => {
    if (error) return say(error.message, true);
    session = data.session;
    if (session) await syncAfterLogin();
    else say('Pas connecté. Crée un compte ou connecte-toi pour synchroniser ta progression.');
  });
  client.auth.onAuthStateChange((_event, newSession) => {
    session = newSession;
    setLoggedIn(!!session);
  });
})(window);
