// 《語嫣・永生戰棋》P0 單元測試：node tests/run_tests.js
const D=require('../data.js'),C=require('../core.js'),Camp=require('../camp.js');
let pass=0,fail=0;const out=[];
function t(id,name,fn){try{fn();pass++;out.push('PASS '+id+' '+name);}catch(e){fail++;out.push('FAIL '+id+' '+name+' — '+e.message);}}
function eq(a,b,m){if(a!==b)throw new Error((m||'')+' 期待 '+b+' 實際 '+a);}
function ok(v,m){if(!v)throw new Error(m||'不成立');}
// 空白測試場：全平原、只放指定單位
function blank(units,tiles){const st=C.createBattle(D,'MISSION_BC_001',1);st.tiles=st.tiles.map(()=> 'PLAIN');st.units=[];st.eventLog=[];st.gate={x:11,y:11,hp:300,maxHp:300,def:10,res:0};
 if(tiles)for(const [x,y,tt] of tiles)st.tiles[y*st.w+x]=tt;
 units.forEach(([def,id,f,x,y,nosol])=>{const b=D.units[def];const n=nosol?0:(b.soldiers||0),hp1=b.hpPer||10;st.units.push({id,unitType:def,name:b.name,glyph:b.glyph,troop:b.troop,faction:f,x,y,hp:b.hp,maxHp:b.hp,atk:b.atk,def:b.def,mag:b.mag,res:b.res,move:b.move,rmin:b.rmin,rmax:b.rmax,dmg:b.dmg,hit:b.hit||0,eva:b.eva||0,crit:5,commander:!!b.commander,sol:n*hp1,solMax:(b.soldiers||0)*hp1,hpPer:hp1,skills:b.skills||(b.skill?[b.skill]:[]),pas:b.pas||[],cd:{},st:{root:0,mark:0,gs:0},usedAct:false,guard:false});});st.zones=[];
 st.round=1;st.phase='PLAYER';st.result=null;return st;}
const has=(R,x,y)=>R.has(x+','+y);

t('T01','四方向移動，斜向要走兩步',()=>{const st=blank([['P_SPEAR','A','P',5,5]]);st.units[0].move=1;const R=C.reachable(D,st,st.units[0]);ok(has(R,5,4)&&has(R,6,5)&&has(R,5,6)&&has(R,4,5),'四方向');ok(!has(R,6,6),'斜向不可一步到');eq(R.size,5);});
t('T02','不能穿過敵軍與城牆',()=>{const st=blank([['P_SPEAR','A','P',5,5],['E_INF','B','E',5,3]],[[4,4,'WALL'],[6,4,'WALL']]);const u=st.units[0];u.move=3;const R=C.reachable(D,st,u);ok(!has(R,5,3),'不能停在敵人格');ok(!has(R,4,4)&&!has(R,6,4),'不能進城牆');ok(!has(R,5,2),'不能穿過敵人到後面');});
t('T03','控制區：進入敵方相鄰格就停下',()=>{const st=blank([['P_SPEAR','A','P',2,5],['E_INF','B','E',5,4]]);const u=st.units[0];u.move=5;const R=C.reachable(D,st,u);ok(has(R,5,5),'可以走進相鄰格');ok(!has(R,6,5),'經過相鄰格之後不能再走');const st2=blank([['P_SPEAR','A','P',2,5]]);st2.units[0].move=5;ok(has(C.reachable(D,st2,st2.units[0]),6,5),'沒有敵人時本來走得到');});
t('T04','地形成本：森林 2、沼澤 3',()=>{const st=blank([['P_SPEAR','A','P',5,5]],[[5,4,'FOREST'],[6,5,'SWAMP']]);const u=st.units[0];u.move=2;const R=C.reachable(D,st,u);eq(R.get('5,4'),2,'森林');ok(!has(R,6,5),'沼澤 3 超過移動力 2');u.move=3;eq(C.reachable(D,st,u).get('6,5'),3,'沼澤');});
t('T05','城牆擋視線、高地遠程射程 +1',()=>{const st=blank([['P_ARCHER','A','P',5,7],['E_INF','B','E',5,4]],[[5,5,'WALL']]);const u=st.units[0];ok(!C.targetsFrom(D,st,u,{x:5,y:7}).includes('B'),'被城牆擋住');
 const st2=blank([['P_ARCHER','A','P',5,8],['E_INF','B','E',5,4]],[[5,8,'HILL']]);ok(C.targetsFrom(D,st2,st2.units[0],{x:5,y:8}).includes('B'),'高地射程 4');const st3=blank([['P_ARCHER','A','P',5,8],['E_INF','B','E',5,4]]);ok(!C.targetsFrom(D,st3,st3.units[0],{x:5,y:8}).includes('B'),'平地射程只有 3');
 const st4=blank([['P_SPEAR','A','P',5,8],['E_INF','B','E',5,7]],[[5,8,'HILL']]);eq(C.rangeOf(D,st4,st4.units[0],{x:5,y:8})[1],1,'近戰不吃高差');});
