(function fieldApp(){
  'use strict';
  const { games, groups, sources } = window.PlayField;
  const byId = new Map(games.map(game => [game.id, game]));
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const icon = (name, extra='') => `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const makeId = () => globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const stamps = [
    {id:'invent', label:'我发明了新玩法', icon:'spark'},
    {id:'lead', label:'我带爸爸玩', icon:'flag'},
    {id:'try', label:'我试了新动作', icon:'foot'}
  ];
  const places = {home:'在家玩',out:'下楼玩'};
  const groupIcons = {move:'foot',steady:'compass',support:'out',team:'flag',rhythm:'spark'};
  const defaultCrew = {id:'first',name:'探险员'};
  const prefix = 'kids-playfield:';
  const memory = new Map();
  let memoryOnly = false;
  function read(key, fallback) {
    let raw;
    try { raw = memoryOnly ? memory.get(key) : localStorage.getItem(prefix+key); }
    catch { memoryOnly = true; raw = memory.get(key); }
    if (!raw) return fallback;
    try { memory.set(key,raw); return JSON.parse(raw); } catch { return fallback; }
  }
  function write(key, value) {
    const raw = JSON.stringify(value);
    memory.set(key,raw);
    try { if (!memoryOnly) localStorage.setItem(prefix+key,raw); }
    catch { memoryOnly = true; }
  }
  function getCrew() {
    const value = read('profiles',[defaultCrew]);
    const list = Array.isArray(value) ? value.filter(p => p && typeof p.id === 'string' && typeof p.name === 'string') : [];
    return list.length ? list : [defaultCrew];
  }
  let crew = getCrew();
  let activeId = read('active',defaultCrew.id);
  function activeCrew() { return crew.find(p=>p.id===activeId) || crew[0]; }
  function readNotes() {
    const src=read('book/'+activeCrew().id,{}) || {};
    return {
      favs: Array.isArray(src.favs) ? [...new Set(src.favs.filter(id=>byId.has(id)))] : [],
      stories: Array.isArray(src.stories) ? src.stories.filter(s=>s && typeof s.id==='string' && byId.has(s.game)) : []
    };
  }
  let notebook = readNotes();
  function changeBook(fn) {
    notebook=readNotes();
    fn(notebook);
    write('book/'+activeCrew().id,notebook);
  }
  const state={view:'pick',place:'home',picks:[],deck:[],filterPlace:'all',group:'all',quiet:false,nogear:false,query:'',notesTab:'stories',game:null,stamp:''};
  const detail=$('#gameDialog'), photo=$('#imageDialog'), entry=$('#noteDialog'), profile=$('#profileDialog');
  let toastTimer;
  function message(text) {
    const msg=memoryOnly ? `${text}（当前浏览器只在本次打开期间保留）` : text;
    clearTimeout(toastTimer);
    const live=detail.open ? $('#detailFeedback') : $('#toast');
    if (!live) return;
    live.textContent=msg;
    toastTimer=setTimeout(()=>{live.textContent='';},3600);
  }
  function shuffled(list) {
    const result=[...list];
    for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  }
  function deal(reset=false) {
    const ids=games.filter(g=>g.places.includes(state.place)).map(g=>g.id);
    if(reset || !state.picks.length) {
      const favorite=notebook.favs.find(id=>ids.includes(id));
      const defaults=state.place==='home'?['rescue','mirror']:['tail','chalk'];
      const fresh=defaults.find(id=>id!==favorite && !notebook.favs.includes(id)) || ids.find(id=>!notebook.favs.includes(id));
      state.picks=[...new Set([favorite || defaults[0],fresh,...defaults,...ids].filter(Boolean))].slice(0,2);
      state.deck=shuffled(ids.filter(id=>!state.picks.includes(id)));
    } else {
      if(state.deck.length<2) {
        const tail=state.deck;
        state.deck=[...tail,...shuffled(ids.filter(id=>!state.picks.includes(id)&&!tail.includes(id)))];
      }
      state.picks=state.deck.splice(0,2);
    }
    renderPicks();
  }
  function card(g, view, eager=false) {
    const marked=notebook.favs.includes(g.id);
    return `<a class="card" href="#${view}/${g.id}" data-game="${g.id}" aria-label="怎么玩：${g.name}">
      <div class="card-shot"><img src="./assets/${g.id}-small.webp" width="400" height="267" loading="${eager?'eager':'lazy'}" decoding="async" alt="${g.alt}">
        ${marked?`<span class="spot-heart" aria-label="还想再玩">${icon('heart')}</span>`:''}
      </div><div class="card-caption"><h3>${g.name}</h3><span class="card-arrow">${icon('arrow')}</span><p>${g.hook}</p></div></a>`;
  }
  function renderPicks() {
    $('#picks').innerHTML=state.picks.map(id=>card(byId.get(id),'pick',true)).join('');
    $$('[data-place]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.place===state.place)));
  }
  const empty = (title, description, action, attrs, name='compass') =>
    `<div class="empty">${icon(name)}<strong>${title}</strong><p>${description}</p><a class="primary" ${attrs}>${action}${icon('arrow')}</a></div>`;
  function filterRow(title,key,opts,val) {
    return `<div class="filter-row"><strong>${title}</strong>${Object.entries(opts).map(([id,name])=>`<button type="button" class="chip" data-filter="${key}" data-value="${id}" aria-pressed="${id===val}">${name}</button>`).join('')}</div>`;
  }
  function renderFilters() {
    $('#filters').innerHTML=filterRow('场地','filterPlace',{all:'都可以',...places},state.filterPlace)
      +filterRow('想怎么玩','group',{all:'都可以',...groups},state.group)
      +`<div class="filter-row"><strong>随手挑</strong><button class="chip" data-flag="quiet" aria-pressed="${state.quiet}">安静一点</button><button class="chip" data-flag="nogear" aria-pressed="${state.nogear}">不用道具</button></div>`;
    const on=state.filterPlace!=='all'||state.group!=='all'||state.quiet||state.nogear;
    $('#filterToggle').classList.toggle('in-use',on);
    $('#filterToggle').innerHTML=icon('filter')+(on?'已筛选':'筛选');
  }
  const optionalGear=new Set(['stars','freeze','drum','book','bridge','trail']);
  function renderLibrary() {
    const q=state.query.trim().toLowerCase();
    const found=games.filter(g=>(state.filterPlace==='all'||g.places.includes(state.filterPlace))
      &&(state.group==='all'||g.group===state.group) && (!state.quiet||g.quiet)
      &&(!state.nogear||!g.gear||optionalGear.has(g.id))
      &&(!q||[g.name,g.hook,g.gear,g.start,g.invent,groups[g.group],...g.places.map(p=>places[p])].join(' ').toLowerCase().includes(q)));
    $('#resultCount').textContent=`${found.length} 个玩法`;
    $('#libraryGrid').innerHTML=found.length ? found.map((g,i)=>card(g,'library',i<2)).join('') :
      `<div class="empty">${icon('search')}<strong>这次没找到合适的玩法</strong><p>换个词，或重新看全部游戏。</p><button class="primary" data-reset>清除筛选</button></div>`;
  }
  function renderJournal() {
    $('#noteOwner').textContent=activeCrew().name+'的收藏和发现，保存在这台设备。';
    $$('[data-note-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.noteTab===state.notesTab)));
    if(state.notesTab==='favs') {
      $('#journalContent').innerHTML=notebook.favs.length?`<div class="library-grid">${notebook.favs.map(id=>card(byId.get(id),'notes')).join('')}</div>`:
        empty('把想再玩的游戏收在这里','打开喜欢的玩法，点一下爱心，下次就能直接找到。','去挑游戏','href="#pick"','heart');
      return;
    }
    $('#journalContent').innerHTML=notebook.stories.length?`<div class="story-list">${notebook.stories.map(s=>{
      const game=byId.get(s.game), stamp=stamps.find(t=>t.id===s.stamp);
      return `<article class="story"><a href="#notes/${game.id}" data-game="${game.id}"><img alt="${game.name}" loading="lazy" src="./assets/${game.id}-small.webp"></a><div class="story-body"><strong>${stamp?`${icon(stamp.icon)} ${stamp.label}`:'我的新发现'}</strong>${s.text?`<p>${escape(s.text)}</p>`:''}<a href="#notes/${game.id}" data-game="${game.id}">${game.name} ${icon('arrow','small')}</a></div></article>`;
    }).join('')}</div>`:empty('第一笔，会是他的什么发现？','玩过以后，可以把孩子自己想出的规则或一句原话记在这里。','去找个玩法','href="#pick"','book');
  }
  function fold(title, name, body, cls='') {
    return `<details class="fold ${cls}"><summary>${icon(name)}${title}${icon('chevron','fold-arrow')}</summary><p>${body}</p></details>`;
  }
  function syncFavorite() {
    const b=$('#saveFav'); if(!b||!state.game)return;
    const on=notebook.favs.includes(state.game.id);
    b.setAttribute('aria-pressed',String(on)); b.innerHTML=icon('heart')+(on?'已收进还想玩':'下次还想玩');
  }
  function openDetail(game) {
    state.game=game;
    const source=sources[game.ref];
    detail.innerHTML=`<div class="sheet-head"><span>${icon(groupIcons[game.group])}${groups[game.group]}</span><button class="close-btn" type="button" data-close="detail" aria-label="关闭玩法">${icon('close')}</button></div>
      <div class="sheet-scroll"><button type="button" class="art-open" data-enlarge aria-label="放大${game.name}的动作插画"><img src="./assets/${game.id}.webp" alt="${game.alt}" decoding="async"><span class="peek">${icon('expand')}看大图</span></button>
      <div class="detail-copy"><h2 id="detailTitle">${game.name}</h2><p class="gear">${game.places.map(p=>places[p]).join(' / ')}　·　${game.gear||'不用道具'}</p>
      <p class="invite">“${game.invite}”</p><p class="how">${game.start}</p>
      ${fold('玩法由你定','spark',game.invent,'invent')}
      ${fold('想轻松一点','leaf',game.easier)}
      ${fold('给陪玩的你','book',`${game.notice}<br>动作参考：<a href="${source[1]}" target="_blank" rel="noopener">${source[0]}</a>。玩法已按家庭场景改编。`)}
      </div></div><div class="detail-status" id="detailFeedback" role="status"></div><div class="sheet-actions"><button type="button" class="secondary" id="saveFav"></button><button type="button" class="primary" data-add-note>${icon('edit')}记下新发现</button></div>`;
    syncFavorite();
    if(!detail.open)detail.showModal();
    $('.sheet-scroll').scrollTop=0;
  }
  function closeGame() {
    if(history.state?.fieldFrom===state.view){history.back();}
    else {history.replaceState(null,'',`#${state.view}`);route();}
  }
  function openGame(id) {
    if(!byId.has(id))return;
    history.pushState({fieldFrom:state.view},'',`#${state.view}/${id}`);
    route();
  }
  function showPhoto() {
    const g=state.game; if(!g)return;
    photo.innerHTML=`<div class="lightbox-top"><span>${g.name}</span><button type="button" class="close-btn" data-close="photo" aria-label="关闭大图">${icon('close')}</button></div><img src="./assets/${g.id}.webp" alt="${g.alt}">`;
    photo.showModal();
  }
  function openEntry() {
    if(!state.game)return;
    state.stamp='';
    entry.innerHTML=`<div class="sheet-head"><h2 id="entryTitle">记下新发现</h2><button type="button" class="close-btn" data-close="entry" aria-label="关闭记录">${icon('close')}</button></div>
      <form id="newEntry" class="form-body"><h3>${state.game.name}</h3><div class="stamp-row" role="group" aria-label="选择想记住的发现">${stamps.map(s=>`<button type="button" class="stamp" data-stamp="${s.id}" aria-pressed="false">${icon(s.icon)}${s.label}</button>`).join('')}</div>
      <label class="title" for="childWords">孩子的原话</label><textarea maxlength="180" rows="2" id="childWords" placeholder="比如，下回我想自己画路线。"></textarea>
      <p class="form-hint">挑一个发现，或替他记一句话。</p><p role="alert" id="entryError" class="form-error"></p><button type="submit" class="primary">${icon('book')}收进手记</button></form>`;
    entry.showModal();
  }
  function renderProfiles() {
    $('#profileLabel').textContent=activeCrew().name;
    profile.innerHTML=`<div class="sheet-head"><h2 id="profileTitle">谁来探险？</h2><button type="button" class="close-btn" data-close="profile" aria-label="关闭档案">${icon('close')}</button></div>
      <form id="newCrew" class="form-body"><h3>这台设备的探险员</h3><div class="crew-list">${crew.map(p=>`<button type="button" class="chip" data-crew="${escape(p.id)}" aria-pressed="${p.id===activeCrew().id}">${p.id===activeCrew().id?icon('check'):icon('person')}${escape(p.name)}</button>`).join('')}</div>
      <label class="title" for="crewName">新探险员的昵称</label><input id="crewName" autocomplete="off" maxlength="14" placeholder="起个喜欢的名字"><p class="form-hint">每位探险员都有自己的手记和收藏。</p><p id="crewError" class="form-error" role="alert"></p><button type="submit" class="primary">添加探险员</button></form>`;
  }
  function refreshBase() {
    if(state.view==='pick')renderPicks();
    else if(state.view==='library')renderLibrary();
    else renderJournal();
  }
  function switchProfile(id) {
    activeId=id;write('active',id);notebook=readNotes();state.notesTab='stories';
    renderProfiles();deal(true);refreshBase();profile.close();message('已切换到'+activeCrew().name);
  }
  function route() {
    const [part,id]=location.hash.slice(1).split('/');
    const view=['pick','library','notes'].includes(part)?part:'pick';
    const changed=view!==state.view; state.view=view;
    $('#pickView').hidden=view!=='pick';$('#libraryView').hidden=view!=='library';$('#notesView').hidden=view!=='notes';
    $$('[data-tab]').forEach(link=>{if(link.dataset.tab===view)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    if(id&&byId.has(id)) {
      if(changed)refreshBase();
      if(state.game?.id!==id||!detail.open){if(entry.open)entry.close();if(photo.open)photo.close();openDetail(byId.get(id));}
    } else {
      if(photo.open)photo.close();
      if(entry.open)entry.close();
      if(detail.open)detail.close();
      state.game=null;refreshBase();
    }
    document.title=(state.game?.name || ({pick:'挑游戏',library:'游戏图鉴',notes:'探险手记'})[view])+' · 运动探险站';
    if(changed)window.scrollTo(0,0);
  }
  document.addEventListener('click',e=>{
    const t=e.target.closest('a,button'); if(!t)return;
    if(t.dataset.game) {
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      e.preventDefault();openGame(t.dataset.game);return;
    }
    if(t.dataset.place){state.place=t.dataset.place;deal(true);return;}
    if(t.id==='shuffle'){deal();message('换了一组游戏');return;}
    if(t.id==='filterToggle'){const p=$('#filters');p.hidden=!p.hidden;t.setAttribute('aria-expanded',String(!p.hidden));return;}
    if(t.dataset.filter){state[t.dataset.filter]=t.dataset.value;renderFilters();renderLibrary();return;}
    if(t.dataset.flag){state[t.dataset.flag]=!state[t.dataset.flag];renderFilters();renderLibrary();return;}
    if(t.hasAttribute('data-reset')){Object.assign(state,{group:'all',filterPlace:'all',quiet:false,nogear:false,query:''});$('#search').value='';renderFilters();renderLibrary();return;}
    if(t.dataset.noteTab){state.notesTab=t.dataset.noteTab;renderJournal();return;}
    if(t.dataset.close){if(t.dataset.close==='detail')closeGame();else ({photo,entry,profile})[t.dataset.close].close();return;}
    if(t.hasAttribute('data-enlarge')){showPhoto();return;}
    if(t.id==='saveFav'&&state.game){const id=state.game.id;changeBook(book=>{book.favs=book.favs.includes(id)?book.favs.filter(k=>k!==id):[id,...book.favs];});syncFavorite();message(notebook.favs.includes(id)?'收好了，下回接着玩。':'已从收藏移出');return;}
    if(t.hasAttribute('data-add-note')){openEntry();return;}
    if(t.dataset.stamp){state.stamp=state.stamp===t.dataset.stamp?'':t.dataset.stamp;$$('[data-stamp]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.stamp===state.stamp)));$('#entryError').textContent='';return;}
    if(t.id==='profileToggle'){crew=getCrew();renderProfiles();profile.showModal();return;}
    if(t.dataset.crew){switchProfile(t.dataset.crew);return;}
  });
  document.addEventListener('submit',e=>{
    if(e.target.id==='newEntry'&&state.game){
      e.preventDefault();const text=$('#childWords').value.trim().slice(0,180);
      if(!state.stamp&&!text){$('#entryError').textContent='选一个发现，或写一句话就能保存。';return;}
      const story={id:makeId(),game:state.game.id,stamp:state.stamp,text};
      changeBook(book=>book.stories.unshift(story));entry.close();message('这次的发现已经收进探险手记。');
    }
    if(e.target.id==='newCrew'){
      e.preventDefault();const input=$('#crewName'),name=input.value.trim().slice(0,14);crew=getCrew();
      if(!name||crew.some(p=>p.name===name)){$('#crewError').textContent=name?'这个名字已在上方，选它就能切换。':'先给探险员起个名字吧。';input.focus();return;}
      const newProfile={id:makeId(),name};crew.push(newProfile);write('profiles',crew);switchProfile(newProfile.id);
    }
  });
  $('#search').addEventListener('input',e=>{state.query=e.target.value;renderLibrary();});
  detail.addEventListener('cancel',e=>{e.preventDefault();closeGame();});
  for(const d of [detail,photo,entry,profile])d.addEventListener('click',e=>{
    if(e.target!==d)return;
    const r=d.getBoundingClientRect();
    if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)return;
    if(d===detail)closeGame();else d.close();
  });
  window.addEventListener('hashchange',route);
  window.addEventListener('storage',e=>{
    if(e.key!==null&&!e.key.startsWith(prefix))return;
    crew=getCrew();
    // Keep an open tab with its current explorer. Newly opened tabs use the last selection.
    notebook=readNotes();renderProfiles();refreshBase();syncFavorite();
  });
  $('#totalGames').textContent=`${games.length} 种玩法`;
  renderProfiles();renderFilters();deal(true);route();
  if('serviceWorker' in navigator&&window.isSecureContext){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{}));
  }
})();
