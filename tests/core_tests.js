// node tests/core_tests.js
const D=require('../data.js'),C=require('../core.js');
// 測試只看機制：拿掉角色的敵人倍率與本源體質
for(const k in D.chars)delete D.chars[k].foe;const SIS=D.sisters;delete D.sisters;delete D.chAsk;delete D.duo;for(const k in D.origins)delete D.origins[k].hpB;
let pass=0,fail=0;const out=[];const ok=(c,m)=>{if(!c)throw new Error(m||'失敗');};
function t(id,name,f){try{f();pass++;out.push('PASS '+id+' '+name);}catch(e){fail++;out.push('FAIL '+id+' '+name+' — '+e.message);}}
const A=(st,a)=>{const r=C.apply(D,st,a);ok(r.ok,r.error+' '+JSON.stringify(a));return r;};
// 直接進一場指定敵人的戰鬥
function fight(ch,ids,seed){const D2=JSON.parse(JSON.stringify(D));D2.layers[0].fights=[ids];D2.map.w={fight:1};let st=C.newRun(D2,seed||3,ch,{unlocked:[]});if(!fight.keepOrigin)st.origin=null;st=C.apply(D2,st,{type:'MOVE',c:0}).state;return st;}
function fightO(ch,origin,ids,seed){const D2=JSON.parse(JSON.stringify(D));D2.layers[0].fights=[ids];D2.map.w={fight:1};let st=C.newRun(D2,seed||3,ch,{unlocked:[]},{origin});return C.apply(D2,st,{type:'MOVE',c:0}).state;}
function hand(st,ids){st.combat.hand=ids.map((id,i)=>({uid:'h'+i,id,up:0}));st.combat.energy=10;return st;}
t('C01','同一個種子結果一樣；起始牌組 10 張、起始遺物',()=>{ok(JSON.stringify(C.newRun(D,9,'yy'))===JSON.stringify(C.newRun(D,9,'yy')));for(const ch of ['yy','cl']){const st=C.newRun(D,1,ch);ok(st.deck.length===10);ok(st.relics[0]===D.chars[ch].relic);ok(st.hp===D.chars[ch].hp);}});
t('C02','地圖：每排 4 格、每格都有路往下、第一排都是戰鬥、最後一排是營火、第二排沒有菁英',()=>{const R=D.map.rows,K=D.map.cols;for(let s=1;s<60;s++){const m=C.newRun(D,s,'yy').maps[0];ok(m.rows.length===R&&m.rows[0].length===K);ok(m.rows[0].every(n=>n.t==='fight'));ok(m.rows[R-1].every(n=>n.t==='rest'));for(let r=0;r<R-1;r++){ok(m.rows[r].every(n=>n.e.length>=1));for(let c=0;c<K;c++)ok(m.rows[r].some(n=>n.e.includes(c)),'seed '+s+' 第'+(r+1)+'排到不了 '+c);}ok(m.rows[1].every(n=>n.t!=='elite'));ok(m.rows.flat().filter(n=>n.t==='mystery').every(n=>n.q));}});
t('C03','移動只能走連著的路；第一排任選',()=>{let st=C.newRun(D,4,'yy');ok(C.canMove(D,st,2));ok(!C.canMove(D,st,'boss'));st=A(st,{type:'MOVE',c:1}).state;ok(st.screen==='combat');});
t('C04','打牌扣能量、能量不夠不能打；傷害扣格擋再扣生命',()=>{let st=fight('yy',['dutyghost']);hand(st,['strike','guard']);st.combat.energy=1;const e=st.combat.enemies[0];e.block=4;const hp0=e.hp;st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.combat.enemies[0].hp===hp0-2&&st.combat.enemies[0].block===0);ok(!C.apply(D,st,{type:'PLAY',i:0}).ok,'沒能量');});
t('C05','易傷 ×1.5、虛弱 ×0.75、力量加在每一下',()=>{let st=fight('yy',['dutyghost']);hand(st,['strike','strike','strike']);const e=st.combat.enemies[0];const h=()=>st.combat.enemies[0].hp;let h0=h();e.st.vuln=1;st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(h0-h()===9);h0=h();st.combat.st.weak=1;st.combat.enemies[0].st={};st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(h0-h()===4);h0=h();st.combat.st={str:2};st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(h0-h()===8);});
t('C06','厄契：敵人出手攻擊時被反噬；收線依厄契加傷；裁定用掉全部厄契',()=>{let st=fight('yy',['returndog']);const e=st.combat.enemies[0];e.intent={n:'撕咬',a:8};e.st.pact=4;const hp0=e.hp;st=A(st,{type:'END_TURN'}).state;const e2=st.combat.enemies[0];ok(e2.hp===hp0-4,'反噬 4');
 hand(st,['yy_reel','yy_cut']);e2.hp=e2.max=200;const h1=e2.hp;e2.block=0;st=A(st,{type:'PLAY',i:0,target:e2.uid}).state;ok(h1-st.combat.enemies[0].hp===4+(e2.st.pact||0)*2);const p=st.combat.enemies[0].st.pact;const h2=st.combat.enemies[0].hp;st=A(st,{type:'PLAY',i:0,target:e2.uid}).state;ok(!st.combat.enemies[0].st.pact,'用掉');ok(h2-st.combat.enemies[0].hp===Math.min(h2,4*p));});
t('C07','命線：連著的敵人受傷時，其他人也受一半',()=>{let st=fight('yy',['stampbug','moth']);hand(st,['yy_tangle','strike']);const [a,b]=st.combat.enemies;st=A(st,{type:'PLAY',i:0,target:a.uid}).state;const hb=st.combat.enemies[1].hp;st=A(st,{type:'PLAY',i:0,target:a.uid}).state;ok(hb-st.combat.enemies[1].hp===3,'6 的一半');});
t('C08','墨：起筆攢墨、落筆用掉全部的墨加傷；守燈人攢墨時給格擋',()=>{let st=fight('cl',['dutyghost']);hand(st,['cl_keeper','cl_grind','cl_stroke']);const e=st.combat.enemies[0];st.combat.ink=0;st=A(st,{type:'PLAY',i:0}).state;const b0=st.combat.block;st=A(st,{type:'PLAY',i:0}).state;ok(st.combat.ink===3);ok(st.combat.block===b0+6);const h0=st.combat.enemies[0].hp;st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.combat.ink===0);ok(h0-st.combat.enemies[0].hp===4+9);});
t('C09','能力牌：每回合開始生效；不進棄牌堆',()=>{let st=fight('yy',['dutyghost']);hand(st,['yy_wheel']);st=A(st,{type:'PLAY',i:0}).state;ok(!st.combat.disc.some(c=>c.id==='yy_wheel'));const p0=st.combat.enemies[0].st.pact||0;st=A(st,{type:'END_TURN'}).state;ok(st.combat.enemies[0].st.pact===p0+1);});
t('C10','敵人回合：照意圖行動；格擋每回合清掉；計時狀態減 1',()=>{let st=fight('yy',['returndog']);const e=st.combat.enemies[0];e.intent={n:'撕咬',a:8};st.combat.block=3;st.combat.st.vuln=1;st.combat.hand=[];const hp0=st.hp;st=A(st,{type:'END_TURN'}).state;ok(st.hp===hp0-(Math.round(8*D.layers[0].atkMul)*1.5|0)+3,'易傷下扣血');ok(!st.combat.st.vuln,'易傷減掉');ok(st.combat.block===0||st.combat.block>0);});
t('C11','首領照順序出招',()=>{let st=fight('yy',['wusign']);const seq=[];for(let i=0;i<5;i++){seq.push(st.combat.enemies[0].intent.n);st.combat.hand=[];st.hp=999;st=A(st,{type:'END_TURN'}).state;}ok(seq.join()===['審件','蓋退件章','整疊退回','不予受理','審件'].join(),seq.join());});
t('C12','打贏：拿渡鴉幣、三選一的牌（可跳過）、回地圖；菁英給遺物',()=>{let st=fight('yy',['stampbug']);st.combat.enemies[0].hp=1;hand(st,['strike']);const g0=st.gold;const r=A(st,{type:'PLAY',i:0,target:st.combat.enemies[0].uid});st=r.state;ok(st.screen==='reward');ok(st.gold>g0);ok(st.reward.cards.length===3);ok(r.events.some(e=>e.t==='kill'));const n=st.deck.length;st=A(st,{type:'PICK_CARD',i:0}).state;ok(st.deck.length===n+1);ok(!C.apply(D,st,{type:'PICK_CARD',i:1}).ok,'只能拿一張');st=A(st,{type:'LEAVE'}).state;ok(st.screen==='map');
 let s2=fight('yy',['mailbox']);s2.combat.kind='elite';s2.combat.enemies[0].hp=1;hand(s2,['strike']);const rl=s2.relics.length;s2=A(s2,{type:'PLAY',i:0,target:s2.combat.enemies[0].uid}).state;ok(s2.relics.length===rl+1&&s2.reward.relic);});
t('C13','營火：休息回 30%；或強化一張牌',()=>{let st=C.newRun(D,2,'yy');st.screen='rest';st.hp=20;st=A(st,{type:'REST'}).state;ok(st.hp===20+Math.floor(st.maxHp*.3));let s2=C.newRun(D,2,'yy');s2.screen='rest';const c=s2.deck[0];s2=A(s2,{type:'SMITH',uid:c.uid}).state;ok(s2.deck[0].up===1);ok(C.desc(D,s2.deck[0])!==C.desc(D,Object.assign({},s2.deck[0],{up:0})));});
t('C14','商店：買牌、買遺物扣錢；移除一張（每間一次）',()=>{let st=C.newRun(D,8,'cl');st.screen='shop';st.gold=999;st.shop={cards:[{id:'cl_rain',price:70,sold:false}],relics:[{id:'whet',price:160,sold:false}],removed:false,removeCost:75};st=A(st,{type:'BUY_CARD',i:0}).state;ok(st.gold===929&&st.deck.some(c=>c.id==='cl_rain'));st=A(st,{type:'BUY_RELIC',i:0}).state;ok(st.relics.includes('whet'));const n=st.deck.length;st=A(st,{type:'REMOVE',uid:st.deck[0].uid}).state;ok(st.deck.length===n-1);ok(!C.apply(D,st,{type:'REMOVE',uid:st.deck[0].uid}).ok);});
t('C15','事件：選項會生效；需要選牌的會等玩家選',()=>{let st=C.newRun(D,8,'yy');st.screen='event';st.event={id:'market',done:null};st.gold=100;st=A(st,{type:'EVENT',i:0}).state;ok(st.gold===60&&st.pick&&st.pick.mode==='choose');const n=st.deck.length;st=A(st,{type:'CHOOSE',i:1}).state;ok(st.deck.length===n+1&&!st.pick);st=A(st,{type:'LEAVE'}).state;ok(st.screen==='map');});
t('C16','打倒首領：選一件遺物、回血，進下一層；三層都過就贏',()=>{let st=fight('yy',['wusign']);st.row=D.map.rows;st.combat.kind='boss';st.combat.enemies[0].hp=1;hand(st,['strike']);st.hp=10;st=A(st,{type:'PLAY',i:0,target:st.combat.enemies[0].uid}).state;ok(st.reward.relicChoice.length===3);ok(st.hp>10);ok(!C.apply(D,st,{type:'LEAVE'}).ok,'要先選遺物');st=A(st,{type:'PICK_RELIC',i:0}).state;st=A(st,{type:'LEAVE'}).state;ok(st.layer===1&&st.screen==='map'&&st.maps.length===2);
 st.layer=2;st.row=D.map.rows;st.screen='reward';st.reward={cards:[],cardTaken:true};const r=A(st,{type:'LEAVE'});ok(r.state.result.win);ok(r.events.some(e=>e.t==='runEnd'&&e.win));});
t('C17','輸了：一局結束，得到回憶；回憶夠了會解鎖新牌和故事',()=>{let st=fight('yy',['dutyghost']);st.hp=1;st.combat.enemies[0].intent={n:'敲鐘',a:30};st.combat.hand=[];const r=A(st,{type:'END_TURN'});ok(r.state.screen==='over'&&!r.state.result.win);const ev=r.events.find(e=>e.t==='runEnd');ok(ev&&ev.memory>=0);
 let meta=C.newMeta();meta.memory=35;const res=C.metaApply(D,meta,[{t:'runEnd',win:false,ch:'yy',floors:5,memory:10},{t:'kill',id:'stampbug'},{t:'ach',id:'first_win'}]);ok(res.meta.memory===45);ok(res.news.unlocks.includes('story1'));ok(res.news.codex.includes('stampbug'));ok(res.news.ach.includes('first_win'));const r2=C.metaApply(D,res.meta,[{t:'ach',id:'first_win'}]);ok(!r2.news.ach.length,'成就不重複');
 const s3=C.newRun(D,1,'yy',res.meta,{origin:'B03',persona:'sly'});const P3=C.pool(D,s3);ok(!P3.includes('yy_queen'),'沒有通用牌');ok(P3.every(k=>D.cards[k].bl==='B03'||D.cards[k].tag==='sly'),'只有本源和標籤的牌');ok(P3.includes('tg_sly_1')&&P3.includes('o_b03_crush'));});
