// 《永生戰棋》資料（世界觀＝渡鴉公會；數值都是測試提案，不是正史）
(function(root){
const DATA={
 rulesetVersion:'v0.3',
 artRoot:'assets/art/',
 // 輕量版：直接用 inbox 原圖與渡鴉公會網站上的圖（之後有整理好的 assets 再拿掉這張表）
 artMap:{"terrain/t_plain.webp": "inbox/grok_1793874360251.jpg", "terrain/t_forest.webp": "inbox/grok_1793874364828.jpg", "terrain/t_hill.webp": "inbox/grok_1793874367354.jpg", "terrain/t_swamp.webp": "inbox/grok_1793874369982.jpg", "terrain/t_wall.webp": "inbox/grok_1793874372208.jpg", "terrain/t_gate.webp": "inbox/grok_1793874374474.jpg", "terrain/t_shallow.webp": "inbox/grok_1793874377521.jpg", "terrain/t_deep.webp": "inbox/grok_1793874380360.jpg", "terrain/t_flesh.webp": "inbox/grok_1793874383076.jpg", "terrain/t_rubble.webp": "inbox/grok_1793874386264.jpg", "icons/sk_guard.webp": "inbox/grok_1793874392069.jpg", "icons/sk_pierce.webp": "inbox/grok_1793874395253.jpg", "icons/sk_lamp.webp": "inbox/grok_1793874398055.jpg", "icons/sk_mark.webp": "inbox/grok_1793874400976.jpg", "icons/sk_mend.webp": "inbox/grok_1793874403938.jpg", "icons/sk_bind.webp": "inbox/grok_1793874406930.jpg", "icons/sk_shadow.webp": "inbox/grok_1793874410153.jpg", "icons/fm_shieldwall.webp": "inbox/grok_1793874412830.jpg", "icons/fm_pike.webp": "inbox/grok_1793874415961.jpg", "icons/fm_skirmish.webp": "inbox/grok_1793874418935.jpg", "icons/fm_assault.webp": "inbox/grok_1793874422056.jpg", "status/st_root.webp": "inbox/grok_1793874666398.jpg", "status/st_mark.webp": "inbox/grok_1793874669089.jpg", "status/st_guard.webp": "inbox/grok_1793874671632.jpg", "status/st_defend.webp": "inbox/grok_1793874681100.jpg", "icons/tr_infantry.webp": "inbox/grok_1793874684370.jpg", "icons/tr_cavalry.webp": "inbox/grok_1793874691055.jpg", "icons/tr_archer.webp": "inbox/grok_1793874694645.jpg", "icons/tr_flying.webp": "inbox/grok_1793874698569.jpg", "icons/tr_mage.webp": "inbox/grok_1793874701551.jpg", "icons/tr_cleric.webp": "inbox/grok_1793874704650.jpg", "icons/tr_beast.webp": "inbox/grok_1793874707721.jpg", "icons/tr_spear.webp": "inbox/grok_1793874762484.jpg", "backgrounds/cover.webp": "inbox/grok_1793874478434.jpg", "heroes/tok_shieldF.webp": "../raven-guild/images/h_shieldF.webp", "heroes/por_shieldF.webp": "../raven-guild/images/h_shieldF.webp", "heroes/tok_spear.webp": "../raven-guild/images/h_spear.webp", "heroes/por_spear.webp": "../raven-guild/images/h_spear.webp", "heroes/tok_mageF.webp": "../raven-guild/images/h_mageF.webp", "heroes/por_mageF.webp": "../raven-guild/images/h_mageF.webp", "heroes/tok_moli.webp": "../raven-guild/art/opt/file_00000000b62481fbba1cd7e4208bd93f.webp", "heroes/por_moli.webp": "../raven-guild/art/opt/file_00000000b62481fbba1cd7e4208bd93f.webp", "heroes/tok_healerF.webp": "../raven-guild/images/h_healerF.webp", "heroes/por_healerF.webp": "../raven-guild/images/h_healerF.webp", "heroes/tok_spider.webp": "../raven-guild/images/h_spider.webp", "heroes/por_spider.webp": "../raven-guild/images/h_spider.webp", "heroes/tok_archerH.webp": "../raven-guild/images/h_archerH.webp", "heroes/por_archerH.webp": "../raven-guild/images/h_archerH.webp", "enemies/tok_dutyghost.webp": "../raven-guild/images/m_dutyghost.webp", "enemies/por_dutyghost.webp": "../raven-guild/images/m_dutyghost.webp", "enemies/tok_returndog.webp": "../raven-guild/images/m_returndog.webp", "enemies/por_returndog.webp": "../raven-guild/images/m_returndog.webp", "enemies/tok_stampbug.webp": "../raven-guild/images/m_stampbug.webp", "enemies/por_stampbug.webp": "../raven-guild/images/m_stampbug.webp", "enemies/tok_lackcrow.webp": "../raven-guild/images/m_lackcrow.webp", "enemies/por_lackcrow.webp": "../raven-guild/images/m_lackcrow.webp", "enemies/tok_deadletters.webp": "../raven-guild/images/m_deadletters.webp", "enemies/por_deadletters.webp": "../raven-guild/images/m_deadletters.webp", "enemies/tok_paper.webp": "../raven-guild/images/m_paper.webp", "enemies/por_paper.webp": "../raven-guild/images/m_paper.webp", "enemies/tok_palanquin.webp": "../raven-guild/art/opt/file_00000000970c820b8dd306530646d135.webp", "enemies/por_palanquin.webp": "../raven-guild/art/opt/file_00000000970c820b8dd306530646d135.webp", "enemies/tok_moneycrow.webp": "../raven-guild/art/opt/file_00000000e6d8821183a09c10fae8bf5c.webp", "enemies/por_moneycrow.webp": "../raven-guild/art/opt/file_00000000e6d8821183a09c10fae8bf5c.webp", "enemies/tok_redpaper.webp": "../raven-guild/art/opt/file_00000000f7c082118b7693f86fb0b21b.webp", "enemies/por_redpaper.webp": "../raven-guild/art/opt/file_00000000f7c082118b7693f86fb0b21b.webp", "enemies/tok_paleworship.webp": "../raven-guild/art/opt/file_00000000844c820b842051a31f79cd41.webp", "enemies/por_paleworship.webp": "../raven-guild/art/opt/file_00000000844c820b842051a31f79cd41.webp", "enemies/tok_whiteminer.webp": "../raven-guild/images/m_whiteminer.webp", "enemies/por_whiteminer.webp": "../raven-guild/images/m_whiteminer.webp", "enemies/tok_minecart.webp": "../raven-guild/images/m_minecart.webp", "enemies/por_minecart.webp": "../raven-guild/images/m_minecart.webp", "enemies/tok_rustrat.webp": "../raven-guild/images/m_rustrat.webp", "enemies/por_rustrat.webp": "../raven-guild/images/m_rustrat.webp", "enemies/tok_rustlung.webp": "../raven-guild/images/m_rustlung.webp", "enemies/por_rustlung.webp": "../raven-guild/images/m_rustlung.webp", "enemies/tok_leech.webp": "../raven-guild/images/m_leech.webp", "enemies/por_leech.webp": "../raven-guild/images/m_leech.webp", "bosses/tok_wusign.webp": "../raven-guild/images/b_wusign.webp", "bosses/por_wusign.webp": "../raven-guild/images/b_wusign.webp", "bosses/tok_paperking.webp": "../raven-guild/art/opt/file_00000000a06c81f5b3d8ea4b3a2e17d0.webp", "bosses/por_paperking.webp": "../raven-guild/art/opt/file_00000000a06c81f5b3d8ea4b3a2e17d0.webp", "bosses/tok_deepdrill.webp": "../raven-guild/images/b_deepdrill.webp", "bosses/por_deepdrill.webp": "../raven-guild/images/b_deepdrill.webp"},
 terrain:{
  PLAIN:{name:'平原',cost:1,def:0,pass:true,glyph:'',art:'terrain/t_plain.webp'},
  FOREST:{name:'森林',cost:2,def:.15,pass:true,glyph:'林',art:'terrain/t_forest.webp'},
  HILL:{name:'高地',cost:2,def:.10,pass:true,height:1,glyph:'丘',art:'terrain/t_hill.webp'},
  SWAMP:{name:'沼澤',cost:3,def:0,pass:true,glyph:'沼',art:'terrain/t_swamp.webp'},
  WALL:{name:'城牆',cost:99,def:.25,pass:false,blockLos:true,glyph:'牆',art:'terrain/t_wall.webp'},
  SHALLOW_WATER:{name:'淺水',cost:2,def:-.10,pass:true,glyph:'水',art:'terrain/t_shallow.webp'},
  DEEP_WATER:{name:'深水',cost:99,def:0,pass:false,glyph:'淵',art:'terrain/t_deep.webp',flyPass:true},
  FLESH:{name:'污染地',cost:2,def:-.10,pass:true,glyph:'肉',art:'terrain/t_flesh.webp'},
  RUBBLE:{name:'瓦礫',cost:2,def:.05,pass:true,glyph:'礫',art:'terrain/t_rubble.webp'},
  GATE:{name:'城門',cost:99,def:0,pass:false,blockLos:true,glyph:'門',art:'terrain/t_gate.webp'}
 },
 // 兵種克制：攻方 → 被克方
 // 經典三角：步→槍→騎→步；弓→飛；禁忌圈：聖職→妖物→法術→聖職
 counters:{INFANTRY:['SPEAR'],SPEAR:['CAVALRY'],CAVALRY:['INFANTRY'],ARCHER:['FLYING'],FLYING:[],MAGE:['CLERIC'],CLERIC:['BEAST'],BEAST:['MAGE']},
 troopIcon:{INFANTRY:'tr_infantry',SPEAR:'tr_spear',CAVALRY:'tr_cavalry',ARCHER:'tr_archer',FLYING:'tr_flying',MAGE:'tr_mage',CLERIC:'tr_cleric',BEAST:'tr_beast'},
 troopName:{INFANTRY:'步兵',SPEAR:'槍兵',CAVALRY:'騎兵',ARCHER:'弓兵',FLYING:'飛行兵',MAGE:'法術兵',CLERIC:'聖職兵',BEAST:'妖物兵'},
 units:{
  // 我方：渡鴉公會的外圍成員（各帶一支 5 人小隊）
  P_SHIELD:{name:'霜綾',cls:'鴉羽盾衛',glyph:'盾',hero:'shieldF',troop:'INFANTRY',hp:150,atk:24,def:24,mag:0,res:10,move:3,rmin:1,rmax:1,dmg:'PHYSICAL',hit:0,eva:0,soldiers:5,hpPer:16,skill:'guardStance'},
  P_SPEAR:{name:'槿',cls:'長槍手',glyph:'槍',hero:'spear',troop:'SPEAR',hp:122,atk:32,def:15,mag:0,res:8,move:3,rmin:1,rmax:1,dmg:'PHYSICAL',hit:5,eva:5,soldiers:5,hpPer:14,skill:'pierce'},
  P_LANTERN:{name:'夜漣',cls:'提燈術士',glyph:'燈',hero:'mageF',troop:'MAGE',hp:92,atk:9,def:7,mag:32,res:18,move:3,rmin:1,rmax:2,dmg:'MAGICAL',hit:5,eva:5,soldiers:5,hpPer:10,skill:'lampZone'},
  P_ARCHER:{name:'墨離',cls:'調查官（弓）',glyph:'弓',hero:'moli',troop:'ARCHER',hp:106,atk:30,def:9,mag:0,res:10,move:3,rmin:2,rmax:3,dmg:'PHYSICAL',hit:10,eva:10,soldiers:5,hpPer:11,skill:'markShot'},
  P_HEALER:{name:'青蒿',cls:'藥箱治療師',glyph:'醫',hero:'healerF',troop:'CLERIC',hp:92,atk:8,def:9,mag:18,res:20,move:3,rmin:1,rmax:2,dmg:'MAGICAL',hit:0,eva:5,soldiers:5,hpPer:10,skill:'mend'},
  P_WEAVER:{name:'織燭',cls:'紗橋結蛛（織者）',glyph:'織',hero:'spider',troop:'MAGE',hp:94,atk:10,def:9,mag:27,res:16,move:3,rmin:1,rmax:2,dmg:'MAGICAL',hit:5,eva:10,soldiers:5,hpPer:10,skill:'bind'},
  P_SCOUT:{name:'鳶',cls:'夜羽刺客（斥候）',glyph:'斥',hero:'archerH',troop:'INFANTRY',hp:104,atk:28,def:11,mag:0,res:10,move:4,rmin:1,rmax:1,dmg:'PHYSICAL',hit:10,eva:20,soldiers:5,hpPer:12,skill:'shadowStep'},
  // 敵方兵種模板（名字、圖由勢力決定）
  E_INF:{name:'步兵',glyph:'步',troop:'INFANTRY',hp:97,atk:26,def:15,mag:0,res:6,move:3,rmin:1,rmax:1,dmg:'PHYSICAL',hit:0,eva:0,soldiers:5,hpPer:14},
  E_CAV:{name:'騎兵',glyph:'騎',troop:'CAVALRY',hp:90,atk:29,def:11,mag:0,res:6,move:5,rmin:1,rmax:1,dmg:'PHYSICAL',hit:0,eva:5,soldiers:5,hpPer:14},
  E_ARC:{name:'弓兵',glyph:'弓',troop:'ARCHER',hp:74,atk:25,def:7,mag:0,res:8,move:3,rmin:2,rmax:3,dmg:'PHYSICAL',hit:5,eva:5,soldiers:5,hpPer:10},
  E_FLY:{name:'飛行兵',glyph:'飛',troop:'FLYING',hp:71,atk:24,def:7,mag:0,res:8,move:5,rmin:1,rmax:1,dmg:'PHYSICAL',hit:5,eva:15,soldiers:5,hpPer:10,fly:true},
  E_MAG:{name:'法術兵',glyph:'術',troop:'MAGE',hp:69,atk:6,def:6,mag:27,res:14,move:3,rmin:1,rmax:2,dmg:'MAGICAL',hit:5,eva:0,soldiers:5,hpPer:9},
  E_CLR:{name:'聖職兵',glyph:'聖',troop:'CLERIC',hp:76,atk:6,def:8,mag:23,res:18,move:3,rmin:1,rmax:2,dmg:'MAGICAL',hit:5,eva:0,soldiers:5,hpPer:10},
  E_BST:{name:'妖物兵',glyph:'妖',troop:'BEAST',hp:101,atk:28,def:12,mag:0,res:10,move:4,rmin:1,rmax:1,dmg:'PHYSICAL',hit:0,eva:5,soldiers:5,hpPer:14},
  E_CMD:{name:'指揮官',glyph:'將',troop:'INFANTRY',hp:178,atk:34,def:17,mag:0,res:12,move:4,rmin:1,rmax:1,dmg:'PHYSICAL',hit:10,eva:5,commander:true,soldiers:5,hpPer:18}
 },
 // 敵方勢力：每一場隨機抽一個（同一個種子一定抽到同一個）
 factions:{
  RETURN:{name:'退件局',desc:'地窖郵政的殘骸：退件、死信與巡廊的獵犬。',
   slots:[['E_MAG','死信群','deadletters'],['E_ARC','退件印章蟲','stampbug'],['E_CAV','巡廊退件犬','returndog'],['E_CAV','巡廊退件犬','returndog'],['E_INF','停擺的值班員','dutyghost'],['E_FLY','缺字紙鴉群','lackcrow']],
   commander:['E_CMD','退件執事・無簽','wusign',true],line:'「這份名單上，沒有你們的名字。退回。」'},
  PAPER:{name:'紙紮送葬隊',desc:'香火門後的送葬行列：紙紮、轎子與紙錢鴉。',
   slots:[['E_MAG','紅衣紙紮童','redpaper'],['E_FLY','紙錢鴉','moneycrow'],['E_CAV','抬轎無頭人','palanquin'],['E_CAV','抬轎無頭人','palanquin'],['E_INF','紙紮人','paper'],['E_CLR','淡臉香客','paleworship']],
   commander:['E_CMD','紙紮還魂主','paperking',true],line:'「吉時到了。開門，迎客。」'},
  MINE:{name:'白鐵礦坑',desc:'挖不停的白鐵礦坑：礦工的影子、載人的礦車、鏽蝕的鼠群。',
   slots:[['E_MAG','鏽肺','rustlung'],['E_ARC','管線水蛭','leech'],['E_CAV','載著人的礦車','minecart'],['E_CAV','載著人的礦車','minecart'],['E_INF','白鐵礦工的影子','whiteminer'],['E_BST','鏽齒鼠群','rustrat']],
   commander:['E_CMD','掘進機・深挖','deepdrill',true],line:'「往下。再往下。牆後面也是礦。」'}
 },
 // 污染：污染地會往外擴散（先預告、下一回合才生效）
 corruption:{perTile:8,spreadPerRound:2,spreadAt75:4,maxWarn:8,erodeSoldiers:1,buffAt50:.1,gateHitAt100:15},
 // 七職業測試技能（不是正史技能名）
 skills:{
  guardStance:{icon:'sk_guard',name:'守護姿態',cd:3,kind:'self',dur:2,share:.4,defUp:.1,desc:'2 回合：相鄰隊友受到的傷害，40% 改由盾衛承受；自己防禦 +10%。'},
  pierce:{icon:'sk_pierce',name:'貫穿突刺',cd:2,kind:'attack',range:[1,1],mult:1.1,line:true,noCounter:true,area:true,desc:'刺向相鄰敵人並穿到後面一格，兩個都吃 1.1 倍傷害，不會被反擊。'},
  lampZone:{icon:'sk_lamp',name:'燈界',cd:3,kind:'zone',range:[0,2],dur:2,buff:.1,desc:'在 2 格內放一個 3×3 燈界，2 回合：我方在裡面攻擊與防禦 +10%；燈界裡不會被污染擴散，也不會被異變改寫。'},
  markShot:{icon:'sk_mark',name:'弱點標記',cd:2,kind:'attack',mult:.9,mark:2,markAmp:.2,desc:'0.9 倍傷害並標記 2 回合：被標記的敵人受到的傷害 +20%。'},
  mend:{icon:'sk_mend',name:'光縫修復',cd:2,kind:'ally',range:[0,2],heal:.3,solHeal:.35,purify:true,desc:'2 格內隊友（含自己）回復 30% 生命、補回 35% 士兵，解除束縛與標記；目標腳下和四周的污染地淨化成平原。'},
  bind:{icon:'sk_bind',name:'束縛之線',cd:3,kind:'attack',range:[1,3],mult:.6,root:1,noCounter:true,desc:'3 格內，0.6 倍傷害，目標下一個回合不能移動（還能攻擊）。不會被反擊。'},
  shadowStep:{icon:'sk_shadow',name:'影徑',cd:2,kind:'dash',extraMove:1,ignoreZoc:true,flank:.2,desc:'這次移動 +1 而且無視控制區；之後可以攻擊，目標旁邊有我方隊友時傷害 +20%（背襲）。'}
 },
 // 軍陣：一次只能一種；換陣要用掉主要行動（可以先移動）
 forms:{
  NONE:{name:'無陣',desc:'沒有效果。'},
  SHIELD_WALL:{icon:'fm_shieldwall',name:'堅盾陣',physIn:-.15,move:-1,desc:'受到的物理傷害 −15%，移動 −1。'},
  PIKE:{icon:'fm_pike',name:'長槍陣',counterVsCav:.2,noCharge:true,desc:'反擊騎兵時傷害 +20%，騎兵衝鋒對你無效。'},
  SKIRMISH:{icon:'fm_skirmish',name:'散兵陣',areaIn:-.1,guardShare:.5,desc:'受到範圍傷害 −10%；守護姿態能分攤的比例減半。'},
  ASSAULT:{icon:'fm_assault',name:'突擊陣',atkOut:.15,counterIn:.1,desc:'主動攻擊 +15%，但受到反擊 +10%。'}
 },
 soldierBonus:.2, // 士兵滿編時攻防 +20%，人數越少越低
 charge:{minCost:3,bonus:.2},
 deploySlots:[[5,9],[6,8],[3,8],[4,9]],
 defaultTeam:['P_SHIELD','P_SPEAR','P_ARCHER','P_LANTERN'],
 missions:{
  MISSION_BC_001:{
   name:'黑鐘城・第一次圍攻',place:'黑鐘城',
   intro:'渡鴉公會的外圍成員抵達黑鐘城。城門還沒修好，霧裡已經有東西在靠近——守住這座城，它會是我們往外擴散的第一個據點。',w:12,h:12,roundLimit:8,
   map:[
    '...F....F...',
    '.F........F.',
    '....H.......',
    'DDw.....FF..',
    'Dw..F..SS...',
    'w...F..S..H.',
    '............',
    '.H.F....F...',
    '...H....H...',
    '............',
    'WWWWWGWWWWWW',
    '............'],
   legend:{'.':'PLAIN',F:'FOREST',H:'HILL',S:'SWAMP',W:'WALL',w:'SHALLOW_WATER',D:'DEEP_WATER',G:'GATE',X:'FLESH'},
   gate:{x:5,y:10,hp:300,def:10,res:0},
   enemySlots:[[5,0],[6,0],[5,1],[6,1],[3,2],[8,2]],commanderAt:[6,0],
   events:[
    {round:1,say:'鳶的回報：霧裡的隊伍從北方中路壓過來，快的那幾隻會先衝。'},
    {round:2,say:'東北的森林開始發出暗紅的微光——下一回合開始時，(8,3)、(9,3) 會變成污染地，之後還會往外擴散。',warn:[[8,3],[9,3]]},
    {round:5,spawnCommander:true,say:'指揮官從北方進場。擊倒他、而且城門還在，就能提前獲勝。'},
    {round:6,pressure:true,say:'城門壓力提高：敵人開始不顧一切地攻門。'}
   ],
   win:'守住城門到第 8 回合結束；或擊倒敵軍指揮官且城門還在。',
   lose:'城門被打破，或我方全滅。',
   outcomes:[
    {id:'HOLD_CLEAN',when:'守城成功、城門生命 ≥ 200',world:'民眾信任 +10、安定 +5',next:'下一場友軍補給與支援'},
    {id:'BROKEN_WALL',when:'勝利但城門生命 < 150',world:'安定 −10，記錄「破牆」',next:'城門出現破洞入口'},
    {id:'DEFEAT',when:'失敗後接受戰敗',world:'勢力掌控轉為危險、補給 −10',next:'觸發奪回城門的支線'}
   ]
  }
 }
};
if(typeof module!=='undefined'&&module.exports)module.exports=DATA;else root.TACTICS_DATA=DATA;
})(this);
