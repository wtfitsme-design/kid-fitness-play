// Each game offers a place to start, a simpler invitation and a rule the child can invent.
window.PlayField = {
  groups: {
    move: '追逐与变向', steady: '平衡与跳跃', support: '钻爬与支撑',
    team: '搭档合作', rhythm: '节奏与模仿'
  },
  sources: {
    ssg: ['新加坡体育理事会 · 学前基础动作', 'https://www.activesgcircle.gov.sg/preschool/resources/movement-skills/fundamental-movement-skills'],
    chase: ['国家体育总局 · 亲子运动游戏', 'https://www.sport.gov.cn/n20001280/n20067626/n20067861/c20209477/content.html'],
    balance: ['国家体育总局青少年体育司 · 家庭平衡游戏', 'https://www.sport.gov.cn/qss/n5022/c28857160/content.html'],
    lead: ['澳大利亚育儿网 · 让孩子带着玩', 'https://raisingchildren.net.au/school-age/play-media-technology/getting-play-started/letting-your-child-lead-play']
  },
  games: [
    {
      id: 'rescue', name: '玩偶救援队', group: 'support', places: ['home'], quiet: true, gear: '靠垫、玩偶',
      hook: '带爸爸穿过山路，接队友回家。', invite: '队长，小熊在那边，你带我去接它好吗？',
      start: '把玩偶放在靠垫后。你跟在孩子旁边，一起用手和膝盖爬过去。找到玩偶就让他选回家的路。',
      easier: '把玩偶移到一伸手就够得到的位置。他负责接，你负责爬。',
      invent: '哪块靠垫是山？谁需要救援？让他摆路线，再带你走一遍。',
      notice: '他把靠垫挪开给你让路，或者主动换了一条路，都可以记下来。',
      alt: '男孩和爸爸手膝着地，绕过靠垫去接后面的玩偶', ref: 'balance'
    }, {
      id: 'palm', name: '手掌机关门', group: 'support', places: ['home','out'], quiet: true, gear: '',
      hook: '你们的手掌，是一扇会移动的门。', invite: '这扇门听你的，怎么开？',
      start: '你蹲到和他差不多高，把手掌朝向他。让他轻轻推，你的手顺势后移，门就开了。',
      easier: '让两人的手掌先轻轻碰一下，你自己把门打开。',
      invent: '他可以设计开门暗号、指定从哪边开，或让你做客人。',
      notice: '留意他怎样改变用力，或想出自己的开门办法。', alt: '父子面对面轻推彼此的手掌，爸爸的手顺着孩子移动', ref: 'lead'
    }, {
      id: 'tail', name: '抓爸爸的尾巴', group: 'move', places: ['out'], quiet: false, gear: '手帕',
      hook: '瞄准爸爸身后飘起来的小尾巴。', invite: '我的尾巴露出来了，你想从哪边靠近？',
      start: '在空地把手帕一角松松塞进你的后腰，先慢慢走。他碰到或抽出手帕后，由他决定谁来戴。',
      easier: '你站着不动、转过身，让他自己发现并取下手帕。',
      invent: '他来决定尾巴怎样走，是画弧线、突然停住，还是偷偷倒着数。',
      notice: '他绕到另一边伸手，已经试了新的追法。', alt: '孩子在公园追近爸爸，伸手够爸爸腰后的手帕', ref: 'chase'
    }, {
      id: 'chalk', name: '自己画跳房子', group: 'steady', places: ['out'], quiet: false, gear: '粉笔或地砖格',
      hook: '地上画几块岛，路线交给你。', invite: '给你的小岛起个名字，带我去看看。',
      start: '在空地画相邻的大岛，也可以直接用地砖。让他选最近的一块跨进去，再一起试着双脚轻轻跳过去。',
      easier: '让两块岛挨在一起，先迈过去。也可以只负责画，由你先探路。',
      invent: '他可以画一座只能侧着进的岛，也可以规定上岛后的秘密动作。',
      notice: '他找到舒服的落脚点，或自己设计了路线。', alt: '孩子在户外跨跳自己画的粉笔格，爸爸在旁边看路线', ref: 'balance'
    }, {
      id: 'scarf', name: '接住小落叶', group: 'team', places: ['home','out'], quiet: true, gear: '轻薄方巾',
      hook: '一片慢慢飘下来的叶子，会落在哪里？', invite: '风来了，落叶会飘到你哪只手？',
      start: '在孩子面前松开方巾，他伸手碰一下就能参与。接下来互换，让他放、你来接。',
      easier: '把方巾放低，先让一角碰到他摊开的手，再试着放手。',
      invent: '叶子可以落在手肘、肩膀或他的“秘密停机坪”。让他选落点。',
      notice: '可以记下他想到的新落点。', alt: '爸爸放开一块方巾，孩子伸手去碰缓缓飘下的布', ref: 'ssg'
    }, {
      id: 'traffic', name: '红绿灯小司机', group: 'move', places: ['home','out'], quiet: false, gear: '',
      hook: '他当指挥，爸爸这辆车听令出发。', invite: '指挥员，你打算用什么手势让我停车？',
      start: '在空地约定一个出发手势和一个停车手势。他先当指挥，等他想开车再换。',
      easier: '你们面对面原地踏步，看到停车手势就站好。',
      invent: '试试给转弯或倒车发明专属手势，听听小司机的想法。',
      notice: '他看到手势，能把自己的脚慢下来。', alt: '爸爸举起手掌发出停车信号，孩子在空地上停步', ref: 'ssg'
    }, {
      id: 'bridge', name: '地砖小桥', group: 'steady', places: ['home','out'], quiet: true, gear: '',
      hook: '沿地上的线，从桥头走到桥尾。', invite: '这条线通去哪里？我跟着你过桥。',
      start: '用地砖缝或地板拼缝当桥，双手张开，轮流沿着线走。中途怎样转身由领路的人决定。',
      easier: '把线两旁也算作桥面，可以牵手走。',
      invent: '让他指定停靠站，在站点给你一个动作暗号。',
      notice: '他找到能让自己站稳的手臂姿势。', alt: '孩子张开双臂，沿平坦地面的一条线走，父亲在旁边', ref: 'balance'
    }, {
      id: 'tunnel', name: '穿过手臂山洞', group: 'support', places: ['home','out'], quiet: true, gear: '',
      hook: '爸爸搭好山洞，你来找入口。', invite: '这座山有个洞，你想从哪边过？',
      start: '你在垫子或草地旁蹲稳，用手臂比一个宽拱门。孩子可以手膝爬过，也可以从门边绕过去。',
      easier: '把手臂举高，先让孩子伸一只手跟你打招呼。',
      invent: '门有多宽、要说什么口令、下一回谁做门，都让他定。',
      notice: '他自己决定怎样进出，就能留下这次发现。', alt: '爸爸稳稳举起手臂，男孩从下方宽敞的拱形空间钻过', ref: 'ssg'
    }, {
      id: 'parcel', name: '玩偶补给站', group: 'team', places: ['home','out'], quiet: true, gear: '小毛巾、软玩偶',
      hook: '用毛巾做托盘，把队友送到补给站。', invite: '队友要去哪一站？你来给我指路。',
      start: '把小毛巾折成托盘，放上轻玩偶。让孩子双手托着，和你一起送到附近的站点。',
      easier: '把站点放在手边。你托住一角，和他一起送。',
      invent: '谁当收件人？沿路要在哪里停？让孩子安排。',
      notice: '他放慢脚步、重新托住玩偶，就是发现了自己的办法。', alt: '孩子用双手端着折好毛巾上的玩偶，把它送到小篮旁', ref: 'lead'
    }, {
      id: 'bubbles', name: '追风捕泡泡', group: 'move', places: ['out'], quiet: false, gear: '泡泡棒',
      hook: '跟着风，追一颗慢悠悠的泡泡。', invite: '你选一个泡泡，我跟你一起追。',
      start: '选平坦开阔的地方，你朝远离脸的方向吹一小串泡泡。让他选一颗近的，伸手碰或者跟着它走。',
      easier: '吹得低一些，等泡泡飘到他身旁再伸手。',
      invent: '试试用手背碰、当泡泡导游，或者由他吹给你追。',
      notice: '他为追上泡泡换了方向，已经在练身体的转向。', alt: '公园里爸爸吹泡泡，男孩在空地上追一颗泡泡', ref: 'ssg'
    }, {
      id: 'stars', name: '脚尖点星星', group: 'steady', places: ['home','out'], quiet: true, gear: '可用地面的图案',
      hook: '牵着爸爸，用一只脚给星星点名。', invite: '哪颗星先亮？指给我看。',
      start: '在脚边找个小图案当星星。让他扶着你的手站稳，再用另一只脚轻点地上的图案。',
      easier: '把星星放在脚尖旁，你伸双手给他扶。',
      invent: '他说点亮顺序，你来学。也可以给每颗星配个声音。',
      notice: '可以记下他用哪种方式找到平衡。', alt: '男孩扶住父亲的手，用一只脚点脚边地面的星形标记', ref: 'balance'
    }, {
      id: 'bell', name: '小猫按门铃', group: 'support', places: ['home'], quiet: true, gear: '布片或玩具门铃',
      hook: '像猫一样撑好，用一只“前爪”按门铃。', invite: '小猫来串门，你准备按哪一个铃？',
      start: '在地毯上手膝撑好，把布片放在他手旁当门铃。他抬起一只手去碰，你负责配铃声。',
      easier: '先坐着碰门铃。等他想学小猫，再让手和膝盖着地。',
      invent: '让他移动门铃、发明声音，或交换谁来开门。',
      notice: '当他把另一只手撑稳时，说出你看到的动作。', alt: '孩子手膝着地，另一只手稳住身体，伸手碰近处的小门铃', ref: 'ssg'
    }, {
      id: 'box', name: '纸箱推土机', group: 'support', places: ['home'], quiet: true, gear: '轻空纸箱',
      hook: '用双手把空箱开进自己的工地。', invite: '工程师，请你选个停车位。',
      start: '把空纸箱放在平整地面，他弯膝用双手慢慢向前推。你在一旁当向导，给箱子留出一条宽路。',
      easier: '你们并排一起推动，箱子挪动一点就靠岸。',
      invent: '由他规划转弯、给车起名，或者把箱子交给你驾驶。',
      notice: '他找到了一个舒服的推箱姿势。', alt: '男孩弯膝双手推一个轻空纸箱，父亲在一旁示意路线', ref: 'ssg'
    }, {
      id: 'leaf', name: '企鹅送信', group: 'team', places: ['home','out'], quiet: true, gear: '折好的手帕',
      hook: '夹着一封软软的信，摇摇摆摆去投递。', invite: '企鹅邮差出发了，谁是你的小邻居？',
      start: '把手帕折成一封信，让孩子夹在手臂和身体之间。你张开手当信箱，让他按喜欢的步子走过来。',
      easier: '把信拿在手里，从爸爸身旁就能送达。',
      invent: '企鹅可以横着走、绕路送或自己做收信人。',
      notice: '如果信掉了，看看他想怎样把信带回去。', alt: '男孩把软布夹在手肘与腰间，向父亲张开的手走去', ref: 'lead'
    }, {
      id: 'relay', name: '绕树送信', group: 'move', places: ['out'], quiet: false, gear: '一片落叶或小纸片',
      hook: '把落叶变成信，绕过树送给收件人。', invite: '这封信要走哪条路？',
      start: '在空地挑一棵树作路标。把落叶交给他，让他从喜欢的一侧绕过去，再送到你手里。',
      easier: '站在树旁做收件人，先从身旁交接。',
      invent: '他可以换收件地点，或者把下一段路线讲给你听。',
      notice: '他在路标旁换方向，还记得收件人的位置。', alt: '孩子绕过公园的树干，把信递给父亲', ref: 'balance'
    }, {
      id: 'river', name: '跨过小河', group: 'steady', places: ['out'], quiet: false, gear: '粉笔或砖缝',
      hook: '找河面最窄的地方，一起过岸。', invite: '探路员，哪里最方便到对岸？',
      start: '用两条粉笔线画一条很窄的河。让他选位置迈过去，你照着走。等他自己想跳时，再试双脚轻轻落地。',
      easier: '先把一条线当河，牵手迈过去。',
      invent: '让河一段宽、一段窄，由他发明摆渡方式。',
      notice: '他能挑到适合自己的过河位置。', alt: '男孩跨过平地上两条粉笔线画的小河，爸爸在岸旁', ref: 'balance'
    }, {
      id: 'slalom', name: '侧身穿山谷', group: 'move', places: ['home','out'], quiet: true, gear: '空纸盒',
      hook: '螃蟹横着走，也能穿过山谷。', invite: '你把山谷摆在哪儿？我来学你的走法。',
      start: '把空盒子隔开摆成宽路。两人都面向同一边，慢慢横着移步，绕过盒子。',
      easier: '只摆一个盒子，在旁边往左、往右各挪一小步。',
      invent: '谁来挪动山谷？什么时候换方向？把指挥权交给他。',
      notice: '他试着换边、控制步子，都是自己的探索。', alt: '爸爸和男孩在空纸盒间做侧向移动', ref: 'balance'
    }, {
      id: 'trail', name: '脚步侦察队', group: 'move', places: ['home','out'], quiet: true, gear: '',
      hook: '队长开路，爸爸照着他的脚步走。', invite: '我跟在你后面，猜猜我能不能学会你的走法。',
      start: '让孩子领路。无论他大步走、侧着挪还是突然转个身，你先观察，再把他的动作学出来。',
      easier: '两人在原地各迈出一只脚，让他看看你怎样模仿他。',
      invent: '他可以给新步法起名字，再请你用这种步法返程。',
      notice: '替他记下发明的步法和名字。', alt: '孩子在前面创作步法，父亲跟在后面模仿', ref: 'lead'
    }, {
      id: 'crane', name: '白鹤起飞', group: 'steady', places: ['home','out'], quiet: true, gear: '',
      hook: '借爸爸一只手，让另一只翅膀飞起来。', invite: '你的白鹤会在哪里停一下？',
      start: '让孩子扶着你的手，把重心慢慢移到一只脚上。另一脚可以只抬脚跟，再张开一只手臂当翅膀。',
      easier: '两只脚都留在地上，只让翅膀飞。',
      invent: '他说起飞或降落，你做他的影子。也可以换一种鸟。',
      notice: '他发现一个足够稳的姿势，可以请他教你。', alt: '男孩扶着爸爸的手，轻抬一脚并展开手臂模仿白鹤', ref: 'ssg'
    }, {
      id: 'island', name: '换岛暗号', group: 'team', places: ['out'], quiet: false, gear: '地砖格或粉笔',
      hook: '想一个暗号，一起到隔壁岛会合。', invite: '队长，听到什么声音才出发？',
      start: '在地面选相邻的几个格子当岛。你们站在不同的格子里，他发出暗号，各自迈进旁边的空岛。',
      easier: '站在相邻的岛上，先只伸手击掌，用声音传话。',
      invent: '决定在哪里会合、谁发暗号，也可以把迈步变成轻跳。',
      notice: '他想出暗号，等同伴准备好才出发。', alt: '父子在平地的岛形标记旁，孩子指定下一个落脚点', ref: 'balance'
    }, {
      id: 'freeze', name: '音乐木头人', group: 'rhythm', places: ['home','out'], quiet: false, gear: '可用哼歌代替音箱',
      hook: '音乐一停，变成你想当的动物。', invite: '想让我在停下的时候变成什么？',
      start: '你哼一段他喜欢的旋律，你们自由摆动。旋律停下时，各自停在一个舒服的造型上。',
      easier: '先只动手臂，听到安静就把手放好。',
      invent: '他可以负责哼歌、挑动物或给自己的动作命名。',
      notice: '他说得出自己刚才变成了什么，就是一段好手记。', alt: '家中父子在音乐停下时定格成自己选的姿势', ref: 'lead'
    }, {
      id: 'mirror', name: '镜子里的爸爸', group: 'rhythm', places: ['home','out'], quiet: true, gear: '',
      hook: '他怎样动，爸爸这面镜子就怎样动。', invite: '来试试，我这面镜子会跟上你吗？',
      start: '你们面对面站好。他先选一个慢动作，你像镜子一样跟着做，再由他决定什么时候换。',
      easier: '坐着也能玩，只用一只手打个招呼。',
      invent: '镜子可以变慢、变大，或者突然定格。让他来设定。',
      notice: '留意哪个动作让他想带着你再来一遍。', alt: '父子面对面展开手臂，互相模仿身体姿势', ref: 'lead'
    }, {
      id: 'drum', name: '脚印鼓手', group: 'rhythm', places: ['home','out'], quiet: false, gear: '空盒或自己的手掌',
      hook: '听见一个鼓点，给地面留个脚印。', invite: '你来编一段节奏，让我踩给你看。',
      start: '你用手在空盒上轻敲，孩子随声音在地上踏步。节奏慢下来时，也把脚步放慢。',
      easier: '先坐着用脚尖点地，跟上一个声音就可以换人敲。',
      invent: '请他发明长音和短音各配什么动作，你来试他的谱子。',
      notice: '他在想办法把声音变成身体的动作。', alt: '父亲用手敲空盒，孩子随着声音踩向地面的脚印', ref: 'ssg'
    }, {
      id: 'book', name: '把绘本演出来', group: 'rhythm', places: ['home','out'], quiet: true, gear: '喜欢的绘本或熟悉的故事',
      hook: '挑一个书里的人物，站起来演给爸爸看。', invite: '这页里的小鸟怎么飞？你当导演。',
      start: '选他喜欢的一页，让他用一个动作把角色演出来。你模仿他的动作，然后一起演下一段。',
      easier: '先坐着做一个手势，让爸爸来猜。',
      invent: '如果故事往另一边走，角色会怎么动？新结局由他写。',
      notice: '记下他给故事加的动作或原话。', alt: '翻开的书上有一只鸟，父子展开手臂学鸟飞', ref: 'lead'
    }
  ]
};
