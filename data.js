// 《永生戰棋》資料（世界觀＝渡鴉公會；數值都是測試提案，不是正史）
(function(root){
const DATA={
 rulesetVersion:'v0.5',
 bgm:{title:'hall',base:'hall',map:'explore',battle:'battle',boss:'boss',win:'hall'},bgmRoot:'../raven-guild/audio/',
 prologue:[
  {img:'battle/bt_plain.webp',future:'pr_1',txt:'天闕大陸的北邊，白鐵礦城的礦坑從來沒有停過。'},
  {img:'backgrounds/fac_lighthouse.webp',future:'pr_1',txt:'渡鴉公會在城的北境有一座分站。這幾年，分站的燈一盞一盞熄了，只剩下礦坑底下的機器還在挖。'},
  {img:'backgrounds/fac_council.webp',future:'pr_2',txt:'這個月，暮簡村地方站收到一封退回來的信。信封上沒有寄件人，只有一枚燒焦的渡鴉印。'},
  {img:'backgrounds/cover_wall.webp',future:'pr_3',txt:'公會沒有派正式成員。去的是我們——名冊最後幾頁的外圍成員：還沒拿到徽章的盾衛、只會點燈的術士、背著藥箱的人。'},
  {img:'backgrounds/base_bg.webp',future:'pr_3',txt:'任務只有一句：「到白鐵礦城南門，把燈重新點起來。」'},
  {img:'battle/bt_gate.webp',future:'pr_4',txt:'我們到的那晚，南門已經破了一半。霧裡有提燈的隊伍，正慢慢往城門走過來。'}
 ],
 // 我方兵種對應的小兵圖（接戰演出）
 soldierArt:{P_SHIELD:'sd_shield',P_SPEAR:'sd_spear',P_LANTERN:'sd_lantern',P_ARCHER:'sd_archer',P_HEALER:'sd_healer',P_WEAVER:'sd_weaver',P_SCOUT:'sd_scout'},
 // 大地圖：白鐵礦城周圍（位置是圖上的比例；名稱是暫定）
 region:[
  {id:'south',scene:'bt_gate',name:'南門',x:.48,y:.61,mission:'MISSION_BC_001',desc:'據點的城門。守住它。'},
  {id:'mine',scene:'lv_mine',name:'礦坑入口',x:.17,y:.15,mission:'MISSION_MINE',needs:['MISSION_BC_001'],desc:'白鐵礦坑往地面的出口，機器的聲音沒有停過。'},
  {id:'post',scene:'lv_post',name:'廢棄驛站',x:.47,y:.12,mission:'MISSION_POST',needs:['MISSION_MINE'],desc:'以前的驛站，門口還掛著退件的牌子。'},
  {id:'wood',scene:'lv_wood',name:'枯樹林',x:.78,y:.16,mission:'MISSION_WOOD',needs:['MISSION_POST'],desc:'樹全死了，但林子裡有燈在走。'},
  {id:'fog',scene:'lv_fog',name:'霧裡的村落',x:.15,y:.41,mission:'MISSION_FOG',needs:['MISSION_WOOD'],desc:'看得到屋頂，走不到門口。'},
  {id:'marsh',scene:'lv_marsh',name:'沼澤',x:.8,y:.43,mission:'MISSION_MARSH',needs:['MISSION_WOOD'],desc:'水底下有東西在呼吸。'},
  {id:'bridge',scene:'lv_bridge',name:'石橋',x:.8,y:.62,mission:'MISSION_BRIDGE',needs:['MISSION_MARSH'],desc:'通往東邊唯一的路。'},
  {id:'bell',scene:'lv_bell',name:'鐘樓廢墟',x:.2,y:.68,mission:'MISSION_BELL',needs:['MISSION_FOG'],desc:'山丘上的鐘樓，鐘早就不見了，聲音還在。'},
  {id:'church',scene:'lv_church',name:'半塌的教堂',x:.72,y:.8,mission:'MISSION_CHURCH',needs:['MISSION_BRIDGE','MISSION_BELL'],desc:'祭壇上的香還沒燒完。'}
 ],
 artRoot:'assets/art/',
 // 輕量版：直接用 inbox 原圖與渡鴉公會網站上的圖（之後有整理好的 assets 再拿掉這張表）
 artMap:{"terrain/t_plain.webp": "inbox/grok_1793874360251.jpg", "terrain/t_forest.webp": "inbox/grok_1793874364828.jpg", "terrain/t_hill.webp": "inbox/grok_1793874367354.jpg", "terrain/t_swamp.webp": "inbox/grok_1793874369982.jpg", "terrain/t_wall.webp": "inbox/grok_1793874372208.jpg", "terrain/t_gate.webp": "inbox/grok_1793874374474.jpg", "terrain/t_shallow.webp": "inbox/grok_1793874377521.jpg", "terrain/t_deep.webp": "inbox/grok_1793874380360.jpg", "terrain/t_flesh.webp": "inbox/grok_1793874383076.jpg", "terrain/t_rubble.webp": "inbox/grok_1793874386264.jpg", "icons/sk_guard.webp": "inbox/grok_1793874392069.jpg", "icons/sk_pierce.webp": "inbox/grok_1793874395253.jpg", "icons/sk_lamp.webp": "inbox/grok_1793874398055.jpg", "icons/sk_mark.webp": "inbox/grok_1793874400976.jpg", "icons/sk_mend.webp": "inbox/grok_1793874403938.jpg", "icons/sk_bind.webp": "inbox/grok_1793874406930.jpg", "icons/sk_shadow.webp": "inbox/grok_1793874410153.jpg", "icons/fm_shieldwall.webp": "inbox/grok_1793874412830.jpg", "icons/fm_pike.webp": "inbox/grok_1793874415961.jpg", "icons/fm_skirmish.webp": "inbox/grok_1793874418935.jpg", "icons/fm_assault.webp": "inbox/grok_1793874422056.jpg", "status/st_root.webp": "inbox/grok_1793874666398.jpg", "status/st_mark.webp": "inbox/grok_1793874669089.jpg", "status/st_guard.webp": "inbox/grok_1793874671632.jpg", "status/st_defend.webp": "inbox/grok_1793874681100.jpg", "icons/tr_infantry.webp": "inbox/grok_1793874684370.jpg", "icons/tr_cavalry.webp": "inbox/grok_1793874691055.jpg", "icons/tr_archer.webp": "inbox/grok_1793874694645.jpg", "icons/tr_flying.webp": "inbox/grok_1793874698569.jpg", "icons/tr_mage.webp": "inbox/grok_1793874701551.jpg", "icons/tr_cleric.webp": "inbox/grok_1793874704650.jpg", "icons/tr_beast.webp": "inbox/grok_1793874707721.jpg", "icons/tr_spear.webp": "inbox/grok_1793874762484.jpg", "backgrounds/cover.webp": "inbox/grok_1793874478434.jpg", "heroes/tok_shieldF.webp": "../raven-guild/images/h_shieldF.webp", "heroes/por_shieldF.webp": "../raven-guild/images/h_shieldF.webp", "heroes/tok_spear.webp": "../raven-guild/images/h_spear.webp", "heroes/por_spear.webp": "../raven-guild/images/h_spear.webp", "heroes/tok_mageF.webp": "../raven-guild/images/h_mageF.webp", "heroes/por_mageF.webp": "../raven-guild/images/h_mageF.webp", "heroes/tok_moli.webp": "../raven-guild/art/opt/file_00000000b62481fbba1cd7e4208bd93f.webp", "heroes/por_moli.webp": "../raven-guild/art/opt/file_00000000b62481fbba1cd7e4208bd93f.webp", "heroes/tok_healerF.webp": "../raven-guild/images/h_healerF.webp", "heroes/por_healerF.webp": "../raven-guild/images/h_healerF.webp", "heroes/tok_spider.webp": "../raven-guild/images/h_spider.webp", "heroes/por_spider.webp": "../raven-guild/images/h_spider.webp", "heroes/tok_archerH.webp": "../raven-guild/images/h_archerH.webp", "heroes/por_archerH.webp": "../raven-guild/images/h_archerH.webp", "enemies/tok_dutyghost.webp": "../raven-guild/images/m_dutyghost.webp", "enemies/por_dutyghost.webp": "../raven-guild/images/m_dutyghost.webp", "enemies/tok_returndog.webp": "../raven-guild/images/m_returndog.webp", "enemies/por_returndog.webp": "../raven-guild/images/m_returndog.webp", "enemies/tok_stampbug.webp": "../raven-guild/images/m_stampbug.webp", "enemies/por_stampbug.webp": "../raven-guild/images/m_stampbug.webp", "enemies/tok_lackcrow.webp": "../raven-guild/images/m_lackcrow.webp", "enemies/por_lackcrow.webp": "../raven-guild/images/m_lackcrow.webp", "enemies/tok_deadletters.webp": "../raven-guild/images/m_deadletters.webp", "enemies/por_deadletters.webp": "../raven-guild/images/m_deadletters.webp", "enemies/tok_paper.webp": "../raven-guild/images/m_paper.webp", "enemies/por_paper.webp": "../raven-guild/images/m_paper.webp", "enemies/tok_palanquin.webp": "../raven-guild/art/opt/file_00000000970c820b8dd306530646d135.webp", "enemies/por_palanquin.webp": "../raven-guild/art/opt/file_00000000970c820b8dd306530646d135.webp", "enemies/tok_moneycrow.webp": "../raven-guild/art/opt/file_00000000e6d8821183a09c10fae8bf5c.webp", "enemies/por_moneycrow.webp": "../raven-guild/art/opt/file_00000000e6d8821183a09c10fae8bf5c.webp", "enemies/tok_redpaper.webp": "../raven-guild/art/opt/file_00000000f7c082118b7693f86fb0b21b.webp", "enemies/por_redpaper.webp": "../raven-guild/art/opt/file_00000000f7c082118b7693f86fb0b21b.webp", "enemies/tok_paleworship.webp": "../raven-guild/art/opt/file_00000000844c820b842051a31f79cd41.webp", "enemies/por_paleworship.webp": "../raven-guild/art/opt/file_00000000844c820b842051a31f79cd41.webp", "enemies/tok_whiteminer.webp": "../raven-guild/images/m_whiteminer.webp", "enemies/por_whiteminer.webp": "../raven-guild/images/m_whiteminer.webp", "enemies/tok_minecart.webp": "../raven-guild/images/m_minecart.webp", "enemies/por_minecart.webp": "../raven-guild/images/m_minecart.webp", "enemies/tok_rustrat.webp": "../raven-guild/images/m_rustrat.webp", "enemies/por_rustrat.webp": "../raven-guild/images/m_rustrat.webp", "enemies/tok_rustlung.webp": "../raven-guild/images/m_rustlung.webp", "enemies/por_rustlung.webp": "../raven-guild/images/m_rustlung.webp", "enemies/tok_leech.webp": "../raven-guild/images/m_leech.webp", "enemies/por_leech.webp": "../raven-guild/images/m_leech.webp", "bosses/tok_wusign.webp": "../raven-guild/images/b_wusign.webp", "bosses/por_wusign.webp": "../raven-guild/images/b_wusign.webp", "bosses/tok_paperking.webp": "../raven-guild/art/opt/file_00000000a06c81f5b3d8ea4b3a2e17d0.webp", "bosses/por_paperking.webp": "../raven-guild/art/opt/file_00000000a06c81f5b3d8ea4b3a2e17d0.webp", "bosses/tok_deepdrill.webp": "../raven-guild/images/b_deepdrill.webp", "bosses/por_deepdrill.webp": "../raven-guild/images/b_deepdrill.webp", "backgrounds/base_bg.webp": "inbox/grok_1793874425445.jpg", "backgrounds/recruit_bg.webp": "inbox/grok_1793874471833.jpg", "backgrounds/fac_council.webp": "inbox/grok_1793874428353.jpg", "backgrounds/fac_recruit.webp": "inbox/grok_1793874430947.jpg", "backgrounds/fac_barracks.webp": "inbox/grok_1793874448076.jpg", "backgrounds/fac_workshop.webp": "inbox/grok_1793874450875.jpg", "backgrounds/fac_lighthouse.webp": "inbox/grok_1793874453370.jpg", "backgrounds/fac_storage.webp": "inbox/grok_1793874455965.jpg", "backgrounds/cover_wall.webp": "inbox/grok_1793874474840.jpg", "ui/card_common.webp": "inbox/grok_1793874458608.jpg", "ui/card_elite.webp": "inbox/grok_1793874461359.jpg", "ui/card_legend.webp": "inbox/grok_1793874464413.jpg", "ui/card_back.webp": "inbox/grok_1793874468466.jpg", "fx/fx_slash.webp": "inbox/grok_1793877490158.jpg", "fx/fx_arrow.webp": "inbox/grok_1793877500480.jpg", "fx/fx_hit.webp": "inbox/grok_1793877508513.jpg", "fx/fx_crit.webp": "inbox/grok_1793877511871.jpg", "fx/fx_miss.webp": "inbox/grok_1793877515603.jpg", "fx/fx_lamp.webp": "inbox/grok_1793877573521.jpg", "fx/fx_heal.webp": "inbox/grok_1793877577062.jpg", "fx/fx_shadow.webp": "inbox/grok_1793877590864.jpg", "fx/fx_mark.webp": "inbox/grok_1793877593857.jpg", "fx/fx_corrupt.webp": "inbox/grok_1793877596623.jpg", "fx/fx_purify.webp": "inbox/grok_1793877599450.jpg", "fx/fx_rout.webp": "inbox/grok_1793877602504.jpg", "fx/fx_summon.webp": "inbox/grok_1793877605685.jpg", "battle/bt_plain.webp": "inbox/grok_1793877609306.jpg", "battle/bt_forest.webp": "inbox/grok_1793877612210.jpg", "battle/bt_gate.webp": "inbox/grok_1793877614927.jpg", "battle/bt_corrupt.webp": "inbox/grok_1793877617740.jpg", "soldiers/sd_shield.webp": "inbox/grok_1793877623933.jpg", "soldiers/sd_spear.webp": "inbox/grok_1793877626960.jpg", "soldiers/sd_lantern.webp": "inbox/grok_1793877630221.jpg", "soldiers/sd_archer.webp": "inbox/grok_1793877632922.jpg", "soldiers/sd_healer.webp": "inbox/grok_1793877635889.jpg", "soldiers/sd_weaver.webp": "inbox/grok_1793877639104.jpg", "soldiers/sd_scout.webp": "inbox/grok_1793877641990.jpg", "fx/fx_pierce.webp": "inbox/grok_1793877711031.jpg", "fx/fx_magic.webp": "inbox/grok_1793877713277.jpg", "fx/fx_guard.webp": "inbox/grok_1793877716817.jpg", "fx/fx_bind.webp": "inbox/grok_1793877720583.jpg", "backgrounds/mp_region.webp": "inbox/grok_1793877647112.jpg", "prologue/pr_1.webp": "inbox/grok_1793881280266.jpg", "prologue/pr_2.webp": "inbox/grok_1793881283151.jpg", "prologue/pr_3.webp": "inbox/grok_1793881286948.jpg", "prologue/pr_4.webp": "inbox/grok_1793881289553.jpg", "scenes/lv_mine.webp": "inbox/grok_1793881292816.jpg", "scenes/lv_post.webp": "inbox/grok_1793881295585.jpg", "scenes/lv_wood.webp": "inbox/grok_1793881297951.jpg", "scenes/lv_fog.webp": "inbox/grok_1793881300496.jpg", "scenes/lv_marsh.webp": "inbox/grok_1793881302786.jpg", "scenes/lv_bridge.webp": "inbox/grok_1793881305058.jpg", "scenes/lv_bell.webp": "inbox/grok_1793881308157.jpg", "scenes/lv_church.webp": "inbox/grok_1793881310594.jpg", "equip/eq_w_shield.webp": "inbox/grok_1793881314592.jpg", "equip/eq_w_spear.webp": "inbox/grok_1793881317291.jpg", "equip/eq_w_kit.webp": "inbox/grok_1793881339185.jpg", "equip/eq_w_thread.webp": "inbox/grok_1793881342073.jpg", "equip/eq_w_dagger.webp": "inbox/grok_1793881344946.jpg", "equip/eq_a_light.webp": "inbox/grok_1793881347433.jpg", "equip/eq_a_heavy.webp": "inbox/grok_1793881349958.jpg", "equip/eq_a_robe.webp": "inbox/grok_1793881352406.jpg", "equip/eq_t_badge.webp": "inbox/grok_1793881355085.jpg", "equip/eq_t_ring.webp": "inbox/grok_1793881357536.jpg", "equip/eq_t_charm.webp": "inbox/grok_1793881360118.jpg", "equip/eq_t_feather.webp": "inbox/grok_1793881362905.jpg", "items/it_ore.webp": "inbox/grok_1793881365140.jpg", "items/it_supply.webp": "inbox/grok_1793881367748.jpg", "items/it_ticket.webp": "inbox/grok_1793881370880.jpg", "items/it_record.webp": "inbox/grok_1793881373898.jpg", "items/it_relic.webp": "inbox/grok_1793881377927.jpg", "equip/eq_w_lantern.webp": "inbox/grok_1793881470715.jpg", "equip/eq_w_bow.webp": "inbox/grok_1793881473023.jpg"},
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
  STATION:{name:'驛站據點',cost:1,def:.1,pass:true,glyph:'驛',art:'terrain/t_plain.webp'},
  HOUSE:{name:'民房',cost:1,def:.1,pass:true,glyph:'屋',art:'terrain/t_rubble.webp'},
  BRIDGE:{name:'石橋',cost:1,def:0,pass:true,glyph:'橋',art:'terrain/t_rubble.webp'},
  LAMP:{name:'燈座',cost:1,def:.05,pass:true,glyph:'燈',art:'terrain/t_plain.webp'},
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
  E_INF:{name:'步兵',glyph:'步',troop:'INFANTRY',hp:103,atk:27,def:15,mag:0,res:6,move:3,rmin:1,rmax:1,dmg:'PHYSICAL',hit:0,eva:0,soldiers:5,hpPer:14},
  E_CAV:{name:'騎兵',glyph:'騎',troop:'CAVALRY',hp:95,atk:30,def:11,mag:0,res:6,move:5,rmin:1,rmax:1,dmg:'PHYSICAL',hit:0,eva:5,soldiers:5,hpPer:14},
  E_ARC:{name:'弓兵',glyph:'弓',troop:'ARCHER',hp:78,atk:26,def:7,mag:0,res:8,move:3,rmin:2,rmax:3,dmg:'PHYSICAL',hit:5,eva:5,soldiers:5,hpPer:10},
  E_FLY:{name:'飛行兵',glyph:'飛',troop:'FLYING',hp:75,atk:25,def:7,mag:0,res:8,move:5,rmin:1,rmax:1,dmg:'PHYSICAL',hit:5,eva:15,soldiers:5,hpPer:10,fly:true},
  E_MAG:{name:'法術兵',glyph:'術',troop:'MAGE',hp:73,atk:6,def:6,mag:28,res:14,move:3,rmin:1,rmax:2,dmg:'MAGICAL',hit:5,eva:0,soldiers:5,hpPer:9},
  E_CLR:{name:'聖職兵',glyph:'聖',troop:'CLERIC',hp:81,atk:6,def:8,mag:24,res:18,move:3,rmin:1,rmax:2,dmg:'MAGICAL',hit:5,eva:0,soldiers:5,hpPer:10},
  E_BST:{name:'妖物兵',glyph:'妖',troop:'BEAST',hp:107,atk:29,def:12,mag:0,res:10,move:4,rmin:1,rmax:1,dmg:'PHYSICAL',hit:0,eva:5,soldiers:5,hpPer:14},
  E_CMD:{name:'指揮官',glyph:'將',troop:'INFANTRY',hp:189,atk:35,def:17,mag:0,res:12,move:4,rmin:1,rmax:1,dmg:'PHYSICAL',hit:10,eva:5,commander:true,soldiers:5,hpPer:18}
 },

 // 渡鴉公會成員（招集名單）：rarity 0 常駐、1 精銳、2 傳世。圖用渡鴉公會網站上的原圖。
 rarityName:['常駐','精銳','傳世'],rarityMult:[1,1.08,1.16],starStep:.04,maxStar:5,
 heroes:[
  {id:'shieldF',name:'霜綾',title:'鴉羽盾衛',unit:'P_SHIELD',r:0,src:'images/h_shieldF.webp'},
  {id:'healerF',name:'青蒿',title:'藥箱治療師',unit:'P_HEALER',r:0,src:'images/h_healerF.webp'},
  {id:'mageF',name:'夜漣',title:'提燈術士',unit:'P_LANTERN',r:0,src:'images/h_mageF.webp'},
  {id:'archerH',name:'鳶',title:'夜羽刺客',unit:'P_SCOUT',r:0,src:'images/h_archerH.webp'},
  {id:'shieldM',name:'鐵崇',title:'鴉羽盾衛',unit:'P_SHIELD',r:0,src:'images/h_shieldM.webp'},
  {id:'mageM',name:'昏燭',title:'提燈術士',unit:'P_LANTERN',r:0,src:'images/h_mageM.webp'},
  {id:'shield0',name:'葛隆',title:'流浪劍盾',unit:'P_SHIELD',r:0,src:'images/h_shield0.webp'},
  {id:'mage0',name:'無名',title:'蒙面咒師',unit:'P_WEAVER',r:0,src:'images/h_mage0.webp'},
  {id:'healer1',name:'蕁',title:'流浪藥師',unit:'P_HEALER',r:0,src:'images/h_healer1.webp'},
  {id:'spear',name:'槿',title:'長槍手',unit:'P_SPEAR',r:1,src:'images/h_spear.webp'},
  {id:'knightW',name:'伊恪',title:'白羽騎士',unit:'P_SHIELD',r:1,src:'images/h_knightW.webp'},
  {id:'herb',name:'芸',title:'採藥人',unit:'P_HEALER',r:1,src:'images/h_herb.webp'},
  {id:'foxgirl',name:'緋汐',title:'提燈旅人',unit:'P_LANTERN',r:1,src:'images/h_foxgirl.webp'},
  {id:'horn',name:'瞿山',title:'角盔戰士',unit:'P_SPEAR',r:1,src:'images/h_horn.webp'},
  {id:'fox',name:'燈守',title:'墨尾茸狐',unit:'P_LANTERN',r:1,src:'images/h_fox.webp'},
  {id:'snake',name:'藥鱗',title:'燈縫細蛇',unit:'P_SCOUT',r:1,src:'images/h_snake.webp'},
  {id:'spider',name:'織燭',title:'紗橋結蛛',unit:'P_WEAVER',r:1,src:'images/h_spider.webp'},
  {id:'bone',name:'磐甲',title:'苔骨殼獸',unit:'P_SHIELD',r:1,src:'images/h_bone.webp'},
  {id:'tiekou',name:'鐵扣',title:'白鐵盾衛',unit:'P_SHIELD',r:1,src:'images/h_tiekou.webp'},
  {id:'dragon',name:'蟄',title:'黑鱗龍裔',unit:'P_SPEAR',r:1,src:'images/h_dragon.webp'},
  {id:'raven',name:'啄夜',title:'灰喙夜鴉',unit:'P_ARCHER',r:2,src:'images/h_raven.webp'},
  {id:'moli',name:'墨離',title:'調查官',unit:'P_ARCHER',r:2,src:'art/opt/file_00000000b62481fbba1cd7e4208bd93f.webp'},
  {id:'baigu',name:'白骨先生',title:'分魂傀儡師',unit:'P_WEAVER',r:2,src:'art/inbox/grok_1793363315498.jpg'},
  {id:'luoqingluan',name:'洛青鸞',title:'造化鎮靈師',unit:'P_LANTERN',r:2,src:'art/inbox/grok_1793364295377.jpg'},
  {id:'sihuang',name:'姒凰',title:'守印巫祝',unit:'P_HEALER',r:2,src:'art/opt/file_000000005e34820baa03bc0adacc74c1.webp'}
 ],
 starters:['shieldF','spear','mageF','healerF','archerH','mageM'],
 gacha:{rates:[.80,.17,.03],pity:50,tenGuarantee:1,firstTen:1,startTickets:10},
 rewards:{win:{tickets:3,supply:40},winClean:{tickets:1},lose:{tickets:1,supply:15},perKill:2},
 xp:{join:40,win:40,kill:15,perLevel:100,maxLv:20,statStep:.04},
 squad:{maxLv:5,lvCost:15,hpStep:.05,bonusStep:.015,maxTier:3,tierCost:50,passiveCost:40,slotsAt:[2,5,8],baseBonus:.2},
 barracks:{costPerSoldier:2},
 // ---------- 裝備與素材（v0.8，數值是測試提案） ----------
 // 每人三格：武器（依職業）、防具（依職業群）、飾品（大家都能戴）
 eqSlots:{w:'武器',a:'防具',t:'飾品'},
 eqRarity:{name:['普通','精良','稀有'],mult:[1,1.35,1.7]},
 eqPlusMax:5,eqPlusStep:.12,
 statName:{hp:'生命',atk:'攻擊',def:'防禦',mag:'法力',res:'抗性',hit:'命中',eva:'迴避',crit:'暴擊'},
 equip:{
  w_shield:{slot:'w',name:'鴉羽紋盾劍',icon:'eq_w_shield',units:['P_SHIELD'],st:{atk:2,def:1.5}},
  w_spear:{slot:'w',name:'外圍長槍',icon:'eq_w_spear',units:['P_SPEAR'],st:{atk:3,hit:3}},
  w_lantern:{slot:'w',name:'法術提燈',icon:'eq_w_lantern',units:['P_LANTERN'],st:{mag:3,res:1}},
  w_bow:{slot:'w',name:'夜行長弓',icon:'eq_w_bow',units:['P_ARCHER'],st:{atk:2.5,hit:4}},
  w_kit:{slot:'w',name:'舊藥箱',icon:'eq_w_kit',units:['P_HEALER'],st:{mag:2,res:2}},
  w_thread:{slot:'w',name:'光絲梭子',icon:'eq_w_thread',units:['P_WEAVER'],st:{mag:2.5,eva:3}},
  w_dagger:{slot:'w',name:'彎短刀',icon:'eq_w_dagger',units:['P_SCOUT'],st:{atk:2.5,crit:3}},
  a_light:{slot:'a',name:'輕皮甲',icon:'eq_a_light',units:['P_ARCHER','P_SCOUT','P_SPEAR'],st:{def:1,eva:4}},
  a_heavy:{slot:'a',name:'重鐵甲',icon:'eq_a_heavy',units:['P_SHIELD','P_SPEAR'],st:{def:2,hp:8,eva:-3}},
  a_robe:{slot:'a',name:'法袍',icon:'eq_a_robe',units:['P_LANTERN','P_HEALER','P_WEAVER'],st:{res:2,hp:5}},
  t_badge:{slot:'t',name:'渡鴉徽章',icon:'eq_t_badge',st:{hp:8,def:.5,res:.5}},
  t_ring:{slot:'t',name:'黑鐵戒指',icon:'eq_t_ring',st:{atk:1.5,mag:1.5}},
  t_charm:{slot:'t',name:'護身符',icon:'eq_t_charm',st:{res:2,eva:2}},
  t_feather:{slot:'t',name:'黑羽飾',icon:'eq_t_feather',st:{hit:3,eva:2}}
 },
 // 素材：招集券與補給是原本就有的，另外三種新素材
 mats:{
  ore:{name:'白鐵礦石',icon:'it_ore',desc:'強化裝備用。拆解不要的裝備也會拿到。'},
  record:{name:'戰記本',icon:'it_record',desc:'讀了就能拿到經驗。對一名成員使用：經驗 +100。'},
  relic:{name:'發光的舊物',icon:'it_relic',desc:'不知道是誰留下的。之後的天賦會用到，先收好。'}
 },
 matIcon:{tickets:'it_ticket',supply:'it_supply'},
 // 強化：白鐵 =（目前＋1）×2×（稀有度＋1）；補給 = 10×（目前＋1）
 enhance:{ore:2,supply:10},
 dismantle:{base:1,perR:2,perPlus:1},
 recordXp:100,
 // 掉落：勝利一定有素材；裝備看機率；第一次通關一定給一件精良以上
 drops:{winEqChance:.6,loseEqChance:.15,rarity:[.72,.24,.04],winOre:[3,6],loseOre:[1,2],recordChance:.4,relicChance:.15,relicThreat:0,relicSkip:['MISSION_BC_001'],firstClearR:1},
 invMax:60,
 // ---------- 天賦（v0.9）：每 2 級 1 點；三條路各 5 格，要照順序點；第 5 格要 1 個發光的舊物 ----------
 talentEvery:2,talentResetCost:50,
 talents:{
  atk:{name:'鋒',desc:'打得更痛',nodes:[
   {id:'a1',name:'磨利',ic:['inbox/grok_1793244686557.jpg',1],fx:{atkP:.04},desc:'攻擊與法力 +4%'},
   {id:'a2',name:'找縫',ic:['inbox/grok_1793375954414.jpg',7],fx:{crit:4},desc:'暴擊 +4%'},
   {id:'a3',name:'壓上',ic:['inbox/grok_1793375954414.jpg',4],fx:{atkP:.04},desc:'攻擊與法力 +4%'},
   {id:'a4',name:'看準',ic:['inbox/grok_1793244686557.jpg',5],fx:{hit:6},desc:'命中 +6%'},
   {id:'a5',name:'斬首',ic:['inbox/grok_1793244784046.jpg',8],fx:{flag:'behead'},relic:1,desc:'對敵方指揮官的傷害 +15%'}]},
  def:{name:'盾',desc:'站得更久',nodes:[
   {id:'d1',name:'站穩',ic:['inbox/grok_1793244689811.jpg',0],fx:{defP:.05},desc:'防禦 +5%'},
   {id:'d2',name:'厚甲',ic:['inbox/grok_1793244663768.jpg',3],fx:{hpP:.05},desc:'隊長生命 +5%'},
   {id:'d3',name:'燈下',ic:['inbox/grok_1793244689811.jpg',4],fx:{resP:.05},desc:'抗性 +5%'},
   {id:'d4',name:'輕身',ic:['inbox/grok_1793244689811.jpg',3],fx:{eva:4},desc:'迴避 +4%'},
   {id:'d5',name:'鐵壁',ic:['inbox/grok_1793375954414.jpg',0],fx:{flag:'nocrit'},relic:1,desc:'不會被暴擊'}]},
  sq:{name:'隊',desc:'帶兵更穩',nodes:[
   {id:'s1',name:'包紮',ic:['inbox/grok_1793244766873.jpg',3],fx:{solP:.05},desc:'士兵生命 +5%'},
   {id:'s2',name:'燈號',ic:['inbox/grok_1793244779109.jpg',1],fx:{sb:.02},desc:'士兵加成 +2%'},
   {id:'s3',name:'輪替',ic:['inbox/grok_1793244766873.jpg',5],fx:{solP:.05},desc:'士兵生命 +5%'},
   {id:'s4',name:'添員',ic:['inbox/grok_1793244779109.jpg',2],fx:{sold:1},desc:'多帶 1 名士兵'},
   {id:'s5',name:'號令',ic:['inbox/grok_1793245149933.jpg',8],fx:{flag:'quick'},relic:1,desc:'技能冷卻 -1（最少 2）'}]}
 },
 // 技能演出用的大圖（渡鴉公會的技能插畫）
 skillArt:{guardStance:'inbox/grok_1793244871174.jpg',shieldBash:'inbox/grok_1793244871174.jpg',pierce:'inbox/grok_1793244860209.jpg',sweep:'inbox/grok_1793244860209.jpg',lampZone:'inbox/grok_1793244867247.jpg',searLamp:'inbox/grok_1793244867247.jpg',markShot:'inbox/grok_1793244856306.jpg',skyArrow:'inbox/grok_1793244865508.jpg',mend:'inbox/grok_1793244863725.jpg',massMend:'inbox/grok_1793244863725.jpg',bind:'inbox/grok_1793244862046.jpg',pull:'inbox/grok_1793244869057.jpg',shadowStep:'inbox/grok_1793244858240.jpg',backstab:'inbox/grok_1793244858240.jpg'},
 // ---------- 委託板（支線，v1.0）：打下來的地點會出現委託，同時最多 3 張 ----------
 quests:{max:3,rerollCost:20,
  from:['南門的守衛','礦工的家人','驛站的老郵差','提燈的孩子','白鐵礦城的鐵匠','城裡的藥師','守夜人','路過的商隊'],
  kinds:{
   noloss:{name:'一個都不能少',txt:'打贏{place}，而且沒有任何一隊倒下。',ic:['inbox/grok_1793244689811.jpg',0]},
   fast:{name:'趕在天亮前',txt:'在第 {n} 回合以內打贏{place}。',ic:['inbox/grok_1793245149933.jpg',8]},
   kills:{name:'清掉它們',txt:'打贏{place}，而且全隊擊倒 {n} 隊以上。',ic:['inbox/grok_1793244686557.jpg',2]},
   soldiers:{name:'帶他們回來',txt:'打贏{place}，而且士兵剩下 {n}% 以上。',ic:['inbox/grok_1793244766873.jpg',3]}
  },
  rewards:[{ore:8,supply:30},{record:2,supply:20},{tickets:3},{eq:1},{relic:1,ore:4},{ore:12}]
 },
 // 時裝：讀渡鴉公會網站上的時裝目錄，再加上這三件（渡鴉公會程式裡寫死的）
 costumeCatalog:'../raven-guild/art/costumes/catalog.json',costumeRoot:'../raven-guild/',
 costumeExtra:[
  {id:'archerh_360',hero:'archerH',name:'黑羽刺客',theme:'黑羽與鐘樓',line:'衣服換了，影子還是同一個。',images:{normal:'art/costumes/archerH_costume360.webp'}},
  {id:'moli_360',hero:'moli',name:'萬目窺真',theme:'卷宗與窺視',line:'看得越多，就越難假裝沒看見。',images:{normal:'art/costumes/moli_costume360.webp'}},
  {id:'sihuang_360',hero:'sihuang',name:'封印巫女',theme:'六芒與烈火',line:'封印亮起來的時候，別看我的眼睛。',images:{normal:'art/costumes/sihuang_costume360.webp'}}],
 levelStep:.05,levelMax:25,
 // 第一章：敵人隨勝場變強，最多算到 8 勝（之後練功不會越練越難）
 chapterWinCap:8,
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
  shieldBash:{icon:'sk_guard',name:'盾擊',cd:2,kind:'attack',range:[1,1],mult:1,push:1,noCounter:true,desc:'用盾撞相鄰敵人，1 倍傷害並把它往後撞退 1 格；後面有東西擋住就撞不動。不會被反擊。'},
  sweep:{icon:'sk_pierce',name:'橫掃',cd:3,kind:'around',mult:.8,noCounter:true,area:true,desc:'長槍橫掃，四周相鄰的所有敵人都吃 0.8 倍傷害，不會被反擊。'},
  searLamp:{icon:'sk_lamp',name:'灼燈',cd:2,kind:'attack',range:[1,3],mult:1.3,desc:'把燈火凝成一團砸向 3 格內的敵人，1.3 倍法術傷害。'},
  skyArrow:{icon:'sk_mark',name:'穿雲箭',cd:3,kind:'attack',range:[2,4],mult:1.25,noLos:true,desc:'射程 2–4，越過城牆與障礙，1.25 倍傷害。'},
  massMend:{icon:'sk_mend',name:'群體縫合',cd:3,kind:'self',heal:.15,solHeal:.2,radius:2,desc:'2 格內所有隊友（含自己）回復 15% 生命、補回 20% 士兵。'},
  pull:{icon:'sk_bind',name:'牽絲',cd:2,kind:'attack',range:[2,3],mult:.5,pull:1,noCounter:true,desc:'絲線拉住 2–3 格內的敵人，0.5 倍傷害並把它往自己這邊拉 1 格。不會被反擊。'},
  backstab:{icon:'sk_shadow',name:'背刺',cd:2,kind:'attack',range:[1,1],mult:1,flank:.4,noCounter:true,desc:'相鄰攻擊，目標旁邊有其他隊友時傷害 +40%。不會被反擊。'},
  shadowStep:{icon:'sk_shadow',name:'影徑',cd:2,kind:'dash',extraMove:1,ignoreZoc:true,flank:.2,desc:'這次移動 +1 而且無視控制區；之後可以攻擊，目標旁邊有我方隊友時傷害 +20%（背襲）。'}
 },
 soldierBonus:.2, // 士兵滿編時攻防 +20%，人數越少越低
 charge:{minCost:3,bonus:.2},
 // 第二技能（Lv5 學會）
 secondSkill:{P_SHIELD:'shieldBash',P_SPEAR:'sweep',P_LANTERN:'searLamp',P_ARCHER:'skyArrow',P_HEALER:'massMend',P_WEAVER:'pull',P_SCOUT:'backstab'},secondAt:5,
 // 士兵團被動（學了就一直有效）
 passives:{
  edge:{name:'鋒銳',desc:'攻擊 +8%。'},
  wall:{name:'鐵壁',desc:'防禦與魔防 +10%。'},
  march:{name:'急行',desc:'移動 +1。'},
  clean:{name:'淨衣',desc:'不會被污染地侵蝕，站在污染地上也不扣防禦。'},
  refill:{name:'補員',desc:'每兩回合開始時補回 1 名士兵。'},
  riposte:{name:'反擊架勢',desc:'反擊傷害 +20%。'},
  night:{name:'夜戰',desc:'命中 +10%。'},
  hold:{name:'堅守',desc:'這回合沒有移動時，受到的傷害 −10%（到下次行動前）。'}
 },
 deploySlots:[[5,9],[6,8],[3,8],[4,9],[7,9],[8,8]],teamSize:6,
 defaultTeam:['P_SHIELD','P_SPEAR','P_ARCHER','P_LANTERN','P_HEALER','P_SCOUT'],
 missions:{
  MISSION_BC_001:{
   name:'白鐵礦城・南門守城',place:'白鐵礦城',
   intro:'渡鴉公會的外圍成員來到天闕大陸的白鐵礦城，要在南門建立新的據點。城門還沒修好，霧裡已經有東西在靠近——守住這裡，它會是我們往外擴散的第一步。',w:12,h:12,roundLimit:8,
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
   gate:{x:5,y:10,hp:300,def:10,res:0},obj:{type:'gate'},
   enemySlots:[[5,0],[6,0],[5,1],[6,1],[3,2],[8,2]],commanderAt:[6,0],
   events:[
    {round:1,say:'鳶的回報：霧裡的隊伍從北方中路壓過來，快的那幾隻會先衝。'},
    {round:2,say:'東北的森林開始發出暗紅的微光——下一回合開始時，(8,3)、(9,3) 會變成污染地，之後還會往外擴散。',warn:[[8,3],[9,3]]},
    {round:3,wave:[[2,3,0],[4,8,0],[5,6,0],[1,4,0]],say:'第二波從霧裡出來了：四隊援軍從北邊壓下來。'},
    {round:5,spawnCommander:true,say:'指揮官從北方進場。擊倒他、而且城門還在，就能提前獲勝。'},
    {round:6,wave:[[0,2,0],[4,9,0]],pressure:true,say:'最後一波援軍到了，城門壓力提高：敵人開始不顧一切地攻門。'}
   ],
   win:'守住城門到第 8 回合結束；或擊倒敵軍指揮官且城門還在。',
   lose:'城門被打破，或我方全滅。',
   outcomes:[
    {id:'HOLD_CLEAN',when:'守城成功、城門生命 ≥ 200',world:'民眾信任 +10、安定 +5',next:'下一場友軍補給與支援'},
    {id:'BROKEN_WALL',when:'勝利但城門生命 < 150',world:'安定 −10，記錄「破牆」',next:'城門出現破洞入口'},
    {id:'DEFEAT',when:'失敗後接受戰敗',world:'勢力掌控轉為危險、補給 −10',next:'觸發奪回城門的支線'}
   ]
  },

  MISSION_MINE:{
   name:'礦坑入口・擊破掘進的指揮',place:'礦坑入口',chapter:1,threat:0,
   intro:'礦坑口的軌道一路延伸到地面上。敵人的指揮守在坑口，只要它還在，坑裡的東西就會一直爬出來。',
   w:12,h:12,roundLimit:12,
   map:[
    'WWW.....WWWW',
    'W.....R..WWW',
    'W..R.....F.W',
    'WW...H...F.W',
    'W....RR....W',
    '..F.......R.',
    '..F..S......',
    '.....S..H...',
    'R.........F.',
    '...H........',
    '............',
    '............'],
   legend:{'.':'PLAIN',F:'FOREST',H:'HILL',S:'SWAMP',W:'WALL',R:'RUBBLE'},
   obj:{type:'boss'},commanderStart:true,commanderAt:[5,1],commanderLeash:2,
   deploy:[[5,10],[6,10],[4,11],[7,11],[3,10],[8,10]],
   enemySlots:[[3,2],[7,2],[4,3],[6,3],[5,4]],
   events:[
    {round:1,say:'坑口的機器聲越來越近。擊倒敵方指揮就能獲勝；拖太久（第 12 回合結束），它就會退回礦坑深處。'},
    {round:3,wave:[[2,4,0]],say:'坑裡又爬出一隊。'},
    {round:5,warn:[[5,4],[6,4]],say:'坑口的瓦礫開始發出暗紅的光。'},
    {round:6,wave:[[0,4,0],[5,6,0]],say:'第二批從坑口湧出來。'},
    {round:9,wave:[[2,5,0]],pressure:true,say:'指揮開始催促它們往前壓。'}
   ],
   win:'擊倒敵方指揮官。',lose:'第 12 回合結束還沒擊倒指揮官，或我方全滅。'},
  MISSION_POST:{
   name:'廢棄驛站・奪回驛站',place:'廢棄驛站',chapter:1,threat:1,
   intro:'荒野上的舊驛站是礦城往外的第一個中繼點。佔住驛站中央（金框的格子），守住它。',
   w:12,h:12,roundLimit:10,
   map:[
    '..F......F..',
    '.....R......',
    '..H.....H...',
    '....PPP.....',
    'R...PPP...R.',
    '......F.....',
    '.F..........',
    '....S...S...',
    '..........F.',
    '...H....H...',
    '............',
    '............'],
   legend:{'.':'PLAIN',F:'FOREST',H:'HILL',S:'SWAMP',R:'RUBBLE',P:'STATION'},
   obj:{type:'hold',tiles:[[4,3],[5,3],[6,3],[4,4],[5,4],[6,4]],need:2},
   deploy:[[5,10],[6,10],[4,11],[7,11],[3,10],[8,10]],
   enemySlots:[[1,0],[10,0],[5,0],[0,6],[11,6],[6,1]],commanderAt:[5,0],
   events:[
    {round:1,say:'回合結束時，只要驛站裡有我方、而且沒有敵人，就算守住一回合。累積守住 2 回合就獲勝。'},
    {round:3,wave:[[2,2,0],[4,9,0]],say:'驛站兩側的廢屋裡又走出兩隊。'},
    {round:4,spawnCommander:true,say:'敵方指揮來了，它也想要這個驛站。'},
    {round:6,wave:[[3,0,8]],say:'有東西從南邊繞過來了。'}
   ],
   win:'累積守住驛站 2 回合（或擊倒敵方指揮官）。',lose:'第 10 回合結束還沒守住，或我方全滅。'},
  MISSION_WOOD:{
   name:'枯樹林・霧中掃蕩',place:'枯樹林',chapter:1,threat:1,
   intro:'枯樹林裡起了霧，只看得到身邊幾格。林子裡的燈火是敵人——把它們全部清掉。',
   w:12,h:12,roundLimit:12,fog:{vision:3,scout:5,lantern:4},
   map:[
    'F.F..FF..F.F',
    '.F..F..F..F.',
    'F..F..F..F..',
    '..F..S..F..F',
    'F...F...F...',
    '.F..FF.F..F.',
    '..F.....F...',
    'F..F..F...F.',
    '.....F..F...',
    '..F......F..',
    '............',
    '............'],
   legend:{'.':'PLAIN',F:'FOREST',S:'SWAMP'},
   obj:{type:'rout'},
   deploy:[[5,10],[6,10],[4,11],[7,11],[3,10],[8,10]],
   enemySlots:[[2,1],[9,1],[5,3],[1,5],[10,5],[6,6]],commanderAt:[6,0],
   events:[
    {round:1,say:'霧很濃：我方附近 3 格（斥候 5 格、提燈 4 格、燈界裡）才看得到敵人。擊倒所有敵人就獲勝。'},
    {round:4,wave:[[2,0,0]],say:'霧的深處又亮起一盞燈。'},
    {round:5,spawnCommander:true,say:'帶頭的那盞燈靠近了。'}
   ],
   win:'擊倒所有敵人（含後來出現的）。',lose:'第 12 回合結束還有敵人，或我方全滅。'},
  MISSION_FOG:{name:'霧裡的村落・把人帶出來',place:'霧裡的村落',chapter:1,threat:2,
   intro:'村子被霧吞了一半。屋裡還有人。走進金框的屋子，就能把人帶出來——四間裡救出三間就夠了。',
   w:12,h:12,roundLimit:12,fog:{vision:3,scout:5,lantern:4},
   map:['F...R..R...F','.A..F...F.A.','..F......F..','....R..R....','F....FF....F','..A......A..','.F...ww...F.','....F..F....','..R......R..','............','............','............'],
   legend:{'.':'PLAIN','F':'FOREST','R':'RUBBLE','w':'SHALLOW_WATER','A':'HOUSE'},
   obj:{type:'rescue',tiles:[[1,1],[10,1],[2,5],[9,5]],need:3,timeout:'時間到了，霧把村子整個吞掉了'},
   deploy:[[5,10],[6,10],[4,11],[7,11],[3,10],[8,10]],
   enemySlots:[[1,0],[10,0],[5,2],[6,2],[3,4],[8,4]],commanderAt:[6,0],
   events:[{round:1,say:'霧很濃。我方行動結束時站在金框的屋子上，就會把屋裡的人帶出來。救出 3 間就獲勝。'},
    {round:4,wave:[[2,0,3]],say:'霧裡又有燈在動。'},{round:5,spawnCommander:true,say:'帶頭的那盞燈過來了。'},{round:8,wave:[[4,11,3]],pressure:true,say:'它們開始往屋子圍過去。'}],
   win:'救出 3 間屋子裡的人（或擊倒敵方指揮官）。',lose:'第 12 回合結束還沒救出 3 間，或我方全滅。'},
  MISSION_MARSH:{name:'沼澤・穿過去',place:'沼澤',chapter:1,threat:2,
   intro:'往北的路只剩這片沼澤。水底下有東西在呼吸。讓三隊走到北岸（金框）就算成功。',
   w:12,h:12,roundLimit:12,
   map:['FF........FF','F.SS.ww.SS.F','..SwwDDwwS..','.SS.wDDw.SS.','S..XS..SX..S','.wS..SS..Sw.','DDw.S..S.wDD','.S..w..w..S.','..S.SS.S.S..','.F........F.','............','............'],
   legend:{'.':'PLAIN','F':'FOREST','S':'SWAMP','w':'SHALLOW_WATER','D':'DEEP_WATER','X':'FLESH'},
   obj:{type:'reach',tiles:[[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],need:3,timeout:'時間到了，沼澤把路吞回去了'},
   deploy:[[5,10],[6,10],[4,11],[7,11],[3,10],[8,10]],
   enemySlots:[[1,2],[10,2],[5,4],[6,4],[2,5],[9,5]],commanderAt:[5,0],
   events:[{round:1,say:'回合結束時，北岸金框裡有 3 隊我方就獲勝。沼澤很難走，污染地會侵蝕士兵。'},
    {round:3,wave:[[3,4,1],[0,7,1]],say:'北岸的霧裡又下來兩隊。'},{round:4,spawnCommander:true,say:'敵方指揮守在北岸路口。'},{round:7,wave:[[5,4,7]],pressure:true,say:'水底下的東西浮上來了。'}],
   win:'回合結束時，北岸有 3 隊我方（或擊倒敵方指揮官）。',lose:'第 12 回合結束還沒過去，或我方全滅。'},
  MISSION_BRIDGE:{name:'石橋・守住橋頭',place:'石橋',chapter:1,threat:2,
   intro:'往東唯一的石橋。對岸的隊伍要過來，橋這頭的南岸（最下面三排）是我們的。守到第 10 回合結束。',
   w:12,h:12,roundLimit:10,
   map:['..F..H...F..','.F........F.','....R..R....','..F......F..','R....bb....R','DDDDDbbDDDwD','DDDDDbbDDDwD','R....bb....R','..H......H..','....F..F....','............','............'],
   legend:{'.':'PLAIN','F':'FOREST','H':'HILL','R':'RUBBLE','D':'DEEP_WATER','w':'SHALLOW_WATER','b':'BRIDGE'},
   obj:{type:'defend',tiles:[].concat(...[9,10,11].map(y=>Array.from({length:12},(_,x)=>[x,y]))),max:3},
   deploy:[[5,8],[6,8],[4,8],[7,8],[3,9],[8,9]],
   enemySlots:[[2,0],[9,0],[5,1],[6,1],[3,2],[8,2]],commanderAt:[6,0],
   events:[{round:1,say:'回合結束時，每有一隊敵人站在南岸最下面三排，就算過橋一次；累積 3 次就失敗。飛的會直接越過河，右邊還有一條淺灘。'},
    {round:3,wave:[[2,2,0],[5,9,0]],say:'對岸又來了兩隊。'},{round:5,wave:[[4,5,0],[1,6,0]],say:'第二批要過橋了。'},{round:6,spawnCommander:true,say:'敵方指揮在對岸督戰。擊倒它也能獲勝。'},{round:8,wave:[[2,3,0],[3,8,0]],pressure:true,say:'最後一批，它們不管傷亡了。'}],
   win:'守到第 10 回合結束（或擊倒敵方指揮官）。',lose:'累積 3 次有敵人過橋，或我方全滅。'},
  MISSION_BELL:{name:'鐘樓廢墟・讓鐘聲停下來',place:'鐘樓廢墟',chapter:1,threat:2,
   intro:'鐘早就不見了，聲音還在。只要鐘聲還響，敵方指揮幾乎打不痛。把三個燈座（金框）點起來，鐘聲就會停。',
   w:12,h:12,roundLimit:15,
   map:['WWW..HH..WWW','W....HH....W','W.L......L.W','..R..RR..R..','...F....F...','R..........R','..F..L...F..','.....R......','..H......H..','............','............','............'],
   legend:{'.':'PLAIN','F':'FOREST','H':'HILL','R':'RUBBLE','W':'WALL','L':'LAMP'},
   obj:{type:'boss',seals:[[2,2],[9,2],[5,6]],timeout:'時間到了，鐘聲把我們趕下山丘'},
   commanderStart:true,commanderAt:[5,1],commanderLeash:2,
   deploy:[[5,10],[6,10],[4,11],[7,11],[3,10],[8,10]],
   enemySlots:[[1,3],[10,3],[3,5],[8,5],[6,4],[4,7]],
   events:[{round:1,say:'回合結束時，燈座上有我方、沒有敵人，那盞燈就點起來。三盞都點起來之前，打指揮官的傷害 −60%。'},
    {round:3,wave:[[0,3,1],[1,8,1]],say:'鐘樓兩側又走出兩隊。'},{round:6,warn:[[3,3],[8,3]],say:'鐘聲震得地面發紅。'},{round:8,wave:[[4,5,0]],pressure:true,say:'鐘聲越來越急。'}],
   win:'擊倒敵方指揮官（先點亮三盞燈座）。',lose:'第 15 回合結束還沒擊倒，或我方全滅。'},
  MISSION_CHURCH:{name:'半塌的教堂・第一章最後一戰',place:'半塌的教堂',chapter:1,threat:3,
   intro:'祭壇上的香還沒燒完。白鐵礦城周圍的東西，好像都是從這裡被叫出來的。擊倒守在祭壇前的那個。',
   w:12,h:12,roundLimit:14,
   map:['WWWW.HH.WWWW','W..R....R..W','W.X......X.W','W...R..R...W','....F..F....','.R........R.','..X..SS..X..','....R..R....','.F........F.','............','............','............'],
   legend:{'.':'PLAIN','F':'FOREST','H':'HILL','R':'RUBBLE','W':'WALL','S':'SWAMP','X':'FLESH'},
   obj:{type:'boss',timeout:'時間到了，香燒完了'},
   commanderStart:true,commanderAt:[5,1],commanderLeash:3,cmdMult:{hp:1.5,atk:1.05},
   deploy:[[5,10],[6,10],[4,11],[7,11],[3,10],[8,10]],
   enemySlots:[[2,3],[9,3],[4,4],[7,4],[1,5],[10,5]],
   events:[{round:1,say:'這一位比之前的都強，而且會一直叫人來。污染地會擴散，記得用治療師淨化。'},
    {round:3,wave:[[0,3,1],[1,8,1]],say:'祭壇的香煙裡走出兩隊。'},{round:7,warn:[[4,7],[7,7]],say:'教堂的地板開始發紅。'},{round:8,wave:[[4,1,4],[5,10,4]],pressure:true,say:'它開始催促所有東西往前壓。'}],
   win:'擊倒敵方指揮官。',lose:'第 14 回合結束還沒擊倒，或我方全滅。'}
 }
};
if(typeof module!=='undefined'&&module.exports)module.exports=DATA;else root.TACTICS_DATA=DATA;
})(this);
