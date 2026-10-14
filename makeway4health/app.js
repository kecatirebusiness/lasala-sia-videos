/* Make Way 4 Health — interacciones y motion */
(() => {
  const PHONE = '17865259585';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const CAT = window.MW_CATALOG || [];
  const CAT_ES = {weight: 'Peso', hormones: 'Hormonas', recovery: 'Recuperación', longevity: 'Longevidad', skin: 'Piel'};
  const wa = (msg) => `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;

  /* ───────── datos de las rutas ───────── */
  const ROUTES = [
    {n: '01', k: 'PESO Y METABOLISMO', img: 'assets/img/metab.jpg', h: 'Reducir grasa o desarrollar masa muscular con estrategia.',
      p: 'Una ruta de 12 semanas que parte de tus objetivos, altura, peso actual, peso meta y nivel de actividad. Integra nutrición, entrenamiento y seguimiento para perder grasa, proteger músculo o desarrollar masa de forma estructurada. Cuando existe indicación, el equipo puede evaluar terapias GLP-1 con semaglutide, tirzepatide o retatrutide.',
      tags: ['Objetivos concretos', 'Altura y peso meta', 'Nutrición y fuerza'],
      opts: ['Semaglutide', 'Tirzepatide', 'Retatrutide', 'Tesamorelin', 'AOD-9604', '5-Amino-1MQ', 'CJC-1295', 'Ipamorelin', 'HGH', 'IGF-1 LR3'],
      phases: ['Evaluación', 'Diseño', 'Progresión', 'Consolidación'], goal: 'Bajar grasa'},
    {n: '02', k: 'HORMONAS Y VITALIDAD', img: 'assets/img/horm.jpg', h: 'Vitalidad con diagnóstico, no con suposiciones.',
      p: 'Exploramos energía, sueño, función sexual, composición corporal y contexto hormonal. Cuando corresponde, el médico solicita estudios y diseña una estrategia con controles definidos.',
      tags: ['Laboratorios', 'Vitalidad', 'Controles médicos'],
      opts: ['Tesamorelin', 'CJC-1295', 'Ipamorelin', 'GHRP-2', 'GHRP-6', 'Gonadorelin', 'Kisspeptin', 'HCG', 'PT-141', 'HGH'], goal: 'Hormonas y vitalidad'},
    {n: '03', k: 'FUERZA Y RECUPERACIÓN', img: 'assets/img/recov.jpg', h: 'Recuperar función y volver a progresar.',
      p: 'Revisamos carga, movilidad, dolor, sueño, masa muscular y recuperación. La ruta combina entrenamiento progresivo, nutrición y seguimiento profesional con herramientas seleccionadas para cada caso.',
      tags: ['Función', 'Recuperación', 'Fuerza progresiva'],
      opts: ['BPC-157', 'TB-500', 'GHK-Cu', 'KPV', 'ARA-290', 'IGF-1 LR3', 'CJC-1295', 'Ipamorelin', 'Hexarelin', 'Glutathione'], goal: 'Fuerza y recuperación'},
    {n: '04', k: 'LONGEVIDAD Y ENERGÍA', img: 'assets/img/longev.jpg', h: 'Energía diaria dentro de una visión a largo plazo.',
      p: 'Organizamos sueño, recuperación, nutrición, actividad y biomarcadores para construir un plan sostenible. Las herramientas complementarias se seleccionan según tus objetivos y respuesta.',
      tags: ['Energía', 'Sueño', 'Enfoque'],
      opts: ['NAD+', 'MOTS-c', 'SS-31', 'Epithalon', 'Thymalin', 'Semax', 'Selank', 'DSIP', 'Dihexa', 'Glutathione'], goal: 'Longevidad y energía'},
  ];
  $('#routeStack').innerHTML = ROUTES.map((r) => `
    <article class="route">
      <div class="route-img"><img src="${r.img}" alt="${r.k}" loading="lazy"><span class="route-num">${r.n}</span></div>
      <div class="route-body">
        <p class="route-kicker">${r.n} · ${r.k}</p>
        <h3>${r.h}</h3>
        <p>${r.p}</p>
        <div class="tags">${r.tags.map((t) => `<span>${t}</span>`).join('')}</div>
        ${r.phases ? `<div class="route-phases">${r.phases.map((p, i) => `<div><b>0${i + 1}</b>${p}</div>`).join('')}</div>` : ''}
        <p class="opts-title">Opciones que el equipo puede considerar</p>
        <div class="opts">${r.opts.map((o) => `<button type="button" data-product="${o}">${o}</button>`).join('')}</div>
        <button class="btn btn-gold magnetic" data-open-eval data-goal="${r.goal}">Evaluar esta ruta <i class="arr">→</i></button>
      </div>
    </article>`).join('');

  /* ───────── frasco con etiqueta real ───────── */
  const short = (n) => n.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  const fit = (n) => { const l = n.length; return l <= 11 ? Math.min(8, 70 / l) : Math.min(5.6, 112 / l); };
  const vial = (p) => { const n = short(p.name); return `<div class="vial-wrap"><img src="assets/img/vial-card.jpg" alt="Frasco ${n}" loading="lazy"><div class="vlabel"><b style="font-size:${fit(n)}cqw">${n}</b><small>${p.dose}</small></div></div>`; };

  /* ───────── catálogo ───────── */
  let cat = 'all', q = '';
  const grid = $('#grid');
  function renderCatalog() {
    const list = CAT.filter((p) => (cat === 'all' || p.categories.includes(cat)) &&
      (!q || (p.name + ' ' + p.sourceName + ' ' + p.summary).toLowerCase().includes(q)));
    $('#count').textContent = list.length;
    $('#empty').hidden = list.length > 0;
    grid.innerHTML = list.map((p) => `
      <button class="pcard" data-id="${p.id}">
        <span class="dose">${p.dose}</span>
        <div class="pcard-vial">${vial(p)}</div>
        <h3>${p.name}</h3>
        <p>${p.summary}</p>
        <div class="cats">${p.categories.map((c) => `<span>${CAT_ES[c] || c}</span>`).join('')}</div>
        <span class="more">↗</span>
      </button>`).join('');
    if (window.gsap) gsap.from($$('.pcard', grid), {y: 40, opacity: 0, duration: 0.7, stagger: 0.035, ease: 'power3.out'});
  }
  $('#filters').addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip').forEach((c) => c.classList.toggle('on', c === b)); cat = b.dataset.cat; renderCatalog();
  });
  $('#search').addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); renderCatalog(); });
  renderCatalog();

  /* ───────── modal de ficha ───────── */
  let current = null;
  function openProduct(p) {
    if (!p) return; current = p;
    $('#pmName').textContent = p.name; $('#pmDose').textContent = 'MW4H · ' + p.dose;
    const n = short(p.name); $('#pmVName').textContent = n; $('#pmVName').style.fontSize = fit(n) + 'cqw'; $('#pmVDose').textContent = p.dose;
    $('#pmSummary').textContent = p.description || p.summary;
    $('#pmComp').textContent = p.composition || p.name;
    $('#pmRec').textContent = p.recommended || '—';
    $('#pmBen').innerHTML = (p.benefits || []).map((b) => `<li>${b}</li>`).join('');
    $('#pmAlso').innerHTML = (p.also || []).map((b) => `<li>${b}</li>`).join('');
    openModal('#productModal');
  }
  grid.addEventListener('click', (e) => { const c = e.target.closest('.pcard'); if (c) openProduct(CAT.find((p) => p.id === c.dataset.id)); });
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-product]'); if (!o) return;
    const key = o.dataset.product.toLowerCase().replace(/[^a-z0-9]/g, '');
    const p = CAT.find((x) => x.name.toLowerCase().replace(/[^a-z0-9]/g, '').startsWith(key)) || CAT.find((x) => x.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(key));
    if (p) openProduct(p); else openEval({interest: o.dataset.product});
  });
  $('#pmEval').addEventListener('click', () => { closeModal('#productModal'); setTimeout(() => openEval({interest: current && `${current.name} ${current.dose}`}), 350); });

  /* ───────── modales ───────── */
  function openModal(sel) { const m = $(sel); m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; lenis && lenis.stop(); }
  function closeModal(sel) { const m = $(sel); m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; lenis && lenis.start(); }
  $$('.modal').forEach((m) => m.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal('#' + m.id); }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.modal.open').forEach((m) => closeModal('#' + m.id)); });

  /* ───────── formulario de evaluación ───────── */
  const form = $('#evalForm'); let step = 1, interest = '';
  function showStep(n) {
    step = n;
    $$('.eval-step', form).forEach((s) => s.classList.toggle('on', +s.dataset.step === n));
    $('#evalBar').style.width = `${Math.min(n, 3) / 3 * 100}%`;
    $('#evalBack').style.visibility = n > 1 && n < 4 ? 'visible' : 'hidden';
    $('#evalNext').style.display = n < 4 ? '' : 'none';
    $('#evalNext').textContent = n === 3 ? 'Preparar mensaje' : 'Continuar';
    $('#evalErr').textContent = '';
  }
  function openEval(opts = {}) {
    form.reset(); interest = opts.interest || '';
    $('#interest').hidden = !interest; $('#interest').textContent = interest ? `Interés: ${interest}` : '';
    if (opts.goal) { const g = form.querySelector(`input[name="goal"][value="${opts.goal}"]`); if (g) g.checked = true; }
    showStep(1); openModal('#evalModal');
  }
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-open-eval]'); if (b) { e.preventDefault(); document.body.classList.remove('menu'); openEval({goal: b.dataset.goal}); } });
  function valid(n) {
    const s = form.querySelector(`.eval-step[data-step="${n}"]`);
    if (n === 1 && !form.querySelector('input[name="goal"]:checked')) return 'Elige al menos un objetivo.';
    for (const el of $$('[required]', s)) {
      if (el.type === 'checkbox' ? !el.checked : !el.value.trim()) { el.focus(); return 'Completa los campos marcados para continuar.'; }
      if (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value)) { el.focus(); return 'Revisa el email.'; }
    }
    return '';
  }
  $('#evalNext').addEventListener('click', () => {
    const err = valid(step); if (err) { $('#evalErr').textContent = err; return; }
    if (step < 3) return showStep(step + 1);
    const f = new FormData(form);
    const goals = f.getAll('goal').join(', ');
    const lines = ['Hola, quiero solicitar una evaluación en Make Way 4 Health.', '',
      `Objetivo(s): ${goals}`, f.get('metas') ? `Metas: ${f.get('metas')}` : '', interest ? `Interés: ${interest}` : '',
      `Altura: ${f.get('altura') || '-'} · Peso actual: ${f.get('peso') || '-'} · Peso meta: ${f.get('meta') || '-'}`, '',
      `Ubicación: ${f.get('ciudad')}, ${f.get('estado')}, ${f.get('pais')}`, '',
      `Nombre: ${f.get('nombre')} ${f.get('apellido')}`, `Fecha de nacimiento: ${f.get('nacimiento')}`, `Teléfono: ${f.get('telefono')}`, `Email: ${f.get('email')}`,
      `Contacto preferido: ${f.get('canal')}`].filter((l) => l !== '');
    const url = wa(lines.join('\n'));
    $('#waLink').href = url; showStep(4); window.open(url, '_blank', 'noopener');
  });
  $('#evalBack').addEventListener('click', () => showStep(Math.max(1, step - 1)));
  $$('[data-whatsapp]').forEach((a) => (a.href = wa('Hola, me gustaría recibir información sobre Make Way 4 Health.')));

  /* ───────── señales (TOFU) ───────── */
  const sigMsg = ['Marca las que te representan.', 'Una señal ya vale una conversación.', 'Tu cuerpo te está pidiendo otra estrategia.', 'Es momento de evaluarlo con un profesional.'];
  let sigGoal = '';
  $('#signalGrid').addEventListener('click', (e) => {
    const s = e.target.closest('.signal'); if (!s) return;
    s.classList.toggle('on'); const on = $$('.signal.on'); sigGoal = on.length ? on[on.length - 1].dataset.goal : '';
    $('#signalCount').textContent = on.length; $('#signalMsg').textContent = sigMsg[Math.min(on.length, 3)];
  });

  /* ───────── test de ruta (TOFU → MOFU) ───────── */
  const QR = [
    {t: 'Peso y metabolismo', img: 'assets/img/metab.jpg', goal: 'Bajar grasa', p: 'Una ruta de 12 semanas que parte de tus medidas y peso meta, con nutrición, fuerza y seguimiento. Si existe indicación, el equipo puede evaluar terapias GLP-1.'},
    {t: 'Hormonas y vitalidad', img: 'assets/img/horm.jpg', goal: 'Hormonas y vitalidad', p: 'Exploramos energía, sueño, función sexual y contexto hormonal. Cuando corresponde, el médico solicita estudios y diseña una estrategia con controles definidos.'},
    {t: 'Fuerza y recuperación', img: 'assets/img/recov.jpg', goal: 'Fuerza y recuperación', p: 'Revisamos carga, movilidad, dolor y sueño para que vuelvas a progresar, con entrenamiento, nutrición y herramientas seleccionadas para tu caso.'},
    {t: 'Longevidad y energía', img: 'assets/img/longev.jpg', goal: 'Longevidad y energía', p: 'Sueño, recuperación, nutrición y biomarcadores organizados en un plan sostenible para sentirte con energía y enfoque a largo plazo.'},
  ];
  const quizTail = {a: 'Empezar con dirección clínica te ahorra meses de prueba y error.', b: 'Llevas tiempo intentándolo: un protocolo medido puede destrabar tu progreso.', c: 'Después de un año, lo que falta suele ser estrategia y seguimiento, no esfuerzo.', d: 'Si ya probaste de todo, es momento de que un profesional mire tu caso completo.'};
  let qs = 1, qa = {};
  const quiz = $('#quiz');
  function quizGo(n) {
    qs = n; $$('.q', quiz).forEach((q) => q.classList.toggle('on', +q.dataset.q === n));
    $('#quizBar').style.width = `${Math.min(n, 3) / 3 * 100}%`;
    $('#quizStepLabel').textContent = n < 4 ? `Pregunta ${n} de 3` : 'Resultado listo';
    if (n === 4) {
      const r = QR[+qa[1] || 0];
      $('#qrImg').src = r.img; $('#qrTitle').textContent = r.t; $('#qrText').textContent = `${r.p} ${quizTail[qa[2]] || ''}`;
      $('#qrEval').dataset.goal = r.goal;
    }
  }
  quiz.addEventListener('click', (e) => { const b = e.target.closest('.q-opts button'); if (!b) return; qa[qs] = b.dataset.v; quizGo(qs + 1); });
  $('#quizRestart').addEventListener('click', () => { qa = {}; quizGo(1); });
  $('#qrEval').addEventListener('click', (e) => { e.stopPropagation(); openEval({goal: e.currentTarget.dataset.goal, interest: `Ruta recomendada en el test: ${$('#qrTitle').textContent}`}); });

  /* ───────── comunidad ───────── */
  const POSTS = [
    ['@analiareyess', 'https://www.instagram.com/analiareyess/p/DeXvtZ9H4mU/', '248b2bf6e260b630'],
    ['@alejandravillalobos_', 'https://www.instagram.com/alejandravillalobos_/reel/DcSEK0duic_/', '474e2f23a6011723'],
    ['@isander.perez', 'https://www.instagram.com/isander.perez/reel/DbT6KNUhVLc/', '583b8277c472a469'],
    ['@uchu.uchu', 'https://www.instagram.com/uchu.uchu/reel/Ddy322WKCu9/', 'df400e4875c3b719'],
    ['@priscila_fierce', 'https://www.instagram.com/priscila_fierce/reel/DeGCGlZtjYH/', '912d720d0cd128ea'],
    ['@adonismiguel', 'https://www.instagram.com/adonismiguel/reel/DePjb-Ihgsm/', '6bcfb4df00946ec2'],
    ['@makewayholdings', 'https://www.instagram.com/makewayholdings/reel/DeVnIReOSiw/', '01851b0cc103252c'],
    ['@uchu.uchu', 'https://www.instagram.com/uchu.uchu/reel/DeX-iNoo6nX/', '58dc90fa1b59951f'],
  ];
  $('#communityRail').innerHTML = POSTS.map(([u, href, img]) => `
    <a class="ig" href="${href}" target="_blank" rel="noopener"><img src="assets/community/${img}.jpg" alt="Publicación de ${u}" loading="lazy">
      <span class="ig-play">▶</span><span class="ig-meta">${u}<i>↗</i></span></a>`).join('');
  // arrastrar para desplazar
  const crail = $('#communityRail'); let down = false, sx = 0, sl = 0, moved = false;
  crail.addEventListener('pointerdown', (e) => { down = true; moved = false; sx = e.clientX; sl = crail.scrollLeft; });
  window.addEventListener('pointerup', () => (down = false));
  crail.addEventListener('pointermove', (e) => { if (!down) return; const d = e.clientX - sx; if (Math.abs(d) > 5) moved = true; crail.scrollLeft = sl - d; });
  crail.addEventListener('click', (e) => { if (moved) e.preventDefault(); }, true);

  /* ───────── embajadores ───────── */
  const amb = Array.from({length: 23}, (_, i) => String(i + 1).padStart(2, '0'));
  const ambHTML = amb.map((n) => `<div class="amb"><img src="assets/ambassadors/ambassador-${n}.jpg" alt="Embajador ${n}" loading="lazy"><span>${n}</span></div>`).join('');
  $('#ambTrack').innerHTML = ambHTML + ambHTML;
  let ambI = 0; setInterval(() => { ambI = (ambI + 1) % 23; $('#ambNow').textContent = amb[ambI]; }, 1400);

  /* ───────── credenciales ───────── */
  const CREDS = [
    {k: 'IDENTIDAD DE PROVEEDOR', h: 'NPI de organización', img: 'npi', d: [['Entidad', 'Make Way 4 Health Medical Center LLC'], ['NPI', '1407662448'], ['Tipo', 'Organización (NPI-2)']], note: 'El NPI identifica a un proveedor dentro del sistema nacional. Por sí solo no acredita licencia, certificación ni autorización clínica.', link: ['Verificar en NPPES', 'https://npiregistry.cms.hhs.gov/provider-view/1407662448']},
    {k: 'ESTABLECIMIENTO DE SALUD', h: 'Health Care Clinic Establishment Permit', img: 'dbpr', d: [['Titular mostrado', 'Make Way 4 Health Medical Center'], ['Número', '6037035'], ['Vencimiento mostrado', '31 Mar 2028']], note: 'Documento emitido por el Florida Department of Business and Professional Regulation bajo el capítulo aplicable mostrado en el permiso.', link: ['Verificar en DBPR', 'https://www.myfloridalicense.com/wl11.asp?brd=H%20verify-license&mode=0']},
    {k: 'CREDENCIAL PROFESIONAL', h: 'Registered Nurse', img: 'rn', d: [['Profesional', 'Alexander Michael Jorge'], ['Licencia mostrada', 'RN 9341172'], ['Vencimiento mostrado', '30 Apr 2028']], link: ['Verificar en Florida Health', 'https://mqa-internet.doh.state.fl.us/MQASearchServices/HealthCareProviders']},
    {k: 'CREDENCIAL PROFESIONAL', h: 'Advanced Practice Registered Nurse', img: 'aprn', d: [['Profesional', 'Alexander Michael Jorge'], ['Licencia mostrada', 'APRN 11001662'], ['Vencimiento mostrado', '31 Jul 2028']], link: ['Verificar en Florida Health', 'https://mqa-internet.doh.state.fl.us/MQASearchServices/HealthCareProviders']},
    {k: 'FORMACIÓN CONTINUA', h: 'Certificado profesional', img: 'training', d: [['Profesional', 'Alexander Jorge, APRN'], ['Programa mostrado', 'Allergan Medical Institute Master Expert'], ['Fecha mostrada', '21 Oct 2023']], note: 'La formación complementaria aporta contexto profesional, pero no sustituye una licencia ni amplía por sí sola el alcance legal de práctica.'},
    {k: 'DEA · REGISTROS CONTROLADOS', h: 'Documentación DEA aportada', d: [], note: 'El centro aportó certificados profesionales para revisión interna. Los números completos no se publican en esta página para reducir su exposición y uso indebido. La existencia de un registro no reemplaza la evaluación de alcance, vigencia, ubicación y requisitos aplicables a cada acto clínico.', link: ['Información oficial de DEA', 'https://www.dea.gov/drug-information/registration']},
  ];
  $('#credGrid').innerHTML = CREDS.map((c) => `
    <article class="cred">
      ${c.img ? `<div class="cred-doc"><img src="assets/credentials/credential-${c.img}.jpg" alt="${c.h}" loading="lazy"></div>` : '<div class="cred-doc" style="display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:56px;color:var(--gold)">DEA</div>'}
      <div class="cred-body"><span class="k">${c.k}</span><h3>${c.h}</h3>
        ${c.d.length ? `<dl>${c.d.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>` : ''}
        ${c.note ? `<p class="note">${c.note}</p>` : ''}
        ${c.link ? `<a href="${c.link[1]}" target="_blank" rel="noopener">${c.link[0]} ↗</a>` : ''}
      </div>
    </article>`).join('');
  let credOpen = false;
  $('#credToggle').addEventListener('click', () => {
    credOpen = !credOpen; const dir = $('#credDir');
    $('#credToggle').textContent = credOpen ? 'Ocultar credenciales' : 'Ver credenciales';
    if (window.gsap) {
      gsap.to(dir, {height: credOpen ? 'auto' : 0, duration: 0.9, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh()});
      if (credOpen) gsap.from($$('.cred', dir), {y: 40, opacity: 0, stagger: 0.08, duration: 0.7, delay: 0.25, ease: 'power3.out'});
    } else dir.style.height = credOpen ? 'auto' : '0';
  });

  /* ───────── menú móvil + header ───────── */
  $('#burger').addEventListener('click', () => document.body.classList.toggle('menu'));
  $$('#nav a').forEach((a) => a.addEventListener('click', () => document.body.classList.remove('menu')));

  /* ───────── smooth scroll (Lenis) ───────── */
  let lenis = null;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({duration: 1.15, smoothWheel: true});
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => { const id = a.getAttribute('href'); if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, {offset: -80}); } }));
  }

  /* ───────── partículas doradas del hero ───────── */
  (function particles() {
    const c = $('#particles'); if (!c) return; const x = c.getContext('2d'); let W, H, P;
    const size = () => { W = c.width = c.offsetWidth * devicePixelRatio; H = c.height = c.offsetHeight * devicePixelRatio; P = Array.from({length: Math.round(W * H / 26000)}, () => ({x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 1.6 + 0.4) * devicePixelRatio, v: Math.random() * 0.35 + 0.08, a: Math.random() * Math.PI * 2})); };
    size(); addEventListener('resize', size);
    (function loop() {
      x.clearRect(0, 0, W, H);
      for (const p of P) { p.y -= p.v * devicePixelRatio; p.a += 0.02; p.x += Math.sin(p.a) * 0.3; if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        const o = 0.25 + 0.45 * Math.abs(Math.sin(p.a)); x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fillStyle = `rgba(240,215,159,${o})`; x.shadowBlur = 8; x.shadowColor = 'rgba(240,215,159,.8)'; x.fill(); }
      if (!reduce) requestAnimationFrame(loop);
    })();
  })();

  /* ───────── cursor glow + magnéticos + tilt ───────── */
  const glow = $('.cursor-glow');
  addEventListener('pointermove', (e) => { if (glow) glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; });
  if (matchMedia('(hover:hover)').matches) {
    document.addEventListener('pointermove', (e) => {
      const m = e.target.closest('.magnetic');
      $$('.magnetic').forEach((b) => { if (b !== m) b.style.transform = ''; });
      if (m) { const r = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.25}px)`; }
    });
    $$('.tilt').forEach((t) => {
      t.addEventListener('pointermove', (e) => { const r = t.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5; t.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`; });
      t.addEventListener('pointerleave', () => (t.style.transform = ''));
    });
  }

  /* ───────── GSAP ───────── */
  function splitWords(el) {
    if (el.dataset.split) return; el.dataset.split = 1;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return; if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            const o = document.createElement('span'); o.className = 'w'; const i = document.createElement('span'); i.textContent = w; o.appendChild(i); frag.appendChild(o);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('w')) walk(n);
      });
    };
    walk(el);
  }
  function startMotion() {
    document.body.classList.add('ready');
    if (!window.gsap || reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) lenis.on('scroll', ScrollTrigger.update);

    // hero
    $$('.hero .split').forEach(splitWords);
    const tl = gsap.timeline({defaults: {ease: 'expo.out'}});
    tl.from('.hero-img', {scale: 1.25, opacity: 0, duration: 2.2, ease: 'power2.out'}, 0)
      .from('.hero .split .w>span', {yPercent: 110, rotate: 6, duration: 1.3, stagger: 0.07}, 0.3)
      .from('.hero .reveal-up', {y: 30, opacity: 0, duration: 1, stagger: 0.12}, 0.8)
      .from('.trust-item', {y: 30, opacity: 0, duration: 0.9, stagger: 0.08}, 1.1)
      .from('.header-in > *', {y: -20, opacity: 0, duration: 0.8, stagger: 0.06, clearProps: 'transform,opacity'}, 0.4);
    gsap.to('.hero-img', {yPercent: 12, ease: 'none', scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true}});
    gsap.to('.hero-in', {yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true}});

    // títulos por palabras
    $$('.split-lines').forEach((el) => {
      splitWords(el);
      gsap.from($$('.w>span', el), {yPercent: 115, rotate: 4, duration: 1.2, stagger: 0.05, ease: 'expo.out', scrollTrigger: {trigger: el, start: 'top 85%'}});
    });
    // reveal-up (fuera del hero)
    $$('.reveal-up').filter((el) => !el.closest('.hero')).forEach((el) => {
      gsap.from(el, {y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: {trigger: el, start: 'top 90%'}});
    });
    // imágenes con cortina
    $$('.reveal-clip').forEach((el) => gsap.from(el, {clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: {trigger: el, start: 'top 80%'}}));
    $$('[data-parallax]').forEach((img) => gsap.fromTo(img, {yPercent: -8}, {yPercent: 8, ease: 'none', scrollTrigger: {trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true}}));

    // línea de pasos
    gsap.to('.steps-line span', {scaleY: 1, ease: 'none', scrollTrigger: {trigger: '.protocol-steps', start: 'top 75%', end: 'bottom 55%', scrub: true}});

    // rutas apiladas: cada tarjeta se encoge cuando la siguiente la cubre
    if (matchMedia('(min-width:1081px)').matches) {
      const cards = $$('.route');
      cards.forEach((card, i) => {
        gsap.fromTo($('.route-img img', card), {scale: 1.2}, {scale: 1.02, ease: 'none', scrollTrigger: {trigger: card, start: 'top bottom', end: 'top 110px', scrub: true}});
        if (i < cards.length - 1) gsap.to(card, {scale: 0.92, opacity: 0.45, filter: 'blur(2px)', ease: 'none', scrollTrigger: {trigger: cards[i + 1], start: 'top bottom', end: 'top 110px', scrub: true}});
      });
    } else $$('.route').forEach((c) => gsap.from(c, {y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: {trigger: c, start: 'top 85%'}}));

    // marquee acelera con el scroll
    const mq = $('.marquee-track');
    ScrollTrigger.create({onUpdate: (s) => { mq.style.animationDuration = `${Math.max(10, 38 - Math.abs(s.getVelocity()) / 120)}s`; }});

    // comunidad, equipo, how
    gsap.from('.ig', {x: 120, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', scrollTrigger: {trigger: '.community-rail', start: 'top 85%'}});
    gsap.from('.amb-marquee', {opacity: 0, y: 60, duration: 1.2, ease: 'power3.out', scrollTrigger: {trigger: '.amb-marquee', start: 'top 90%'}});
  }
  window.addEventListener('load', () => setTimeout(startMotion, 350));
  setTimeout(() => document.body.classList.contains('ready') || startMotion(), 4000);

  // header, riel del embudo y barra fija
  const rail = $$('.funnel-rail a'), stages = $$('[data-stage]:not(a)');
  addEventListener('scroll', () => {
    $('#header').classList.toggle('scrolled', scrollY > 30);
    document.body.classList.toggle('past-hero', scrollY > innerHeight * 0.8);
    let cur = 1; const mid = innerHeight * 0.45;
    for (const s of stages) if (s.getBoundingClientRect().top < mid) cur = +s.dataset.stage;
    rail.forEach((a) => { const n = +a.dataset.stage; a.classList.toggle('on', n === cur); a.classList.toggle('done', n < cur); });
  }, {passive: true});
})();