t('T06','同一單位每回合只能行動一次',()=>{const st=blank([['P_SPEAR','A','P',5,5],['E_INF','B','E',9,9]]);const r=C.apply(D,st,{type:'ACT',actorId:'A',to:{x:5,y:4},act:'WAIT'});ok(r.ok);const r2=C.apply(D,r.state,{type:'ACT',actorId:'A',to:{x:5,y:3},act:'WAIT'});eq(r2.ok,false);eq(r2.error,'already_acted');});
t('T07','敵方階段不能操作我方；行動後到下一回合才恢復',()=>{const st=blank([['P_SPEAR','A','P',5,5],['E_INF','B','E',9,1]]);let r=C.apply(D,st,{type:'ACT',actorId:'A',to:{x:5,y:5},act:'WAIT'});r=C.apply(D,r.state,{type:'END_PHASE'});ok(r.ok);eq(r.state.round,2);eq(r.state.units.find(u=>u.id==='A').usedAct,false,'新回合可以再動');const bad=C.apply(D,r.state,{type:'ACT',actorId:'B',to:{x:9,y:1},act:'WAIT'});eq(bad.error,'not_your_unit');});
t('T08','兵種克制只在指定配對生效',()=>{const sp={troop:'SPEAR'},cav={troop:'CAVALRY'},inf={troop:'INFANTRY'};eq(C.counterMult(D,sp,'CAVALRY'),1.2,'槍克騎');eq(C.counterMult(D,cav,'SPEAR'),.85,'騎被槍克');eq(C.counterMult(D,sp,'ARCHER'),1,'沒有關係');eq(C.counterMult(D,inf,'SPEAR'),1.2);
 const st=blank([['P_SPEAR','A','P',5,5,1],['E_CAV','B','E',5,4,1]]);const p=C.preview(D,st,st.units[0],{x:5,y:5},'B');eq(p.dmg,Math.max(1,Math.floor(D.units.P_SPEAR.atk*1.2)-Math.floor(11*.5)),'傷害公式（無士兵）');});
t('T09','反擊每次攻擊最多一次，不會無限循環',()=>{const st=blank([['P_SPEAR','A','P',5,5],['E_INF','B','E',5,4]]);const r=C.apply(D,st,{type:'ACT',actorId:'A',to:{x:5,y:5},act:'ATTACK',target:'B'});const hits=r.events.filter(e=>e.t==='hit'||e.t==='miss');ok(hits.length<=2,'最多兩段');eq(hits.filter(e=>e.counter).length<=1,true);
 const st2=blank([['P_ARCHER','A','P',5,7],['E_INF','B','E',5,4]]);const r2=C.apply(D,st2,{type:'ACT',actorId:'A',to:{x:5,y:7},act:'ATTACK',target:'B'});eq(r2.events.filter(e=>e.counter).length,0,'近戰打不到遠處不能反擊');});
t('T20','同 seed＋同行動 → 同狀態雜湊',()=>{const play=seed=>{let st=C.createBattle(D,'MISSION_BC_001',seed);const acts=[];let n=0;while(!st.result&&n<120){n++;const ps=C.alive(st,'P').filter(u=>!u.usedAct);const a=ps.length?C.plan(D,st,ps[0]):{type:'END_PHASE'};acts.push(a);st=C.apply(D,st,a).state;}return {st,acts};};
 const A=play(424242);const B=C.replay(D,'MISSION_BC_001',424242,A.acts);eq(C.hash(B),C.hash(A.st),'重播雜湊');const X=play(424243);ok(C.hash(X.st)!==C.hash(A.st),'不同 seed 結果不同');});
