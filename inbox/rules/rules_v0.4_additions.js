// 渡鴉下潛 規則 v0.4 資料：局外強化、血脈、牌邊顏色。說明見 rules_v0.4_局外與血脈.md
const sk=n=>'../../raven-guild/images/sk_'+n+'.webp';
module.exports={
echo:{fromMemory:1,quitRate:0.5}, // ★新：殘響 = 這局回憶 ×1，放棄只拿一半
keeper:[ // ★新：守燈處永久強化
 {id:'m_hp1',n:'多一口氣',cost:30,fx:{maxHp:5}},
 {id:'m_hp2',n:'再多一口氣',cost:90,need:'m_hp1',fx:{maxHp:5}},
 {id:'m_gold',n:'口袋裡的零錢',cost:40,fx:{gold:40}},
 {id:'m_relic',n:'舊行李',cost:120,fx:{relicPick:3}},
 {id:'m_remove',n:'剪掉的線頭',cost:80,fx:{startRemove:1}},
 {id:'m_rest',n:'溫著的茶',cost:60,fx:{restBonus:5}},
 {id:'m_purge',n:'淨火',cost:70,fx:{restPurge:1}},
 {id:'m_skip',n:'第二張地圖',cost:100,fx:{mapReroll:1}}
],
origins:{ // ★新：本源型態，開局選擇；swap 換掉起始牌組裡 2 張打擊類牌。第一批 7 套，其餘 18 套在 v0.5
 yy_B01:{n:'九尾妖狐',ch:'yy',unlock:0,skin:'y_base',passive:'firstAtkPact1',swap:null},
 yy_M01:{n:'毒蛇',ch:'yy',unlock:60,skin:'y_skin_M01',passive:'pactGrow1',swap:['b_coil',2]},
 yy_M03:{n:'蜘蛛',ch:'yy',unlock:100,skin:'y_skin_M03',passive:'linkPlus1',swap:['b_web',2]},
 yy_M02:{n:'蠍子',ch:'yy',unlock:140,skin:'y_skin_M02',passive:'judgeKillHeal3',swap:['b_sting',2]},
 cl_lamp:{n:'燈',ch:'cl',unlock:0,skin:'cl_base',passive:null,swap:null},
 cl_paper:{n:'紙',ch:'cl',unlock:60,skin:'cl_skin_paper',passive:'keepBlock2',swap:['b_carve',2]},
 cl_ink:{n:'墨',ch:'cl',unlock:120,skin:'cl_skin_ink',passive:'ink6Double',swap:['b_dot',2]}
},
cards:{ // 血脈起始牌（r:0 起始，bl 決定緋紅牌邊）
 b_coil:{n:'纏頸',c:1,t:'s',r:0,ch:'yy',bl:'M01',img:sk('tie'),fx:[['pa',3,'t'],['b',4]],u:{fx:[['pa',4,'t'],['b',6]]}},
 b_web:{n:'張網',c:1,t:'s',r:0,ch:'yy',bl:'M03',img:sk('web'),fx:[['lk'],['b',3]],u:{fx:[['lk'],['b',6]]}},
 b_sting:{n:'尾針',c:1,t:'a',r:0,ch:'yy',bl:'M02',img:sk('pierce'),fx:[['d',4,1,'pact1']],u:{fx:[['d',6,1,'pact1']]}},
 b_carve:{n:'刻字',c:1,t:'s',r:0,ch:'cl',bl:'paper',img:sk('brace'),keep:1,fx:[['b',7]],u:{fx:[['b',10]]}},
 b_dot:{n:'點硃',c:1,t:'a',r:0,ch:'cl',bl:'ink',img:sk('thrust'),fx:[['d',5],['ink',2]],u:{fx:[['d',7],['ink',2]]}}
},
rarity:{ // 牌面不寫「普通／稀有」，只寫位階名
 0:{n:'起始',color:'#5A5A5E'},1:{n:'紙',color:'#A8ADB4'},2:{n:'墨',color:'#2E5E63'},3:{n:'緋',color:'#B08A3E'},
 origin:{n:'契',color:'#8E1B24'},x:{n:'詛咒',color:'#2E1A33'}
}
};
