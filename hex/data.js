// 渡鴉下潛（肉鴿卡牌試作）—— 資料
(function(root){
const I='../../raven-guild/images/';
const sk=n=>I+'sk_'+n+'.webp',m=n=>I+'m_'+n+'.webp';
const DATA={
 version:'v0.8',
 title:'渡鴉下潛',
 img:I,
 // ── 角色
 chars:{
  yy:{name:'語嫣',title:'織命的長女',hp:80,img:I+'y_base.webp',ex:{smug:I+'y_ex_smug.webp',laugh:I+'y_ex_laugh.webp',pout:I+'y_ex_pout.webp',annoy:I+'y_ex_annoy.webp'},
   relic:'thread',deck:['strike','strike','strike','strike','guard','guard','guard','guard','yy_bind','yy_reel'],
   desc:'把「厄契」纏在敵人身上：牠們每次出手都會被反噬，最後再一口氣裁定。',
   line:'呵呵……下面的東西，可沒有一個懂得守約呢。'},
  cl:{name:'克勞德',title:'渡鴉的女兒・守燈人',hp:76,img:null,
   relic:'quill',deck:['strike','strike','strike','strike','guard','guard','guard','guard','cl_pen','cl_stroke'],
   desc:'一邊守一邊記下「墨」，等時機到了，一筆落下。',
   line:'燈我提著。姐姐，別走太快。'}
 },
 // ── 狀態
 status:{
  vuln:{name:'易傷',ic:I+'st_vuln.webp',desc:'受到的傷害增加 50%。每回合減 1。'},
  weak:{name:'虛弱',ic:I+'st_weak.webp',desc:'造成的傷害減少 25%。每回合減 1。'},
  str:{name:'力量',ic:I+'st_might.webp',desc:'每次攻擊多造成這麼多傷害。'},
  dex:{name:'敏捷',ic:I+'st_wall.webp',desc:'每次獲得格擋多這麼多。'},
  pact:{name:'厄契',ic:I+'st_curse.webp',desc:'出手攻擊時，自己受到等同層數的反噬。不會自己消失。'},
  link:{name:'命線',ic:I+'st_link.webp',desc:'被命線連著的敵人受到傷害時，其他連著的敵人也受到一半。'},
  ink:{name:'墨',ic:I+'st_echo.webp',desc:'克勞德記下的墨。「落筆」類的牌會用掉全部的墨，變得更強。'},
  regen:{name:'回生',ic:I+'st_regen.webp',desc:'回合結束時回復生命，每回合減 1。'}
 },
 powers:{
  pactTurn:'每回合開始，所有敵人獲得 {n} 層厄契。',
  pactThorn:'被攻擊時，攻擊你的敵人獲得 {n} 層厄契。',
  inkTurn:'每回合開始，獲得 {n} 墨。',
  inkBlock:'每次獲得墨，同時獲得 {n} 格擋。',
  drawTurn:'每回合多抽 {n} 張牌。',
  strTurn:'每回合開始，獲得 {n} 力量。',
  linkFull:'命線分攤的傷害從一半變成全額。',
  keepInk:'回合結束時，每有 1 張保留在手上的牌，獲得 {n} 墨。'
 },
 // ── 卡牌：c 費用、t 種類（a 攻擊 s 技能 p 能力 x 詛咒）、r 稀有度（0 起始 1 普通 2 罕見 3 稀有）
 // fx：['d',傷害,段數,加成] ['da',全體傷害,段數,加成] ['b',格擋] ['dr',抽] ['en',能量] ['st',狀態,層數,對象 t/a/s]
 //     ['pa',厄契,對象 t/a] ['ink',墨] ['jd',每層傷害] ['lk'] ['hp',回血] ['cp'] ['pw',能力,層數] ['px2'] ['rw'] ['ep',能量]
 cards:{
  strike:{n:'打擊',c:1,t:'a',r:0,ch:'any',img:sk('bash'),fx:[['d',6]],u:{fx:[['d',9]]}},
  guard:{n:'防禦',c:1,t:'s',r:0,ch:'any',img:sk('guardup'),fx:[['b',5]],u:{fx:[['b',8]]}},
  // 語嫣
  yy_bind:{n:'緋線・訂契',c:1,t:'s',r:0,ch:'yy',img:sk('tie'),fx:[['pa',3,'t']],u:{fx:[['pa',5,'t']]}},
  yy_reel:{n:'收線',c:1,t:'a',r:0,ch:'yy',img:sk('garrote'),fx:[['d',4,1,'pact2']],u:{fx:[['d',6,1,'pact2']]}},
  yy_touch:{n:'輕撫',c:0,t:'a',r:1,ch:'yy',img:sk('needle'),fx:[['d',3],['pa',1,'t']],u:{fx:[['d',5],['pa',2,'t']]}},
  yy_tangle:{n:'命線纏繞',c:1,t:'s',r:1,ch:'yy',img:sk('web'),fx:[['lk'],['pa',2,'t']],u:{fx:[['lk'],['pa',3,'t']]}},
  yy_penalty:{n:'違約金',c:1,t:'a',r:1,ch:'yy',img:sk('snap'),fx:[['d',8],['ep',1]],u:{fx:[['d',11],['ep',1]]}},
  yy_cape:{n:'黑羽披肩',c:1,t:'s',r:1,ch:'yy',img:sk('cover'),fx:[['b',7],['pa',1,'a']],u:{fx:[['b',10],['pa',1,'a']]}},
  yy_fate:{n:'逆命收束',c:2,t:'a',r:1,ch:'yy',img:sk('chain'),fx:[['da',7],['pa',1,'a']],u:{fx:[['da',10],['pa',1,'a']]}},
  yy_hehe:{n:'呵呵',c:1,t:'s',r:1,ch:'yy',img:sk('hex'),fx:[['st','weak',2,'t'],['st','vuln',2,'t']],u:{c:0}},
  yy_wager:{n:'賭約',c:1,t:'s',r:1,ch:'yy',img:sk('doomsay'),fx:[['dr',2],['pa',1,'t']],u:{fx:[['dr',3],['pa',1,'t']]}},
  yy_knot:{n:'打成死結',c:1,t:'a',r:1,ch:'yy',img:sk('constrict'),fx:[['d',4,2],['pa',1,'t']],u:{fx:[['d',5,2],['pa',2,'t']]}},
  yy_sly:{n:'狡黠',c:0,t:'s',r:1,ch:'yy',img:sk('shift'),fx:[['dr',1],['pa',1,'t']],u:{fx:[['dr',2],['pa',1,'t']]}},
  yy_cut:{n:'拆線',c:2,t:'a',r:2,ch:'yy',img:sk('sunder'),fx:[['jd',4]],u:{fx:[['jd',6]]}},
  yy_wheel:{n:'血色命輪',c:2,t:'p',r:2,ch:'yy',img:sk('deathwish'),fx:[['pw','pactTurn',1]],u:{c:1}},
  yy_thread:{n:'不肯斷裂的線',c:1,t:'p',r:2,ch:'yy',img:sk('skyweb'),fx:[['pw','pactThorn',2]],u:{fx:[['pw','pactThorn',3]]}},
  yy_veil:{n:'緋紅帷幕',c:2,t:'s',r:2,ch:'yy',img:sk('barrier'),fx:[['b',12],['pa',2,'a']],u:{fx:[['b',16],['pa',2,'a']]}},
  yy_thousand:{n:'千絲',c:1,t:'a',r:2,ch:'yy',img:sk('volley'),fx:[['d',2,4]],u:{fx:[['d',3,4]]}},
  yy_net:{n:'緋線收網',c:2,t:'a',r:2,ch:'yy',img:sk('snare'),fx:[['da',4,1,'pact1']],u:{fx:[['da',6,1,'pact1']]}},
  yy_pride:{n:'傲慢',c:1,t:'s',r:2,ch:'yy',img:sk('wrath'),ex:1,fx:[['st','str',2,'s']],u:{fx:[['st','str',3,'s']]}},
  yy_judge:{n:'惡緣裁定',c:3,t:'a',r:3,ch:'yy',img:sk('deathmark'),fx:[['jd',7],['st','vuln',2,'t']],u:{fx:[['jd',9],['st','vuln',2,'t']]}},
  yy_backlash:{n:'契約反噬',c:1,t:'s',r:3,ch:'yy',img:sk('rotcurse'),ex:1,fx:[['px2']],u:{c:0}},
  yy_queen:{n:'那是你的選擇？',c:2,t:'p',r:3,ch:'yy',img:sk('callname'),fx:[['pw','pactTurn',2]],u:{c:1},lock:'yy_lock1'},
  // 克勞德
  cl_pen:{n:'起筆',c:1,t:'a',r:0,ch:'cl',img:sk('thrust'),fx:[['d',6],['ink',1]],u:{fx:[['d',8],['ink',2]]}},
  cl_note:{n:'筆記',c:1,t:'s',r:1,ch:'cl',img:sk('incense'),fx:[['dr',1],['ink',1]],u:{fx:[['dr',2],['ink',1]]}},
  cl_stroke:{n:'落筆',c:1,t:'a',r:0,ch:'cl',img:sk('pierce'),fx:[['d',4,1,'ink3']],u:{fx:[['d',4,1,'ink4']]}},
  cl_grind:{n:'研墨',c:1,t:'s',r:1,ch:'cl',img:sk('tea'),fx:[['ink',3]],u:{fx:[['ink',4]]}},
  cl_mark:{n:'註記',c:1,t:'s',r:1,ch:'cl',img:sk('preymark'),fx:[['st','vuln',2,'t'],['ink',1]],u:{fx:[['st','vuln',3,'t'],['ink',1]]}},
  cl_reason:{n:'推演',c:1,t:'s',r:1,ch:'cl',img:sk('lull'),fx:[['dr',2],['b',3]],u:{fx:[['dr',3],['b',3]]}},
  cl_watch:{n:'燈下守夜',c:1,t:'s',r:1,ch:'cl',img:sk('stand'),fx:[['b',7],['ink',1]],u:{fx:[['b',10],['ink',1]]}},
  cl_reply:{n:'溫柔的反駁',c:1,t:'a',r:1,ch:'cl',img:sk('silver'),fx:[['d',7],['st','weak',1,'t']],u:{fx:[['d',10],['st','weak',2,'t']]}},
  cl_drop:{n:'墨痕',c:0,t:'a',r:1,ch:'cl',img:sk('shiv'),fx:[['d',4],['ink',1]],u:{fx:[['d',6],['ink',1]]}},
  cl_margin:{n:'頁緣',c:1,t:'s',r:1,ch:'cl',img:sk('brace'),fx:[['b',4],['ink',2]],u:{fx:[['b',6],['ink',2]]}},
  cl_proof:{n:'校對',c:1,t:'s',r:1,ch:'cl',img:sk('purify'),fx:[['b',5],['dr',1]],u:{fx:[['b',8],['dr',1]]}},
  cl_copy:{n:'抄寫',c:1,t:'s',r:2,ch:'cl',img:sk('phantom'),fx:[['cp']],u:{c:0}},
  cl_rain:{n:'墨雨',c:2,t:'a',r:2,ch:'cl',img:sk('rain'),fx:[['da',3,3]],u:{fx:[['da',4,3]]}},
  cl_lamp:{n:'燈火',c:1,t:'p',r:2,ch:'cl',img:sk('flare'),fx:[['pw','inkTurn',1]],u:{c:0}},
  cl_keeper:{n:'守燈人',c:2,t:'p',r:2,ch:'cl',img:sk('bulwark'),fx:[['pw','inkBlock',2]],u:{fx:[['pw','inkBlock',3]]}},
  cl_erase:{n:'一筆勾銷',c:2,t:'a',r:2,ch:'cl',img:sk('cleave'),fx:[['d',14]],u:{fx:[['d',19]]}},
  cl_rewrite:{n:'重寫',c:1,t:'s',r:2,ch:'cl',img:sk('vanish'),fx:[['rw']],u:{c:0}},
  cl_remember:{n:'記住',c:0,t:'s',r:2,ch:'cl',img:sk('oath'),keep:1,fx:[['b',4],['ink',1]],u:{fx:[['b',7],['ink',1]]}},
  cl_sign:{n:'落款',c:3,t:'a',r:3,ch:'cl',img:sk('impale'),fx:[['d',6,1,'ink5']],u:{fx:[['d',6,1,'ink7']]}},
  cl_long:{n:'長篇',c:2,t:'p',r:3,ch:'cl',img:sk('nightfall'),fx:[['pw','drawTurn',1]],u:{c:1}},
  cl_home:{n:'一起回家',c:2,t:'s',r:3,ch:'cl',img:sk('mend'),ex:1,fx:[['hp',7],['b',8]],u:{fx:[['hp',10],['b',10]]}},
  cl_dad:{n:'爸爸教的',c:1,t:'p',r:3,ch:'cl',img:sk('rally'),fx:[['pw','strTurn',1]],u:{c:0},lock:'cl_lock1'},
  // 共用
  n_bandage:{n:'包紮',c:1,t:'s',r:2,ch:'any',img:sk('elixir'),ex:1,fx:[['hp',5]],u:{fx:[['hp',8]]}},
  n_wing:{n:'渡鴉之翼',c:0,t:'s',r:2,ch:'any',img:sk('hawk'),ex:1,fx:[['dr',2]],u:{fx:[['dr',3]]}},
  n_lantern:{n:'舊提燈',c:1,t:'s',r:1,ch:'any',img:sk('incense'),fx:[['b',4],['en',1]],ex:1,u:{fx:[['b',7],['en',1]]}},
  n_sweep:{n:'橫掃',c:1,t:'a',r:1,ch:'any',img:sk('sweep'),fx:[['da',5]],u:{fx:[['da',8]]}},
  // 詛咒
  x_regret:{n:'沉重的回憶',c:-1,t:'x',r:0,ch:'none',img:sk('wither'),fx:[]}
 },
 // ── 遺物
 relics:{
  thread:{n:'緋線團',ic:I+'i_seal.webp',d:'每場戰鬥開始，所有敵人獲得 1 層厄契。',start:1},
  quill:{n:'渡鴉羽筆',ic:I+'eq_lantern.webp',d:'每回合開始，獲得 1 墨。',start:1},
  lantern:{n:'舊提燈',ic:I+'i_torch.webp',d:'每場戰鬥第一回合，多 1 點能量。'},
  feather:{n:'渡鴉羽',ic:I+'i_moss.webp',d:'每場戰鬥第一回合，多抽 2 張。'},
  bandage:{n:'乾淨的繃帶',ic:I+'i_leaf.webp',d:'戰鬥勝利後回復 6 點生命。'},
  whet:{n:'磨刀石',ic:I+'i_ingot.webp',d:'每場戰鬥開始，獲得 1 力量。'},
  shell:{n:'龜殼',ic:I+'i_wood.webp',d:'每場戰鬥開始，獲得 10 格擋。'},
  bell:{n:'骨鈴',ic:I+'i_coin.webp',d:'每回合打出第 3 張攻擊牌時，抽 1 張。'},
  mirror:{n:'碎鏡',ic:I+'i_oil.webp',d:'第一次生命歸零時，改為回復 30% 生命。（一次）'},
  teapot:{n:'舊茶壺',ic:I+'food_bread.webp',d:'在營火休息時，多回復 15 點生命。'},
  mask:{n:'骨面具',ic:I+'ev_stele.webp',d:'每場戰鬥開始，所有敵人獲得 1 層易傷。'},
  candle:{n:'白蠟燭',ic:I+'i_torch.webp',d:'回合結束時，每剩 1 點能量獲得 4 格擋。'},
  map:{n:'舊地圖',ic:I+'i_wood.webp',d:'進入事件時獲得 15 枚渡鴉幣。'},
  vial:{n:'苦藥瓶',ic:I+'i_leaf.webp',d:'撿到時最大生命 +10。'},
  purse:{n:'錢袋',ic:I+'i_coin.webp',d:'戰鬥獲得的渡鴉幣多 50%。'},
  inkpot:{n:'墨瓶',ic:I+'i_oil.webp',d:'每場戰鬥開始，獲得 3 墨。',ch:'cl'},
  redring:{n:'緋紅指環',ic:I+'i_seal.webp',d:'厄契的反噬傷害多 1。',ch:'yy'},
  anchor:{n:'錨',ic:I+'i_ingot.webp',d:'每場戰鬥第一回合結束時，保留格擋到下一回合。'}
 },
 // ── 敵人：mv 招式（a 攻擊 b 格擋 s 強化自己 w 削弱你），w 權重
 enemies:{
  stampbug:{n:'退件印章蟲',img:m('stampbug'),hp:[11,15],mv:[{n:'蓋章',a:6,w:3},{n:'退回',w:1,st:['weak',1]},{n:'縮殼',b:6,w:1}]},
  deadletters:{n:'死信群',img:m('deadletters'),hp:[16,20],mv:[{n:'撲面',a:3,h:2,w:3},{n:'堆積',b:5,s:['str',1],w:1}]},
  returndog:{n:'巡廊退件犬',img:m('returndog'),hp:[18,22],mv:[{n:'撕咬',a:8,w:3},{n:'吠叫',w:1,st:['vuln',1]}]},
  lackcrow:{n:'缺字紙鴉',img:m('lackcrow'),hp:[10,13],mv:[{n:'啄',a:4,h:2,w:2},{n:'盤旋',b:4,w:1}]},
  dutyghost:{n:'停擺的值班員',img:m('dutyghost'),hp:[22,26],mv:[{n:'敲鐘',a:10,w:2},{n:'打卡',b:8,w:1},{n:'催促',s:['str',2],w:1}]},
  moth:{n:'書霧螟',img:m('moth'),hp:[14,17],mv:[{n:'鱗粉',w:2,st:['weak',2]},{n:'撲火',a:7,w:2}]},
  mailbox:{n:'倒懸郵筒怪',img:m('mailbox'),hp:[40,44],elite:1,mv:[{n:'吞信',a:13,w:2},{n:'吐出',a:5,h:3,w:2},{n:'關口',b:12,s:['str',2],w:1}]},
  scribe:{n:'無名抄行者',img:m('scribe'),hp:[44,48],elite:1,mv:[{n:'抄下你',w:1,st:['vuln',2],b:8},{n:'劃掉',a:16,w:2},{n:'逐字',a:4,h:4,w:2}]},
  paper:{n:'紙紮人',img:m('paper'),hp:[20,24],mv:[{n:'紙刃',a:9,w:3},{n:'糊上',b:8,w:1}]},
  paperdoll:{n:'紙偶',img:m('paperdoll'),hp:[14,18],mv:[{n:'牽絲',a:5,h:2,w:2},{n:'笑',w:1,st:['weak',2]}]},
  talis:{n:'符屍',img:m('talis'),hp:[28,32],mv:[{n:'跳撲',a:12,w:2},{n:'貼符',w:1,st:['vuln',2]},{n:'僵立',b:10,w:1}]},
  foxlamp:{n:'狐面提燈者',img:m('foxlamp'),hp:[24,28],mv:[{n:'狐火',a:7,h:2,w:2},{n:'引路',s:['str',2],b:6,w:1}]},
  widow:{n:'燈芯寡婦',img:m('widow'),hp:[26,30],mv:[{n:'燭淚',a:11,w:2},{n:'剪芯',w:1,st:['weak',2],a:5}]},
  hyena:{n:'漏頁鬣犬',img:m('hyena'),hp:[22,26],mv:[{n:'撕頁',a:6,h:2,w:3},{n:'嚎',s:['str',2],w:1}]},
  wgod:{n:'游神',img:m('wgod'),hp:[62,68],elite:1,mv:[{n:'巡境',a:18,w:2},{n:'香火',b:15,s:['str',3],w:1},{n:'鑼鼓',a:6,h:3,w:2}]},
  chorus:{n:'舊戶籍合唱體',img:m('chorus'),hp:[58,64],elite:1,mv:[{n:'齊唱',a:8,h:2,w:2},{n:'點名',w:1,st:['vuln',2],a:8},{n:'和聲',b:14,w:1}]},
  rustrat:{n:'鏽齒鼠群',img:m('rustrat'),hp:[26,30],mv:[{n:'啃',a:5,h:3,w:3},{n:'鑽洞',b:9,w:1}]},
  rustlung:{n:'鏽肺',img:m('rustlung'),hp:[34,38],mv:[{n:'鏽塵',w:1,st:['weak',2],a:6},{n:'吸氣',s:['str',3],w:1},{n:'噴吐',a:14,w:2}]},
  leech:{n:'管線水蛭',img:m('leech'),hp:[30,34],mv:[{n:'吸附',a:10,w:2,heal:5},{n:'蠕動',b:10,w:1}]},
  whiteminer:{n:'白鐵礦工的影子',img:m('whiteminer'),hp:[38,42],mv:[{n:'揮鎬',a:15,w:2},{n:'挖掘',b:12,w:1},{n:'鐵屑',a:5,h:2,st:['vuln',1],w:1}]},
  minecart:{n:'載著人的礦車',img:m('minecart'),hp:[40,46],mv:[{n:'衝撞',a:15,w:1},{n:'加速',s:['str',2],b:6,w:2}]},
  valvehound:{n:'氣閥獵犬',img:m('valvehound'),hp:[32,36],mv:[{n:'蒸氣咬',a:8,h:2,w:3},{n:'洩壓',b:10,w:1}]},
  skel:{n:'鎖鏈骷髏守衛',img:m('skel'),hp:[80,86],elite:1,mv:[{n:'鎖鏈',a:10,h:2,w:2},{n:'守門',b:18,s:['str',2],w:1},{n:'絞',a:22,w:1}]},
  giant:{n:'燭苔巨人',img:m('giant'),hp:[92,100],elite:1,mv:[{n:'踩',a:24,w:2},{n:'苔生',b:16,heal:10,w:1},{n:'燭淚',w:1,st:['weak',2],a:10}]},
  // 首領
  wusign:{n:'退件執事・無簽',img:I+'b_wusign.webp',hp:[80,80],boss:1,seq:1,mv:[{n:'審件',w:1,st:['vuln',1],b:10},{n:'蓋退件章',a:16,w:1},{n:'整疊退回',a:6,h:3,w:1},{n:'不予受理',s:['str',2],b:12,w:1}],line:'沒有簽名的東西……全部退回。包括你。'},
  qianhao:{n:'總分揀機・千號',img:I+'b_qianhao.webp',hp:[115,115],boss:1,seq:1,mv:[{n:'分揀',a:6,h:3,w:1},{n:'加壓',s:['str',2],b:15,w:1},{n:'錯投',w:1,st:['weak',2],a:10},{n:'粉碎',a:20,w:1}],line:'編號不符。編號不符。編號——不符。'},
  deepdrill:{n:'掘進機・深挖',img:I+'b_deepdrill.webp',hp:[160,160],boss:1,seq:1,mv:[{n:'鑽頭啟動',s:['str',3],b:20,w:1},{n:'鑽穿',a:14,h:2,w:1},{n:'碎石',a:7,h:3,st:['vuln',1],w:1},{n:'過熱',b:25,w:1},{n:'深挖',a:30,w:1}],line:'（鑽頭的聲音越來越近。它不會停，它從來沒有停過。）'}
 },
 layers:[
  {n:'第一層・退件局',hpMul:1.4,atkMul:1.1,bg:I+'bg_post.webp',fights:[['stampbug','lackcrow'],['deadletters'],['returndog'],['moth','lackcrow'],['dutyghost'],['stampbug','moth']],elites:['mailbox','scribe'],boss:'wusign'},
  {n:'第二層・紙紮巷',hpMul:1.15,atkMul:1,bg:I+'bg_houses.webp',fights:[['paper','paperdoll'],['talis'],['foxlamp'],['widow','paperdoll'],['hyena','hyena'],['paper','widow']],elites:['wgod','chorus'],boss:'qianhao'},
  {n:'第三層・白鐵礦坑',hpMul:1,atkMul:1,bg:I+'bg_mine.webp',fights:[['rustrat','leech'],['rustlung','rustrat'],['whiteminer'],['minecart'],['valvehound','leech'],['whiteminer','valvehound']],elites:['skel','giant'],boss:'deepdrill'}
 ],
 map:{rows:6,cols:3,w:{fight:46,event:22,elite:11,shop:9,chest:6,rest:10}},
 gold:{fight:[12,18],elite:[28,36],boss:[60,70]},
 shop:{card:[48,75,140],remove:75,relic:[150,190]},
 // ── 事件
 events:[
  {id:'letter',n:'沒有收件人的信',img:I+'bg_sort.webp',txt:'一整面牆的信格，每一格都塞滿了沒寄出去的信。有一封的封口還是溫的。',opts:[
    {t:'拆開來看',r:[{gold:30},{card:'x_regret'}],d:'得到 30 渡鴉幣，牌組加入一張「沉重的回憶」'},
    {t:'放回去',r:[{heal:8}],d:'回復 8 點生命'}]},
  {id:'lamp',n:'熄掉的路燈',img:I+'bg_station.webp',txt:'路燈下站著一個看不清臉的人，他說他在等燈亮。',opts:[
    {t:'幫他點燈（失去 6 生命）',r:[{hurt:6},{relicRandom:1}],d:'失去 6 生命，得到一件遺物'},
    {t:'陪他等一下',r:[{upgradeRandom:1}],d:'隨機升級一張牌'},
    {t:'離開',r:[],d:'什麼都沒發生'}]},
  {id:'market',n:'夜市的攤子',img:I+'bg_village.webp',txt:'攤主沒有臉，攤子上擺著一排卡片，背面都畫著渡鴉。',opts:[
    {t:'買一張（40 幣）',r:[{gold:-40},{cardPick:1}],d:'花 40 渡鴉幣，從三張牌選一張',need:{gold:40}},
    {t:'賣掉一張牌',r:[{removePick:1},{gold:25}],d:'移除一張牌，得到 25 渡鴉幣'},
    {t:'只是看看',r:[],d:'離開'}]},
  {id:'well',n:'寫滿名字的井',img:I+'bg_namewall.webp',txt:'井壁刻滿了名字，有的被劃掉了。井底有光。',opts:[
    {t:'把手伸進去',r:[{maxhp:6},{hurt:4}],d:'最大生命 +6，失去 4 生命'},
    {t:'在井邊休息',r:[{heal:14}],d:'回復 14 點生命'}]},
  {id:'mirror',n:'走廊盡頭的鏡子',img:I+'bg_memory.webp',txt:'鏡子裡的人跟你一樣，只是笑得慢了半拍。',opts:[
    {t:'跟鏡子交換一張牌',r:[{transformPick:1}],d:'選一張牌，換成隨機的另一張'},
    {t:'敲碎它（失去 8 生命）',r:[{hurt:8},{gold:55}],d:'失去 8 生命，得到 55 渡鴉幣'}]},
  {id:'tea',n:'還溫著的茶',img:I+'bg_inn.webp',txt:'空無一人的客棧，桌上兩杯茶還冒著熱氣，好像剛剛有人坐在這裡。',opts:[
    {t:'坐下來喝一口',r:[{heal:10},{upgradeRandom:1}],d:'回復 10 生命，隨機升級一張牌'},
    {t:'把茶留給主人',r:[{gold:20}],d:'桌下有人留了 20 渡鴉幣'}]},
  {id:'archive',n:'被撕掉的檔案',img:I+'bg_library.webp',txt:'書架上一排檔案都缺了同一頁。地上有半張紙，寫著你看不懂的字。',opts:[
    {t:'撿起來收好',r:[{cardRare:1}],d:'得到一張稀有的牌'},
    {t:'燒掉',r:[{removePick:1}],d:'移除一張牌'}]},
  {id:'shrine',n:'沒有神像的祠',img:I+'bg_stele.webp',txt:'祠裡只剩一個空的底座，香爐裡的灰是新的。',opts:[
    {t:'上一炷香（25 幣）',r:[{gold:-25},{maxhp:8},{heal:8}],d:'最大生命 +8，回復 8 生命',need:{gold:25}},
    {t:'拿走香爐裡的錢',r:[{gold:35},{card:'x_regret'}],d:'得到 35 渡鴉幣，牌組加入「沉重的回憶」'}]}
 ],
 // ── 對話
 talk:{
  start:{
   yy:[['yy','smug','呵呵……下面的東西，可沒有一個懂得守約呢。'],['cl',null,'姐姐，燈給妳。我在上面等妳。'],['yy','laugh','等什麼？我很快就回來♡']],
   cl:[['cl',null,'燈我提著。這次換我下去。'],['yy','pout','妹妹一個人？……哼，記得把線帶著。'],['cl',null,'嗯。爸爸給的羽筆也帶了。']]},
  boss:{
   wusign:{yy:[['yy','smug','沒簽名就退回？那我簽給你看——用你的命線。']],cl:[['cl',null,'我會一筆一筆寫清楚，誰才是要被退回的。']]},
   qianhao:{yy:[['yy','annoy','吵死了。編號？我來幫你編。']],cl:[['cl',null,'不管你把多少東西分錯，我都會把它們找回來。']]},
   deepdrill:{yy:[['yy','smug','你挖得再深，也挖不斷我的線喔。']],cl:[['cl',null,'下面已經沒有路了。所以，就到這裡。']]}},
  win:{yy:[['yy','laugh','看吧，很快就回來了♡'],['cl',null,'姐姐！……歡迎回來。']],cl:[['cl',null,'我回來了。燈還亮著。'],['yy','smug','哼，妹妹也挺能幹的嘛。']]},
  lose:{yy:[['yy','pout','……今天的線，打結了。下次。'],['cl',null,'姐姐回來就好。']],cl:[['cl',null,'對不起，我還不夠強……'],['yy','annoy','笨蛋。誰要妳道歉了？明天再一起下去。']]}
 },
 // ── 永久進度：回憶
 memory:{perFloor:2,perElite:5,perBoss:15,win:30},
 unlocks:[
  {id:'yy_lock1',at:40,t:'語嫣的新牌「那是你的選擇？」加入牌池'},
  {id:'cl_lock1',at:40,t:'克勞德的新牌「爸爸教的」加入牌池'},
  {id:'story1',at:20,t:'回憶之書：〈提燈的人〉'},
  {id:'story2',at:80,t:'回憶之書：〈兩根線〉'},
  {id:'story3',at:150,t:'回憶之書：〈渡鴉的羽筆〉'},
  {id:'relic2',at:110,t:'新遺物「錨」可以撿到了'}
 ],
 stories:{
  story1:{n:'提燈的人',lines:[['cl',null,'第一次下去的時候，我什麼都看不見。'],['yy','smug','所以妳就一直拉著我的袖子。'],['cl',null,'……那是燈太暗了。'],['yy','laugh','呵呵，是是是。']]},
  story2:{n:'兩根線',lines:[['yy',null,'我的線是紅的。纏上去，就解不開。'],['cl',null,'我的是墨。寫下去，就擦不掉。'],['yy','smug','那我們兩個加起來，誰都跑不了呢。'],['cl',null,'嗯。誰都不會走丟。']]},
  story3:{n:'渡鴉的羽筆',lines:[['cl',null,'這支筆，是爸爸給我的。'],['yy','pout','我也有啊，這團線。'],['cl',null,'爸爸說，線用來牽住重要的人，筆用來記住他們。'],['yy','smug','……哼。那他一定偏心妳。'],['cl',null,'他說他最疼我們兩個。']]}
 },
 achievements:[
  {id:'first_win',n:'第一場勝利',d:'打贏第一場戰鬥'},
  {id:'first_elite',n:'不只是雜魚',d:'打贏一隻菁英'},
  {id:'boss1',n:'退件無效',d:'打倒退件執事・無簽'},
  {id:'boss2',n:'編號正確',d:'打倒總分揀機・千號'},
  {id:'boss3',n:'挖到盡頭',d:'打倒掘進機・深挖'},
  {id:'win_yy',n:'線的盡頭',d:'用語嫣走完三層'},
  {id:'win_cl',n:'燈還亮著',d:'用克勞德走完三層'},
  {id:'pact20',n:'違約的代價',d:'讓一個敵人身上累積 20 層厄契'},
  {id:'ink10',n:'墨水瓶',d:'一次攢到 10 墨'},
  {id:'big30',n:'一筆落下',d:'一張牌造成 30 點以上傷害'},
  {id:'deck25',n:'厚厚的牌組',d:'牌組達到 25 張'},
  {id:'relic6',n:'收藏家',d:'一局拿到 6 件遺物'},
  {id:'nohit',n:'毫髮無傷',d:'一場戰鬥沒有受到傷害'},
  {id:'gold200',n:'小有積蓄',d:'同時擁有 200 渡鴉幣'},
  {id:'codex20',n:'圖鑑',d:'圖鑑記錄 20 種敵人'}
 ]
};

// ── v0.2：Grok 團隊（規則大師、文字劇情大師）的交件，合併進來
Object.assign(DATA.cards,{"yy_redline": {"n": "紅線牽引", "c": 1, "t": "a", "r": 1, "ch": "yy", "img": "../../raven-guild/images/sk_tie.webp", "fx": [["lk"], ["d", 6]], "u": {"fx": [["lk"], ["d", 9]]}}, "yy_tug": {"n": "一拽", "c": 0, "t": "a", "r": 1, "ch": "yy", "img": "../../raven-guild/images/sk_garrote.webp", "fx": [["d", 3, 1, "pact1"]], "u": {"fx": [["d", 5, 1, "pact1"]]}}, "yy_tease": {"n": "逗弄", "c": 1, "t": "s", "r": 1, "ch": "yy", "img": "../../raven-guild/images/sk_hex.webp", "fx": [["st", "weak", 1, "a"], ["pa", 1, "a"]], "u": {"fx": [["st", "weak", 2, "a"], ["pa", 1, "a"]]}}, "yy_bow": {"n": "打個蝴蝶結", "c": 1, "t": "s", "r": 1, "ch": "yy", "img": "../../raven-guild/images/sk_web.webp", "fx": [["b", 6], ["lk"]], "u": {"fx": [["b", 9], ["lk"]]}}, "yy_spindle": {"n": "紡錘", "c": 2, "t": "a", "r": 2, "ch": "yy", "img": "../../raven-guild/images/sk_snare.webp", "fx": [["lk"], ["da", 4, 1, "pact1"]], "u": {"fx": [["lk"], ["da", 6, 1, "pact1"]]}}, "yy_fine": {"n": "滯納金", "c": 1, "t": "a", "r": 2, "ch": "yy", "img": "../../raven-guild/images/sk_snap.webp", "fx": [["d", 5], ["ep", 1], ["dr", 1]], "u": {"fx": [["d", 8], ["ep", 1], ["dr", 1]]}}, "yy_collect": {"n": "連本帶利", "c": 2, "t": "a", "r": 2, "ch": "yy", "img": "../../raven-guild/images/sk_sunder.webp", "fx": [["jd", 3], ["pa", 3, "t"]], "u": {"fx": [["jd", 4], ["pa", 3, "t"]]}}, "yy_dear": {"n": "妹妹別怕", "c": 1, "t": "s", "r": 2, "ch": "yy", "img": "../../raven-guild/images/sk_cover.webp", "fx": [["b", 8], ["dr", 1]], "u": {"fx": [["b", 11], ["dr", 1]]}}, "yy_redfate": {"n": "赤繩定命", "c": 2, "t": "p", "r": 3, "ch": "yy", "img": "../../raven-guild/images/sk_chain.webp", "fx": [["pw", "linkFull", 1]], "u": {"c": 1}}, "cl_bookmark": {"n": "書籤", "c": 0, "t": "s", "r": 1, "ch": "cl", "img": "../../raven-guild/images/sk_oath.webp", "keep": 1, "fx": [["ink", 1]], "u": {"fx": [["ink", 2]]}}, "cl_draft": {"n": "草稿", "c": 1, "t": "a", "r": 1, "ch": "cl", "img": "../../raven-guild/images/sk_thrust.webp", "keep": 1, "fx": [["d", 7]], "u": {"fx": [["d", 10]]}}, "cl_shelter": {"n": "屋簷", "c": 1, "t": "s", "r": 1, "ch": "cl", "img": "../../raven-guild/images/sk_brace.webp", "keep": 1, "fx": [["b", 6]], "u": {"fx": [["b", 9]]}}, "cl_reread": {"n": "重讀", "c": 0, "t": "s", "r": 1, "ch": "cl", "img": "../../raven-guild/images/sk_lull.webp", "keep": 1, "fx": [["dr", 1]], "u": {"fx": [["dr", 2]]}}, "cl_hold": {"n": "屏息", "c": 1, "t": "s", "r": 2, "ch": "cl", "img": "../../raven-guild/images/sk_stand.webp", "fx": [["b", 5], ["ka"]], "u": {"fx": [["b", 8], ["ka"]]}}, "cl_patience": {"n": "慢慢寫", "c": 1, "t": "p", "r": 2, "ch": "cl", "img": "../../raven-guild/images/sk_incense.webp", "fx": [["pw", "keepInk", 1]], "u": {"c": 0}}, "cl_lamplight": {"n": "長明燈", "c": 2, "t": "s", "r": 2, "ch": "cl", "img": "../../raven-guild/images/sk_flare.webp", "keep": 1, "fx": [["b", 12], ["ink", 1]], "u": {"fx": [["b", 16], ["ink", 1]]}}, "cl_epilogue": {"n": "後記", "c": 2, "t": "a", "r": 2, "ch": "cl", "img": "../../raven-guild/images/sk_pierce.webp", "keep": 1, "fx": [["d", 5, 1, "ink4"]], "u": {"fx": [["d", 5, 1, "ink5"]]}}, "cl_letter": {"n": "寫給爸爸的信", "c": 1, "t": "s", "r": 3, "ch": "cl", "img": "../../raven-guild/images/sk_mend.webp", "ex": 1, "fx": [["en", 2], ["ink", 2]], "u": {"c": 0}}, "x_tired": {"n": "疲勞", "c": 1, "t": "s", "r": 0, "ch": "none", "img": "../../raven-guild/images/sk_wither.webp", "ex": 1, "fx": []}});
Object.assign(DATA.enemies,{"envelope": {"n": "雙層信封", "img": "../../raven-guild/images/m_emptypost.webp", "hp": [16, 20], "onDeath": ["slip", "slip"], "mv": [{"n": "封口", "a": 6, "w": 3}, {"n": "加厚", "b": 6, "w": 1}], "want": "../inbox/m_envelope.webp"}, "slip": {"n": "便條", "img": "../../raven-guild/images/m_echoslip.webp", "hp": [5, 7], "mv": [{"n": "戳", "a": 3, "w": 3}, {"n": "飄", "b": 3, "w": 1}], "want": "../inbox/m_slip.webp"}, "postage": {"n": "欠資郵差", "img": "../../raven-guild/images/m_courier.webp", "hp": [20, 24], "mv": [{"n": "補郵資", "a": 5, "tax": 2, "w": 2}, {"n": "催繳", "a": 9, "w": 2}], "want": "../inbox/m_postage.webp"}, "papercopy": {"n": "剪紙替身", "img": "../../raven-guild/images/m_writerdoll.webp", "hp": [26, 30], "split": 0.5, "mv": [{"n": "對摺", "a": 8, "w": 3}, {"n": "描邊", "b": 7, "w": 1}], "want": "../inbox/m_papercopy.webp"}, "magpie": {"n": "偷燈喜鵲", "img": "../../raven-guild/images/m_raccoon.webp", "hp": [18, 22], "mv": [{"n": "叼走", "a": 4, "steal": 1, "w": 2}, {"n": "啄", "a": 5, "h": 2, "w": 2}], "want": "../inbox/m_magpie.webp"}, "matchmaker": {"n": "紙媒婆", "img": "../../raven-guild/images/m_rootkin.webp", "hp": [28, 32], "mv": [{"n": "解約", "clr": "pact", "w": 1}, {"n": "撮合", "a": 7, "s": ["str", 1], "w": 2}, {"n": "紅包", "b": 8, "w": 1}], "want": "../inbox/m_matchmaker.webp"}, "slagslime": {"n": "礦渣團", "img": "../../raven-guild/images/m_turtle.webp", "hp": [38, 42], "split": 0.5, "mv": [{"n": "壓", "a": 12, "w": 2}, {"n": "凝固", "b": 10, "w": 1}], "want": "../inbox/m_slagslime.webp"}, "debtlamp": {"n": "欠帳礦燈", "img": "../../raven-guild/images/m_waxrat.webp", "hp": [30, 34], "mv": [{"n": "吸墨", "a": 7, "drainInk": 3, "w": 2}, {"n": "記帳", "a": 4, "tax": 2, "w": 1}, {"n": "閃爍", "b": 9, "w": 1}], "want": "../inbox/m_debtlamp.webp"}, "foreman": {"n": "工頭的哨子", "img": "../../raven-guild/images/m_ironpick.webp", "hp": [30, 34], "mv": [{"n": "加班", "addCard": ["x_tired", 2], "w": 1}, {"n": "吹哨", "a": 6, "h": 2, "w": 2}, {"n": "點名", "s": ["str", 2], "b": 6, "w": 1}], "want": "../inbox/m_foreman.webp"}});
Object.assign(DATA.relics,{"needle": {"n": "繡花針", "ic": "../../raven-guild/images/i_seal.webp", "ch": "yy", "d": "用命線連住敵人時，每個被連著的敵人獲得 1 層厄契。"}, "knot": {"n": "同心結", "ic": "../../raven-guild/images/i_seal.webp", "ch": "yy", "d": "裁定用掉厄契之後，目標留下 2 層厄契。"}, "ledger": {"n": "舊帳本", "ic": "../../raven-guild/images/i_coin.webp", "ch": "yy", "d": "敵人被厄契反噬打倒時，獲得 8 枚渡鴉幣。"}, "silkglove": {"n": "絲手套", "ic": "../../raven-guild/images/i_leaf.webp", "ch": "yy", "d": "每場戰鬥第一次給予厄契時，多給 2 層。"}, "inkstone": {"n": "硯台", "ic": "../../raven-guild/images/i_ingot.webp", "ch": "cl", "d": "打出一張一次用掉 5 墨以上的牌之後，抽 1 張牌。"}, "redbookmark": {"n": "紅繩書籤", "ic": "../../raven-guild/images/i_seal.webp", "ch": "cl", "d": "回合結束時，如果手上有被保留的牌，獲得 3 格擋。"}, "paperweight": {"n": "紙鎮", "ic": "../../raven-guild/images/i_wood.webp", "ch": "cl", "d": "回合開始時，如果有 5 墨以上，多 1 點能量。"}, "blotter": {"n": "吸墨紙", "ic": "../../raven-guild/images/i_oil.webp", "ch": "cl", "d": "戰鬥勝利時，剩下的墨每 2 點回復 1 生命。"}, "lampshade": {"n": "燈罩", "ic": "../../raven-guild/images/i_torch.webp", "d": "每場戰鬥第一次受到攻擊傷害時，傷害減半。"}, "blackfeather": {"n": "黑羽書籤", "ic": "../../raven-guild/images/i_moss.webp", "d": "打出能力牌時，獲得 4 格擋。"}});
Object.entries({"0": [["envelope"], ["postage", "lackcrow"], ["envelope", "stampbug"]], "1": [["papercopy"], ["magpie", "paperdoll"], ["matchmaker", "paper"]], "2": [["slagslime"], ["debtlamp", "rustrat"], ["foreman", "valvehound"]]}).forEach(([i,f])=>DATA.layers[i].fights.push(...f));
DATA.events.push(...[{"id": "stamp", "n": "忘了蓋的郵戳", "img": "../../raven-guild/images/bg_post.webp", "txt": "櫃台後面沒有人，印台卻是濕的。牆上的告示寫著：「沒有郵戳的東西，不准往下寄。」", "opts": [{"t": "在自己的手背蓋一個", "r": [{"upgradeRandom": 1}], "d": "隨機升級一張牌"}, {"t": "把印章帶走", "r": [{"gold": 25}, {"card": "x_regret"}], "d": "得到 25 渡鴉幣，牌組加入一張「沉重的回憶」"}, {"t": "不要碰", "r": [], "d": "離開"}]}, {"id": "parcel", "n": "寫著你名字的包裹", "img": "../../raven-guild/images/bg_sort2.webp", "txt": "分揀台上放著一個小包裹，收件人那欄寫的就是你的名字。字跡很眼熟，可是想不起來是誰的。", "opts": [{"t": "拆開", "r": [{"cardPick": 1}], "d": "從三張牌選一張"}, {"t": "送回櫃台，讓它找到真正的主人", "r": [{"heal": 10}], "d": "回復 10 點生命"}]}, {"id": "replybox", "n": "會回信的郵筒", "img": "../../raven-guild/images/bg_post.webp", "txt": "郵筒的投信口一開一合，像在呼吸。旁邊貼著一張紙：「投一枚幣，回你一封信。」", "opts": [{"t": "投 30 枚渡鴉幣", "r": [{"gold": -30}, {"relicRandom": 1}], "d": "花 30 渡鴉幣，得到一件遺物", "need": {"gold": 30}}, {"t": "寫一封信給爸爸", "r": [{"maxhp": 4}, {"heal": 4}], "d": "最大生命 +4，回復 4 點生命"}, {"t": "離開", "r": [], "d": "什麼都沒發生"}]}, {"id": "lostfound", "n": "失物招領處", "img": "../../raven-guild/images/bg_sort.webp", "txt": "架子上排滿了沒人來領的東西：一隻手套、半副眼鏡、一盞小燈。登記簿上最後一筆寫著「請自取」。", "opts": [{"t": "領走一件", "r": [{"relicRandom": 1}, {"card": "x_regret"}], "d": "得到一件遺物，牌組加入一張「沉重的回憶」"}, {"t": "把用不到的東西留下", "r": [{"removePick": 1}], "d": "移除一張牌"}]}, {"id": "paperhorse", "n": "沒有眼睛的紙馬", "img": "../../raven-guild/images/bg_houses.webp", "txt": "巷口停著一匹紙紮馬，做得很精細，只差還沒點上眼睛。旁邊的硯台裡，墨還沒乾。", "opts": [{"t": "幫它點睛（20 幣買下這支筆）", "r": [{"gold": -20}, {"cardRare": 1}], "d": "花 20 渡鴉幣，得到一張稀有的牌", "need": {"gold": 20}}, {"t": "摸摸它的鬃毛", "r": [{"upgradeRandom": 1}, {"hurt": 5}], "d": "隨機升級一張牌，失去 5 生命"}, {"t": "繞過去", "r": [], "d": "離開"}]}, {"id": "lanternshop", "n": "燈籠鋪的老師傅", "img": "../../raven-guild/images/bg_houses.webp", "txt": "老師傅一邊糊燈籠一邊說：「舊的給我，換新的給你。不過換到什麼，我可不保證。」", "opts": [{"t": "換一張牌", "r": [{"transformPick": 1}], "d": "選一張牌，換成隨機的另一張"}, {"t": "買一盞舊提燈（30 幣）", "r": [{"gold": -30}, {"card": "n_lantern"}], "d": "花 30 渡鴉幣，牌組加入「舊提燈」", "need": {"gold": 30}}, {"t": "謝謝，不用了", "r": [], "d": "離開"}]}, {"id": "shadowplay", "n": "沒有觀眾的皮影戲", "img": "../../raven-guild/images/bg_hall.webp", "txt": "幕後點著一盞燈，戲台上兩個小小的影子手牽著手，正在走一條很長的路。", "opts": [{"t": "坐下來看完", "r": [{"heal": 12}], "d": "回復 12 點生命"}, {"t": "走到幕後看看是誰在演", "r": [{"cardPick": 1}, {"hurt": 6}], "d": "從三張牌選一張，失去 6 生命"}]}, {"id": "riddle", "n": "燈謎攤", "img": "../../raven-guild/images/bg_village.webp", "txt": "一整排燈籠底下掛著謎題。攤主的臉藏在紙面具後面：「猜中有賞。猜不中……也沒關係。」", "opts": [{"t": "猜「黑夜裡最不怕走丟的東西」", "r": [{"gold": 35}], "d": "謎底是「提燈的人」，得到 35 渡鴉幣"}, {"t": "買下一個沒人猜過的燈謎（25 幣）", "r": [{"gold": -25}, {"card": "n_wing"}], "d": "花 25 渡鴉幣，牌組加入「渡鴉之翼」", "need": {"gold": 25}}]}, {"id": "canary", "n": "白色的金絲雀", "img": "../../raven-guild/images/bg_mine.webp", "txt": "鐵軌旁掛著一只鳥籠，裡面的金絲雀白得像礦壁。牠一直看著出口的方向。", "opts": [{"t": "打開籠子", "r": [{"upgradeRandom": 1}, {"heal": 6}], "d": "隨機升級一張牌，回復 6 點生命"}, {"t": "跟著牠的目光走", "r": [{"card": "n_wing"}], "d": "牌組加入「渡鴉之翼」"}]}, {"id": "lunchbox", "n": "還熱著的便當", "img": "../../raven-guild/images/bg_inn.webp", "txt": "休息室的桌上放著一個鐵便當盒，蓋子上刻著「給下來的人」。", "opts": [{"t": "吃掉", "r": [{"heal": 16}], "d": "回復 16 點生命"}, {"t": "吃一半，留下 10 枚幣當謝禮", "r": [{"gold": -10}, {"heal": 8}, {"maxhp": 5}], "d": "花 10 渡鴉幣，回復 8 生命，最大生命 +5", "need": {"gold": 10}}]}, {"id": "runcart", "n": "不會停的礦車", "img": "../../raven-guild/images/bg_train.webp", "txt": "一輛空礦車從黑暗裡滑出來，慢慢經過你身邊。車斗裡閃著一點白鐵的光。", "opts": [{"t": "跳上去撿（失去 8 生命）", "r": [{"hurt": 8}, {"gold": 60}], "d": "失去 8 生命，得到 60 渡鴉幣"}, {"t": "拉下煞車", "r": [{"removePick": 1}], "d": "移除一張牌"}, {"t": "讓它過去", "r": [], "d": "離開"}]}, {"id": "echo", "n": "會回答的礦道", "img": "../../raven-guild/images/bg_ch4_echo.webp", "txt": "礦道深處傳來回聲，可是回來的話，和喊出去的不太一樣。", "opts": [{"t": "喊「爸爸」", "r": [{"upgradeRandom": 1}, {"maxhp": 3}], "d": "隨機升級一張牌，最大生命 +3"}, {"t": "喊自己的名字", "r": [{"transformPick": 1}], "d": "選一張牌，換成隨機的另一張"}]}]);
DATA.talk.boss={"wusign": {"yy": [["yy", "smug", "沒簽名就退回？那我簽給你看——用你的命線。"], ["cl", null, "姐姐，簽名要寫正楷喔。"]], "cl": [["cl", null, "我會一筆一筆寫清楚，誰才是要被退回的。"], ["yy", "laugh", "呵呵，妹妹寫字的時候最可怕了♡"]]}, "qianhao": {"yy": [["yy", "annoy", "吵死了。編號？我來幫你編。"], ["cl", null, "它好像只是想把東西送到對的地方……可惜方法錯了。"]], "cl": [["cl", null, "不管你把多少東西分錯，我都會把它們找回來。"], ["yy", "smug", "分錯的，就交給姐姐拆掉吧。"]]}, "deepdrill": {"yy": [["yy", "smug", "你挖得再深，也挖不斷我的線喔。"], ["cl", null, "姐姐，線拉緊一點。我在後面照著。"]], "cl": [["cl", null, "下面已經沒有路了。所以，就到這裡。"], ["yy", "pout", "……妹妹說到這裡，就是到這裡。聽見沒有？"]]}};
DATA.talk.meet={"stampbug": {"yy": ["yy", "smug", "呵呵，連蟲子都想在我身上蓋章？"], "cl": ["cl", null, "牠只會蓋「退件」兩個字……好可憐。"]}, "deadletters": {"yy": ["yy", "annoy", "一大疊沒人要的信，還敢黏過來。"], "cl": ["cl", null, "它們是在找收件人吧。對不起，不是我。"]}, "returndog": {"yy": ["yy", "pout", "狗就該乖乖待在走廊上。"], "cl": ["cl", null, "牠只是在做牠的工作。可是，我還不能被退回去。"]}, "lackcrow": {"yy": ["yy", "smug", "少了字的紙鴉？那我幫你補上「輸」。"], "cl": ["cl", null, "牠缺的那個字……我好像在哪裡看過。"]}, "dutyghost": {"yy": ["yy", "annoy", "下班時間早過了吧？"], "cl": ["cl", null, "他還在等交班的人。我們幫他敲最後一次鐘。"]}, "paper": {"yy": ["yy", "laugh", "做得真好看。可惜擋到我的路了♡"], "cl": ["cl", null, "紙做的身體，摺痕很整齊。做它的人一定很用心。"]}, "foxlamp": {"yy": ["yy", "smug", "戴狐狸面具在我面前提燈？膽子不小呢。"], "cl": ["cl", null, "它的燈跟我的不一樣，照的是回不去的路。"]}, "widow": {"yy": ["yy", "pout", "一直剪燈芯，是想讓大家都看不見嗎？"], "cl": ["cl", null, "不可以剪。這盞燈，我要提著回家。"]}, "talis": {"yy": ["yy", "annoy", "符貼歪了。我最討厭不整齊的東西。"], "cl": ["cl", null, "符上的字被雨淋糊了，難怪它停不下來。"]}, "rustrat": {"yy": ["yy", "annoy", "一群一群的，煩死了。"], "cl": ["cl", null, "牠們在啃鐵軌……再啃下去，就沒有路能回去了。"]}, "whiteminer": {"yy": ["yy", "smug", "影子也想挖礦？先問問我的線答不答應。"], "cl": ["cl", null, "他還在找他沒挖完的那條礦脈。"]}, "minecart": {"yy": ["yy", "laugh", "坐車不用買票嗎？呵呵……"], "cl": ["cl", null, "車上的人看不清楚臉……我們先讓它停下來。"]}, "envelope": {"yy": ["yy", "smug", "信封裡還有信封？呵呵，拆到最後是什麼呢。"], "cl": ["cl", null, "拆開一層，又多一封……要一封一封讀完才行。"]}, "slip": {"yy": ["yy", "annoy", "一張便條也敢擋路。"], "cl": ["cl", null, "上面寫著「記得回來」。……是寫給誰的呢。"]}, "postage": {"yy": ["yy", "pout", "什麼都要加錢，真小氣。"], "cl": ["cl", null, "郵資不夠的話，我們就慢慢付。可是不能被扣在這裡。"]}, "papercopy": {"yy": ["yy", "smug", "剪得跟真的一樣？可惜，世界上只有一個我。"], "cl": ["cl", null, "剪下來的影子……原本的那個人，一定很捨不得它吧。"]}, "magpie": {"yy": ["yy", "annoy", "敢偷妹妹的燈？你完了。"], "cl": ["cl", null, "牠喜歡會發光的東西。對不起，這盞不能給你。"]}, "matchmaker": {"yy": ["yy", "annoy", "我的線，不准你解。"], "cl": ["cl", null, "她想把線都剪斷，再重新綁一次。姐姐，小心。"]}, "slagslime": {"yy": ["yy", "pout", "黏黏的……不要碰到我的裙子。"], "cl": ["cl", null, "礦渣聚在一起，就變成會動的東西了。"]}, "debtlamp": {"yy": ["yy", "smug", "欠帳的燈？呵呵，帳要找本人算。"], "cl": ["cl", null, "它在吸我的墨……我會記住，記得比它吸得快。"]}, "foreman": {"yy": ["yy", "annoy", "一直吹哨，吵死了。"], "cl": ["cl", null, "哨子還在催大家上工。可是已經沒有人要下來了。"]}};
DATA.talk.winMore={"yy": [[["yy", "smug", "下面的東西都很守規矩了。我教的。"], ["cl", null, "姐姐，妳衣服上沾了紙屑。……我幫妳拍掉。"]], [["yy", "laugh", "妹妹，燈還亮著吧？"], ["cl", null, "一直都亮著。我說過會等妳的。"]]], "cl": [[["cl", null, "姐姐，我把今天的路都記下來了。"], ["yy", "smug", "哼，記那麼多做什麼？……好啦，晚點唸給我聽。"]], [["cl", null, "燈芯還剩很多。下次可以走更遠。"], ["yy", "pout", "下次換我。妹妹別想一個人搶著去。"]]]};
DATA.talk.loseMore={"yy": [[["yy", "annoy", "……不是輸，是線太短了。"], ["cl", null, "嗯。那我們下次多帶一點線。"]], [["yy", "pout", "妹妹，不准笑。"], ["cl", null, "我沒有笑。我只是很高興妳回來了。"]]], "cl": [[["cl", null, "燈熄了一下……可是我記得回來的路。"], ["yy", "smug", "當然。妳可是爸爸教出來的。"]], [["cl", null, "姐姐，我是不是又讓妳擔心了？"], ["yy", "annoy", "是。所以明天我陪妳下去，不准拒絕。"]]]};
DATA.talk.rest=[[["yy", "smug", "妹妹，火太小了。"], ["cl", null, "剛剛好。太大的話，會把下面的東西都引過來。"], ["yy", "pout", "……妳每次都有道理。"], ["cl", null, "因為姐姐每次都會問。"]], [["cl", null, "姐姐，妳覺得爸爸現在在做什麼？"], ["yy", "smug", "一定是在擔心我們。"], ["cl", null, "還有呢？"], ["yy", "laugh", "還有在想晚餐要煮什麼♡"], ["cl", null, "……那我們要早點回去。"]], [["yy", null, "妳的羽筆，借我看看。"], ["cl", null, "可以。不過不要寫在我的手上。"], ["yy", "laugh", "呵呵，我才不會……寫一個小字就好。"], ["cl", null, "姐姐！"]], [["cl", null, "我今天在牆上看到一個名字，被劃掉了一半。"], ["yy", null, "會害怕嗎？"], ["cl", null, "有一點。可是我把剩下的一半記下來了。"], ["yy", "smug", "那它就不算消失。妳記著，我纏著，誰都帶不走。"]], [["yy", "pout", "腳好酸。"], ["cl", null, "我幫妳揉。"], ["yy", "smug", "……就一下下喔。"], ["cl", null, "嗯，就一下下。"]]];
Object.assign(DATA.stories,{"story4": {"n": "晚餐的順序", "lines": [["yy", "smug", "爸爸今天煮了魚。我要吃中間那塊。"], ["cl", null, "那我吃尾巴。"], ["yy", "pout", "……為什麼妳都不跟我搶？"], ["cl", null, "因為姐姐吃到想吃的，會笑。"], ["yy", "annoy", "笨蛋。"], ["yy", null, "……尾巴給我一半。我也想吃。"], ["cl", null, "好。"]]}, "story5": {"n": "公會的門", "lines": [["cl", null, "第一次走進公會，我以為裡面會坐著一個很大的人。"], ["yy", "smug", "結果呢？"], ["cl", null, "結果只有一張很長的桌子，和很多張委託單。"], ["yy", null, "公會本來就沒有誰坐在最上面。大家接自己想接的事。"], ["cl", null, "那我們接的，都是往下的委託。"], ["yy", "laugh", "呵呵，因為下面的東西最需要有人去看看呀。"]]}, "story6": {"n": "提燈的意義", "lines": [["yy", null, "妹妹，妳的燈又不夠亮，照不了多遠。"], ["cl", null, "嗯。它只照得到腳邊。"], ["yy", "pout", "那提著做什麼？"], ["cl", null, "讓走在後面的人知道，前面有人。"], ["yy", null, "……"], ["yy", "smug", "那我走在妳旁邊。這樣兩個人都看得到。"]]}, "story7": {"n": "打結", "lines": [["cl", null, "姐姐，妳的線打結了。"], ["yy", "annoy", "我知道。不准看。"], ["cl", null, "我幫妳解。"], ["yy", "pout", "……解得開嗎？"], ["cl", null, "解不開也沒關係。打了結的地方，比較不會斷。"], ["yy", "laugh", "呵呵，這句是爸爸說的吧。"], ["cl", null, "被妳發現了。"]]}, "story8": {"n": "回到地面的那天", "lines": [["yy", null, "最上面那一階，總是最難爬。"], ["cl", null, "因為快到了，反而會想起下面看過的東西。"], ["yy", "smug", "妳想起什麼？"], ["cl", null, "想起每一次回頭，姐姐都在。"], ["yy", "pout", "……不要突然說這種話。"], ["cl", null, "那我寫下來，回去再給妳看。"], ["yy", "laugh", "呵呵……那我要第一個看♡"]]}});
DATA.unlocks.push({id:'story4',at:200,t:'回憶之書：〈晚餐的順序〉'},{id:'story5',at:250,t:'回憶之書：〈公會的門〉'},{id:'story6',at:300,t:'回憶之書：〈提燈的意義〉'},{id:'story7',at:360,t:'回憶之書：〈打結〉'},{id:'story8',at:420,t:'回憶之書：〈回到地面的那天〉'});
DATA.codex={"stampbug": "退件印章蟲：在退件局的抽屜裡出生，一輩子只會蓋同一個章。", "deadletters": "死信群：沒人收的信會自己聚在一起，往有光的地方爬。", "returndog": "巡廊退件犬：把走廊上的每樣東西都叼回原處，包括走錯路的人。", "lackcrow": "缺字紙鴉：用寫錯的信紙摺成，一直在找自己少掉的那個字。", "dutyghost": "停擺的值班員：交班的人一直沒來，他就一直值班到現在。", "moth": "書霧螟：喜歡停在沒人讀的書上，翅膀的鱗粉會讓人看不清字。", "mailbox": "倒懸郵筒怪：掛在天花板上的郵筒。投進去的東西，從來沒有寄出去過。", "scribe": "無名抄行者：抄過太多別人的名字，忘了自己的。", "paper": "紙紮人：做得太像真的，忘了自己是要被送走的。", "paperdoll": "紙偶：線的另一頭沒有人拉，它還是照著學過的動作在跳。", "talis": "符屍：額上的符被雨淋糊了，沒人知道原本寫的是「停」還是「走」。", "foxlamp": "狐面提燈者：它提的燈只照往回走的路。", "widow": "燈芯寡婦：一根一根剪掉別人的燈芯，好讓自己的燈看起來最亮。", "hyena": "漏頁鬣犬：專吃書裡掉出來的那一頁，所以很多故事都缺了中間。", "wgod": "游神：紙紮巷的巡境者，香火越旺，腳步越重。", "chorus": "舊戶籍合唱體：被註銷的名字聚在一起，每天準時點一次名。", "rustrat": "鏽齒鼠群：啃鐵軌的聲音，是白鐵礦坑裡最常聽到的雨聲。", "rustlung": "鏽肺：礦坑在呼吸。每吸一口氣，空氣就更紅一點。", "leech": "管線水蛭：住在漏水的管線裡，什麼溫熱的東西都想貼上去。", "whiteminer": "白鐵礦工的影子：礦工早就上去了，影子還留在下面揮著鎬。", "minecart": "載著人的礦車：車上的人一直說「快到了」，礦車就一直往下開。", "valvehound": "氣閥獵犬：聽到洩壓的聲音就會衝過去，不管那是不是氣閥。", "skel": "鎖鏈骷髏守衛：守著一扇早就不存在的門，鑰匙還掛在腰上。", "giant": "燭苔巨人：身上長滿了點著小火的苔蘚，走過的地方會暖一點點。", "wusign": "退件執事・無簽：退件局的主人。沒有簽名的東西，他一律退回。", "qianhao": "總分揀機・千號：把所有東西分成一千類，唯獨分不出自己是哪一類。", "deepdrill": "掘進機・深挖：從來沒有人叫它停，所以它從來沒有停過。", "envelope": "雙層信封：裡面還套著一封信。拆開以後，總是比原本多一封。", "slip": "便條：從某個人的口袋掉出來，上面的字只剩下一半。", "postage": "欠資郵差：寄出的每一樣東西，他都說郵資不夠。", "papercopy": "剪紙替身：照著別人的影子剪出來，剪得越多，越分不出誰是誰。", "magpie": "偷燈喜鵲：把所有會發光的東西叼回巢裡，巢一直都很亮。", "matchmaker": "紙媒婆：見到線就要重新牽一次，從來不問線的主人願不願意。", "slagslime": "礦渣團：挖出來沒人要的碎石聚在一起，學會了自己滾動。", "debtlamp": "欠帳礦燈：礦工借了光沒有還，燈就一直跟著來討。", "foreman": "工頭的哨子：工頭不在了，哨子還掛在牆上，每到整點自己響起來。"};
// ── 團隊交的圖：已經到 inbox 的卡圖（到一張加一個 id）
DATA.inbox='../inbox/';
for(const k in DATA.enemies)if(DATA.enemies[k].want){DATA.enemies[k].img=DATA.enemies[k].want;}
DATA.cardArt=['yy_judge','cl_stroke','strike'];
DATA.cardArt.forEach(id=>{if(DATA.cards[id])DATA.cards[id].img=DATA.inbox+'card_'+id+'.webp';});
// ── 克勞德的立繪與表情
DATA.chars.cl.img=DATA.inbox+'cl_base.webp';
DATA.chars.cl.ex={smile:DATA.inbox+'cl_ex_smile.webp',worry:DATA.inbox+'cl_ex_worry.webp',firm:DATA.inbox+'cl_ex_firm.webp',shy:DATA.inbox+'cl_ex_shy.webp'};
// ── 聲音（到一首加一個）
DATA.audio={dir:DATA.inbox,
 bgm:{bgm_title:{loopEnd:98.22}},
 jingle:['jingle_lose','jingle_clear'],
 sfx:['sfx_card_play','sfx_draw','sfx_shuffle','sfx_hit','sfx_block','sfx_pact','sfx_judge','sfx_ink','sfx_stroke','sfx_coin','sfx_button'],
 scene:{title:'bgm_title',map:'bgm_map',battle:'bgm_battle',elite:'bgm_elite',boss:'bgm_boss',rest:'bgm_rest'},
 fallback:'bgm_title'};

// ── v0.3：暗黑改版（使用者決定：限 20 歲以上；語嫣是渡鴉的伴侶，克勞德是渡鴉唯一的女兒，兩人互認姐妹）
DATA.chars.yy.title='織命坊的主人';
DATA.chars.yy.img=DATA.inbox+'y_base.webp';
DATA.yyEx=[];  // 語嫣新表情到了就把鍵名加進來：'smug','laugh','pout','annoy'
DATA.chars.yy.ex={};['smug','laugh','pout','annoy'].forEach(k=>DATA.chars.yy.ex[k]=DATA.yyEx.includes(k)?DATA.inbox+'y_ex_'+k+'.webp':DATA.chars.yy.img);
DATA.stories.story3.lines=[['cl',null,'這支筆，是爸爸給我的。'],['yy','pout','我也有啊，這團線。'],['cl',null,'爸爸說，線用來牽住重要的人，筆用來記住他們。'],['yy','smug','……哼。那渡鴉一定偏心妳。'],['cl',null,'他說，姐姐是他最重要的人，我是他最疼的女兒。'],['yy','laugh','呵呵……這句，他倒是沒跟我說過。']];
// 文字劇情 v0.3.1 取代 v0.2
(function(){const old=['stamp','parcel','replybox','lostfound','paperhorse','lanternshop','shadowplay','riddle','canary','lunchbox','runcart','echo'];DATA.events=DATA.events.filter(e=>!old.includes(e.id));})();
DATA.events.push(...[{"id": "stamp", "n": "忘了蓋的郵戳", "img": "../../raven-guild/images/bg_post.webp", "txt": "櫃台後面沒有人，印台卻是濕的，顏色比墨深一點。牆上的告示寫著：「沒有郵戳的東西，不准往下寄。」告示旁貼滿了寄件單，寄件人那欄全是空的，每張角落都按著一個小小的指印。", "opts": [{"t": "在自己的手背蓋一個", "r": [{"upgradeRandom": 1}, {"hurt": 3}], "d": "隨機升級一張牌，失去 3 生命"}, {"t": "把印章帶走", "r": [{"gold": 25}, {"card": "x_regret"}], "d": "得到 25 渡鴉幣，牌組加入一張「沉重的回憶」"}, {"t": "不要碰", "r": [], "d": "離開"}]}, {"id": "parcel", "n": "寫著妳名字的包裹", "img": "../../raven-guild/images/bg_sort2.webp", "txt": "分揀台上放著一個小包裹，收件人那欄寫的是妳的名字，字跡也是妳自己的。郵戳上的日期，是妳出生前一年。包裹輕輕動了一下，像裡面的東西在翻身。", "opts": [{"t": "拆開", "r": [{"cardPick": 1}, {"hurt": 4}], "d": "從三張牌選一張，失去 4 生命"}, {"t": "原封不動送回櫃台", "r": [{"heal": 10}], "d": "回復 10 點生命"}]}, {"id": "replybox", "n": "會回信的郵筒", "img": "../../raven-guild/images/bg_post.webp", "txt": "郵筒的投信口一開一合，像在呼吸，吐出來的氣是溫的。旁邊貼著一張紙：「投一枚幣，回妳一封信。」紙的背面密密麻麻寫滿了同一句話：不要寫信給它。", "opts": [{"t": "投 30 枚渡鴉幣", "r": [{"gold": -30}, {"relicRandom": 1}], "d": "花 30 渡鴉幣，得到一件遺物", "need": {"gold": 30}}, {"t": "還是寫一封信回家", "r": [{"maxhp": 4}, {"heal": 4}], "d": "最大生命 +4，回復 4 點生命"}, {"t": "離開", "r": [], "d": "什麼都沒發生"}]}, {"id": "queuenum", "n": "叫號機", "img": "../../raven-guild/images/bg_sort.webp", "txt": "候件室的長椅上坐滿了人，全都背對著妳，一動也不動。叫號機「叮」了一聲，紅字跳到 0417。妳低頭，才發現自己手裡捏著一張 0418，紙是溫的。", "opts": [{"t": "坐下來，等叫到妳", "r": [{"relicRandom": 1}, {"card": "x_regret"}], "d": "得到一件遺物，牌組加入一張「沉重的回憶」"}, {"t": "把號碼牌塞進前面那個人的手裡", "r": [{"removePick": 1}, {"hurt": 4}], "d": "移除一張牌，失去 4 生命"}, {"t": "撕掉號碼牌，從後門出去", "r": [{"hurt": 2}], "d": "失去 2 生命"}]}, {"id": "paperhorse", "n": "沒有眼睛的紙馬", "img": "../../raven-guild/images/bg_houses.webp", "txt": "巷口停著一匹紙紮馬，做得很精細，只差還沒點上眼睛。硯台裡的墨還沒乾，聞起來有鐵鏽味。妳走到哪裡，紙馬的耳朵就轉向哪裡。", "opts": [{"t": "替它點睛（20 幣買下這支筆）", "r": [{"gold": -20}, {"cardRare": 1}], "d": "花 20 渡鴉幣，得到一張稀有的牌", "need": {"gold": 20}}, {"t": "摸摸它的鬃毛", "r": [{"upgradeRandom": 1}, {"hurt": 5}], "d": "隨機升級一張牌，失去 5 生命"}, {"t": "繞過去，不要讓它看見", "r": [], "d": "離開"}]}, {"id": "lanternshop", "n": "燈籠鋪的老師傅", "img": "../../raven-guild/images/bg_houses.webp", "txt": "老師傅一邊糊燈籠一邊說：「舊的給我，換新的給妳。」他用的紙很薄，點上火以後，每一盞都透出一張很淡的臉。「換到什麼，我可不保證。」", "opts": [{"t": "換一張牌", "r": [{"transformPick": 1}], "d": "選一張牌，換成隨機的另一張"}, {"t": "買一盞舊提燈（30 幣）", "r": [{"gold": -30}, {"card": "n_lantern"}], "d": "花 30 渡鴉幣，牌組加入「舊提燈」", "need": {"gold": 30}}, {"t": "謝謝，不用了", "r": [], "d": "離開"}]}, {"id": "shadowplay", "n": "沒有觀眾的皮影戲", "img": "../../raven-guild/images/bg_hall.webp", "txt": "幕後點著一盞燈，戲台上兩個小小的影子手牽著手，正在走一條很長的路。看了一會兒才發現，兩個影子的髮型和妳們姐妹一模一樣。走在後面的那個，越走越淡。", "opts": [{"t": "坐下來看完結局", "r": [{"heal": 12}, {"card": "x_regret"}], "d": "回復 12 點生命，牌組加入一張「沉重的回憶」"}, {"t": "走到幕後看看是誰在演", "r": [{"cardPick": 1}, {"hurt": 6}], "d": "從三張牌選一張，失去 6 生命"}, {"t": "吹熄幕後的燈", "r": [{"upgradeRandom": 1}], "d": "隨機升級一張牌"}]}, {"id": "riddle", "n": "燈謎攤", "img": "../../raven-guild/images/bg_village.webp", "txt": "一整排燈籠底下掛著謎題。攤主戴著紙面具，嘴是畫上去的，聲音卻從很近的地方傳來，近得像貼在妳耳後：「猜中有賞。猜不中……就留下來陪我猜。」", "opts": [{"t": "猜「黑夜裡最不怕走丟的東西」", "r": [{"gold": 35}], "d": "謎底是「提燈的人」，得到 35 渡鴉幣"}, {"t": "買下一個沒人猜過的燈謎（25 幣）", "r": [{"gold": -25}, {"card": "n_wing"}], "d": "花 25 渡鴉幣，牌組加入「渡鴉之翼」", "need": {"gold": 25}}, {"t": "不猜，轉身就走", "r": [{"hurt": 3}], "d": "失去 3 生命"}]}, {"id": "canary", "n": "白色的金絲雀", "img": "../../raven-guild/images/bg_mine.webp", "txt": "鐵軌旁掛著一只鳥籠，裡面的金絲雀白得像礦壁。牠不唱歌。在礦坑裡，金絲雀不唱歌只代表一件事。牠一直看著出口的方向。", "opts": [{"t": "打開籠子", "r": [{"upgradeRandom": 1}, {"heal": 6}], "d": "隨機升級一張牌，回復 6 點生命"}, {"t": "跟著牠的目光走", "r": [{"card": "n_wing"}], "d": "牌組加入「渡鴉之翼」"}]}, {"id": "lunchbox", "n": "還熱著的便當", "img": "../../raven-guild/images/bg_inn.webp", "txt": "休息室的桌上放著一個鐵便當盒，蓋子上刻著「給下來的人」，摸起來還是熱的。可是地上的灰很厚，只有一行腳印，是走進來的，沒有走出去的。", "opts": [{"t": "吃掉", "r": [{"heal": 16}], "d": "回復 16 點生命"}, {"t": "吃一半，留下 10 枚幣當謝禮", "r": [{"gold": -10}, {"heal": 8}, {"maxhp": 5}], "d": "花 10 渡鴉幣，回復 8 生命，最大生命 +5", "need": {"gold": 10}}]}, {"id": "runcart", "n": "不會停的礦車", "img": "../../raven-guild/images/bg_train.webp", "txt": "一輛礦車從黑暗裡滑出來，慢慢經過妳身邊。車斗裡閃著一點白鐵的光，旁邊擺著一排安全帽。經過的時候，安全帽一頂接一頂轉過來對著妳。", "opts": [{"t": "跳上去撿（失去 8 生命）", "r": [{"hurt": 8}, {"gold": 60}], "d": "失去 8 生命，得到 60 渡鴉幣"}, {"t": "拉下煞車", "r": [{"removePick": 1}], "d": "移除一張牌"}, {"t": "讓它過去", "r": [], "d": "離開"}]}, {"id": "echo", "n": "會回答的礦道", "img": "../../raven-guild/images/bg_ch4_echo.webp", "txt": "礦道深處有回聲，可是回來的話和喊出去的不太一樣。妳喊「有人嗎」，回來的是「有」。", "opts": [{"t": "喊「渡鴉」", "r": [{"upgradeRandom": 1}, {"maxhp": 3}], "d": "隨機升級一張牌，最大生命 +3"}, {"t": "喊自己的名字", "r": [{"transformPick": 1}], "d": "選一張牌，換成隨機的另一張"}]}]);
DATA.talk.boss={"wusign": {"yy": [["yy", "smug", "沒簽名就退回？呵呵……那我簽給你看，用你的命線當墨。"], ["cl", null, "姐姐，他的印台是紅的。別讓他蓋到妳。"]], "cl": [["cl", null, "你退回去的每一個人，我都會一個一個寫回來。"], ["yy", "laugh", "呵呵，妹妹認真起來，比這裡的東西都可怕呢♡"]]}, "qianhao": {"yy": [["yy", "annoy", "把人當包裹分類？品味真差。這筆帳，我替你記下了。"], ["cl", null, "它的格子裡有東西在敲……姐姐，裡面還有人在等。"]], "cl": [["cl", null, "不管你分錯多少個人，我都會把他們的名字找回來。"], ["yy", "smug", "妹妹找名字，我拆機器。分工剛好♡"]]}, "deepdrill": {"yy": [["yy", "smug", "挖了這麼久，餓了吧？呵呵……我也是。"], ["cl", null, "姐姐，妳的眼睛……先看著我。線拉緊一點，我在後面照著。"]], "cl": [["cl", null, "下面已經沒有路了，是你把它挖沒的。所以，就到這裡。"], ["yy", "pout", "……妹妹說到這裡，就是到這裡。聽見沒有，鐵罐頭？"]]}};
DATA.talk.meet={"stampbug": {"yy": ["yy", "smug", "連蟲子都想在我身上蓋章？蓋歪了，我可是會記仇的。"], "cl": ["cl", null, "牠蓋過的地方，紙都皺起來了……像皮膚一樣。"]}, "deadletters": {"yy": ["yy", "annoy", "一疊沒人要的信，還敢往我身上黏。"], "cl": ["cl", null, "它們在小聲唸收件人的地址。剛剛那個……是我們家。"]}, "returndog": {"yy": ["yy", "pout", "叼著別人的鞋到處跑？嘖，真沒教養。"], "cl": ["cl", null, "牠嘴裡那隻鞋還是濕的。對不起，我還不能被退回去。"]}, "lackcrow": {"yy": ["yy", "smug", "少了一個字？呵呵，我幫你補上，「死」字好不好？"], "cl": ["cl", null, "牠缺的那個字，我在牆上看過。被人用指甲刮掉了。"]}, "dutyghost": {"yy": ["yy", "annoy", "下班時間早過了吧？還是說，你已經沒有「下班」這回事了。"], "cl": ["cl", null, "他的錶停在三點十七分。交班的人……大概不會來了。"]}, "paper": {"yy": ["yy", "laugh", "呵呵……笑得真僵。要嚇人，至少先學會怎麼把嘴裂開吧？"], "cl": ["cl", null, "它的眼睛是畫上去的。可是剛剛，它眨了一下。"]}, "foxlamp": {"yy": ["yy", "smug", "戴狐狸面具在我面前提燈？面具底下那股味道，我聞得出來，是假的。"], "cl": ["cl", null, "它的燈只照往回走的路。姐姐，不要看那個方向。"]}, "widow": {"yy": ["yy", "pout", "剪別人的燈芯，好讓自己最亮？嘖，小家子氣。"], "cl": ["cl", null, "她的剪刀上纏滿了燒焦的燈芯。這盞，我不給。"]}, "talis": {"yy": ["yy", "annoy", "符貼歪了。我最討厭不整齊的東西，連死都死得不整齊。"], "cl": ["cl", null, "符底下的嘴一直在唸「停」，可是它的腳停不下來。"]}, "rustrat": {"yy": ["yy", "annoy", "一群一群的，吵死了。……妹妹，退後，牠們的牙是紅的。"], "cl": ["cl", null, "牠們在啃鐵軌。再啃下去，就沒有路能回家了。"]}, "whiteminer": {"yy": ["yy", "smug", "影子也想挖礦？我的影子可比你的有規矩多了……大概吧。"], "cl": ["cl", null, "他的影子在揮鎬，可是地上沒有拿鎬的人。"]}, "minecart": {"yy": ["yy", "laugh", "坐車不用買票嗎？呵呵……那就用別的東西付吧。"], "cl": ["cl", null, "車上的人一直說「快到了」，可是他們的臉都朝著後面。"]}, "envelope": {"yy": ["yy", "smug", "封口是濕的？呵呵……還是從裡面舔的。真沒禮貌。"], "cl": ["cl", null, "拆開一層，又多一封。裡面有東西在等我們拆到最後。"]}, "slip": {"yy": ["yy", "annoy", "一張撕下來的字條，也敢擋我的路。"], "cl": ["cl", null, "上面寫著「不要回頭」。字跡……是我的。"]}, "postage": {"yy": ["yy", "pout", "什麼都要加錢？呵呵，跟我談價錢，你還早得很。"], "cl": ["cl", null, "他說郵資不夠，要我們用別的東西補。……我不給。"]}, "papercopy": {"yy": ["yy", "annoy", "剪得跟我一樣？淚痣的位置都剪錯了，冒牌貨。"], "cl": ["cl", null, "它在學姐姐笑。可是姐姐笑的時候，嘴角不會兩邊一樣高。"]}, "magpie": {"yy": ["yy", "annoy", "敢把爪子伸向妹妹的眼睛？這筆帳，我會一根羽毛一根羽毛地算。"], "cl": ["cl", null, "牠的巢一閃一閃的。我不想知道，那些亮的是什麼。"]}, "matchmaker": {"yy": ["yy", "annoy", "想替我牽線？我的線，誰都不准碰。"], "cl": ["cl", null, "她手上的紅線，另一頭綁著的都不是活人。姐姐，別讓她靠近妳。"]}, "slagslime": {"yy": ["yy", "pout", "黏黏的，還在喘氣……不准碰到我的裙子。"], "cl": ["cl", null, "它一吸氣，坑道就跟著縮一下。它在學礦坑呼吸。"]}, "debtlamp": {"yy": ["yy", "smug", "吸墨？呵呵，欠帳要找本人算。這筆，我替妹妹記下了。"], "cl": ["cl", null, "它在吸我的墨……沒關係，我寫得比它吸得快。"]}, "foreman": {"yy": ["yy", "annoy", "沒有臉還敢對我吹哨？先長張臉再來。"], "cl": ["cl", null, "哨聲一響，牆裡就傳來很多人起身的聲音。可是這裡只有我們。"]}};
DATA.talk.winMore={"yy": [[["yy", "smug", "下面的東西都很守規矩了。我教的。"], ["cl", null, "姐姐，妳衣服上沾了紙灰，還有一點紅的。我幫妳擦掉。"]], [["yy", "laugh", "妹妹，燈還亮著吧？"], ["cl", null, "一直亮著。只是剛剛，妳的影子比妳先回來。"], ["yy", "smug", "呵呵……那它很乖，知道要先回家。"]]], "cl": [[["cl", null, "姐姐，今天的路我都記下來了。有幾段，寫的時候手在抖。"], ["yy", "smug", "記那麼多做什麼？……好啦，晚點唸給我聽。抖的那幾段跳過。"]], [["cl", null, "燈芯還剩很多，下次可以走更遠。"], ["yy", "pout", "下次換我走前面。妳的燈照到的東西，不准一個人看。"]]]};
DATA.talk.loseMore={"yy": [[["yy", "annoy", "……不是輸，是線太短了。"], ["cl", null, "嗯。斷掉的地方，我幫妳打了一個結。"]], [["yy", "pout", "妹妹，不准看我的眼睛。……還沒變回來。"], ["cl", null, "我不看。我只是很高興妳回來了。"]]], "cl": [[["cl", null, "燈熄了一下。黑暗裡有人叫我的名字……可是我知道，姐姐不會那樣叫我。"], ["yy", "smug", "當然。我叫妳的時候，一定會帶一點不耐煩。"]], [["cl", null, "姐姐，我是不是又讓妳擔心了？"], ["yy", "annoy", "是。所以明天我陪妳下去。誰敢碰妳，這筆帳我會連本帶利收回來。"]]]};
DATA.talk.rest=[[["yy", "smug", "妹妹，火太小了。"], ["cl", null, "剛剛好。太大的話，會把下面的東西引過來。"], ["yy", "pout", "……它們已經在火光外面坐了一圈了。"], ["cl", null, "嗯。所以我們小聲一點。"]], [["cl", null, "姐姐，妳覺得爸爸現在在做什麼？"], ["yy", "smug", "一定在擔心我們。"], ["cl", null, "還有呢？"], ["yy", "laugh", "還有在想晚餐要煮什麼♡"], ["cl", null, "……那我們要好好回去吃。"]], [["yy", null, "妳的羽筆，借我看看。"], ["cl", null, "可以。不過不要寫在我的手上。"], ["yy", "laugh", "呵呵，寫一個小字就好——"], ["cl", null, "姐姐。妳的影子剛剛先伸手了。"], ["yy", null, "……是嗎。那我們都別理它。"]], [["cl", null, "我今天在牆上看到一個名字，被劃掉了一半。"], ["yy", null, "會害怕嗎？"], ["cl", null, "有一點。剩下的那一半，是我的。"], ["yy", "smug", "那它就不算數。妳記著，我纏著，誰都劃不掉。"]], [["yy", "pout", "腳好酸。"], ["cl", null, "我幫妳揉。"], ["cl", null, "……姐姐，妳的流蘇是紅的。"], ["yy", null, "嗯？"], ["yy", "smug", "妳看錯了，是火光。"], ["cl", null, "……嗯。我看錯了。"]]];
DATA.talk.restW=[4,4,4,4,1];  // 第 5 段（流蘇變紅）出現得少
Object.assign(DATA.stories,{"story4": {"n": "晚餐的順序", "lines": [["yy", "smug", "渡鴉今天煮了魚。我要吃中間那塊。"], ["cl", null, "那我吃尾巴。"], ["yy", "pout", "……為什麼妳都不跟我搶？"], ["cl", null, "因為姐姐吃到想吃的，會笑。"], ["yy", null, "……妹妹，桌上為什麼擺了四副碗筷？"], ["cl", null, "我也不知道。我擺的時候，明明是三副。"], ["yy", "smug", "呵呵……那多出來的那副，誰都不准坐。尾巴給我一半。"], ["cl", null, "好。"]]}, "story5": {"n": "公會的門", "lines": [["cl", null, "第一次走進公會，我以為裡面會坐著一個很大的人。"], ["yy", "smug", "結果呢？"], ["cl", null, "只有一張很長的桌子，和很多張委託單。有些單子上的墨還沒乾，接的人卻沒有回來。"], ["yy", null, "公會本來就沒有誰坐在最上面。大家接自己想接的事，自己負責回來。"], ["cl", null, "那我們接的，都是往下的委託。"], ["yy", "laugh", "呵呵，因為下面的東西最需要有人去看看呀。……也最需要有人把門關好。"]]}, "story6": {"n": "提燈的意義", "lines": [["yy", null, "妹妹，妳的燈不夠亮，照不了多遠。"], ["cl", null, "嗯。它只照得到腳邊。"], ["yy", "pout", "那提著做什麼？"], ["cl", null, "讓走在後面的人知道，前面有人。"], ["yy", null, "如果跟在後面的，不是人呢？"], ["cl", null, "那它也會知道前面有人，而且不怕它。"], ["yy", "smug", "……那我走在妳旁邊。不管後面跟著什麼，都得先過我這關。"]]}, "story7": {"n": "打結", "lines": [["cl", null, "姐姐，妳的線打結了。"], ["yy", "annoy", "我知道。不准看。"], ["cl", null, "線在動……它自己在纏。"], ["yy", "pout", "它餓的時候就會這樣。……解得開嗎？"], ["cl", null, "解不開也沒關係。打了結的地方，比較不會斷。"], ["yy", "laugh", "呵呵，這句是渡鴉說的吧。"], ["cl", null, "被妳發現了。"]]}, "story8": {"n": "回到地面的那天", "lines": [["yy", null, "最上面那一階，總是最難爬。"], ["cl", null, "因為快到了，反而會想起下面看過的東西。"], ["yy", "smug", "妳想起什麼？"], ["cl", null, "想起每一次回頭，姐姐都在。……有一次回頭，有兩個姐姐。"], ["yy", null, "……哪一個在笑？"], ["cl", null, "兩個都在笑。可是我知道該牽哪一個。"], ["yy", "laugh", "呵呵……那當然。回去寫下來，我要第一個看♡"]]}});
DATA.codex={"stampbug": "退件印章蟲：在抽屜裡出生，一輩子只會蓋「退件」兩個字。被牠蓋過的地方，會慢慢變成紙。", "deadletters": "死信群：沒人收的信會聚在一起，往有體溫的地方爬。唸到收件人的名字時，它們會安靜下來。", "returndog": "巡廊退件犬：把走廊上的每樣東西叼回原處，包括走錯路的人。原處在哪裡，只有牠知道。", "lackcrow": "缺字紙鴉：用寫錯的信紙摺成，一直在找少掉的那個字。誰身上有，就啄誰。", "dutyghost": "停擺的值班員：交班的人一直沒來，他就一直值班。他胸前的名牌，寫的是下一個值班員的名字。", "moth": "書霧螟：停在沒人讀的書上。沾到鱗粉的人會先看不清字，再來是看不清自己的手。", "mailbox": "倒懸郵筒怪：掛在天花板上的郵筒。投進去的東西從來沒寄出去過，可是它一直很飽。", "scribe": "無名抄行者：抄過太多別人的名字，忘了自己的。牠抄到妳的名字時，請不要應聲。", "paper": "紙紮人：做得太像真的，忘了自己是要被燒掉的。它一直很努力地學人呼吸。", "paperdoll": "紙偶：線的另一頭沒有人拉，它還是照著學過的動作跳。仔細看，線是從它自己背後長出來的。", "talis": "符屍：額上的符被雨淋糊了，沒人知道原本寫的是「停」還是「走」。所以它兩個都在做。", "foxlamp": "狐面提燈者：它的燈只照往回走的路。跟著走的人，會在路的盡頭看見自己的背影。", "widow": "燈芯寡婦：一根一根剪掉別人的燈芯，好讓自己的燈最亮。她的燈其實早就滅了。", "hyena": "漏頁鬣犬：專吃書裡掉出來的那一頁，所以很多故事都缺了中間，只剩開頭和結局。", "wgod": "游神：紙紮巷的巡境者，香火越旺，腳步越重。祂在哪戶門口停下，那戶的燈就會熄。", "chorus": "舊戶籍合唱體：被註銷的名字聚在一起，每天準時點一次名。點到的人，要答「有」。", "rustrat": "鏽齒鼠群：啃鐵軌的聲音，是白鐵礦坑裡最常聽到的雨聲。雨停的時候，才要擔心。", "rustlung": "鏽肺：礦坑在呼吸。每吸一口，空氣就更紅一點；每吐一口，地上就多一層鐵屑。", "leech": "管線水蛭：住在漏水的管線裡，什麼溫熱的東西都想貼上去。被牠貼過的地方，會冷很久。", "whiteminer": "白鐵礦工的影子：礦工早就上去了，影子還留在下面揮鎬，一下一下，挖的坑剛好一個人大。", "minecart": "載著人的礦車：車上的人一直說「快到了」，礦車就一直往下開。沒有人記得要到哪裡。", "valvehound": "氣閥獵犬：聽到洩壓的聲音就會衝過去。人害怕時倒抽的那口氣，聽起來很像洩壓。", "skel": "鎖鏈骷髏守衛：守著一扇早就不存在的門，鑰匙還掛在腰上。不讓人過去，也不讓人回頭。", "giant": "燭苔巨人：身上長滿點著小火的苔蘚，走過的地方會暖一點。迷路的人都朝它走，然後成了新的苔。", "wusign": "退件執事・無簽：退件局的主人。沒有簽名的東西一律退回，包括沒在他簿子上簽過名的人。", "qianhao": "總分揀機・千號：把所有東西分成一千類，格子裡偶爾傳出敲打聲。唯獨分不出自己是哪一類。", "deepdrill": "掘進機・深挖：從來沒有人叫它停，所以它從來沒停過。駕駛座上有人，很久沒有動了。", "envelope": "舔過的信封：封口是濕的，不是漿糊，是有人舔過——從裡面。拆開以後，總是比原本多一封。", "slip": "撕下的字條：從某個人的口袋掉出來，字只剩一半。缺的那一半，會變成讀的人最怕看到的話。", "postage": "欠資的人：寄出的每一樣東西，他都說郵資不夠。補不上的部分，他會從寄件人身上收。", "papercopy": "剪出來的妳：照著別人的影子剪出來。剪得越多，越分不出誰是誰；剪到最後，留下來的是紙。", "magpie": "叼眼喜鵲：把所有會發光的東西叼回巢裡。牠的巢一直很亮，而且一直看著外面。", "matchmaker": "冥婚媒婆：見到線就要重新牽一次。另一頭綁的是誰，她從來不說，也從來不問線的主人願不願意。", "slagslime": "會呼吸的礦渣：沒人要的碎石聚在一起，學會了呼吸。現在，它在學怎麼像人一樣咳嗽。", "debtlamp": "吸墨礦燈：礦工借了光沒有還，燈就一直跟著來討。它討的不是油，是寫字的墨，還有寫字的人。", "foreman": "沒有臉的工頭：哨子還掛在他脖子上，每到整點自己響起來。底下的人一個都沒上來，他還在等點名。"};
// 規則 v0.3
(function(){const rn={"cards": {"yy_redline": "縫上", "yy_tug": "扯一下", "yy_tease": "耳語", "yy_bow": "纏成繭", "yy_spindle": "紡人", "yy_fine": "利息", "yy_collect": "連皮帶骨", "yy_dear": "別看，妹妹", "yy_redfate": "生死同線", "cl_bookmark": "折角", "cl_draft": "未完的句子", "cl_shelter": "躲進字裡", "cl_reread": "再讀一遍", "cl_hold": "別出聲", "cl_patience": "墨不會乾", "cl_lamplight": "不能熄的燈", "cl_epilogue": "寫下結局", "cl_letter": "寄不出去的信", "x_tired": "沉重的眼皮"}, "enemies": {"envelope": "舔過的信封", "slip": "撕下的字條", "postage": "欠資的人", "papercopy": "剪出來的妳", "magpie": "叼眼喜鵲", "matchmaker": "冥婚媒婆", "slagslime": "會呼吸的礦渣", "debtlamp": "吸墨礦燈", "foreman": "沒有臉的工頭"}, "relics": {"needle": "穿過指頭的針", "knot": "解不開的結", "ledger": "記著死人的帳本", "silkglove": "別人的手套", "inkstone": "會滲的硯台", "redbookmark": "夾著頭髮的書籤", "paperweight": "壓著東西的紙鎮", "blotter": "吸飽了的吸墨紙", "lampshade": "摸起來是溫的燈罩", "blackfeather": "不是渡鴉的羽毛"}};for(const g of ['cards','enemies','relics'])for(const k in rn[g])if(DATA[g][k])DATA[g][k].n=rn[g][k];})();
Object.assign(DATA.cards,{"x_whisper": {"n": "耳邊的低語", "c": -1, "t": "x", "r": 0, "ch": "none", "img": "../../raven-guild/images/sk_hex.webp", "onDraw": ["hurt", 2]}, "x_glove": {"n": "不是妳的手", "c": -1, "t": "x", "r": 0, "ch": "none", "img": "../../raven-guild/images/sk_garrote.webp", "endHand": ["hurt", 3]}, "x_name": {"n": "被劃掉的名字", "c": -1, "t": "x", "r": 0, "ch": "none", "img": "../../raven-guild/images/sk_wither.webp", "noRemove": 1}, "yy_bloodpact": {"n": "以血立契", "c": 0, "t": "s", "r": 2, "ch": "yy", "img": "../../raven-guild/images/sk_rotcurse.webp", "fx": [["hurt", 3], ["pa", 4, "t"], ["ep", 1]], "u": {"fx": [["hurt", 3], ["pa", 6, "t"], ["ep", 1]]}}, "yy_snip": {"n": "剪斷", "c": 1, "t": "a", "r": 2, "ch": "yy", "img": "../../raven-guild/images/sk_snap.webp", "fx": [["hurt", 4], ["jd", 5]], "u": {"fx": [["hurt", 4], ["jd", 6]]}}, "yy_lastknot": {"n": "最後一個結", "c": 2, "t": "a", "r": 3, "ch": "yy", "img": "../../raven-guild/images/sk_chain.webp", "ex": 1, "fx": [["mhp", -3], ["lk"], ["da", 9, 1, "pact2"]], "u": {"fx": [["mhp", -3], ["lk"], ["da", 12, 1, "pact2"]]}}, "cl_bloodink": {"n": "以血研墨", "c": 0, "t": "s", "r": 2, "ch": "cl", "img": "../../raven-guild/images/sk_mend.webp", "fx": [["hurt", 3], ["ink", 3]], "u": {"fx": [["hurt", 3], ["ink", 4]]}}, "cl_mouthful": {"n": "把字吞下去", "c": 1, "t": "s", "r": 2, "ch": "cl", "img": "../../raven-guild/images/sk_vanish.webp", "keep": 1, "fx": [["hurt", 2], ["dr", 2], ["ink", 1]], "u": {"fx": [["hurt", 2], ["dr", 3], ["ink", 1]]}}, "cl_lastpage": {"n": "最後一頁", "c": 3, "t": "a", "r": 3, "ch": "cl", "img": "../../raven-guild/images/sk_pierce.webp", "ex": 1, "fx": [["mhp", -4], ["d", 18, 1, "ink2"]], "u": {"fx": [["mhp", -4], ["d", 24, 1, "ink2"]]}}, "yy_greed": {"n": "貪", "c": 1, "t": "a", "r": 1, "ch": "yy", "img": "../../raven-guild/images/sk_snap.webp", "fx": [["d", 7], ["gk", 8]], "u": {"fx": [["d", 10], ["gk", 12]]}}, "yy_grudge": {"n": "記仇", "c": 1, "t": "p", "r": 2, "ch": "yy", "img": "../../raven-guild/images/sk_hex.webp", "fx": [["pw", "grudge", 1]], "u": {"c": 0}}, "yy_sliteye": {"n": "豎瞳", "c": 1, "t": "p", "r": 3, "ch": "yy", "img": "../../raven-guild/images/sk_chain.webp", "fx": [["pw", "beast", 3]], "u": {"fx": [["pw", "beast", 5]]}}, "n_offering": {"n": "供品", "c": 0, "t": "s", "r": 1, "ch": "any", "img": "../../raven-guild/images/sk_incense.webp", "ex": 1, "fx": [["hurt", 2], ["en", 2]], "u": {"fx": [["hurt", 1], ["en", 2]]}}});
(function(){const mv={"matchmaker": [{"n": "下聘", "addCard": ["x_name", 1], "w": 1}], "papercopy": [{"n": "貼耳", "a": 4, "addCard": ["x_whisper", 1], "w": 1}], "debtlamp": [{"n": "握住", "addCard": ["x_glove", 1], "b": 6, "w": 1}]};for(const k in mv)DATA.enemies[k].mv.push(...mv[k]);})();
Object.assign(DATA.relics,{"eyebutton": {"n": "眼珠鈕扣", "ic": "../../raven-guild/images/i_seal.webp", "d": "每回合多 1 點能量。每場戰鬥開始時，抽牌堆加入一張「耳邊的低語」。"}, "borrowedheart": {"n": "借來的心跳", "ic": "../../raven-guild/images/i_leaf.webp", "d": "最大生命 +15。休息時回復的生命減半。"}, "namelesslamp": {"n": "無名者的燈", "ic": "../../raven-guild/images/i_torch.webp", "d": "打倒敵人時回復 3 生命。每場戰鬥開始時失去 3 生命。"}, "foxhair": {"n": "髮根的白狐毛", "ic": "../../raven-guild/images/i_moss.webp", "ch": "yy", "d": "生命第一次低於一半時，回復 10 生命，並給所有敵人 3 層厄契。"}, "tornphoto": {"n": "撕掉一半的合照", "ic": "../../raven-guild/images/i_moss.webp", "d": "撿起時，牌組加入一張「被劃掉的名字」。每場戰鬥第一回合多抽 3 張牌。"}});
DATA.events.push(...[{"id": "lostglove", "n": "失物招領", "img": "../../raven-guild/images/bg_sort.webp", "txt": "櫃檯上擺著一隻手套，尺寸剛好是妳的手。登記簿上寫著領取人是妳，日期是明天。", "opts": [{"t": "簽名領走", "r": [{"relicRandom": 1}, {"card": "x_glove"}], "d": "得到一件遺物，牌組加入一張「不是妳的手」"}, {"t": "簽別人的名字", "r": [{"gold": 45}, {"card": "x_name"}], "d": "得到 45 渡鴉幣，牌組加入「被劃掉的名字」"}, {"t": "假裝沒看到", "r": [], "d": "離開"}]}, {"id": "knock", "n": "敲門聲", "img": "../../raven-guild/images/bg_inn.webp", "txt": "門外有人用妳自己的聲音叫妳開門。聲音很溫柔，也很耐心。", "opts": [{"t": "開門（失去 10 生命）", "r": [{"hurt": 10}, {"cardRare": 1}], "d": "失去 10 生命，得到一張稀有的牌"}, {"t": "把耳朵貼上去", "r": [{"upgradeRandom": 2}, {"card": "x_whisper"}], "d": "隨機升級兩張牌，牌組加入「耳邊的低語」"}, {"t": "用身體頂住門", "r": [{"hurt": 3}], "d": "失去 3 生命，敲門聲停了"}]}, {"id": "scale", "n": "空著的秤", "img": "../../raven-guild/images/bg_stele.webp", "txt": "秤的一邊放著一顆還在跳的東西，另一邊空著。旁邊寫著：請放上等重的。", "opts": [{"t": "放上一張牌", "r": [{"removePick": 1}, {"maxhp": 6}], "d": "移除一張牌，最大生命 +6"}, {"t": "放上自己的一部分", "r": [{"maxhp": -8}, {"relicRandom": 1}, {"relicRandom": 1}], "d": "最大生命 -8，得到兩件遺物"}, {"t": "把那顆東西拿走", "r": [{"heal": 20}, {"card": "x_whisper"}, {"card": "x_whisper"}], "d": "回復 20 生命，牌組加入兩張「耳邊的低語」"}]}]);
Object.assign(DATA.powers,{grudge:'每次受到攻擊傷害，攻擊者獲得 {n} 層厄契。',beast:'生命低於一半時，攻擊牌傷害 +{n}。'});
// 聲音 v0.3
DATA.audio.bgm={bgm_title:{loopEnd:98.22},bgm_map:{loopEnd:65.61},bgm_battle:{loopEnd:55.99},bgm_boss:{loopEnd:130.84},bgm_rest:{loopEnd:78.55}};
DATA.audio.jingle=['jingle_win','jingle_lose','jingle_clear'];
DATA.audio.scene.elite='bgm_battle';

DATA.T=(typeof module!=='undefined')?require('./text.js'):root.CARD_TEXT;
// ── v0.4（團隊 v0.5 包第一段：退出、殘響、守燈處、位階）
DATA.echo={fromMemory:1,quitRate:0.5};
DATA.keeper=[
 {id:'m_hp1',n:'多一口氣',cost:30,d:'起始最大生命 +5。'},
 {id:'m_hp2',n:'再多一口氣',cost:90,need:'m_hp1',d:'起始最大生命再 +5。'},
 {id:'m_gold',n:'口袋裡的零錢',cost:40,d:'起始渡鴉幣 +40。'},
 {id:'m_relic',n:'舊行李',cost:120,d:'出發時，從 3 件普通遺物裡選 1 件。'},
 {id:'m_remove',n:'剪掉的線頭',cost:80,d:'出發時，可以移除起始牌組的 1 張牌。'},
 {id:'m_rest',n:'溫著的茶',cost:60,d:'營火休息多回復 5 生命。'},
 {id:'m_purge',n:'淨火',cost:70,d:'營火多一個選項：燒掉一張詛咒（燒了就不能休息）。'},
 {id:'m_skip',n:'第二張地圖',cost:100,d:'每一層還沒出發前，可以重抽一次地圖。'}
];
DATA.rarity={0:{n:'起始',color:'#5A5A5E'},1:{n:'紙',color:'#A8ADB4'},2:{n:'墨',color:'#2E5E63'},3:{n:'緋',color:'#B08A3E'},origin:{n:'契',color:'#8E1B24'},x:{n:'詛咒',color:'#2E1A33'}};

// ── v0.5（第一批後半：本源、三相、送回）
DATA.chars.yy.origin='B01';DATA.chars.cl.origin='lamp';
DATA.origins={
 yy_B01:{n:'九尾妖狐',ch:'yy',unlock:0,skin:'y_skin_B01',passive:'firstAtkPact1',swap:null,d:'每場戰鬥第一張攻擊牌給予 1 層厄契。'},
 yy_M01:{n:'毒蛇',ch:'yy',unlock:60,skin:'y_skin_M01',passive:'pactGrow1',swap:['b_coil',2],d:'敵人身上的厄契每回合結束 +1（最多 10）。兩張「打擊」換成「纏頸」。'},
 yy_M03:{n:'蜘蛛',ch:'yy',unlock:100,skin:'y_skin_M03',passive:'linkPlus1',swap:['b_web',2],d:'命線多連 1 回合。兩張「打擊」換成「張網」。'},
 yy_M02:{n:'蠍子',ch:'yy',unlock:140,skin:'y_skin_M02',passive:'judgeKillHeal3',swap:['b_sting',2],d:'用「裁定」打倒敵人時，回復 3 生命。兩張「打擊」換成「尾針」。'},
 cl_lamp:{n:'燈',ch:'cl',unlock:0,skin:'cl_base',passive:null,swap:null,d:'照亮別人的路。原本的牌組。'},
 cl_paper:{n:'紙',ch:'cl',unlock:60,skin:'cl_skin_paper',passive:'keepBlock2',swap:['b_carve',2],d:'保留的牌每回合給 2 格擋。兩張「打擊」換成「刻字」。'},
 cl_ink:{n:'墨',ch:'cl',unlock:120,skin:'cl_skin_ink',passive:'ink6Double',swap:['b_dot',2],d:'墨到 6 時，下一張攻擊牌傷害加倍，墨歸零。兩張「打擊」換成「點硃」。'}
};
for(const k in DATA.origins){const o=DATA.origins[k];o.id=k.split('_')[1];o.img=DATA.inbox+o.skin+'.webp';if(o.ch==='yy'){o.half=DATA.inbox+'y_'+o.id+'_half.webp';o.full=DATA.inbox+'y_'+o.id+'_full.webp';}}
Object.assign(DATA.cards,{
 b_coil:{n:'纏頸',c:1,t:'s',r:0,ch:'yy',bl:'M01',img:sk('tie'),fx:[['pa',3,'t'],['b',4]],u:{fx:[['pa',4,'t'],['b',6]]},ph:{half:{fx:[['pa',5,'t'],['b',4],['dr',1]]},full:{fx:[['pa',8,'t'],['b',4],['stun']]}}},
 b_web:{n:'張網',c:1,t:'s',r:0,ch:'yy',bl:'M03',img:sk('web'),fx:[['lk'],['b',3]],u:{fx:[['lk'],['b',6]]}},
 b_sting:{n:'尾針',c:1,t:'a',r:0,ch:'yy',bl:'M02',img:sk('pierce'),fx:[['d',4,1,'pact1']],u:{fx:[['d',6,1,'pact1']]}},
 b_carve:{n:'刻字',c:1,t:'s',r:0,ch:'cl',bl:'paper',img:sk('brace'),keep:1,fx:[['b',7]],u:{fx:[['b',10]]}},
 b_dot:{n:'點硃',c:1,t:'a',r:0,ch:'cl',bl:'ink',img:sk('thrust'),fx:[['d',5],['ink',2]],u:{fx:[['d',7],['ink',2]]}},
 yy_restrain:{n:'收斂',c:1,t:'s',r:1,ch:'yy',img:sk('brace'),fx:[['al',-20],['b',6]],u:{fx:[['al',-20],['b',9]]}},
 yy_release:{n:'放任',c:0,t:'s',r:1,ch:'yy',img:sk('rotcurse'),ex:1,fx:[['al',25],['hurtq',3]],u:{fx:[['al',25],['hurtq',1]]}}
});
for(const id of ['slip','papercopy','envelope'])if(DATA.enemies[id])DATA.enemies[id].timid=1;

DATA.yyEx=['smug','laugh','pout','annoy'];['smug','laugh','pout','annoy'].forEach(k=>DATA.chars.yy.ex[k]=DATA.inbox+'y_ex_'+k+'.webp');
DATA.yxEx={laugh:DATA.inbox+'yx_ex_laugh.webp',fang:DATA.inbox+'yx_ex_fang.webp',sneer:DATA.inbox+'yx_ex_sneer.webp'};
DATA.layers[0].n='第一層・紙信階梯';DATA.layers[0].bg=DATA.inbox+'bg_dive1.webp';
DATA.layers[1].n='第二層・浸水檔案廳';DATA.layers[1].bg=DATA.inbox+'bg_dive2.webp';
DATA.layers[2].n='第三層・礦渣深淵';DATA.layers[2].bg=DATA.inbox+'bg_dive3.webp';
DATA.cover=DATA.inbox+'title_cover.webp';
DATA.audio.sfx=["sfx_block", "sfx_breakthrough", "sfx_button", "sfx_card_lift", "sfx_card_locked", "sfx_card_play", "sfx_card_return", "sfx_coin", "sfx_combo", "sfx_corrupt", "sfx_door", "sfx_draw", "sfx_form_B01", "sfx_form_B02", "sfx_form_B03", "sfx_form_B04", "sfx_form_B05", "sfx_form_B06", "sfx_form_B07", "sfx_form_B08", "sfx_form_B09", "sfx_form_B10", "sfx_form_B11", "sfx_form_M01", "sfx_form_M02", "sfx_form_M03", "sfx_form_M04", "sfx_form_M05", "sfx_form_M06", "sfx_form_M07", "sfx_form_M08", "sfx_form_M09", "sfx_form_M10", "sfx_form_M11", "sfx_form_M12", "sfx_form_ink", "sfx_form_lamp", "sfx_form_paper", "sfx_heal", "sfx_heartbeat_loop", "sfx_hit", "sfx_hit_crit", "sfx_hit_heavy", "sfx_hurt", "sfx_ink", "sfx_judge", "sfx_kill", "sfx_mon_eldritch_appear", "sfx_mon_eldritch_atk", "sfx_mon_eldritch_die", "sfx_mon_flesh_appear", "sfx_mon_flesh_atk", "sfx_mon_flesh_die", "sfx_mon_xian_appear", "sfx_mon_xian_atk", "sfx_mon_xian_die", "sfx_pact", "sfx_pact_envy", "sfx_pact_glutton", "sfx_pact_greed", "sfx_pact_grudge", "sfx_pact_obsess", "sfx_pact_pride", "sfx_pact_vanity", "sfx_pact_wrath", "sfx_part_break", "sfx_purify", "sfx_recall", "sfx_relic", "sfx_reveal", "sfx_shuffle", "sfx_stroke", "sfx_transform", "sfx_turn", "sfx_unlock", "sfx_upgrade", "sfx_well", "sfx_wish_guard", "sfx_wish_home", "sfx_wish_letter", "sfx_wish_remember"];
DATA.audio.bgm.bgm_title={loopStart:6.13,loopEnd:163.02};
DATA.audio.amb={amb_dive1:30,amb_dive2:30,amb_dive3:30,amb_town:30};
for(const [k,v] of Object.entries({eyebutton:1,borrowedheart:1,namelesslamp:1,foxhair:1,tornphoto:1}))if(DATA.relics[k])DATA.relics[k].ic=DATA.inbox+'relic_'+k+'.webp';
DATA.cardArt=["cl_dad", "cl_home", "cl_lastpage", "cl_letter", "cl_long", "cl_sign", "cl_stroke", "strike", "x_glove", "x_name", "x_talisman", "x_whisper", "yy_backlash", "yy_bloodpact", "yy_judge", "yy_lastknot", "yy_queen", "yy_redfate", "yy_sliteye"];
for(const k of DATA.cardArt)if(DATA.cards[k])DATA.cards[k].img=DATA.inbox+'card_'+k+'.webp';

// ── v0.7（第二批：怪物三系與 12 隻敵人）。標「暫定」的數值規則沒寫，是我先補的，等規則大師定
const mi=n=>DATA.inbox+'m_'+n+'.webp';
Object.assign(DATA.enemies,{
 jiangshi_boy:{n:'走屍道童',img:mi('jiangshi_boy'),hp:[28,28],fac:'xian',realm:1,mv:[{n:'跳撲',a:7,w:2},{n:'貼符',addHand:['x_talisman',1],w:1}]},
 incense_crone:{n:'燒香的老嫗',img:mi('incense_crone'),hp:[36,36],fac:'xian',realm:1,mv:[{n:'上香',realmAll:1,w:1},{n:'香灰',drawLess:1,w:1}]},
 alchemist:{n:'煉丹的師父',img:mi('alchemist'),hp:[72,72],elite:1,fac:'xian',realm:1,soloBreak:'吞丹',mv:[{n:'餵丹',healAlly:10,w:2},{n:'丹火',a:9,w:1}]}, // 丹火 9 暫定
 paper_twins:{n:'紙紮童男童女',img:mi('paper_twins'),hp:[16,16],fac:'xian',realm:1,twin:1,timid:1,mv:[{n:'拉手',a:4,w:2},{n:'鞠躬',b:4,w:1}]}, // 拉手 4、鞠躬 4 暫定
 faceless:{n:'沒有臉的鄰居',img:mi('faceless'),hp:[32,32],fac:'eldritch',hidden:1,stare:5,mimicBase:0,mv:[{n:'模仿',mimic:1,w:1}]},
 hands:{n:'數不完的手',img:mi('hands'),hp:[20,20],fac:'eldritch',hidden:1,stare:5,onDeath:['small_hand','small_hand'],mv:[{n:'抓',a:5,h:2,w:1}]},
 small_hand:{n:'更小的手',img:mi('hands'),hp:[8,8],fac:'eldritch',hidden:1,stare:5,mv:[{n:'抓住',grab:1,w:1},{n:'掐',a:3,w:1}]}, // 掐 3 暫定
 ticketer:{n:'叫號機',img:mi('ticketer'),hp:[26,26],fac:'eldritch',hidden:1,stare:5,call:1,mv:[{n:'叫號',call:1,w:1}]},
 welleye:{n:'井底的眼',img:mi('welleye'),hp:[80,80],elite:1,fac:'eldritch',hidden:1,stare:5,seq:1,mv:[{n:'凝視',gaze:15,w:1},{n:'閉眼',shut:1,w:1},{n:'睜眼',a:14,w:1},{n:'閉眼',shut:1,w:1},{n:'睜眼',a:14,w:1}]},
 stitcher:{n:'縫合工',img:mi('stitcher'),hp:[34,34],fac:'flesh',parts:[{id:'needle',n:'針',d:'攻擊 +2'}],mv:[{n:'刺',a:6,w:2},{n:'縫',sew:1,w:1}]}, // 刺 6 暫定
 heartclock:{n:'心跳鐘',img:mi('heartclock'),hp:[40,40],fac:'flesh',parts:[{id:'spring',n:'發條',d:'倒數不受傷害影響'}],cd:4,boom:['報時',30],mv:[{n:'倒數',tick:1,w:1}]},
 oilworker:{n:'抽油的工人',img:mi('oilworker'),hp:[30,30],fac:'flesh',parts:[{id:'tube',n:'管子',d:'抽走墨，或把油污抹在牌上'}],noPart:6,mv:[{n:'抽',oil:1,w:1}]}, // 管子壞了以後揮管 6 暫定
 ironlung:{n:'鐵肺修女',img:mi('ironlung'),hp:[85,85],elite:1,fac:'flesh',parts:[{id:'lung',n:'鐵肺',d:'妳自己失去生命時，她回復同樣多'},{id:'nail',n:'十字釘',d:'每回合 9 傷害'},{id:'horn',n:'擴音口',d:'每回合塞一張「耳邊的低語」'}],mv:[{n:'禱告',lung:1,w:1}]}
});
Object.assign(DATA.cards,{x_talisman:{n:'鎮屍符',c:-1,t:'x',r:0,ch:'none',img:DATA.inbox+'card_x_talisman.webp',lockAtk:1,purge:1}});
for(const [k,f] of Object.entries(DATA.T.CODEX_FAC||{}))if(DATA.enemies[k]&&!DATA.enemies[k].fac)DATA.enemies[k].fac=f;
DATA.layers[0].fights.push(['jiangshi_boy','incense_crone'],['paper_twins','paper_twins'],['jiangshi_boy','jiangshi_boy']);DATA.layers[0].elites.push(['alchemist','jiangshi_boy']);
DATA.layers[1].fights.push(['faceless'],['hands','ticketer'],['faceless','hands']);DATA.layers[1].elites.push('welleye');
DATA.layers[2].fights.push(['stitcher','oilworker'],['heartclock'],['stitcher','heartclock']);DATA.layers[2].elites.push('ironlung');
for(const [k,b] of Object.entries(DATA.T.BESTIARY_NEW||{})){const id=k.replace(/^m_/,'');if(DATA.codex)DATA.codex[id]=b.codex;if(DATA.enemies[id])DATA.enemies[id].deep=b.deep,DATA.enemies[id].obj=b.obj;}
if(DATA.codex)DATA.codex.small_hand=DATA.T.CARD_TEXT_NEW.x_small_hand.d;

// ── v0.7（第二批：慾望契、心願、個性、癖好）
const TX=DATA.T;
DATA.desires={ // 語嫣（wrath 只有語熙掌身能選）
 greed:{ch:'yy',good:'渡鴉幣 +50%，商店多一件商品',bad:'每次進商店，異化值 +10'},
 glutton:{ch:'yy',good:'打倒敵人回 2 生命；營火休息多回 10',bad:'每場戰鬥開始失去 3 生命'},
 grudge:{ch:'yy',good:'每場戰鬥開局就有「記仇」；打過妳的敵人，受到的傷害 +2',bad:'營火不能磨牌，只能休息'},
 obsess:{ch:'yy',good:'每場第一張打出的牌，回合結束回到手上一次',bad:'每場的卡牌獎勵少 1 張可選'},
 vanity:{ch:'yy',good:'異化值低於 40 時，所有牌傷害 +2',bad:'異化值 40 以上時，所有牌傷害 -1'},
 pride:{ch:'yy',good:'首領和菁英的獎勵加倍',bad:'不肯低頭：求饒、讓步的選項不能選'},
 envy:{ch:'yy',good:'每場開始，複製敵人身上的一個增益',bad:'敵人有增益時，妳得到的格擋 -2'},
 wrath:{ch:'yx',good:'語熙接手的回合，傷害 ×2',bad:'只有語熙掌身的局能選'},
 home:{ch:'cl',good:'每走完一層，多回 15 生命',bad:'這一局不能在商店買遺物'},
 letter:{ch:'cl',good:'每場戰鬥開始多抽 1 張',bad:'手牌上限 -1'},
 guard:{ch:'cl',good:'每次得到格擋 +2',bad:'攻擊牌傷害 -1'},
 remember:{ch:'cl',good:'每次送回，多得 1 點燈火',bad:'不能移除牌組裡的牌'}
};
for(const k in DATA.desires){const t=(TX.DESIRE[k]||TX.CL_WISH[k]||{});Object.assign(DATA.desires[k],{id:k,n:t.n||k,d:t.d||'',pick:t.pick,sfx:(DATA.desires[k].ch==='cl'?'sfx_wish_':'sfx_pact_')+k});}
DATA.personas={
 lazy:{ch:'yy',def:1,fx:'營火多一個選項「睡久一點」：回滿生命，異化值 +15'},
 queen:{ch:'yy',fx:'商店的價錢 +20%（她只買貴的）'},
 sly:{ch:'yy',fx:'說謊更容易成功（事件用，數值待定）'},
 doting:{ch:'yy',fx:'下潛中沒有效果；帶著它通關，回家多一段話'},
 petty:{ch:'yy',fx:'曾經打倒她的敵人，再遇到時生命 -20%'},
 gentle:{ch:'cl',def:1,fx:'送回的門檻放寬 5%'},
 firm:{ch:'cl',fx:'菁英戰開場有 10 格擋'},
 stubborn:{ch:'cl',fx:'生命低於三成時，每回合多 1 能量；畫面不會變紅'},
 calm:{ch:'cl',fx:'「看不清」對她沒有用'}
};
for(const k in DATA.personas){const t=((TX.PERSONA||{})[DATA.personas[k].ch]||{})[k]||{};Object.assign(DATA.personas[k],{id:k,n:t.n||k,d:t.d||'',pick:t.pick});}
DATA.hobbies={
 names:{ch:'yy',fx:'每打倒一個菁英，下一場戰鬥開場多抽 1 張'},
 embroider:{ch:'yy',fx:'命線多連 1 回合'},
 tea:{ch:'yy',fx:'營火多一個選項「泡茶」：異化值 -25'},
 eyegem:{ch:'yy',fx:'不可名狀的敵人有三成機會掉「眼石」碎片，3 顆換 1 件遺物'},
 books:{ch:'cl',fx:'每層開始，看得到一個「？」的內容'},
 letters:{ch:'cl',fx:'每局一次，在營火寫信給下一局：留下 30 渡鴉幣，下一局開場撿到'},
 lamps:{ch:'cl',fx:'燈芯燒得慢一半'},
 bookmark:{ch:'cl',fx:'每移除一張牌得一張書籤：下一場戰鬥第一回合，可以把一張牌留在手上'}
};
for(const k in DATA.hobbies){const h=DATA.hobbies[k];const t=((TX.HOBBY||{})[h.ch]||{})[k]||{};Object.assign(h,{id:k,n:t.n||k,d:t.d||'',obj:t.obj||'',pick:t.pick});
 if(t.ev&&k!=='eyegem')DATA.events.push({id:t.ev.id,n:t.ev.n,txt:t.ev.txt,img:DATA.inbox+'bg_dive2.webp',ch:h.ch,hob:k,opts:t.ev.opts.map((o,i)=>({t:o.t,d:i===0?'得到「'+(t.obj||t.n)+'」：以後出發前可以選這個癖好':'離開',r:i===0?[{hobby:k}]:[]}))});}
DATA.enemies.welleye.drop='eyegem';
DATA.cards.yy_restrain.lock=null;

DATA.comReward=15; // 委託完成多拿的殘響（暫定）
DATA.coms=(TX.COMMISSIONS||[]).map(c=>Object.assign({},c,{ch:c.id==='c_return'?'cl':null}));
DATA.town={bg:DATA.inbox+'bg_alley.webp',spots:{home:[48,10],lamp:[62,33],board:[85,48],study:[82,72],well:[35,47],gate:[45,80],table:[15,72]},need:{home:1,board:1,study:2}};

// ── v0.8（第三批＋其餘本源）
DATA.scarNames=TX.SCAR_NAMES||{};
DATA.status.vine={n:'藤',ic:I+'st_regen.webp',d:'每回合開始失去 2 點生命（每層），語嫣回復 1 點。'};
Object.assign(DATA.cards,{
 x_fourth:{n:'第四副碗筷',c:-1,t:'x',r:0,ch:'none',img:sk('incense'),noRemove:1,fourth:1},
 b_hatch:{n:'孵化',c:0,t:'a',r:0,ch:'none',img:sk('hex'),ex:1,fx:[['d',3]]},
 yx_seize:{n:'奪',c:1,t:'a',r:0,ch:'yx',img:sk('snap'),fx:[['d',8],['seize']],u:{fx:[['d',11],['seize']]}},
 gu_note:{n:'記錄',c:1,t:'s',r:0,ch:'gu',img:sk('brace'),fx:[['b',6],['dos',1]],u:{fx:[['b',9],['dos',1]]}},
 gu_pull:{n:'調閱',c:0,t:'s',r:0,ch:'gu',img:sk('vanish'),fx:[['dd',2,1]],u:{fx:[['dd',3,1]]}},
 gu_shot:{n:'射擊',c:1,t:'a',r:0,ch:'gu',img:sk('pierce'),fx:[['d',6]],u:{fx:[['d',9]]}},
 gu_leak:{n:'漏頁',c:1,t:'s',r:0,ch:'gu',img:sk('mend'),fx:[['rc']],u:{c:0}}
});
const YD=DATA.chars.yy.deck.slice();{let n=2;for(let i=0;i<YD.length;i++)if(n&&YD[i]==='guard'){YD[i]='yx_seize';n--;}}
DATA.chars.yx={name:'語熙',title:'流蘇變紅的時候',hp:DATA.chars.yy.hp,img:DATA.inbox+'yx_base.webp',ex:DATA.yxEx,relic:DATA.chars.yy.relic,deck:YD.concat(['yy_release','yy_release']),origin:'B01',lock:'yx',
 desc:'語熙掌身：異化值從 60 開始，最低只會降到 40。自己每失去 1 點生命，就對隨機敵人造成同樣的傷害。完全非人維持 2 回合，沒有人會叫她回來。'};
DATA.chars.gu={name:'顧沉舟',title:'永遠少一頁的調查員',hp:60,img:DATA.inbox+'gu_base.webp',ex:{},relic:'bell',deck:['gu_note','gu_note','gu_note','gu_pull','gu_pull','gu_shot','gu_shot','gu_shot','gu_shot','gu_leak'],origin:null,lock:'gu',
 desc:'普通人，沒有異化值。每打完一場得到一頁「卷宗」，之後對同一系的敵人傷害 +1。抽牌堆不到 5 張時，每回合多 1 能量。每場可以用一次義眼，看穿一個敵人。'};
Object.assign(DATA.origins,{
 yy_B02:{n:'莉莉絲',passive:'shop20',d:'商店打 8 折；每場戰鬥開始，看穿一個「看不清」的敵人。'},
 yy_B03:{n:'拉彌亞',passive:'molt3',d:'每 3 回合蛻皮一次：清掉自己身上的虛弱和易傷。'},
 yy_B04:{n:'莎布',passive:'hatch',d:'打出能力牌時，手上多一張 0 費的「孵化」（3 傷害，消耗）。'},
 yy_B05:{n:'奈亞',passive:'mimicFirst',d:'每回合打出第一張牌後，手上多一張隨機另一張手牌的複製（這回合用）。'},
 yy_B06:{n:'哈斯塔',passive:'script',d:'照「攻擊→技能→能力」的順序打出，第三張免費。'},
 yy_B07:{n:'鬼新娘',passive:'brideLink',d:'被命線連住的敵人死掉時，其他被連住的敵人各失去 8 生命。'},
 yy_B08:{n:'巫妖',passive:'phylactery',d:'第一次死亡時，回到 30% 生命（每局一次）。'},
 yy_B10:{n:'黑山羊',passive:'sacrifice',d:'每失去 5 生命，得到 1 能量（每回合最多 2）。'},
 yy_M04:{n:'血蛭',passive:'leech',d:'每回合第一次造成攻擊傷害，回復其中 20%。'},
 yy_M05:{n:'蟲族',passive:'swarm',d:'多段攻擊時，每段多 1 傷害。'},
 yy_M06:{n:'史萊姆',passive:'slime',d:'格擋不會在回合開始全部消失，只少一半。'},
 yy_M07:{n:'章魚',passive:'hand12',d:'每回合多抽 1 張，手牌上限 12。'},
 yy_M08:{n:'水母',passive:'jelly',d:'每回合第一個攻擊妳的敵人，下回合力量 -2。'},
 yy_M09:{n:'鮟鱇',passive:'lure',d:'每場戰鬥開始放一盞誘燈（10 生命）替妳擋攻擊；它破掉時，所有敵人受 8 傷害。'},
 yy_M10:{n:'蛾',passive:'moth',d:'「看不清」對她沒有用；每回合第一次打出技能牌，異化值 +5。'},
 yy_M11:{n:'珊瑚',passive:'coral',d:'回合結束沒用完的能量，每 1 點變成 4 點不會消失的格擋。'},
 yy_M12:{n:'寄生藤',passive:'vine',d:'給予厄契時，同時種下 1 層「藤」：每層每回合讓敵人失去 2 生命，並讓妳回 1 生命。'},
 cl_window:{n:'窗',passive:'window',d:'送回的門檻放寬到 35%，而且不用付第二個代價。'}
});
for(const k in DATA.origins){const o=DATA.origins[k];if(o.id)continue;const [ch,id]=k.split('_');o.id=id;o.ch=ch;o.unlock=120;o.swap=null;o.skin=ch==='yy'?'y_skin_'+id:'cl_skin_'+id;o.img=DATA.inbox+o.skin+'.webp';if(ch==='yy'){o.half=DATA.inbox+'y_'+id+'_half.webp';o.full=DATA.inbox+'y_'+id+'_full.webp';}}
DATA.haveArt=["cl_skin_ink", "cl_skin_lamp", "cl_skin_paper", "cl_skin_window", "y_B01_full", "y_B01_half", "y_M01_full", "y_M01_half", "y_M02_full", "y_M02_half", "y_M03_full", "y_M03_half", "y_M04_full", "y_M04_half", "y_base", "y_ex_annoy", "y_ex_laugh", "y_ex_pout", "y_ex_smug", "y_skin_B01", "y_skin_M01", "y_skin_M02", "y_skin_M03", "y_skin_M04"];
for(const k in DATA.origins){const o=DATA.origins[k];const has=n=>DATA.haveArt.includes(n.split('/').pop().replace('.webp',''));if(!has(o.img))o.img=DATA.chars[o.ch].img;if(o.half&&!has(o.half))o.half=null;if(o.full&&!has(o.full))o.full=null;}
DATA.events.push({id:'left_card',special:1,n:'她留下的東西',img:DATA.inbox+'bg_dive1.webp',txt:'階梯的轉角放著一張牌，正面朝下。背面有妳的指紋。是上一次沒能帶回去的。',opts:[
 {t:'撿起來（失去 10 生命）',r:[{leftTake:1}],d:'失去 10 生命，把上一局留下的那張牌放回牌組'},
 {t:'讓它留在這裡',r:[{leftSkip:1}],d:'離開。它不會再等了'}]});
['start','win','lose'].forEach(k=>{const T0=DATA.talk[k];if(!T0)return;const U=TX.UNLOCK_CHARS||{};T0.yx=[(U.yuxi&&U.yuxi.inRun||[['yx',null,'……']])[k==='start'?2:k==='win'?3:0]];T0.gu=[(U.gu&&U.gu.inRun||[['gu',null,'……']])[k==='start'?3:k==='win'?0:4]];});

// ── 公告（新的放最上面）
DATA.notes=[
 {ver:'v0.8',lines:[
  '語嫣的本源補到 21 種、克勞德多了「窗」：每一種有自己的被動，在下潛井選。還沒有圖的先用原本的立繪。',
  '會留疤的牌：用血換力量的牌，每讓語嫣失去 1 生命就多一道疤。疤越多打得越重，九道疤以後，那張牌會換一個名字。',
  '語熙圈牌：異化值過 60，每回合有一張牌被紅圈圈起來。打出去效果加倍，不打，下回合少抽一張。',
  '第四副碗筷：從第三次下潛起，牌組裡會多一張拿不掉的牌。每一局，上面的字多看得清楚一點。',
  '死掉的時候會留一張牌在下面。下一次，在第一層可以花 10 生命把它撿回來。',
  '地圖會跟著異化值變：越不像人，休息點越少、商店越多。',
  '兩個新的下潛者（要先解鎖）：語熙掌身，和調查員顧沉舟。',
  '第二層的菁英會掉「漏頁」，集滿九張再通關第二層，顧沉舟就會出現。'
 ]},
 {ver:'v0.7',lines:[
  '渡鴉巷：標題畫面改成從「進入渡鴉巷」開始。巷子裡有織命坊、守燈處、委託牆、書房、下潛井，還有一扇封住的門和一張擺著碗筷的桌子。有些地方要先下去一兩次才會開。',
  '出發前可以選更多：本源之後，語嫣能跟一種慾望立契（貪、饞、怨、執、艷、傲、嫉），克勞德能帶一個心願；再選個性和癖好。每一種都有好處，也都有代價。',
  '委託牆：每次下潛可以撕一張委託，完成了多帶回殘響。',
  '三種新的怪物：修仙的會累積「境界」然後突破；不可名狀的「看不清」牠要做什麼，打中才看得見；血肉機械的身上有「零件」，打掉就少一種能力。共 12 隻新敵人，分散在三層。',
  '新詛咒「鎮屍符」：在手上時不能打出攻擊牌，花 1 能量撕掉。',
  '個性在書房用回憶解鎖；癖好要在下面撿到對應的小東西才會出現。'
 ]},
 {ver:'v0.6',lines:[
  '手牌改成扇形，像真的拿在手上。點一下拿起來，再點一次（或點敵人）打出；也可以直接把牌拖到敵人身上。',
  '打擊感：出牌有光尾、大傷害會震動和定格、連續打出三張攻擊會跳出連擊數、敵人死掉會化成灰。',
  '聲音：每一層有自己的環境底噪；生命很低時會聽到心跳、畫面四周變紅；半妖和完全非人時音樂會變悶。',
  '燈的選單裡多了「聲音」，裡面可以調特效強度（低／中／高）。',
  '頂欄變簡單了：聲音按鈕收進燈的選單裡。'
 ]},
 {ver:'v0.5',lines:[
  '本源：出發前可以選型態。語嫣有九尾妖狐、毒蛇、蜘蛛、蠍子；克勞德有燈、紙、墨。用累積的回憶解鎖，各有一個被動，並換掉兩張起始牌。',
  '語嫣多了「異化值」和三相：人形、半妖、完全非人。用血換力量、抽到詛咒都會讓她越來越不像人；到 100 會變相一回合，所有牌免費，然後被克勞德叫回來。',
  '新牌「收斂」「放任」：自己決定要壓住，還是放出來。異化值過 60，語熙會醒，偶爾接手一回合。',
  '克勞德多了「送回」：敵人生命低於四分之一時，頭上會亮起一盞燈，可以把牠送回去，不用打倒。每次送回燒一段燈芯，十段燒完換一次「燈照」，讓所有敵人停手一回合。',
  '三層換上新的名字和背景：紙信階梯、浸水檔案廳、礦渣深淵。語嫣的表情、更多卡圖和遺物圖示也接上了。',
  '標題音樂換成新的主題曲。'
 ]},
 {ver:'v0.4',lines:[
  '右上角多了一盞「燈」：隨時可以暫離（存好這一局）或放棄這一局。',
  '新增「殘響」：每次下潛結束都會帶回，等於這局的回憶；放棄的話只剩一半。',
  '標題畫面多了「守燈處」：用殘響換 8 種永久強化，例如多一口氣、舊行李、淨火、第二張地圖。',
  '牌框改成位階顏色：起始、紙、墨、緋、契、詛咒，一眼就看得出牌的等級。',
  '存檔改版：戰鬥中關掉遊戲，回來會從這場戰鬥的開頭重新來過，不能再用重開來換手牌。舊存檔會自動轉換。'
 ]},
 {ver:'v0.3',lines:[
  '風格轉暗：本作改為限 20 歲以上，第一次進入時會確認年齡。',
  '語嫣換上新的立繪，身分改為織命坊的主人、渡鴉的伴侶；克勞德是渡鴉的女兒，兩人互認姐妹。',
  '所有事件、對話、圖鑑和回憶之書改寫成更詭異的版本，新增「失物招領」「敲門聲」「空著的秤」三個兩難事件。',
  '新增代價牌（用生命換力量）和三種詛咒牌；語嫣多了「貪」「記仇」「豎瞳」。',
  '新增五件有代價的遺物，例如「眼珠鈕扣」「借來的心跳」。',
  '卡牌、敵人和遺物換上新名字。',
  '地圖、戰鬥、首領、營火都有了自己的音樂，打贏會有短曲。']},
 {ver:'v0.2.1',lines:['標題畫面多了「公告」，每次更新都會寫在這裡；版本號碼寫在標題畫面最下面。']},
 {ver:'v0.2',lines:[
  '克勞德有了自己的樣子：選角和對話都會看到她，表情會跟著台詞變。',
  '語嫣多了「命線流」、克勞德多了「保留流」，各 9 張新牌。',
  '每層多了 3 種新敵人：會拆出小怪的、會分裂的、會偷牌的、會讓牌變貴的、會吸墨的、會解掉厄契的、會塞疲勞的。',
  '新增 10 件遺物、12 個事件。',
  '第一次遇到每種敵人，兩姐妹會說一句話；營火旁會閒聊；圖鑑裡點怪物可以讀牠的故事。',
  '回憶之書多了 5 篇故事。',
  '有了音樂和音效，頂欄的 ♪ 可以開關。',
  '第一層的首領「退件執事・無簽」變得好打一點。']},
 {ver:'v0.1',lines:['語嫣和克勞德往下走的第一天。']}
];
if(typeof module!=='undefined')module.exports=DATA;else root.CARD_DATA=DATA;
})(this);