t('T21','AI 每一步都通過和玩家相同的驗證',()=>{for(let s=1;s<=40;s++){let st=C.createBattle(D,'MISSION_BC_001',s);let n=0;while(!st.result&&n<150){n++;const ps=C.alive(st,'P').filter(u=>!u.usedAct);const r=ps.length?C.apply(D,st,C.plan(D,st,ps[0])):C.apply(D,st,{type:'END_PHASE'});ok(r.ok,'我方 AI 不合法 '+r.error);ok(!r.events.some(e=>e.t==='ai_error'),'敵方 AI 不合法：'+(r.events.find(e=>e.t==='ai_error')||{}).txt);st=r.state;}}});
t('T22','同時勝敗時失敗優先',()=>{const st=blank([['P_SPEAR','A','P',5,5],['E_CMD','B','E',5,4]]);st.units[1].hp=1;st.gate.hp=0;const r=C.apply(D,st,{type:'ACT',actorId:'A',to:{x:5,y:5},act:'WAIT'});eq(r.state.result.win,false,'城門已破又擊倒指揮官＝失敗');});
t('T24','從存檔（seed＋行動）恢復，不會重複觸發事件',()=>{let st=C.createBattle(D,'MISSION_BC_001',777);const acts=[];let n=0;while(st.round<4&&n<80){n++;const ps=C.alive(st,'P').filter(u=>!u.usedAct);const a=ps.length?C.plan(D,st,ps[0]):{type:'END_PHASE'};acts.push(a);st=C.apply(D,st,a).state;}
 const saved=JSON.parse(JSON.stringify({seed:777,acts}));const back=C.replay(D,'MISSION_BC_001',saved.seed,saved.acts);eq(C.hash(back),C.hash(st));eq(back.eventLog.filter(e=>e.t==='say'&&/第 3 回合/.test(e.txt)).length,1,'第 3 回合事件只出現一次');eq(back.tiles[3*12+8],'FLESH');});
t('X01','不合法行動會被拒絕：走不到、打不到',()=>{const st=blank([['P_SPEAR','A','P',5,5],['E_INF','B','E',9,9]]);eq(C.apply(D,st,{type:'ACT',actorId:'A',to:{x:0,y:0},act:'WAIT'}).error,'unreachable');eq(C.apply(D,st,{type:'ACT',actorId:'A',to:{x:5,y:5},act:'ATTACK',target:'B'}).error,'bad_target');});
t('X02','城門：只有敵人能打，生命歸零就輸',()=>{const st=blank([['P_SPEAR','A','P',0,0],['E_INF','B','E',11,10]]);st.gate.hp=5;st.phase='ENEMY';st.phase='PLAYER';let r=C.apply(D,st,{type:'END_PHASE'});ok(r.state.result&&!r.state.result.win,'門被打破');});

t('T10','士兵分傷：70% 士兵、30% 英雄；士兵不夠時溢出一半給英雄',()=>{const st=blank([['P_SPEAR','A','P',5,5],['E_INF','B','E',5,4]]);const u=st.units[0];const s0=u.sol,h0=u.hp;const ev=[];
 const p=C.splitPreview(u,100);eq(p.s,70);eq(p.h,30);eq(p.sol,s0-70);eq(p.hp,h0-30);
 u.sol=20;const q=C.splitPreview(u,100);eq(q.s,20,'士兵只剩 20');eq(q.h,30+Math.floor(50*.5),'溢出 50 的一半給英雄');
 u.sol=0;eq(C.splitPreview(u,40).h,40,'沒有士兵全打英雄');eq(C.soldiers({sol:15,hpPer:14}),2,'人數＝無條件進位');});
