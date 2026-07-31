// Live, functional rebuild of the SDK Integration Builder (see mocks/authkit-hero-shot.svg).
// Deliberately scoped to authentic Stytch/authkit.dev colors + type, separate from the
// portfolio deck's own monochrome palette — same convention as the Trust case study's
// live console (slide 9), which used Twilio's real blue/red rather than the deck's ink/cream.
(function(){
  const CSS = `
  .sk-tool{
    --sk-lime:#E6FD13; --sk-ink:#1D1D1D; --sk-ink-70:rgba(29,29,29,.7); --sk-ink-45:rgba(29,29,29,.45);
    --sk-cream:#FBFAFA; --sk-line:#E3E1DE; --sk-line-strong:#A3A3A3;
    --sk-sans:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
    --sk-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
    position:relative; width:100%; height:100%; display:flex; gap:28px;
    font-family:var(--sk-sans); color:var(--sk-ink);
  }
  /* each pane is its own card — matches mocks/Full Customizer.svg, where the
     preview and config panels sit as two distinct bordered containers with
     a real gap between them, not one shell split by a hairline */
  .sk-pane{
    background:var(--sk-cream); min-width:0; border:1px solid var(--sk-line); border-radius:14px;
    overflow:hidden; box-shadow:0 20px 50px rgba(23,22,27,.08);
  }
  .sk-pane-preview{flex:1.1; display:flex; flex-direction:column;}
  .sk-pane-config{flex:1; display:flex; flex-direction:column; background:#fff;}

  .sk-preview-bar{height:34px; flex-shrink:0; display:flex; align-items:center; gap:6px; padding:0 14px; border-bottom:1px solid var(--sk-line);}
  /* real macOS/browser traffic-light colors, matching every other chrome
     bar in this deck — not a placeholder gray dot */
  .sk-preview-bar span{width:8px; height:8px; border-radius:50%;}
  .sk-preview-bar span:nth-child(1){background:#FF5F57;}
  .sk-preview-bar span:nth-child(2){background:#FEBC2E;}
  .sk-preview-bar span:nth-child(3){background:#28C840;}
  .sk-preview-body{flex:1; min-height:0; display:flex; align-items:center; justify-content:center; padding:32px; overflow:auto;}

  .sk-card{
    width:var(--sk-card-width,391px); background:var(--sk-card-bg,#FFFFFF); border:1px solid var(--sk-card-border,#CFCFCF);
    border-radius:var(--sk-card-radius,10px); padding:32px 28px; font-family:var(--sk-card-font,Arial,sans-serif); text-align:center;
    box-shadow:0 4px 24px rgba(23,22,27,.05);
    transition:width .15s ease,background-color .15s ease,border-color .15s ease,border-radius .15s ease;
  }
  .sk-card-brand{font-size:22px; font-weight:700; margin-bottom:10px; color:var(--sk-ink);}
  .sk-card-brand img{max-height:26px; max-width:160px;}
  .sk-card-heading{font-size:15.5px; font-weight:600; margin:0 0 18px; color:var(--sk-ink);}
  .sk-tabs{display:flex; gap:18px; justify-content:center; border-bottom:1px solid var(--sk-line); margin-bottom:16px;}
  .sk-tab{
    appearance:none; background:none; border:none; font-family:inherit; font-size:13px; color:var(--sk-ink-45);
    padding:0 0 9px; cursor:pointer; position:relative;
  }
  .sk-tab.active{color:var(--sk-ink); font-weight:600;}
  .sk-tab.active::after{content:''; position:absolute; left:0; right:0; bottom:-1px; height:2px; background:var(--sk-primary-color,var(--sk-ink));}
  .sk-tab.single{cursor:default; color:var(--sk-ink); font-weight:600;}
  .sk-input{
    width:100%; box-sizing:border-box; font-family:inherit; font-size:13.5px; padding:10px 12px;
    border:1px solid var(--sk-line-strong); border-radius:6px; margin-bottom:10px; color:var(--sk-ink); background:#fff;
  }
  .sk-input::placeholder{color:var(--sk-ink-45);}
  .sk-primary-btn{
    width:100%; font-family:inherit; font-size:13.5px; font-weight:600;
    padding:11px; border-radius:var(--sk-pbtn-radius,6px);
    border:1px solid transparent; background:#E7E7E7; color:#A7A7A7; cursor:default; margin-bottom:4px;
    transition:background-color .15s ease,color .15s ease,border-radius .15s ease;
  }
  .sk-primary-btn.ready{
    background:var(--sk-pbtn-bg,var(--sk-ink)); color:var(--sk-pbtn-text,#fff); border-color:var(--sk-pbtn-border,transparent); cursor:pointer;
  }
  .sk-divider{display:flex; align-items:center; gap:10px; margin:16px 0; color:var(--sk-ink-45); font-size:11.5px;}
  .sk-divider::before, .sk-divider::after{content:''; flex:1; height:1px; background:var(--sk-line);}
  .sk-oauth-list{display:flex; flex-direction:column; gap:8px;}
  .sk-oauth-btn{
    display:flex; align-items:center; justify-content:center; gap:8px; font-family:inherit; font-size:13px;
    padding:9px; border-radius:var(--sk-sbtn-radius,6px);
    border:1px solid var(--sk-sbtn-border,var(--sk-line-strong)); background:var(--sk-sbtn-bg,#fff); color:var(--sk-sbtn-text,var(--sk-ink));
    cursor:pointer; transition:border-radius .15s ease;
  }
  .sk-oauth-dot{width:14px; height:14px; border-radius:4px; background:currentColor; flex-shrink:0;}
  .sk-oauth-icon{width:16px; height:16px; flex-shrink:0;}
  .sk-empty{font-size:13px; color:var(--sk-ink-45); line-height:1.6;}

  /* real (if simplified) flow states — verify code + success — so the
     preview is an actual instance you click through, not a static mock */
  .sk-flow-verify-text{font-size:12.5px; line-height:1.5; color:var(--sk-ink-70); margin:0 0 14px; text-align:left;}
  .sk-flow-back{
    appearance:none; background:none; border:none; font-family:inherit; font-size:12px; color:var(--sk-ink-45);
    cursor:pointer; padding:8px 0 0; text-decoration:underline;
  }
  .sk-flow-success{display:flex; flex-direction:column; align-items:center; padding:12px 0 4px;}
  .sk-flow-check{
    width:44px; height:44px; border-radius:50%; background:var(--sk-lime); color:var(--sk-ink);
    display:flex; align-items:center; justify-content:center; margin-bottom:14px;
  }
  .sk-flow-check svg{width:22px; height:22px;}
  .sk-flow-success-text{font-size:16px; font-weight:700; color:var(--sk-ink); margin:0 0 14px;}
  .sk-flow-reset{
    appearance:none; background:none; border:none; font-family:inherit; font-size:12.5px; color:var(--sk-ink-45);
    cursor:pointer; text-decoration:underline;
  }

  .sk-config-top{
    flex-shrink:0; display:flex; justify-content:flex-end; padding:18px 22px;
  }
  .sk-view-code-btn{
    font-family:var(--sk-mono); font-size:12.5px; font-weight:600; background:var(--sk-ink); color:#fff;
    border:none; border-radius:7px; padding:9px 16px; cursor:pointer;
  }
  .sk-view-code-btn:hover{background:#000;}
  .sk-config-scroll{flex:1; min-height:0; overflow-y:auto; padding:20px 22px 32px;}
  .sk-section-label{font-family:var(--sk-mono); font-size:12px; font-weight:700; letter-spacing:.02em; margin:0 0 12px; color:var(--sk-ink);}
  .sk-subsection-label{font-size:13px; font-weight:600; margin:22px 0 12px; color:var(--sk-ink);}
  .sk-divider-line{height:1px; background:var(--sk-line); margin:20px 0 0;}
  .sk-product-grid{display:flex; flex-wrap:wrap; gap:8px; margin-bottom:8px;}
  .sk-chip{
    font-family:var(--sk-mono); font-size:12.5px; padding:7px 12px; border-radius:6px;
    border:1px solid var(--sk-line-strong); background:#fff; color:var(--sk-ink); cursor:pointer;
  }
  .sk-chip.selected{background:var(--sk-lime); border-color:var(--sk-lime); font-weight:700;}
  /* no border between individual rows — only the .sk-divider-line between
     whole subsections (Container / Colors / Primary Button / Secondary
     Button) reads as a separator now */
  .sk-field-row{display:flex; align-items:center; justify-content:space-between; gap:12px; padding:7px 0;}
  .sk-field-row label{font-size:13px; color:var(--sk-ink-70);}
  /* fixed-width, right-aligned control column — every row's control (select,
     text, number+suffix, or swatch+hex) lines up on the same right edge */
  .sk-field-control{width:148px; flex-shrink:0; display:flex; align-items:center; justify-content:flex-end; gap:8px;}
  /* underline only, matching mocks/Full Customizer.svg — no boxed inputs */
  .sk-field-control select, .sk-field-control input[type=text], .sk-field-control input[type=number]{
    font-family:var(--sk-mono); font-size:13px; border:none; border-bottom:1px solid var(--sk-line-strong);
    border-radius:0; padding:4px 2px 5px; color:var(--sk-ink); background:transparent; text-align:right; width:100%; min-width:0;
  }
  .sk-field-control select:focus, .sk-field-control input[type=text]:focus, .sk-field-control input[type=number]:focus{
    outline:none; border-bottom-color:var(--sk-ink);
  }
  /* hide the native spinner arrows — not present in the mock */
  .sk-field-control input[type=number]::-webkit-inner-spin-button,
  .sk-field-control input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none; margin:0;}
  .sk-field-control input[type=number]{-moz-appearance:textfield;}
  .sk-hex-input{flex:1;}
  .sk-number-input{flex:1;}
  .sk-suffix{font-family:var(--sk-mono); font-size:12.5px; color:var(--sk-ink-45); flex-shrink:0;}
  .sk-color-field{gap:8px;}
  .sk-hex-prefix{color:var(--sk-ink-45); font-family:var(--sk-mono); font-size:12.5px; flex-shrink:0;}
  /* native <input type=color> restyled as a small square swatch — clicking it
     opens the browser/OS color picker directly */
  .sk-swatch{
    appearance:none; -webkit-appearance:none; width:20px; height:20px; border-radius:5px;
    border:1px solid var(--sk-line-strong); flex-shrink:0; padding:0; cursor:pointer; background:none;
  }
  .sk-swatch::-webkit-color-swatch-wrapper{padding:0;}
  .sk-swatch::-webkit-color-swatch{border:none; border-radius:4px;}
  .sk-swatch::-moz-color-swatch{border:none; border-radius:4px;}

  /* View Code swaps the config pane's own content in place — same scroll
     area, not a separate overlay/drawer — so "View Code" / "Customize" just
     toggles which one of these two fills it. The dark code block is its own
     inset card within the pane (.sk-code-card), not a full-bleed dark pane,
     so it reads as "a code sample sitting in the panel" rather than the
     panel itself going dark mode. */
  .sk-code-scroll{flex:1; min-height:0; overflow:auto; padding:0 22px 22px;}
  .sk-code-card{
    margin:0; padding:20px 22px; border-radius:10px; background:#151515;
    font-family:var(--sk-mono); font-size:12.5px; line-height:1.7; color:#D8D8D8; white-space:pre;
  }
  .sk-code-card .sk-str{color:var(--sk-lime);}
  .sk-code-card .sk-key{color:#8FD0FF;}
  .sk-code-card .sk-tag{color:#F98080;}
  `;

  const PRODUCTS = [
    {id:'google', label:'Google', kind:'oauth'},
    {id:'facebook', label:'Facebook', kind:'oauth'},
    {id:'magicLinks', label:'Magic links', kind:'email'},
    {id:'passwords', label:'Passwords', kind:'password'},
    {id:'smsOtp', label:'SMS OTP', kind:'text'},
    {id:'emailOtp', label:'Email OTP', kind:'email'},
    {id:'whatsappOtp', label:'WhatsApp OTP', kind:'text'},
    {id:'web3', label:'Web3', kind:'oauth'},
  ];
  const DEFAULT_SELECTED = ['magicLinks', 'smsOtp'];
  // real brand marks, pulled straight from @stytch/vanilla-js's own bundled
  // assets (dist/.../assets/logo-color/{Google,Facebook,Metamask}.mjs) —
  // same source as the theme defaults above, not redrawn by hand. Used in
  // place of the generic .sk-oauth-dot square wherever one of these 3
  // specific providers is the one being rendered ('web3' -> Metamask, since
  // PRODUCTS only has one generic Web3 entry rather than per-wallet ones).
  const OAUTH_ICONS = {
    google: '<svg class="sk-oauth-icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M18.82 10.2q0-.95-.16-1.84h-8.48v3.49h4.84a4.2 4.2 0 0 1-1.8 2.7v2.27h2.92a8.8 8.8 0 0 0 2.68-6.62"/><path fill="#34A853" d="M10.18 19c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86a5.4 5.4 0 0 1-5.04-3.7h-3v2.32A9 9 0 0 0 10.19 19"/><path fill="#FBBC05" d="M5.14 11.71a5.4 5.4 0 0 1 0-3.42V5.97h-3a8.9 8.9 0 0 0 0 8.06l2.34-1.81z"/><path fill="#EA4335" d="M10.18 4.58q2.01 0 3.44 1.35l2.58-2.58A8.98 8.98 0 0 0 2.14 5.97l3 2.32a5.4 5.4 0 0 1 5.04-3.7"/></svg>',
    facebook: '<svg class="sk-oauth-icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="#0866FF" d="M19 10a9 9 0 1 0-11.17 8.73v-5.98H5.97V10h1.86V8.81c0-3.06 1.38-4.48 4.39-4.48.57 0 1.55.11 1.96.23v2.49q-.35-.03-1.04-.03c-1.48 0-2.05.55-2.05 2V10h2.94l-.5 2.75h-2.44v6.18A9 9 0 0 0 19 10"/><path fill="#fff" d="m13.53 12.75.5-2.75h-2.94v-.97c0-1.46.57-2.01 2.05-2.01q.7 0 1.04.03v-2.5a10 10 0 0 0-1.96-.22c-3 0-4.4 1.42-4.4 4.48V10H5.98v2.75h1.86v5.98a9 9 0 0 0 3.26.2v-6.18z"/></svg>',
    web3: '<svg class="sk-oauth-icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="#FF5C16" d="m17.82 18.08-3.88-1.15-2.92 1.75H8.98l-2.93-1.75-3.87 1.15L1 14.1 2.18 9.7 1 5.95l1.18-4.63 6.05 3.62h3.54l6.05-3.62L19 5.95 17.82 9.7 19 14.1z"/><path fill="#FF5C16" d="m2.18 1.32 6.06 3.62-.25 2.49zM6.06 14.1l2.66 2.03-2.66.8zM8.5 10.75 8 7.43 4.71 9.69V12l1.33-1.26zM17.82 1.32l-6.05 3.62.24 2.49zM13.95 14.1l-2.67 2.03 2.67.8zM15.29 9.69 12 7.43l-.52 3.32h2.46L15.28 12z"/><path fill="#E34807" d="m6.05 16.93-3.87 1.15L1 14.1h5.05zM8.5 10.75l.75 4.8-1.03-2.67-3.5-.87 1.33-1.26zM13.95 16.93l3.87 1.15L19 14.1h-5.05zM11.5 10.75l-.75 4.8 1.03-2.67 3.5-.87-1.33-1.26z"/><path fill="#FF8D5D" d="M1 14.1 2.18 9.7H4.7L4.72 12l3.5.87 1.03 2.66-.53.6-2.67-2.04zM19 14.1 17.82 9.7H15.3L15.28 12l-3.5.87-1.03 2.66.53.6 2.67-2.04z"/><path fill="#FF8D5D" d="M11.77 4.94H8.23L8 7.43l1.26 8.11h1.5l1.26-8.11z"/><path fill="#661800" d="M2.18 1.32 1 5.95 2.18 9.7H4.7L8 7.43zM7.77 11.71H6.62l-.62.61 2.22.56zM17.82 1.32 19 5.95 17.82 9.7H15.3L12 7.43zM12.23 11.71h1.15l.62.62-2.22.55zM11.02 17.1l.26-.97-.53-.58h-1.5l-.53.58.26.96"/><path fill="#C0C4CD" d="M11.02 17.1v1.58H8.98v-1.59z"/><path fill="#E7EBF6" d="m6.06 16.93 2.92 1.75v-1.59l-.26-.96zM13.95 16.93l-2.93 1.75v-1.59l.26-.96z"/></svg>',
  };
  // 'system-ui' first + selected by default — matches the real
  // @stytch/vanilla-js SDK's own default theme font-family, not an
  // arbitrary placeholder (see state defaults below for the rest of that
  // real default theme, pulled from the published npm package)
  const FONTS = ['system-ui', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana', 'Courier New'];

  function svgIcon(){
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:15px;height:15px;color:var(--sk-ink-45);"><path d="M4 8H9.3M13.7 8H20"/><circle cx="11.5" cy="8" r="2.2"/><path d="M4 16H6.8M11.2 16H20"/><circle cx="9" cy="16" r="2.2"/></svg>`;
  }

  window.mountStytchTool = function(mount){
    if (!mount || mount.dataset.mounted) return;
    mount.dataset.mounted = '1';

    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // field defs mirror mocks/Full Customizer.svg exactly: General, Container
    // (+ Border radius), Colors (Primary/Secondary/Success/Error), Primary
    // Button, Secondary Button — each a hex color row or a px number row.
    // Defaults here are real, usable values (the mock itself shows placeholder
    // FFFFFF/unset state, which would make text invisible if used literally).
    // .sk-field-control is a fixed-width, right-aligned column so every row's
    // control — select, text input, number+suffix, or swatch+hex — lines up
    // on the same right edge regardless of what kind of control it is
    function colorRow(id, label, hex){
      return `<div class="sk-field-row">
        <label>${label}</label>
        <div class="sk-field-control sk-color-field">
          <input type="color" class="sk-swatch" id="${id}Swatch" value="#${hex}">
          <span class="sk-hex-prefix">#</span><input type="text" class="sk-hex-input" id="${id}Input" value="${hex}" maxlength="6">
        </div>
      </div>`;
    }
    function numberRow(id, label, value, suffix){
      return `<div class="sk-field-row">
        <label>${label}</label>
        <div class="sk-field-control"><input type="number" class="sk-number-input" id="${id}Input" value="${value}"><span class="sk-suffix">${suffix}</span></div>
      </div>`;
    }

    mount.innerHTML = `
      <div class="sk-tool">
        <div class="sk-pane sk-pane-preview">
          <div class="sk-preview-bar"><span></span><span></span><span></span></div>
          <div class="sk-preview-body">
            <div class="sk-card" id="skCard">
              <div class="sk-card-brand" id="skCardBrand">Stytch</div>
              <h3 class="sk-card-heading">Sign up or log in</h3>
              <div id="skFormArea"></div>
            </div>
          </div>
        </div>
        <div class="sk-pane sk-pane-config">
          <div class="sk-config-top"><button class="sk-view-code-btn" id="skViewCodeBtn">View Code</button></div>
          <div class="sk-config-scroll" id="skConfigScroll">
            <p class="sk-section-label">Products</p>
            <div class="sk-product-grid" id="skProductGrid"></div>

            <p class="sk-section-label" id="skStylingLabel" style="margin-top:28px;">Styling</p>
            <p class="sk-subsection-label">General</p>
            <div class="sk-field-row">
              <label>Font</label>
              <div class="sk-field-control"><select id="skFontSelect">${FONTS.map(f => `<option value="${f}">${f}</option>`).join('')}</select></div>
            </div>
            <div class="sk-field-row">
              <label>Brand logo</label>
              <div class="sk-field-control"><input type="text" id="skLogoInput" placeholder="Logo URL"></div>
            </div>

            <p class="sk-subsection-label" style="margin-top:22px;">Container</p>
            ${numberRow('skWidth', 'Width', 400, 'px')}
            ${colorRow('skBg', 'Background Color', 'FFFFFF')}
            ${colorRow('skBorder', 'Border Color', 'E4E4E4')}
            ${numberRow('skRadius', 'Border radius', 4, 'px')}

            <div class="sk-divider-line"></div>
            <p class="sk-subsection-label">Colors</p>
            ${colorRow('skColorPrimary', 'Primary', '161616')}
            ${colorRow('skColorSecondary', 'Secondary', '696969')}
            ${colorRow('skColorSuccess', 'Success', '009869')}
            ${colorRow('skColorError', 'Error', 'E7000B')}

            <div class="sk-divider-line"></div>
            <p class="sk-subsection-label">Primary Button</p>
            ${colorRow('skPBtnBg', 'Background Color', '161616')}
            ${colorRow('skPBtnText', 'Text Color', 'FCFCFC')}
            ${colorRow('skPBtnBorder', 'Border Color', '161616')}
            ${numberRow('skPBtnRadius', 'Border radius', 4, 'px')}

            <div class="sk-divider-line"></div>
            <p class="sk-subsection-label">Secondary Button</p>
            ${colorRow('skSBtnBg', 'Background Color', 'F5F5F5')}
            ${colorRow('skSBtnText', 'Text Color', '161616')}
            ${colorRow('skSBtnBorder', 'Border Color', 'E4E4E4')}
            ${numberRow('skSBtnRadius', 'Border radius', 4, 'px')}
          </div>
          <div class="sk-code-scroll" id="skCodeScroll" style="display:none;"><pre class="sk-code-card" id="skCodeCard"></pre></div>
        </div>
      </div>
    `;

    const state = {
      selected: new Set(DEFAULT_SELECTED),
      activeTab: 'email',
      // drives the preview's actual auth flow (form -> verify -> success), so
      // the preview is a real, clickable Stytch instance rather than a
      // static, non-functional mock
      flowStep: 'form',
      flowKind: 'email',
      flowDest: '',
      // everything below — font, width, colors, radii — is the real
      // @stytch/vanilla-js SDK's own default theme (dist/.../themes.mjs'
      // `defaultTheme`), not values we made up: oklch(...) tokens converted
      // to hex (e.g. primary oklch(0.2 0 0) -> #161616), 'container-width'
      // 400px, 'rounded-base' 4px. So this demo starts out looking like a
      // real, unstyled Stytch instance before any customization happens.
      font: 'system-ui',
      logo: '',
      width: 400,
      bg: 'FFFFFF',
      border: 'E4E4E4',
      radius: 4,
      colorPrimary: '161616',
      colorSecondary: '696969',
      colorSuccess: '009869',
      colorError: 'E7000B',
      pBtnBg: '161616',
      pBtnText: 'FCFCFC',
      pBtnBorder: '161616',
      pBtnRadius: 4,
      sBtnBg: 'F5F5F5',
      sBtnText: '161616',
      sBtnBorder: 'E4E4E4',
      sBtnRadius: 4,
    };

    const card = mount.querySelector('#skCard');
    const cardBrand = mount.querySelector('#skCardBrand');
    const formArea = mount.querySelector('#skFormArea');
    const productGrid = mount.querySelector('#skProductGrid');

    function selectedByKind(kind){
      return PRODUCTS.filter(p => p.kind === kind && state.selected.has(p.id));
    }

    // a real (if simplified) auth flow — submitting the form advances to a
    // verify step for email/text, or straight to success for password/OAuth
    // (matching how those don't need a second-factor code) — so the preview
    // is an actual instance you click through, not a static mock
    function goToVerify(kind, dest){
      state.flowKind = kind;
      state.flowDest = dest;
      state.flowStep = 'verify';
      renderForm();
    }
    function goToSuccess(){
      state.flowStep = 'success';
      renderForm();
    }
    function resetFlow(){
      state.flowStep = 'form';
      renderForm();
    }

    function renderForm(){
      const hasEmail = selectedByKind('email').length > 0;
      const hasText = selectedByKind('text').length > 0;
      const hasPassword = state.selected.has('passwords');
      const oauth = selectedByKind('oauth');

      if (!hasEmail && !hasText && !hasPassword && !oauth.length) {
        formArea.innerHTML = `<p class="sk-empty">Select a product on the right to see it appear here.</p>`;
        return;
      }

      if (state.flowStep === 'success') {
        formArea.innerHTML = `
          <div class="sk-flow-success">
            <span class="sk-flow-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 12l5 5L20 6"/></svg></span>
            <p class="sk-flow-success-text">You're in</p>
            <button class="sk-flow-reset" type="button">Start over</button>
          </div>`;
        formArea.querySelector('.sk-flow-reset').onclick = resetFlow;
        return;
      }

      if (state.flowStep === 'verify') {
        const isEmail = state.flowKind === 'email';
        formArea.innerHTML = `
          <p class="sk-flow-verify-text">${isEmail ? 'Check your email' : 'Check your phone'} — we sent a 6-digit code to ${state.flowDest}.</p>
          <input class="sk-input" type="text" inputmode="numeric" maxlength="6" placeholder="123456">
          <button class="sk-primary-btn ready">Verify</button>
          <button class="sk-flow-back" type="button">Use a different ${isEmail ? 'email' : 'number'}</button>`;
        formArea.querySelector('.sk-primary-btn').onclick = goToSuccess;
        formArea.querySelector('.sk-flow-back').onclick = resetFlow;
        return;
      }

      const tabs = [];
      if (hasEmail) tabs.push({id:'email', label:'Email'});
      if (hasText) tabs.push({id:'text', label:'Text'});
      if (!tabs.some(t => t.id === state.activeTab)) state.activeTab = tabs[0] ? tabs[0].id : null;

      // OAuth first, then the email/text/password fields below it — matches
      // the Journey slide's step 3 flow (mocks/authkit.gif: Google button
      // above the tabs), not the old tabs-first order
      let html = '';
      if (oauth.length) {
        html += `<div class="sk-oauth-list">${oauth.map(p => `<button class="sk-oauth-btn" data-id="${p.id}">${OAUTH_ICONS[p.id] || '<span class="sk-oauth-dot"></span>'}Continue with ${p.label}</button>`).join('')}</div>`;
      }
      if (oauth.length && (tabs.length || hasPassword)) {
        html += `<div class="sk-divider"><span>or</span></div>`;
      }
      if (tabs.length) {
        html += `<div class="sk-tabs">${tabs.map(t => `<button class="sk-tab ${tabs.length === 1 ? 'single' : (t.id === state.activeTab ? 'active' : '')}" data-tab="${t.id}">${t.label}</button>`).join('')}</div>`;
        const isEmail = state.activeTab === 'email';
        html += `<input class="sk-input" id="skFlowDest" type="${isEmail ? 'email' : 'tel'}" placeholder="${isEmail ? 'example@email.com' : '+1 (555) 000-0000'}">`;
        if (hasPassword && isEmail) html += `<input class="sk-input" id="skFlowPassword" type="password" placeholder="Password">`;
        const btnLabel = hasPassword && isEmail ? 'Log in' : `Continue with ${isEmail ? 'email' : 'text'}`;
        html += `<button class="sk-primary-btn ready">${btnLabel}</button>`;
      } else if (hasPassword) {
        html += `<input class="sk-input" id="skFlowDest" type="email" placeholder="example@email.com">`;
        html += `<input class="sk-input" id="skFlowPassword" type="password" placeholder="Password">`;
        html += `<button class="sk-primary-btn ready">Log in</button>`;
      }
      formArea.innerHTML = html;

      formArea.querySelectorAll('.sk-tab:not(.single)').forEach(btn => {
        btn.onclick = () => { state.activeTab = btn.dataset.tab; renderForm(); };
      });
      const primaryBtn = formArea.querySelector('.sk-primary-btn');
      if (primaryBtn) {
        primaryBtn.onclick = () => {
          const isEmail = tabs.length ? state.activeTab === 'email' : true;
          const destEl = formArea.querySelector('#skFlowDest');
          const dest = (destEl && destEl.value.trim()) || (isEmail ? 'example@email.com' : '+1 (555) 000-0000');
          // password fields log straight in — no second-factor code needed
          if (hasPassword && isEmail) { goToSuccess(); return; }
          goToVerify(isEmail ? 'email' : 'text', dest);
        };
      }
      formArea.querySelectorAll('.sk-oauth-btn').forEach(btn => {
        btn.onclick = goToSuccess;
      });
    }

    function renderProductGrid(){
      productGrid.innerHTML = PRODUCTS.map(p =>
        `<button class="sk-chip ${state.selected.has(p.id) ? 'selected' : ''}" data-id="${p.id}">${p.label}</button>`
      ).join('');
      productGrid.querySelectorAll('.sk-chip').forEach(btn => {
        btn.onclick = () => {
          const id = btn.dataset.id;
          if (state.selected.has(id)) state.selected.delete(id); else state.selected.add(id);
          state.flowStep = 'form';
          renderProductGrid();
          renderForm();
        };
      });
    }

    // [domIdPrefix, stateKey, fallback] — drives both the input wiring below
    // and the swatch-color sync in applyStyles(), so every color/number field
    // added for the Full Customizer only has to be declared once.
    const COLOR_KEYS = [
      ['skBg', 'bg', 'FFFFFF'], ['skBorder', 'border', 'CFCFCF'],
      ['skColorPrimary', 'colorPrimary', '1D1D1D'], ['skColorSecondary', 'colorSecondary', '6B6B6B'],
      ['skColorSuccess', 'colorSuccess', '16A34A'], ['skColorError', 'colorError', 'DC2626'],
      ['skPBtnBg', 'pBtnBg', '1D1D1D'], ['skPBtnText', 'pBtnText', 'FFFFFF'], ['skPBtnBorder', 'pBtnBorder', '1D1D1D'],
      ['skSBtnBg', 'sBtnBg', 'FFFFFF'], ['skSBtnText', 'sBtnText', '1D1D1D'], ['skSBtnBorder', 'sBtnBorder', 'A3A3A3'],
    ];
    const NUMBER_KEYS = [
      ['skWidth', 'width', 391], ['skRadius', 'radius', 8],
      ['skPBtnRadius', 'pBtnRadius', 8], ['skSBtnRadius', 'sBtnRadius', 8],
    ];

    function applyStyles(){
      card.style.setProperty('--sk-card-font', state.font);
      card.style.setProperty('--sk-card-width', state.width + 'px');
      card.style.setProperty('--sk-card-bg', '#' + state.bg);
      card.style.setProperty('--sk-card-border', '#' + state.border);
      card.style.setProperty('--sk-card-radius', state.radius + 'px');
      card.style.setProperty('--sk-primary-color', '#' + state.colorPrimary);
      card.style.setProperty('--sk-pbtn-bg', '#' + state.pBtnBg);
      card.style.setProperty('--sk-pbtn-text', '#' + state.pBtnText);
      card.style.setProperty('--sk-pbtn-border', '#' + state.pBtnBorder);
      card.style.setProperty('--sk-pbtn-radius', state.pBtnRadius + 'px');
      card.style.setProperty('--sk-sbtn-bg', '#' + state.sBtnBg);
      card.style.setProperty('--sk-sbtn-text', '#' + state.sBtnText);
      card.style.setProperty('--sk-sbtn-border', '#' + state.sBtnBorder);
      card.style.setProperty('--sk-sbtn-radius', state.sBtnRadius + 'px');

      COLOR_KEYS.forEach(([id, key]) => {
        const swatch = mount.querySelector('#' + id + 'Swatch');
        if (swatch) swatch.value = '#' + state[key];
      });

      if (state.logo.trim()) {
        cardBrand.innerHTML = `<img src="${state.logo.trim()}" alt="Brand logo" onerror="this.parentElement.textContent='Stytch';">`;
      } else {
        cardBrand.textContent = 'Stytch';
      }
    }

    mount.querySelector('#skFontSelect').addEventListener('change', (e) => { state.font = e.target.value; applyStyles(); });
    mount.querySelector('#skLogoInput').addEventListener('input', (e) => { state.logo = e.target.value; applyStyles(); });
    // each color field is a pair: the hex text input (type/paste a code) and
    // the native <input type=color> swatch (click for the OS/browser color
    // picker) — either one updates the other, plus shared state
    COLOR_KEYS.forEach(([id, key, fallback]) => {
      const hexEl = mount.querySelector('#' + id + 'Input');
      const swatchEl = mount.querySelector('#' + id + 'Swatch');
      hexEl.addEventListener('input', (e) => {
        state[key] = e.target.value.replace(/[^0-9a-fA-F]/g, '') || fallback;
        applyStyles();
      });
      swatchEl.addEventListener('input', (e) => {
        const hex = e.target.value.replace('#', '').toUpperCase();
        state[key] = hex;
        hexEl.value = hex;
        applyStyles();
      });
    });
    NUMBER_KEYS.forEach(([id, key, fallback]) => {
      mount.querySelector('#' + id + 'Input').addEventListener('input', (e) => {
        state[key] = parseInt(e.target.value, 10) || fallback;
        applyStyles();
      });
    });

    function buildCode(){
      const selectedIds = PRODUCTS.filter(p => state.selected.has(p.id)).map(p => p.id);
      const productLines = selectedIds.length
        ? '\n    ' + selectedIds.map(id => `<span class="sk-str">'${id}'</span>`).join(',\n    ') + ',\n  '
        : '';
      return `<span class="sk-tag">&lt;StytchLogin</span>
  <span class="sk-key">products</span>={[${productLines}]}
  <span class="sk-key">style</span>={{
    <span class="sk-key">fontFamily</span>: <span class="sk-str">'${state.font}'</span>,
    <span class="sk-key">container</span>: {
      <span class="sk-key">width</span>: <span class="sk-str">'${state.width}px'</span>,
      <span class="sk-key">backgroundColor</span>: <span class="sk-str">'#${state.bg}'</span>,
      <span class="sk-key">borderColor</span>: <span class="sk-str">'#${state.border}'</span>,
      <span class="sk-key">borderRadius</span>: <span class="sk-str">'${state.radius}px'</span>,
    },
    <span class="sk-key">colors</span>: {
      <span class="sk-key">primary</span>: <span class="sk-str">'#${state.colorPrimary}'</span>,
      <span class="sk-key">secondary</span>: <span class="sk-str">'#${state.colorSecondary}'</span>,
      <span class="sk-key">success</span>: <span class="sk-str">'#${state.colorSuccess}'</span>,
      <span class="sk-key">error</span>: <span class="sk-str">'#${state.colorError}'</span>,
    },
    <span class="sk-key">primaryButton</span>: {
      <span class="sk-key">backgroundColor</span>: <span class="sk-str">'#${state.pBtnBg}'</span>,
      <span class="sk-key">textColor</span>: <span class="sk-str">'#${state.pBtnText}'</span>,
      <span class="sk-key">borderColor</span>: <span class="sk-str">'#${state.pBtnBorder}'</span>,
      <span class="sk-key">borderRadius</span>: <span class="sk-str">'${state.pBtnRadius}px'</span>,
    },
    <span class="sk-key">secondaryButton</span>: {
      <span class="sk-key">backgroundColor</span>: <span class="sk-str">'#${state.sBtnBg}'</span>,
      <span class="sk-key">textColor</span>: <span class="sk-str">'#${state.sBtnText}'</span>,
      <span class="sk-key">borderColor</span>: <span class="sk-str">'#${state.sBtnBorder}'</span>,
      <span class="sk-key">borderRadius</span>: <span class="sk-str">'${state.sBtnRadius}px'</span>,
    },
  }}
<span class="sk-tag">/&gt;</span>`;
    }

    // View Code swaps the config pane's own scroll area in place — no
    // overlay/drawer — and the button relabels to Customize to switch back
    const viewCodeBtn = mount.querySelector('#skViewCodeBtn');
    const configScrollEl = mount.querySelector('#skConfigScroll');
    const codeScrollEl = mount.querySelector('#skCodeScroll');
    const codeCardEl = mount.querySelector('#skCodeCard');
    let codeMode = false;
    function setCodeMode(on){
      codeMode = on;
      if (codeMode) codeCardEl.innerHTML = buildCode();
      configScrollEl.style.display = codeMode ? 'none' : '';
      codeScrollEl.style.display = codeMode ? 'block' : 'none';
      viewCodeBtn.textContent = codeMode ? 'Customize' : 'View Code';
    }
    viewCodeBtn.onclick = () => setCodeMode(!codeMode);
    // exposed so external embeds (e.g. the Journey slide's step-nav) can
    // drive this instance's code view directly, without guessing state
    mount.__skSetCodeMode = setCodeMode;
    // exposed so the Journey slide's step 3 (a fixed, scripted auth-flow
    // demo that temporarily overwrites #skFormArea) can hand control back to
    // the real, live-state-driven form once that step is no longer active
    mount.__skRenderForm = renderForm;

    renderProductGrid();
    renderForm();
    applyStyles();
  };
})();
