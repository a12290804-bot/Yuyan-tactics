// 規則 v0.12：顧沉舟 15 張、首領專屬大招、陣營預設大招。
// 合併：Object.assign(DATA.cards,DATA.guCards); 敵人大招讀 DATA.ultBoss[id] || DATA.ultDef[fac]
const T='TBD';
DATA.guCards={"gu_tear":{"n":"撕兩頁","c":1,"t":"a","r":1,"ch":"gu","img":"../inbox/card_gu_tear.webp","fx":[["burnTop",2],["d",9]],"u":{"fx":[["burnTop",2],["d",13]]}},
"gu_clear":{"n":"清桌","c":0,"t":"s","r":1,"ch":"gu","img":"../inbox/card_gu_clear.webp","fx":[["millTop",3],["dr",2]],"u":{"fx":[["millTop",3],["dr",3]]}},
"gu_swap":{"n":"棄頂換手","c":0,"t":"s","r":1,"ch":"gu","img":"../inbox/card_gu_swap.webp","fx":[["rc"],["millTop",1]],"u":{"fx":[["rc"],["millTop",1],["dr",1]]}},
"gu_last3":{"n":"最後三頁","c":1,"t":"a","r":2,"ch":"gu","img":"../inbox/card_gu_last3.webp","fx":[["thinD",3,18,6,2]],"u":{"fx":[["thinD",3,24,8,2]]}},
"gu_thin":{"n":"薄冊加力","c":1,"t":"p","r":2,"ch":"gu","img":"../inbox/card_gu_thin.webp","fx":[["pw","thin",1]],"u":{"c":0}},
"gu_addpage":{"n":"補一頁","c":1,"t":"s","r":1,"ch":"gu","img":"../inbox/card_gu_addpage.webp","fx":[["dos",2],["b",5]],"u":{"fx":[["dos",2],["b",8]]}},
"gu_samesys":{"n":"同系加筆","c":0,"t":"s","r":1,"ch":"gu","img":"../inbox/card_gu_samesys.webp","fx":[["dosTurn",3]],"u":{"fx":[["dosTurn",5]]}},
"gu_cross":{"n":"對照口供","c":1,"t":"a","r":1,"ch":"gu","img":"../inbox/card_gu_cross.webp","fx":[["crossDos",5,6]],"u":{"fx":[["crossDos",7,8]]}},
"gu_bypage":{"n":"依頁開槍","c":1,"t":"a","r":2,"ch":"gu","img":"../inbox/card_gu_bypage.webp","fx":[["dPage",5,1]],"u":{"fx":[["dPage",8,1]]}},
"gu_archive":{"n":"常備卷宗","c":1,"t":"p","r":2,"ch":"gu","img":"../inbox/card_gu_archive.webp","fx":[["pw","archive",1]],"u":{"c":0}},
"gu_calib":{"n":"義眼校準","c":0,"t":"s","r":1,"ch":"gu","img":"../inbox/card_gu_calib.webp","fx":[["revealT"],["markD",3]],"u":{"fx":[["revealT"],["markD",5]]}},
"gu_predict":{"n":"預判一槍","c":1,"t":"a","r":1,"ch":"gu","img":"../inbox/card_gu_predict.webp","fx":[["predict",14,5]],"u":{"fx":[["predict",19,7]]}},
"gu_eyeagain":{"n":"義眼再開","c":0,"t":"s","r":2,"ch":"gu","ex":1,"img":"../inbox/card_gu_eyeagain.webp","fx":[["eyeReset"]],"u":{"fx":[["eyeReset"],["dr",1]]}},
"gu_interrupt":{"n":"打斷蓄力","c":2,"t":"a","r":2,"ch":"gu","img":"../inbox/card_gu_interrupt.webp","fx":[["d",10],["breakUlt"]],"u":{"fx":[["d",14],["breakUlt"]]}},
"gu_seen":{"n":"看過的人","c":1,"t":"p","r":2,"ch":"gu","img":"../inbox/card_gu_seen.webp","fx":[["pw","seen",2]],"u":{"c":0}}};
// 一般敵人：第 3 回合起每 3 回合
DATA.ultDef={
xian:{every:3,start:3,aMul:2.5,fx:'curse1',sfx:'sfx_ult_xian'},
eldritch:{every:3,start:3,aMul:1.5,fx:'drawLess2',sfx:'sfx_ult_eldritch'},
flesh:{every:3,start:3,aMul:0,fx:'heal20_blockA2_next150',sfx:'sfx_ult_flesh'}
};
// 首領：第 2 回合起每 3 回合；該招從平常輪替中移除，只當大招用
DATA.ultBoss={
wusign:{n:'蓋退件章',from:'蓋退件章',a:20,fx:'curse1',every:3,start:2},
qianhao:{n:'粉碎',from:'粉碎',a:24,fx:'drawLess2',every:3,start:2},
deepdrill:{n:'深挖',from:'深挖',a:32,fx:'pierceHalf',every:3,start:2},
namegate:{n:'千口齊聲',from:'千口齊聲',a:5,hits:4,fx:'curse1',every:3,start:2},
lastpost:{n:'寄不出去',from:'寄不出去',a:24,fx:'burnHand1',every:3,start:2},
stationmaster:{n:'末班車',from:'末班車',a:40,fx:'none',every:3,start:2},
nh_fox:{n:'妳回去了',from:'妳回去了',a:22,fx:'drawLess2',every:3,start:2},
nh_sea:{n:'漲潮',from:'漲潮',a:26,fx:'weak2',every:3,start:2},
nh_her:{n:'醒',from:'醒',a:32,fx:'healPct10',every:3,start:2}
};
DATA.powers=Object.assign(DATA.powers||{},{thin:"抽牌堆每比 5 張少 1 張，攻擊牌傷害 +{n}。",archive:"本局每打完一場，卷宗多記 {n} 頁。",seen:"被看穿過意圖的敵人，受到的傷害 +{n}。"});