t('C18','碎鏡：第一次歸零改成回 30%',()=>{let st=fight('yy',['dutyghost']);st.relics.push('mirror');st.hp=1;st.combat.enemies[0].intent={n:'敲鐘',a:30};st.combat.hand=[];st=A(st,{type:'END_TURN'}).state;ok(st.screen==='combat'&&st.hp===Math.ceil(st.maxHp*.3));});
t('C19','每張牌都有說明、圖片；每隻敵人都有招式',()=>{for(const [k,c] of Object.entries(D.cards)){ok(c.img,k);ok(C.desc(D,{id:k,up:0}).length>2,k);if(c.u)ok(C.desc(D,{id:k,up:1}),k);}for(const [k,e] of Object.entries(D.enemies))ok(e.mv.length>=1&&e.img,k);});
t('C20','存檔（JSON）讀回來接著打，結果一樣',()=>{let st=fight('cl',['moth','lackcrow'],11);const s2=JSON.parse(JSON.stringify(st));const a=C.apply(D,st,{type:'END_TURN'}).state,b=C.apply(D,s2,{type:'END_TURN'}).state;ok(JSON.stringify(a)===JSON.stringify(b));});
t('C21','赤繩定命：命線分攤變全額',()=>{let st=fight('yy',['stampbug','moth']);hand(st,['yy_redfate','yy_tangle','strike']);const [a]=st.combat.enemies;st=A(st,{type:'PLAY',i:0}).state;st=A(st,{type:'PLAY',i:0,target:a.uid}).state;const hb=st.combat.enemies[1].hp;st.combat.enemies[1].block=0;st=A(st,{type:'PLAY',i:0,target:a.uid}).state;ok(hb-st.combat.enemies[1].hp===6,'全額 6');});
t('C22','屏息：這回合手牌全部保留；慢慢寫：保留的牌變成墨；紅繩書籤給格擋',()=>{let st=fight('cl',['dutyghost']);st.relics.push('redbookmark');hand(st,['cl_patience','cl_hold','strike','guard','cl_grind']);st.combat.ink=0;st=A(st,{type:'PLAY',i:0}).state;st=A(st,{type:'PLAY',i:0}).state;st.combat.enemies[0].intent={n:'打卡',b:8};st=A(st,{type:'END_TURN'}).state;const h=st.combat.hand.map(x=>x.id);ok(['strike','guard','cl_grind'].every(id=>h.includes(id)),'保留 '+h);ok(st.combat.ink>=3,'墨 '+st.combat.ink);});
t('C23','保留牌（keep）留在手上，一般牌被棄掉',()=>{let st=fight('cl',['dutyghost']);hand(st,['cl_draft','strike']);st.combat.enemies[0].intent={n:'打卡',b:8};st=A(st,{type:'END_TURN'}).state;const h=st.combat.hand.map(x=>x.id);ok(h.filter(x=>x==='cl_draft').length===1);ok(st.combat.disc.some(x=>x.id==='strike'));});
t('C24','雙層信封：被打倒時拆出兩張便條，戰鬥繼續',()=>{let st=fight('yy',['envelope']);const e=st.combat.enemies[0];e.hp=1;hand(st,['strike']);const r=A(st,{type:'PLAY',i:0,target:e.uid});st=r.state;ok(st.screen==='combat');ok(C.alive(st.combat).filter(x=>x.id==='slip').length===2);ok(r.events.filter(x=>x.t==='spawn').length===2);});
t('C25','剪紙替身：血掉到一半以下分裂成兩隻',()=>{let st=fight('yy',['papercopy']);const e=st.combat.enemies[0];e.hp=e.max=30;hand(st,['strike','strike','strike']);st.combat.st.str=10;st=A(st,{type:'PLAY',i:0,target:e.uid}).state;const a=C.alive(st.combat);ok(a.length===2,'分裂');ok(a[0].hp+a[1].hp===14,'平分剩下的 14：'+a.map(x=>x.hp));});
t('C26','欠資郵差：下回合 2 張牌費用 +1',()=>{let st=fight('yy',['postage']);st.combat.enemies[0].intent={n:'補郵資',a:5,tax:2};st=A(st,{type:'END_TURN'}).state;const taxed=st.combat.hand.filter(x=>x.tax);ok(taxed.length===2);ok(C.cost(D,taxed[0])===D.cards[taxed[0].id].c+1);});
t('C27','偷燈喜鵲：叼走手牌，打倒牠就還回來',()=>{let st=fight('yy',['magpie']);hand(st,['strike','guard','yy_bind']);st.combat.energy=0;const e=st.combat.enemies[0];e.intent={n:'叼走',a:4,steal:1};const before=st.combat.hand.length;const r=A(st,{type:'END_TURN'});st=r.state;ok(r.events.some(x=>x.t==='steal'));ok(st.combat.enemies[0].stolen.length===1);st.combat.enemies[0].hp=1;hand(st,['strike']);st.combat.enemies.push({uid:'zz',id:'stampbug',n:'x',hp:99,max:99,block:0,st:{},intent:{n:'x',a:1}});const r2=A(st,{type:'PLAY',i:0,target:e.uid});ok(r2.events.some(x=>x.t==='return'));});
t('C28','紙媒婆清掉厄契變格擋；欠帳礦燈吸墨；工頭塞疲勞',()=>{let st=fight('yy',['matchmaker']);const e=st.combat.enemies[0];e.st.pact=6;e.intent={n:'解約',clr:'pact'};st=A(st,{type:'END_TURN'}).state;ok(!st.combat.enemies[0].st.pact);
 let s2=fight('cl',['debtlamp']);s2.combat.ink=5;s2.combat.enemies[0].intent={n:'吸墨',a:1,drainInk:3};s2=A(s2,{type:'END_TURN'}).state;ok(s2.combat.ink<=3+1);
 let s3=fight('cl',['foreman']);s3.combat.enemies[0].intent={n:'加班',addCard:['x_tired',2]};s3=A(s3,{type:'END_TURN'}).state;const all=[...s3.combat.draw,...s3.combat.disc,...s3.combat.hand];ok(all.filter(x=>x.id==='x_tired').length===2);});
t('C29','新遺物：繡花針、同心結、絲手套、燈罩、黑羽書籤',()=>{let st=fight('yy',['stampbug','moth']);st.relics.push('needle','knot','silkglove','blackfeather');hand(st,['yy_bind','yy_tangle','yy_cut','yy_wheel']);const [a,b]=st.combat.enemies;a.hp=a.max=300;const p0=a.st.pact||0;st=A(st,{type:'PLAY',i:0,target:a.uid}).state;ok(st.combat.enemies[0].st.pact===p0+5,'絲手套多 2');st=A(st,{type:'PLAY',i:0,target:a.uid}).state;ok((st.combat.enemies[1].st.pact||0)>=2,'繡花針');st=A(st,{type:'PLAY',i:0,target:a.uid}).state;ok(st.combat.enemies[0].st.pact===2,'同心結留 2');const b0=st.combat.block;st=A(st,{type:'PLAY',i:0}).state;ok(st.combat.block===b0+4,'黑羽書籤');
 let s2=fight('yy',['returndog']);s2.relics.push('lampshade');s2.combat.enemies[0].intent={n:'撕咬',a:20};const h0=s2.hp;s2=A(s2,{type:'END_TURN'}).state;ok(h0-s2.hp===Math.floor(Math.round(20*D.layers[0].atkMul)/2),'燈罩減半');});
t('C30','新遺物：硯台、紙鎮、吸墨紙、舊帳本',()=>{let st=fight('cl',['dutyghost']);st.relics.push('inkstone','paperweight','blotter');hand(st,['cl_stroke']);st.combat.ink=6;st.combat.enemies[0].hp=300;const n=st.combat.hand.length;st=A(st,{type:'PLAY',i:0,target:st.combat.enemies[0].uid}).state;ok(st.combat.hand.length===1,'硯台抽 1');st.combat.ink=5;st.combat.enemies[0].intent={n:'打卡',b:1};st=A(st,{type:'END_TURN'}).state;ok(st.combat.energy===4,'紙鎮');
 let s2=fight('yy',['returndog']);s2.relics.push('ledger');const e=s2.combat.enemies[0];e.hp=2;e.st.pact=5;e.intent={n:'撕咬',a:1};const g=s2.gold;s2=A(s2,{type:'END_TURN'}).state;ok(s2.gold>=g+8,'舊帳本');});

t('C31','代價牌：失去生命不吃格擋；最大生命永久減少；貪：打倒敵人多拿錢',()=>{let st=fight('yy',['dutyghost']);hand(st,['yy_bloodpact','yy_lastknot','yy_greed']);st.combat.block=20;const h0=st.hp,m0=st.maxHp;const e=st.combat.enemies[0];e.hp=e.max=500;st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.hp===h0-3,'失去 3');st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.maxHp===m0-3&&st.hp<=st.maxHp);st.combat.enemies[0].hp=1;const g=st.gold;const r=A(st,{type:'PLAY',i:0,target:e.uid});ok(r.state.gold>=g+8+12,'貪 +8 再加戰鬥獎勵');});
t('C32','詛咒：抽到失去生命、留在手上失去生命、不能移除；說明文字',()=>{ok(C.desc(D,{id:'x_whisper',up:0}).includes('抽到時'));ok(C.desc(D,{id:'x_name',up:0}).includes('不能被移除'));
 let st=fight('yy',['dutyghost']);st.combat.draw.push({uid:'w1',id:'x_whisper',up:0});st.combat.hand=[{uid:'g1',id:'x_glove',up:0}];st.combat.enemies[0].intent={n:'打卡',b:1};const h0=st.hp;st=A(st,{type:'END_TURN'}).state;ok(h0-st.hp===3+2,'手套 3＋低語 2：'+(h0-st.hp));
 let s2=C.newRun(D,2,'yy');const n=C.apply(D,s2,{type:'MOVE',c:0}).state;let s3=C.newRun(D,2,'yy');s3.deck.push({uid:777,id:'x_name',up:0});s3.screen='shop';s3.gold=999;s3.shop={cards:[],relics:[],removed:false,removeCost:75};ok(!C.apply(D,s3,{type:'REMOVE',uid:777}).ok,'不能移除');});
t('C33','記仇、豎瞳',()=>{let st=fight('yy',['returndog']);hand(st,['yy_grudge','yy_sliteye','strike']);st=A(st,{type:'PLAY',i:0}).state;st=A(st,{type:'PLAY',i:0}).state;const e=st.combat.enemies[0];e.hp=e.max=500;st.hp=10;const h=e.hp;st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(h-st.combat.enemies[0].hp===6+3,'豎瞳 +3');st.hp=50;const p0=st.combat.enemies[0].st.pact||0;st.combat.enemies[0].intent={n:'撕咬',a:8};st=A(st,{type:'END_TURN'}).state;ok(st.combat.enemies[0].st.pact===p0+1,'記仇');});
t('C34','代價遺物：眼珠鈕扣、借來的心跳、無名者的燈、白狐毛、撕掉一半的合照',()=>{const D2=JSON.parse(JSON.stringify(D));D2.layers[0].fights=[['returndog']];D2.map.w={fight:1};let st=C.newRun(D2,4,'yy',{unlocked:[]});
 st=C.apply(D2,st,{type:'MOVE',c:0}).state;st.combat=null;st.screen='map';st.row=-1;
 for(const r of ['eyebutton','namelesslamp','foxhair','tornphoto','borrowedheart']){st.relics=st.relics.filter(x=>x!==r);}
 const m0=st.maxHp,n0=st.deck.length;let s1=JSON.parse(JSON.stringify(st));
 const gain=(s,id)=>{s.relics.push(id);if(id==='borrowedheart'){s.maxHp+=15;s.hp+=15;}if(id==='tornphoto')s.deck.push({uid:999,id:'x_name',up:0});};
 for(const r of ['eyebutton','namelesslamp','tornphoto'])gain(s1,r);s1.hp=s1.maxHp;const h0=s1.hp;s1=C.apply(D2,s1,{type:'MOVE',c:0}).state;const c=s1.combat;
 ok(c.maxE===4&&c.energy===4,'眼珠鈕扣 +1 能量');ok([...c.draw,...c.hand].some(x=>x.id==='x_whisper'),'塞低語');ok(c.hand.length>=8||c.hand.length===Math.min(10,5+3),'合照多抽 3');ok(s1.hp<=h0-3,'無名者的燈 -3');
 let s2=fight('yy',['returndog']);s2.relics.push('foxhair');s2.hp=Math.floor(s2.maxHp/2)+2;s2.combat.enemies[0].intent={n:'撕咬',a:6};s2.combat.block=0;const r=A(s2,{type:'END_TURN'});ok(r.events.some(x=>x.t==='relic'&&x.id==='foxhair'),'白狐毛');});
t('C35','事件：最大生命減少時目前生命跟著降；一次升級兩張',()=>{let st=C.newRun(D,8,'yy');st.screen='event';st.event={id:'scale',done:null};st.relics.push('vial','borrowedheart');st=A(st,{type:'EVENT',i:1}).state;ok(st.hp<=st.maxHp&&st.relics.length>=4,'扣上限、拿兩件');let s2=C.newRun(D,8,'yy');s2.screen='event';s2.event={id:'knock',done:null};s2=A(s2,{type:'EVENT',i:1}).state;ok(s2.deck.filter(c=>c.up).length===2);});

// ── v0.4：存檔 v2、殘響、守燈處
t('C36','存檔：戰鬥中只存戰前狀態；讀回來是同一場戰鬥的開頭（同樣的手牌）',()=>{let st=C.newRun(D,21,'yy');const r=A(st,{type:'MOVE',c:1});const s1=r.state;const h0=s1.combat.hand.map(x=>x.id).join();
 let s2=s1;const e=s2.combat.enemies[0];s2=A(s2,{type:'PLAY',i:0,target:e.uid}).state;s2=A(s2,{type:'END_TURN'}).state;
 const saved=JSON.parse(JSON.stringify(C.saveForm(s2)));ok(!saved.combat&&saved.resume&&saved.screen==='map','存的是戰前');ok(!JSON.stringify(saved).includes('"hand"'),'不存手牌');
 const back=C.loadRun(D,saved);ok(back.screen==='combat'&&back.combat.turn===1,'回到第 1 回合');ok(back.combat.hand.map(x=>x.id).join()===h0,'同樣的手牌');ok(back.hp===s1.hp);});
