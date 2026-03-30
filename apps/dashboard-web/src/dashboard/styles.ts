export function baseStyles(): string {
  return `
    :root {
      color-scheme: dark;
      --bg: #090914;
      --bg-alt: radial-gradient(circle at top left, rgba(139,92,246,0.22), transparent 32%), radial-gradient(circle at bottom right, rgba(34,211,238,0.14), transparent 28%), #090914;
      --panel: #111120;
      --panel-alt: #191930;
      --text: #f4f7ff;
      --muted: #7b84a7;
      --accent: #8b5cf6;
      --accent-alt: #22d3ee;
      --success: #22c55e;
      --warning: #facc15;
      --danger: #fb7185;
      --border: #20253a;
      --glow: rgba(139,92,246,0.22);
      --icon-bg: #1e2124;
      --chip-bg: rgba(255,255,255,0.04);
      --chip-border: rgba(255,255,255,0.08);
      --sidebar: 320px;
      --shadow: 0 28px 80px rgba(0, 0, 0, 0.35);
      --radius-xl: 28px;
      --radius-lg: 20px;
      --radius-md: 14px;
      --radius-sm: 10px;
      --mono: "Space Mono", "Cascadia Code", monospace;
      --display: "Syne", "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; background: var(--bg-alt); color: var(--text); font-family: var(--display); }
    button, input, select { font: inherit; }
    .shell { height: 100vh; min-height: 100vh; display: grid; grid-template-columns: var(--sidebar) minmax(0, 1fr); overflow: hidden; }
    .megasaint-header, .megasaint-home { display: none; }
    .megasaint-bar { display:flex; align-items:center; justify-content:space-between; gap:16px; padding: 6px 18px; border: 1px solid #4b4f55; border-radius: 8px; background: #24272b; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05); }
    .megasaint-logo { width: 36px; height: 36px; border: 1px solid #585d63; background: #1d2024; color: #fff; border-radius: 4px; cursor:pointer; font-weight:800; }
    .megasaint-nav { display:flex; align-items:center; gap:10px; flex:1 1 auto; }
    .megasaint-dropdown { position: relative; padding-bottom: 14px; margin-bottom: -14px; }
    .megasaint-menu { position:absolute; top: 100%; left: 0; min-width: 420px; display:none; grid-template-columns: 1fr; gap: 2px; padding: 12px; border-radius: 28px; background: #17191b; box-shadow: 0 14px 32px rgba(0,0,0,0.28); z-index: 25; }
    .megasaint-dropdown:hover .megasaint-menu, .megasaint-dropdown:focus-within .megasaint-menu { display:grid; }
    .megasaint-menu-item { display:flex; align-items:center; gap:14px; border:none; background:none; color:#bebec0; padding: 10px 12px; border-radius: 20px; cursor:pointer; text-align:left; font-size: 17px; }
    .megasaint-menu-item:hover { background:#23262a; color:#fff; }
    .megasaint-menu-icon { width: 30px; height: 30px; border-radius: 999px; background:#202226; display:grid; place-items:center; flex:none; font-size: 16px; }
    .megasaint-link, .megasaint-userlink { border:none; background:none; color:#c8b394; cursor:pointer; padding: 8px 6px; font-weight:600; font-size: 16px; }
    .megasaint-link.active, .megasaint-link:hover, .megasaint-userlink:hover { color:#ffffff; }
    .megasaint-userbar { display:flex; align-items:center; gap:12px; }
    .megasaint-locale { padding:6px 10px; min-width: 120px; background:none; border:none; color:#c8b394; }
    .megasaint-hero { text-align:center; margin: 18px 0 22px; }
    .megasaint-title { margin: 0; font-size: 56px; font-weight: 700; color: white; }
    .megasaint-title span { color: #000; }
    .megasaint-subtitle { margin: 10px 0 0; font-size: 26px; color: #d2b799; font-weight: 700; }
    .megasaint-question { margin: 26px 0 0; font-size: 34px; font-style: italic; font-weight: 500; color: white; }
    .megasaint-columns { display:grid; grid-template-columns: 1fr 1fr; gap:32px; width:min(1320px, 100%); margin: 0 auto; }
    .megasaint-column { background: #17191b; border-radius: 42px; padding: 18px 20px 22px; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12); }
    .megasaint-column h3 { margin: 0 0 12px; text-align:center; font-size: 32px; color: #f7e3c8; font-weight: 500; }
    .megasaint-card { width:100%; display:flex; align-items:flex-start; gap:18px; padding: 22px 24px; margin-bottom: 14px; background: #2b2b2f; border: none; border-radius: 30px; color:white; cursor:pointer; text-align:left; }
    .megasaint-card:last-child { margin-bottom: 0; }
    .megasaint-card-icon { width: 58px; height: 58px; border-radius: 999px; background: #202226; display:grid; place-items:center; font-size: 28px; color:white; flex:none; }
    .megasaint-card strong { display:block; font-size: 32px; color: white; }
    .megasaint-card small { display:block; margin-top: 12px; font-size: 18px; color: #d8c0a4; }
    .legacy-shell { min-height: 100vh; }
    .legacy-navbar { background-color: #1e2124; color: #d6ddde; justify-content: center; width: 100vw; }
    .legacy-navbar-inner { width: min(1450px, calc(100vw - 24px)); display:flex; align-items:center; gap:14px; padding: 8px 0; }
    .legacy-brand-button { background:none; border:none; padding:0; cursor:pointer; margin-right: .5rem; }
    .legacy-nav-list { list-style:none; display:flex; align-items:center; gap:8px; padding:0; margin:0; flex:1 1 auto; }
    .nav-item { position:relative; }
    .nav-item > .nav-link { border:none; background:none; color:#d6ddde; font-size:16px; padding: 10px 16px; border-radius: 999px; cursor:pointer; width:auto; grid-template-columns:auto; display:flex; align-items:center; gap:6px; }
    .nav-item > .nav-link.active, .nav-item > .nav-link:hover { background:#212529; }
    .dropdown-toggle::after { content: '▾'; font-size: 11px; margin-left: 6px; opacity: .8; }
    .nav-item.dropdown:hover > .dropdown-menu, .nav-item.dropdown:focus-within > .dropdown-menu { opacity:1; visibility:visible; transform: translateY(0); }
    .dropdown-menu { min-width: 310px; padding: 10px; display:grid; gap:8px; top: calc(100% + 8px); left: 0; transform: translateY(6px); z-index: 20; }
    .dropdown-item { width:100%; display:flex; align-items:flex-start; gap:12px; border:none; background:none; }
    .dropdown-item .icon { flex:none; }
    .legacy-dropdown-copy { min-width:0; display:flex; flex-direction:column; gap:4px; color:#c0c0c0; text-align:left; }
    .legacy-dropdown-copy strong { font-size:15px; }
    .legacy-dropdown-copy small { color:#8f9399; line-height:1.45; }
    .legacy-navbar-actions { margin-left:auto; padding: 10px 16px; border-radius: 25px; background:#181a1b; box-shadow:none; }
    .legacy-menubar { padding: 12px 18px 0; }
    .legacy-menubar-inner { display:flex; gap:16px; align-items:stretch; }
    .legacy-brand { flex: 1 1 auto; }
    .legacy-account-bar { flex: 0 0 auto; min-width: 360px; justify-content:center; }
    .legacy-account-actions { display:flex; align-items:center; gap:10px; flex-wrap:wrap; justify-content:flex-end; }
    .legacy-nav { display:grid; gap:12px; margin-top:12px; }
    .legacy-nav-group { display:grid; gap:8px; }
    .legacy-nav-label { color: var(--muted); font-size: 14px; font-weight: 700; padding: 0 8px; }
    .legacy-nav-row { display:flex; flex-wrap:wrap; gap:10px; }
    .legacy-main { padding-top: 12px; }
    .legacy-topbar { margin-bottom: 18px; }
    .maindiv { width: min(70%, 1240px); margin: 0 auto 36px; }
    .welcomeh1 { width:100%; color:white; text-align:center; margin: 0 0 8px; font-size: 42px; }
    .welcomep { margin: 0 auto 8px; text-align:center; color: var(--muted); font-size: 18px; max-width: 780px; }
    .welcomeh3 { color:white; font-style: italic; text-align:center; margin: 0 0 22px; font-size: 24px; }
    .secondarydiv { display:flex; gap:20px; align-items:flex-start; }
    .form { background: var(--panel); border-radius: 30px; box-shadow: var(--shadow); }
    .mainlist { flex:1 1 0; padding: 24px; }
    .mainlist.last { margin-left: 0; }
    .legacy-list-title { margin: 0 0 14px; font-size: 27px; }
    .legacy-card-grid { display:grid; gap:10px; }
    .legacy-action { background:none; border:none; cursor:pointer; width:100%; padding:0; border-radius:30px; color:inherit; }
    .lilcard { background: var(--panel-alt); border-radius: 30px; padding: 18px; transition: background .18s ease; }
    .legacy-action:hover .lilcard { background: #47494e; }
    .lilcardcontent { display:flex; gap:14px; align-items:flex-start; }
    .legacy-card-head { display:flex; justify-content:space-between; align-items:center; gap:12px; }
    .mainpagecardh1 { display:flex; align-items:center; gap:10px; margin:0; font-size: 24px; }
    .mpp { margin: 10px 0 0; color: var(--muted); line-height: 1.6; }
    .icon { width: 50px; height: 50px; border-radius: 999px; display:grid; place-items:center; background: var(--icon-bg); font-size: 16px; font-weight: 800; color: var(--text); }
    .legacy-home-grid { display:grid; grid-template-columns: 1.45fr 1fr; gap:18px; }
    .legacy-panel { padding: 24px; }
    .sidebar { position: sticky; top: 0; height: 100vh; min-height: 100vh; padding: 24px; background: rgba(10,12,21,0.82); backdrop-filter: blur(24px); border-right: 1px solid var(--border); display:flex; flex-direction:column; gap:22px; overflow: hidden; }
    .brand, .identity-card, .panel-card, .metric-card, .hero-card, .theme-card, .activity-card, .auth-card { border: 1px solid var(--border); background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent 36%), var(--panel); box-shadow: var(--shadow); }
    .brand { border-radius: var(--radius-lg); padding: 20px; display:flex; align-items:center; gap:16px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02), 0 0 0 1px rgba(255,255,255,0.01), 0 18px 50px rgba(0,0,0,0.22); }
    .brand-mark, .login-mark { width: 56px; height: 56px; border-radius: 18px; display:grid; place-items:center; background: linear-gradient(135deg, var(--accent), var(--accent-alt)); color:#fff; font-weight:800; font-size:16px; box-shadow: 0 14px 30px var(--glow); flex:none; }
    .brand-copy small, .eyebrow, .metric-label, .chip, .theme-heading span, .nav-title, .nav-badge, .locale-select, .auth-subtitle, .auth-note, .auth-label { font-family: var(--mono); text-transform: uppercase; letter-spacing: .12em; }
    .brand-copy small, .eyebrow, .metric-label, .theme-heading span, .nav-title, .auth-note, .auth-label { font-size: 11px; color: var(--muted); }
    .brand-copy strong { display:block; font-size:24px; line-height:1.05; }
    .brand-copy p { margin:8px 0 0; color: var(--muted); font-size:14px; line-height:1.6; }
    .nav-scroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden; display:flex; flex-direction:column; gap:16px; padding-right: 6px; }
    .nav-group { display:flex; flex-direction:column; gap:10px; }
    .nav-title { margin:0 4px; }
    .nav-link { width:100%; text-align:left; border:1px solid transparent; background:transparent; color:inherit; display:grid; grid-template-columns:48px minmax(0,1fr) auto; gap:14px; align-items:center; padding:14px; border-radius:16px; cursor:pointer; transition: transform .18s ease, border-color .18s ease, background .18s ease; }
    .nav-link:hover, .nav-link.active { transform: translateX(4px); border-color: rgba(255,255,255,0.06); background: linear-gradient(135deg, rgba(139,92,246,0.18), rgba(34,211,238,0.08)); }
    .nav-icon { width:48px; height:48px; border-radius:16px; display:grid; place-items:center; background: var(--icon-bg); color: var(--text); font-weight:700; font-size:12px; letter-spacing:.08em; }
    .nav-copy { min-width:0; display:flex; flex-direction:column; gap:4px; }
    .nav-copy strong { font-size:15px; }
    .nav-copy small { color:var(--muted); font-size:12px; line-height:1.45; text-transform:none; letter-spacing:0; font-family: var(--display); }
    .nav-badge, .chip, .pill { border-radius:999px; padding:6px 10px; font-size:10px; font-weight:700; border:1px solid var(--chip-border); background: var(--chip-bg); color: var(--text); }
    .identity-card { border-radius: var(--radius-lg); padding:18px; display:flex; flex-direction:column; gap:12px; }
    .identity-row { display:flex; align-items:center; gap:14px; }
    .avatar { width:46px; height:46px; border-radius:14px; display:grid; place-items:center; background: linear-gradient(135deg, rgba(139,92,246,0.28), rgba(34,211,238,0.18)); font-weight:800; }
    .identity-card strong { display:block; font-size:16px; }
    .identity-card span { color:var(--muted); font-size:13px; }
    .main { min-width: 0; height: 100vh; overflow-y: auto; overflow-x: hidden; padding:24px 28px 40px; }
    .topbar { display:flex; align-items:center; gap:16px; justify-content:space-between; margin-bottom:24px; padding:18px 22px; border:1px solid var(--border); border-radius:24px; background: rgba(12,14,24,0.74); backdrop-filter: blur(20px); }
    .topbar h1 { margin:0; font-size:26px; }
    .topbar p { margin:6px 0 0; color:var(--muted); }
    .topbar-actions { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
    .locale-select { border-radius:999px; border:1px solid var(--border); background: var(--panel-alt); color: var(--text); padding:10px 14px; font-size:11px; }
    .solid-button, .ghost-button { border-radius:999px; padding:11px 16px; cursor:pointer; font-weight:700; transition: transform .18s ease, opacity .18s ease, border-color .18s ease; }
    .solid-button { border:none; background: linear-gradient(135deg, var(--accent), var(--accent-alt)); color:#fff; box-shadow: 0 16px 36px var(--glow); }
    .ghost-button { border:1px solid var(--border); background: rgba(255,255,255,0.02); color: var(--text); }
    .solid-button:hover, .ghost-button:hover, .theme-card:hover { transform: translateY(-2px); }
    .hero-grid, .content-grid, .theme-grid, .metrics-grid { display:grid; gap:18px; }
    .hero-grid { grid-template-columns: 1.45fr 1fr; margin-bottom: 18px; }
    .metrics-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); margin-bottom: 18px; }
    .metrics-grid.metrics-grid-two { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .content-grid { grid-template-columns: 1.45fr 1fr; }
    .content-grid.solo { grid-template-columns: 1fr 320px; }
    .grow-field { flex: 1 1 340px; }
    .theme-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .hero-card, .panel-card, .theme-card { border-radius: var(--radius-xl); padding: 24px; }
    .hero-primary { min-height: 320px; display:flex; flex-direction:column; justify-content:space-between; background: linear-gradient(135deg, rgba(139,92,246,0.18), rgba(34,211,238,0.08) 46%, rgba(255,255,255,0.02) 100%), var(--panel); }
    .hero-primary h1 { margin:10px 0 14px; font-size: clamp(34px, 4vw, 52px); line-height:.95; max-width:12ch; }
    .hero-primary p, .hero-side p, .panel-card p, .wow-card p, .activity-card p { color: var(--muted); line-height:1.7; }
    .hero-actions { display:flex; flex-wrap:wrap; gap:12px; }
    .hero-side h2, .panel-head h2, .section-header h2 { margin:8px 0 12px; font-size:28px; }
    .metric-card { border-radius:20px; padding:18px; display:flex; flex-direction:column; gap:10px; min-height:132px; }
    .metric-value { font-size:34px; line-height:1; }
    .metric-delta { color: var(--muted); font-size:13px; }
    .tone-success { box-shadow: inset 0 0 0 1px rgba(34,197,94,0.10); }
    .tone-warning { box-shadow: inset 0 0 0 1px rgba(250,204,21,0.10); }
    .tone-danger { box-shadow: inset 0 0 0 1px rgba(251,113,133,0.10); }
    .tone-accent { box-shadow: inset 0 0 0 1px rgba(139,92,246,0.10); }
    .panel-head, .section-header { display:flex; align-items:flex-start; justify-content:space-between; gap:18px; margin-bottom:18px; }
    .section-header p { margin:0; max-width:520px; color:var(--muted); line-height:1.7; }
    .wow-grid, .activity-stack, .mini-stack, .detail-list { display:flex; flex-direction:column; gap:14px; }
    .wow-grid { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .wow-card, .activity-card { border-radius:20px; padding:18px; background: var(--panel-alt); border:1px solid rgba(255,255,255,0.04); }
    .wow-card h3 { margin:8px 0 10px; font-size:20px; }
    .wow-kicker { color: var(--accent-alt); font-size:12px; font-family: var(--mono); letter-spacing:.1em; text-transform: uppercase; }
    .activity-card { display:flex; justify-content:space-between; gap:16px; }
    .activity-card strong { display:block; margin-bottom:8px; }
    .pill.live { color: var(--success); }
    .blueprint-card { min-height:280px; }
    .accent-card { background: linear-gradient(180deg, rgba(139,92,246,0.12), rgba(34,211,238,0.08)), var(--panel); }
    .detail-list { margin:0; padding-left:18px; }
    .detail-list li { color: var(--text); line-height:1.75; }
    .detail-list.compact li { color: var(--muted); }
    .mini-stack { flex-direction: row; flex-wrap: wrap; }
    .page-section { display:none; animation: fadeUp .24s ease; }
    .page-section.active { display:block; }
    .theme-card { display:grid; grid-template-columns: 140px 1fr; gap:18px; align-items:center; }
    .theme-card.is-active { box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08), 0 18px 50px var(--glow); }
    .theme-preview { border-radius:18px; padding:16px; display:grid; gap:10px; min-height:120px; }
    .theme-preview span { height:22px; border-radius:999px; display:block; }
    .theme-copy h3 { margin:0; font-size:20px; }
    .theme-copy p { margin:10px 0 14px; color:var(--muted); line-height:1.65; }
    .theme-heading { display:flex; align-items:center; justify-content:space-between; gap:12px; }
    .auth-shell { min-height:100vh; display:grid; place-items:center; padding:28px; background: var(--bg-alt); }
    .auth-card { width:min(520px, 100%); border-radius:32px; padding:34px; background: linear-gradient(180deg, rgba(139,92,246,0.16), rgba(34,211,238,0.06) 42%, rgba(255,255,255,0.02) 100%), var(--panel); }
    .auth-title { margin:18px 0 10px; font-size: clamp(34px, 5vw, 48px); line-height:.95; }
    .auth-subtitle { display:block; margin-bottom:18px; color: var(--accent-alt); font-size:11px; }
    .auth-copy { color: var(--muted); line-height:1.75; margin-bottom:22px; }
    .auth-grid { display:grid; gap:16px; }
    .field { display:grid; gap:8px; }
    .field input, .field select { border-radius:16px; border:1px solid var(--border); background: rgba(255,255,255,0.02); color: var(--text); padding:14px 16px; }
    .auth-actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:10px; }
    .auth-note { margin-top:18px; color:var(--muted); font-size:11px; line-height:1.7; }
    .auth-register-only[hidden] { display: none !important; }
    .settings-grid { display:grid; gap:16px; }
    .settings-grid.compact { gap:14px; }
    .settings-field input, .settings-field select { width:100%; }
    .settings-actions { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
    .settings-checkbox { display:flex; align-items:center; justify-content:space-between; gap:16px; padding: 12px 0; }
    .settings-checkbox input { width: 18px; height: 18px; }
    .settings-actions.stacked { align-items:flex-start; flex-direction:column; }
    .settings-status { color: var(--muted); font-size:13px; line-height:1.6; }
    .settings-status.is-success { color: var(--success); }
    .settings-status.is-error { color: var(--danger); }
    .theme-personality { display:flex; align-items:center; justify-content:space-between; gap:12px; margin: 6px 0 10px; }
    .theme-personality strong { font-size:14px; }
    .theme-personality small { color: var(--muted); font-family: var(--mono); letter-spacing: .08em; text-transform: uppercase; }
    .theme-spotlight { min-height: 260px; background: linear-gradient(140deg, rgba(255,255,255,0.03), transparent 55%), var(--panel); }
    .theme-spotlight-cues { display:flex; flex-wrap:wrap; gap:10px; }
        :root:not([data-theme-id="megasa1nt"]) .legacy-navbar { background: rgba(12,14,24,0.74); border-bottom: 1px solid var(--border); backdrop-filter: blur(20px); color: var(--text); }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar-inner { width: min(1450px, calc(100vw - 40px)); }
    :root:not([data-theme-id="megasa1nt"]) .legacy-brand-button .brand-mark { width: 48px; height: 48px; border-radius: 16px; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .nav-link { color: var(--text); background: transparent; border: 1px solid transparent; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .nav-link:hover, :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .nav-link.active { background: linear-gradient(135deg, rgba(139,92,246,0.18), rgba(34,211,238,0.08)); border-color: rgba(255,255,255,0.06); }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .dropdown-menu { background: var(--panel); border: 1px solid var(--border); border-radius: 22px; box-shadow: var(--shadow); }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .dropdown-item { color: var(--text); border-radius: 18px; padding: 12px 14px; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .dropdown-item:hover, :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .dropdown-item:focus { background: rgba(255,255,255,0.04); }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .icon { width: 40px; height: 40px; background: var(--panel-alt); border-radius: 14px; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-dropdown-copy { color: var(--text); }
    :root:not([data-theme-id="megasa1nt"]) .legacy-dropdown-copy small { color: var(--muted); }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar-actions { background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent 36%), var(--panel); border: 1px solid var(--border); box-shadow: var(--shadow); color: var(--text); }
    :root:not([data-theme-id="megasa1nt"]) .legacy-main { padding: 24px 28px 40px; }
    :root:not([data-theme-id="megasa1nt"]) .maindiv { width: min(1380px, 100%); }
    :root:not([data-theme-id="megasa1nt"]) .welcomeh1 { font-size: clamp(34px, 4vw, 52px); }
    :root:not([data-theme-id="megasa1nt"]) .secondarydiv { display:grid; grid-template-columns: 1fr 1fr; gap:18px; }
    :root:not([data-theme-id="megasa1nt"]) .form { border: 1px solid var(--border); background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent 36%), var(--panel); border-radius: var(--radius-xl); }
    :root:not([data-theme-id="megasa1nt"]) .mainlist { padding: 24px; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-action:hover .lilcard { background: var(--panel); }
    :root:not([data-theme-id="megasa1nt"]) .lilcard { border: 1px solid rgba(255,255,255,0.04); background: var(--panel-alt); border-radius: 22px; }
    :root:not([data-theme-id="megasa1nt"]) .mainpagecardh1 { font-size: 22px; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-home-grid { grid-template-columns: 1.45fr 1fr; }
    [data-theme-id="megasa1nt"] { --bg: #36393e; --bg-alt: #36393e; --panel: #181a1b; --panel-alt: #212529; --text: #ffffff; --muted: #c0c0c0; --accent: #007bff; --accent-alt: #5da7ff; --border: transparent; --glow: rgba(24,26,27,0.16); --radius-xl: 30px; --radius-lg: 30px; --radius-md: 30px; --radius-sm: 30px; --shadow: 0 0 20px 1px rgba(24,26,27,0.12); --display: "Inter", "Segoe UI", sans-serif; --mono: "Inter", "Segoe UI", sans-serif; }
    [data-theme-id="megasa1nt"] body { background:#3d4046; }
    [data-theme-id="megasa1nt"] .shell { display:block; width:100%; min-height:auto; }
    [data-theme-id="megasa1nt"] .sidebar { display:none; }
    [data-theme-id="megasa1nt"] .brand, [data-theme-id="megasa1nt"] .identity-card, [data-theme-id="megasa1nt"] .panel-card, [data-theme-id="megasa1nt"] .metric-card, [data-theme-id="megasa1nt"] .hero-card, [data-theme-id="megasa1nt"] .theme-card, [data-theme-id="megasa1nt"] .activity-card, [data-theme-id="megasa1nt"] .topbar { background: #181a1b; border-radius: 30px; border: none; box-shadow: 0 0 20px 1px rgba(24,26,27,0.12); }
    [data-theme-id="megasa1nt"] .brand { width:100%; padding:14px 20px; }
    [data-theme-id="megasa1nt"] .brand-mark, [data-theme-id="megasa1nt"] .login-mark, [data-theme-id="megasa1nt"] .avatar, [data-theme-id="megasa1nt"] .nav-icon, [data-theme-id="megasa1nt"] .icon { width:32px; height:32px; min-width:32px; border-radius:999px; background:#1e2124; box-shadow:none; font-size:13px; }
    [data-theme-id="megasa1nt"] .nav-scroll { width:100%; overflow:visible; flex-direction:row; flex-wrap:wrap; gap:10px; }
    [data-theme-id="megasa1nt"] .nav-group { width:100%; flex-direction:row; flex-wrap:wrap; gap:10px; align-items:center; }
    [data-theme-id="megasa1nt"] .nav-title { width:100%; margin:0 4px; color:#c0c0c0; text-transform:none; letter-spacing:0; font-size:16px; }
    [data-theme-id="megasa1nt"] .nav-link { width:auto; grid-template-columns:32px auto auto; gap:12px; padding:12px 18px; border-radius:999px; background:#212529; }
    [data-theme-id="megasa1nt"] .nav-link:hover, [data-theme-id="megasa1nt"] .nav-link.active { transform:none; background:#47494e; border-color:transparent; }
    [data-theme-id="megasa1nt"] .nav-copy strong { font-size:15px; }
    [data-theme-id="megasa1nt"] .nav-copy small { display:none; }
    [data-theme-id="megasa1nt"] .identity-card { margin-left:auto; width:max-content; padding:12px 18px; }
    [data-theme-id="megasa1nt"] .main { padding:8px 12px 50px; }
    [data-theme-id="megasa1nt"] .topbar { display:none; }
    [data-theme-id="megasa1nt"] .solid-button, [data-theme-id="megasa1nt"] .ghost-button { background:#212529; color:#fff; border:none; border-radius:999px; box-shadow:none; }
    [data-theme-id="megasa1nt"] .solid-button:hover, [data-theme-id="megasa1nt"] .ghost-button:hover { transform:none; background:#47494e; }
    [data-theme-id="megasa1nt"] .hero-primary { background:#181a1b; min-height:unset; }
    [data-theme-id="megasa1nt"] .theme-card:hover { transform:none; }
    [data-theme-id="megasa1nt"] .chip, [data-theme-id="megasa1nt"] .pill, [data-theme-id="megasa1nt"] .locale-select { background:#212529; border:none; }
    [data-theme-id="megasa1nt"] .theme-spotlight, [data-theme-id="megasa1nt"] .accent-card { background:#181a1b; }
    [data-theme-id="megasa1nt"] .megasaint-header, [data-theme-id="megasa1nt"] .megasaint-home { display:block; }
    [data-theme-id="megasa1nt"] .hero-grid, [data-theme-id="megasa1nt"] .metrics-grid, [data-theme-id="megasa1nt"] .content-grid { display:none; }
    [data-theme-id="megasa1nt"] .page-section[data-page]:not([data-page="home"]) .megasaint-home { display:none; }
    [data-theme-id="windows"] { color-scheme: light; --display: "Segoe UI Variable", "Segoe UI", sans-serif; --mono: "Cascadia Code", "Consolas", monospace; --shadow: 0 18px 40px rgba(70, 96, 140, 0.16); --icon-bg: rgba(24, 33, 47, 0.12); --chip-bg: rgba(24, 33, 47, 0.06); --chip-border: rgba(24, 33, 47, 0.22); --muted: #3f4c63; }
    [data-theme-id="minimalistic"] { --icon-bg: #e5e9f1; --chip-bg: #edf2f8; --chip-border: #c6d0de; --muted: #4a5568; }
    [data-theme-id="solar-light"] { --icon-bg: #f4e4cf; --chip-bg: #f9eddc; --chip-border: #ddc4a0; --muted: #6f5438; }
    [data-theme-id="minimalistic"] .sidebar { background: rgba(255,255,255,0.92); border-right: 1px solid #d8dee8; }
    [data-theme-id="solar-light"] .sidebar { background: rgba(255,250,243,0.94); border-right: 1px solid #eed7b9; }
    [data-theme-id="minimalistic"] .brand, [data-theme-id="minimalistic"] .identity-card { background: #ffffff; border-color: #d8dee8; }
    [data-theme-id="solar-light"] .brand, [data-theme-id="solar-light"] .identity-card { background: #fff8ef; border-color: #eed7b9; }
    [data-theme-id="minimalistic"] .nav-title, [data-theme-id="minimalistic"] .nav-copy strong, [data-theme-id="minimalistic"] .nav-copy small,
    [data-theme-id="solar-light"] .nav-title, [data-theme-id="solar-light"] .nav-copy strong, [data-theme-id="solar-light"] .nav-copy small { color: var(--text); }
    [data-theme-id="minimalistic"] .nav-copy small, [data-theme-id="solar-light"] .nav-copy small { color: var(--muted); }
    [data-theme-id="minimalistic"] .nav-link { border-color: #d8dee8; background: #f7f9fc; }
    [data-theme-id="solar-light"] .nav-link { border-color: #eed7b9; background: #fff3dd; }
    [data-theme-id="minimalistic"] .nav-link:hover, [data-theme-id="minimalistic"] .nav-link.active { background: #edf2f8; border-color: #c6d0de; }
    [data-theme-id="solar-light"] .nav-link:hover, [data-theme-id="solar-light"] .nav-link.active { background: #f9eddc; border-color: #ddc4a0; }
    [data-theme-id="windows"] body { background: linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.18)), var(--bg-alt); }
    [data-theme-id="windows"] .sidebar, [data-theme-id="windows"] .topbar { background: rgba(255,255,255,0.58); backdrop-filter: blur(30px) saturate(140%); }
    [data-theme-id="windows"] .brand, [data-theme-id="windows"] .identity-card, [data-theme-id="windows"] .panel-card, [data-theme-id="windows"] .metric-card, [data-theme-id="windows"] .hero-card, [data-theme-id="windows"] .theme-card, [data-theme-id="windows"] .activity-card { background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.72)); border-color: rgba(255,255,255,0.7); }
    [data-theme-id="windows"] .nav-link:hover, [data-theme-id="windows"] .nav-link.active { background: rgba(37,99,235,0.10); border-color: rgba(37,99,235,0.16); }
    [data-theme-id="windows"] .activity-card,
    [data-theme-id="minimalistic"] .activity-card,
    [data-theme-id="solar-light"] .activity-card { background: rgba(255,255,255,0.90); border-color: rgba(24,33,47,0.16); }
    [data-theme-id="windows"] .activity-card strong,
    [data-theme-id="minimalistic"] .activity-card strong,
    [data-theme-id="solar-light"] .activity-card strong,
    [data-theme-id="windows"] .activity-card p,
    [data-theme-id="minimalistic"] .activity-card p,
    [data-theme-id="solar-light"] .activity-card p { color: #18212f; }    [data-theme-id="windows"] .wow-card,
    [data-theme-id="minimalistic"] .wow-card,
    [data-theme-id="solar-light"] .wow-card { background: rgba(255,255,255,0.82); border-color: rgba(24,33,47,0.14); }
    [data-theme-id="windows"] .wow-card h3,
    [data-theme-id="minimalistic"] .wow-card h3,
    [data-theme-id="solar-light"] .wow-card h3,
    [data-theme-id="windows"] .wow-card p,
    [data-theme-id="minimalistic"] .wow-card p,
    [data-theme-id="solar-light"] .wow-card p { color: #18212f; }
    [data-theme-id="windows"] .topbar .locale-select,
    [data-theme-id="minimalistic"] .topbar .locale-select,
    [data-theme-id="solar-light"] .topbar .locale-select,
    [data-theme-id="windows"] .legacy-navbar-actions .locale-select,
    [data-theme-id="minimalistic"] .legacy-navbar-actions .locale-select,
    [data-theme-id="solar-light"] .legacy-navbar-actions .locale-select { color: #18212f; background: rgba(255,255,255,0.92); border-color: rgba(24,33,47,0.28); }
    [data-theme-id="windows"] .nav-copy small, [data-theme-id="windows"] .eyebrow, [data-theme-id="windows"] .metric-label, [data-theme-id="windows"] .settings-status,
    [data-theme-id="minimalistic"] .nav-copy small, [data-theme-id="minimalistic"] .eyebrow, [data-theme-id="minimalistic"] .metric-label, [data-theme-id="minimalistic"] .settings-status,
    [data-theme-id="solar-light"] .nav-copy small, [data-theme-id="solar-light"] .eyebrow, [data-theme-id="solar-light"] .metric-label, [data-theme-id="solar-light"] .settings-status { color: var(--muted); }
    [data-theme-id="windows"] [data-page="live-control"] .section-header h2,
    [data-theme-id="minimalistic"] [data-page="live-control"] .section-header h2,
    [data-theme-id="solar-light"] [data-page="live-control"] .section-header h2,
    [data-theme-id="windows"] [data-page="live-control"] .section-header p,
    [data-theme-id="minimalistic"] [data-page="live-control"] .section-header p,
    [data-theme-id="solar-light"] [data-page="live-control"] .section-header p,
    [data-theme-id="windows"] [data-page="live-control"] .activity-card strong,
    [data-theme-id="minimalistic"] [data-page="live-control"] .activity-card strong,
    [data-theme-id="solar-light"] [data-page="live-control"] .activity-card strong,
    [data-theme-id="windows"] [data-page="live-control"] .activity-card p,
    [data-theme-id="minimalistic"] [data-page="live-control"] .activity-card p,
    [data-theme-id="solar-light"] [data-page="live-control"] .activity-card p { color: #1a2433; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar-actions .megasaint-link,
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar-actions .megasaint-userlink { color: #e9eef9; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar-actions .megasaint-link.active,
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar-actions .megasaint-link:hover,
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar-actions .megasaint-userlink:hover { color: #ffffff; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar-actions .megasaint-locale { color: #18212f; background: rgba(255,255,255,0.88); border: 1px solid rgba(24,33,47,0.22); border-radius: 999px; }
    [data-theme-id="cli"] { --display: "Space Mono", "Cascadia Code", monospace; --radius-xl: 8px; --radius-lg: 6px; --radius-md: 4px; --radius-sm: 2px; --shadow: none; }
    [data-theme-id="cli"] body { background-image: linear-gradient(rgba(93,242,140,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(93,242,140,0.03) 1px, transparent 1px), var(--bg-alt); background-size: 16px 16px, 16px 16px, auto; }
    [data-theme-id="cli"] .brand, [data-theme-id="cli"] .identity-card, [data-theme-id="cli"] .panel-card, [data-theme-id="cli"] .metric-card, [data-theme-id="cli"] .hero-card, [data-theme-id="cli"] .theme-card, [data-theme-id="cli"] .activity-card, [data-theme-id="cli"] .topbar, [data-theme-id="cli"] .sidebar { box-shadow: none; border-style: solid; }
    [data-theme-id="cli"] .brand-mark, [data-theme-id="cli"] .login-mark, [data-theme-id="cli"] .avatar { border-radius: 0; box-shadow: none; }
    [data-theme-id="cli"] .nav-link:hover, [data-theme-id="cli"] .nav-link.active { transform: none; background: rgba(93,242,140,0.08); }
    [data-theme-id="geometry-pulse"] { --radius-xl: 12px; --radius-lg: 12px; --radius-md: 8px; --radius-sm: 4px; --shadow: 0 22px 48px rgba(16,20,54,0.45); }
    [data-theme-id="geometry-pulse"] body { background-image: linear-gradient(135deg, rgba(244,63,94,0.08) 0 25%, transparent 25% 50%, rgba(34,211,238,0.08) 50% 75%, transparent 75% 100%), var(--bg-alt); background-size: 120px 120px, auto; }
    [data-theme-id="geometry-pulse"] .brand-mark, [data-theme-id="geometry-pulse"] .login-mark, [data-theme-id="geometry-pulse"] .nav-icon, [data-theme-id="geometry-pulse"] .avatar { border-radius: 6px; }
    [data-theme-id="geometry-pulse"] .nav-link:hover, [data-theme-id="geometry-pulse"] .nav-link.active { transform: translateY(-2px); background: linear-gradient(135deg, rgba(244,63,94,0.24), rgba(34,211,238,0.14)); }    @keyframes fadeUp { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform: translateY(0);} }
        :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .nav-link { width: auto !important; display: inline-flex !important; grid-template-columns: none !important; transform: none !important; padding: 10px 16px !important; border-radius: 999px !important; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .nav-link:hover, :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .nav-link.active { transform: none !important; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .dropdown-menu { display: grid !important; opacity: 0; visibility: hidden; position: absolute !important; width: 320px; margin-top: 0; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .nav-item.dropdown:hover > .dropdown-menu, :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .nav-item.dropdown:focus-within > .dropdown-menu { opacity: 1; visibility: visible; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .dropdown-item { margin-left: 0 !important; padding: 12px 14px !important; text-align: left; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .dropdown-item:hover, :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .dropdown-item:focus { color: var(--text); width: 100% !important; margin-left: 0 !important; padding: 12px 14px !important; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .dropdown-item:hover > .icon, :root:not([data-theme-id="megasa1nt"]) .legacy-navbar .dropdown-item:focus > .icon { background: var(--panel) !important; }
    :root:not([data-theme-id="megasa1nt"]) .legacy-shell .mainpagecardh1, :root:not([data-theme-id="megasa1nt"]) .legacy-shell .mpp, :root:not([data-theme-id="megasa1nt"]) .legacy-shell .welcomeh1, :root:not([data-theme-id="megasa1nt"]) .legacy-shell .welcomeh3 { color: var(--text); }
    :root:not([data-theme-id="megasa1nt"]) .legacy-shell .welcomep, :root:not([data-theme-id="megasa1nt"]) .legacy-shell .mpp { color: var(--muted); }
    [data-theme-id="minimalistic"] .sidebar,
    [data-theme-id="solar-light"] .sidebar { background: rgba(255,255,255,0.95) !important; border-right-color: rgba(24,33,47,0.16) !important; color: var(--text) !important; }
    [data-theme-id="minimalistic"] .nav-title, [data-theme-id="minimalistic"] .nav-copy strong, [data-theme-id="minimalistic"] .nav-copy small,
    [data-theme-id="solar-light"] .nav-title, [data-theme-id="solar-light"] .nav-copy strong, [data-theme-id="solar-light"] .nav-copy small { color: var(--text) !important; }
    [data-theme-id="minimalistic"] .nav-copy small, [data-theme-id="solar-light"] .nav-copy small { color: var(--muted) !important; }
    [data-theme-id="minimalistic"] .nav-link, [data-theme-id="solar-light"] .nav-link { color: var(--text) !important; border-color: rgba(24,33,47,0.12) !important; background: rgba(255,255,255,0.85) !important; }
    [data-theme-id="minimalistic"] .nav-link:hover, [data-theme-id="minimalistic"] .nav-link.active,
    [data-theme-id="solar-light"] .nav-link:hover, [data-theme-id="solar-light"] .nav-link.active { background: rgba(37,99,235,0.12) !important; border-color: rgba(37,99,235,0.25) !important; }
    @media (max-width:1240px) { .metrics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .hero-grid, .content-grid, .content-grid.solo, .theme-grid, .legacy-home-grid, .secondarydiv { grid-template-columns:1fr; flex-direction:column; } .maindiv { width:min(92%, 1240px); } .legacy-menubar-inner { flex-direction:column; } .legacy-account-bar { min-width: 0; } }
    @media (max-width:960px) { .shell { height: auto; min-height: 100vh; grid-template-columns:1fr; overflow: visible; } .sidebar { position: static; height: auto; min-height:auto; overflow: visible; } .nav-scroll { flex: 0 0 auto; min-height: auto; overflow: visible; padding-right: 0; } .main { height: auto; overflow: visible; padding-top:0; } .legacy-nav-row { flex-direction:column; } .nav-link { width:100%; } }
    @media (max-width:720px) { .main, .sidebar, .auth-shell { padding:18px; } .topbar, .hero-card, .panel-card, .theme-card, .auth-card, .metric-card { border-radius:20px; } .metrics-grid { grid-template-columns:1fr; } .theme-card { grid-template-columns:1fr; } .activity-card { flex-direction:column; } }
  `;
}


























