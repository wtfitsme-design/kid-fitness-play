'use strict';
(() => {
const C={green:'#27715b',dark:'#254a3c',skin:'#efbb8f',hair:'#493b30',ball:'#dc784b',blue:'#608eaa',line:'#a1b79d',yellow:'#e9be58'};
const p=(x,y)=>[x,y];
const poses={
 stand:{head:p(0,-126),s:p(0,-101),h:p(0,-61),le:p(-18,-82),lh:p(-20,-61),re:p(22,-84),rh:p(28,-63),lk:p(-13,-32),lf:p(-18,0),rk:p(15,-31),rf:p(23,0)},
 ready:{head:p(9,-121),s:p(3,-97),h:p(-3,-58),le:p(-5,-76),lh:p(26,-77),re:p(28,-78),rh:p(40,-77),lk:p(-20,-29),lf:p(-25,0),rk:p(23,-28),rf:p(32,0)},
 press:{head:p(16,-117),s:p(8,-93),h:p(-3,-57),le:p(31,-71),lh:p(46,-60),re:p(39,-80),rh:p(54,-66),lk:p(-20,-29),lf:p(-25,0),rk:p(23,-28),rf:p(32,0)},
 reach:{head:p(21,-114),s:p(11,-90),h:p(-6,-56),le:p(38,-71),lh:p(52,-46),re:p(40,-74),rh:p(57,-48),lk:p(-22,-29),lf:p(-26,0),rk:p(22,-28),rf:p(32,0)},
 hug:{head:p(6,-122),s:p(2,-98),h:p(-3,-59),le:p(32,-80),lh:p(27,-91),re:p(34,-78),rh:p(43,-91),lk:p(-17,-30),lf:p(-24,0),rk:p(17,-30),rf:p(27,0)},
 crouch:{head:p(24,-91),s:p(17,-68),h:p(-15,-43),le:p(-9,-65),lh:p(-30,-79),re:p(-4,-57),rh:p(-28,-68),lk:p(20,-32),lf:p(4,0),rk:p(30,-29),rf:p(36,0)},
 lift:{head:p(5,-154),s:p(1,-130),h:p(-7,-90),le:p(26,-149),lh:p(38,-169),re:p(19,-143),rh:p(32,-164),lk:p(-20,-60),lf:p(-14,-30),rk:p(22,-62),rf:p(17,-30)},
 land:{head:p(16,-105),s:p(11,-82),h:p(-11,-52),le:p(34,-77),lh:p(44,-57),re:p(37,-80),rh:p(52,-68),lk:p(19,-31),lf:p(6,0),rk:p(32,-29),rf:p(40,0)},
 underBack:{head:p(0,-125),s:p(0,-101),h:p(0,-62),le:p(-24,-84),lh:p(-42,-94),re:p(-18,-78),rh:p(-37,-53),lk:p(-19,-32),lf:p(-27,0),rk:p(22,-31),rf:p(35,0)},
 underForward:{head:p(13,-123),s:p(9,-99),h:p(0,-61),le:p(32,-86),lh:p(56,-88),re:p(30,-86),rh:p(55,-82),lk:p(-18,-32),lf:p(-27,0),rk:p(25,-30),rf:p(42,0)},
 throwReady:{head:p(-4,-126),s:p(-3,-102),h:p(0,-63),le:p(-26,-112),lh:p(-31,-140),re:p(25,-104),rh:p(45,-105),lk:p(-20,-32),lf:p(-33,0),rk:p(20,-31),rf:p(33,0)},
 throwOut:{head:p(15,-125),s:p(10,-101),h:p(0,-62),le:p(31,-124),lh:p(57,-141),re:p(26,-93),rh:p(41,-83),lk:p(-23,-33),lf:p(-39,0),rk:p(35,-31),rf:p(56,0)},
 follow:{head:p(18,-119),s:p(13,-95),h:p(0,-60),le:p(37,-82),lh:p(59,-65),re:p(25,-91),rh:p(36,-76),lk:p(-20,-33),lf:p(-37,0),rk:p(34,-31),rf:p(55,0)},
 receiveLow:{head:p(23,-94),s:p(17,-70),h:p(-10,-46),le:p(37,-43),lh:p(48,-20),re:p(22,-39),rh:p(35,-17),lk:p(14,-26),lf:p(-1,0),rk:p(28,-25),rf:p(39,0)},
 receive:{head:p(9,-120),s:p(6,-97),h:p(0,-59),le:p(28,-78),lh:p(50,-92),re:p(29,-85),rh:p(48,-99),lk:p(-17,-31),lf:p(-22,0),rk:p(21,-30),rf:p(30,0)},
 step:{head:p(4,-125),s:p(2,-101),h:p(0,-62),le:p(-21,-94),lh:p(-40,-109),re:p(23,-96),rh:p(43,-109),lk:p(-12,-31),lf:p(-20,0),rk:p(30,-55),rf:p(48,-28)},
 run:{head:p(15,-125),s:p(8,-101),h:p(-2,-63),le:p(-13,-79),lh:p(-32,-93),re:p(31,-116),rh:p(44,-98),lk:p(26,-56),lf:p(44,-28),rk:p(-29,-42),rf:p(-43,-12)},
 brake:{head:p(7,-116),s:p(3,-92),h:p(-5,-59),le:p(22,-80),lh:p(38,-92),re:p(-12,-70),rh:p(-31,-80),lk:p(-19,-31),lf:p(-31,0),rk:p(31,-29),rf:p(51,0)},
 ropeBack:{head:p(0,-126),s:p(0,-101),h:p(0,-61),le:p(-22,-83),lh:p(-24,-66),re:p(22,-83),rh:p(27,-66),lk:p(-13,-32),lf:p(-18,0),rk:p(15,-31),rf:p(23,0)},
 ropeUp:{head:p(0,-126),s:p(0,-101),h:p(0,-61),le:p(-22,-112),lh:p(-27,-138),re:p(23,-115),rh:p(31,-141),lk:p(-13,-32),lf:p(-18,0),rk:p(15,-31),rf:p(23,0)},
 ropeFront:{head:p(6,-123),s:p(3,-99),h:p(0,-61),le:p(25,-91),lh:p(44,-80),re:p(27,-88),rh:p(45,-76),lk:p(-13,-32),lf:p(-18,0),rk:p(15,-31),rf:p(23,0)},
 crawl:{head:p(51,-65),s:p(30,-60),h:p(-18,-63),le:p(32,-30),lh:p(34,0),re:p(51,-33),rh:p(55,0),lk:p(-29,-22),lf:p(-49,0),rk:p(5,-22),rf:p(-12,0)},
 crawlMove:{head:p(59,-65),s:p(37,-60),h:p(-13,-63),le:p(48,-34),lh:p(65,0),re:p(37,-29),rh:p(40,0),lk:p(-26,-22),lf:p(-45,0),rk:p(17,-22),rf:p(2,0)},
 bear:{head:p(51,-72),s:p(31,-68),h:p(-15,-84),le:p(33,-35),lh:p(36,0),re:p(52,-35),rh:p(57,0),lk:p(-25,-48),lf:p(-29,0),rk:p(-2,-44),rf:p(8,0)},
 kickBack:{head:p(-6,-125),s:p(-4,-101),h:p(0,-62),le:p(-23,-92),lh:p(-42,-80),re:p(17,-90),rh:p(35,-79),lk:p(-27,-38),lf:p(-46,-26),rk:p(9,-31),rf:p(17,0)},
 kickContact:{head:p(-7,-125),s:p(-5,-101),h:p(0,-62),le:p(-26,-93),lh:p(-44,-88),re:p(18,-94),rh:p(37,-87),lk:p(27,-38),lf:p(49,-14),rk:p(-2,-31),rf:p(5,0)},
 kickFollow:{head:p(-9,-125),s:p(-6,-101),h:p(0,-62),le:p(-27,-96),lh:p(-46,-91),re:p(18,-94),rh:p(38,-89),lk:p(31,-48),lf:p(61,-42),rk:p(-3,-31),rf:p(3,0)}
};
function person(pose,x=113,y=196,opacity=1){const q=typeof pose==='string'?poses[pose]:pose;const xy=a=>`${a[0]} ${a[1]}`;const path=(a,b,c)=>`M${xy(a)} L${xy(b)} L${xy(c)}`;const mid=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k];const arm=(e,h,col)=>`<path d="${path(q.s,e,h)}" fill="none" stroke="${C.skin}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M${xy(q.s)} L${xy(mid(q.s,e,.48))}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round"/>`;const leg=(k,f)=>`<path d="${path(q.h,k,f)}" fill="none" stroke="${C.skin}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M${xy(q.h)} L${xy(mid(q.h,k,.48))}" fill="none" stroke="${C.dark}" stroke-width="15" stroke-linecap="round"/><path d="M${f[0]-4} ${f[1]} h14" stroke="${C.dark}" stroke-width="8" stroke-linecap="round"/>`;return `<g transform="translate(${x} ${y})" opacity="${opacity}">${arm(q.le,q.lh,'#65947a')}${leg(q.lk,q.lf)}<path d="M${xy(q.s)} L${xy(q.h)}" stroke="${C.green}" stroke-width="25" stroke-linecap="round"/><path d="M${q.head[0]} ${q.head[1]+9} L${xy(q.s)}" stroke="${C.skin}" stroke-width="10"/>${leg(q.rk,q.rf)}${arm(q.re,q.rh,C.green)}<circle cx="${q.head[0]}" cy="${q.head[1]}" r="16" fill="${C.skin}"/><path d="M${q.head[0]-15} ${q.head[1]} Q${q.head[0]-18} ${q.head[1]-20} ${q.head[0]+3} ${q.head[1]-17} Q${q.head[0]+16} ${q.head[1]-17} ${q.head[0]+16} ${q.head[1]-7} Q${q.head[0]+3} ${q.head[1]-14} ${q.head[0]-5} ${q.head[1]-4} Z" fill="${C.hair}"/><circle cx="${q.head[0]+9}" cy="${q.head[1]-1}" r="1.6" fill="${C.hair}"/><path d="M${q.head[0]+9} ${q.head[1]+7} q4 1 6-2" stroke="${C.hair}" stroke-width="1.2" fill="none"/></g>`}
const ball=(x,y,r=15,ghost=false)=>`<g opacity="${ghost?.22:1}"><circle cx="${x}" cy="${y}" r="${r}" fill="${C.ball}"/><path d="M${x-r*.75} ${y-r*.55} Q${x+4} ${y-3} ${x+r*.75} ${y+r*.55} M${x-r*.6} ${y+r*.65} Q${x+1} ${y-2} ${x+r*.6} ${y-r*.65}" stroke="#a24d2d" stroke-width="1.4" fill="none"/></g>`;
const arrow=(d,col=C.ball)=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5 5" marker-end="url(#arrow)"/>`;
const box=(x=267,y=158)=>`<path d="M${x} ${y} h42 v38 h-42Z" fill="#dbbc83"/><path d="M${x} ${y} l-10-9 h43 l9 9M${x} ${y} l9-9" stroke="#ad8a54" stroke-width="2" fill="#edd8b0"/><path d="M${x+8} ${y+18} h26" stroke="#ad8a54" stroke-width="2"/>`;
const target=(x=278,y=126)=>`<rect x="${x-17}" y="${y-30}" width="40" height="55" rx="8" fill="#d5e5d0" stroke="${C.line}" stroke-width="1.5"/><circle cx="${x+3}" cy="${y-3}" r="13" stroke="${C.green}" stroke-width="2" fill="none"/>`;
const bean=(x,y)=>`<rect x="${x-7}" y="${y-5}" width="15" height="11" rx="4" transform="rotate(-15 ${x} ${y})" fill="${C.blue}"/>`;
const label=(x,y,t)=>`<text x="${x}" y="${y}" fill="#53694f" font-size="13" font-family="sans-serif">${t}</text>`;
const mark=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="17" ry="5" fill="#d7b562"/>`;
function diagram(id,level,index){let scene='',hint='';const n=index;
 if(id==='dribble'){
  const posesFor=level===1?['hug','ready','reach','hug']:level===4?['ready','press','step','press']:['ready','press','reach',level===2?'hug':'press'];
  scene+=`<ellipse cx="167" cy="202" rx="28" ry="7" fill="none" stroke="${C.line}" stroke-dasharray="4 4"/>`;
  const shift=level===4&&n>1?19:0;scene+=person(posesFor[n],106+shift);
  if(n===0)scene+=ball(140,108);if(n===1)scene+=ball(160,149)+arrow('M165 166 L165 180');if(n===2)scene+=ball(166+shift,165)+ball(164,185,15,true)+arrow(`M${190+shift} 181 Q${196+shift} 151 ${180+shift} 141`);if(n===3)scene+=ball(level===2||level===1?144:179,level===2||level===1?108:151);
  if(level===4&&n>1)scene+=arrow('M75 215 H112',C.green);hint=['球在身前','手向下轻压','等待球弹回来','抱住 / 再次控球'][n];
 } else if(id==='throw'){
  scene+=level===1?box():target();const ps=level===1?['stand','underBack','underForward','follow']:['stand','throwReady','throwOut','follow'];scene+=person(ps[n],100+(n>1&&level>2?12:0));
  if(n===0)scene+=bean(129,132);if(n===1)scene+=bean(level===1?63:69,level===1?145:56);if(n===2)scene+=bean(212,level===1?136:77)+arrow(level===1?'M166 112 Q217 85 271 158':'M174 52 Q229 28 279 106');if(n===3)scene+=bean(279,level===1?177:123);
  if(level>=3&&n===2)scene+=arrow('M108 214 H162',C.green);if(level===4)scene+=target(278,61);hint=['看大目标','手臂向后准备','脚向前，手跟上','顺势随摆，完成投出'][n];
 } else if(id==='catch'){
  const low=level===1;scene+=person(n===3?'hug':low?'receiveLow':'receive',114+(level===4&&n>0?18:0));
  const pos=low?[[282,179],[236,180],[185,180],[151,108]]:level===3?[[280,105],[233,181],[180,141],[151,108]]:[[280,104],[231,112],[180,108],[151,108]];
  scene+=ball(...pos[n],low?18:16);if(n<3)scene+=arrow(low?`M${pos[n][0]-22} 179 h-30`:level===3&&n===1?'M218 180 Q201 136 190 132':`M${pos[n][0]-22} ${pos[n][1]} l-26 0`);
  if(level===4&&n>0)scene+=arrow('M87 213 H126',C.green);hint=low?['双手准备','球沿地面滚来','双手拦住','把球抱回身体'][n]:['说“好了”再送球','看球的方向','双手迎球','手臂回收，抱稳'][n];
 } else if(id==='jump'){
  const offset=[85,95,181,190][n];scene+=`<path d="M145 196 v-8" stroke="${C.ball}" stroke-width="5"/>`+mark(204,201);scene+=person(['stand','crouch','lift','land'][n],offset);
  if(n===2)scene+=arrow('M112 116 Q157 64 200 115');if(n===3)scene+=`<path d="M195 186 l-8-7 M217 186 l9-7" stroke="${C.ball}" stroke-width="2"/>`;
  hint=['看前方落点','屈膝，手臂后摆','双脚一起离地','屈膝缓冲，站稳'][n];
 } else if(id==='rope'){
  const ps=level===1?['stand','crouch','lift','land']:level===2?['stand','crouch','lift','land']:['ropeBack','ropeUp','ropeFront',level===3?'step':'lift'];const xx=level===2?[91,91,165,168][n]:137;scene+=person(ps[n],xx);
  if(level===2)scene+=`<path d="M133 191 l7 9 15-7" fill="none" stroke="${C.ball}" stroke-width="4" stroke-linecap="round"/>`;
  if(level>=3){const paths=['M112 130 Q34 118 70 195 Q95 210 164 130','M110 58 Q43 6 179 38 L168 55','M179 118 Q265 163 197 198 Q165 209 123 196','M109 100 Q83 179 137 201 Q196 214 174 112'];scene+=`<path d="${paths[n]}" fill="none" stroke="${C.ball}" stroke-width="3.5" stroke-linecap="round"/>`;if(n===1)scene+=arrow('M217 56 Q240 89 231 123');}
  hint=level<3?['听节奏 / 看地面绳','轻轻屈膝','双脚小跳','站稳，再开始'][n]:['绳在身后','慢慢向前摇','停在脚前，看落点',level===3?'跨过后重新准备':'小跳过绳，先做单次'][n];
 } else if(id==='run'){
  const xx=[75,118,163,221][n];scene+=person(['stand','run','brake','stand'][n],xx);scene+=mark(259,201);if(n===1)scene+=arrow('M48 211 H87');if(n===2)scene+=`<path d="M230 150 l8-14 M234 163 h16" stroke="${C.ball}" stroke-width="2"/>`;if(level>=3)scene+=arrow('M256 187 Q300 167 280 142',C.green);hint=['看清边界','小步走 / 跑','减速，不急停','站稳，再转方向'][n];
 } else if(id==='balance'){
  scene+=`<path d="M40 201 Q105 184 164 200 T298 197" fill="none" stroke="${C.line}" stroke-width="${level===1?17:5}" stroke-linecap="round"/>`;if(level>=3)scene+=mark(69,201)+mark(143,201)+mark(216,201);scene+=person(['stand','step','stand','step'][n],[75,105,174,199][n]);if(n===1||n===3)scene+=arrow('M235 154 H270',C.green);hint=['沿地面路线','手臂自然展开','小站停一停','看下一站再走'][n];
 } else if(id==='crawl'){
  scene+=`<rect x="32" y="188" width="267" height="14" rx="7" fill="#d0e0ce"/>`;scene+=person(n===3&&level===4?'hug':level>=3&&n===1?'bear':n%2?'crawlMove':'crawl',[105,131,153,193][n]);if(n===3&&level===4)scene+=ball(229,108)+box(269,162);else scene+=mark(270,201);if(n===1||n===2)scene+=arrow('M201 159 H251',C.green);hint=['在干净软垫上','慢慢移动手脚','眼睛看前方一点',level===4?'站起，抱轻球搬运':'到家后休息'][n];
 } else if(id==='kick'){
  scene+=`<path d="M266 193 v-43 h44 v43 M266 150 l13-8 h36 v43 l-5 8" fill="none" stroke="${C.line}" stroke-width="3"/>`;scene+=person(['stand','kickBack','kickContact','kickFollow'][n],107);
  const xx=[160,161,174,242][n];scene+=ball(xx,181,15);if(n>=2)scene+=arrow(`M${xx+18} 181 h23`);if(level>=2&&n===0)scene+=arrow('M239 181 H190');hint=['先停好球','支撑脚站稳','轻摆脚，推球出去','球向前，身体站稳'][n];
 } else if(id==='hop'){
  const ps=level===1?['stand','step','stand','step']:['stand','crouch','lift','land'];const xx=[78,124,173,220][n];scene+=mark(218,201)+person(ps[n],xx);
  if(level===1)scene+=`<path d="M142 195 H188" stroke="${C.ball}" stroke-width="3" stroke-dasharray="5 5"/>`;else if(n===2)scene+=arrow('M132 128 Q177 77 215 130');
  if(n===1||n===3)scene+=`<path d="M${xx+4} 170 l-12-9 M${xx+22} 170 l12-9" stroke="${C.ball}" stroke-width="2"/>`;
  hint=level===1?['看地面线','跨过去，站稳','换另一只脚','再跨回来'][n]:['准备抬脚','屈膝，手臂展开','轻轻离地','落地后站稳'][n];
 } else if(id==='gallop'){
  const xx=[82,125,171,220][n];scene+=mark(235,201)+person(['stand','step','run','brake'][n],xx);
  if(n===1)scene+=arrow('M115 191 H170',C.green);if(n===2)scene+=arrow('M155 191 H216',C.green);if(n===3)scene+=`<path d="M230 157 l14 0 M237 150 v14" stroke="${C.ball}" stroke-width="2"/>`;
  hint=['面向前方，侧着走','跨一步，并一步','听节奏侧向移动','到标记处停住'][n];
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 236" role="img" aria-label="${window.FITNESS.skills[id].name}，步骤${n+1}：${hint}"><title>${hint}</title><defs><marker id="arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8Z" fill="${C.ball}"/></marker></defs><path d="M22 203 H318" stroke="#b2c5a9" stroke-width="1.5"/>${scene}${label(19,225,hint)}</svg>`;
}
function frames(id,level){const s=window.FITNESS.skills[id];const v=s.levels[level-1];const names={dribble:['准备','落地','回弹','控制'],throw:['看目标','准备摆臂','向前送出','顺势完成'],catch:['准备','看球','迎球','抱稳'],jump:['准备','屈膝','起跳','落地'],rope:level<3?['准备','屈膝','小跳','停稳']:['身后准备','向前摇','脚前落绳','过绳'],run:['看路线','启动','减速','停稳'],balance:['看小路','迈步','停住','再出发'],crawl:['准备','移手脚','向前','到家'],kick:['摆球','站稳','触球','随摆'],hop:['准备','跨步','起跳','落地'],gallop:['准备','跨步','并脚','停住']};
 const texts={
 dribble:level===1?['双手把球抱在腰前，脚站稳。','双手松开，让球自然落到脚前侧。','先看回弹，不急着伸手追球。','球回到手边，双手抱回身前。']:level===4?['先原地拍球，落点保持在身前侧。','手向下轻压，让球回弹到能控制的位置。','球还在控制范围时，向前迈一个小步。','再次控球或直接抱住，准备好再开始。']:['脚微分，球在腰前，手掌自然张开。','向地面轻压球，不用力砸。','等球回弹；落点跑远就抱回重新摆好。',level===2?'双手抱住结束这一轮。':'回弹到手边再拍，做短串后主动抱住。'],
 throw:level===1?['看脚前的大箱子，距离近一些。','手拿软豆袋，手臂轻轻后摆。','向前摆臂，把豆袋送进大箱子。','手臂自然跟随，再走去捡豆袋。']:['侧身看目标，投掷手同侧脚在后。','豆袋在肩后，另一只手可指向目标。',level>=3?'另一侧脚朝目标迈步，身体转向前，手臂跟上。':'转向目标，向前挥臂送出豆袋。','投出后手臂自然随摆，身体站稳。'],
 catch:level===1?['蹲低，双手张开，等成人确认准备好。','球慢慢沿地面滚来，眼睛跟球走。','两手拦球，让球停在身前。','把球抱好，再决定是否滚回去。']:['两手在身前，先说“好了”。',level===3?'球先落地，观察它将从哪里弹起。':'看着成人缓慢送来的软球。',level===4?'小步移到球的后面，双手一起迎球。':'双手向球迎过去，手臂不要僵直。','手臂柔和回收，把球抱稳。'],
 jump:['双脚自然分开，看前方地面落点。','膝盖和髋部自然弯曲，手臂后摆。','双脚一起轻跳，幅度先小一点。','双脚着地，膝髋弯曲缓冲，然后站稳。'],
 rope:level<3?['先确认脚前没有障碍，绳子平放地面。','膝髋轻弯，不用追求跳高。','双脚小跳；不会跳可先跨过去。','落地站稳，听节奏再决定下一次。']:['绳子从身后开始，空间空旷。','手腕带动绳子慢慢从头顶前方经过。','先让绳子落在脚前，观察绳的位置。',level===3?'绳不再动后跨过去或跳过去，再重新准备。':'协调摇绳与小跳，只尝试单次，成功后再连接。'],
 run:['确定起点、终点和跑动边界。','低速走或小跑，眼睛看路线。','提前收到停的信号，用几个小步减速。','站稳后，再决定下一方向。'],
 balance:['看清平整地面路线，脚自然站。','手臂展开，脚步慢一点，不用脚跟贴脚尖。','走到标记停一下，找回身体稳定。','看下一段路线，再迈出下一步。'],
 crawl:['双手、膝盖支撑在干净软垫上。',level>=3?'能力允许时短暂抬膝，困难就保持膝盖着垫。':'手和对侧膝盖轮流前移。','眼睛看前方一小段，慢慢到标记处。',level===4?'站起来抱轻球走去箱子，完成组合。':'到家后放松，站起来慢走休息。'],
 kick:['把球停好，观察宽球门的位置。','支撑脚站在球旁，另一只脚轻向后摆。','轻轻向前摆脚，让球沿地面滚出。','脚自然随摆，身体站稳，不追球冲出边界。'],
 hop:level===1?['看清地面线，准备跨步。','一只脚跨过线，双脚站稳。','换另一只脚，仍然先站稳。','跨回起点，休息后再决定是否升级。']:['一脚站稳，另一脚准备抬起。','屈膝并展开手臂，准备小跳。','一只脚轻轻越过近处标记。','落地后先站稳，再换脚或休息。'],
 gallop:['身体面向前方，准备向侧面移动。','向一侧跨一步，保持路线宽松。','另一脚并过来，听慢节奏重复。','到标记处停住，走回起点休息。']};return names[id].map((name,i)=>({name,text:texts[id][i],svg:()=>diagram(id,level,i)}));}
window.MOTION={frames,diagram};
})();