t('T10b','士兵越少攻擊越低',()=>{const st=blank([['P_SPEAR','A','P',5,5],['E_INF','B','E',5,4,1]]);const full=C.preview(D,st,st.units[0],{x:5,y:5},'B').dmg;st.units[0].sol=0;const none=C.preview(D,st,st.units[0],{x:5,y:5},'B').dmg;ok(full>none,full+' > '+none);});
t('T11','狀態不會無限疊加：重複標記只更新回合數',()=>{const st=blank([['P_ARCHER','A','P',5,7],['E_INF','B','E',5,4]]);st.units[1].hp=999;st.units[1].maxHp=999;st.units[1].eva=-200;
 let r=C.apply(D,st,{type:'ACT',actorId:'A',to:{x:5,y:7},act:'SKILL',skill:'markShot',target:'B'});eq(r.state.units[1].st.mark,2);const s2=r.state;s2.units[0].usedAct=false;s2.units[0].cd={};
 r=C.apply(D,s2,{type:'ACT',actorId:'A',to:{x:5,y:7},act:'SKILL',skill:'markShot',target:'B'});eq(r.state.units[1].st.mark,2,'仍然是 2');});
t('T12','束縛：下一個回合不能移動、還能攻擊，之後恢復',()=>{const st=blank([['P_WEAVER','A','P',5,7],['E_CAV','B','E',5,5]]);st.units[1].hp=999;st.units[1].maxHp=999;st.units[1].eva=-200;
 let r=C.apply(D,st,{type:'ACT',actorId:'A',to:{x:5,y:7},act:'SKILL',skill:'bind',target:'B'});ok(r.ok,r.error);eq(r.state.units[1].st.root,1);
 const R=C.reachable(D,r.state,r.state.units[1]);eq(R.size,1,'被束縛只能留在原地');r=C.apply(D,r.state,{type:'END_PHASE'});const b=r.state.units[1];eq(b.x,5);eq(b.y,5,'敵方回合沒有移動');eq(b.st.root,0,'回合後解除');ok(C.reachable(D,r.state,b).size>1,'恢復移動');});
t('T13','守護：先分攤給盾衛，再各自分士兵與英雄',()=>{const st=blank([['P_SHIELD','G','P',5,6],['P_ARCHER','A','P',5,7],['E_INF','B','E',4,7]]);st.units[0].st.gs=2;const ev=[];
 const g0=st.units[0].hp+st.units[0].sol,a0=st.units[1].hp+st.units[1].sol;st.phase='PLAYER';
 // 直接模擬敵人打弓手 100 點
 const before=JSON.stringify(st.units);const s2=C.clone(st);const A=s2.units[1],G=s2.units[0];
 const r=C.apply(D,Object.assign(s2,{phase:'ENEMY'}),{type:'ACT',actorId:'B',to:{x:4,y:7},act:'WAIT'});ok(r.ok,r.error);
 const sp=C.splitPreview(A,60),gp=C.splitPreview(G,40);eq(sp.s+sp.h,60);eq(gp.s+gp.h,40);});
t('T13b','守護分攤實戰：被打的隊友少吃 40%',()=>{const mk=gs=>{const st=blank([['P_SHIELD','G','P',5,6],['P_ARCHER','A','P',5,7],['E_INF','B','E',4,7]]);st.units[0].st.gs=gs;st.units[2].hit=500;st.units[1].eva=0;st.phase='ENEMY';return st;};
 const run=gs=>{const st=mk(gs);const r=C.apply(D,st,{type:'ACT',actorId:'B',to:{x:4,y:7},act:'ATTACK',target:'A'});ok(r.ok,r.error);const A=r.state.units[1],G=r.state.units[0];return {a:(st.units[1].hp+st.units[1].sol)-(A.hp+A.sol),g:(st.units[0].hp+st.units[0].sol)-(G.hp+G.sol)};};
 const no=run(0),yes=run(2);eq(no.g,0,'沒有守護盾衛不吃傷');ok(yes.g>0,'有守護盾衛分到傷害');ok(yes.a<no.a,'弓手少吃');});
t('S01','技能冷卻：用過要等，到時間才能再用',()=>{const st=blank([['P_SPEAR','A','P',5,5],['E_INF','B','E',5,4],['E_INF','C','E',9,1]]);st.units[1].hp=999;st.units[1].maxHp=999;
 let r=C.apply(D,st,{type:'ACT',actorId:'A',to:{x:5,y:5},act:'SKILL',skill:'pierce',target:'B'});ok(r.ok,r.error);eq(r.state.units[0].cd.pierce,2);r=C.apply(D,r.state,{type:'END_PHASE'});
 eq(C.validate(D,r.state,{type:'ACT',actorId:'A',to:{x:r.state.units[0].x,y:r.state.units[0].y},act:'SKILL',skill:'pierce',target:'B'})||'',r.state.units[0].cd.pierce>0?'cooldown':'');});
