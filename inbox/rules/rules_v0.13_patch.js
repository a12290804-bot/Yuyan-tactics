// 規則 v0.13：污染化。合併：Object.assign(DATA.cards,DATA.taintCards); Object.assign(DATA.powers,DATA.taintPowers);
DATA.taint={
 max:3,                 // 污染層數 0..3，記在牌的實例上 card.tn
 mul:[1,1.3,1.6,2.0],   // 主要數值倍率（d/da/b/heal/hardB）
 hpCost:[0,1,2,3],      // 打出時失去生命
 alien:[0,1,2,4],       // 打出時異化值增加
 chainAt:3,             // 3 層起「停不下來」
 chainHp:2,             // 連鎖每多打一張失去的生命
 withdrawal:1,          // 戒斷：這回合沒打污染牌，回合結束失去「饜 ×1」生命
 fullToAlien:1,         // 滿血時的治療改成等量異化值
 mergeTaint:2,          // 每次異化值到 100（合相）隨機 2 張牌污染 +1
 restPurify:1,          // 休息點新選項「斷」：放棄回血，選 1 張牌污染歸 0
 img:'card_<id>_x'      // 有這張圖就用，沒有就疊 fx_taint 遮罩
};
DATA.taintCards={
yy_t_feed:{n:'餵我',c:0,t:'s',r:1,ch:'yy',img:'TBD',fx:[["taint",1],["heal",3]],u:{fx:[["taint",1],["heal",5]]}},
yy_t_more:{n:'還要',c:1,t:'a',r:1,ch:'yy',img:'TBD',fx:[["d",6],["moreIfTaint"]],u:{fx:[["d",8],["moreIfTaint"]]}},
yy_t_devour:{n:'自噬',c:0,t:'s',r:1,ch:'yy',img:'TBD',fx:[["hurt",4],["en",2],["al",5]],u:{fx:[["hurt",3],["en",2],["al",5]]}},
yy_t_empty:{n:'越吃越空',c:1,t:'a',r:2,ch:'yy',img:'TBD',fx:[["dTaint",3,4]],u:{fx:[["dTaint",5,5]]}},
yy_t_crave:{n:'渴',c:1,t:'p',r:2,ch:'yy',img:'TBD',fx:[["pw","crave",1]],u:{c:0}},
yy_t_hoard:{n:'都是我的',c:1,t:'s',r:2,ch:'yy',img:'TBD',fx:[["hoardTaint",1]],u:{fx:[["hoardTaint",1],["b",5]]}},
yy_t_binge:{n:'停不下來',c:2,t:'a',r:2,ch:'yy',img:'TBD',fx:[["d",7],["binge",2]],u:{fx:[["d",10],["binge",2]]}},
yy_t_hollow:{n:'空心',c:1,t:'s',r:1,ch:'yy',img:'TBD',fx:[["hollowB",3]],u:{fx:[["hollowB",4]]}}
};
DATA.taintPowers={crave:'每回合開始，手上隨機 {n} 張牌污染 +1（只到這場戰鬥結束）。'};
DATA.opTextX=Object.assign(DATA.opTextX||{},{
taint:f=>`選手上 ${f[1]} 張牌，污染 +1。`,
moreIfTaint:f=>`這回合打過污染牌時，這張回到手上，費用 +1。`,
dTaint:f=>`造成 ${f[1]} 傷害，這場戰鬥每打過 1 張污染牌再 +${f[2]}。`,
hoardTaint:f=>`把棄牌堆所有污染牌拿回手上，每張失去 ${f[1]} 生命。`,
binge:f=>`接著自動打出抽牌堆頂的攻擊牌，直到翻到不是攻擊的牌為止，每多打一張失去 ${f[1]} 生命。`,
hollowB:f=>`獲得「饜 ×${f[1]}」格擋，然後饜歸 0。`
});