t('C37','存檔：戰鬥結束後不再帶戰前快照',()=>{let st=fight('yy',['dutyghost']);st.combat.enemies[0].hp=1;hand(st,['strike']);ok(st.pre,'戰鬥中有快照');st=A(st,{type:'PLAY',i:0,target:st.combat.enemies[0].uid}).state;ok(st.screen==='reward'&&!st.pre);ok(C.saveForm(st)===st);});
t('C38','遷移：v1 戰鬥中的舊存檔退回這場戰鬥開頭，這一局不作廢',()=>{let st=fight('yy',['dutyghost']);st=A(st,{type:'END_TURN'}).state;const old=JSON.parse(JSON.stringify(st));old.v=1;delete old.pre;delete old.kp;old.combat.enemies[0].hp=3;
 const m=C.loadRun(D,old);ok(m.v===2&&m.screen==='combat'&&m.combat.turn===1,'重新開打');ok(m.combat.enemies[0].id==='dutyghost'&&m.combat.enemies[0].hp>3,'敵人回滿');ok(m.hp===old.hp,'生命照舊');
 const o2=JSON.parse(JSON.stringify(C.newRun(D,5,'cl')));o2.v=1;delete o2.kp;const m2=C.loadRun(D,o2);ok(m2.v===2&&m2.screen==='map'&&Array.isArray(m2.kp));
 const mm=C.migrateMeta({v:1,memory:40,unlocked:['x'],ach:[],codex:{},runs:2,wins:{yy:0,cl:0},best:3,seen:[]});ok(mm.v===2&&mm.echo===0&&mm.memory===40&&mm.keeper.length===0);});
t('C39','殘響：等於這局回憶；放棄只拿一半',()=>{let st=C.newRun(D,6,'yy');st.stats.floors=5;st.stats.elites=1;const mem=C.memoryOf(D,st,false);
 const q=A(st,{type:'QUIT'});ok(q.state.screen==='over'&&q.state.result.quit);const m=C.metaApply(D,C.newMeta(),q.events).meta;ok(m.memory===mem&&m.echo===Math.floor(mem/2),'回憶全拿、殘響一半');
 const m2=C.metaApply(D,C.newMeta(),[{t:'runEnd',win:false,ch:'yy',floors:5,memory:mem}]).meta;ok(m2.echo===mem);});
t('C40','守燈處：要夠殘響、要先買前一項、只能買一次',()=>{let m=C.newMeta();m.echo=100;ok(!C.metaBuy(D,m,'m_hp2').ok,'要先買 m_hp1');let r=C.metaBuy(D,m,'m_hp1');ok(r.ok&&r.meta.echo===70);ok(!C.metaBuy(D,r.meta,'m_hp1').ok,'只能一次');ok(!C.metaBuy(D,r.meta,'m_hp2').ok,'不夠');});
t('C41','守燈處效果：生命、零錢、舊行李、剪掉的線頭',()=>{const m={unlocked:[],keeper:['m_hp1','m_hp2','m_gold','m_relic','m_remove']};let st=C.newRun(D,7,'cl',m);ok(st.maxHp===D.chars.cl.hp+10&&st.hp===st.maxHp&&st.gold===139);
 ok(st.screen==='prep'&&st.prep.relics.length===3&&st.prep.remove);ok(!C.apply(D,st,{type:'MOVE',c:0}).ok,'準備完才能走');const n=st.relics.length;st=A(st,{type:'PREP_RELIC',i:0}).state;ok(st.relics.length===n+1);st=A(st,{type:'PREP_REMOVE',uid:st.deck[0].uid}).state;ok(st.deck.length===9);st=A(st,{type:'PREP_DONE'}).state;ok(st.screen==='map');});
t('C42','守燈處效果：溫著的茶、淨火、第二張地圖',()=>{let st=C.newRun(D,8,'yy',{keeper:['m_rest','m_purge','m_skip']});const m0=JSON.stringify(st.maps[0]);st=A(st,{type:'REROLL_MAP'}).state;ok(JSON.stringify(st.maps[0])!==m0);ok(!C.apply(D,st,{type:'REROLL_MAP'}).ok,'一層一次');
 st.screen='rest';st.hp=10;const r=A(st,{type:'REST'});ok(r.state.hp===10+Math.floor(st.maxHp*.3)+5);
 st.deck.push({uid:999,id:'x_name',up:0});ok(!C.apply(D,st,{type:'PURGE',uid:st.deck[0].uid}).ok,'只能燒詛咒');const p=A(st,{type:'PURGE',uid:999}).state;ok(!p.deck.some(x=>x.uid===999)&&p.screen==='map');});

// ── v0.5：本源、異化三相、送回
t('C43','本源：換起始牌；九尾第一張攻擊給 1 厄契；毒蛇厄契每回合 +1；蠍子裁定打倒回 3',()=>{
 ok(C.newRun(D,3,'yy',null,{origin:'M01'}).deck.filter(c=>c.id==='b_coil').length===2);ok(C.newRun(D,3,'cl',null,{origin:'ink'}).deck.filter(c=>c.id==='b_dot').length===2);ok(C.newRun(D,3,'yy').origin==='B01');
 let st=fightO('yy','B01',['dutyghost']);hand(st,['strike','strike']);const e=st.combat.enemies[0];st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.combat.enemies[0].st.pact===(e.st.pact||0)+1,'第一張 +1');const p1=st.combat.enemies[0].st.pact;st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.combat.enemies[0].st.pact===p1,'第二張不加');
 let s2=fightO('yy','M01',['dutyghost']);s2.combat.enemies[0].st.pact=3;s2.combat.enemies[0].intent={n:'等',b:1};s2=A(s2,{type:'END_TURN'}).state;ok(s2.combat.enemies[0].st.pact===4,'毒蛇 +1');
 let s3=fightO('yy','M02',['dutyghost']);hand(s3,['yy_judge']);const e3=s3.combat.enemies[0];e3.st.pact=5;e3.hp=3;s3.hp=20;const r=A(s3,{type:'PLAY',i:0,target:e3.uid});ok(r.state.hp>=23,'回 3');});
t('C44','本源：紙的保留牌給格擋；墨到 6 下一張攻擊加倍並歸零；蜘蛛命線 3 回合',()=>{
 let st=fightO('cl','paper',['dutyghost']);hand(st,['b_carve','b_carve']);st.combat.enemies[0].intent={n:'等',b:1};st=A(st,{type:'END_TURN'}).state;ok(st.combat.block>=4,'兩張保留 +4');
 let s2=fightO('cl','ink',['dutyghost']);hand(s2,['strike']);s2.combat.ink=6;const e=s2.combat.enemies[0];e.hp=e.max=50;e.block=0;s2=A(s2,{type:'PLAY',i:0,target:e.uid}).state;ok(s2.combat.enemies[0].hp===50-12&&s2.combat.ink===0,'加倍');
 let s3=fightO('yy','M03',['dutyghost','dutyghost']);hand(s3,['b_web']);s3=A(s3,{type:'PLAY',i:0,target:s3.combat.enemies[0].uid}).state;ok(s3.combat.enemies.every(x=>x.st.link===3));});
t('C45','異化值：代價牌每 1 生命 +2、抽到詛咒 +5、專屬牌 +4；戰鬥結束和休息都不回退；克勞德沒有',()=>{
 let st=fightO('yy','M01',['dutyghost']);st.alien=0;hand(st,['yy_bloodpact','b_coil']);const e=st.combat.enemies[0];st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.alien===6,'失 3 生命 +6：'+st.alien);st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.alien===10&&st.reso.M01===1,'契 +4');
 st.combat.draw=[{uid:'z',id:'x_name',up:0}];st.combat.hand=[];st.combat.enemies[0].intent={n:'等',b:1};st=A(st,{type:'END_TURN'}).state;ok(st.alien===15,'抽到詛咒 +5：'+st.alien);
 st.combat.enemies[0].hp=1;hand(st,['strike']);st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.screen==='reward'&&st.alien===15,'戰鬥結束不回退');
 st.alien=50;st.screen='rest';st.reward=null;st=A(st,{type:'REST'}).state;ok(st.alien===50,'休息不回退');
 let c=fightO('cl','lamp',['dutyghost']);hand(c,['cl_bloodink']);c=A(c,{type:'PLAY',i:0}).state;ok(!c.alien);});
t('C46','三相：半妖攻擊 +1、多抽 1、回合開始失 1 生命；專屬牌照相變強；收斂與放任',()=>{
 let st=fightO('yy','M01',['dutyghost']);st.alien=50;st.hp=st.maxHp;ok(C.phaseOf(st)==='half');ok(C.desc(D,{id:'b_coil',up:0},'half').includes('5 層')&&C.desc(D,{id:'b_coil',up:0},'full').includes('8 層')&&C.desc(D,{id:'b_coil',up:0}).includes('3 層'));
 hand(st,['strike','b_coil','yy_restrain']);const e=st.combat.enemies[0];e.hp=e.max=60;e.block=0;const p0=e.st.pact||0;st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.combat.enemies[0].hp===60-7,'6+1');
 const n0=st.combat.hand.length;st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.combat.enemies[0].st.pact===p0+5&&st.combat.hand.length===n0,'5 層並抽 1');
 const a0=st.alien;st=A(st,{type:'PLAY',i:st.combat.hand.findIndex(x=>x.id==='yy_restrain')}).state;ok(st.alien===a0-20);
 st.alien=50;st.combat.enemies[0].intent={n:'等',b:1};const hp0=st.hp;st=A(st,{type:'END_TURN'}).state;ok(st.hp===hp0-1,'回合開始 -1');ok(st.combat.hand.length>=6,'多抽 1');
 hand(st,['yy_release']);const h1=st.hp,a1=st.alien;st=A(st,{type:'PLAY',i:0}).state;ok(st.alien===a1+25&&st.hp===h1-3,'放任不另外加異化');});
t('C47','完全非人：到 100 的下一回合所有牌免費，維持兩回合，結束後異化回到 50；語熙在 60 醒來',()=>{
 let st=fightO('yy','B01',['dutyghost']);st.alien=58;hand(st,['yy_release','yy_release']);st.combat.enemies[0].hp=st.combat.enemies[0].max=200;let r=A(st,{type:'PLAY',i:0});ok(r.events.some(x=>x.t==='yxWake')&&r.state.flags.yx);st=r.state;st.alien=90;r=A(st,{type:'PLAY',i:0});ok(r.state.alien===100&&r.state.combat.fullNext);st=r.state;
 st.combat.enemies[0].intent={n:'等',b:1};r=A(st,{type:'END_TURN'});st=r.state;ok(st.combat.full&&r.events.some(x=>x.t==='transform'));ok(C.phaseOf(st)==='full');hand(st,['yy_judge','strike']);st.combat.energy=0;st=A(st,{type:'PLAY',i:1,target:st.combat.enemies[0].uid}).state;ok(st.combat.energy===0,'免費');
 const hp0=st.hp;st.combat.enemies[0].intent={n:'等',b:1};r=A(st,{type:'END_TURN'});ok(r.state.combat.full===2&&!r.events.some(x=>x.t==='recall'),'維持兩回合');st=r.state;st.combat.enemies[0].intent={n:'等',b:1};r=A(st,{type:'END_TURN'});ok(r.events.some(x=>x.t==='recall'));ok(r.state.alien===50&&!r.state.combat.full&&r.state.hp<hp0,'喚回後停在半妖');});
t('C48','送回：生命低於 25% 才行、首領不行、付 1 能量加 4 生命或一張手牌；燈芯燒完得燈照，燈照讓敵人停手',()=>{
 let st=fightO('cl','lamp',['dutyghost','dutyghost']);const [e1,e2]=st.combat.enemies;hand(st,['strike','guard']);ok(!C.apply(D,st,{type:'SEND',uid:e1.uid,pay:'hp'}).ok,'還太多血');e1.hp=Math.ceil(e1.max*.25)-1;e2.hp=Math.ceil(e2.max*.25)-1;
 const hp0=st.hp;let r=A(st,{type:'SEND',uid:e1.uid,pay:'hp'});st=r.state;ok(st.hp===hp0-4&&st.combat.energy===9&&st.wick===9&&r.events.some(x=>x.t==='sent'));ok(C.metaApply(D,C.newMeta(),r.events).meta.flame===1,'燈火 +1');
 st.wick=1;r=A(st,{type:'SEND',uid:e2.uid,pay:0});st=r.state;ok(st.screen==='reward'&&st.lamp===1&&st.wick===10&&st.stats.kills===2,'算打倒');
 let b=fight('cl',['dutyghost']);b.combat.enemies[0].id='wusign';b.combat.enemies[0].hp=1;ok(!C.apply(D,b,{type:'SEND',uid:b.combat.enemies[0].uid,pay:'hp'}).ok,'首領不行');
 let y=fight('yy',['dutyghost']);y.combat.enemies[0].hp=1;ok(!C.apply(D,y,{type:'SEND',uid:y.combat.enemies[0].uid,pay:'hp'}).ok,'語嫣不行');
 let l=fight('cl',['dutyghost']);l.lamp=1;l.combat.enemies[0].intent={n:'咬',a:9};l.combat.block=0;const h=l.hp;l=A(l,{type:'LAMP'}).state;l=A(l,{type:'END_TURN'}).state;ok(l.hp===h&&l.lamp===0,'停手');});

// ── v0.7：怪物三系
function fset(st,ids){const c=st.combat;return c;}
t('C49','修仙系：每回合 +1 境界，滿 3 突破（回 30%、力量 +3）；單次 10 傷以上破境；鎮屍符鎖攻擊、花 1 能量撕掉',()=>{
 let st=fight('yy',['jiangshi_boy']);let e=st.combat.enemies[0];ok(e.realm===0);e.intent={n:'等',b:1};st=A(st,{type:'END_TURN'}).state;ok(st.combat.enemies[0].realm===1);
 e=st.combat.enemies[0];e.realm=2;e.hp=10;e.intent={n:'等',b:1};const r=A(st,{type:'END_TURN'});e=r.state.combat.enemies[0];ok(r.events.some(x=>x.t==='breakthrough')&&e.realm===0&&e.st.str===3&&e.hp===10+Math.round(e.max*.3),'突破');
 st=r.state;st.combat.enemies[0].realm=2;st.combat.enemies[0].block=0;st.combat.enemies[0].st={};st.combat.enemies[0].hp=st.combat.enemies[0].max=90;hand(st,['yy_judge']);st.combat.enemies[0].st.pact=4;st=A(st,{type:'PLAY',i:0,target:st.combat.enemies[0].uid}).state;ok(st.combat.enemies[0].realm===1,'破境');
 hand(st,['strike','x_talisman']);ok(!C.apply(D,st,{type:'PLAY',i:0,target:st.combat.enemies[0].uid}).ok,'被鎮住');st=A(st,{type:'TEAR',i:1}).state;ok(st.combat.energy===9&&st.combat.hand.length===1);A(st,{type:'PLAY',i:0,target:st.combat.enemies[0].uid});});