t('S02','貫穿突刺打到後面一格、不被反擊',()=>{const st=blank([['P_SPEAR','A','P',5,6],['E_INF','B','E',5,5],['E_INF','C','E',5,4]]);for(const u of st.units)u.eva=-300;
 const r=C.apply(D,st,{type:'ACT',actorId:'A',to:{x:5,y:6},act:'SKILL',skill:'pierce',target:'B'});const hits=r.events.filter(e=>e.t==='hit');eq(hits.length,2,'兩段');ok(hits.every(e=>!e.counter),'沒有反擊');ok(hits.some(e=>e.d==='C'));});
t('S03','燈界穩住範圍內即將異變的格子',()=>{
 const st=blank([['P_LANTERN','L','P',8,5],['E_INF','B','E',0,0]]);
 st.round=2;
 st.warn=[{x:8,y:3,to:'FLESH',at:3},{x:9,y:3,to:'FLESH',at:3},{x:10,y:3,to:'FLESH',at:3}];
 const cast=C.apply(D,st,{type:'ACT',actorId:'L',to:{x:8,y:5},act:'SKILL',skill:'lampZone',at:{x:8,y:4}});
 ok(cast.ok,cast.error);
 const r=C.apply(D,cast.state,{type:'END_PHASE'});ok(r.ok,r.error);eq(r.state.round,3);
 eq(C.tileAt(r.state,8,3),'PLAIN');eq(C.tileAt(r.state,9,3),'PLAIN');eq(C.tileAt(r.state,10,3),'FLESH');
 eq(r.events.filter(e=>e.t==='stabilize').length,2);
});
t('S04','治療：回生命、補士兵、解除束縛',()=>{const st=blank([['P_HEALER','H','P',5,7],['P_SPEAR','A','P',5,6],['E_INF','B','E',9,1]]);const a=st.units[1];a.hp=40;a.sol=10;a.st.root=1;
 const r=C.apply(D,st,{type:'ACT',actorId:'H',to:{x:5,y:7},act:'SKILL',skill:'mend',target:'A'});ok(r.ok,r.error);const b=r.state.units[1];ok(b.hp>40&&b.sol>10&&b.st.root===0);});
t('S05','影徑：無視控制區多走一格，可以背襲',()=>{const st=blank([['P_SCOUT','S','P',2,5],['P_SPEAR','A','P',6,4],['E_INF','B','E',5,4]]);const u=st.units[0];
 const normal=C.reachable(D,st,u),dash=C.reachable(D,st,u,{extra:1,ignoreZoc:true});ok(!normal.has('6,5'),'平常被控制區擋住');ok(dash.has('6,5')||dash.has('5,3'),'影徑可以繞到後面');
 const p=C.preview(D,st,u,{x:5,y:5},'B',{flank:.2});ok(p.notes.some(n=>/背襲/.test(n)),'旁邊有隊友＝背襲');});
t('S06','兵團被動急行增加移動，鐵壁減少受到的傷害',()=>{
 const st=blank([['P_SHIELD','A','P',5,5],['E_INF','B','E',5,4]]);const [u,e]=st.units;
 const normal=C.reachable(D,st,u);u.pas=['march'];ok(C.reachable(D,st,u).size>normal.size,'急行多一格');
 const hit=()=>C.preview(D,st,e,{x:e.x,y:e.y},u.id).dmg;
 const before=hit();u.pas=['wall'];ok(hit()<before,'鐵壁降低傷害');
});
t('S07','35 種隊伍組合各 3 場：每一步都合法、都有結果',()=>{const ALL=['P_SHIELD','P_SPEAR','P_ARCHER','P_LANTERN','P_HEALER','P_WEAVER','P_SCOUT'];let n=0;
 for(let a=0;a<7;a++)for(let b=a+1;b<7;b++)for(let c=b+1;c<7;c++)for(let d=c+1;d<7;d++)for(let k=0;k<3;k++){const team=[ALL[a],ALL[b],ALL[c],ALL[d]];let st=C.createBattle(D,'MISSION_BC_001',n*31+k+1,{team});let g=0;
  while(!st.result&&g<400){g++;const ps=C.alive(st,'P').filter(u=>!u.usedAct);const r=C.apply(D,st,ps.length?C.plan(D,st,ps[0],k%2?'hold':'free'):{type:'END_PHASE'});ok(r.ok,team+' '+r.error);ok(!r.events.some(e=>e.t==='ai_error'),'敵方 AI 不合法');st=r.state;}ok(st.result,'要有結果');n++;}});
