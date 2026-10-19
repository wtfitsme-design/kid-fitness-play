'use strict';
(() => {
  const leaf=(id,name,task,tip,branch,prereq=[])=>({id,name,task,tip,branch,prereq});
  const skills={
    basketball:{name:'篮球控球',short:'拍球',category:'控物',color:'#2c7a64',equipment:'轻型小篮球或回弹球',intro:'从抱球、放球和接球开始，慢慢把“看球—等球—控球”连起来。',branches:[
      {id:'feel',name:'球感与保护',leaves:[leaf('hold','抱稳球','双手把球抱在腰前，走三步再停住。','球贴近身体，手指张开。','起步'),leaf('release','原地放球','双手在腰前放开球，让它自然落到脚前。','先看落点，不急着追。','起步',['hold']),leaf('roll-stop','接滚球','家长把球沿地面慢慢滚来，双手把球拦住。','先让球停，再抱回身体。','起步',['hold'])]},
      {id:'control',name:'原地控制',leaves:[leaf('bounce-catch','拍一下抱住','一手把球轻压到地面，弹起后双手抱住。','只做一次，成功就停。','控制',['release']),leaf('low-dribble','连续低拍','在身前连续拍两到三下，再主动抱住。','球弹到腰附近更好控。','控制',['bounce-catch']),leaf('switch-hand','换手控球','右手拍一下抱住，再换左手试一次。','先换位置，不追求连续。','控制',['low-dribble'])]},
      {id:'move',name:'移动控球',leaves:[leaf('step-dribble','拍球走一步','原地拍一下，脚跟着向前走一步。','脚慢慢跟上球。','移动',['low-dribble']),leaf('turn-dribble','绕宽标记','拍球到宽标记前，抱住、转身，再重新开始。','先转身体，再处理球。','移动',['step-dribble'])]},
      {id:'play',name:'把球放进游戏',leaves:[leaf('target-dribble','拍球到家','拍球走到“家”前，把球抱进箱子或圈里。','路线短，目标大。','游戏',['turn-dribble'])]}
    ]},
    throw:{name:'投掷',short:'投球',category:'控物',color:'#b85c42',equipment:'软豆袋、宽纸箱或地面目标',intro:'从“送进大箱子”开始，逐步加入侧身、迈步和方向调整。',branches:[
      {id:'feel',name:'手臂与目标',leaves:[leaf('hold-beanbag','拿稳豆袋','一手拿软豆袋，眼睛看大目标。','先确认目标在安全方向。','起步'),leaf('underhand','下手送球','手臂向后轻摆，再向前把豆袋送进近处大箱子。','像送礼物一样。','起步',['hold-beanbag']),leaf('roll-target','滚向目标','把豆袋或软球沿地面滚向宽目标。','手从后向前送。','起步',['hold-beanbag'])]},
      {id:'shape',name:'身体配合',leaves:[leaf('side-throw','侧身向前投','身体侧向目标，投掷手在肩旁，转向目标挥臂。','看目标，手臂跟身体走。','控制',['underhand']),leaf('step-throw','迈一步投','另一侧脚向目标迈一步，手臂随后送出。','脚朝目标走，手跟上。','控制',['side-throw']),leaf('follow-through','顺势完成','投出后手臂自然随摆，身体站稳。','投完不要立刻冲出去。','控制',['step-throw'])]},
      {id:'play',name:'调整方向',leaves:[leaf('choose-target','选目标再投','从两个宽目标中选一个，调整身体后投出。','先选家，再送豆袋回家。','应用',['follow-through'])]}
    ]},
    catch:{name:'接球',short:'接球',category:'控物',color:'#4a7fa0',equipment:'轻软球或大软球',intro:'先接滚球，再接低抛球，最后练习移动到球后面。',branches:[
      {id:'feel',name:'等待与拦球',leaves:[leaf('ready-hands','双手准备','双脚分开，双手在身前张开，先说“好了”。','孩子准备好，成人再送球。','起步'),leaf('stop-roll','拦住滚球','家长慢慢滚球，孩子用双手把球拦住。','像给小火车进站。','起步',['ready-hands']),leaf('hug-ball','接住抱稳','球到身前时双手迎球，再抱回胸前。','手臂柔和，不拍球。','起步',['stop-roll'])]},
      {id:'control',name:'低抛与反弹',leaves:[leaf('low-toss','低抛双手接','家长从近处轻抛到胸口以下，孩子双手抱接。','不抛高，不砸地。','控制',['hug-ball']),leaf('bounce-catch','反弹后接','球在孩子前方弹一下，孩子看落点后接住。','等球弹回来。','控制',['low-toss']),leaf('move-catch','挪一步接球','球只偏左或右一点，脚先到球后面。','脚先到，手再抱球。','移动',['bounce-catch'])]}
    ]},
    kick:{name:'踢球与停球',short:'踢球',category:'控物',color:'#8b6b3c',equipment:'大软球、宽球门',intro:'先把球停在脚边，再学会轻踢和把球送进大球门。',branches:[
      {id:'feel',name:'脚下感觉',leaves:[leaf('foot-stop','脚底停球','成人把球慢慢滚来，孩子用脚底轻轻踩停。','球慢一点，脚先找球。','起步'),leaf('push-ball','推球走','用脚内侧把球轻推一步，再追上停住。','球始终在近处。','起步',['foot-stop']),leaf('ready-kick','固定球准备','球放稳，支撑脚站在球旁，另一脚向后摆。','先站稳再踢。','起步',['foot-stop'])]},
      {id:'control',name:'方向控制',leaves:[leaf('kick-gate','轻踢进门','对准宽球门，轻轻把固定球踢进去。','球门近而宽。','控制',['ready-kick']),leaf('stop-return','停住再踢','把滚来的球停好，再踢回成人方向。','先停，再送回去。','控制',['kick-gate']),leaf('follow-ball','踢一步跟一步','轻踢一下，走到球后面停住，再踢下一下。','脚慢慢跟球。','移动',['stop-return'])]},
      {id:'play',name:'绕标记进球',leaves:[leaf('turn-kick','绕宽标记踢进门','带球走宽弯，停好后找大球门。','先转弯，再看球门。','应用',['follow-ball'])]}
    ]},
    rope:{name:'跳绳准备',short:'跳绳',category:'节奏',color:'#9a6a9b',equipment:'软短绳、粉笔线',intro:'把摇绳、过绳和小跳拆开，再尝试一次完整连接。',branches:[
      {id:'rhythm',name:'节奏与落地',leaves:[leaf('small-jump','节奏小跳','跟着拍手做低幅度双脚跳，听到停就停。','轻轻跳，稳稳停。','起步'),leaf('ground-rope','跳过地面绳','软绳平放成线，双脚跳过后站稳。','绳子不抬高。','起步',['small-jump']),leaf('rope-step','摇到脚前','绳子从身后摇到脚前，先停住再跨过去。','摇和过先分开。','起步',['ground-rope'])]},
      {id:'connect',name:'摇与跳连接',leaves:[leaf('one-jump','摇一下跳一下','看到绳子落到脚前，双脚轻轻跳过。','先做单次，不追连续。','控制',['rope-step']),leaf('reset-rope','停住重置','完成一次后主动停下，整理绳子再开始。','会停也是能力。','控制',['one-jump']),leaf('two-jump','连续两次','成功一次后，尝试连接第二次。','低幅度、慢节奏。','连接',['reset-rope'])]}
    ]},
    strike:{name:'击打与挥拍',short:'挥拍',category:'控物',color:'#c27a3d',equipment:'软球、泡沫拍或纸板拍',intro:'新增的控物技能：先挥空拍，再击打静止软球，逐步加入来球。',branches:[
      {id:'shape',name:'握拍与挥动',leaves:[leaf('hold-paddle','握住软拍','双手或惯用手握住泡沫拍，拍面朝前。','握稳，不举过头顶。','起步'),leaf('air-swing','空挥拍','从身侧向前挥一次，挥完停住。','眼睛看前方目标。','起步',['hold-paddle']),leaf('tap-ball','拍停球','把软球放在固定位置，用拍面轻轻碰到球。','只求碰到，不求远。','起步',['air-swing'])]},
      {id:'control',name:'看球与击打',leaves:[leaf('roll-hit','击打慢滚球','成人把球沿地面慢滚，孩子用拍面轻触。','先看球，再挥拍。','控制',['tap-ball']),leaf('drop-hit','落球击打','成人从低处放球，孩子等球落地后轻拍。','只改变一个变量。','控制',['roll-hit']),leaf('aim-hit','拍向大目标','把软球拍向宽目标区，距离保持近。','目标大，力量小。','应用',['drop-hit'])]}
    ]},
    core:{name:'核心支撑',short:'支撑',category:'稳定',color:'#55795c',equipment:'干净软垫、软标记',intro:'把爬行、支撑和搬运串起来，支持其他控物技能。',branches:[
      {id:'support',name:'身体支撑',leaves:[leaf('four-point','四点支撑','双手和膝盖在软垫上，背部保持自然。','短时间、自然呼吸。','起步'),leaf('crawl-forward','对侧爬行','手和对侧膝盖轮流前移，到近处标记。','慢慢移动，不赶速度。','起步',['four-point']),leaf('bear-steps','小熊走几步','双手和脚撑地，膝盖短暂离垫，再回到四点支撑。','只做几步就休息。','控制',['crawl-forward'])]},
      {id:'carry',name:'支撑到搬运',leaves:[leaf('crawl-tunnel','穿过宽隧道','四点爬过成人手臂做的宽门，再站起。','门够高，不压脖子。','控制',['crawl-forward']),leaf('carry-ball','爬到家再搬球','爬到标记处，站起抱轻球走到箱子。','动作串联，负重很轻。','应用',['crawl-tunnel']),leaf('reset-body','整理身体','完成搬运后走回、喝水，再选择下一轮。','会休息、会重置。','应用',['carry-ball'])]}
    ]}
  };
  window.V2={skills,allLeaf(skill){return skill.branches.flatMap(b=>b.leaves)},allLeaves(){return Object.values(skills).flatMap(s=>s.branches.flatMap(b=>b.leaves))}};
})();