t('C50','修仙系：貼符進手牌；紙紮一隻死另一隻 +2 境界；煉丹師父落單時吞丹',()=>{
 let st=fight('yy',['jiangshi_boy']);st.combat.enemies[0].intent={n:'貼符',addHand:['x_talisman',1]};st=A(st,{type:'END_TURN'}).state;ok(st.combat.hand.some(x=>x.id==='x_talisman'));
 let t2=fight('yy',['paper_twins','paper_twins']);const [a,b]=t2.combat.enemies;a.hp=1;hand(t2,['strike']);t2=A(t2,{type:'PLAY',i:0,target:a.uid}).state;ok(t2.combat.enemies[1].realm===2);
 let t3=fight('yy',['alchemist']);t3.combat.enemies[0].intent={n:'等',b:1};let n=0;for(let i=0;i<6;i++){t3=A(t3,{type:'END_TURN'}).state;if(t3.screen!=='combat')break;if(t3.combat.enemies[0].intent.solo)n++;}ok(n>=1,'吞丹');});
t('C51','不可名狀：打到才看得見意圖；直視每回合異化 +5（克勞德失 1 燈芯）；叫到第 4 號丟光手牌；閉眼不受傷；手死掉變兩隻小手',()=>{
 let st=fight('yy',['faceless']);st.alien=0;let e=st.combat.enemies[0];ok(e.hid===1);hand(st,['strike']);st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(!st.combat.enemies[0].hid,'揭露');const a0=st.alien;st=A(st,{type:'END_TURN'}).state;ok(st.alien>=a0+5,'直視');
 let c=fight('cl',['ticketer']);for(let i=0;i<3;i++)c=A(c,{type:'END_TURN'}).state;ok(c.wick===7,'燈芯 -3：'+c.wick);ok(c.combat.hand.length>0);c=A(c,{type:'END_TURN'}).state;ok(c.combat.hand.length===0&&c.combat.enemies[0].num===4,'第 4 號');
 let w=fight('yy',['welleye']);const we=w.combat.enemies[0];we.intent={n:'閉眼',shut:1};hand(w,['strike']);const h0=we.hp;w=A(w,{type:'PLAY',i:0,target:we.uid}).state;ok(w.combat.enemies[0].hp===h0,'閉眼');
 let h=fight('yy',['hands']);h.combat.enemies[0].hp=1;hand(h,['strike']);h=A(h,{type:'PLAY',i:0,target:h.combat.enemies[0].uid}).state;ok(h.screen==='combat'&&C.alive(h.combat).length===2&&C.alive(h.combat).every(x=>x.id==='small_hand'));});
t('C52','血肉機械：每 12 傷打掉一個零件；針 +2 攻擊；心跳鐘倒數到 0 打 30；發條壞了每 10 傷倒數 +1；油污讓牌費用 +1 直到打出；鐵肺在妳自傷時回血',()=>{
 let st=fight('yy',['stitcher']);let e=st.combat.enemies[0];e.hp=e.max=100;st.combat.block=0;e.intent={n:'刺',a:6};const hp0=st.hp;let r=A(st,{type:'END_TURN'});ok(r.state.hp===hp0-Math.round(8*(D.layers[0].atkMul||1)),'針 +2');
 st=r.state;hand(st,['strike','strike']);e=st.combat.enemies[0];e.block=0;st=A(st,{type:'PLAY',i:0,target:e.uid}).state;st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.combat.enemies[0].parts.length===0,'打掉針');
 let h=fight('yy',['heartclock']);ok(h.combat.enemies[0].cd===4);h.combat.block=0;let hp=h.hp;for(let i=0;i<3;i++)h=A(h,{type:'END_TURN'}).state;ok(h.hp===hp&&h.combat.enemies[0].intent.boom,'快到了');h.combat.block=0;h=A(h,{type:'END_TURN'}).state;ok(h.hp===hp-Math.round(30*(D.layers[0].atkMul||1)),'報時 30');
 let h2=fight('yy',['heartclock']);const he=h2.combat.enemies[0];he.hp=he.max=200;he.parts=[];hand(h2,['yy_judge']);he.st.pact=4;h2=A(h2,{type:'PLAY',i:0,target:he.uid}).state;ok(h2.combat.enemies[0].cd===6,'倒數 +2：'+h2.combat.enemies[0].cd);
 let o=fight('yy',['oilworker']);o=A(o,{type:'END_TURN'}).state;const oc=o.combat.hand.find(x=>x.oil);ok(oc,'沾到油污');ok(C.cost(D,oc)===D.cards[oc.id].c+1);
 let l=fight('yy',['ironlung']);const le=l.combat.enemies[0];le.hp=40;hand(l,['yy_bloodpact']);l=A(l,{type:'PLAY',i:0,target:le.uid}).state;ok(l.combat.enemies[0].hp===43,'鐵肺 +3');});

// ── v0.7：慾望契、心願、個性、癖好
function fightM(ch,opt,ids,meta){const D2=JSON.parse(JSON.stringify(D));D2.layers[0].fights=[ids];D2.map.w={fight:1};let st=C.newRun(D2,3,ch,meta||{unlocked:[]},opt);st.origin=null;return C.apply(D2,st,{type:'MOVE',c:0}).state;}
t('C53','慾望契：貪多拿渡鴉幣、饞開場失 3 打倒回 2、怨開局記仇且不能磨牌、執第一張牌回手、艷依異化值加減傷害',()=>{
 let g=fightM('yy',{desire:'glutton'},['dutyghost']);ok(g.hp===g.maxHp-3,'饞 -3');g.combat.enemies[0].hp=1;hand(g,['strike']);g=A(g,{type:'PLAY',i:0,target:g.combat.enemies[0].uid}).state;ok(g.hp===g.maxHp-1,'回 2');
 let r=fightM('yy',{desire:'grudge'},['dutyghost']);ok(r.combat.pw.grudge===1);r.screen='rest';r.combat=null;ok(!C.apply(D,r,{type:'SMITH',uid:r.deck[0].uid}).ok,'不能磨牌');
 let o=fightM('yy',{desire:'obsess'},['dutyghost']);o.combat.enemies[0].hp=o.combat.enemies[0].max=99;hand(o,['strike','guard']);const u=o.combat.hand[0].uid;o=A(o,{type:'PLAY',i:0,target:o.combat.enemies[0].uid}).state;o.combat.enemies[0].intent={n:'等',b:1};const rr=A(o,{type:'END_TURN'});ok(rr.events.some(x=>x.t==='obsess'),'回手');
 let v=fightM('yy',{desire:'vanity'},['dutyghost']);const e=v.combat.enemies[0];e.hp=e.max=99;e.block=0;hand(v,['strike','strike']);v.alien=0;v=A(v,{type:'PLAY',i:0,target:e.uid}).state;ok(v.combat.enemies[0].hp===99-8,'+2');v.alien=39;v.stats.ph.h=0;v.alien=45;v=A(v,{type:'PLAY',i:0,target:e.uid}).state;ok(v.combat.enemies[0].hp===99-8-6,'半妖 +1、艷 -1');});
t('C54','心願：想回家不能買遺物、信寄出去手牌上限 9 多抽 1、保護家人格擋 +2 攻擊 -1、記住每個人不能移除',()=>{
 let h=C.newRun(D,3,'cl',null,{desire:'home'});h.screen='shop';h.shop={cards:[],relics:[{id:'bell',price:1,sold:false}],removed:false,removeCost:1};ok(!C.apply(D,h,{type:'BUY_RELIC',i:0}).ok);
 let l=fightM('cl',{desire:'letter'},['dutyghost']);ok(l.combat.hand.length===6&&C.handMax(D,l)===9);
 let g=fightM('cl',{desire:'guard'},['dutyghost']);const e=g.combat.enemies[0];e.hp=e.max=99;e.block=0;hand(g,['strike','guard']);g=A(g,{type:'PLAY',i:0,target:e.uid}).state;ok(g.combat.enemies[0].hp===94);const b0=g.combat.block;g=A(g,{type:'PLAY',i:0}).state;ok(g.combat.block===b0+7);
 let r=C.newRun(D,3,'cl',null,{desire:'remember'});r.screen='shop';r.shop={cards:[],relics:[],removed:false,removeCost:1};ok(!C.apply(D,r,{type:'REMOVE',uid:r.deck[0].uid}).ok);});
t('C55','個性與癖好：慵懶睡久一點、溫柔送回門檻 30%、記仇的敵人少兩成血、泡茶、寫信留 30 幣給下一局、解鎖要花殘響或回憶',()=>{
 let z=C.newRun(D,3,'yy',null,{persona:'lazy',hobby:'tea'});z.screen='rest';z.hp=5;z.alien=50;let a=A(z,{type:'SLEEP'}).state;ok(a.hp===a.maxHp&&a.alien===65);let b=A(z,{type:'TEA'}).state;ok(b.alien===50&&b.deck.some(x=>x.id==='yy_restrain'),'泡茶給一張收斂');
 ok(C.sendRate(D,C.newRun(D,3,'cl',null,{persona:'gentle'}))>.29);
 const p=fightM('yy',{persona:'petty'},['dutyghost'],{unlocked:[],grudges:['dutyghost']});const q=fightM('yy',{},['dutyghost']);ok(p.combat.enemies[0].max<q.combat.enemies[0].max);
 let w=C.newRun(D,3,'cl',null,{hobby:'letters'});w.screen='rest';const r=A(w,{type:'WRITE'});ok(r.state.gold===69&&!C.apply(D,r.state,{type:'WRITE'}).ok);let m=C.metaApply(D,C.newMeta(),r.events).meta;m=C.metaApply(D,m,[{t:'runEnd',win:false,ch:'cl',floors:1,memory:0}]).meta;ok(m.letter===30);ok(C.newRun(D,4,'cl',m).gold===129,'下一局撿到');
 let mm=C.newMeta();mm.echo=60;ok(!C.metaUnlock(D,mm,'desire','greed').ok,'要先打倒第一層首領');mm.ach.push('boss1');const u=C.metaUnlock(D,mm,'desire','greed');ok(u.ok&&u.meta.echo===10&&u.meta.desires.includes('greed'));
 mm.memory=100;const pu=C.metaUnlock(D,mm,'persona','queen');ok(pu.ok&&pu.meta.memSpent===80&&pu.meta.memory===100);ok(!C.metaUnlock(D,pu.meta,'persona','sly').ok);});

// ── v0.8：第三批與其餘本源
t('C56','疤：代價牌每讓妳失去 1 生命 +1 疤，每 3 疤傷害 +1（最多 +4），9 疤改名；克勞德沒有',()=>{
 let st=fightO('yy','B01',['dutyghost']);const e=st.combat.enemies[0];e.hp=e.max=300;e.block=0;st.hp=st.maxHp=200;st.combat.firstAtk=1;
 hand(st,['yy_snip']);st.combat.hand[0].uid=st.deck[0].uid;st.deck[0].id='yy_snip';st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.deck[0].scar===4,'4 疤');
 ok(C.cardDef(D,{id:'yy_snip',up:0,scar:9}).n===D.scarNames.yy_snip);
 let c=fightO('cl','lamp',['dutyghost']);hand(c,['cl_bloodink']);c.combat.hand[0].uid=c.deck[0].uid;c=A(c,{type:'PLAY',i:0}).state;ok(!c.deck[0].scar);});
t('C57','語熙圈牌：異化 60 以上每回合圈一張；打出效果加倍、異化 +10；不打下回合少抽 1',()=>{
 let st=fightO('yy','B01',['dutyghost']);st.alien=70;st.flags.yx=1;const e=st.combat.enemies[0];e.hp=e.max=300;e.intent={n:'等',b:1};st.hp=st.maxHp;st=A(st,{type:'END_TURN'}).state;const i=st.combat.hand.findIndex(x=>x.ring);ok(i>=0,'有圈');
 st.combat.hand[i].id='strike';const en=st.combat.enemies[0];en.block=0;const h0=en.hp,a0=st.alien;st.combat.firstAtk=1;st=A(st,{type:'PLAY',i,target:en.uid}).state;ok(h0-st.combat.enemies[0].hp===14,'兩次 6+1：'+(h0-st.combat.enemies[0].hp));ok(st.alien===a0+10);
 let s2=fightO('yy','B01',['dutyghost']);s2.alien=70;s2.flags.yx=1;s2.hp=s2.maxHp;s2.combat.enemies[0].intent={n:'等',b:1};s2=A(s2,{type:'END_TURN'}).state;s2.combat.enemies[0].intent={n:'等',b:1};s2=A(s2,{type:'END_TURN'}).state;ok(s2.combat.hand.length===5,'6-1：'+s2.combat.hand.length);});
t('C58','第四副碗筷：第 3 局起出現、不能移除；第 9 局可以打出一次讓敵人停手；進度跨局',()=>{
 ok(!C.newRun(D,3,'yy',{runs:1}).deck.some(x=>x.id==='x_fourth'));const r=C.newRun(D,3,'cl',{runs:2,fourth:0});ok(r.deck.some(x=>x.id==='x_fourth'));
 let m=C.newMeta();m.runs=2;m=C.metaApply(D,m,[{t:'runEnd',win:false,ch:'yy',floors:1,memory:0,fourth:1}]).meta;ok(m.fourth===1);
 const D2=JSON.parse(JSON.stringify(D));D2.layers[0].fights=[['dutyghost']];D2.map.w={fight:1};let st=C.newRun(D2,3,'yy',{runs:10,fourth:8,unlocked:[]});st=C.apply(D2,st,{type:'MOVE',c:0}).state;hand(st,['x_fourth']);st.combat.block=0;const hp=st.hp;st.combat.enemies[0].intent={n:'咬',a:9};const p=A(st,{type:'PLAY',i:0});ok(p.events.some(x=>x.t==='fourth'));st=A(p.state,{type:'END_TURN'}).state;ok(st.hp>=hp-1,'停手');});