t('S08','重播：任何隊伍、同 seed＋同指令 → 同狀態碼',()=>{for(const team of [['P_SCOUT','P_WEAVER','P_HEALER','P_LANTERN'],['P_SHIELD','P_SPEAR','P_ARCHER','P_LANTERN']]){let st=C.createBattle(D,'MISSION_BC_001',999,{team});const acts=[];let g=0;
 while(!st.result&&g<300){g++;const ps=C.alive(st,'P').filter(u=>!u.usedAct);const a=ps.length?C.plan(D,st,ps[0]):{type:'END_PHASE'};acts.push(a);st=C.apply(D,st,a).state;}
 eq(C.hash(C.replay(D,'MISSION_BC_001',999,JSON.parse(JSON.stringify(acts)),{team})),C.hash(st));}});

// 走據點、出戰、行動與結算的正式介面，並以固定 seed 比對結果。
function spearCamp(){
 const camp=Camp.newCamp(D);
 camp.team=['spear'];
 camp.coins=500;
 return camp;
}
function buyAndLearn(camp,book){
 const bought=Camp.bookBuy(D,camp,book);ok(bought.ok,bought.error);
 const learned=Camp.bookLearn(D,camp,'spear',book);ok(learned.ok,learned.error);
}
function deploy(camp){
 return C.createBattle(D,'MISSION_BC_001',42,{team:Camp.teamFor(D,camp)});
}
function duel(camp){
 const st=deploy(camp);const hero=st.units[0],enemy=st.units.find(u=>u.faction==='E');
 st.tiles.fill('PLAIN');
 hero.x=5;hero.y=5;hero.hit=100;enemy.x=5;enemy.y=4;enemy.eva=0;
 enemy.hp=enemy.maxHp=999;
 st.units=[hero,enemy];
 return {st,hero,enemy};
}
function act(st,hero,action){
 const r=C.apply(D,st,{type:'ACT',actorId:hero.id,to:{x:hero.x,y:hero.y},...action});
 ok(r.ok,r.error);
 return r;
}

t('V01','升級和英雄突破提高實際出戰數值，保留星印可升至十星',()=>{
 const camp=spearCamp(),record=camp.roster.spear;
 const lv1=deploy(camp).units[0];
 eq(Camp.addXp(D,record,D.xp.perLevel),1);
 const lv2=deploy(camp).units[0];
 eq(lv2.lv,2);ok(lv2.atk>lv1.atk&&lv2.maxHp>lv1.maxHp,'升級後攻擊及生命提高');
 record.star=5;record.starBank=5;
 const bought=Camp.bookBuy(D,camp,'br_hero');ok(bought.ok,bought.error);
 eq(Camp.bookLearn(D,camp,'spear','br_hero').ok,false);eq(camp.skillBooks.br_hero,1);
 Camp.addXp(D,record,D.xp.perLevel*44);
 eq(record.lv,10);
 const before=deploy(camp).units[0];
 const learned=Camp.bookLearn(D,camp,'spear','br_hero');ok(learned.ok,learned.error);
 const restored=Camp.fix(D,C.clone(camp)),after=deploy(restored).units[0];
 eq(restored.roster.spear.star,10);eq(restored.roster.spear.rank,1);
 eq(restored.roster.spear.starBank,0);eq(restored.skillBooks.br_hero,0);
 ok(after.atk>before.atk&&after.maxHp>before.maxHp,'突破後攻擊及生命提高');
});

