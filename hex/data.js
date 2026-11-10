// 渡鴉下潛（肉鴿卡牌試作）—— 資料
(function(root){
const I='../../raven-guild/images/';
const sk=n=>I+'sk_'+n+'.webp',m=n=>I+'m_'+n+'.webp';
const DATA={
 version:'v0.2',
 title:'渡鴉下潛',
 img:I,
 // ── 角色
 chars:{
  yy:{name:'語嫣',title:'織命的長女',hp:80,img:I+'y_base.webp',ex:{smug:I+'y_ex_smug.webp',laugh:I+'y_ex_laugh.webp',pout:I+'y_ex_pout.webp',annoy:I+'y_ex_annoy.webp'},
   relic:'thread',deck:['strike','strike','strike','strike','guard','guard','guard','guard','yy_bind','yy_reel'],
   desc:'把「厄契」纏在敵人身上：牠們每次出手都會被反噬，最後再一口氣裁定。',
   line:'呵呵……下面的東西，可沒有一個懂得守約呢。'},
  cl:{name:'克勞德',title:'守燈的二女兒',hp:76,img:null,
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
if(typeof module!=='undefined')module.exports=DATA;else root.CARD_DATA=DATA;
})(this);