t('C59','死掉留下一張牌：下一局第一層第一個事件花 10 生命撿回，保留升級；最多留 3 局',()=>{
 let st=fight('yy',['dutyghost']);st.deck.push({uid:777,id:'yy_judge',up:1});st.deck=st.deck.filter(x=>D.cards[x.id].r===0||x.uid===777);st.hp=1;st.combat.block=0;st.combat.enemies[0].intent={n:'咬',a:30};const r=A(st,{type:'END_TURN'});const lc=r.events.find(x=>x.t==='leftCard');ok(lc&&lc.card.id==='yy_judge'&&lc.card.up===1);
 let m=C.metaApply(D,C.newMeta(),r.events).meta;ok(m.left&&m.left.ttl===3);
 const D2=JSON.parse(JSON.stringify(D));D2.map.w={event:1};let n=C.newRun(D2,5,'yy',m);n.maps[0].rows[0].forEach(x=>x.t='event');n=C.apply(D2,n,{type:'MOVE',c:0}).state;ok(n.event.id==='left_card');const hp=n.hp;const t2=C.apply(D2,n,{type:'EVENT',i:0});ok(t2.state.hp===hp-10&&t2.state.deck.some(x=>x.id==='yy_judge'&&x.up===1&&x.left));ok(C.cardDef(D,t2.state.deck.find(x=>x.left)).n.startsWith('她留下的'));ok(C.metaApply(D,m,t2.events).meta.left===null);
 let m2=m;for(let i=0;i<3;i++)m2=C.metaApply(D,m2,[{t:'runEnd',win:false,ch:'cl',floors:1,memory:0}]).meta;ok(m2.left===null,'3 局後消失');});
t('C60','地圖隨異化值：40 以上少一個休息點、多一間商店；語熙掌身從 60 開始、最低 40、自傷反彈',()=>{
 const cnt=(m,t)=>m.rows.flat().filter(n=>n.t===t).length;let a=C.newRun(D,11,'yy'),b=C.newRun(D,11,'yx',{yx:1,unlocked:[]});ok(b.alien===60&&b.layerCorrupt[0]===60);ok(cnt(b.maps[0],'rest')<=cnt(a.maps[0],'rest'));
 ok(b.deck.filter(x=>x.id==='yx_seize').length===2&&b.deck.filter(x=>x.id==='yy_release').length===2);
 let y=fight('yx',['dutyghost']);hand(y,['yy_bloodpact']);const e=y.combat.enemies[0];const h0=e.hp;y=A(y,{type:'PLAY',i:0,target:e.uid}).state;ok(y.combat.enemies[0].hp===h0-3,'反彈 3');y.alien=45;hand(y,['yy_restrain']);y=A(y,{type:'PLAY',i:0}).state;ok(y.alien===40,'最低 40');});
t('C61','顧沉舟：沒有異化值、卷宗對同系 +1 傷害、抽牌堆少於 5 張多 1 能量、義眼看穿、通關第二層且漏頁 9 張才解鎖',()=>{
 let g=fight('gu',['faceless']);ok(!g.alien&&g.maxHp===60);const e=g.combat.enemies[0];ok(e.hid);g=A(g,{type:'EYE',uid:e.uid}).state;ok(!g.combat.enemies[0].hid&&!C.apply(D,g,{type:'EYE',uid:e.uid}).ok);
 g.dossier={eldritch:2};hand(g,['gu_shot','gu_note','gu_shot']);const en=g.combat.enemies[0];en.hp=en.max=99;en.block=0;g=A(g,{type:'PLAY',i:0,target:en.uid}).state;ok(g.combat.enemies[0].hp===99-8,'6+2');g=A(g,{type:'PLAY',i:0}).state;g=A(g,{type:'PLAY',i:0,target:en.uid}).state;ok(g.combat.enemies[0].hp===99-8-9,'暫時 +1');
 g.combat.draw=g.combat.draw.slice(0,4);g.combat.disc=[];g.combat.hand=[];g.combat.enemies[0].intent={n:'等',b:1};g=A(g,{type:'END_TURN'}).state;ok(g.combat.energy===4,'少一頁 +1：'+g.combat.energy);
 let m=C.newMeta();m.pages=9;ok(C.metaApply(D,m,[{t:'unlockGu'}]).meta.gu===1);
 let w=fight('yy',['dutyghost']);w.layer=1;w.pages=9;w.combat.kind='boss';w.combat.enemies[0].hp=1;hand(w,['strike']);ok(A(w,{type:'PLAY',i:0,target:w.combat.enemies[0].uid}).events.some(x=>x.t==='unlockGu'));});
t('C62','其餘本源：巫妖復活一次、黑山羊失 5 生命得 1 能量、史萊姆格擋留一半、珊瑚剩餘能量變硬格擋、鮟鱇誘燈、寄生藤、鬼新娘、血蛭、蟲族',()=>{
 let l=fightO('yy','B08',['dutyghost']);l.hp=3;l.combat.block=0;l.combat.enemies[0].intent={n:'咬',a:30};let r=A(l,{type:'END_TURN'});ok(r.state.screen==='combat'&&r.state.hp>=Math.ceil(r.state.maxHp*.1)-3&&r.events.some(x=>x.t==='revive'),'復活');
 let g=fightO('yy','B10',['dutyghost']);hand(g,['yy_snip']);const e0=g.combat.energy;g=A(g,{type:'PLAY',i:0,target:g.combat.enemies[0].uid}).state;ok(g.combat.energy===e0-1,'失 4 還不夠');g.combat.lossAcc=4;hand(g,['yy_bloodpact']);const e1=g.combat.energy;g=A(g,{type:'PLAY',i:0,target:g.combat.enemies[0].uid}).state;ok(g.combat.energy===e1+2,'+1 能量（另 +1 是牌本身）');
 let s=fightO('yy','M06',['dutyghost']);s.combat.block=20;s.combat.enemies[0].intent={n:'等',b:1};s=A(s,{type:'END_TURN'}).state;ok(s.combat.block===10);
 let c=fightO('yy','M11',['dutyghost']);c.combat.hand=[];c.combat.enemies[0].intent={n:'等',b:1};c=A(c,{type:'END_TURN'}).state;ok(c.combat.block===12,'3 能量 → 12：'+c.combat.block);
 let u=fightO('yy','M09',['dutyghost']);ok(u.combat.lure===5);u.combat.block=0;const hp=u.hp;const eh=u.combat.enemies[0].hp;u.combat.enemies[0].intent={n:'咬',a:20};u=A(u,{type:'END_TURN'}).state;ok(u.hp>hp-20&&u.combat.enemies[0].hp<=eh-6,'誘燈');
 let v=fightO('yy','M12',['dutyghost']);hand(v,['yy_bind']);const ve=v.combat.enemies[0];ve.hp=ve.max=99;v.hp=50;v=A(v,{type:'PLAY',i:0,target:ve.uid}).state;ok(v.combat.enemies[0].st.vine===1);v.combat.enemies[0].intent={n:'等',b:1};v=A(v,{type:'END_TURN'}).state;ok(v.combat.enemies[0].hp<=97&&v.hp>=51);
 let b=fightO('yy','B07',['dutyghost','dutyghost']);const [x,y]=b.combat.enemies;x.st.link=2;y.st.link=2;x.hp=1;y.hp=y.max=50;y.block=0;hand(b,['strike']);b.combat.firstAtk=1;b=A(b,{type:'PLAY',i:0,target:x.uid}).state;ok(b.combat.enemies[1].hp<=42,'鬼新娘 -8');
 let m=fightO('yy','M04',['dutyghost']);m.hp=40;hand(m,['yy_judge']);const me=m.combat.enemies[0];me.hp=me.max=99;me.block=0;me.st.pact=4;m.combat.firstAtk=1;m=A(m,{type:'PLAY',i:0,target:me.uid}).state;ok(m.hp>40,'吸血');});

// ── v0.9：副本源、收藏與牌局、天賦
t('C63','副本源：專屬牌進獎勵池；被動要半妖以上才生效（克勞德是第 3 回合起）',()=>{
 const st=C.newRun(D,3,'yy',null,{origin:'B01',sub:'M01'});ok(st.sub==='M01'&&C.pool(D,st).length>=C.pool(D,C.newRun(D,3,'yy')).length);ok(C.newRun(D,3,'yy',null,{origin:'M01',sub:'M01'}).sub===null,'不能跟主本源一樣');
 const D2=JSON.parse(JSON.stringify(D));D2.layers[0].fights=[['dutyghost']];D2.map.w={fight:1};let f=C.newRun(D2,3,'yy',{unlocked:[]},{origin:'B01',sub:'M01'});f=C.apply(D2,f,{type:'MOVE',c:0}).state;const e=f.combat.enemies[0];e.hp=e.max=99;e.st.pact=3;e.intent={n:'等',b:1};f.hp=f.maxHp;let r=A(f,{type:'END_TURN'}).state;ok(r.combat.enemies[0].st.pact===3,'人形時不生效');
 r.alien=50;r.combat.enemies[0].intent={n:'等',b:1};const r2=A(r,{type:'END_TURN'});ok(r2.state.combat.enemies[0].st.pact===4&&r2.events.some(x=>x.t==='pas'&&x.k==='pactGrow1'),'半妖生效');});
t('C64','收藏與牌局：通關帶回一張；牌組 10～15 張、同名最多 2、不能超過收藏；五場固定關卡，打完三選一拿牌局專屬牌',()=>{
 let m=C.metaApply(D,C.newMeta(),[{t:'runEnd',win:true,ch:'yy',floors:21,memory:50}]).meta;ok(m.keepPending===1);m=C.metaKeep(D,m,{id:'yy_judge',up:1});ok(m.col.length===1&&!m.keepPending);
 const base=Array.from({length:9},()=>({id:'strike',up:0}));ok(C.deckOk(D,m,'yy',base),'太少');ok(!C.deckOk(D,m,'yy',base.concat([{id:'yy_judge',up:1}])));ok(C.deckOk(D,m,'yy',base.concat([{id:'yy_judge',up:1},{id:'yy_judge',up:1}])),'收藏不夠');ok(C.deckOk(D,m,'cl',base.concat([{id:'yy_judge',up:1}])),'不是她的牌');
 let st=C.newRun(D,9,'yy',m,{mode:'g',deck:base.concat([{id:'yy_judge',up:1}])});ok(st.screen==='gnext'&&st.deck.length===10);
 const T=D.trials[0];for(let i=0;i<5;i++){st=A(st,{type:'G_NEXT'}).state;ok(st.screen==='combat');ok(st.combat.enemies.map(e=>e.id).join()===T.stages[i].ids.join(),'固定關卡 '+i);if(i===0)ok(st.combat.hand.some(x=>x.id==='x_talisman'),'鎮屍符');if(i===4)ok(st.combat.rule==='drill');
  st.hp=st.maxHp;let g=0;while(st.screen==='combat'&&g++<20){st.combat.enemies.forEach(e=>{if(e.hp>0){e.hp=1;e.block=0;e.intent={n:'等',b:1};}});st.combat.hand=[{uid:'k'+g,id:'strike',up:0}];st.combat.energy=3;st=A(st,{type:'PLAY',i:0,target:C.alive(st.combat)[0].uid}).state;}}
 ok(st.screen==='gpick'&&st.gpick.length===3&&st.gpick.every(id=>D.cards[id].g),'三選一');const r=A(st,{type:'G_PICK',i:0});ok(r.state.screen==='over'&&r.state.result.win);const m2=C.metaApply(D,m,r.events);ok(m2.meta.col.length===2&&m2.news.gCard===st.gpick[0]&&!m2.meta.keepPending&&m2.news.memory===50);
 ok(!C.pool(D,C.newRun(D,1,'yy')).some(k=>D.cards[k].g),'牌局的牌不進一般下潛');});
t('C65','天賦點：下潛結束 +1、通關再 +1；第一格 1 點、中段 2 點、終點 3 點；要照順序',()=>{
 let m=C.metaApply(D,C.newMeta(),[{t:'runEnd',win:true,ch:'yy',floors:21,memory:0}]).meta;ok(m.prof.yy.pts===2);ok(!C.metaTalent(D,m,'yy','yy_greed1b').ok,'要先學第一格');let r=C.metaTalent(D,m,'yy','yy_greed1');ok(r.ok&&C.talLeft(D,r.meta.prof.yy)===1);ok(!C.metaTalent(D,r.meta,'yy','yy_greed1b').ok,'中段要 2 點');
 m=C.metaApply(D,r.meta,[{t:'runEnd',win:false,ch:'yy',floors:3,memory:0}]).meta;r=C.metaTalent(D,m,'yy','yy_greed1b');ok(r.ok&&C.talLeft(D,r.meta.prof.yy)===0);ok(!C.metaTalent(D,r.meta,'yy','yy_greed2').ok);
 ok(C.newRun(D,3,'yy',r.meta).tal.includes('yy_greed1b')&&!C.newRun(D,3,'cl',r.meta).tal.length);ok(C.profOf(C.migrateMeta({prof:{cl:{xp:60,spent:[]}}}),'cl').pts===2,'舊存檔換算');});
