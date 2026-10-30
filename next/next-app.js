'use strict';
(() => {
  const {skills, allLeaf}=window.V2;
  const $=id=>document.getElementById(id);
  const skillIds=Object.keys(skills);
  const profileKey='kid-fitness-simple-profiles';
  const recordKey=id=>`kid-fitness-simple-records:${id}`;
  const blankState=()=>({version:1,currentSkill:'basketball',duration:40,done:{},notes:{},selectedLeaves:{}});
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let profiles={current:'default',items:[{id:'default',name:'孩子'}]};
  try{
    const saved=JSON.parse(localStorage.getItem(profileKey)||'null');
    if(saved&&Array.isArray(saved.items)&&saved.items.length&&saved.items.some(p=>p.id===saved.current))profiles=saved;
  }catch(_){ }
  function blank(){return blankState()}
  function loadProfile(id){
    const fresh=blank();
    try{
      const raw=localStorage.getItem(recordKey(id));
      if(raw){const data=JSON.parse(raw);if(data&&data.version===1)return {...fresh,...data,done:data.done||{},notes:data.notes||{},selectedLeaves:data.selectedLeaves||{}}}
    }catch(_){ }
    return fresh;
  }
  let state=loadProfile(profiles.current);
  let selectedLeaf=null;
  let session=null;
  function persist(){try{localStorage.setItem(recordKey(profiles.current),JSON.stringify(state));localStorage.setItem(profileKey,JSON.stringify(profiles))}catch(_){}}
  persist();
  function toast(msg){$('toast').textContent=msg;$('toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').hidden=true,2200)}
  function skill(){return skills[state.currentSkill]||skills.basketball}
  function leafList(s=skill()){return allLeaf(s)}
  function leafKey(l,skillId=state.currentSkill){return `${skillId}:${l.id}`}
  function leafState(l){
    if(state.done[leafKey(l)])return 'done';
    if(l.prereq.every(id=>state.done[`${state.currentSkill}:${id}`]))return 'ready';
    return 'locked';
  }
  function currentProgress(skillId=state.currentSkill){
    const ls=allLeaf(skills[skillId]);
    return {done:ls.filter(l=>state.done[`${skillId}:${l.id}`]).length,total:ls.length};
  }
  function selectedForTraining(){
    const ls=leafList();
    const saved=Array.isArray(state.selectedLeaves[state.currentSkill])?state.selectedLeaves[state.currentSkill]:[];
    const valid=saved.map(id=>ls.find(l=>l.id===id)).filter(l=>l&&leafState(l)!=='locked').slice(0,3);
    if(valid.length)return valid;
    const first=ls.find(l=>leafState(l)==='ready')||ls[0];
    return first?[first]:[];
  }
  function setSelected(ids){
    state.selectedLeaves[state.currentSkill]=ids.slice(0,3);
    persist();
    $('sessionPanel').hidden=true;
    renderTrain();
  }
  function statusText(l){
    const st=leafState(l);
    return st==='done'?'已点亮':st==='ready'?'可以练习':'先练好上一步';
  }
  function statusClass(l){return `status-${leafState(l)}`}
  function renderProfiles(){
    const select=$('profileSelect');
    select.replaceChildren(...profiles.items.map(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=p.name;return o}));
    select.value=profiles.current;
    $('profileBadge').textContent=profiles.items.find(p=>p.id===profiles.current)?.name||'孩子';
  }
  function renderSkillPicker(){
    const wrap=$('skillPicker');wrap.replaceChildren();
    skillIds.forEach(id=>{
      const s=skills[id],p=currentProgress(id),button=document.createElement('button');
      button.type='button';button.className=`skill-option${state.currentSkill===id?' selected':''}`;
      button.innerHTML=`<i class="skill-swatch" style="background:${s.color}"></i><span><strong>${esc(s.name)}</strong><small>${esc(s.short)} · ${p.done}/${p.total} 已点亮</small></span>`;
      button.onclick=()=>{
        if(state.currentSkill===id){$('skillChooser').open=false;return}
        state.currentSkill=id;state.selectedLeaves[id]=state.selectedLeaves[id]||[];persist();$('skillChooser').open=false;$('sessionPanel').hidden=true;renderAll();toast(`已换成：${s.name}`)
      };
      wrap.append(button);
    });
  }
  function renderPath(){
    const wrap=$('todayPath');wrap.replaceChildren();
    const ls=leafList(),selected=selectedForTraining();
    ls.forEach((l,i)=>{
      const chosen=selected.some(x=>x.id===l.id),st=leafState(l),row=document.createElement('button');
      row.type='button';row.className=`path-row ${chosen?'chosen':''} ${st}`;row.setAttribute('aria-pressed',chosen?'true':'false');
      row.innerHTML=`<span class="path-index">${chosen?'✓':i+1}</span><span><strong>${esc(l.name)}</strong><small>${esc(l.task)}</small></span><span class="leaf-chip ${statusClass(l)}">${chosen?'已选择':statusText(l)}</span>`;
      row.onclick=()=>{
        if(st==='locked'){openLeaf(l.id,true);return}
        const ids=selected.map(x=>x.id);
        if(chosen){if(ids.length>1)setSelected(ids.filter(id=>id!==l.id));else toast('至少保留一片叶子')}
        else if(ids.length<3)setSelected([...ids,l.id]);
        else toast('这次最多加到三片叶子');
      };
      wrap.append(row);
    });
  }
  function renderTrain(){
    const s=skill(),selected=selectedForTraining(),current=selected[0]||leafList()[0],p=currentProgress();
    $('currentSkillName').textContent=s.name;
    $('skillProgress').textContent=`${p.done}/${p.total} 已点亮`;
    $('selectedLeafCount').textContent=`${selected.length} 片`;
    $('currentLeafName').textContent=current?.name||'从这里开始';
    $('currentLeafTask').textContent=current?.task||'';
    $('currentLeafStatus').textContent=current?statusText(current):'';
    $('currentLeafStatus').className=`status-pill ${current?statusClass(current):''}`;
    $('currentLeafImage').innerHTML=current?window.V2Motion.frame(state.currentSkill,0,current):'';
    $('duration').value=String(state.duration);
    renderProfiles();renderSkillPicker();renderPath();
  }
  function sessionPlan(){
    const targets=selectedForTraining(),minutes=Math.max(25,Math.min(50,Number(state.duration)||40));
    return {targets,minutes,steps:[{title:'热身找感觉',text:'慢走、摆摆手，先和球或道具熟悉一下。'},{title:'练习小目标',text:targets.map(x=>x.name).join('、')},{title:'换一种玩法',text:'把这次的动作放进一个合作游戏，目标放近一点也可以。'},{title:'慢慢收尾',text:'走一走、喝水，说一个这次发现的办法。'}]};
  }
  function renderSession(){
    const wrap=$('sessionPanel');
    if(!session){wrap.hidden=true;wrap.replaceChildren();return}
    wrap.hidden=false;
    if(session.finished){
      const names=session.targets.map(t=>t.name).join('、');
      wrap.innerHTML=`<div class="session-head"><div><span class="section-kicker">练习完成</span><h3>这一片叶子长出来了</h3></div><button type="button" class="close-session" aria-label="关闭">×</button></div><p class="session-summary-line">已经完成：${esc(names)}</p><label class="session-note-label" for="sessionNote">孩子这次发现了什么？（可以不写）</label><textarea id="sessionNote" rows="3" placeholder="例如：球要轻轻按，它才会回来。"></textarea><div class="session-actions"><button type="button" class="primary-button" data-session-save>保存并结束</button></div>`;
      wrap.querySelector('.close-session').onclick=()=>finishSession();
      wrap.querySelector('[data-session-save]').onclick=()=>{
        const note=wrap.querySelector('#sessionNote').value.trim();
        if(note)state.notes[leafKey(session.targets[0])]=note;
        persist();finishSession(true);toast('这次练习已保存');
      };
      return;
    }
    const target=session.targets[session.targetIndex];
    const captions=['准备好','做一下','慢一点','完成'];
    const cue=session.frame===0?'先摆好姿势，准备做一次。':session.frame===1?target.task:session.frame===2?target.tip:'停下来，看看自己做到了什么。';
    const plan=sessionPlan();
    wrap.innerHTML=`<div class="session-head"><div><span class="section-kicker">正在练</span><h3>${esc(target.name)}</h3></div><button type="button" class="close-session" aria-label="收起">×</button></div><div class="session-progress-label"><span>第 ${session.targetIndex+1} 片 · ${esc(captions[session.frame])}</span><span>${session.frame+1}/4</span></div><div class="session-motion">${window.V2Motion.frame(state.currentSkill,session.frame,target)}</div><p class="session-cue">${esc(cue)}</p><div class="session-frame-controls"><button type="button" class="small-button" data-session-prev ${session.frame===0?'disabled':''}>上一步</button><button type="button" class="small-button" data-session-next ${session.frame===3?'disabled':''}>下一步</button></div><button type="button" class="primary-button session-done" data-session-step>${session.frame===3?'完成这片叶子':'完成这一步'}</button><details class="session-plan-details"><summary>这次练习怎么走</summary><ol>${plan.steps.map(x=>`<li><strong>${esc(x.title)}</strong><span>${esc(x.text)}</span></li>`).join('')}</ol></details><button type="button" class="subtle-link session-end" data-session-end>先收起来</button>`;
    wrap.querySelector('.close-session').onclick=()=>finishSession();
    wrap.querySelector('[data-session-prev]').onclick=()=>{if(session.frame>0){session.frame--;renderSession()}};
    wrap.querySelector('[data-session-next]').onclick=()=>{if(session.frame<3){session.frame++;renderSession()}};
    wrap.querySelector('[data-session-step]').onclick=()=>{if(session.frame<3){session.frame++;renderSession();return}state.done[leafKey(target)]=true;persist();session.targetIndex++;session.frame=0;if(session.targetIndex>=session.targets.length)session.finished=true;renderSession();renderTrain();renderTree();renderRecords();};
    wrap.querySelector('[data-session-end]').onclick=()=>finishSession();
  }
  function startSession(){
    const targets=selectedForTraining();
    if(!targets.length){toast('先选择一片叶子');return}
    session={targets,targetIndex:0,frame:0,finished:false};
    $('skillChooser').open=false;$('leafChooser').open=false;$('trainingOptions').open=false;renderSession();$('sessionPanel').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function finishSession(saved=false){session=null;renderSession();if(saved){renderTrain();renderTree();renderRecords()}}
  function renderTree(){
    const s=skill(),wrap=$('skillTree');
    $('treeSkillSelect').value=state.currentSkill;wrap.replaceChildren();
    const stage=document.createElement('div');
    stage.className='tree-stage tree-stage-art';
    const art=document.createElement('img');
    art.className='tree-art';art.src='assets/tree-skill-background.png';art.alt=`${s.name}成长树`;
    stage.append(art);
    const positions=[
      [{x:12,y:56},{x:32,y:56},{x:22,y:53}],
      [{x:88,y:56},{x:68,y:56},{x:78,y:53}],
      [{x:22,y:36},{x:38,y:36},{x:30,y:28}],
      [{x:88,y:36},{x:72,y:28},{x:80,y:20}]
    ];
    const labelPositions=[{x:18,y:64},{x:82,y:64},{x:30,y:43},{x:82,y:43}];
    branchesForTree(s).forEach((branch,bi)=>{
      const labelPos=labelPositions[bi%labelPositions.length];
      const label=document.createElement('div');
      label.className='tree-branch-label';label.style.left=`${labelPos.x}%`;label.style.top=`${labelPos.y}%`;label.style.setProperty('--branch-color',s.color);
      const branchDone=branch.leaves.filter(l=>leafState(l)==='done').length;
      label.innerHTML=`<strong>${esc(branch.name)}</strong><small>${branchDone}/${branch.leaves.length} 已点亮</small>`;
      stage.append(label);
      branch.leaves.forEach((l,li)=>{
        const pos=(positions[bi%positions.length]||positions[0])[li%3];
        const st=leafState(l),card=document.createElement('button');
        const captionLeft=bi%2===1 ? li%2===0 : li%2===1;
        card.type='button';card.className=`tree-leaf-node ${st}${captionLeft?' caption-left':''}`;card.style.left=`${pos.x}%`;card.style.top=`${pos.y}%`;
        card.setAttribute('aria-label',`${l.name}，${statusText(l)}`);
        card.innerHTML=`<span class="tree-node-shape"><span>${st==='done'?'✓':st==='ready'?'○':'·'}</span></span><span class="tree-node-caption">${esc(l.name)}</span>`;
        card.onclick=()=>openLeaf(l.id,st==='locked');stage.append(card);
      });
    });
    const rootLabel=document.createElement('div');rootLabel.className='tree-root-label';rootLabel.innerHTML=`<span>🌱</span><strong>${esc(s.name)}</strong><small>从根部开始长出新的能力</small>`;stage.append(rootLabel);
    wrap.append(stage);
  }
  function branchesForTree(s){return s.branches||[]}
  function openLeaf(id,preview=false){
    const l=leafList().find(x=>x.id===id);if(!l)return;selectedLeaf=l;const s=skill(),st=leafState(l),locked=preview||st==='locked',detail=$('leafDetail');
    const frames=[0,1,2,3].map(i=>`<figure class="motion-frame">${window.V2Motion.frame(state.currentSkill,i,l)}<figcaption>${['准备','动作','控制','完成'][i]}</figcaption></figure>`).join('');
    detail.hidden=false;detail.classList.add('open');detail.setAttribute('role','dialog');detail.setAttribute('aria-modal','true');detail.innerHTML=`<div class="detail-top"><div><span class="detail-kicker">${esc(s.name)} · ${esc(l.branch)}</span><h3>${esc(l.name)}</h3></div><button class="close-detail" type="button" aria-label="关闭">×</button></div><p>${esc(l.task)}</p><div class="motion-sequence">${frames}</div><div class="detail-tip"><strong>${locked?'预览提示':'只记一个口令：'}</strong>${esc(locked?'先看看动作，前面的叶子完成后就能练这一片。':l.tip)}</div><p class="muted">${st==='done'?'这片叶子已经点亮，可以补充这次的发现。':locked?'当前先预览，完成前面的叶子再回来。':'做完这片叶子后就可以点亮。'}</p><textarea id="leafNote" rows="3" placeholder="例如：我发现球要轻轻按，它就会回来。" ${locked?'disabled':''}>${esc(state.notes[leafKey(l)]||'')}</textarea><div class="button-row" style="margin-top:10px"><button id="saveLeaf" type="button" class="primary-button" style="margin-top:0;flex:1" ${locked?'disabled':''}>${st==='done'?'保存这次记录':'点亮叶子并保存'}</button></div>`;
    detail.querySelector('.close-detail').onclick=closeLeaf;const save=$('saveLeaf');if(!locked)save.onclick=()=>{const note=$('leafNote').value.trim();state.notes[leafKey(l)]=note;state.done[leafKey(l)]=true;persist();closeLeaf();renderAll();toast(`已点亮：${l.name}`)};detail.scrollTop=0;detail.querySelector('.close-detail').focus();
  }
  function closeLeaf(){$('leafDetail').hidden=true;$('leafDetail').classList.remove('open');selectedLeaf=null}
  function renderRecords(){
    const summary=$('recordSummary'),all=skillIds.flatMap(id=>allLeaf(skills[id]).map(l=>({id,l,done:!!state.done[`${id}:${l.id}`]}))),done=all.filter(x=>x.done).length;
    summary.innerHTML=`<div class="summary-stat"><strong>${done}</strong><span>已经点亮</span></div><div class="summary-stat"><strong>${all.length-done}</strong><span>还在成长</span></div>`;
    const wrap=$('recordList');wrap.replaceChildren();skillIds.forEach(id=>{const s=skills[id],ls=allLeaf(s),d=ls.filter(l=>state.done[`${id}:${l.id}`]).length,article=document.createElement('article');article.className='record-skill';article.innerHTML=`<div class="record-skill-head"><h3>${esc(s.name)}</h3><small>${d}/${ls.length}</small></div><div class="record-bar"><i style="width:${d/ls.length*100}%;background:${s.color}"></i></div>${d?ls.filter(l=>state.done[`${id}:${l.id}`]).map(l=>`<button class="record-leaf-row" data-record-leaf="${id}:${l.id}"><span class="record-mark">✓</span><span><strong>${esc(l.name)}</strong><small>${esc(state.notes[`${id}:${l.id}`]||'完成了一次练习')}</small></span><span class="small-button">查看</span></button>`).join(''):'<p class="muted record-empty">从底部的一片叶子开始，慢慢积累。</p>'}`;article.querySelectorAll('[data-record-leaf]').forEach(b=>b.onclick=()=>{const [sid,lid]=b.dataset.recordLeaf.split(':');state.currentSkill=sid;persist();nav('treeView');setTimeout(()=>openLeaf(lid),0)});wrap.append(article)})
  }
  function nav(view){closeLeaf();document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==view);document.querySelectorAll('[data-view]').forEach(b=>b.getAttribute('data-view')===view?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'));window.scrollTo({top:0,behavior:'instant'});if(view==='trainView')renderTrain();if(view==='treeView')renderTree();if(view==='recordView')renderRecords();if(view==='myView')renderProfiles()}
  function renderAll(){renderTrain();renderTree();renderRecords();renderProfiles()}
  $('changeSkillButton').onclick=()=>{$('skillChooser').open=true;$('skillChooser').scrollIntoView({behavior:'smooth',block:'center'})};
  $('openTreeFromTrain').onclick=()=>nav('treeView');
  $('startSessionPrimary').onclick=startSession;
  $('duration').onchange=e=>{state.duration=Number(e.target.value);persist();if(session)session=null;renderSession()};
  $('treeSkillSelect').replaceChildren(...skillIds.map(id=>{const o=document.createElement('option');o.value=id;o.textContent=skills[id].name;return o}));
  $('treeSkillSelect').onchange=e=>{state.currentSkill=e.target.value;persist();renderAll();};
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>nav(b.dataset.view));
  $('profileSelect').onchange=e=>{profiles.current=e.target.value;state=loadProfile(profiles.current);persist();session=null;renderAll();toast(`已切换到：${profiles.items.find(p=>p.id===profiles.current)?.name||'孩子'}`)};
  $('newProfile').onclick=()=>{$('newProfileForm').hidden=!$('newProfileForm').hidden;if(!$('newProfileForm').hidden)$('newProfileName').focus()};
  $('createProfile').onclick=()=>{const name=$('newProfileName').value.trim().slice(0,20);if(!name){toast('请填写名字');return}const id=`p-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;profiles.items.push({id,name});profiles.current=id;state=blank();persist();$('newProfileName').value='';$('newProfileForm').hidden=true;session=null;renderAll();toast(`已创建：${name}`)};
  $('newProfileName').onkeydown=e=>{if(e.key==='Enter')$('createProfile').click()};
  $('exportData').onclick=()=>{const name=profiles.items.find(p=>p.id===profiles.current)?.name||'孩子',blob=new Blob([JSON.stringify({...state,profileName:name,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`小小运动家-${name}-成长记录.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);$('backupStatus').textContent='当前档案已导出。'};
  $('importData').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const d=JSON.parse(await f.text());if(!d||d.version!==1)throw new Error('文件格式不正确');state={...blank(),...d,done:d.done||{},notes:d.notes||{},selectedLeaves:d.selectedLeaves||{}};persist();session=null;renderAll();$('backupStatus').textContent='记录已导入到当前档案。'}catch(err){$('backupStatus').textContent='导入失败：'+err.message}e.target.value=''};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeLeaf();if(session)finishSession()}});
  renderAll();
})();
