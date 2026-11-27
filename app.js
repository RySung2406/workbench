(() => {
  'use strict';
  const symbols = {
    library:'M4 5.5h4v14H4z M10 4h4v15.5h-4z M16 6.4l3.5-.9 3 13.4-3.5.9z',
    projects:'M3 6.5h6l2 2H21v11H3z',
    tools:'m14.5 6 .6-2.4a6 6 0 0 0-6.5 7.3l-5.5 5.5a2.3 2.3 0 0 0 3.3 3.3l5.5-5.5a6 6 0 0 0 7.6-7l-3.5 3.3-3-3z',
    auto:'m3 14 .8-4.1 2.7-.9L9 5.8h7L18.5 9l2.5 1v5h-2 M6 15H3v-1 M9.5 15h5 M8 10h9 M9 16a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0 M19.5 16a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0',
    robot:'M4 20h10v-2H4z M8 17l-1-5 5-5 M11 5.5a2.4 2.4 0 1 0 4.8 0 2.4 2.4 0 1 0-4.8 0 M15.5 6.5l3.7 2.7 M18 9l-.5 3 2.5 1 M19.5 8l2 1.1.3 2.1 M9.4 12l3.2-3',
    m2:'M4 3v17h17 M7 16c2 0 2.5-7 5-7s2.7 6.2 4.5 6.2 2.2-5.5 4-8 M7 3v2 M20 17v3',
    mech:'M4 18 17 5l3 3L7 21z M12.5 10l1.8 1.8 M9.8 12.7l1.2 1.2 M7.2 15.3l1.8 1.8 M4 4l4.5 1.3-3.2 3.2z M8 7l2.5 2.5',
    chevron:'m9 5 7 7-7 7', back:'m15 5-7 7 7 7', saved:'M6.5 4h11v16l-5.5-4-5.5 4z', external:'M13 4h7v7 M20 4 10 14 M10 6H5v13h13v-5', check:'m4 12 5 5L20 6'
  };
  const view=document.getElementById('view'), nav=document.getElementById('sections'), input=document.getElementById('search');
  const routePart = value => encodeURIComponent(value);
  const el=(tag, cls='', text='')=>{const n=document.createElement(tag); if(cls)n.className=cls; if(text!=='')n.textContent=text; return n;};
  function icon(key,size=20){
    const ns='http://www.w3.org/2000/svg',s=document.createElementNS(ns,'svg'),p=document.createElementNS(ns,'path');
    for(const [k,v] of Object.entries({viewBox:'0 0 24 24',width:size,height:size,fill:'none',stroke:'currentColor','stroke-width':'1.6','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'}))s.setAttribute(k,v);
    p.setAttribute('d',symbols[key]);s.append(p);return s;
  }
  function link(href, cls='', text=''){const a=el('a',cls,text); a.href=href;return a;}
  function heading(text, right){const h=el('div','sect-head');h.append(el('h2','',text));if(right)h.append(right);return h;}
  function route(){
    let hash=location.hash.slice(1), parts=hash.split('/');
    try{return parts.map(decodeURIComponent);}catch{return ['home'];}
  }
  const embeddedSources = window.FIELD_MATERIALS || [];
  let sources = embeddedSources;
  const aliases = {
    auto: '汽車 車輛 car automotive gear drivetrain',
    robot: '機械人 機器人 robot robotics',
    m2: 'DSE M2 數學 代數 向量 vector vectors calculus mathematics',
    mech: 'HKU ME 機械工程 mechanical engineering'
  };
  const tools = [
    {id:'units', terms:'工程單位換算 速度 長度 壓力 質量 能量 km/h m/s MPa unit units converter conversion speed length mass energy pressure'},
    {id:'vectors', terms:'三維向量計算 數學 向量 點積 內積 夾角 DSE M2 vectors vector dot product angle'}
  ];
  const locale = () => window.FieldLocale.get();
  const text = () => window.FIELD_UI[locale()];
  const english = () => locale() === 'en';
  const catalog = () => english() ? window.FIELD_CATALOG_EN : window.FIELD_CATALOG;
  const otherCatalog = () => english() ? window.FIELD_CATALOG : window.FIELD_CATALOG_EN;
  const findTopic = id => catalog().topics.find(topic => topic.id === id);
  const otherNote = id => otherCatalog().notes.find(note => note.id === id);
  const externalLink = url => /^https?:\/\//i.test(url);
  function savedIds() {
    if (window.FieldAccount?.getSavedIds) return new Set(window.FieldAccount.getSavedIds());
    try {
      const ids = JSON.parse(localStorage.getItem('study-notes-bookmarks') || '[]');
      return new Set(Array.isArray(ids) ? ids.filter(id => typeof id === 'string') : []);
    } catch { return new Set(); }
  }
  async function toggleSaved(id) {
    if (window.FieldAccount?.toggleSaved) return window.FieldAccount.toggleSaved(id);
    const saved = savedIds();
    if (saved.has(id)) saved.delete(id); else saved.add(id);
    localStorage.setItem('study-notes-bookmarks', JSON.stringify([...saved]));
  }
  function syncSaveButton(button, id) {
    const saved = savedIds().has(id);
    button.setAttribute('aria-pressed', String(saved));
    button.replaceChildren(icon(saved ? 'check' : 'saved', 17), saved ? text().bookmarked : text().bookmark);
  }
  function saveButton(id) {
    const button = el('button', 'action');
    button.type = 'button';
    button.dataset.bookmarkId = id;
    syncSaveButton(button, id);
    button.onclick = async () => {
      button.disabled = true;
      try { await toggleSaved(id); syncSaveButton(button, id); }
      catch { button.textContent = text().saveError; }
      finally { button.disabled = false; }
    };
    return button;
  }
  function notesAsRows() {
    return catalog().notes.map(n => {
      const alt = otherNote(n.id);
      const keywords = [n, alt].filter(Boolean).flatMap(note => [note.title, note.summary, ...note.sections.flatMap(s => [s.heading,s.text])]);
      return {title:n.title, meta:findTopic(n.topic).name, href:'#note/'+n.id, kind:'notes', topic:n.topic, keywords:keywords.join(' ')};
    });
  }
  function resourcesAsRows() {
    const translations = window.FIELD_MATERIALS_EN || [];
    return sources.map(material => {
      const translation = translations.find(row => row.url === material.url);
      const translated = english() ? translation : null;
      return {title:translated?.title || material.title, meta:findTopic(material.topic)?.name || material.topic,
        href:material.url, kind:'resources', topic:material.topic,
        keywords:[material.title, material.summary, translation?.title, translation?.summary].join(' ')};
    });
  }
  const normalize = s => (s || '').normalize('NFKC').toLowerCase();
  function highlight(title, term) {
    const node = el('b');
    const word = term.trim().split(/\s+/).find(v => v && title.toLowerCase().includes(v.toLowerCase()));
    if (!word) node.textContent = title;
    else {
      const at = title.toLowerCase().indexOf(word.toLowerCase());
      node.append(title.slice(0,at), el('mark','',title.slice(at,at+word.length)), title.slice(at+word.length));
    }
    return node;
  }
  function rowList(items, q='') {
    const wrap = el('div','rows');
    for (const x of items) {
      const a = link(x.href,'row'), left = el('div');
      if (x.meta) left.append(el('span','meta',x.meta));
      left.append(highlight(x.title,q));
      a.append(left,icon(externalLink(x.href) ? 'external' : 'chevron',17));
      if (externalLink(x.href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      wrap.append(a);
    }
    return wrap;
  }
  function card(topic) {
    const a = link('#topic/'+topic.id,'topic-card');
    const ic = el('span','topic-icon');
    ic.append(icon(topic.id,27));
    const label = el('div','topic-title');
    const count = catalog().notes.filter(n => n.topic === topic.id).length;
    label.append(el('span','',topic.name),el('span','count',text().count(count)));
    a.append(ic,label);
    return a;
  }
  function home() {
    const grid = el('div','home-grid'), directory = el('section'), list = el('section');
    const cards = el('div','topic-grid');
    cards.append(...catalog().topics.map(card));
    directory.append(heading(text().directory),cards);
    const items = notesAsRows();
    const pick = catalog().topics.map(t => items.find(i => i.topic === t.id)).filter(Boolean);
    list.append(heading(text().featured,link('#notes','more',text().all)),rowList(pick));
    grid.append(directory,list);
    view.append(grid);
  }
  function back(to,label) {
    const a = link(to,'back');
    a.append(icon('back',15),label);
    return a;
  }
  function title(label) { view.append(el('h2','detail-title',label)); }
  function topicPage(topic) {
    view.append(back('#home',text().directory));
    title(topic.name);
    view.append(heading(text().notes),rowList(notesAsRows().filter(n => n.topic === topic.id)));
    const sources = resourcesAsRows().filter(r => r.topic === topic.id);
    if (sources.length) {
      const section = el('section','section-gap');
      section.append(heading(text().resources),rowList(sources));
      view.append(section);
    }
  }
  function detail(item, project) {
    const article = el('article','reading');
    const topic = findTopic(item.topic);
    article.append(back(project ? '#projects' : '#topic/'+topic.id,project ? text().projects : topic.name),
      el('h2','detail-title',item.title || item.name),el('p','intro',item.summary || item.description));
    if (!project) article.append(saveButton(item.id));
    for (const part of item.sections) {
      const section = el('section');
      section.append(el('h3','',part.heading),el('p','',part.text));
      article.append(section);
    }
    const related = notesAsRows().filter(row => (item.related || []).includes(row.href.split('/')[1]));
    if (related.length) {
      const section = el('section');
      section.append(heading(text().related),rowList(related));
      article.append(section);
    }
    if (project && item.url) {
      const a = link(item.url,'action',item.url.startsWith('#') ? text().openTool : text().github);
      if (externalLink(item.url)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      article.append(a);
    }
    view.append(article);
  }
  function projectsPage() {
    title(text().projects);
    for (const status of ['active','complete']) {
      const items = catalog().projects.filter(p => p.status === status).map(p => ({title:p.name,meta:p.description,href:'#project/'+p.id}));
      if (!items.length) continue;
      const section = el('section','section-gap');
      section.append(heading(text()[status]),rowList(items));
      view.append(section);
    }
  }
  function searchPage(q) {
    const {topics, projects} = catalog();
    const candidates = [
      ...topics.map(t => ({title:t.name,meta:text().topic,href:'#topic/'+t.id,kind:'topic',topic:t.id,keywords:t.en})),
      ...notesAsRows(), ...resourcesAsRows(),
      ...projects.map(p => {
        const alt = otherCatalog().projects.find(x => x.id === p.id);
        return {title:p.name, meta:text().projects, href:'#project/'+p.id, kind:'projects', keywords:[p.description,alt?.name,alt?.description].join(' ')};
      }),
      ...tools.map(t => ({title:text()[t.id],meta:text().tools,href:'#tools/'+t.id,kind:'tools',keywords:t.terms}))
    ];
    const words = normalize(q).trim().split(/\s+/).filter(Boolean);
    function score(item) {
      const title = normalize(item.title), meta = normalize([item.meta,aliases[item.topic]].join(' ')), body = normalize(item.keywords);
      let points = 0;
      for (const w of words) {
        if (title.includes(w)) points += 5;
        else if (meta.includes(w)) points += 2;
        else if (body.includes(w)) points++;
        else return 0;
      }
      return points;
    }
    const ranked = candidates.map(x => ({x,score:score(x)})).filter(i => i.score > 0).sort((a,b) => b.score-a.score).map(i => i.x);
    const hdr = el('div','results-heading');
    hdr.append(el('h2','',text().searchResults),el('span','',text().results(q,ranked.length)));
    view.append(hdr);
    if (!ranked.length) { view.append(el('p','empty',text().noResults)); return; }
    for (const kind of ['topic','notes','projects','tools','resources']) {
      const items = ranked.filter(x => x.kind === kind);
      if (!items.length) continue;
      const section = el('section','section-gap');
      section.append(heading(text()[kind]),rowList(items,q));
      view.append(section);
    }
  }
  function updateHeader() {
    const ui = text();
    const saves = document.querySelector('.saves');
    document.querySelector('.brand').setAttribute('aria-label',ui.siteHome);
    const brandName = document.querySelector('.brand b');
    brandName.textContent = ui.site;
    brandName.lang = locale();
    saves.setAttribute('aria-label',ui.bookmarks);
    saves.querySelector('span').textContent = ui.bookmarks;
    document.querySelector('.skip').textContent = ui.skip;
    document.querySelector('meta[name="description"]').content = ui.description;
    document.querySelector('.hero').setAttribute('aria-label',ui.searchLabel);
    document.querySelector('h1').textContent = ui.hero;
    input.setAttribute('aria-label',ui.searchLabel);
    input.placeholder = ui.placeholder;
    document.querySelector('#search-form button').textContent = ui.search;
    const quick = document.querySelector('.quick');
    quick.setAttribute('aria-label',ui.quick);
    quick.replaceChildren(...ui.suggestions.map(q => link('#search/'+routePart(q),'',q)));
    nav.setAttribute('aria-label',ui.nav);
    const toggle = document.getElementById('language-toggle');
    toggle.lang = english() ? 'zh-HK' : 'en';
    toggle.textContent = english() ? '繁體中文' : 'English';
    toggle.setAttribute('aria-label',english() ? '切換至繁體中文' : 'Switch to English');
  }
  function updateNav(page) {
    const active = ['projects','project'].includes(page) ? 'projects' : page === 'tools' ? 'tools' : ['search','saved'].includes(page) ? '' : 'library';
    nav.replaceChildren(...['library','projects','tools'].map(k => {
      const a = link(k === 'library' ? '#home' : '#'+k, 'tab'+(active === k ? ' active' : ''));
      a.append(icon(k),text()[k]);
      if (active === k) a.setAttribute('aria-current','page');
      return a;
    }));
    const saved = document.querySelector('.saves');
    if (page === 'saved') saved.setAttribute('aria-current','page');
    else saved.removeAttribute('aria-current');
  }
  function render({localeChange=false, preserveSearch=false}={}) {
    const [part='',id=''] = route(), page = part || 'home', isHome = page === 'home' || page === 'main';
    document.body.classList.toggle('compact',!isHome);
    updateNav(page);
    if (!localeChange && !preserveSearch) input.value = page === 'search' ? id : '';
    if (localeChange && page === 'tools' && window.FieldTools?.setLanguage && view.querySelector('.detail-title')) {
      view.querySelector('.detail-title').textContent = text().tools;
      window.FieldTools.setLanguage(locale());
    } else {
      view.replaceChildren();
      const {notes,projects} = catalog();
      if (isHome) home();
      else if (page === 'topic' && findTopic(id)) topicPage(findTopic(id));
      else if (page === 'note' && notes.some(n => n.id === id)) detail(notes.find(n => n.id === id), false);
      else if (page === 'project' && projects.some(p => p.id === id)) detail(projects.find(p => p.id === id), true);
      else if (page === 'projects') projectsPage();
      else if (page === 'tools') {
        title(text().tools);
        const container = el('div');
        view.append(container);
        window.FieldTools.mount(container,id);
      } else if (page === 'notes') {
        title(text().all);
        view.append(rowList(notesAsRows()));
      } else if (page === 'saved') {
        title(text().bookmarks);
        const ids = savedIds();
        const items = notesAsRows().filter(n => ids.has(n.href.split('/')[1]));
        view.append(items.length ? rowList(items) : el('p','empty',text().emptySaved));
      } else if (page === 'search' && id.trim()) searchPage(id.trim());
      else { title(text().notFound); view.append(back('#home',text().returnHome)); }
    }
    document.title = isHome ? text().site : (view.querySelector('h2')?.textContent || text().search) + ' · ' + text().site;
    window.dispatchEvent(new CustomEvent('field:render', {detail:{page,id,locale:locale()}}));
  }
  function refreshSaved() {
    if (route()[0] === 'saved') render();
    else view.querySelectorAll('[data-bookmark-id]').forEach(button => syncSaveButton(button,button.dataset.bookmarkId));
  }
  document.getElementById('language-toggle').addEventListener('click', () => window.FieldLocale.set(english() ? 'zh-HK' : 'en'));
  document.querySelector('.skip').addEventListener('click',e => {
    e.preventDefault();
    document.getElementById('main').focus();
  });
  document.getElementById('search-form').addEventListener('submit',e => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) location.hash = 'search/'+routePart(q); else input.focus();
  });
  document.addEventListener('keydown',e => {
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.target.closest('input,select,textarea,[contenteditable]')) {
      e.preventDefault(); input.focus(); input.select();
    }
  });
  window.addEventListener('hashchange', () => {
    render();
    window.scrollTo(0,0);
    document.getElementById('main').focus({preventScroll:true});
  });
  window.addEventListener('field:locale', () => { updateHeader(); render({localeChange:true, preserveSearch:true}); });
  window.addEventListener('field:account-changed', refreshSaved);
  window.addEventListener('storage', e => { if (e.key === 'study-notes-bookmarks' || e.key === null) refreshSaved(); });
  updateHeader();
  render();
  if (!location.hash && window.matchMedia('(pointer:fine) and (min-width:801px)').matches) input.focus({preventScroll:true});
  async function refreshContent() {
    let changed = false;
    try { changed = await window.loadFieldCatalog?.(); } catch { /* Serve the embedded catalogue. */ }
    if (changed) sources = window.FIELD_MATERIALS;
    const page = route()[0] || 'home';
    if (changed && page !== 'tools') render({preserveSearch:true});
    const csv = await window.loadFieldMaterials?.();
    if (!Array.isArray(csv) || csv === embeddedSources) return;
    sources = csv;
    if (['topic','search'].includes(route()[0])) render({preserveSearch:true});
  }
  refreshContent().catch(() => {});
})();