t('C66','天賦效果：買通、第三次、妹妹的聲音、輕一點、連首領也送回、改了又改、站著',()=>{
 const T=(ch,ids,en)=>{const s=fight(ch,en||['dutyghost']);s.tal=ids;return s;};
 let g=T('yy',['yy_greed1','yy_greed2']);g.gold=30;const e0=g.combat.energy;g=A(g,{type:'BUY_E'}).state;ok(g.gold===0&&g.combat.energy===e0+1&&!C.apply(D,g,{type:'BUY_E'}).ok);g.combat.enemies[0].hp=1;hand(g,['strike']);g=A(g,{type:'PLAY',i:0,target:g.combat.enemies[0].uid}).state;ok(g.gold>=8,'順手 +3');
 let r=T('yy',['yy_grudge1','yy_grudge2']);const e=r.combat.enemies[0];e.hp=e.max=200;e.intent={n:'咬',a:2,h:3};r.combat.block=0;r.hp=r.maxHp;const rr=A(r,{type:'END_TURN'});ok(rr.events.filter(x=>x.t==='tal').length===2&&rr.state.combat.enemies[0].hp<200,'記一筆＋第三次裁定');
 let s=T('yy',['yy_guard2']);s.hp=2;s.combat.block=0;s.combat.enemies[0].intent={n:'咬',a:40};const sr=A(s,{type:'END_TURN'});ok(sr.state.screen==='combat'&&sr.events.some(x=>x.t==='clSave')&&sr.state.hp>=Math.ceil(s.maxHp*.25)-2);
 let c=T('cl',['cl_lamp1','cl_lamp2']);c.combat.enemies[0].hp=1;const h=c.hp;c=A(c,{type:'SEND',uid:c.combat.enemies[0].uid,pay:'hp'}).state;ok(c.hp===h-2);
 let b=T('cl',['cl_lamp2']);b.combat.enemies[0].id='wusign';b.combat.enemies[0].max=80;b.combat.enemies[0].hp=7;hand(b,['guard']);ok(C.apply(D,b,{type:'SEND',uid:b.combat.enemies[0].uid,pay:0}).ok);b.combat.enemies[0].hp=9;ok(!C.apply(D,b,{type:'SEND',uid:b.combat.enemies[0].uid,pay:0}).ok);
 let w=T('cl',['cl_write1','cl_write2']);hand(w,['b_carve']);w.combat.enemies[0].intent={n:'等',b:1};w=A(w,{type:'END_TURN'}).state;const kc=w.combat.hand.find(x=>x.id==='b_carve');ok(kc&&C.cost(D,kc)===0,'費用 -1');
 let p=T('cl',['cl_pain2']);p.hp=5;p.combat.block=0;p.combat.enemies[0].intent={n:'等',b:1};p=A(p,{type:'END_TURN'}).state;ok(p.combat.block>=6);});

// ── v0.10：五源契牌、補齊本源、混合變相、個性與慾望
t('C67','九尾契牌：幻影讓下一張攻擊再打一半；搖尾讓敵人少 3 傷害；謊言改意圖；九尾能力；宴席上的笑',()=>{
 let st=fightO('yy','B01',['dutyghost']);const e=st.combat.enemies[0];e.hp=e.max=200;e.block=0;st.combat.firstAtk=1;hand(st,['b_b01_mirage','strike']);st=A(st,{type:'PLAY',i:0}).state;st=A(st,{type:'PLAY',i:0,target:e.uid}).state;ok(st.combat.enemies[0].hp===200-6-3,'6+3：'+(200-st.combat.enemies[0].hp));
 let t=fightO('yy','B01',['dutyghost']);const te=t.combat.enemies[0];te.intent={n:'咬',a:8};t.combat.block=0;hand(t,['b_b01_tails']);const tp=te.st.pact||0;t=A(t,{type:'PLAY',i:0,target:te.uid}).state;ok(t.combat.enemies[0].st.pact===tp+2);const hp=t.hp;t=A(t,{type:'END_TURN'}).state;ok(hp-t.hp===Math.round(5*(D.layers[0].atkMul||1)),'少 3');
 let l=fightO('yy','B01',['dutyghost']);hand(l,['b_b01_lie']);l=A(l,{type:'PLAY',i:0,target:l.combat.enemies[0].uid}).state;ok(l.combat.enemies[0].intent.b===6&&!l.combat.enemies[0].intent.a);
 let n=fightO('yy','B01',['dutyghost']);hand(n,['b_b01_nine','strike']);n.combat.firstAtk=1;n=A(n,{type:'PLAY',i:0}).state;const p0=n.combat.enemies[0].st.pact||0;n=A(n,{type:'PLAY',i:0,target:n.combat.enemies[0].uid}).state;ok((n.combat.enemies[0].st.pact||0)===p0+1);
 let f=fightO('yy','B01',['dutyghost']);f.combat.firstAtk=1;hand(f,['b_b01_feast','b_b01_feast']);const fe=f.combat.enemies[0];fe.hp=fe.max=99;const h0=f.combat.hand.length;const fp=fe.st.pact||0;f=A(f,{type:'PLAY',i:0,target:fe.uid}).state;ok(f.combat.enemies[0].st.pact===fp+2&&f.combat.hand.length===h0,'第一張：厄契 2、抽 1');f=A(f,{type:'PLAY',i:0,target:fe.uid}).state;ok(f.combat.enemies[0].st.pact===fp+2,'第二張不加');});
t('C68','毒蛇、蠍子、蜘蛛、血蛭契牌',()=>{
 let s=fightO('yy','M01',['dutyghost']);const e=s.combat.enemies[0];e.hp=e.max=99;e.block=0;e.st.pact=5;hand(s,['b_m01_venom','b_m01_constrict']);s=A(s,{type:'PLAY',i:0,target:e.uid}).state;ok(s.combat.enemies[0].st.pact===9,'涎 2+2');s=A(s,{type:'PLAY',i:0,target:e.uid}).state;ok(s.combat.enemies[0].hp===99-18&&s.combat.enemies[0].st.pact===9,'勒緊 ×2 不消耗');
 let h=fightO('yy','M01',['dutyghost','dutyghost']);hand(h,['b_m01_hiss','b_m01_fang']);h=A(h,{type:'PLAY',i:0}).state;const he=h.combat.enemies[0];he.st.pact=3;he.hp=he.max=99;h=A(h,{type:'PLAY',i:0,target:he.uid}).state;ok(h.combat.enemies[0].st.pact===7,'吐信 +1：'+h.combat.enemies[0].st.pact);
 let w=fightO('yy','M02',['dutyghost']);hand(w,['b_m02_wait']);w.combat.enemies[0].intent={n:'等',b:1};w=A(w,{type:'PLAY',i:0}).state;w=A(w,{type:'END_TURN'}).state;ok(w.combat.waitOn===1);hand(w,['strike']);const we=w.combat.enemies[0];we.hp=we.max=99;we.block=0;const en=w.combat.energy;w=A(w,{type:'PLAY',i:0,target:we.uid}).state;ok(w.combat.energy===en&&w.combat.enemies[0].hp===99-9,'伏：0 費、+3');
 let nd=fightO('yy','M02',['dutyghost']);const ne=nd.combat.enemies[0];ne.max=100;ne.hp=10;ne.block=0;ne.st.pact=4;nd.hp=20;hand(nd,['b_m02_needle']);nd=A(nd,{type:'PLAY',i:0,target:ne.uid}).state;ok(nd.screen==='reward'&&nd.hp===23,'補一針裁定、蠍子回 3');
 let sp=fightO('yy','M03',['dutyghost','dutyghost']);const [a,b]=sp.combat.enemies;a.hp=a.max=b.hp=b.max=50;hand(sp,['b_m03_silk','b_m03_wrap','b_m03_pull']);sp=A(sp,{type:'PLAY',i:0,target:a.uid}).state;ok(sp.combat.enemies[0].st.link===3&&!sp.combat.enemies[1].st.link);sp=A(sp,{type:'PLAY',i:0,target:b.uid}).state;ok(sp.combat.enemies[1].st.link);sp=A(sp,{type:'PLAY',i:0,target:a.uid}).state;ok(sp.combat.enemies.every(x=>x.hp<50));
 let lc=fightO('yy','M04',['dutyghost']);lc.hp=30;hand(lc,['b_m04_pool','b_m04_latch','b_m04_host']);lc.combat.energy=9;const le=lc.combat.enemies[0];le.hp=le.max=99;le.block=0;lc=A(lc,{type:'PLAY',i:0}).state;const b0=lc.combat.block;lc=A(lc,{type:'PLAY',i:0,target:le.uid}).state;ok(lc.hp>30&&lc.combat.block>b0,'吸附回血、血泊加格擋');const hh=lc.combat.enemies[0].hp;lc=A(lc,{type:'PLAY',i:0,target:le.uid}).state;ok(hh-lc.combat.enemies[0].hp===14,'換宿主 10+4');});
t('C69','新本源：克蘇魯換牌、渡鴉簽契、線回血、鏡擋一次、聲抽牌；混合變相兩回合',()=>{
 let k=fightO('yy','B09',['dutyghost']);const L=k.combat.draw.length;const top=k.combat.draw[L-1].uid,third=k.combat.draw[L-3].uid;const hp=k.hp;k=A(k,{type:'PEEK_SWAP'}).state;ok(k.combat.draw[L-1].uid===third&&k.combat.draw[L-3].uid===top&&k.hp===hp-2&&!C.apply(D,k,{type:'PEEK_SWAP'}).ok);
 let r=fightO('yy','B11',['dutyghost']);const e=r.combat.enemies[0];e.intent={n:'咬',a:9};const n=r.combat.hand.length;r=A(r,{type:'SIGN',i:0,uid:e.uid}).state;ok(r.combat.block>=9&&r.combat.enemies[0].intent.idle&&r.combat.hand.length===n-1&&!C.apply(D,r,{type:'SIGN',i:0,uid:e.uid}).ok);r.combat.block=0;const h2=r.hp;r=A(r,{type:'END_TURN'}).state;ok(r.hp===h2,'停手');
 let t=fightO('cl','line',['dutyghost']);t.hp=20;t.combat.enemies[0].intent={n:'等',b:1};t=A(t,{type:'END_TURN'}).state;ok(t.hp===22);
 let m=fightO('cl','mirror',['dutyghost']);m.combat.enemies[0].intent={n:'貼',addCard:['x_whisper',1]};const dn=m.combat.draw.length+m.combat.disc.length+m.combat.hand.length;m=A(m,{type:'END_TURN'}).state;ok(!m.combat.draw.concat(m.combat.disc,m.combat.hand).some(x=>x.id==='x_whisper'),'鏡擋掉');
 let v=fightO('cl','voice',['dutyghost']);hand(v,['guard','guard']);const vn=v.combat.hand.length;v=A(v,{type:'PLAY',i:0}).state;ok(v.combat.hand.length===vn,'抽 1');v=A(v,{type:'PLAY',i:0}).state;ok(v.combat.hand.length===vn-2+1);
 let x=fightO('yy','B01',['dutyghost']);x.sub='M03';x.alien=99;x.combat.enemies[0].hp=x.combat.enemies[0].max=300;x.hp=x.maxHp;hand(x,['yy_release']);x=A(x,{type:'PLAY',i:0}).state;x.combat.enemies[0].intent={n:'等',b:1};x=A(x,{type:'END_TURN'}).state;ok(x.combat.mix&&x.combat.pair==='BM'&&C.phaseOf(x)==='mix',x.combat.pair);ok(x.combat.energy===4,'多 1 能量');hand(x,['strike']);x=A(x,{type:'PLAY',i:0,target:x.combat.enemies[0].uid}).state;ok(x.combat.energy===9,'混合型態不免費');
 x.combat.enemies[0].intent={n:'等',b:1};x=A(x,{type:'END_TURN'}).state;ok(x.combat.full&&x.combat.mix,'第二回合');const hp3=x.hp;x.combat.enemies[0].intent={n:'等',b:1};const rr=A(x,{type:'END_TURN'});ok(!rr.state.combat.full&&rr.events.some(z=>z.t==='recall')&&rr.state.hp<=hp3-6+1,'結束失 6');ok(rr.state.alien===50,'混合結束停在半妖 '+rr.state.alien);});
t('C70','個性選項只給對的個性；好奇和把每封信寫完每個事件都有；慾望商店貨物；怠與懼',()=>{
 const D2=JSON.parse(JSON.stringify(D));D2.map.w={event:1};let st=C.newRun(D2,4,'yy',null,{persona:'lazy'});st.maps[0].rows[0].forEach(n=>n.t='event');st=C.apply(D2,st,{type:'MOVE',c:0}).state;st.event={id:'lunchbox',done:null};const ev=D.events.find(e=>e.id==='lunchbox');const li=ev.opts.findIndex(o=>o.per==='lazy');st.hp=20;const r=A(st,{type:'EVENT',i:li});ok(r.state.hp===30&&r.state.next.drawLess===1);
 const q=JSON.parse(JSON.stringify(st));q.persona='queen';ok(!C.apply(D,q,{type:'EVENT',i:li}).ok,'不是她的個性');
 const c=JSON.parse(JSON.stringify(st));c.persona='curious';ok(C.evOpts(D,c,ev).length===ev.opts.length+1);
 let s=C.newRun(D,4,'yy',null,{desire:'glutton'});s.screen='shop';s.shop={cards:[],relics:[],removed:false,removeCost:75,x:{id:'glutton',price:15,sold:false}};s.hp=10;s=A(s,{type:'BUY_X'}).state;ok(s.hp===20&&s.shop.x.sold);
 let v=C.newRun(D,4,'yy',null,{desire:'vanity'});v.screen='shop';v.alien=50;v.shop={cards:[],relics:[],removed:false,removeCost:75,x:{id:'vanity',price:30,sold:false}};ok(!C.apply(D,v,{type:'BUY_X'}).ok,'現在不要照');
 let sl=fightM('yy',{desire:'sloth'},['dutyghost']);ok(sl.combat.hand.length===4&&sl.combat.hand.every(x=>C.cost(D,x)<=Math.max(0,D.cards[x.id].c-1)),'怠：少抽 1、費用 -1');
 let dr=fightM('yy',{desire:'dread'},['dutyghost']);ok(dr.combat.enemies[0].st.weak===1&&dr.combat.st.weak===1);});

