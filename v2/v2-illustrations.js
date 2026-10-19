'use strict';
(() => {
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const palette={basketball:['#287862','#e9f0dc','#d86e55'],throw:['#b85c42','#f2dfcf','#5b8c9d'],catch:['#4a7fa0','#dce9ef','#e69a64'],kick:['#8b6b3c','#f1e2bf','#5b8d68'],rope:['#9a6a9b','#eadff0','#4d8b72'],strike:['#c27a3d','#f4e3c9','#5b8c9d'],core:['#55795c','#dcead9','#c47e52']};
  const generated={basketball:'basketball',throw:'throwing',catch:'catch',kick:'kick',rope:'rope',strike:'strike',core:'core'};
  // Each leaf has its own four-step asset. The short prefix mirrors the folder
  // naming convention (throwing is kept as "throw" for leaf assets).
  const leafPrefix={basketball:'basketball',throw:'throw',catch:'catch',kick:'kick',rope:'rope',strike:'strike',core:'core'};
  // Keep only the generated sequences whose subject and props were verified.
  // Other skills use the semantic vector storyboard below so every leaf has its
  // own action cues instead of inheriting a repeated or mismatched picture.
  const leafAsset={
    'basketball:hold':'basketball-hold-v3',
    'basketball:bounce-catch':'basketball-bounce-catch',
    'basketball:release':'basketball-release',
    'basketball:roll-stop':'basketball-roll-stop',
    'basketball:low-dribble':'basketball-low-dribble',
    'basketball:switch-hand':'basketball-switch-hand',
    'basketball:step-dribble':'basketball-step-dribble',
    'basketball:turn-dribble':'basketball-turn-dribble',
    'basketball:target-dribble':'basketball-target-dribble',
    'kick:foot-stop':'kick-foot-stop',
    'kick:push-ball':'kick-push-ball',
    'kick:ready-kick':'kick-ready-kick',
    'kick:kick-gate':'kick-kick-gate',
    'kick:stop-return':'kick-stop-return',
    'kick:turn-kick':'kick-turn-kick',
    'kick:follow-ball':'kick-follow-ball',
    'throw:hold-beanbag':'throw-hold-beanbag',
    'throw:underhand':'throw-underhand',
    'throw:roll-target':'throw-roll-target',
    'throw:side-throw':'throw-side-throw',
    'throw:step-throw':'throw-step-throw'
  };
  const action={
    'foot-stop':[['球滚来','low',112,185,252,197],['脚靠近','low',122,185,218,197],['脚底停球','low',132,185,181,190],['抬脚抱住','hold',135,174,162,122]],
    'push-ball':[['脚内侧对球','low',112,185,183,195],['轻推一步','reach',126,174,215,195],['追上球','reach',140,174,245,195],['近处停球','low',148,185,225,195]],
    'ready-kick':[['球放稳','hold',112,174,183,195],['支撑脚站旁','hold',122,174,183,195],['另一脚后摆','reach',134,174,183,195],['看准方向','hold',138,174,220,178]],
    'kick-gate':[['看宽球门','hold',108,174,273,143],['支撑脚靠球','hold',120,174,208,195],['轻轻踢出','reach',136,174,248,185],['球进门','reach',148,174,285,176]],
    'stop-return':[['滚来','low',112,185,232,196],['脚底停住','low',126,185,185,195],['看回成人','hold',134,174,218,178],['踢回去','reach',146,174,270,184]],
    'follow-ball':[['轻踢一下','reach',112,174,205,193],['走到球后','reach',128,174,225,193],['再踢一下','reach',143,174,250,193],['跟一步','reach',154,174,275,193]],
    'turn-kick':[['带球到标记','reach',112,174,232,193],['绕宽弯','reach',128,174,250,193],['停好球','low',140,185,220,193],['找球门踢出','reach',153,174,285,181]],
    'bounce-catch':[['拍一下','hold',112,174,180,167],['球下落','reach',125,174,180,195],['等回弹','low',133,185,180,180],['双手抱住','hold',136,174,160,126]],
    'low-dribble':[['手在球上','hold',112,174,177,164],['向下按球','reach',126,174,177,195],['球回手边','reach',138,174,177,173],['主动抱停','hold',142,174,159,124]],
    'side-throw':[['侧身看目标','hold',112,174,257,128],['手臂在肩旁','reach',124,174,225,119],['转身挥臂','reach',140,174,274,132],['面向目标','reach',151,174,292,128]],
    'step-throw':[['侧身准备','hold',112,174,257,128],['迈前一步','reach',128,174,258,129],['手臂送出','reach',145,174,285,131],['站稳收尾','hold',151,174,274,128]],
    'follow-through':[['投出豆袋','reach',112,174,252,132],['手臂继续摆','reach',126,174,270,132],['身体向前跟随','reach',140,174,280,140],['站稳看目标','hold',150,174,258,145]],
    'choose-target':[['看两个目标','hold',112,174,280,145],['选定方向','hold',126,174,280,145],['身体转向目标','reach',140,174,280,145],['投向选中目标','reach',150,174,300,135]],
    'air-swing':[['拍子在身侧','hold',112,174,225,146],['向前挥动','reach',128,174,255,126],['挥完停住','reach',145,174,276,126],['回到准备','hold',151,174,225,146]],
    'tap-ball':[['球固定','hold',112,174,222,167],['拍面靠近','reach',126,174,222,167],['轻轻碰球','reach',141,174,242,167],['球滚向目标','reach',153,174,282,167]],
    'small-jump':[['双脚站稳','hold',112,174,190,198],['膝盖弯曲','low',126,185,190,198],['轻轻离地','reach',140,164,190,182],['脚尖落地','hold',150,174,190,198]],
    'ready-hands':[['双手准备','hold',112,174,235,168],['手臂伸出','reach',125,174,235,168],['接到胸前','hold',140,174,178,132],['抱稳球','hold',150,174,158,126]],
    'stop-roll':[['滚球靠近','low',112,185,245,196],['双手向下','reach',126,174,235,196],['手掌挡球','low',140,185,218,195],['抱住滚球','hold',150,174,160,127]],
    'hug-ball':[['球到胸前','hold',112,174,195,145],['双臂打开','reach',126,174,195,145],['环抱球','hold',140,174,178,132],['站稳抱好','hold',150,174,160,126]],
    'low-toss':[['手掌托球','hold',112,174,182,165],['低低抛起','reach',126,174,182,135],['眼睛追球','reach',140,174,198,148],['双手接住','hold',150,174,160,126]],
    'move-catch':[['站在球侧','hold',112,174,245,170],['向右挪步','reach',126,174,245,170],['伸手接球','reach',140,174,218,150],['抱球站稳','hold',150,174,160,126]],
    'ground-rope':[['绳子放地上','hold',112,174,210,201],['抬脚跨过','reach',126,174,210,201],['另一脚跟上','reach',140,174,210,201],['双脚站稳','hold',150,174,180,201]],
    'rope-step':[['绳在身后','hold',112,174,190,195],['手腕向前摇','reach',126,174,190,175],['绳到脚前','reach',140,174,190,200],['迈步跨过','reach',150,174,190,190]],
    'one-jump':[['双脚准备','hold',112,174,190,198],['绳子落地','reach',126,174,190,202],['屈膝小跳','reach',140,164,190,182],['落地站稳','hold',150,174,190,198]],
    'reset-rope':[['停下脚步','hold',112,174,190,198],['收回绳子','hold',126,174,190,198],['重新握好','hold',140,174,190,198],['准备再来','hold',150,174,190,198]],
    'two-jump':[['第一次跳','reach',112,164,190,182],['绳子转一圈','reach',126,164,190,182],['第二次跳','reach',140,164,190,182],['轻轻落地','hold',150,174,190,198]],
    'hold-paddle':[['握住软拍','hold',112,174,230,146],['侧身站好','hold',126,174,230,146],['拍面朝前','reach',140,174,230,146],['眼睛看球','hold',150,174,230,146]],
    'roll-hit':[['滚球过来','low',112,185,245,197],['拍子下沉','reach',126,174,230,160],['拍面碰球','reach',140,174,245,180],['球滚向前','reach',150,174,275,180]],
    'drop-hit':[['球举高','hold',112,174,220,135],['松手落球','reach',126,174,220,165],['拍子下移','reach',140,174,230,180],['轻轻击中','reach',150,174,250,180]],
    'aim-hit':[['看准目标','hold',112,174,280,150],['肩膀转向','reach',126,174,260,145],['向前挥拍','reach',140,174,275,145],['球飞向目标','reach',150,174,300,145]],
    'four-point':[['双手双膝着垫','crawl',112,185,180,195],['手在肩下','crawl',126,185,180,195],['膝在髋下','crawl',140,185,180,195],['平稳呼吸','crawl',150,185,180,195]],
    'crawl-forward':[['手膝着地','crawl',112,185,180,195],['右手左膝','crawl',126,185,195,195],['左手右膝','crawl',140,185,210,195],['爬到终点','crawl',150,185,240,195]],
    'bear-steps':[['屁股抬高','crawl',112,185,180,195],['手脚交替','crawl',126,185,198,195],['向前走三步','crawl',140,185,220,195],['停下站稳','crawl',150,185,240,195]],
    'crawl-tunnel':[['看见隧道','crawl',112,185,260,195],['手膝前进','crawl',126,185,260,195],['穿过中间','crawl',140,185,260,195],['到出口','crawl',150,185,295,195]],
    'carry-ball':[['抱球爬行','crawl',112,185,270,195],['双手护球','crawl',126,185,270,195],['爬到箱边','crawl',140,185,270,195],['把球放进箱','hold',150,174,275,160]],
    'reset-body':[['趴下呼吸','low',112,185,180,195],['慢慢起身','reach',126,174,180,170],['伸展双臂','reach',140,174,180,140],['站好准备','hold',150,174,180,130]]
  };
  const seeds={hold:['抱稳球','hold'],release:['双手放球','reach'],'roll-stop':['接滚球','low'],'hold-beanbag':['拿稳豆袋','hold'],underhand:['下手送球','reach'],'roll-target':['滚向目标','low'],'ready-hands':['双手准备','hold'],'stop-roll':['拦住滚球','low'],'hug-ball':['抱稳球','hold'],'low-toss':['低抛接球','reach'],'move-catch':['挪一步接球','reach'],'ground-rope':['跳过地面绳','reach'],'rope-step':['绳到脚前','reach'],'one-jump':['摇一下跳一下','reach'],'reset-rope':['停住重置','hold'],'two-jump':['连续两次','reach'],'hold-paddle':['握住软拍','hold'],'roll-hit':['击打慢滚球','reach'],'drop-hit':['落球击打','reach'],'aim-hit':['拍向大目标','reach'],'four-point':['四点支撑','low'],'crawl-forward':['对侧爬行','low'],'bear-steps':['小熊走几步','low'],'crawl-tunnel':['穿过宽隧道','low'],'carry-ball':['爬到家再搬球','hold'],'reset-body':['整理身体','hold']};
  function child(x,y,pose,accent){
    if(pose==='crawl'){
      const headX=x-38, headY=y-62;
      return `<g stroke-linecap=\"round\" stroke-linejoin=\"round\"><ellipse cx=\"${x}\" cy=\"${y+3}\" rx=\"42\" ry=\"6\" fill=\"#78946c\" opacity=\".18\"/><circle cx=\"${headX}\" cy=\"${headY}\" r=\"18\" fill=\"#f2bb91\" stroke=\"#80503b\" stroke-width=\"2\"/><path d=\"M${headX-18} ${headY-2}Q${headX-10} ${headY-24} ${headX+11} ${headY-19}Q${headX+21} ${headY-12} ${headX+14} ${headY-3}Q${headX+1} ${headY-10} ${headX-18} ${headY-2}\" fill=\"#4b3933\"/><circle cx=\"${headX-6}\" cy=\"${headY+1}\" r=\"2.4\" fill=\"#352b29\" stroke=\"none\"/><circle cx=\"${headX+7}\" cy=\"${headY+1}\" r=\"2.4\" fill=\"#352b29\" stroke=\"none\"/><path d=\"M${headX-3} ${headY+8}q4 3 8 0\" fill=\"none\" stroke=\"#a35e4b\" stroke-width=\"2\"/><path d=\"M${x-27} ${y-45}Q${x+4} ${y-66} ${x+35} ${y-37}L${x+24} ${y-15}Q${x-2} ${y-7} ${x-28} ${y-20}Z\" fill=\"#ffd15a\" stroke=\"#315849\" stroke-width=\"2\"/><path d=\"M${x-18} ${y-28}Q${x-26} ${y-5} ${x-34} ${y} M${x+5} ${y-25}Q${x+13} ${y-6} ${x+20} ${y}\" fill=\"none\" stroke=\"#f2bb91\" stroke-width=\"8\"/><path d=\"M${x+18} ${y-18}Q${x+38} ${y-2} ${x+46} ${y-1} M${x+27} ${y-16}Q${x+42} ${y+7} ${x+51} ${y+3}\" fill=\"none\" stroke=\"${accent}\" stroke-width=\"11\"/><path d=\"M${x-45} ${y-2}q10-6 21 0l-2 8h-22zM${x+43} ${y-3}q10-6 22 0l2 8h-22z\" fill=\"#e76f57\" stroke=\"#315849\" stroke-width=\"2\"/></g>`;
    }
    const low=pose==='low',reach=pose==='reach',headY=y-(low?62:102),bodyY=y-(low?47:76),hipY=y-(low?17:35);
    const hands=reach?`M${x-11} ${bodyY+4}Q${x+2} ${bodyY+23} ${x+18} ${bodyY+26} M${x+10} ${bodyY+5}Q${x+25} ${bodyY+19} ${x+36} ${bodyY+9}`:`M${x-11} ${bodyY+4}Q${x-1} ${bodyY+17} ${x+2} ${bodyY+25} M${x+10} ${bodyY+5}Q${x+18} ${bodyY+17} ${x+20} ${bodyY+25}`;
    const legs=low?`M${x-5} ${hipY}Q${x-20} ${hipY+16} ${x-28} ${y-2} M${x+6} ${hipY}Q${x+19} ${hipY+15} ${x+29} ${y-3}`:`M${x-5} ${hipY}Q${x-12} ${hipY+18} ${x-17} ${y-2} M${x+6} ${hipY}Q${x+14} ${hipY+18} ${x+20} ${y-2}`;
    return `<g stroke-linecap="round" stroke-linejoin="round"><ellipse cx="${x}" cy="${y+3}" rx="36" ry="6" fill="#78946c" opacity=".18"/><circle cx="${x}" cy="${headY}" r="19" fill="#f2bb91" stroke="#80503b" stroke-width="2"/><path d="M${x-19} ${headY-2}Q${x-12} ${headY-25} ${x+10} ${headY-20}Q${x+22} ${headY-14} ${x+15} ${headY-3}Q${x+4} ${headY-11} ${x-19} ${headY-2}" fill="#4b3933"/><circle cx="${x-7}" cy="${headY+1}" r="2.5" fill="#352b29" stroke="none"/><circle cx="${x+7}" cy="${headY+1}" r="2.5" fill="#352b29" stroke="none"/><path d="M${x-3} ${headY+9}q4 4 8 0" fill="none" stroke="#a35e4b" stroke-width="2"/><path d="M${x-18} ${bodyY}Q${x} ${bodyY-10} ${x+18} ${bodyY}L${x+11} ${hipY}Q${x} ${hipY+7} ${x-12} ${hipY}Z" fill="#ffd15a" stroke="#315849" stroke-width="2"/><path d="${hands}" fill="none" stroke="#f2bb91" stroke-width="8"/><circle cx="${x+19}" cy="${bodyY+26}" r="4" fill="#f2bb91" stroke="#80503b" stroke-width="1"/><path d="${legs}" fill="none" stroke="${accent}" stroke-width="11"/><path d="M${x-31} ${y-2}q10-6 21 0l-2 8h-22zM${x+18} ${y-3}q10-6 22 0l2 8h-22z" fill="#e76f57" stroke="#315849" stroke-width="2"/></g>`;
  }
  function ball(x,y,c='#d68455',r=13){return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="#6f4f3c" stroke-width="2"/><path d="M${x-r+2} ${y}h${(r-2)*2}M${x-5} ${y-r+3}q10 12 1 24M${x+5} ${y-r+3}q-8 12 0 24" fill="none" stroke="#fff1d6" stroke-width="1.6"/>`}
  function scene(skill,id,s,p){
    let out='';
    if(skill==='core'){
      if(id==='carry-ball')return `<rect x="250" y="151" width="50" height="50" rx="8" fill="#f7c85b" stroke="#b87d36" stroke-width="3"/>${ball(s[4],s[5],'#e19a62',12)}`;
      if(id==='crawl-tunnel')return `<path d="M220 202v-66h72v66M226 136q31-30 62 0" fill="none" stroke="#ef9c5c" stroke-width="8"/>`;
      return '';
    }
    if(['basketball','catch'].includes(skill))out+=ball(s[4],s[5],skill==='catch'?'#e18d5b':'#4b94a4');
    if(skill==='kick')out+=ball(s[4],s[5],'#d78a5d',12);
    if(skill==='throw')out+=`<rect x="${s[4]-20}" y="${s[5]-37}" width="42" height="42" rx="8" fill="#f7c85b" stroke="#b87d36" stroke-width="3"/><path d="M${s[4]-13} ${s[5]-16}h28" stroke="#fff4bf" stroke-width="3"/>`;
    if(skill==='rope')out+=`<path d="M${s[2]-42} ${s[3]-18}Q${s[2]+8} ${s[3]-76} ${s[2]+52} ${s[3]-10}Q${s[2]+18} ${s[3]+34} ${s[2]-42} ${s[3]-18}" fill="none" stroke="#9a6a9b" stroke-width="5"/>`;
    if(skill==='strike')out+=`<path d="M${s[2]+13} ${s[3]-77}l58 24-10 18-58-25z" fill="#ea9a55" stroke="#8f5b3c" stroke-width="3"/><circle cx="${s[4]}" cy="${s[5]}" r="11" fill="#e68e54" stroke="#80503b" stroke-width="2"/>`;
    if(id==='kick-gate'||id==='turn-kick')out+=`<path d="M${s[4]+9} ${s[5]-25}v-42h62v42M${s[4]+40} ${s[5]-67}v42" fill="none" stroke="#e65e50" stroke-width="4"/>`;
    return out;
  }
  function svg(skill,leaf,step){
    const p=palette[skill]||palette.basketball; const id=leaf?.id; const seed=seeds[id];
    const seq=action[id]||(seed?[[seed[0],seed[1],112,174,184,175],['进行中',seed[1],126,174,208,180],['调整控制',seed[1],140,174,232,178],['完成动作','hold',150,174,195,128]]:[['准备','hold',112,174,184,175],['动作','reach',126,174,208,180],['控制','reach',140,174,232,178],['完成','hold',150,174,195,128]]);
    const s=seq[step]||seq[0]; const key=`${skill}-${id||'generic'}-${step}`;
    const arrow=step>0?`<path d="M${s[2]+30} ${s[3]-36}Q190 72 ${s[4]-18} ${s[5]-23}" fill="none" stroke="${p[2]}" stroke-width="4" stroke-dasharray="7 6" marker-end="url(#arrow-${key})"/>`:'';
    return `<svg class="motion-svg" viewBox="0 0 340 250" role="img" aria-label="${esc(s[0])}"><defs><linearGradient id="bg-${key}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${p[1]}"/><stop offset="1" stop-color="#fffdf8"/></linearGradient><marker id="arrow-${key}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${p[2]}"/></marker></defs><rect x="10" y="10" width="320" height="230" rx="26" fill="url(#bg-${key})"/><path d="M30 211h280" stroke="#b7cdb4" stroke-width="3"/><path d="M40 205q80-24 160 0t140 0" fill="none" stroke="#d8e5cf" stroke-width="5"/>${scene(skill,id,s,p)}${child(s[2],s[3],s[1],p[0])}${arrow}<text x="28" y="40" fill="${p[0]}" font-size="16" font-weight="800" font-family="system-ui">${esc(s[0])}</text></svg>`;
  }
  function frame(skill,step,leaf){
    const prefix=leafPrefix[skill], id=leaf?.id;
    const asset=leafAsset[`${skill}:${id}`];
    if(asset)return `<div class="generated-motion"><img src="assets/illustrations/leaves/${asset}-step-${step+1}.webp" alt="${esc(leaf?.name||'动作')}第${step+1}步" loading="lazy"></div>`;
    // Missing leaf assets use the semantic, leaf-specific vector storyboard.
    // This keeps every leaf visually distinct instead of falling back to one
    // shared skill image set.
    if(prefix&&id)return `<div class="generated-motion vector-motion">${svg(skill,leaf,step)}</div>`;
    const file=generated[skill];
    if(file)return `<div class="generated-motion"><img src="assets/illustrations/${file}-step-${step+1}.png" alt="${esc(leaf?.name||'动作')}第${step+1}步" loading="lazy"></div>`;
    return svg(skill,leaf,step);
  }
  window.V2Motion={svg,frame,generated,leafPrefix};
})();
