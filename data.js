// 《永生戰棋》資料（世界觀＝渡鴉公會；數值都是測試提案，不是正史）
(function(root){
const DATA={
 rulesetVersion:'v0.8',
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
 artMap:{"terrain/t_plain.webp": "inbox/grok_1793874360251.jpg", "terrain/t_forest.webp": "inbox/grok_1793874364828.jpg", "terrain/t_hill.webp": "inbox/grok_1793874367354.jpg", "terrain/t_swamp.webp": "inbox/grok_1793874369982.jpg", "terrain/t_wall.webp": "inbox/grok_1793874372208.jpg", "terrain/t_gate.webp": "inbox/grok_1793874374474.jpg", "terrain/t_shallow.webp": "inbox/grok_1793874377521.jpg", "terrain/t_deep.webp": "inbox/grok_1793874380360.jpg", "terrain/t_flesh.webp": "inbox/grok_1793874383076.jpg", "terrain/t_rubble.webp": "inbox/grok_1793874386264.jpg", "icons/sk_guard.webp": "inbox/grok_1793874392069.jpg", "icons/sk_pierce.webp": "inbox/grok_1793874395253.jpg", "icons/sk_lamp.webp": "inbox/grok_1793874398055.jpg", "icons/sk_mark.webp": "inbox/grok_1793874400976.jpg", "icons/sk_mend.webp": "inbox/grok_1793874403938.jpg", "icons/sk_bind.webp": "inbox/grok_1793874406930.jpg", "icons/sk_shadow.webp": "inbox/grok_1793874410153.jpg", "icons/fm_shieldwall.webp": "inbox/grok_1793874412830.jpg", "icons/fm_pike.webp": "inbox/grok_1793874415961.jpg", "icons/fm_skirmish.webp": "inbox/grok_1793874418935.jpg", "icons/fm_assault.webp": "inbox/grok_1793874422056.jpg", "status/st_root.webp": "inbox/grok_1793874666398.jpg", "status/st_mark.webp": "inbox/grok_1793874669089.jpg", "status/st_guard.webp": "inbox/grok_1793874671632.jpg", "status/st_defend.webp": "inbox/grok_1793874681100.jpg", "icons/tr_infantry.webp": "inbox/grok_1793874684370.jpg", "icons/tr_cavalry.webp": "inbox/grok_1793874691055.jpg", "icons/tr_archer.webp": "inbox/grok_1793874694645.jpg", "icons/tr_flying.webp": "inbox/grok_1793874698569.jpg", "icons/tr_mage.webp": "inbox/grok_1793874701551.jpg", "icons/tr_cleric.webp": "inbox/grok_1793874704650.jpg", "icons/tr_beast.webp": "inbox/grok_1793874707721.jpg", "icons/tr_spear.webp": "inbox/grok_1793874762484.jpg", "backgrounds/cover.webp": "inbox/grok_1793874478434.jpg", "heroes/tok_shieldF.webp": "../raven-guild/images/h_shieldF.webp", "heroes/por_shieldF.webp": "../raven-guild/images/h_shieldF.webp", "heroes/tok_spear.webp": "../raven-guild/images/h_spear.webp", "heroes/por_spear.webp": "../raven-guild/images/h_spear.webp", "heroes/tok_mageF.webp": "../raven-guild/images/h_mageF.webp", "heroes/por_mageF.webp": "../raven-guild/images/h_mageF.webp", "heroes/tok_moli.webp": "../raven-guild/art/opt/file_00000000b62481fbba1cd7e4208bd93f.webp", "heroes/por_moli.webp": "../raven-guild/art/opt/file_00000000b62481fbba1cd7e4208bd93f.webp", "heroes/tok_healerF.webp": "../raven-guild/images/h_healerF.webp", "heroes/por_healerF.webp": "../raven-guild/images/h_healerF.webp", "heroes/tok_spider.webp": "../raven-guild/images/h_spider.webp", "heroes/por_spider.webp": "../raven-guild/images/h_spider.webp", "heroes/tok_archerH.webp": "../raven-guild/images/h_archerH.webp", "heroes/por_archerH.webp": "../raven-guild/images/h_archerH.webp", "enemies/tok_dutyghost.webp": "../raven-guild/images/m_dutyghost.webp", "enemies/por_dutyghost.webp": "../raven-guild/images/m_dutyghost.webp", "enemies/tok_returndog.webp": "../raven-guild/images/m_returndog.webp", "enemies/por_returndog.webp": "../raven-guild/images/m_returndog.webp", "enemies/tok_stampbug.webp": "../raven-guild/images/m_stampbug.webp", "enemies/por_stampbug.webp": "../raven-guild/images/m_stampbug.webp", "enemies/tok_lackcrow.webp": "../raven-guild/images/m_lackcrow.webp", "enemies/por_lackcrow.webp": "../raven-guild/images/m_lackcrow.webp", "enemies/tok_deadletters.webp": "../raven-guild/images/m_deadletters.webp", "enemies/por_deadletters.webp": "../raven-guild/images/m_deadletters.webp", "enemies/tok_paper.webp": "../raven-guild/images/m_paper.webp", "enemies/por_paper.webp": "../raven-guild/images/m_paper.webp", "enemies/tok_palanquin.webp": "../raven-guild/art/opt/file_00000000970c820b8dd306530646d135.webp", "enemies/por_palanquin.webp": "../raven-guild/art/opt/file_00000000970c820b8dd306530646d135.webp", "enemies/tok_moneycrow.webp": "../raven-guild/art/opt/file_00000000e6d8821183a09c10fae8bf5c.webp", "enemies/por_moneycrow.webp": "../raven-guild/art/opt/file_00000000e6d8821183a09c10fae8bf5c.webp", "enemies/tok_redpaper.webp": "../raven-guild/art/opt/file_00000000f7c082118b7693f86fb0b21b.webp", "enemies/por_redpaper.webp": "../raven-guild/art/opt/file_00000000f7c082118b7693f86fb0b21b.webp", "enemies/tok_paleworship.webp": "../raven-guild/art/opt/file_00000000844c820b842051a31f79cd41.webp", "enemies/por_paleworship.webp": "../raven-guild/art/opt/file_00000000844c820b842051a31f79cd41.webp", "enemies/tok_whiteminer.webp": "../raven-guild/images/m_whiteminer.webp", "enemies/por_whiteminer.webp": "../raven-guild/images/m_whiteminer.webp", "enemies/tok_minecart.webp": "../raven-guild/images/m_minecart.webp", "enemies/por_minecart.webp": "../raven-guild/images/m_minecart.webp", "enemies/tok_rustrat.webp": "../raven-guild/images/m_rustrat.webp", "enemies/por_rustrat.webp": "../raven-guild/images/m_rustrat.webp", "enemies/tok_rustlung.webp": "../raven-guild/images/m_rustlung.webp", "enemies/por_rustlung.webp": "../raven-guild/images/m_rustlung.webp", "enemies/tok_leech.webp": "../raven-guild/images/m_leech.webp", "enemies/por_leech.webp": "../raven-guild/images/m_leech.webp", "bosses/tok_wusign.webp": "../raven-guild/images/b_wusign.webp", "bosses/por_wusign.webp": "../raven-guild/images/b_wusign.webp", "bosses/tok_paperking.webp": "../raven-guild/art/opt/file_00000000a06c81f5b3d8ea4b3a2e17d0.webp", "bosses/por_paperking.webp": "../raven-guild/art/opt/file_00000000a06c81f5b3d8ea4b3a2e17d0.webp", "bosses/tok_deepdrill.webp": "../raven-guild/images/b_deepdrill.webp", "bosses/por_deepdrill.webp": "../raven-guild/images/b_deepdrill.webp", "backgrounds/base_bg.webp": "inbox/grok_1793874425445.jpg", "backgrounds/recruit_bg.webp": "inbox/grok_1793874471833.jpg", "backgrounds/fac_council.webp": "inbox/grok_1793874428353.jpg", "backgrounds/fac_recruit.webp": "inbox/grok_1793874430947.jpg", "backgrounds/fac_barracks.webp": "inbox/grok_1793874448076.jpg", "backgrounds/fac_workshop.webp": "inbox/grok_1793874450875.jpg", "backgrounds/fac_lighthouse.webp": "inbox/grok_1793874453370.jpg", "backgrounds/fac_storage.webp": "inbox/grok_1793874455965.jpg", "backgrounds/cover_wall.webp": "inbox/grok_1793874474840.jpg", "ui/card_common.webp": "inbox/grok_1793874458608.jpg", "ui/card_elite.webp": "inbox/grok_1793874461359.jpg", "ui/card_legend.webp": "inbox/grok_1793874464413.jpg", "ui/card_back.webp": "inbox/grok_1793874468466.jpg", "fx/fx_slash.webp": "inbox/grok_1793877490158.jpg", "fx/fx_arrow.webp": "inbox/grok_1793877500480.jpg", "fx/fx_hit.webp": "inbox/grok_1793877508513.jpg", "fx/fx_crit.webp": "inbox/grok_1793877511871.jpg", "fx/fx_miss.webp": "inbox/grok_1793877515603.jpg", "fx/fx_lamp.webp": "inbox/grok_1793877573521.jpg", "fx/fx_heal.webp": "inbox/grok_1793877577062.jpg", "fx/fx_shadow.webp": "inbox/grok_1793877590864.jpg", "fx/fx_mark.webp": "inbox/grok_1793877593857.jpg", "fx/fx_corrupt.webp": "inbox/grok_1793877596623.jpg", "fx/fx_purify.webp": "inbox/grok_1793877599450.jpg", "fx/fx_rout.webp": "inbox/grok_1793877602504.jpg", "fx/fx_summon.webp": "inbox/grok_1793877605685.jpg", "battle/bt_plain.webp": "inbox/grok_1793877609306.jpg", "battle/bt_forest.webp": "inbox/grok_1793877612210.jpg", "battle/bt_gate.webp": "inbox/grok_1793877614927.jpg", "battle/bt_corrupt.webp": "inbox/grok_1793877617740.jpg", "soldiers/sd_shield.webp": "inbox/grok_1793877623933.jpg", "soldiers/sd_spear.webp": "inbox/grok_1793877626960.jpg", "soldiers/sd_lantern.webp": "inbox/grok_1793877630221.jpg", "soldiers/sd_archer.webp": "inbox/grok_1793877632922.jpg", "soldiers/sd_healer.webp": "inbox/grok_1793877635889.jpg", "soldiers/sd_weaver.webp": "inbox/grok_1793877639104.jpg", "soldiers/sd_scout.webp": "inbox/grok_1793877641990.jpg", "fx/fx_pierce.webp": "inbox/grok_1793877711031.jpg", "fx/fx_magic.webp": "inbox/grok_1793877713277.jpg", "fx/fx_guard.webp": "inbox/grok_1793877716817.jpg", "fx/fx_bind.webp": "inbox/grok_1793877720583.jpg", "backgrounds/mp_region.webp": "inbox/grok_1793877647112.jpg", "prologue/pr_1.webp": "inbox/grok_1793881280266.jpg", "prologue/pr_2.webp": "inbox/grok_1793881283151.jpg", "prologue/pr_3.webp": "inbox/grok_1793881286948.jpg", "prologue/pr_4.webp": "inbox/grok_1793881289553.jpg", "scenes/lv_mine.webp": "inbox/grok_1793881292816.jpg", "scenes/lv_post.webp": "inbox/grok_1793881295585.jpg", "scenes/lv_wood.webp": "inbox/grok_1793881297951.jpg", "scenes/lv_fog.webp": "inbox/grok_1793881300496.jpg", "scenes/lv_marsh.webp": "inbox/grok_1793881302786.jpg", "scenes/lv_bridge.webp": "inbox/grok_1793881305058.jpg", "scenes/lv_bell.webp": "inbox/grok_1793881308157.jpg", "scenes/lv_church.webp": "inbox/grok_1793881310594.jpg", "equip/eq_w_shield.webp": "inbox/grok_1793881314592.jpg", "equip/eq_w_spear.webp": "inbox/grok_1793881317291.jpg", "equip/eq_w_kit.webp": "inbox/grok_1793881339185.jpg", "equip/eq_w_thread.webp": "inbox/grok_1793881342073.jpg", "equip/eq_w_dagger.webp": "inbox/grok_1793881344946.jpg", "equip/eq_a_light.webp": "inbox/grok_1793881347433.jpg", "equip/eq_a_heavy.webp": "inbox/grok_1793881349958.jpg", "equip/eq_a_robe.webp": "inbox/grok_1793881352406.jpg", "equip/eq_t_badge.webp": "inbox/grok_1793881355085.jpg", "equip/eq_t_ring.webp": "inbox/grok_1793881357536.jpg", "equip/eq_t_charm.webp": "inbox/grok_1793881360118.jpg", "equip/eq_t_feather.webp": "inbox/grok_1793881362905.jpg", "items/it_ore.webp": "inbox/grok_1793881365140.jpg", "items/it_supply.webp": "inbox/grok_1793881367748.jpg", "items/it_ticket.webp": "inbox/grok_1793881370880.jpg", "items/it_record.webp": "inbox/grok_1793881373898.jpg", "items/it_relic.webp": "inbox/grok_1793881377927.jpg", "equip/eq_w_lantern.webp": "inbox/grok_1793881470715.jpg", "equip/eq_w_bow.webp": "inbox/grok_1793881473023.jpg", "terrain/t_house.webp": "grok_1793885809048.jpg", "terrain/t_bridge.webp": "grok_1793885811548.jpg", "terrain/t_lamp.webp": "grok_1793885816109.jpg", "backgrounds/fac_roster.webp": "grok_1793885819513.jpg", "backgrounds/fac_wardrobe.webp": "grok_1793885822540.jpg", "backgrounds/fac_quest.webp": "grok_1793885825770.jpg", "story/end1_1.webp": "grok_1793885829470.jpg", "story/end1_2.webp": "grok_1793885832328.jpg", "story/pc_a.webp": "grok_1793885837442.jpg", "story/pc_b.webp": "grok_1793885840530.jpg", "story/bg_talk_gate.webp": "grok_1793885843610.jpg", "story/bg_talk_wall.webp": "grok_1793885845982.jpg", "story/bg_talk_camp.webp": "grok_1793885848419.jpg"},
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
  HOUSE:{name:'民房',cost:1,def:.1,pass:true,glyph:'屋',art:'terrain/t_house.webp'},
  BRIDGE:{name:'石橋',cost:1,def:0,pass:true,glyph:'橋',art:'terrain/t_bridge.webp'},
  LAMP:{name:'燈座',cost:1,def:.05,pass:true,glyph:'燈',art:'terrain/t_lamp.webp'},
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
 rarityName:['常駐','精銳','傳世','神秘'],rarityMult:[1,1.08,1.16,1.24],starStep:.04,maxStar:5,
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
 ,{"id": "wangdeng", "name": "望燈", "title": "月燈巡界者", "unit": "P_HEALER", "r": 3, "src": "inbox/file_00000000141482098d4bfc74be227ad3.png", "myth": true, "bio": "渡鴉公會的特殊分身。誕生於一段未曾說出口的願望：即使世界被黑暗吞沒，迷失的人仍能找到回家的路。這份意念凝成一盞古老的月燈，燈火燃起時，她出現在一座早已廢棄的驛站。她知道自己救不了每一個人，所以堅持記住每一個沒能回來的名字。"},{"id": "feie", "name": "緋厄", "title": "禁契織命師", "unit": "P_WEAVER", "r": 3, "src": "inbox/file_00000000b5008209998e1755b56ec368.png", "myth": true, "bio": "渡鴉公會的特殊分身。誕生於「她」一次對自身命運的剝離：不願被約束的欲望、對命運的嘲弄、無法忍受失去重要之物的執念，被編進一縷緋紅命線。命線第一次自己打結時，她睜開了眼睛。她喜歡看人們怎麼背叛自己的誓言，卻最討厭別人替她決定未來。"}],
 starters:['shieldF','spear','mageF','healerF','archerH','mageM'],
 gacha:{rates:[.80,.17,.03],pity:50,tenGuarantee:1,firstTen:1,startTickets:10},
 rewards:{win:{tickets:3,supply:60},winClean:{tickets:1},lose:{tickets:1,supply:25},firstSupply:40,perKill:3},
 xp:{join:40,win:40,kill:15,perLevel:100,maxLv:20,statStep:.04},
 squad:{maxLv:5,lvCost:15,hpStep:.05,bonusStep:.015,maxTier:3,tierCost:50,passiveCost:40,slotsAt:[2,4,5],baseBonus:.2},
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
  rewards:[{ore:8,supply:30},{record:2,supply:20},{tickets:3},{eq:1},{relic:1,ore:4},{ore:12},{coins:15,gift:1},{coins:10,ore:6},{gift:2,supply:20}]
 },
 // ---------- v1.2：專屬技、專屬奧義、個人天賦（照渡鴉公會的招式與天賦改成戰棋版）----------
 personalAt:{skill:1,ult:10},
 personal:{"shieldF": ["fe_mu", "fe_crow"], "spear": ["sp_back", "sp_thou"], "mageF": ["mf_calm", "mf_night"], "healerF": ["hf_paste", "hf_bath"], "archerH": ["ah_knife", "ah_hide"], "shieldM": ["sm_prop", "sm_rock"], "mageM": ["mm_stele", "mm_dim"], "shield0": ["s0_great", "s0_combo"], "mage0": ["m0_eye", "m0_curse"], "healer1": ["h1_bitter", "h1_same"], "knightW": ["kw_charge", "kw_oath"], "herb": ["hb_moss", "hb_odd"], "foxgirl": ["fg_red", "fg_lure"], "horn": ["hn_rock", "hn_slide"], "fox": ["fx_ink", "fx_tails"], "snake": ["sn_kiss", "sn_molt"], "spider": ["sd_wick", "sd_bridge"], "bone": ["bn_shell", "bn_quake"], "tiekou": ["tk_lock", "tk_wall"], "dragon": ["dr_claw", "dr_breath"], "raven": ["rv_peck", "rv_flock"], "wangdeng": ["wd_watch", "wd_echo", "wd_gate"], "feie": ["fy_pact", "fy_bind", "fy_judge"], "moli": ["ml_probe", "ml_eyes"], "baigu": ["bg_needle", "bg_box"], "luoqingluan": ["lq_bell", "lq_domain"], "sihuang": ["sh_seal", "sh_heaven"]},
 genSkills:{"fe_mu": {"kind": "gen", "name": "羽幕", "ic": ["inbox/grok_1793244741515.jpg", 6], "art": "inbox/grok_1793244871174.jpg", "cd": 4, "desc": "自己和 1 格內的隊友得到護盾（生命 15%）；自己嘲諷 2 回合（附近的敵人會優先打她）。", "tg": "self", "shape": "allyAround", "r": 1, "ally": {"shield": 0.15}, "self": {"st": [["taunt", 2]]}, "fx": "fx_guard"}, "fe_crow": {"kind": "gen", "name": "鴉群", "ic": ["inbox/grok_1793244741515.jpg", 0], "art": "inbox/grok_1793244871174.jpg", "cd": 6, "desc": "黑羽散開：2 格內的敵人 80% 機率致盲 2 回合（命中大降）。", "tg": "self", "shape": "around", "r": 2, "mult": 0, "st": [["blind", 2, 0.8]], "fx": "fx_shadow"}, "sp_back": {"kind": "gen", "name": "回馬槍", "ic": ["inbox/grok_1793244720274.jpg", 0], "art": "inbox/grok_1793244860209.jpg", "cd": 3, "desc": "1.2 倍傷害並流血 2 回合；刺完往後退一格，下回合閃避提高。", "tg": "enemy", "range": [1, 1], "shape": "one", "mult": 1.2, "st": [["bleed", 2, 1]], "self": {"retreat": 1, "st": [["evade", 1]]}, "fx": "fx_pierce"}, "sp_thou": {"kind": "gen", "name": "千槍", "ic": ["inbox/grok_1793244726352.jpg", 4], "art": "inbox/grok_1793244860209.jpg", "cd": 5, "desc": "對一個敵人連刺 5 下，每下 0.5 倍並流血（流血可以疊）。", "tg": "enemy", "range": [1, 1], "shape": "one", "mult": 0.5, "hits": 5, "st": [["bleed", 2, 0.6]], "fx": "fx_pierce"}, "mf_calm": {"kind": "gen", "name": "靜潮", "ic": ["inbox/grok_1793244746283.jpg", 1], "art": "inbox/grok_1793244863725.jpg", "cd": 3, "desc": "選一格當中心，3×3 冰霜 0.7 倍傷害，減速 2 回合（移動 −1）。", "tg": "tile", "range": [1, 3], "shape": "area", "mult": 0.7, "st": [["slow", 2, 1]], "fx": "fx_magic"}, "mf_night": {"kind": "gen", "name": "夜潮", "ic": ["inbox/grok_1793245185390.jpg", 2], "art": "inbox/grok_1793244863725.jpg", "cd": 5, "desc": "1.4 倍傷害；目標已經被減速或凍住時，碎裂傷害 ×1.6。打完把牠凍住 1 回合（下回合不能行動）。", "tg": "enemy", "range": [1, 3], "shape": "one", "mult": 1.4, "shatter": 1.6, "st": [["freeze", 1, 1]], "fx": "fx_magic"}, "hf_paste": {"kind": "gen", "name": "青蒿膏", "ic": ["inbox/grok_1793244715349.jpg", 0], "art": "inbox/grok_1793244863725.jpg", "cd": 2, "desc": "回復 2 格內一名隊友 30% 生命、20% 士兵（生命低於 6 成時再多一半），解除兩個壞狀態。", "tg": "ally", "range": [0, 2], "shape": "one", "ally": {"heal": 0.3, "sol": 0.2, "low": 1.5, "cleanse": 2}, "fx": "fx_heal"}, "hf_bath": {"kind": "gen", "name": "藥浴", "ic": ["inbox/grok_1793244715349.jpg", 6], "art": "inbox/grok_1793244863725.jpg", "cd": 5, "desc": "2 格內所有隊友回復 20% 生命，之後再生 3 回合。", "tg": "self", "shape": "allyAround", "r": 2, "ally": {"heal": 0.2, "sol": 0.1, "st": [["regen", 3]]}, "fx": "fx_heal"}, "ah_knife": {"kind": "gen", "name": "夜羽飛刀", "ic": ["inbox/grok_1793244713129.jpg", 1], "art": "inbox/grok_1793244865508.jpg", "cd": 3, "desc": "3 把飛刀隨機射向 3 格內的敵人，每把 0.6 倍（不會被反擊）。", "tg": "self", "shape": "rand", "range": [1, 3], "hits": 3, "mult": 0.6, "fx": "fx_arrow"}, "ah_hide": {"kind": "gen", "name": "影遁", "ic": ["inbox/grok_1793244759393.jpg", 1], "art": "inbox/grok_1793244858240.jpg", "cd": 5, "desc": "2 回合內不會被敵人選為目標；下一次攻擊必定暴擊。", "tg": "self", "shape": "none", "self": {"st": [["stealth", 2]], "sure": 1}, "fx": "fx_shadow"}, "sm_prop": {"kind": "gen", "name": "頂盾", "ic": ["inbox/grok_1793244705950.jpg", 4], "art": "inbox/grok_1793244871174.jpg", "cd": 4, "desc": "舉盾頂住：自己和 2 格內的隊友 2 回合受到的傷害 −30%。", "tg": "self", "shape": "allyAround", "r": 2, "ally": {"st": [["ward", 2]]}, "fx": "fx_guard"}, "sm_rock": {"kind": "gen", "name": "崩岩", "ic": ["inbox/grok_1793244764417.jpg", 0], "art": "inbox/grok_1793244871174.jpg", "cd": 5, "desc": "2 格內所有敵人 0.8 倍傷害，30% 機率凍住（被砸暈）1 回合。", "tg": "self", "shape": "around", "r": 2, "mult": 0.8, "st": [["freeze", 1, 0.3]], "fx": "fx_hit"}, "mm_stele": {"kind": "gen", "name": "碑焰", "ic": ["inbox/grok_1793244772194.jpg", 0], "art": "inbox/grok_1793244867247.jpg", "cd": 3, "desc": "火焰 1.5 倍傷害，燃燒 3 回合（每回合燒掉士兵，可以疊）。", "tg": "enemy", "range": [1, 3], "shape": "one", "mult": 1.5, "st": [["burn", 3, 1]], "fx": "fx_magic"}, "mm_dim": {"kind": "gen", "name": "昏燈", "ic": ["inbox/grok_1793244728859.jpg", 5], "art": "inbox/grok_1793244867247.jpg", "cd": 5, "desc": "選一格當中心，3×3 火焰 0.5 倍並燃燒，60% 機率恐懼 2 回合（不能反擊、攻擊 −20%）。", "tg": "tile", "range": [1, 3], "shape": "area", "mult": 0.5, "st": [["burn", 3, 1], ["fear", 2, 0.6]], "fx": "fx_magic"}, "s0_great": {"kind": "gen", "name": "重劍", "ic": ["inbox/grok_1793244784046.jpg", 6], "art": "inbox/grok_1793244860209.jpg", "cd": 3, "desc": "1.8 倍傷害，破甲 2 回合（防禦 −30%）。", "tg": "enemy", "range": [1, 1], "shape": "one", "mult": 1.8, "st": [["brk", 2, 1]], "fx": "fx_slash"}, "s0_combo": {"kind": "gen", "name": "劍盾連擊", "ic": ["inbox/grok_1793244784046.jpg", 3], "art": "inbox/grok_1793244871174.jpg", "cd": 5, "desc": "砍兩下各 0.9 倍，之後嘲諷 2 回合。", "tg": "enemy", "range": [1, 1], "shape": "one", "mult": 0.9, "hits": 2, "self": {"st": [["taunt", 2]]}, "fx": "fx_slash"}, "m0_eye": {"kind": "gen", "name": "藍瞳", "ic": ["inbox/grok_1793376174678.jpg", 3], "art": "inbox/grok_1793244856306.jpg", "cd": 3, "desc": "1.0 倍傷害，致盲並封印 2 回合（不能用技能）。", "tg": "enemy", "range": [1, 3], "shape": "one", "mult": 1.0, "st": [["blind", 2, 1], ["seal", 2, 1]], "fx": "fx_mark"}, "m0_curse": {"kind": "gen", "name": "無名之咒", "ic": ["inbox/grok_1793376876106.jpg", 3], "art": "inbox/grok_1793244856306.jpg", "cd": 6, "desc": "選一格當中心，3×3 的敵人被下延爆詛咒：3 回合後一次爆開（約 1.6 倍法術傷害）。", "tg": "tile", "range": [1, 4], "shape": "area", "mult": 0, "doom": 1.6, "fx": "fx_mark"}, "h1_bitter": {"kind": "gen", "name": "苦藥", "ic": ["inbox/grok_1793244733716.jpg", 6], "art": "inbox/grok_1793244863725.jpg", "cd": 2, "desc": "回復 2 格內一名隊友 25% 生命；同一劑藥灑向離目標最近的敵人，讓牠中毒 3 回合。", "tg": "ally", "range": [0, 2], "shape": "one", "ally": {"heal": 0.25, "sol": 0.15}, "poisonNear": 1, "fx": "fx_heal"}, "h1_same": {"kind": "gen", "name": "藥毒同源", "ic": ["inbox/grok_1793244774664.jpg", 0], "art": "inbox/grok_1793244863725.jpg", "cd": 5, "desc": "2 格內所有隊友回復 10% 生命，場上每有一個中毒的敵人，再多回 6%。", "tg": "self", "shape": "allyAround", "r": 2, "ally": {"heal": 0.1, "sol": 0.1}, "perPoison": 0.06, "fx": "fx_heal"}, "kw_charge": {"kind": "gen", "name": "白羽衝鋒", "ic": ["inbox/grok_1793244751196.jpg", 8], "art": "inbox/grok_1793244860209.jpg", "cd": 3, "desc": "1.4 倍傷害（走得越遠越痛：每走 1 格 +5%），之後嘲諷 2 回合。", "tg": "enemy", "range": [1, 1], "shape": "one", "mult": 1.4, "chargeP": 0.05, "self": {"st": [["taunt", 2]]}, "fx": "fx_slash"}, "kw_oath": {"kind": "gen", "name": "北境誓約", "ic": ["inbox/grok_1793244723897.jpg", 4], "art": "inbox/grok_1793244871174.jpg", "cd": 5, "desc": "和 3 格內一名隊友立誓 3 回合：那名隊友受到的傷害有三成由伊恪承受。", "tg": "ally", "range": [1, 3], "shape": "one", "oath": 3, "fx": "fx_guard"}, "hb_moss": {"kind": "gen", "name": "苔膏", "ic": ["inbox/grok_1793376372749.jpg", 0], "art": "inbox/grok_1793244863725.jpg", "cd": 3, "desc": "2 格內所有隊友回復 8% 生命，再生 2 回合。", "tg": "self", "shape": "allyAround", "r": 2, "ally": {"heal": 0.08, "st": [["regen", 2]]}, "fx": "fx_heal"}, "hb_odd": {"kind": "gen", "name": "異苔", "ic": ["inbox/grok_1793375954414.jpg", 3], "art": "inbox/grok_1793244863725.jpg", "cd": 5, "desc": "3 格內所有隊友再生 4 回合；苔會長歪：每個人一半機會振奮 2 回合（傷害 +15%）。", "tg": "self", "shape": "allyAround", "r": 3, "ally": {"st": [["regen", 4], ["might", 2, 0.5]]}, "fx": "fx_heal"}, "fg_red": {"kind": "gen", "name": "緋燈", "ic": ["inbox/grok_1793376174678.jpg", 2], "art": "inbox/grok_1793244867247.jpg", "cd": 3, "desc": "火焰 1.1 倍傷害，致盲並照明 2 回合（閃避 −20%）。", "tg": "enemy", "range": [1, 3], "shape": "one", "mult": 1.1, "st": [["blind", 2, 1], ["lit", 2, 1]], "fx": "fx_magic"}, "fg_lure": {"kind": "gen", "name": "迷燈", "ic": ["inbox/grok_1793376174678.jpg", 4], "art": "inbox/grok_1793244867247.jpg", "cd": 6, "desc": "選一格當中心，3×3 的敵人 45% 機率被魅惑 1 回合（下回合不能行動）。", "tg": "tile", "range": [1, 4], "shape": "area", "mult": 0, "st": [["charm", 1, 0.45]], "fx": "fx_lamp"}, "hn_rock": {"kind": "gen", "name": "岩槍", "ic": ["inbox/grok_1793244726352.jpg", 1], "art": "inbox/grok_1793244860209.jpg", "cd": 3, "desc": "1.5 倍傷害，25% 機率把敵人震暈 1 回合。", "tg": "enemy", "range": [1, 1], "shape": "one", "mult": 1.5, "st": [["freeze", 1, 0.25]], "fx": "fx_pierce"}, "hn_slide": {"kind": "gen", "name": "山崩", "ic": ["inbox/grok_1793244761932.jpg", 8], "art": "inbox/grok_1793244860209.jpg", "cd": 6, "desc": "選一格當中心，3×3 的敵人 1.1 倍傷害並破甲 2 回合。", "tg": "tile", "range": [1, 2], "shape": "area", "mult": 1.1, "st": [["brk", 2, 1]], "fx": "fx_hit"}, "fx_ink": {"kind": "gen", "name": "墨火", "ic": ["inbox/grok_1793375419027.jpg", 1], "art": "inbox/grok_1793244867247.jpg", "cd": 3, "desc": "火焰 1.1 倍傷害並燃燒 3 回合，致盲 2 回合。", "tg": "enemy", "range": [1, 3], "shape": "one", "mult": 1.1, "st": [["burn", 3, 1], ["blind", 2, 1]], "fx": "fx_magic"}, "fx_tails": {"kind": "gen", "name": "千尾", "ic": ["inbox/grok_1793245185390.jpg", 6], "art": "inbox/grok_1793244867247.jpg", "cd": 6, "desc": "放出狐火 3 回合：燈守每次攻擊或用技能後，狐火再撲咬一次（0.4 倍）。", "tg": "self", "shape": "none", "self": {"st": [["echo", 3]]}, "fx": "fx_lamp"}, "sn_kiss": {"kind": "gen", "name": "蛇吻", "ic": ["inbox/grok_1793244764417.jpg", 4], "art": "inbox/grok_1793244854039.jpg", "cd": 3, "desc": "1.1 倍傷害並中毒 3 回合；自己回復 10% 生命。", "tg": "enemy", "range": [1, 1], "shape": "one", "mult": 1.1, "st": [["poison", 3, 1]], "self": {"heal": 0.1}, "fx": "fx_slash"}, "sn_molt": {"kind": "gen", "name": "蛻變", "ic": ["inbox/grok_1793244764417.jpg", 1], "art": "inbox/grok_1793244854039.jpg", "cd": 5, "desc": "2 格內所有隊友回復 15% 生命，解除所有壞狀態。", "tg": "self", "shape": "allyAround", "r": 2, "ally": {"heal": 0.15, "cleanse": 9}, "fx": "fx_heal"}, "sd_wick": {"kind": "gen", "name": "燭絲", "ic": ["inbox/grok_1793244736140.jpg", 0], "art": "inbox/grok_1793244862046.jpg", "cd": 3, "desc": "選一格當中心，3×3 的敵人 0.4 倍傷害，被絲線連在一起並燃燒 3 回合（打其中一個，三成傷害會傳給其他連著的）。", "tg": "tile", "range": [1, 3], "shape": "area", "mult": 0.4, "st": [["link", 3, 1], ["burn", 3, 1]], "fx": "fx_bind"}, "sd_bridge": {"kind": "gen", "name": "紗橋", "ic": ["inbox/grok_1793244781506.jpg", 8], "art": "inbox/grok_1793244869057.jpg", "cd": 5, "desc": "3 格內所有隊友得到替身線 2 回合：受到的傷害兩成轉給被連住的敵人。", "tg": "self", "shape": "allyAround", "r": 3, "ally": {"st": [["proxy", 2]]}, "fx": "fx_bind"}, "bn_shell": {"kind": "gen", "name": "縮殼", "ic": ["inbox/grok_1793244702927.jpg", 6], "art": "inbox/grok_1793244871174.jpg", "cd": 5, "desc": "縮進殼裡：1 回合內完全不受傷，回復 15% 生命，並嘲諷。", "tg": "self", "shape": "none", "self": {"st": [["shell", 1], ["taunt", 1]], "heal": 0.15}, "fx": "fx_guard"}, "bn_quake": {"kind": "gen", "name": "殼震", "ic": ["inbox/grok_1793376070308.jpg", 5], "art": "inbox/grok_1793244871174.jpg", "cd": 5, "desc": "2 格內所有敵人受到傷害，看防禦（防禦 ×1.2）而不是攻擊。", "tg": "self", "shape": "around", "r": 2, "mult": 1.2, "useDef": 1, "fx": "fx_hit"}, "tk_lock": {"kind": "gen", "name": "扣鎖", "ic": ["inbox/grok_1793244761932.jpg", 4], "art": "inbox/grok_1793244871174.jpg", "cd": 3, "desc": "1.2 倍傷害，封印 2 回合（不能用技能）。", "tg": "enemy", "range": [1, 1], "shape": "one", "mult": 1.2, "st": [["seal", 2, 1]], "fx": "fx_bind"}, "tk_wall": {"kind": "gen", "name": "白鐵壁", "ic": ["inbox/grok_1793375954414.jpg", 1], "art": "inbox/grok_1793244871174.jpg", "cd": 5, "desc": "1 格內的隊友和自己得到護盾（生命 18%）；自己嘲諷 2 回合。", "tg": "self", "shape": "allyAround", "r": 1, "ally": {"shield": 0.18}, "self": {"st": [["taunt", 2]]}, "fx": "fx_guard"}, "dr_claw": {"kind": "gen", "name": "龍爪", "ic": ["inbox/grok_1793244743978.jpg", 1], "art": "inbox/grok_1793244860209.jpg", "cd": 3, "desc": "1.3 倍傷害，留下侵蝕（破綻：受到的傷害 +20%）3 回合。", "tg": "enemy", "range": [1, 1], "shape": "one", "mult": 1.3, "st": [["vuln", 3, 1]], "fx": "fx_slash"}, "dr_breath": {"kind": "gen", "name": "龍息", "ic": ["inbox/grok_1793245185390.jpg", 8], "art": "inbox/grok_1793244867247.jpg", "cd": 6, "desc": "往前噴出直線 3 格的火焰，1.1 倍傷害，燃燒並侵蝕 2 回合。", "tg": "enemy", "range": [1, 1], "shape": "line", "len": 3, "mult": 1.1, "st": [["burn", 2, 1], ["vuln", 2, 1]], "fx": "fx_magic"}, "rv_peck": {"kind": "gen", "name": "啄眼", "ic": ["inbox/grok_1793376174678.jpg", 0], "art": "inbox/grok_1793244865508.jpg", "cd": 3, "desc": "1.0 倍傷害，致盲 2 回合，標成獵物 3 回合（受到的傷害 +20%）。", "tg": "enemy", "range": [1, 3], "shape": "one", "mult": 1.0, "st": [["blind", 2, 1], ["mark", 3, 1]], "fx": "fx_arrow"}, "rv_flock": {"kind": "gen", "name": "群鴉", "ic": ["inbox/grok_1793244741515.jpg", 3], "art": "inbox/grok_1793244865508.jpg", "cd": 5, "desc": "鴉群隨機啄 5 下，3 格內的敵人各 0.55 倍。", "tg": "self", "shape": "rand", "range": [1, 3], "hits": 5, "mult": 0.55, "fx": "fx_shadow"}, "ml_probe": {"kind": "gen", "name": "勘驗", "ic": ["inbox/grok_1793244702927.jpg", 0], "art": "inbox/grok_1793244856306.jpg", "cd": 3, "desc": "1.0 倍傷害，標記 2 回合並看穿破綻（受到的傷害 +20%）2 回合。", "tg": "enemy", "range": [1, 3], "shape": "one", "mult": 1.0, "st": [["mark", 2, 1], ["vuln", 2, 1]], "fx": "fx_mark"}, "ml_eyes": {"kind": "gen", "name": "萬目窺真", "ic": ["inbox/grok_1793375544194.jpg", 3], "art": "inbox/grok_1793244856306.jpg", "cd": 6, "desc": "4 格內所有敵人 0.6 倍傷害，標記並露出破綻 2 回合。", "tg": "self", "shape": "around", "r": 4, "mult": 0.6, "st": [["mark", 2, 1], ["vuln", 2, 1]], "fx": "fx_mark"}, "bg_needle": {"kind": "gen", "name": "魂線穿針", "ic": ["inbox/grok_1793244700401.jpg", 4], "art": "inbox/grok_1793244862046.jpg", "cd": 3, "desc": "1.15 倍傷害，連線 3 回合；連著的敵人被打時，三成傷害會傳給其他連著的。", "tg": "enemy", "range": [1, 3], "shape": "one", "mult": 1.15, "st": [["link", 3, 1]], "fx": "fx_bind"}, "bg_box": {"kind": "gen", "name": "九命匣守", "ic": ["inbox/grok_1793300991831.jpg", 4], "art": "inbox/grok_1793244862046.jpg", "cd": 6, "desc": "3 回合內倒下時，會從傀儡裡醒來（留 25% 生命）；同時得到護盾（生命 20%）。", "tg": "self", "shape": "none", "self": {"st": [["undying", 3]], "shield": 0.2}, "fx": "fx_guard"}, "lq_bell": {"kind": "gen", "name": "骨鈴鎮焰", "ic": ["inbox/grok_1793376462034.jpg", 7], "art": "inbox/grok_1793244863725.jpg", "cd": 3, "desc": "冰霜 1.2 倍傷害，封印 2 回合，熄掉牠身上的燃燒。", "tg": "enemy", "range": [1, 3], "shape": "one", "mult": 1.2, "st": [["seal", 2, 1]], "quench": 1, "fx": "fx_magic"}, "lq_domain": {"kind": "gen", "name": "封火鈴域", "ic": ["inbox/grok_1793276792854.jpg", 2], "art": "inbox/grok_1793244863725.jpg", "cd": 6, "desc": "2 格內所有敵人 1.0 倍冰霜，封印並減速 2 回合。", "tg": "self", "shape": "around", "r": 2, "mult": 1.0, "st": [["seal", 2, 1], ["slow", 2, 1]], "fx": "fx_magic"}, "sh_seal": {"kind": "gen", "name": "封名", "ic": ["inbox/grok_1793375419027.jpg", 6], "art": "inbox/grok_1793244867247.jpg", "cd": 3, "desc": "1.1 倍聖火，封印 2 回合並燃燒 2 回合。", "tg": "enemy", "range": [1, 3], "shape": "one", "mult": 1.1, "st": [["seal", 2, 1], ["burn", 2, 1]], "fx": "fx_magic"}, "sh_heaven": {"kind": "gen", "name": "天地不仁", "ic": ["inbox/grok_1793245185390.jpg", 0], "art": "inbox/grok_1793244867247.jpg", "cd": 6, "desc": "選一格當中心，3×3 的敵人 0.85 倍聖火並燃燒 3 回合。", "tg": "tile", "range": [1, 4], "shape": "area", "mult": 0.85, "st": [["burn", 3, 1]], "fx": "fx_magic"}, "cm_return": {"kind": "gen", "name": "退回", "ic": ["inbox/grok_1793244761932.jpg", 4], "art": "inbox/grok_1793244856306.jpg", "cd": 3, "desc": "1.0 倍傷害，封印 2 回合。", "tg": "enemy", "range": [1, 2], "shape": "one", "mult": 1.0, "st": [["seal", 2, 1]], "fx": "fx_mark"}, "cm_fire": {"kind": "gen", "name": "還魂火", "ic": ["inbox/grok_1793244772194.jpg", 0], "art": "inbox/grok_1793244867247.jpg", "cd": 3, "desc": "選一格當中心，3×3 的敵人 0.7 倍火焰並燃燒 2 回合。", "tg": "tile", "range": [1, 3], "shape": "area", "mult": 0.7, "st": [["burn", 2, 1]], "fx": "fx_magic"}, "cm_drill": {"kind": "gen", "name": "鑽穿", "ic": ["inbox/grok_1793244726352.jpg", 4], "art": "inbox/grok_1793244860209.jpg", "cd": 3, "desc": "往前直線 3 格 1.0 倍傷害並流血 2 回合。", "tg": "enemy", "range": [1, 1], "shape": "line", "len": 3, "mult": 1.0, "st": [["bleed", 2, 1]], "fx": "fx_pierce"}},
 ptal:{"shieldF": [{"id": "p_shieldF_1", "name": "鴉羽披風", "desc": "嘲諷時受到的傷害 −15%。", "fx": {"tauntDR": 0.15}}, {"id": "p_shieldF_2", "name": "代受", "desc": "相鄰的隊友受到的傷害 −10%（她替他們擋了一部分）。", "fx": {"coverAdj": 0.1}}, {"id": "p_shieldF_3", "name": "黑羽反擊", "desc": "反擊打中時，20% 機率讓敵人致盲 2 回合。", "fx": {"counterSt": ["blind", 2, 0.2]}}, {"id": "p_shieldF_4", "name": "最前面的人", "desc": "戰鬥一開始就嘲諷 2 回合，並得到生命 20% 的護盾。", "fx": {"open": [["taunt", 2]], "openShield": 0.2}}], "healerF": [{"id": "p_healerF_1", "name": "細心", "desc": "治療量 +10%。", "fx": {"healP": 0.1}}, {"id": "p_healerF_2", "name": "青蒿汁", "desc": "治療時順便解除燃燒、流血和中毒。", "fx": {"healCleanse": 1}}, {"id": "p_healerF_3", "name": "救不到", "desc": "有隊友倒下之後，治療量 +30%。", "fx": {"downHealP": 0.3}}, {"id": "p_healerF_4", "name": "藥香", "desc": "每回合結束，2 格內的隊友回復 3% 生命。", "fx": {"auraRegen": 0.03}}], "mageF": [{"id": "p_mageF_1", "name": "照明", "desc": "技能打中的敵人被照明 2 回合（閃避 −20%）。", "fx": {"skillSt": ["lit", 2, 1]}}, {"id": "p_mageF_2", "name": "燈影", "desc": "技能傷害 +10%。", "fx": {"skillP": 0.1}}, {"id": "p_mageF_3", "name": "漣漪", "desc": "技能打中時，20% 機率彈到附近另一個敵人（一半傷害）。", "fx": {"bounce": 0.2}}, {"id": "p_mageF_4", "name": "永夜", "desc": "不受恐懼的攻擊懲罰；技能打到減速的敵人，20% 機率凍住牠。", "fx": {"noFearPen": 1, "slowFreeze": 0.2}}], "archerH": [{"id": "p_archerH_1", "name": "探路先鋒", "desc": "移動 +1。", "fx": {"move": 1}}, {"id": "p_archerH_2", "name": "大概", "desc": "暴擊 +5%。", "fx": {"crit": 5}}, {"id": "p_archerH_3", "name": "活到最後", "desc": "只剩自己還站著時，攻擊 +50%。", "fx": {"lastStand": 0.5}}, {"id": "p_archerH_4", "name": "留給你們", "desc": "擊倒敵人時，全隊回復 5% 生命。", "fx": {"killTeamHeal": 0.05}}], "shieldM": [{"id": "p_shieldM_1", "name": "落石經驗", "desc": "受到的範圍傷害 −20%。", "fx": {"aoeDR": 0.2}}, {"id": "p_shieldM_2", "name": "三層", "desc": "每被打 3 次，得到生命 15% 的護盾。", "fx": {"hitShield": 0.15}}, {"id": "p_shieldM_3", "name": "岩層", "desc": "每被打 6 次，岩層崩落：2 格內所有敵人受到 0.8 倍傷害。", "fx": {"rockBlast": 0.8}}, {"id": "p_shieldM_4", "name": "不倒", "desc": "每場一次，受到致命傷時留下 1 點生命。", "fx": {"undyingOnce": 0.001}}], "mageM": [{"id": "p_mageM_1", "name": "碑火", "desc": "對站在污染地上的敵人，技能傷害 +15%。", "fx": {"fleshP": 0.15}}, {"id": "p_mageM_2", "name": "借來的火", "desc": "每次用技能扣自己 5% 生命，技能傷害 +15%。", "fx": {"castCost": 0.05, "skillP": 0.15}}, {"id": "p_mageM_3", "name": "無字", "desc": "不會被封印。", "fx": {"imm_seal": 1}}, {"id": "p_mageM_4", "name": "還火", "desc": "倒下時，對 2 格內所有敵人造成一次大傷害。", "fx": {"deathBlast": 1.2}}], "shield0": [{"id": "p_shield0_1", "name": "傭兵", "desc": "攻擊 +5%。", "fx": {"atkP": 0.05}}, {"id": "p_shield0_2", "name": "收錢辦事", "desc": "生命在八成以上時，攻擊 +15%。", "fx": {"healthyAtk": 0.15}}, {"id": "p_shield0_3", "name": "老江湖", "desc": "迴避 +6%。", "fx": {"eva": 6}}, {"id": "p_shield0_4", "name": "加錢", "desc": "每場第一次用技能，不會進入冷卻。", "fx": {"freeSkillOnce": 1}}], "mage0": [{"id": "p_mage0_1", "name": "無名", "desc": "不會被標記。", "fx": {"imm_mark": 1}}, {"id": "p_mage0_2", "name": "奪名", "desc": "延爆詛咒的傷害 +30%。", "fx": {"doomP": 0.3}}, {"id": "p_mage0_3", "name": "兜帽", "desc": "被攻擊時，15% 機率讓對方致盲 2 回合。", "fx": {"thornSt": ["blind", 2, 0.15]}}, {"id": "p_mage0_4", "name": "名字", "desc": "對被封印的敵人傷害 +25%。", "fx": {"vsSealP": 0.25}}], "healer1": [{"id": "p_healer1_1", "name": "自帶藥材", "desc": "戰鬥一開始就再生 3 回合。", "fx": {"open": [["regen", 3]]}}, {"id": "p_healer1_2", "name": "開玩笑的", "desc": "治療有 10% 機率加倍。", "fx": {"healDouble": 0.1}}, {"id": "p_healer1_3", "name": "流浪", "desc": "不會被致盲。", "fx": {"imm_blind": 1}}, {"id": "p_healer1_4", "name": "另算", "desc": "治療溢出時，目標振奮 2 回合（傷害 +15%）。", "fx": {"overHealMight": 1}}], "spear": [{"id": "p_spear_1", "name": "先制", "desc": "每場第一次攻擊傷害 ×1.3。", "fx": {"firstStrike": 0.3}}, {"id": "p_spear_2", "name": "搆得到", "desc": "一般攻擊有 20% 機率多刺一下（0.5 倍）。", "fx": {"extraHit": 0.2}}, {"id": "p_spear_3", "name": "濺血", "desc": "對流血中的敵人傷害 +15%。", "fx": {"vsBleedP": 0.15}}, {"id": "p_spear_4", "name": "槍林", "desc": "流血可以多疊 2 層。", "fx": {"dotCap": 2}}], "knightW": [{"id": "p_knightW_1", "name": "白羽", "desc": "不會恐懼。", "fx": {"imm_fear": 1}}, {"id": "p_knightW_2", "name": "北方", "desc": "不會被減速或凍住。", "fx": {"imm_slow": 1, "imm_freeze": 1}}, {"id": "p_knightW_3", "name": "騎士", "desc": "反擊傷害 +30%。", "fx": {"counterP": 0.3}}, {"id": "p_knightW_4", "name": "報告書", "desc": "戰鬥一開始，全隊受到的傷害 −30%（2 回合）。", "fx": {"openTeam": [["ward", 2]]}}], "herb": [{"id": "p_herb_1", "name": "採藥", "desc": "治療量 +8%。", "fx": {"healP": 0.08}}, {"id": "p_herb_2", "name": "苔藥", "desc": "治療時讓目標再生 2 回合。", "fx": {"healRegen": 1}}, {"id": "p_herb_3", "name": "撿", "desc": "擊倒敵人時，自己回復 10% 生命。", "fx": {"killSelfHeal": 0.1}}, {"id": "p_herb_4", "name": "百草", "desc": "每場第一次治療加倍。", "fx": {"firstHeal2": 1}}], "foxgirl": [{"id": "p_foxgirl_1", "name": "手作燈", "desc": "技能傷害 +15%。", "fx": {"skillP": 0.15}}, {"id": "p_foxgirl_2", "name": "不准摸", "desc": "被攻擊時，20% 機率讓對方燃燒 2 回合。", "fx": {"thornSt": ["burn", 2, 0.2]}}, {"id": "p_foxgirl_3", "name": "看著我", "desc": "對致盲的敵人傷害 +25%。", "fx": {"vsBlindP": 0.25}}, {"id": "p_foxgirl_4", "name": "燈匠", "desc": "攻擊 +10%；每場第一次用技能不會進入冷卻。", "fx": {"atkP": 0.1, "freeSkillOnce": 1}}], "horn": [{"id": "p_horn_1", "name": "岩心", "desc": "隊長生命 +10%。", "fx": {"hpP": 0.1}}, {"id": "p_horn_2", "name": "停不下來", "desc": "生命越低攻擊越高（最多 +30%）。", "fx": {"lowHpAtk": 0.3}}, {"id": "p_horn_3", "name": "找人", "desc": "有隊友倒下之後，攻擊 +30%。", "fx": {"downAtk": 0.3}}, {"id": "p_horn_4", "name": "回家", "desc": "每場一次，受到致命傷時以 30% 生命站住。", "fx": {"undyingOnce": 0.3}}], "fox": [{"id": "p_fox_1", "name": "嗅謊", "desc": "前 2 回合命中 +30%。", "fx": {"earlyHit": 30}}, {"id": "p_fox_2", "name": "墨尾", "desc": "技能打中時 10% 機率致盲 2 回合。", "fx": {"skillSt": ["blind", 2, 0.1]}}, {"id": "p_fox_3", "name": "守燈", "desc": "不會被減速。", "fx": {"imm_slow": 1}}, {"id": "p_fox_4", "name": "燈守", "desc": "擊倒敵人時，全隊回復 5% 生命。", "fx": {"killTeamHeal": 0.05}}], "snake": [{"id": "p_snake_1", "name": "盤繞", "desc": "受到的傷害 −10%。", "fx": {"dr": 0.1}}, {"id": "p_snake_2", "name": "蛇毒", "desc": "中毒、燃燒、流血每回合多扣 20%。", "fx": {"dotP": 0.2}}, {"id": "p_snake_3", "name": "蛻皮", "desc": "每 3 回合清掉自己身上的壞狀態。", "fx": {"selfCleanse3": 1}}, {"id": "p_snake_4", "name": "更好的自己", "desc": "每場一次，倒下時蛻一層皮，以 40% 生命站起來。", "fx": {"undyingOnce": 0.4}}], "spider": [{"id": "p_spider_1", "name": "路標", "desc": "移動 +1。", "fx": {"move": 1}}, {"id": "p_spider_2", "name": "銀絲", "desc": "被她連住的敵人同時減速。", "fx": {"linkSlow": 1}}, {"id": "p_spider_3", "name": "結網", "desc": "所有技能冷卻 −1（最少 2）。", "fx": {"quick": 1}}, {"id": "p_spider_4", "name": "紗橋", "desc": "隊友受到的傷害有一成轉給被連住的敵人。", "fx": {"linkShare": 0.1}}], "bone": [{"id": "p_bone_1", "name": "苔骨殼", "desc": "受到的傷害 −15%，移動 −1。", "fx": {"dr": 0.15, "move": -1}}, {"id": "p_bone_2", "name": "背甲", "desc": "被攻擊時 10% 機率完全擋下。", "fx": {"block": 0.1}}, {"id": "p_bone_3", "name": "苔", "desc": "每回合回復 3% 生命。", "fx": {"regenSelf": 0.03}}, {"id": "p_bone_4", "name": "磐", "desc": "不會被凍住或封印。", "fx": {"imm_freeze": 1, "imm_seal": 1}}], "tiekou": [{"id": "p_tiekou_1", "name": "礦坑", "desc": "受到的傷害 −10%。", "fx": {"dr": 0.1}}, {"id": "p_tiekou_2", "name": "握把", "desc": "反擊打中時讓敵人破甲 2 回合。", "fx": {"counterSt": ["brk", 2, 1]}}, {"id": "p_tiekou_3", "name": "被送走的人", "desc": "有隊友倒下之後，攻擊 +20%。", "fx": {"downAtk": 0.2}}, {"id": "p_tiekou_4", "name": "回家的路", "desc": "每場一次，受到致命傷時以 30% 生命站住。", "fx": {"undyingOnce": 0.3}}], "dragon": [{"id": "p_dragon_1", "name": "蟄伏", "desc": "開戰時蟄伏：受到的傷害減半、移動 −1；第 4 回合或生命掉到六成以下時甦醒，振奮 3 回合。", "fx": {"slumber": 1}}, {"id": "p_dragon_2", "name": "逆鱗", "desc": "被近戰打中時，反彈 15% 傷害。", "fx": {"thornDmg": 0.15}}, {"id": "p_dragon_3", "name": "不想睡", "desc": "不會被凍住。", "fx": {"imm_freeze": 1}}, {"id": "p_dragon_4", "name": "被記住", "desc": "甦醒時，全隊振奮 3 回合。", "fx": {"wakeTeam": 1}}], "raven": [{"id": "p_raven_1", "name": "鴉眼", "desc": "她給的狀態多 1 回合。", "fx": {"stDur": 1}}, {"id": "p_raven_2", "name": "啄食", "desc": "擊倒敵人時回復 12% 生命，所有技能冷卻 −1。", "fx": {"killSelfHeal": 0.12, "killCd": 1}}, {"id": "p_raven_3", "name": "夜行", "desc": "暴擊 +8%。", "fx": {"crit": 8}}, {"id": "p_raven_4", "name": "渡鴉", "desc": "每場第一次受到致命攻擊時，化成羽毛閃開（留 1 點生命）。", "fx": {"undyingOnce": 0.001}}], "moli": [{"id": "p_moli_1", "name": "勘驗官", "desc": "她給的狀態多 1 回合。", "fx": {"stDur": 1}}, {"id": "p_moli_2", "name": "交叉比對", "desc": "對被標記的敵人傷害 +15%。", "fx": {"vsMarkP": 0.15}}, {"id": "p_moli_3", "name": "藏槍", "desc": "暴擊 +8%。", "fx": {"crit": 8}}, {"id": "p_moli_4", "name": "結案", "desc": "對生命低於三成的敵人傷害 +30%。", "fx": {"execLow": 0.3}}], "baigu": [{"id": "p_baigu_1", "name": "魂線", "desc": "隊友受到的傷害有一成轉給被連住的敵人。", "fx": {"linkShare": 0.1}}, {"id": "p_baigu_2", "name": "寄魂木偶", "desc": "戰鬥一開始，受到的傷害 −30%（2 回合）。", "fx": {"open": [["ward", 2]]}}, {"id": "p_baigu_3", "name": "魂匣", "desc": "每場一次，倒下時從傀儡裡醒來（25% 生命）。", "fx": {"undyingOnce": 0.25}}, {"id": "p_baigu_4", "name": "反寄生", "desc": "不會中毒、流血。", "fx": {"imm_poison": 1, "imm_bleed": 1}}], "luoqingluan": [{"id": "p_luoqingluan_1", "name": "骨鈴", "desc": "不會恐懼。", "fx": {"imm_fear": 1}}, {"id": "p_luoqingluan_2", "name": "封火", "desc": "技能打中時 15% 機率再封印 1 回合。", "fx": {"skillSt": ["seal", 1, 0.15]}}, {"id": "p_luoqingluan_3", "name": "淨火", "desc": "每回合結束，2 格內的隊友各解除一個燃燒、流血或中毒。", "fx": {"auraCleanse": 1}}, {"id": "p_luoqingluan_4", "name": "環陣", "desc": "相鄰的隊友受到的傷害 −10%。", "fx": {"coverAdj": 0.1}}], "sihuang": [{"id": "p_sihuang_1", "name": "守印", "desc": "她給的狀態多 1 回合。", "fx": {"stDur": 1}}, {"id": "p_sihuang_2", "name": "聖火長明", "desc": "治療量 +15%。", "fx": {"healP": 0.15}}, {"id": "p_sihuang_3", "name": "以身補印", "desc": "每次用技能扣自己 10% 生命，技能傷害 +20%。", "fx": {"castCost": 0.1, "skillP": 0.2}}, {"id": "p_sihuang_4", "name": "燃己", "desc": "倒下時，2 格內的隊友回復 30% 生命。", "fx": {"deathHealTeam": 0.3}}], "wangdeng": [{"id": "p_wangdeng_1", "name": "記住名字", "desc": "治療量 +10%。", "fx": {"healP": 0.1}}, {"id": "p_wangdeng_2", "name": "提燈守夜", "desc": "2 格內的隊友受到的傷害 −5%。", "fx": {"auraDR": 0.05}}, {"id": "p_wangdeng_3", "name": "月光不熄", "desc": "不會被封印、恐懼。", "fx": {"imm_seal": 1, "imm_fear": 1}}, {"id": "p_wangdeng_4", "name": "界碑", "desc": "每回合結束，2 格內的隊友各解除一個燃燒、流血或中毒。", "fx": {"auraCleanse": 1}}], "feie": [{"id": "p_feie_1", "name": "賭約", "desc": "技能傷害 +10%。", "fx": {"skillP": 0.1}}, {"id": "p_feie_2", "name": "死結", "desc": "她給的厄契多 1 回合。", "fx": {"stDur": 1}}, {"id": "p_feie_3", "name": "違約金", "desc": "對有厄契的敵人傷害 +15%。", "fx": {"vsPactP": 0.15}}, {"id": "p_feie_4", "name": "自己選的線", "desc": "不會被封印、魅惑。", "fx": {"imm_seal": 1, "imm_charm": 1}}]},
 // 專屬技能插畫（grok 第六批）
 skillArtP:{"fe_mu": "inbox/grok_1793888350769.jpg", "fe_crow": "inbox/grok_1793888355139.jpg", "sp_back": "inbox/grok_1793888358929.jpg", "sp_thou": "inbox/grok_1793888362204.jpg", "mf_night": "inbox/grok_1793888368862.jpg", "hf_paste": "inbox/grok_1793888373919.jpg", "hf_bath": "inbox/grok_1793888376932.jpg", "ah_knife": "inbox/grok_1793888379932.jpg", "ah_hide": "inbox/grok_1793888382858.jpg", "mm_stele": "inbox/grok_1793888386335.jpg", "mm_dim": "inbox/grok_1793888389479.jpg", "ml_probe": "inbox/grok_1793888425664.jpg", "ml_eyes": "inbox/grok_1793888429415.jpg", "sh_seal": "inbox/grok_1793888432862.jpg", "sh_heaven": "inbox/grok_1793888436019.jpg", "bg_needle": "inbox/grok_1793888439493.jpg", "bg_box": "inbox/grok_1793888443103.jpg", "lq_bell": "inbox/grok_1793888446590.jpg", "lq_domain": "inbox/grok_1793888449598.jpg", "rv_peck": "inbox/grok_1793888452698.jpg", "rv_flock": "inbox/grok_1793888456097.jpg", "sm_prop": "inbox/grok_1793888487637.jpg", "sm_rock": "inbox/grok_1793888490361.jpg", "s0_great": "inbox/grok_1793888493549.jpg", "s0_combo": "inbox/grok_1793888497421.jpg", "m0_curse": "inbox/grok_1793888504274.jpg", "h1_bitter": "inbox/grok_1793888507320.jpg", "h1_same": "inbox/grok_1793888509715.jpg", "kw_charge": "inbox/grok_1793888512609.jpg", "kw_oath": "inbox/grok_1793888515676.jpg", "hb_moss": "inbox/grok_1793888561590.jpg", "hb_odd": "inbox/grok_1793888565547.jpg", "fg_red": "inbox/grok_1793888568461.jpg", "fg_lure": "inbox/grok_1793888572129.jpg", "hn_rock": "inbox/grok_1793888575408.jpg", "hn_slide": "inbox/grok_1793888578532.jpg", "fx_ink": "inbox/grok_1793888581523.jpg", "fx_tails": "inbox/grok_1793888584736.jpg", "sn_kiss": "inbox/grok_1793888587596.jpg", "sn_molt": "inbox/grok_1793888590655.jpg", "sd_wick": "inbox/grok_1793888629218.jpg", "sd_bridge": "inbox/grok_1793888632146.jpg", "bn_shell": "inbox/grok_1793888635362.jpg", "bn_quake": "inbox/grok_1793888639711.jpg", "tk_lock": "inbox/grok_1793888642743.jpg", "tk_wall": "inbox/grok_1793888645411.jpg", "dr_claw": "inbox/grok_1793888649375.jpg", "dr_breath": "inbox/grok_1793888652311.jpg", "cm_return": "inbox/grok_1793888656036.jpg", "cm_fire": "inbox/grok_1793888659563.jpg", "cm_drill": "inbox/grok_1793888662943.jpg", "mf_calm": "inbox/sk_mf_calm.jpg", "m0_eye": "inbox/sk_m0_eye.jpg"},
 // 點陣小人：6 欄 × 4 排（待機 4、攻擊 6、技能 6、受傷 2＋倒下 4），綠底
 pixel:{"shieldF": "inbox/file_00000000d84882119075e3e9d30df886.png", "spear": "inbox/px_lancer_ref3.png", "mageF": "inbox/px_mageF.png", "archerH": "inbox/file_00000000ec748209b34983990828ba3b.png", "baigu": "inbox/px_baigu_xiansheng.png", "sihuang": "inbox/file_0000000047dc8209b1337c071eaed91c.png", "moli": "inbox/file_00000000a1988209ad7edc97b5f2f2e9.png", "luoqingluan": "inbox/px_luoqing.png", "healerF": "inbox/grok_1793892777895.jpg", "mageM": "inbox/grok_1793892780529.jpg", "shield0": "inbox/grok_1793892992268.jpg", "shieldM": "inbox/grok_1793892999203.jpg", "healer1": "inbox/grok_1793893115462.jpg", "mage0": "inbox/grok_1793893117956.jpg", "knightW": "inbox/grok_1793893585980.jpg", "herb": "inbox/grok_1793893590867.jpg", "horn": "inbox/grok_1793893746267.jpg", "foxgirl": "inbox/grok_1793893751511.jpg", "snake": "inbox/grok_1793893926117.jpg", "bone": "inbox/grok_1793893931497.jpg", "dragon": "inbox/grok_1793893935934.jpg", "tiekou": "inbox/grok_1793893939876.jpg", "spider": "inbox/grok_1793893944676.jpg", "raven": "inbox/grok_1793893953837.jpg", "fox": "inbox/grok_1793894001314.jpg", "feie": "inbox/grok_1793894071649.jpg", "wangdeng": "inbox/grok_1793894075136.jpg", "m:lackcrow": {"src": "inbox/grok_1793894346757.jpg", "cols": 4, "rows": 3}, "m:paper": {"src": "inbox/grok_1793894351111.jpg", "cols": 4, "rows": 3}, "m:dutyghost": {"src": "inbox/grok_1793894360851.jpg", "cols": 4, "rows": 3}, "m:deadletters": {"src": "inbox/grok_1793894364570.jpg", "cols": 4, "rows": 3}, "m:returndog": {"src": "inbox/grok_1793894407629.jpg", "cols": 4, "rows": 3}, "m:stampbug": {"src": "inbox/grok_1793894461364.jpg", "cols": 4, "rows": 3}, "m:moneycrow": {"src": "inbox/grok_1793894602443.jpg", "cols": 4, "rows": 3}, "m:paleworship": {"src": "inbox/grok_1793894665340.jpg", "cols": 4, "rows": 3}, "m:palanquin": {"src": "inbox/grok_1793894673474.jpg", "cols": 4, "rows": 3}, "m:redpaper": {"src": "inbox/grok_1793894676147.jpg", "cols": 4, "rows": 3}, "m:rustrat": {"src": "inbox/grok_1793894844707.jpg", "cols": 4, "rows": 3}, "m:rustlung": {"src": "inbox/grok_1793894852322.jpg", "cols": 4, "rows": 3}, "m:minecart": {"src": "inbox/grok_1793894856414.jpg", "cols": 4, "rows": 3}, "m:whiteminer": {"src": "inbox/grok_1793894859430.jpg", "cols": 4, "rows": 3}, "m:leech": {"src": "inbox/grok_1793894870622.jpg", "cols": 4, "rows": 3}, "m:wusign": {"src": "inbox/grok_1793894342438.jpg", "cols": 6, "rows": 3}, "m:paperking": {"src": "inbox/grok_1793894669023.jpg", "cols": 6, "rows": 3}, "m:deepdrill": {"src": "inbox/grok_1793894863024.jpg", "cols": 6, "rows": 3}},pixelGrid:{cols:6,rows:4,counts:[4,6,6,6]},
 mythSkills:{"wd_watch": {"kind": "gen", "name": "月燈・守夜", "ic": ["inbox/grok_1793244779109.jpg", 1], "cd": 3, "desc": "選一格當中心，3×3 展開月光結界：裡面的隊友 2 回合受到的傷害 −30%，並且有一半機會抵抗新的壞狀態。", "tg": "tile", "range": [0, 3], "shape": "areaAlly", "ally": {"st": [["ward", 2], ["resist", 2]]}, "fx": "fx_lamp"}, "wd_echo": {"kind": "gen", "name": "殘月回照", "ic": ["inbox/grok_1793276792854.jpg", 2], "cd": 2, "desc": "回復 2 格內一名隊友 25% 生命，解除兩個壞狀態；如果解掉的是燃燒、流血、中毒或延爆詛咒，再給生命 15% 的護盾。", "tg": "ally", "range": [0, 2], "shape": "one", "ally": {"heal": 0.25, "sol": 0.15, "cleanse": 2, "cleanseShield": 0.15}, "fx": "fx_heal"}, "wd_gate": {"kind": "gen", "name": "封界・不渡之門", "ic": ["inbox/grok_1793376462034.jpg", 3], "cd": 5, "desc": "選一格當中心，3×3 封界：裡面的敵人 0.6 倍法術傷害、封印並減速 2 回合；這一區正在擴散的污染被擋下來。", "tg": "tile", "range": [1, 3], "shape": "area", "mult": 0.6, "st": [["seal", 2, 1], ["slow", 2, 1]], "blockWarn": 1, "fx": "fx_purify"}, "fy_pact": {"kind": "gen", "name": "緋線・訂契", "ic": ["inbox/grok_1793244736140.jpg", 0], "cd": 2, "desc": "0.8 倍傷害，給敵人一層「厄契」（最多 5 層，3 回合）。帶著厄契的敵人每次出手，自己會被反噬：打出去的傷害每層 8%。", "tg": "enemy", "range": [1, 3], "shape": "one", "mult": 0.8, "st": [["pact", 3, 1]], "fx": "fx_bind"}, "fy_bind": {"kind": "gen", "name": "逆命收束", "ic": ["inbox/grok_1793244781506.jpg", 8], "cd": 4, "desc": "選一格當中心，3×3 的敵人 0.5 倍傷害，命運連在一起 3 回合（打其中一個，三成傷害傳給其他連著的），各加一層厄契。", "tg": "tile", "range": [1, 3], "shape": "area", "mult": 0.5, "st": [["link", 3, 1], ["pact", 3, 1]], "fx": "fx_bind"}, "fy_judge": {"kind": "gen", "name": "惡緣裁定", "ic": ["inbox/grok_1793375419027.jpg", 6], "cd": 5, "desc": "裁定一個敵人：1.0 倍傷害，每層厄契再 +35%（用掉全部厄契）。厄契 3 層以上時，再破甲並恐懼 2 回合。", "tg": "enemy", "range": [1, 3], "shape": "one", "mult": 1.0, "pactJudge": 0.35, "fx": "fx_mark"}},
 // 神秘角色：三招專屬技分別在 Lv1／Lv5／Lv10 學會；天生被動
 personalLv:{wangdeng:[1,5,10],feie:[1,5,10]},
 innate:{wangdeng:{emergShield:.2},feie:{bearLethal:1}},
 innateTxt:{wangdeng:['未熄的歸途','隊友的生命第一次掉到三成以下時，月燈自動給生命 20% 的護盾（每 3 回合一次）。'],feie:['不肯斷裂的線','隊友受到致命傷時，緋厄用自己的生命替他擋下（隊友留兩成生命；每 3 回合一次），之後振奮 2 回合。']},
 cmdSkill:{"RETURN": "cm_return", "PAPER": "cm_fire", "MINE": "cm_drill"},
 // ---------- v1.1：渡鴉幣、好感、禮物 ----------
 version:'v1.9.0',
 coins:{win:5,lose:1,first:15,name:'渡鴉幣'},costumePrice:100,
 aff:{tiers:[0,15,40,80,130],names:['普通','熟識','信賴','摯友','羈絆'],chat:8,gift:6,giftLike:15},
 giftDrop:{chance:.35,list:['soup','bread','fish','honey','wick','feather','iron']},
 // 時裝：讀渡鴉公會網站上的時裝目錄，再加上這三件（渡鴉公會程式裡寫死的）
 costumeCatalog:'../raven-guild/art/costumes/catalog.json',costumeRoot:'../raven-guild/',// 圖還是讀渡鴉公會網站上的；擁有與否改成在這裡用渡鴉幣換
 costumeExtra:[
  {id:'archerh_360',hero:'archerH',name:'黑羽刺客',theme:'黑羽與鐘樓',line:'衣服換了，影子還是同一個。',images:{normal:'art/costumes/archerH_costume360.webp'}},
  {id:'moli_360',hero:'moli',name:'萬目窺真',theme:'卷宗與窺視',line:'看得越多，就越難假裝沒看見。',images:{normal:'art/costumes/moli_costume360.webp'}},
  {id:'sihuang_360',hero:'sihuang',name:'封印巫女',theme:'六芒與烈火',line:'封印亮起來的時候，別看我的眼睛。',images:{normal:'art/costumes/sihuang_costume360.webp'}}],
 levelStep:.05,levelMax:25,
 // 第一章：敵人隨勝場變強，最多算到 8 勝（之後練功不會越練越難）
 chapterWinCap:8,
 // v1.2：我方多了專屬技與奧義，敵人整體跟著加強
 enemyMult:{hp:1.15,atk:1.08},
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
  MISSION_BRIDGE:{name:'石橋・守住橋頭',place:'石橋',chapter:1,threat:3,
   intro:'往東唯一的石橋。對岸的隊伍要過來，橋這頭的南岸（最下面四排）是我們的。守到第 10 回合結束。',
   w:12,h:12,roundLimit:10,
   map:['..F..H...F..','.F........F.','....R..R....','..F......F..','R....bb....R','DDDDDbbDDDwD','DDDDDbbDDDwD','R....bb....R','..H......H..','....F..F....','............','............'],
   legend:{'.':'PLAIN','F':'FOREST','H':'HILL','R':'RUBBLE','D':'DEEP_WATER','w':'SHALLOW_WATER','b':'BRIDGE'},
   obj:{type:'defend',tiles:[].concat(...[8,9,10,11].map(y=>Array.from({length:12},(_,x)=>[x,y]))),max:2},
   deploy:[[5,8],[6,8],[4,8],[7,8],[3,9],[8,9]],
   enemySlots:[[2,0],[9,0],[5,1],[6,1],[3,2],[8,2]],commanderAt:[6,0],
   events:[{round:1,say:'回合結束時，每有一隊敵人站在南岸最下面四排（紅框），就算過橋一次；累積 2 次就失敗。飛的會直接越過河，右邊還有一條淺灘。'},
    {round:3,wave:[[2,2,0],[5,9,0]],say:'對岸又來了兩隊。'},{round:5,wave:[[4,5,0],[1,6,0]],say:'第二批要過橋了。'},{round:6,spawnCommander:true,say:'敵方指揮在對岸督戰。擊倒它也能獲勝。'},{round:7,wave:[[5,10,2],[4,1,2]],say:'淺灘那邊也有動靜。'},{round:8,wave:[[2,3,0],[3,8,0],[0,10,1]],pressure:true,say:'最後一批，它們不管傷亡了。'}],
   win:'守到第 10 回合結束（或擊倒敵方指揮官）。',lose:'累積 2 次有敵人過橋，或我方全滅。'},
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

// v1.4 位階本能：直接作用於戰鬥，與可分配的天賦點分開。
DATA.rarityTraits={
 P_SHIELD:[{name:'守線',desc:'生命 +3%。',fx:{hpP:.03}},{name:'穩盾',desc:'防禦 +4%。',fx:{defP:.04}},{name:'掩護',desc:'相鄰隊友受到傷害 −5%（同類取最高）。',fx:{coverAdj:.05}}],
 P_SPEAR:[{name:'握槍',desc:'命中 +3%。',fx:{hit:3}},{name:'穿隙',desc:'攻擊 +4%。',fx:{atkP:.04}},{name:'槍陣',desc:'反擊傷害 +8%。',fx:{counterP:.08}}],
 P_LANTERN:[{name:'定燈',desc:'魔防 +3%。',fx:{resP:.03}},{name:'續火',desc:'法術 +4%。',fx:{atkP:.04}},{name:'照痕',desc:'對被標記目標傷害 +8%。',fx:{vsMarkP:.08}}],
 P_ARCHER:[{name:'定弦',desc:'命中 +3%。',fx:{hit:3}},{name:'覓隙',desc:'攻擊 +4%。',fx:{atkP:.04}},{name:'追痕',desc:'對被標記目標傷害 +8%。',fx:{vsMarkP:.08}}],
 P_HEALER:[{name:'護息',desc:'生命 +3%。',fx:{hpP:.03}},{name:'辨傷',desc:'治療量 +6%。',fx:{healP:.06}},{name:'援手',desc:'隊友倒下後治療量再 +8%。',fx:{downHealP:.08}}],
 P_WEAVER:[{name:'持線',desc:'魔防 +3%。',fx:{resP:.03}},{name:'緊弦',desc:'法術 +4%。',fx:{atkP:.04}},{name:'封結',desc:'對封印目標傷害 +8%。',fx:{vsSealP:.08}}],
 P_SCOUT:[{name:'輕步',desc:'迴避 +3%。',fx:{eva:3}},{name:'利刃',desc:'攻擊 +4%。',fx:{atkP:.04}},{name:'先機',desc:'每場第一次出手傷害 +8%。',fx:{firstStrike:.08}}]
};
DATA.gacha.rates=[.795,.17,.03,.005];
DATA.gacha.mythPity=200;
DATA.gacha.mythExchange=200;
// 先救出，再護送；戰後居民的狀態由這場戰鬥的結果決定。
DATA.missions.MISSION_RESCUE={
 name:'礦道旁・左輪還在響',place:'礦道旁',chapter:1,threat:0,w:12,h:12,roundLimit:12,
 intro:'一名推車人被壓在礦道旁。靠近後花一次行動解開繩索，再由同一隊護送回南側撤離點。其他成員要替他們留住回程的路。',
 map:DATA.missions.MISSION_MINE.map.slice(),legend:{...DATA.missions.MISSION_MINE.legend},
 obj:{type:'escort',person:[2,5],exit:[[2,10],[3,10],[4,10],[5,10],[6,10]],timeout:'夜霧封住礦道，救援隊被迫撤回'},
 deploy:DATA.missions.MISSION_MINE.deploy.map(p=>p.slice()),enemySlots:[[5,3],[8,4],[9,5]],commanderAt:[5,1],
 events:[{round:1,say:'求救聲在左側礦道 (2,5)。相鄰或站上該格後，選「解救」。護送隊移動 −1；回到南側金框撤離區 才算救援成功。'},
 {round:3,wave:[[2,8,3]],say:'北面的腳步聲靠近了。別讓護送隊落單。'},
 {round:5,wave:[[4,9,8]],say:'回程右側出現敵人。留一隊接應，或用束縛拖住追兵。'}],
 win:'解救推車人，並護送到南側任一撤離點。',lose:'護送隊倒下、我方全滅，或第 12 回合結束仍未撤離。'};
DATA.missions.MISSION_RESCUE.map[5]='..........R.';DATA.missions.MISSION_RESCUE.map[6]='.....S......';
DATA.region.push({id:'rescue',scene:'lv_mine',name:'左輪還在響',x:.24,y:.29,mission:'MISSION_RESCUE',needs:['MISSION_BC_001'],desc:'南門有人在等一名沒有回來的推車人。先到街巷接下請託。',side:true,flag:'rescueAccepted'});
// 獨立支線。主線入口與威脅等級不以這兩關的勝場計算。
DATA.missions.MISSION_PALANQUIN_ROAD={
 name:'還魂轎・霧棧道',place:'霧棧道',chapter:1,optional:true,faction:'PAPER',bgm:'palanquin',
 w:12,h:12,roundLimit:10,threat:0,
 intro:'舊棧道邊停著一頂無人迎的轎。渡口挑燈人受困，先救他，再從南側金框撤回。右路較短，左路有掩護。',
 map:['WW..WW..WW..','W....H.....W','....R..R....','..F.....F...','..F..WW.F...','....RWW..R..','..FF......F.','......SS....','..R...SS.R..','............','............','............'],
 legend:{'.':'PLAIN','W':'WALL','H':'HILL','R':'RUBBLE','F':'FOREST','S':'SWAMP'},
 obj:{type:'escort',person:[4,5],personName:'挑燈人',exit:[[2,10],[3,10],[8,10],[9,10]],safe:'挑燈人已沿棧道安全撤離',timeout:'霧封住了棧道，救援隊撤回南門'},
 deploy:[[4,9],[7,9],[3,9],[8,9],[2,10],[9,10]],
 enemySlots:[[7,4],[9,3],[5,2]],
 events:[
  {round:1,say:'到「救」字旁解救挑燈人。護送隊移動 −1，左右兩側的南端金框都能撤離。'},
  {round:2,warn:[[7,6],[7,7],[8,7]],say:'轎鈴響了兩聲。右路三格在下一回合受污染，可以改走左路，或用燈界及燈油護路。'},
  {round:4,wave:[[1,9,6]],say:'紙影從右側追上來了。讓護送隊先走，其他人斷後。'}
 ],
 win:'解救挑燈人並護送到南側任一金框。',lose:'護送隊倒下、我方全滅，或第 10 回合結束仍未撤離。'
};
DATA.missions.MISSION_PALANQUIN_LAMP={
 name:'還魂轎・無人迎親',place:'舊迎親台',chapter:1,optional:true,faction:'PAPER',bgm:'palanquin',
 w:12,h:12,roundLimit:9,threat:1,
 intro:'挑燈人指認了廢棄迎親台。守住台前的燈位，等他在城外辨完轎簿上的假名。可以封住正路，也能從兩側截住紙影。',
 map:['WW..WW..WW..','W....HH....W','...R....R...','..F..WW..F..','..F......F..','....RLLR....','..R..LL..R..','...F....F...','....S..S....','............','............','............'],
 legend:{'.':'PLAIN','W':'WALL','H':'HILL','R':'RUBBLE','F':'FOREST','S':'SWAMP','L':'LAMP'},
 obj:{type:'hold',tiles:[[5,5],[6,5],[5,6],[6,6]],need:3,label:'迎親台',timeout:'轎簿尚未辨完，迎親台已被霧吞沒'},
 deploy:[[5,8],[6,8],[4,9],[7,9],[3,9],[8,9]],
 enemySlots:[[3,4],[8,4],[5,2],[6,2]],
 events:[
  {round:1,say:'回合結束時，燈位上有我方且沒有敵人，守住進度 +1。累積三次即可撤回。'},
  {round:2,warn:[[5,6],[6,6],[6,7]],say:'轎簿在照著燈影寫字。下一回合三格受污染，提燈術士可先護住燈位。'},
  {round:4,wave:[[0,2,3],[1,9,3]],say:'兩側都傳來踏紙聲。別讓紙影踏入燈位。'}
 ],
 win:'累計守住迎親台燈位 3 回合。',lose:'我方全滅，或第 9 回合結束仍未守足。'
};
DATA.region.push(
 {id:'palanquin_road',scene:'lv_marsh',image:'assets/scenes/side_palanquin_road.webp',name:'霧棧道',x:.31,y:.64,mission:'MISSION_PALANQUIN_ROAD',needs:['MISSION_BC_001'],desc:'守住南門後，可赴棧道調查。',side:true},
 {id:'palanquin_lamp',scene:'lv_post',image:'assets/scenes/side_palanquin_lamp.webp',name:'舊迎親台',x:.68,y:.48,mission:'MISSION_PALANQUIN_LAMP',needs:['MISSION_PALANQUIN_ROAD'],desc:'先從霧棧道救回挑燈人。',side:true}
);
// 開局更早接敵；仍維持三勢力隨機與原本的勝利條件。
DATA.missions.MISSION_BC_001.enemySlots=[[5,1],[8,2],[5,5],[7,4],[3,3],[9,2]];



DATA.missions.MISSION_POST.events.push({round:2,say:'站內傳來敲桌聲：兩短，一長。有人還守著那張沒有寄出的單子。驛站只要有敵人就無法累積守住回合，先清出空間再留人駐守。'});


// v1.5：技能書與熟練度，數值採保守的試玩配置。
DATA.practice={max:100,thresholds:[0,20,50,100],names:['初習','熟習','精通','圓熟'],boost:[0,.03,.06,.10],supportShield:[0,.01,.02,.03],gain:2,battleCap:6};
DATA.bookRules={dropChance:.25,price:30,sellSupply:10,minLv:3};
DATA.bookSkills={
 bk_shield_line:{name:'盾列接應',kind:'gen',tg:'self',shape:'allyAround',r:1,cd:4,ally:{shield:.12,st:[['ward',1]]},icon:'sk_guard',fx:'fx_guard',desc:'自身與 1 格內隊友獲得生命 12% 護盾，並在本輪受到傷害 −30%。'},
 bk_spear_pin:{name:'釘影槍',kind:'gen',tg:'enemy',shape:'one',range:[1,2],cd:3,mult:.85,st:[['root',1,1],['slow',2,1]],icon:'sk_pierce',fx:'fx_pierce',desc:'1–2 格內一名敵人受到 0.85 倍傷害，束縛 1 次行動階段、減速 2 回合。'},
 bk_lantern_clear:{name:'照路',kind:'gen',tg:'tile',shape:'areaAlly',range:[0,3],cd:4,ally:{cleanse:1,st:[['resist',2]]},blockWarn:1,icon:'sk_lamp',fx:'fx_purify',desc:'3 格內選一格，3×3 內隊友解除一個壞狀態並獲得 2 回合抵抗；清除區內正在擴散的污染預告。'},
 bk_archer_bind:{name:'縛足箭',kind:'gen',tg:'enemy',shape:'one',range:[2,4],cd:3,mult:.8,st:[['slow',2,1],['mark',2,1]],icon:'sk_mark',fx:'fx_arrow',desc:'2–4 格內一名敵人受到 0.8 倍傷害，減速並標記 2 回合。需要視線。'},
 bk_healer_clean:{name:'安息藥',kind:'gen',tg:'ally',shape:'one',range:[0,3],cd:3,ally:{heal:.18,sol:.1,cleanse:3},icon:'sk_mend',fx:'fx_heal',desc:'3 格內一名隊友（含自己）回復 18% 生命、10% 士兵，解除最多三個壞狀態。'},
 bk_weaver_knot:{name:'鎖名結',kind:'gen',tg:'tile',shape:'area',range:[1,3],cd:4,mult:.25,st:[['seal',1,1],['root',1,1]],icon:'sk_bind',fx:'fx_bind',desc:'3 格內選一格，3×3 內敵人受到 0.25 倍傷害，本輪封印，並束縛 1 次行動階段。'},
 bk_scout_cut:{name:'斷步',kind:'gen',tg:'enemy',shape:'one',range:[1,1],cd:3,mult:1.05,st:[['blind',1,1]],self:{retreat:1},icon:'sk_shadow',fx:'fx_shadow',desc:'相鄰敵人受到 1.05 倍傷害並在本輪致盲；出手後往後退一格，退路被擋則留在原地。'}
};
DATA.skillBooks={P_SHIELD:{skill:'bk_shield_line',name:'《盾列接應》',lore:'南門盾衛留下的接應圖，盾後總畫著一個空位。'},P_SPEAR:{skill:'bk_spear_pin',name:'《釘影槍》',lore:'紙頁畫著霧裡的腳步，槍尖總先落在下一步。'},P_LANTERN:{skill:'bk_lantern_clear',name:'《照路》',lore:'守夜人抄下的燈芯手記，最後一頁留給回程。'},P_ARCHER:{skill:'bk_archer_bind',name:'《縛足箭》',lore:'驛道巡哨用的箭譜，寫的是留人，不是追人。'},P_HEALER:{skill:'bk_healer_clean',name:'《安息藥》',lore:'藥箱夾層的薄冊，先寫活人的姓名，再記藥量。'},P_WEAVER:{skill:'bk_weaver_knot',name:'《鎖名結》',lore:'打結的位置要留一線，不能把回家的路也鎖住。'},P_SCOUT:{skill:'bk_scout_cut',name:'《斷步》',lore:'沒有署名的腳步圖。每張圖都留了退路。'}};
Object.assign(DATA.skills,DATA.bookSkills);
DATA.skills.sweep.desc='自身周圍八格（含斜角）的所有可見敵人受到 0.8 倍傷害，不會被反擊。沒有敵人時不能施放。';
DATA.skills.sweep.fx='fx_pierce';
DATA.genSkills.sn_molt.ally.cleanse=99;
DATA.genSkills.sp_back.self.st=[['evade',2]];
DATA.genSkills.sp_back.desc='1.2 倍傷害並流血 2 回合；刺完後退一格，獲得閃身 2 回合（閃避 +30%）。';
// 公開既有資料內有實際作用、但原描述省略的補兵效果。
DATA.genSkills.hf_bath.desc='2 格內所有隊友回復 20% 生命、10% 士兵，之後再生 3 回合。';
DATA.genSkills.h1_bitter.desc='回復 2 格內一名隊友 25% 生命、15% 士兵；離目標最近且在 3 格內的敵人中毒 3 回合。';
DATA.genSkills.h1_same.desc='2 格內所有隊友回復 10% 生命、10% 士兵；場上每有一個中毒敵人，再多回 6% 生命。';
DATA.mythSkills.wd_echo.desc='回復 2 格內一名隊友 25% 生命、15% 士兵，解除兩個壞狀態；若實際解除燃燒、流血、中毒或延爆詛咒，再給生命 15% 護盾。';

DATA.pixel.spear_blue={src:'inbox/px_spear_blue_20514.png',cols:6,rows:4,down:true,skillRows:['sp_thou']};
DATA.spriteLooks={spear:{spear_blue:'藍皮長槍手'}};

Object.assign(DATA.skillArtP,{
 fy_pact:'inbox/grok_1793973192765.jpg',
 fy_bind:'inbox/grok_1793973195271.jpg',
 fy_judge:'inbox/grok_1793973198302.jpg',
 wd_watch:'inbox/grok_1793973201273.jpg',
 wd_echo:'inbox/grok_1793973203496.jpg',
 wd_gate:'inbox/grok_1793973205813.jpg'
});
Object.assign(DATA.skills,DATA.genSkills,DATA.mythSkills||{});for(const [k,v] of Object.entries(DATA.skillArtP||{}))if(DATA.skills[k])DATA.skills[k].art=v;
// ── 南門商鋪、研習和行旅 ──────────────────────
DATA.maxStar=10;
DATA.highStarStep=.02;
DATA.rankStep=.04;
Object.assign(DATA.eqSlots,{o:'副手',b:'腰帶',s:'印記'});
DATA.statName.heal='治療加成';
DATA.equip.w_kit.st={heal:6,res:2};
DATA.equip.a_heavy.fixed=['eva'];
Object.assign(DATA.equip,{
 o_buckler:{slot:'o',name:'鉚釘護手',icon:'eq_w_shield',units:['P_SHIELD','P_SPEAR','P_SCOUT'],st:{def:2}},
 o_lamp:{slot:'o',name:'備用燈罩',icon:'eq_w_lantern',units:['P_LANTERN','P_HEALER','P_WEAVER','P_ARCHER'],st:{res:2,hit:2}},
 b_kit:{slot:'b',name:'行軍工具帶',icon:'eq_a_light',st:{hp:6,eva:1}},
 b_iron:{slot:'b',name:'鐵扣腰帶',icon:'eq_a_heavy',st:{hp:9,def:1}},
 s_reed:{slot:'s',name:'回程印記',icon:'eq_t_charm',st:{heal:3,res:1}},
 s_ash:{slot:'s',name:'灰羽印記',icon:'eq_t_feather',st:{crit:2,hit:1}}
});
DATA.tradeArt={
 shop:'inbox/grok_1794039500614.jpg',active:'inbox/grok_1794039546817.jpg',
 passive:'inbox/grok_1794039572743.jpg',squad:'inbox/grok_1794039576464.jpg',
 heroRank:'inbox/grok_1794039579845.jpg',squadRank:'inbox/grok_1794039582955.jpg',
 bandage:'inbox/grok_1794039586375.jpg',smoke:'inbox/grok_1794039589448.jpg',
 oil:'inbox/grok_1794039592405.jpg',herb:'inbox/grok_1794039595301.jpg',
 ore:'inbox/grok_1794039598404.jpg',chest:'inbox/grok_1794039600666.jpg'
};
DATA.localBgm={palanquin:'assets/music/bgm/無人迎親・轎中有名.mp3'};
DATA.fieldItems={
 bandage:{name:'急救布包',price:5,desc:'移動後使用。回復本隊 20% 生命及 10% 士兵生命。'},
 smoke:{name:'避箭煙瓶',price:5,desc:'移動後使用。本隊取得 1 回合閃避 +30%。'},
 oil:{name:'淨路燈油',price:6,desc:'移動後使用。淨化腳下污染和預告，解除本隊 1 個負面狀態。'}
};
DATA.packMax=2;
DATA.shopSupply={price:10,amount:35};
DATA.mats.herb={name:'藥草',icon:'it_herb',desc:'在歸途採集，可用來製作急救布包與淨路燈油。'};
DATA.artMap['items/it_herb.webp']=DATA.tradeArt.herb;
DATA.trades={
 herb:{name:'採藥',label:'藥草',recipe:'急救布包',item:'bandage'},
 ore:{name:'採礦',label:'礦脈'},
 craft:{name:'工匠',label:'製作',recipe:'避箭煙瓶',item:'smoke'}
};
const fieldSkills={
 bk_shield_cover:{name:'掩護接手',kind:'gen',tg:'ally',shape:'one',range:[1,2],cd:3,ally:{shield:.2},icon:'sk_guard',fx:'fx_guard',desc:'為 1–2 格內一隊隊友加上生命 20% 的護盾。'},
 bk_spear_break:{name:'破列突槍',kind:'gen',tg:'enemy',shape:'one',range:[1,1],cd:3,mult:1.1,st:[['brk',2,1]],icon:'sk_pierce',fx:'fx_pierce',desc:'鄰格 1.1 倍傷害，破甲 2 回合。'},
 bk_lantern_ember:{name:'引燼',kind:'gen',tg:'enemy',shape:'one',range:[1,3],cd:3,mult:.85,st:[['burn',2,1]],icon:'sk_lamp',fx:'fx_magic',desc:'1–3 格 0.85 倍傷害，燃燒 2 回合。'},
 bk_archer_screen:{name:'遮眼箭',kind:'gen',tg:'enemy',shape:'one',range:[2,4],cd:3,mult:.75,st:[['blind',1,1]],icon:'sk_mark',fx:'fx_arrow',desc:'2–4 格 0.75 倍傷害，致盲 1 回合。'},
 bk_healer_triage:{name:'隨軍急救',kind:'gen',tg:'self',shape:'allyAround',r:1,cd:4,ally:{heal:.13,sol:.08},icon:'sk_mend',fx:'fx_heal',desc:'自身與鄰格隊友回復 13% 生命與 8% 士兵生命。'},
 bk_weaver_ward:{name:'補縫線',kind:'gen',tg:'ally',shape:'one',range:[0,3],cd:3,ally:{shield:.18,st:[['resist',1]]},icon:'sk_bind',fx:'fx_guard',desc:'0–3 格給一隊生命 18% 的護盾與 1 回合抵抗。'},
 bk_scout_spot:{name:'探路飛刃',kind:'gen',tg:'enemy',shape:'one',range:[1,2],cd:3,mult:.8,st:[['mark',2,1]],icon:'sk_shadow',fx:'fx_mark',desc:'1–2 格 0.8 倍傷害，標記 2 回合。'}
};
Object.assign(DATA.skills,fieldSkills);
const fieldUnits=['P_SHIELD','P_SPEAR','P_LANTERN','P_ARCHER','P_HEALER','P_WEAVER','P_SCOUT'];
DATA.bookCatalog=Object.fromEntries(Object.entries(DATA.skillBooks).map(([unit,b])=>[b.skill,{...b,kind:'active',unit}]));
Object.keys(fieldSkills).forEach((skill,i)=>{
 DATA.bookCatalog[skill]={skill,unit:fieldUnits[i],kind:'active',name:'《'+fieldSkills[skill].name+'》',lore:'南門行軍時留下的手抄本。',minLv:5,price:35};
});
Object.assign(DATA.bookCatalog,{
 bp_watch:{name:'《完陣》',kind:'passive',desc:'生命至少八成時，攻擊傷害 +6%。',fx:{healthyAtk:.06},price:25},
 bp_care:{name:'《照護手記》',kind:'passive',desc:'技能治療量 +8%。',fx:{healP:.08},price:25},
 bp_cover:{name:'《避險筆記》',kind:'passive',desc:'受到傷害 −5%。',fx:{dr:.05},price:25},
 bs_wall:{name:'《鐵壁列譜》',kind:'squad',desc:'兵團被動鐵壁：防禦與魔防 +10%。',pas:'wall',price:22},
 bs_hold:{name:'《守路列譜》',kind:'squad',desc:'兵團被動堅守：原地行動後，受到傷害 −10%。',pas:'hold',price:22},
 bs_march:{name:'《急行列譜》',kind:'squad',desc:'兵團被動急行：移動 +1。',pas:'march',price:26},
 br_hero:{name:'《英雄晉升書》',kind:'heroRank',desc:'五星且 Lv10 的英雄可突破。突破後開放第 6–10 星。',price:60},
 br_squad:{name:'《兵團晉升書》',kind:'squadRank',desc:'兵團 Lv5、三階後可晉升：上限 +1、每兵生命 +10%。',price:48}
});
if(typeof module!=='undefined'&&module.exports)module.exports=DATA;else root.TACTICS_DATA=DATA;
})(this);