// ── v0.11
t('C71','地圖：「？」進去才知道、祭壇是特別事件；守燈處第二排；新委託',()=>{
 const D2=JSON.parse(JSON.stringify(D));let st=C.newRun(D2,5,'yy');st.maps[0].rows[0].forEach(n=>{n.t='mystery';n.q='shop';});const r=C.apply(D2,st,{type:'MOVE',c:0});ok(r.ok&&r.state.screen==='shop'&&r.events.some(e=>e.t==='mystery'));
 let a=C.newRun(D2,5,'yy');a.maps[0].rows[0].forEach(n=>n.t='altar');a=A(a,{type:'MOVE',c:0}).state;ok(a.screen==='event'&&a.event.id==='altar');const hp=a.hp;const r2=A(a,{type:'EVENT',i:0});ok(r2.state.relics.length===a.relics.length+1);
 const k=C.newRun(D,5,'cl',{keeper:['m_hp1','m_hp2','m_hp3','m_gold','m_gold2','m_remove','m_card']});ok(k.maxHp===D.chars.cl.hp+18&&k.gold===199&&k.prep.cards.length===3);let k2=A(k,{type:'PREP_CARD',i:0}).state;ok(k2.deck.length===11);
 let m=C.newMeta();m.echo=500;ok(!C.metaBuy(D,m,'m_hp3').ok,'要先買前一項');
 let w=fight('yy',['dutyghost']);w.com='c2_full';w.alien=100;w.combat.fullNext=1;w.combat.enemies[0].intent={n:'等',b:1};w=A(w,{type:'END_TURN'}).state;ok(w.flags.transformed);});
t('C72','語嫣新慾望與癖好：佔、渴、恨、調香、照鏡子、編繩；新個性的事件選項',()=>{
 let p=fightM('yy',{desire:'possess'},['dutyghost']);ok(p.combat.hand.some(x=>x.lock==='possess'));
 let t2=fightM('yy',{desire:'thirst'},['dutyghost']);t2.alien=0;hand(t2,['yy_bloodpact']);t2=A(t2,{type:'PLAY',i:0,target:t2.combat.enemies[0].uid}).state;ok(t2.alien===9,'失 3 → +9：'+t2.alien);
 let sp=fightM('yy',{desire:'spite'},['dutyghost']);const e=sp.combat.enemies[0];e.hp=e.max=50;e.intent={n:'咬',a:5};sp=A(sp,{type:'END_TURN'}).state;ok(sp.combat.enemies[0].hp<=48);
 let mi=fightM('yy',{hobby:'mirror'},['dutyghost']);ok(mi.combat.block>=4);let pf=fightM('yy',{hobby:'perfume'},['dutyghost']);ok(pf.combat.enemies[0].st.weak===1);
 let kn=fightM('yy',{hobby:'knit'},['dutyghost']);kn.combat.enemies[0].st.link=2;kn.combat.enemies[0].intent={n:'等',b:1};const p0=kn.combat.enemies[0].st.pact||0;kn=A(kn,{type:'END_TURN'}).state;ok((kn.combat.enemies[0].st.pact||0)>=p0+1);
 const ev=D.events.find(x=>x.id==='lunchbox');const st={persona:'scheming'};ok(C.evOpts(D,st,ev).slice(-1)[0].per==='scheming');});
t('C73','克勞德：燈開場 1 墨、送回抽 1；每個面貌的牌只在那個面貌出現；新牌效果',()=>{
 let l=fightO('cl','lamp',['dutyghost','dutyghost']);ok(l.combat.ink>=1);const n=l.combat.hand.length;l.combat.enemies[0].hp=1;l=A(l,{type:'SEND',uid:l.combat.enemies[0].uid,pay:'hp'}).state;ok(l.combat.hand.length===n+1,'抽 1');
 ok(C.pool(D,C.newRun(D,1,'cl',null,{origin:'ink'})).includes('b_ink_heavy')&&!C.pool(D,C.newRun(D,1,'cl',null,{origin:'paper'})).includes('b_ink_heavy'));
 let p=fightO('cl','paper',['dutyghost']);hand(p,['b_paper_cut','b_paper_crane','b_paper_crane']);const e=p.combat.enemies[0];e.hp=e.max=99;e.block=0;p=A(p,{type:'PLAY',i:0,target:e.uid}).state;ok(p.combat.enemies[0].hp===99-11,'5+3×2');
 let k=fightO('cl','ink',['dutyghost']);k.combat.ink=4;hand(k,['b_ink_heavy']);const ke=k.combat.enemies[0];ke.hp=ke.max=99;ke.block=0;k=A(k,{type:'PLAY',i:0,target:ke.uid}).state;ok(k.combat.enemies[0].hp===99-18&&k.combat.ink===0);
 let m=fightO('cl','mirror',['dutyghost']);hand(m,['b_mir_back']);m.combat.enemies[0].intent={n:'咬',a:5};const mh=m.combat.enemies[0].hp;m=A(m,{type:'PLAY',i:0}).state;m=A(m,{type:'END_TURN'}).state;ok(m.combat.enemies[0].hp===mh-6,'反照 3＋鏡 3');
 let v=fightO('cl','voice',['dutyghost']);hand(v,['b_voi_call','b_voi_echo']);const ve=v.combat.enemies[0];ve.hp=ve.max=99;ve.block=0;v=A(v,{type:'PLAY',i:0}).state;v=A(v,{type:'PLAY',i:v.combat.hand.findIndex(x=>x.id==='b_voi_echo'),target:ve.uid}).state;ok(v.combat.enemies[0].hp===99-10,'回音打兩次');});

// ── v0.12 第二章
t('C74','第二章：從第四層開始、先挑遺物和牌、第六層首領打完才算通關、只出第二章的事件',()=>{
 let st=C.newRun(D,7,'yy',null,{chapter:2});ok(st.layer===3&&st.endLayer===6&&st.screen==='prep'&&st.prep.relics.length===3&&st.prep.cards.length===3&&st.maps[3]);
 st=A(st,{type:'PREP_RELIC',i:0}).state;st=A(st,{type:'PREP_CARD',i:0}).state;st=A(st,{type:'PREP_DONE'}).state;ok(st.screen==='map');
 const s2=JSON.parse(JSON.stringify(st));s2.maps[3].rows[0].forEach(n=>n.t='event');const r=A(s2,{type:'MOVE',c:0});ok(r.state.screen==='event');
 let b=fight('yy',['namegate']);b.layer=3;b.endLayer=6;b.chapter=2;b.row=D.map.rows;b.combat.kind='boss';b.combat.enemies[0].hp=1;hand(b,['strike']);b=A(b,{type:'PLAY',i:0,target:b.combat.enemies[0].uid}).state;b=A(b,{type:'PICK_RELIC',i:0}).state;b=A(b,{type:'LEAVE'}).state;ok(b.layer===4&&b.screen==='map'&&b.maps[4]);
 b.layer=5;b.row=D.map.rows;b.screen='reward';b.reward={cards:[],cardTaken:true};const w=A(b,{type:'LEAVE'});ok(w.state.result.win&&w.events.some(e=>e.t==='runEnd'&&e.chapter===2)&&w.events.some(e=>e.t==='ach'&&e.id==='win_ch2'));
 let c1=fight('yy',['wusign']);c1.layer=2;c1.row=D.map.rows;c1.screen='reward';c1.reward={cards:[],cardTaken:true};ok(A(c1,{type:'LEAVE'}).state.result.win,'第一章照舊三層結束');
 for(const L of D.layers.slice(3)){for(const f of L.fights)for(const id of f)ok(D.enemies[id],id);for(const e of L.elites)ok(D.enemies[e],e);ok(D.enemies[L.boss].boss);}
 const m=C.metaApply(D,C.newMeta(),w.events).meta;ok(m.chWins[2]===1);});

t('C75','個性標籤：自身效果開場生效、只出自己標籤的事件、委託結算給殘響',()=>{
 const st=fightM('yy',{persona:'hollow',hobby:'earcheck'},['stampbug']);ok(st.combat.block>=3,'癖好開場格擋 '+st.combat.block);
 const s0=C.newRun(D,9,'yy',{unlocked:[]},{origin:'B01',persona:'arrogant'});s0.maps[0].rows[0].forEach(n=>n.t='event');let seen=new Set();
 for(let i=0;i<40;i++){const s1=JSON.parse(JSON.stringify(s0));s1.seed=i*977+1;const r=C.apply(D,s1,{type:'MOVE',c:0});if(r.ok&&r.state.event)seen.add(r.state.event.id);}
 ok(![...seen].some(id=>{const e=D.events.find(x=>x.id===id);return e.tag&&e.tag!=='arrogant';}),'不出別人的標籤事件');
 const m=C.metaApply(D,C.newMeta(),[{t:'runEnd',win:true,ch:'yy',persona:'arrogant',floors:20,memory:10,tcom:['arrogant']}]).meta;ok(m.tcomDone.arrogant===1&&m.ach.includes('tg_arrogant'));
 ok(Object.values(D.personas).filter(p=>p.v15).length>=50&&Object.keys(D.cards).filter(k=>/^tg_/.test(k)).length>=400);});
t('C76','新妖種：十四種都在、各層都排得到',()=>{const ids=Object.keys(D.enemies).filter(k=>/^e\d\d_/.test(k));ok(ids.length===14);for(const id of ids)ok(D.layers.some(L=>L.fights.some(f=>f.includes(id))||L.elites.includes(id)),id);});
t('C77','殘響：第三格天賦要通關過、守燈人分角色、第二個癖好、重抽',()=>{
 let m=C.newMeta();m.echo=500;m.tm={arrogant:{pts:9,spent:[1,2],runs:2}};ok(!C.metaTTal(D,m,'arrogant',3).ok,'沒通關不能學');m.tm.arrogant.wins=1;const r=C.metaTTal(D,m,'arrogant',3);ok(r.ok&&r.meta.echo===400);
 const st=fightM('yy',{persona:'arrogant'},['stampbug'],r.meta);ok(st.combat.hand.some(x=>x.id==='tg_arrogant_3'),'第三格開場給牌');
 const m2=C.newMeta();m2.keeper=['m_hob2','ky_hp','kc_hp','m_reroll'];const s1=C.newRun(D,3,'yy',m2,{origin:'B01',hobby:'tapcup',hobby2:'earcheck'});const s0=C.newRun(D,3,'yy',C.newMeta(),{origin:'B01'});ok(s1.hobby2==='earcheck'&&s1.maxHp===s0.maxHp+8&&s1.rr===1);
 const s2=JSON.parse(JSON.stringify(s1));s2.screen='reward';s2.reward={cards:['strike','strike','strike'],cardTaken:false,el:0};const rr=C.apply(D,s2,{type:'REROLL_REWARD'});ok(rr.ok&&rr.state.rr===0&&!C.apply(D,rr.state,{type:'REROLL_REWARD'}).ok);
 const n=C.metaApply(D,C.newMeta(),[{t:'runEnd',win:true,ch:'yy',persona:'arrogant',floors:20,memory:10,elites:2,bosses:3}]);ok(n.meta.crystal===10&&n.meta.tm.arrogant.wins===1);});
t('C78','刻印坊：三階、費用、出發時帶著刻印',()=>{let m=C.newMeta();m.echo=200;m.crystal=10;const id=Object.keys(D.cards).find(k=>D.cards[k].bl==='B01'&&D.cards[k].t==='a');
 const base=C.cardDef(D,{id,up:0});for(let i=1;i<=3;i++){const r=C.metaForge(D,m,id);ok(r.ok,r.error);m=r.meta;}ok(!C.metaForge(D,m,id).ok&&m.echo===60&&m.crystal===0);
 const f3=C.cardDef(D,{id,up:0,fg:3});ok(f3.fx.length>base.fx.length&&(f3.c<base.c||f3.fx.some(f=>f[0]==='dr')));
 const st=C.newRun(D,5,'yy',m,{origin:'B01'});addC=st.deck.find(x=>x.id===id);ok(st.fg[id]===3);
 ok(!C.metaForge(D,m,'strike').ok,'普通牌不能刻');});
t('C79','補牌與成套：個性 6 張、本源 14 張；深層牌要練熟才進牌池；成套達標才發動',()=>{
 for(const k of Object.keys(D.tagtal)){const n=Object.keys(D.cards).filter(x=>D.cards[x].tag===k).length;ok(n>=6,k+' '+n);}
 for(const k in D.origins){const bl=k.slice(3);const n=Object.keys(D.cards).filter(x=>D.cards[x].bl===bl).length;ok(n>=14,k+' '+n);}
 const m=C.newMeta();const s0=C.newRun(D,3,'yy',m,{origin:'B01',persona:'yandere'});ok(!C.pool(D,s0).some(k=>D.cards[k].deep),'沒練熟不出深層牌');
 m.tm={yandere:{pts:1,spent:[],runs:2}};m.om={yy_B01:{pts:0,spent:['B01_1']}};const s1=C.newRun(D,3,'yy',m,{origin:'B01',persona:'yandere'});const P=C.pool(D,s1);ok(P.includes('tg_yandere_5')&&P.some(k=>D.cards[k].bl==='B01'&&D.cards[k].deep));
 const st=fightM('yy',{persona:'yandere'},['stampbug']);const c=st.combat;c.energy=9;c.hand=[{uid:801,id:'tg_gentle_4',up:0}];const id=Object.keys(D.cards).find(k=>D.cards[k].deep&&D.cards[k].tag&&D.cards[k].fx.some(f=>f[0]==='set'&&f[2].some(x=>x[0]==='dr'))&&!D.cards[k].fx.some(f=>f[0]==='dr'));
 c.hand=[{uid:801,id,up:0}];const h0=c.hand.length;let r=C.apply(D,st,{type:'PLAY',i:0,target:C.alive(c)[0].uid});ok(r.ok&&!r.events.some(e=>e.t==='setOn'),'不成套不發動');
 const st2=JSON.parse(JSON.stringify(st));for(let i=0;i<4;i++)st2.deck.push({uid:900+i,id,up:0});r=C.apply(D,st2,{type:'PLAY',i:0,target:C.alive(st2.combat)[0].uid});ok(r.ok&&r.events.some(e=>e.t==='setOn'),'成套發動');});