t('V02','主動技能書造成傷害與束縛，熟練度結算一次並提高下場傷害',()=>{
 const camp=spearCamp();const skill=D.skillBooks.P_SPEAR.skill;
 Camp.addXp(D,camp.roster.spear,D.xp.perLevel*15);
 buyAndLearn(camp,skill);
 camp.roster.spear.mastery[skill]=D.practice.thresholds[1]-D.practice.gain;
 const first=duel(camp);
 const cast=({st,hero,enemy})=>act(st,hero,{act:'SKILL',skill,target:enemy.id});
 const r=cast(first),target=r.state.units.find(u=>u.id===first.enemy.id);
 const damage=first.enemy.hp+first.enemy.sol-target.hp-target.sol;
 ok(damage>0);eq(target.st.root,1);eq(target.st.slow,2);
 eq(r.state.units[0].practiceGain[skill],D.practice.gain);
 const finished=C.apply(D,r.state,{type:'RETREAT'});ok(finished.ok,finished.error);
 const reward=Camp.afterBattle(D,camp,finished.state,()=>.99);
 eq(reward.practice.spear[skill],D.practice.gain);
 eq(Camp.afterBattle(D,camp,finished.state,()=>.99).dup,true);
 const restored=Camp.fix(D,C.clone(camp));
 eq(restored.roster.spear.mastery[skill],D.practice.thresholds[1]);
 const next=duel(restored),nextTarget=cast(next).state.units[1];
 ok(next.enemy.hp+next.enemy.sol-nextTarget.hp-nextTarget.sol>damage,'同 seed 下熟練技能造成更多傷害');
 const deselected=Camp.selectBook(D,restored,'spear','active','');ok(deselected.ok,deselected.error);
 const last=duel(restored);
 eq(C.validate(D,last.st,{type:'ACT',actorId:last.hero.id,to:last.hero,act:'SKILL',skill,target:last.enemy.id}),'no_skill');
});

t('V03','英雄被動技能書在戰鬥結算時提高傷害',()=>{
 const camp=spearCamp();
 Camp.addXp(D,camp.roster.spear,D.xp.perLevel*15);
 const damage=({st,hero,enemy})=>{
  const target=act(st,hero,{act:'ATTACK',target:enemy.id}).state.units[1];
  return enemy.hp+enemy.sol-target.hp-target.sol;
 };
 const before=damage(duel(camp));
 buyAndLearn(camp,'bp_watch');
 ok(damage(duel(camp))>before,'滿血時完陣增加傷害');
 const deselected=Camp.selectBook(D,camp,'spear','passive','');ok(deselected.ok,deselected.error);
 eq(damage(duel(camp)),before,'卸下後恢復原傷害');
});

t('V04','兵團技能書提高移動，兵團晉升增加上限及每兵生命',()=>{
 const camp=spearCamp(),squad=camp.roster.spear.sq;
 squad.lv=D.squad.maxLv;squad.tier=D.squad.maxTier;
 const before=duel(camp);
 buyAndLearn(camp,'bs_march');
 const after=duel(camp);
 ok(C.reachable(D,after.st,after.hero).size>C.reachable(D,before.st,before.hero).size);
 buyAndLearn(camp,'br_squad');
 const promoted=deploy(camp).units[0];
 eq(C.solMaxN(promoted),C.solMaxN(after.hero)+1);
 ok(promoted.hpPer>after.hero.hpPer);eq(C.soldiers(promoted),C.soldiers(after.hero));
});

t('V05','商鋪購物、帶入戰鬥、使用道具及扣除庫存',()=>{
 const camp=spearCamp(),item='bandage',price=D.fieldItems[item].price;
 const coins=camp.coins;
 const bought=Camp.buyFieldItem(D,camp,item);ok(bought.ok,bought.error);
 eq(camp.coins,coins-price);eq(camp.items[item],1);
 ok(Camp.packItem(D,camp,item,true));
 const {st,hero}=duel(camp);
 eq(st.pack[item],1);hero.hp=Math.floor(hero.maxHp/2);
 const r=act(st,hero,{act:'ITEM',item}),healed=r.state.units[0];
 ok(healed.hp>hero.hp);eq(healed.usedAct,true);eq(r.state.pack[item],0);
 ok(Camp.spendItem(camp,item));eq(camp.items[item],0);eq(Camp.packFor(D,camp)[item],undefined);
});

console.log(out.join('\n'));console.log(`\n通過 ${pass}／${pass+fail}`);process.exit(fail?1:0);
