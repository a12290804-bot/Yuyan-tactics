// 渡鴉下潛 規則大師交件 v0.2 —— 新增卡牌、敵人、遺物
// 用法：把各區塊的條目合併進 data.js 對應的物件（cards / enemies / relics / layers.fights）。
// 標「★新效果」的地方需要 core.js 加程式，說明在同資料夾的 rules_v0.2_說明.md。
// img 欄位先借用現有圖示，等製圖大師交 card_* / relic_* 再換。
const sk=n=>'../../raven-guild/images/sk_'+n+'.webp';
module.exports={
cards:{
 // ── 語嫣：命線流（把敵人連起來，一個受傷大家分）
 yy_redline:{n:'紅線牽引',c:1,t:'a',r:1,ch:'yy',img:sk('tie'),fx:[['lk'],['d',6]],u:{fx:[['lk'],['d',9]]}},
 yy_tug:{n:'一拽',c:0,t:'a',r:1,ch:'yy',img:sk('garrote'),fx:[['d',3,1,'pact1']],u:{fx:[['d',5,1,'pact1']]}},
 yy_tease:{n:'逗弄',c:1,t:'s',r:1,ch:'yy',img:sk('hex'),fx:[['st','weak',1,'a'],['pa',1,'a']],u:{fx:[['st','weak',2,'a'],['pa',1,'a']]}},
 yy_bow:{n:'打個蝴蝶結',c:1,t:'s',r:1,ch:'yy',img:sk('web'),fx:[['b',6],['lk']],u:{fx:[['b',9],['lk']]}},
 yy_spindle:{n:'紡錘',c:2,t:'a',r:2,ch:'yy',img:sk('snare'),fx:[['lk'],['da',4,1,'pact1']],u:{fx:[['lk'],['da',6,1,'pact1']]}},
 yy_fine:{n:'滯納金',c:1,t:'a',r:2,ch:'yy',img:sk('snap'),fx:[['d',5],['ep',1],['dr',1]],u:{fx:[['d',8],['ep',1],['dr',1]]}},
 yy_collect:{n:'連本帶利',c:2,t:'a',r:2,ch:'yy',img:sk('sunder'),fx:[['jd',3],['pa',3,'t']],u:{fx:[['jd',4],['pa',3,'t']]}},
 yy_dear:{n:'妹妹別怕',c:1,t:'s',r:2,ch:'yy',img:sk('cover'),fx:[['b',8],['dr',1]],u:{fx:[['b',11],['dr',1]]}},
 yy_redfate:{n:'赤繩定命',c:2,t:'p',r:3,ch:'yy',img:sk('chain'),fx:[['pw','linkFull',1]],u:{c:1}}, // ★新效果 linkFull
 // ── 克勞德：保留流（把牌留在手上，慢慢寫）
 cl_bookmark:{n:'書籤',c:0,t:'s',r:1,ch:'cl',img:sk('oath'),keep:1,fx:[['ink',1]],u:{fx:[['ink',2]]}},
 cl_draft:{n:'草稿',c:1,t:'a',r:1,ch:'cl',img:sk('thrust'),keep:1,fx:[['d',7]],u:{fx:[['d',10]]}},
 cl_shelter:{n:'屋簷',c:1,t:'s',r:1,ch:'cl',img:sk('brace'),keep:1,fx:[['b',6]],u:{fx:[['b',9]]}},
 cl_reread:{n:'重讀',c:0,t:'s',r:1,ch:'cl',img:sk('lull'),keep:1,fx:[['dr',1]],u:{fx:[['dr',2]]}},
 cl_hold:{n:'屏息',c:1,t:'s',r:2,ch:'cl',img:sk('stand'),fx:[['b',5],['ka']],u:{fx:[['b',8],['ka']]}}, // ★新效果 ka
 cl_patience:{n:'慢慢寫',c:1,t:'p',r:2,ch:'cl',img:sk('incense'),fx:[['pw','keepInk',1]],u:{c:0}}, // ★新效果 keepInk
 cl_lamplight:{n:'長明燈',c:2,t:'s',r:2,ch:'cl',img:sk('flare'),keep:1,fx:[['b',12],['ink',1]],u:{fx:[['b',16],['ink',1]]}},
 cl_epilogue:{n:'後記',c:2,t:'a',r:2,ch:'cl',img:sk('pierce'),keep:1,fx:[['d',5,1,'ink4']],u:{fx:[['d',5,1,'ink5']]}},
 cl_letter:{n:'寫給爸爸的信',c:1,t:'s',r:3,ch:'cl',img:sk('mend'),ex:1,fx:[['en',2],['ink',2]],u:{c:0}},
 // ── 敵人塞進牌組的雜牌（可以花 1 能量打掉）
 x_tired:{n:'疲勞',c:1,t:'s',r:0,ch:'none',img:sk('wither'),ex:1,fx:[]}
},
enemies:{
 // 第一層・退件局
 envelope:{n:'雙層信封',img:'m_envelope',hp:[16,20],onDeath:['slip','slip'],mv:[{n:'封口',a:6,w:3},{n:'加厚',b:6,w:1}]}, // ★新：死掉時拆出兩張便條
 slip:{n:'便條',img:'m_slip',hp:[5,7],mv:[{n:'戳',a:3,w:3},{n:'飄',b:3,w:1}]},
 postage:{n:'欠資郵差',img:'m_postage',hp:[20,24],mv:[{n:'補郵資',a:5,tax:2,w:2},{n:'催繳',a:9,w:2}]}, // ★新：tax
 // 第二層・紙紮巷
 papercopy:{n:'剪紙替身',img:'m_papercopy',hp:[26,30],split:0.5,mv:[{n:'對摺',a:8,w:3},{n:'描邊',b:7,w:1}]}, // ★新：split
 magpie:{n:'偷燈喜鵲',img:'m_magpie',hp:[18,22],mv:[{n:'叼走',a:4,steal:1,w:2},{n:'啄',a:5,h:2,w:2}]}, // ★新：steal
 matchmaker:{n:'紙媒婆',img:'m_matchmaker',hp:[28,32],mv:[{n:'解約',clr:'pact',w:1},{n:'撮合',a:7,s:['str',1],w:2},{n:'紅包',b:8,w:1}]}, // ★新：clr
 // 第三層・白鐵礦坑
 slagslime:{n:'礦渣團',img:'m_slagslime',hp:[38,42],split:0.5,mv:[{n:'壓',a:12,w:2},{n:'凝固',b:10,w:1}]},
 debtlamp:{n:'欠帳礦燈',img:'m_debtlamp',hp:[30,34],mv:[{n:'吸墨',a:7,drainInk:3,w:2},{n:'記帳',a:4,tax:2,w:1},{n:'閃爍',b:9,w:1}]}, // ★新：drainInk
 foreman:{n:'工頭的哨子',img:'m_foreman',hp:[30,34],mv:[{n:'加班',addCard:['x_tired',2],w:1},{n:'吹哨',a:6,h:2,w:2},{n:'點名',s:['str',2],b:6,w:1}]} // ★新：addCard
},
fights:{ // 加進各層 layers[n].fights
 0:[['envelope'],['postage','lackcrow'],['envelope','stampbug']],
 1:[['papercopy'],['magpie','paperdoll'],['matchmaker','paper']],
 2:[['slagslime'],['debtlamp','rustrat'],['foreman','valvehound']]
},
relics:{
 // 語嫣
 needle:{n:'繡花針',ic:'i_seal',ch:'yy',d:'用命線連住敵人時，每個被連著的敵人獲得 1 層厄契。'},
 knot:{n:'同心結',ic:'i_seal',ch:'yy',d:'裁定用掉厄契之後，目標留下 2 層厄契。'},
 ledger:{n:'舊帳本',ic:'i_coin',ch:'yy',d:'敵人被厄契反噬打倒時，獲得 8 枚渡鴉幣。'},
 silkglove:{n:'絲手套',ic:'i_leaf',ch:'yy',d:'每場戰鬥第一次給予厄契時，多給 2 層。'},
 // 克勞德
 inkstone:{n:'硯台',ic:'i_ingot',ch:'cl',d:'打出一張一次用掉 5 墨以上的牌之後，抽 1 張牌。'},
 redbookmark:{n:'紅繩書籤',ic:'i_seal',ch:'cl',d:'回合結束時，如果手上有被保留的牌，獲得 3 格擋。'},
 paperweight:{n:'紙鎮',ic:'i_wood',ch:'cl',d:'回合開始時，如果有 5 墨以上，多 1 點能量。'},
 blotter:{n:'吸墨紙',ic:'i_oil',ch:'cl',d:'戰鬥勝利時，剩下的墨每 2 點回復 1 生命。'},
 // 兩人共用
 lampshade:{n:'燈罩',ic:'i_torch',d:'每場戰鬥第一次受到攻擊傷害時，傷害減半。'},
 blackfeather:{n:'黑羽書籤',ic:'i_moss',d:'打出能力牌時，獲得 4 格擋。'}
}
};