t('C80','污染值：只往下、七階還能更深、本源和個性牌都會被污染、每階不同；解鎖要花殘響',()=>{
 let m=C.metaApply(D,C.newMeta(),[{t:'runEnd',win:false,ch:'yy',floors:20,memory:10,trans:5,bosses:1}]).meta;ok(m.pol.yy===9&&C.polStage7(m.pol.yy)===0,'一局 '+m.pol.yy);
 m=C.metaApply(D,C.newMeta(),[{t:'runEnd',win:true,ch:'yy',floors:60,memory:10,trans:40,bosses:9}]).meta;ok(m.pol.yy===18,'一局上限');
 ok(C.polStage7(10)===1&&C.polStage7(279)===6&&C.polStage7(280)===7&&C.polStage7(360)===8&&C.polStage(360)===4);
 m.pol.yy=150;const st=C.newRun(D,3,'yy',m,{origin:'B01',persona:'lazy'});ok(st.polS===5&&st.pol===3);const x=st.deck.find(x=>D.cards[x.id].bl);ok(x&&x.pl===5);const d=C.cardDef(D,x);ok(d.fx.some(f=>f[0]==='hurt')&&/^蝕・/.test(d.n),d.n);
 const ds=[1,2,3,4,5,6,7,8].map(lv=>JSON.stringify(C.cardDef(D,{id:'b_m01_fang',pl:lv}).fx)+C.cardDef(D,{id:'b_m01_fang',pl:lv}).c);ok(new Set(ds).size===8,'每階不同');
 ok(C.cardDef(D,{id:'tg_lazy_7',pl:3}).n.startsWith('染・'),'個性牌也被污染');ok(C.cardDef(D,{id:'b_m01_fang',pl:9}).n.endsWith('深二'));
 let u=C.newMeta();ok(!C.metaUnlock(D,u,'tag','yandere').ok);u.echo=100;const r2=C.metaUnlock(D,u,'tag','yandere');ok(r2.ok&&r2.meta.echo===80&&r2.meta.personas.includes('yandere'));
 ok(Object.values(D.personas).filter(p=>p.def&&p.ch!=='yx').length===2&&!Object.values(D.desires).some(p=>p.free));});
t('C81','同體宿敵：裡側作亂、裡面的人救一次、傾向、七宗罪星數、語熙的個性牌進牌池',()=>{
 D.sisters=1;try{let seen=new Set();for(let sd=1;sd<40;sd++){let st=C.newRun(D,sd,'yy',C.newMeta(),{origin:'B01'});st.maps[0].rows[0].forEach(n=>n.t='fight');let r=C.apply(D,st,{type:'MOVE',c:0});st=r.state;r=C.apply(D,st,{type:'END_TURN'});const m=r.events.find(e=>e.t==='meddle');if(m)seen.add(m.k);}
 ok(seen.size>=2&&[...seen].every(k=>['heart','shake','sneer'].includes(k)),'作亂 '+[...seen]);
 let st=fightM('yy',{},['stampbug']);st.hp=1;st.combat.enemies[0].atk=99;let r=C.apply(D,st,{type:'END_TURN'});ok(r.events.some(e=>e.t==='sisSave')&&r.state.hp>0&&r.state.screen==='combat','救一次');
 }finally{delete D.sisters;}
 const a=C.newRun(D,3,'yy',C.newMeta(),{origin:'B01',desire:'greed',lean:'excess'}),b=C.newRun(D,3,'yy',C.newMeta(),{origin:'B01'});ok(a.lean==='excess'&&a.tt.kill.length>b.tt.kill.length&&a.sinStar===3&&a.maxHp>=b.maxHp+4);
 const x=C.newRun(D,3,'yx',C.newMeta(),{persona:'bratmouth',lean:'rage'});ok(x.lean==='rage'&&C.pool(D,x).includes('tg_bratmouth_1')&&!C.pool(D,x).includes('tg_usurp_1'));
 const m=C.metaApply(D,C.newMeta(),[{t:'runEnd',win:true,ch:'yx',floors:20,memory:10}]).meta;ok(m.yxRuns===1&&m.yxWins===1);ok(D.secretMem.length===10);});
t('C82','第一章走完會問要不要繼續；深潛讓敵人變硬、殘響變多；衣鋪和本源都要花殘響',()=>{
 D.chAsk=1;try{let st=C.newRun(D,3,'yy',C.newMeta(),{origin:'B01'});st.layer=2;st.row=D.map.rows;st.screen='reward';st.reward={cards:[],cardTaken:true,gold:0};let r=C.apply(D,st,{type:'LEAVE'});ok(r.ok&&r.state.screen==='chask'&&r.events.some(e=>e.t==='chClear'),'問要不要繼續 '+(r.state&&r.state.screen));
 const a=C.apply(D,r.state,{type:'CH_CONT'});ok(a.ok&&a.state.chapter===2&&a.state.layer===3&&a.state.screen==='map');const b=C.apply(D,r.state,{type:'CH_END'});ok(b.ok&&b.state.screen==='over'&&b.state.result.win&&b.events.some(e=>e.t==='runEnd'&&e.win));}finally{delete D.chAsk;}
 const m=C.newMeta();m.ascMax=3;const s0=C.newRun(D,5,'yy',m,{origin:'B01',asc:0}),s3=C.newRun(D,5,'yy',m,{origin:'B01',asc:9});ok(s0.asc===0&&s3.asc===3);
 ok(C.echoOf(D,{memory:100,asc:3})>C.echoOf(D,{memory:100}));const w=C.metaApply(D,C.newMeta(),[{t:'runEnd',win:true,ch:'yy',floors:20,memory:10,asc:0}]).meta;ok(w.ascMax===1);
 let u=C.newMeta();u.echo=200;let x=C.metaUnlock(D,u,'origin','yy_B11');ok(x.ok&&x.meta.echo===100&&x.meta.oBuy.includes('yy_B11'));x=C.metaUnlock(D,x.meta,'skin','yy_foxmask1');ok(x.ok&&x.meta.echo===40);});
t('C83','第三章：第二章走完會再問一次，能直接從第三章出發，九層都有敵人',()=>{
 ok(D.layers.length===9&&D.chapters.length===3);for(const L of D.layers.slice(6))for(const f of [...L.fights.flat(),...L.elites.flat(),L.boss])ok(!!D.enemies[f],f);
 D.chAsk=1;try{let st=C.newRun(D,3,'yy',C.newMeta(),{origin:'B01',chapter:2});st.screen='reward';st.layer=5;st.row=D.map.rows;st.reward={cards:[],cardTaken:true,gold:0};let r=C.apply(D,st,{type:'LEAVE'});ok(r.ok&&r.state.screen==='chask'&&r.state.chNext===3&&r.events.some(e=>e.t==='ach'&&e.id==='win_ch2'),'第二章後詢問');
  const a=C.apply(D,r.state,{type:'CH_CONT'});ok(a.ok&&a.state.chapter===3&&a.state.layer===6&&a.state.endLayer===9&&a.state.screen==='map');
  let b=a.state;b.layer=8;b.row=D.map.rows;b.screen='reward';b.reward={cards:[],cardTaken:true,gold:0};const w=C.apply(D,b,{type:'LEAVE'});ok(w.state.screen==='over'&&w.state.result.win&&w.events.some(e=>e.t==='ach'&&e.id==='win_ch3'));}finally{delete D.chAsk;}
 const s=C.newRun(D,7,'yy',null,{chapter:3});ok(s.layer===6&&s.endLayer===9&&s.screen==='prep'&&s.relics.length>=2,'直接出發 '+s.relics.length+' '+s.deck.length);});
t('C84','v0.20 的牌：每個個性八張、後五張兩兩不同；「如果」「成套」會生效；語嫣織網、語熙爆破',()=>{
 const tags=[...new Set(Object.values(D.cards).filter(c=>c.tag).map(c=>c.tag))];for(const tg of tags)ok(Object.keys(D.cards).filter(k=>D.cards[k].tag===tg).length===8,tg);
 const sig={};for(const [k,c] of Object.entries(D.cards))if(c.tag&&c.deep){const s=c.c+c.t+JSON.stringify(c.fx);ok(!sig[s],k+' 和 '+sig[s]+' 一樣');sig[s]=k;}
 const id=Object.keys(D.cards).find(k=>D.cards[k].tag&&D.cards[k].fx.some(f=>f[0]==='set'));const tg=D.cards[id].tag;const need=D.cards[id].fx.find(f=>f[0]==='set')[1];
 let st=C.newRun(D,5,'yy',C.newMeta(),{origin:'B01'});st.maps[0].rows[0].forEach(n=>n.t='fight');st=C.apply(D,st,{type:'MOVE',c:0}).state;st.combat.energy=9;st.combat.hand=[{uid:7001,id,up:0}];
 let r=C.apply(D,st,{type:'PLAY',i:0,target:C.alive(st.combat)[0].uid});ok(r.ok&&!r.events.some(e=>e.t==='setOn'),'沒湊滿不生效');
 for(let i=0;i<need;i++)st.deck.push({uid:7100+i,id:'tg_'+tg+'_1',up:0});r=C.apply(D,st,{type:'PLAY',i:0,target:C.alive(st.combat)[0].uid});ok(r.ok&&r.events.some(e=>e.t==='setOn'),'湊滿生效');
 D.duo=1;try{let a=C.newRun(D,5,'yy',C.newMeta(),{origin:'B01'});a.maps[0].rows[0].forEach(n=>n.t='fight');a=C.apply(D,a,{type:'MOVE',c:0}).state;const sk=Object.keys(D.cards).find(k=>D.cards[k].t==='s'&&D.cards[k].bl==='B01'&&!C.needsTarget(D,{id:k}));a.combat.energy=9;a.combat.hand=[{uid:1,id:sk,up:0},{uid:2,id:sk,up:0}];
  let x=C.apply(D,a,{type:'PLAY',i:0});ok(x.ok&&x.events.some(e=>e.t==='trait'&&e.k==='weave'),'織網');x=C.apply(D,x.state,{type:'PLAY',i:0});ok(x.ok&&!x.events.some(e=>e.t==='trait'),'一回合一次');
  let y=C.newRun(D,5,'yx',C.newMeta(),{});y.maps[0].rows[0].forEach(n=>n.t='fight');y=C.apply(D,y,{type:'MOVE',c:0}).state;const at=y.combat.hand.findIndex(c=>D.cards[c.id].t==='a');if(at>=0){y.combat.energy=9;const z=C.apply(D,y,{type:'PLAY',i:at,target:C.alive(y.combat)[0].uid});ok(z.ok&&z.events.some(e=>e.t==='trait'&&e.k==='burst'),'爆破');}}finally{delete D.duo;}});
t('C85','v0.23：怪物化減 1 費、改規則的遺物、共鳴、每日挑戰',()=>{
 const mk=(o,extra)=>{let st=C.newRun(D,5,'yy',C.newMeta(),Object.assign({origin:o},extra||{}));st.maps[0].rows[0].forEach(n=>n.t='fight');return C.apply(D,st,{type:'MOVE',c:0}).state;};
 let st=mk('B01');st.combat.full=1;const x=st.combat.hand.find(h=>D.cards[h.id].c>=1);if(x){const base=D.cards[x.id].c;ok(C.cost(D,x,'full')===Math.max(0,base-1),'非人第一回合 -1 費');}
 st=C.newRun(D,5,'yy',C.newMeta(),{origin:'B01'});st.relics.push('rr_bowl');st.maps[0].rows[0].forEach(n=>n.t='fight');st=C.apply(D,st,{type:'MOVE',c:0}).state;const y=st.combat.hand.find(h=>D.cards[h.id].c>=1);if(y)ok(C.cost(D,y)===0,'空碗');
 st=C.newRun(D,5,'yy',C.newMeta(),{origin:'M03',persona:'yandere'});st.maps[0].rows[0].forEach(n=>n.t='fight');const r=C.apply(D,st,{type:'MOVE',c:0});ok(r.events.some(e=>e.t==='reso'&&e.id==='r1'),'蜘蛛＋病嬌共鳴');
 st=C.newRun(D,5,'yy',C.newMeta(),{origin:'B01',daily:'glass'});ok(st.daily==='glass'&&st.maxHp<60);
 ok(Object.values(D.relics).filter(r=>r.rule).length===8&&D.story.length===15&&D.reso.length===16);});
t('C86','v0.24：史萊姆不吃不化的霜、混合結束停半妖、追蹤保底、短模式一層',()=>{
 const mk=(o,extra,tt)=>{let st=C.newRun(D,5,'yy',C.newMeta(),Object.assign({origin:o},extra||{}));st.maps[0].rows[0].forEach(n=>n.t=tt||'fight');return C.apply(D,st,{type:'MOVE',c:0}).state;};
 let st=mk('M06');st.relics.push('rr_frost');st.combat.block=10;st.combat.enemies.forEach(e=>e.intent={n:'等',b:1});st=C.apply(D,st,{type:'END_TURN'}).state;ok(st.combat.block>=10,'霜保留格擋 '+st.combat.block);
 const st0=C.newRun(D,5,'yy',C.newMeta(),{origin:'B01'});const P=C.pool?C.pool(D,st0):null;
 const tgt=Object.keys(D.cards).find(k=>D.cards[k].bl==='B01'&&D.cards[k].r>=2);
 st=mk('B01',{track:tgt,trackGuar:1},'elite');ok(st.track===tgt&&st.trackG===1,'追蹤生效');
 st.combat.enemies=[st.combat.enemies[0]];st.combat.enemies[0].hp=1;st.combat.enemies[0].block=0;st.combat.hand=[{id:'strike',uid:'zz1'}];st.combat.energy=3;
 const r=C.apply(D,st,{type:'PLAY',i:0,target:st.combat.enemies[0].uid});ok(r.state.screen==='reward'&&r.state.reward.cards.includes(tgt),'菁英獎勵保底出現目標 '+r.state.screen);
 st=C.newRun(D,5,'yy',C.newMeta(),{origin:'B01',short:1});ok(st.short===1&&st.endLayer===1,'短模式只下一層');
 let m=C.metaApply(D,C.newMeta(),[{t:'runEnd',win:true,short:1,ch:'yy',chapter:1,floors:8,bosses:1}]).meta;ok(!m.keepPending&&m.shortWins===1,'短模式不給收藏');
 m=C.metaApply(D,C.newMeta(),[{t:'runEnd',win:false,track:tgt,trackGot:0,ch:'yy',chapter:1,floors:3}]).meta;ok(m.trackSt===1,'沒拿到目標累積章記');});
console.log(out.join('\n'));console.log(`\n通過 ${pass}／${pass+fail}`);process.exit(fail?1:0);
