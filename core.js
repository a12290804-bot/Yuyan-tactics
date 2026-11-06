// 《永生戰棋》戰鬥核心（v0.5：兵團、多技能、被動、隨機勢力、污染、援軍）
// 規則：純函式、不碰畫面、不呼叫 Math.random 或系統時間；所有隨機都來自 seed + rngIndex。
(function(root){
'use strict';
const SCHEMA=5;

// ---------- 小工具 ----------
const clone=o=>JSON.parse(JSON.stringify(o));
const key=(x,y)=>x+','+y;
const manhattan=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const DIRS=[[0,-1],[1,0],[0,1],[-1,0]];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function rngAt(seed,idx){let z=(seed>>>0)^Math.imul(idx+1,0x9E3779B1);z=Math.imul(z^(z>>>16),0x85EBCA6B);z=Math.imul(z^(z>>>13),0xC2B2AE35);z^=z>>>16;return (z>>>0)/4294967296;}
function roll(st){const v=rngAt(st.seed,st.rngIndex);st.rngIndex++;return v;}
function hash(st){const s=JSON.stringify([st.round,st.phase,st.rngIndex,st.gate,st.units.map(u=>[u.id,u.x,u.y,u.hp,u.sol,u.usedAct,u.guard,u.st,u.cd,u.kills]),st.zones,st.warn,st.corr,st.faction,st.hold,st.tiles.join(''),st.result,st.done||0,st.lit||0,st.breach||0,st.escort||null]);let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193);}return ('00000000'+(h>>>0).toString(16)).slice(-8);}

// ---------- 建立戰鬥 ----------
function makeUnit(D,def,id,faction,x,y,ov){const b={...D.units[def],...(ov||{})};if(!b)throw new Error('unknown unit '+def);const n=b.soldiers||0,hp1=b.hpPer||10;
 return {id,def,name:b.name,glyph:b.glyph,troop:b.troop,faction,x,y,hp:b.hp,maxHp:b.hp,atk:b.atk,def:b.def,mag:b.mag,res:b.res,move:b.move,rmin:b.rmin,rmax:b.rmax,dmg:b.dmg,hit:b.hit||0,eva:b.eva||0,crit:5,commander:!!b.commander,fly:!!b.fly,art:b.art||null,por:b.por||null,hero:b.hero||null,cls:b.cls||null,
  sol:n*hp1,solMax:n*hp1,hpPer:hp1,skills:b.skills||(b.skill?[b.skill]:[]),pas:b.pas||[],sb:b.sb!=null?b.sb:null,cd:{},st:{root:0,mark:0,gs:0},tm:b.tm?JSON.parse(JSON.stringify(b.tm)):{},usedAct:false,guard:false,stay:false,kills:0,lv:b.lv||1};}
// 天賦：百分比先算，再加裝備
function applyTal(u,T){const r=Math.round;if(T.atkP){u.atk=r(u.atk*(1+T.atkP));u.mag=r(u.mag*(1+T.atkP));}if(T.defP)u.def=r(u.def*(1+T.defP));if(T.resP)u.res=r(u.res*(1+T.resP));if(T.hpP){u.hp=u.maxHp=r(u.maxHp*(1+T.hpP));}for(const s of ['crit','hit','eva'])if(T[s])u[s]=(u[s]||0)+r(T[s]);if(T.move)u.move=Math.max(1,u.move+T.move);if(T.flags)u.tf=T.flags.slice();}
const hasT=(u,k)=>!!(u&&u.tf&&u.tf.includes(k));
// 裝備加成（平的數值，加在等級、星級之後）
function applyEq(u,e){const r=Math.round;if(e.hp){const k=r(e.hp);u.hp+=k;u.maxHp+=k;}for(const s of ['atk','def','mag','res'])if(e[s])u[s]=Math.max(0,u[s]+r(e[s]));for(const s of ['hit','eva','crit'])if(e[s])u[s]=(u[s]||0)+r(e[s]);u.eq=1;}
const EMH=D=>(D.enemyMult&&D.enemyMult.hp)||1,EMA=D=>(D.enemyMult&&D.enemyMult.atk)||1;
const hasP=(u,k)=>!!(u&&u.pas&&u.pas.includes(k));
function createBattle(D,missionId,seed,opts){opts=opts||{};const M=D.missions[missionId];if(!M)throw new Error('unknown mission');
 const team=(opts.team&&opts.team.length?opts.team:D.defaultTeam).slice(0,(M.deploy||D.deploySlots).length);for(const t of team){const d=typeof t==='string'?t:t&&t.def;if(!D.units[d]||d[0]!=='P')throw new Error('bad team '+JSON.stringify(t));}
 const tiles=[];for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++)tiles.push(M.legend[M.map[y][x]]);
 const st={schemaVersion:SCHEMA,rulesetVersion:D.rulesetVersion,missionId,battleInstanceId:missionId+'_'+(seed>>>0).toString(16),seed:seed>>>0,rngIndex:0,round:1,phase:'PLAYER',w:M.w,h:M.h,tiles,team:team.slice(),
  gate:M.gate?{...M.gate,maxHp:M.gate.hp}:{none:true,x:-99,y:-99,hp:0,maxHp:0,def:0,res:0},obj:M.obj||{type:'gate'},hold:0,done:[],lit:[],breach:0,units:[],zones:[],warn:[],corr:0,pressure:false,result:null,eventLog:[],nextId:1};
 if(M.obj&&M.obj.type==='escort')st.escort={status:'trapped',x:M.obj.person[0],y:M.obj.person[1],carrier:null};
 const fk=Object.keys(D.factions);st.faction=opts.faction&&D.factions[opts.faction]?opts.faction:fk[Math.floor(rngAt(st.seed,0x7ffff)*fk.length)];const F=D.factions[st.faction];
 const DEP=M.deploy||D.deploySlots;team.forEach((t,i)=>{const [x,y]=DEP[i];if(typeof t==='string'){const h=D.units[t].hero;st.units.push(makeUnit(D,t,'P'+(i+1),'P',x,y,h?{art:'heroes/tok_'+h+'.webp',por:'heroes/por_'+h+'.webp'}:null));return;}
  const b=D.units[t.def],k=t.mult||1;const ov={name:t.name||b.name,cls:t.title||b.cls,hero:t.hero||null,art:t.art||null,por:t.por||t.art||null,hp:Math.round(b.hp*k),atk:Math.round(b.atk*k),def:Math.round(b.def*k),mag:Math.round(b.mag*k),res:Math.round(b.res*k),lv:t.lv||1};
  if(t.skills)ov.skills=t.skills.filter(x=>D.skills[x]);if(t.pas)ov.pas=t.pas.filter(x=>D.passives[x]);if(t.soldiers)ov.soldiers=t.soldiers;if(t.hpPer)ov.hpPer=Math.round(b.hpPer*t.hpPer);if(t.sb!=null)ov.sb=t.sb;
  const u=makeUnit(D,t.def,'P'+(i+1),'P',x,y,ov);if(t.sol!=null)u.sol=Math.round(u.solMax*Math.max(0,Math.min(1,t.sol)));if(t.rid)u.rid=t.rid;if(t.por)u.por=t.por;if(t.tm)u.tm=JSON.parse(JSON.stringify(t.tm));if(t.tal)applyTal(u,t.tal);if(t.eq)applyEq(u,t.eq);st.units.push(u);});
 M.enemySlots.forEach(([x,y],i)=>{const [t,name,art]=F.slots[i];st.units.push(makeUnit(D,t,'E'+(i+1),'E',x,y,{name,glyph:name[0],art:'enemies/tok_'+art+'.webp',por:'enemies/por_'+art+'.webp'}));});
 st.nextId=M.enemySlots.length+1;st.level=Math.max(0,(opts.level|0)+(M.threat||0));
 if(M.commanderStart)spawnCmd(D,st,M,[]);const em=1+(D.levelStep||0)*Math.min(st.level,D.levelMax||0);for(const u of st.units)if(u.faction==='E'&&!u.scaled){u.scaled=1;u.hp=u.maxHp=Math.round(u.hp*em*EMH(D));u.atk=Math.round(u.atk*em*EMA(D));u.mag=Math.round(u.mag*em*EMA(D));}
 const ev0=[];openSt(D,st,ev0);st.eventLog.push(...ev0.map(e=>({...e,round:1})));
 st.eventLog.push(...roundStart(D,st).map(e=>({...e,round:1})));return st;}

// ---------- 地圖查詢 ----------
const inside=(st,x,y)=>x>=0&&y>=0&&x<st.w&&y<st.h;
const tileAt=(st,x,y)=>st.tiles[y*st.w+x];
const T=(D,st,x,y)=>D.terrain[tileAt(st,x,y)];
const unitAt=(st,x,y)=>st.units.find(u=>u.hp>0&&u.x===x&&u.y===y)||null;
const alive=(st,f)=>st.units.filter(u=>u.hp>0&&(!f||u.faction===f));
const soldiers=u=>Math.ceil(Math.max(0,u.sol)/u.hpPer);
const solMaxN=u=>Math.round(u.solMax/u.hpPer);
function heightAt(D,st,x,y){return T(D,st,x,y).height||0;}
function inZone(st,x,y,faction){return st.zones.some(z=>z.faction===faction&&Math.abs(z.x-x)<=1&&Math.abs(z.y-y)<=1);}

// 可到達的格子（Dijkstra；不能穿過任何單位；進入敵方相鄰格就停下＝控制區）
function moveOf(D,u,opts){let m=u.move+((opts&&opts.extra)||0)+(hasP(u,'march')?1:0)-(sv(u,'slow')>0?1:0)-(u.slumber>0?1:0)-(u.escorting?1:0);return Math.max(0,m);}
function reachable(D,st,u,opts){opts=opts||{};const start=key(u.x,u.y);const out=new Map([[start,0]]);if(u.st&&u.st.root>0)return out;
 const mv=moveOf(D,u,opts);const dist=new Map([[start,0]]);const q=[[0,u.x,u.y]];
 const enemyAdj=(x,y)=>DIRS.some(([dx,dy])=>{const v=unitAt(st,x+dx,y+dy);return v&&v.faction!==u.faction;});
 while(q.length){q.sort((a,b)=>a[0]-b[0]||a[2]-b[2]||a[1]-b[1]);const [c,x,y]=q.shift();if(c>(dist.get(key(x,y))??Infinity))continue;
  if(!opts.ignoreZoc&&!(x===u.x&&y===u.y)&&enemyAdj(x,y))continue;
  for(const [dx,dy] of DIRS){const nx=x+dx,ny=y+dy;if(!inside(st,nx,ny))continue;const t=T(D,st,nx,ny);if(!t.pass&&!(u.fly&&t.flyPass))continue;if(unitAt(st,nx,ny))continue;
   const nc=c+(u.fly?1:t.cost);if(nc>mv)continue;const k=key(nx,ny);if(nc<(dist.get(k)??Infinity)){dist.set(k,nc);out.set(k,nc);q.push([nc,nx,ny]);}}}
 return out;}

function los(D,st,a,b){let x0=a.x,y0=a.y;const x1=b.x,y1=b.y;const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let err=dx+dy;
 while(true){if(x0===x1&&y0===y1)return true;const e2=2*err;if(e2>=dy){err+=dy;x0+=sx;}if(e2<=dx){err+=dx;y0+=sy;}if(x0===x1&&y0===y1)return true;if(T(D,st,x0,y0).blockLos)return false;}}
function losToGate(D,st,a,g){let x0=a.x,y0=a.y;const dx=Math.abs(g.x-x0),dy=-Math.abs(g.y-y0),sx=x0<g.x?1:-1,sy=y0<g.y?1:-1;let err=dx+dy;while(true){const e2=2*err;if(e2>=dy){err+=dy;x0+=sx;}if(e2<=dx){err+=dx;y0+=sy;}if(x0===g.x&&y0===g.y)return true;if(T(D,st,x0,y0).blockLos)return false;}}

function rangeOf(D,st,u,from,rng){let [a,b]=rng||[u.rmin,u.rmax];if(b>=2&&heightAt(D,st,from.x,from.y)>=1)b+=1;return [a,b];}
function targetsFrom(D,st,u,from,rng,noGate,noLos){const [a,b]=rangeOf(D,st,u,from,rng);const out=[];
 for(const v of alive(st)){if(v.faction===u.faction)continue;if(sv(v,'stealth')>0)continue;const d=manhattan(from,v);if(d<a||d>b)continue;if(d>1&&!noLos&&!los(D,st,from,v))continue;out.push(v.id);}
 if(!noGate&&u.faction==='E'&&st.gate.hp>0){const g=st.gate;const d=manhattan(from,g);if(d>=a&&d<=b){if(d===1||losToGate(D,st,from,g))out.push('GATE');}}
 return out;}
function withPos(u,p,fn){const sx=u.x,sy=u.y;u.x=p.x;u.y=p.y;try{return fn();}finally{u.x=sx;u.y=sy;}}

// ---------- 傷害 ----------
function counterMult(D,att,defTroop){if(!defTroop)return 1;if((D.counters[att.troop]||[]).includes(defTroop))return 1.2;if((D.counters[defTroop]||[]).includes(att.troop))return .85;return 1;}
function terrainDef(D,st,x,y,u){let v=T(D,st,x,y).def||0;if(v<0&&u&&hasP(u,'clean')&&tileAt(st,x,y)==='FLESH')v=0;return clamp(v,-.5,.5);}
function solBonus(D,u){return 1+(u.sb!=null?u.sb:(D.soldierBonus||0))*(u.solMax?u.sol/u.solMax:0);}
// o: {mult, counter(是反擊), charge(移動消耗), flank, area}
function calc(D,st,att,from,tid,o){o=o||{};const tgt=tid==='GATE'?null:st.units.find(v=>v.id===tid);const isMag=att.dmg==='MAGICAL';const notes=[];
 const cm=counterMult(D,att,tgt&&tgt.troop);let situ=0;
 if(inZone(st,from.x,from.y,att.faction)){situ+=.1;notes.push('燈界 +10%');}
 if(hasP(att,'edge')){situ+=.08;notes.push('鋒銳 +8%');}
 if(o.counter&&hasP(att,'riposte')){situ+=.2;notes.push('反擊架勢 +20%');}
 if(!o.counter&&att.troop==='CAVALRY'&&(o.charge||0)>=D.charge.minCost&&tileAt(st,from.x,from.y)!=='SHALLOW_WATER'&&tgt){situ+=D.charge.bonus;notes.push('衝鋒 +20%');}
 if(tgt&&tgt.st.mark>0){situ+=D.skills.markShot.markAmp;notes.push('弱點標記 +20%');}
 if(att.faction==='E'&&st.corr>=50&&tileAt(st,from.x,from.y)==='FLESH'){situ+=D.corruption.buffAt50;notes.push('污染加持 +10%');}
 if(tgt&&tgt.commander&&hasT(att,'behead')){situ+=.15;notes.push('斬首 +15%');}
 if(tgt&&tgt.commander&&st.obj&&st.obj.seals&&(st.lit||[]).length<st.obj.seals.length){situ-=.6;notes.push('鐘聲守護 −60%');}
 if(o.flank&&tgt&&alive(st,att.faction).some(v=>v.id!==att.id&&manhattan(v,tgt)===1)){situ+=o.flank;notes.push('背襲 +'+Math.round(o.flank*100)+'%');}
 situ+=calcMods(D,st,att,tgt,o,notes);
 const raw=Math.floor((o.useDef?att.def:isMag?att.mag:att.atk)*solBonus(D,att)*cm*(o.mult||1)*(1+situ));
 let guard;if(tgt){let db=terrainDef(D,st,tgt.x,tgt.y,tgt)+(tgt.guard?.3:0)+(inZone(st,tgt.x,tgt.y,tgt.faction)?.1:0)+(tgt.st.gs>0?D.skills.guardStance.defUp:0)+(hasP(tgt,'wall')?.1:0);db=clamp(db,-.5,.5);
  guard=Math.floor((isMag?tgt.res:tgt.def)*(sv(tgt,'brk')>0&&!isMag?.7:1)*solBonus(D,tgt)*(1+db)*.5);}else guard=Math.floor((isMag?st.gate.res:st.gate.def)*.5);
 let dmg=Math.max(1,raw-guard);let inMod=0;
 if(tgt&&hasP(tgt,'hold')&&tgt.stay)inMod-=.1;
 if(tgt)inMod-=takeMods(D,st,tgt,o,notes);
 if(inMod)dmg=Math.max(1,Math.floor(dmg*Math.max(.1,1+inMod)));if(tgt&&sv(tgt,'shell')>0){dmg=0;notes.push('縮殼：不受傷');}
 const hit=tgt?clamp(.9+(att.hit+(hasP(att,'night')?10:0)-(sv(att,'blind')>0?40:0)+(st.round<=2?tm(att,'earlyHit'):0)-tgt.eva-(sv(tgt,'evade')>0?30:0)+(sv(tgt,'lit')>0?20:0))/100,.2,1):1;
 return {dmg,hit,crit:tgt&&hasT(tgt,'nocrit')?0:clamp((att.crit==null?5:att.crit)/100,0,.5),cm,notes,tgt};}
// 攻擊預估（含反擊）
function preview(D,st,att,from,tid,o){o=o||{};const p=withPos(att,from,()=>calc(D,st,att,from,tid,o));const tgt=p.tgt;let counter=null;
 if(tgt&&!o.noCounter&&canCounter(tgt)){const [a,b]=rangeOf(D,st,tgt,tgt);const d=manhattan(from,tgt);if(d>=a&&d<=b&&(d===1||los(D,st,tgt,from))){const c=withPos(att,from,()=>calc(D,st,tgt,{x:tgt.x,y:tgt.y},att.id,{counter:true}));counter={possible:true,dmg:c.dmg,hit:c.hit,notes:c.notes};}}
 return {dmg:p.dmg,hit:p.hit,crit:p.crit,cm:p.cm,notes:p.notes,counter,kill:tgt?killCheck(tgt,p.dmg):p.dmg>=st.gate.hp};}
function killCheck(t,d){return splitPreview(t,d).hp<=0;}
function splitPreview(t,d){let s=0,h=d;if(t.sol>0){s=Math.floor(d*.7);h=d-s;if(s>t.sol){h+=Math.floor((s-t.sol)*.5);s=t.sol;}}return {sol:t.sol-s,hp:t.hp-h,s,h};}

// 套用傷害：先處理守護分攤，再分士兵與英雄
function dealTo(D,st,tgt,d,ev,src){if(tgt.hp<=0)return;src=src||{};d=redirect(D,st,tgt,d,ev,src);if(d<=0)return;
 const guardian=alive(st,tgt.faction).find(g=>g.id!==tgt.id&&g.st.gs>0&&manhattan(g,tgt)===1);
 if(guardian&&!src.noShare){const share=D.skills.guardStance.share;const r=Math.floor(d*share);if(r>0){d-=r;ev.push({t:'share',a:guardian.id,d:tgt.id,dmg:r,txt:guardian.name+' 替 '+tgt.name+' 擋下 '+r});applySplit(D,st,guardian,r,ev);}}
 applySplit(D,st,tgt,d,ev);if(tgt.hp>0&&!src.noShare)takenHit(D,st,tgt,ev);}
function applySplit(D,st,t,d,ev){if(sv(t,'shield')>0&&d>0){const a=Math.min(t.st.shield,d);t.st.shield-=a;d-=a;ev.push({t:'shield',d:t.id,txt:t.name+' 的護盾擋下 '+a});if(d<=0)return;}const p=splitPreview(t,d);const n0=soldiers(t);t.sol=Math.max(0,p.sol);t.hp=Math.max(0,p.hp);const lost=n0-soldiers(t);
 if(lost>0)ev.push({t:'soldier',d:t.id,n:lost,txt:t.name+' 損失士兵 '+lost+' 名（剩 '+soldiers(t)+'）'});
 if(t.hp<=0){if(saveLife(D,st,t,ev))return;t.sol=0;ev.push({t:'down',d:t.id,txt:t.name+' 倒下了，兵隊潰散'});onDown(D,st,t,ev);}}

function strike(D,st,att,from,tid,ev,o){o=o||{};const p=withPos(att,from,()=>calc(D,st,att,from,tid,o));const r1=roll(st),r2=roll(st);const tgt=p.tgt;const tname=tgt?tgt.name:'城門';const verb=o.label||(o.counter?'反擊':'攻擊');
 if(!o.counter)att.struck=1;
 if(r1>=p.hit){ev.push({t:'miss',a:att.id,d:tid,counter:!!o.counter,txt:att.name+' '+verb+' '+tname+'：落空'});return {hit:false};}
 if(tgt&&tm(tgt,'block')&&roll(st)<tm(tgt,'block')){ev.push({t:'miss',a:att.id,d:tid,counter:!!o.counter,txt:tname+' 用背甲擋下了 '+att.name+' 的'+verb});return {hit:false};}
 let d=p.dmg;let crit=r2<p.crit;if(!o.counter&&sv(att,'sure')>0){crit=true;att.st.sure=0;}if(crit)d=Math.floor(d*1.5);
 ev.push({t:'hit',a:att.id,d:tid,dmg:d,crit,counter:!!o.counter,cm:p.cm,fx:o.fx||null,txt:att.name+' '+verb+' '+tname+'：'+(crit?'暴擊 ':'')+d+(p.cm>1?'（克制）':p.cm<1?'（被克）':'')+(p.notes.length?'〔'+p.notes.join('、')+'〕':'')});
 if(tgt){dealTo(D,st,tgt,d,ev,{...o,att});if(tgt.hp<=0&&tgt.faction!==att.faction){att.kills=(att.kills||0)+1;onKill(D,st,att,ev);}else if(tgt.hp>0)afterHit(D,st,att,tgt,d,ev,o);}else{st.gate.hp=Math.max(0,st.gate.hp-d);if(st.gate.hp<=0)ev.push({t:'gate',txt:'城門被打破了'});}
 if(tgt&&sv(att,'pact')>0&&att.hp>0&&d>0){const rc2=Math.max(1,Math.round(d*.08*(att.st.pactN||1)));ev.push({t:'hit',a:tgt.id,d:att.id,dmg:rc2,txt:att.name+' 被厄契反噬：'+rc2});dealTo(D,st,att,rc2,ev,{noShare:true});}
 if(tgt&&!o.counter&&!o.echo&&!o.extra&&att.hp>0){if(sv(att,'echo')>0&&tgt.hp>0)strike(D,st,att,from,tid,ev,{mult:.4,noCounter:true,echo:true,label:'狐火撲咬'});
  if(o.normal&&tm(att,'extraHit')&&tgt.hp>0&&roll(st)<tm(att,'extraHit'))strike(D,st,att,from,tid,ev,{mult:.5,noCounter:true,extra:true,label:'多刺一下'});}
 return {hit:true,dmg:d};}

// ---------- v1.2：狀態、通用技能（專屬技／奧義）、個人天賦 ----------
const STN={burn:'燃燒',bleed:'流血',poison:'中毒',slow:'減速',freeze:'凍住',charm:'魅惑',blind:'致盲',fear:'恐懼',seal:'封印',taunt:'嘲諷',regen:'再生',stealth:'隱身',vuln:'破綻',brk:'破甲',link:'連線',evade:'閃身',might:'振奮',ward:'護衛',shell:'縮殼',undying:'不倒',proxy:'替身線',echo:'狐火',lit:'照明',mark:'標記',root:'束縛',oath:'誓約',pact:'厄契',resist:'抵抗'};
const DOTS=['burn','bleed','poison'];
const TIMED=['slow','blind','fear','seal','taunt','regen','stealth','vuln','brk','link','evade','might','ward','shell','undying','proxy','echo','lit','oath','pact','resist'];
const BAD=['burn','bleed','poison','freeze','charm','slow','blind','fear','seal','vuln','brk','root','mark','lit'];
function sv(u,k){return (u&&u.st&&u.st[k])||0;}
function tm(u,k){const v=u&&u.tm&&u.tm[k];return v||0;}
function addSt(D,st,u,k,dur,ev,src){if(!u||u.hp<=0||!dur)return false;if(tm(u,'imm_'+k))return false;
 if((k==='freeze'||k==='charm')&&u.commander)k='slow';if(tm(u,'imm_'+k))return false;
 if(src&&src.faction!==u.faction&&BAD.concat(['pact']).includes(k)&&sv(u,'resist')>0&&roll(st)<.5){ev.push({t:'status',d:u.id,txt:u.name+' 在月光裡抵抗了'+(STN[k]||k)});return false;}
 if(src&&src.faction!==u.faction)dur+=tm(src,'stDur');
 if(k==='pact'){u.st.pactN=Math.min(5,(u.st.pactN||0)+1);u.st.pact=Math.max(sv(u,'pact'),dur);ev.push({t:'status',d:u.id,txt:u.name+'：厄契 ×'+u.st.pactN+'（'+dur+' 回合）'});return true;}
 if(DOTS.includes(k)){const cap=3+(src?tm(src,'dotCap'):0);u.st[k+'N']=Math.min(cap,(u.st[k+'N']||0)+1);u.st[k]=Math.max(sv(u,k),dur);if(src&&tm(src,'dotP'))u.st[k+'P']=Math.max(u.st[k+'P']||0,tm(src,'dotP'));}
 else u.st[k]=Math.max(sv(u,k),dur);
 if(k==='link'&&src&&tm(src,'linkSlow'))u.st.slow=Math.max(sv(u,'slow'),dur);
 ev.push({t:'status',d:u.id,txt:u.name+'：'+(STN[k]||k)+(DOTS.includes(k)?' ×'+u.st[k+'N']:'')+'（'+dur+' 回合）'});return true;}
function clearBad(u,n){let c=0;for(const k of BAD){if(c>=n)break;if(sv(u,k)>0){u.st[k]=0;if(DOTS.includes(k))u.st[k+'N']=0;c++;}}return c;}
function healU(D,st,src,t,pct,solPct,ev,label,low){let m=1+tm(src,'healP')+((st.downN&&st.downN[src.faction])?tm(src,'downHealP'):0);
 if(low&&t.hp<t.maxHp*.6)m*=low;
 if(tm(src,'firstHeal2')&&!src.firstHealUsed){m*=2;src.firstHealUsed=1;}
 if(tm(src,'healDouble')&&roll(st)<tm(src,'healDouble'))m*=2;
 const want=Math.round(t.maxHp*pct*m);const h=Math.max(0,Math.min(t.maxHp-t.hp,want));const s0=soldiers(t);t.hp+=h;if(solPct)t.sol=Math.min(t.solMax,t.sol+Math.round(t.solMax*solPct*m));
 if(tm(src,'healCleanse'))for(const k of DOTS){t.st[k]=0;t.st[k+'N']=0;}
 if(tm(src,'healRegen')&&src.id!==t.id)addSt(D,st,t,'regen',2,ev,src);
 if(tm(src,'overHealMight')&&want>h&&pct>0)addSt(D,st,t,'might',2,ev,src);
 if(h>0||soldiers(t)>s0)ev.push({t:'heal',a:src.id,d:t.id,h,txt:(label?label+'：':'')+t.name+' 回復 '+h+(soldiers(t)>s0?'，士兵 '+s0+'→'+soldiers(t):'')});return h;}
// 打人的一方：加成
function calcMods(D,st,att,tgt,o,notes){let s=0;const add=(v,n)=>{if(v){s+=v;notes.push(n+(v>0?' +':' ')+Math.round(v*100)+'%');}};
 if(sv(att,'fear')>0&&!tm(att,'noFearPen'))add(-.2,'恐懼');
 if(sv(att,'might')>0)add(.15,'振奮');
 if(o.skill){add(tm(att,'skillP'),'技能');if(tgt&&tileAt(st,tgt.x,tgt.y)==='FLESH')add(tm(att,'fleshP'),'碑火');}
 if(!o.counter&&!att.struck)add(tm(att,'firstStrike'),'先制');
 if(att.hp>=att.maxHp*.8)add(tm(att,'healthyAtk'),'收錢辦事');
 if(tm(att,'lowHpAtk'))add(+(tm(att,'lowHpAtk')*(1-att.hp/att.maxHp)).toFixed(2),'停不下來');
 if(st.downN&&st.downN[att.faction])add(tm(att,'downAtk'),'不讓人再倒下');
 if(alive(st,att.faction).length===1)add(tm(att,'lastStand'),'活到最後');
 if(o.counter)add(tm(att,'counterP'),'騎士');
 if(o.chargeP&&o.charge)add(+(o.chargeP*o.charge).toFixed(2),'衝鋒');
 if(tgt){if(sv(tgt,'vuln')>0)add(.2,'破綻');if(sv(tgt,'seal')>0)add(tm(att,'vsSealP'),'對封印');if(sv(tgt,'bleed')>0)add(tm(att,'vsBleedP'),'對流血');if(sv(tgt,'blind')>0)add(tm(att,'vsBlindP'),'對致盲');if(tgt.st.mark>0)add(tm(att,'vsMarkP'),'交叉比對');if(tgt.hp<tgt.maxHp*.3)add(tm(att,'execLow'),'結案');if(sv(tgt,'pact')>0)add(tm(att,'vsPactP'),'違約金');}
 return s;}
// 被打的一方：減傷
function takeMods(D,st,tgt,o,notes){let r=0;const add=(v,n)=>{if(v){r+=v;notes.push(n+' −'+Math.round(v*100)+'%');}};
 add(tm(tgt,'dr'),'減傷');if(sv(tgt,'ward')>0)add(.3,'護衛');if(sv(tgt,'taunt')>0)add(tm(tgt,'tauntDR'),'鴉羽披風');if(o.area)add(tm(tgt,'aoeDR'),'落石經驗');if(tgt.slumber>0)add(.5,'蟄伏');
 let cov=0,au=0;for(const v of alive(st,tgt.faction)){if(v.id!==tgt.id&&manhattan(v,tgt)===1)cov=Math.max(cov,tm(v,'coverAdj'));if(manhattan(v,tgt)<=2)au=Math.max(au,tm(v,'auraDR'));}add(cov,'有人替你擋');add(au,'月燈');
 return Math.min(.8,r);}
function canCounter(t){return !(sv(t,'fear')>0)&&!(sv(t,'freeze')>0)&&!(sv(t,'charm')>0)&&!(sv(t,'shell')>0);}
// 傷害轉移：誓約、替身線
function redirect(D,st,tgt,d,ev,src){if(src.noShare||src.redir)return d;
 if(sv(tgt,'oath')>0&&tgt.oathBy){const p=st.units.find(v=>v.id===tgt.oathBy&&v.hp>0);if(p&&p.id!==tgt.id){const r=Math.floor(d*.3);if(r>0){d-=r;ev.push({t:'share',a:p.id,d:tgt.id,dmg:r,txt:p.name+' 依誓約替 '+tgt.name+' 承受 '+r});applySplit(D,st,p,r,ev);}}}
 let pr=sv(tgt,'proxy')>0?.2:0;for(const v of alive(st,tgt.faction))pr=Math.max(pr,tm(v,'linkShare'));
 if(pr>0){const L=alive(st).find(v=>v.faction!==tgt.faction&&sv(v,'link')>0);if(L){const r=Math.floor(d*pr);if(r>0){d-=r;ev.push({t:'share',a:L.id,d:tgt.id,dmg:r,txt:'絲線把 '+r+' 點傷害轉給 '+L.name});applySplit(D,st,L,r,ev);}}}
 return d;}
function takenHit(D,st,t,ev){t.hitN=(t.hitN||0)+1;
 if(t.hp>0&&t.hp<t.maxHp*.3&&!t.emergDone){const o=alive(st,t.faction).find(v=>tm(v,'emergShield')&&(v.emergCd||0)<=st.round);if(o){t.emergDone=1;o.emergCd=st.round+3;t.st.shield=Math.max(sv(t,'shield'),Math.round(t.maxHp*tm(o,'emergShield')));ev.push({t:'shield',d:t.id,txt:o.name+'〔未熄的歸途〕月燈替 '+t.name+' 張開護盾'});}}
 if(tm(t,'hitShield')&&t.hitN%3===0){t.st.shield=Math.max(sv(t,'shield'),Math.round(t.maxHp*tm(t,'hitShield')));ev.push({t:'shield',d:t.id,txt:t.name+'〔三層〕得到護盾'});}
 if(tm(t,'rockBlast')&&t.hitN%6===0){ev.push({t:'skill',a:t.id,txt:t.name+'〔岩層〕崩落！'});for(const e of alive(st).filter(v=>v.faction!==t.faction&&manhattan(v,t)<=2))if(e.hp>0)strike(D,st,t,{x:t.x,y:t.y},e.id,ev,{mult:tm(t,'rockBlast'),noCounter:true,area:true,label:'岩層崩落',noShare:true});}
 if(t.slumber>0&&t.hp<t.maxHp*.6)wake(D,st,t,ev);}
function afterHit(D,st,att,tgt,d,ev,o){
 const cs=tm(att,'counterSt');if(o.counter&&Array.isArray(cs)&&roll(st)<cs[2])addSt(D,st,tgt,cs[0],cs[1],ev,att);
 const th=tm(tgt,'thornSt');if(!o.counter&&Array.isArray(th)&&att.hp>0&&roll(st)<th[2])addSt(D,st,att,th[0],th[1],ev,tgt);
 if(!o.counter&&tm(tgt,'thornDmg')&&att.hp>0&&manhattan(att,tgt)===1){const r=Math.max(1,Math.round(d*tm(tgt,'thornDmg')));ev.push({t:'hit',a:tgt.id,d:att.id,dmg:r,txt:tgt.name+'〔逆鱗〕反彈 '+r});dealTo(D,st,att,r,ev,{noShare:true});}
 if(sv(tgt,'link')>0&&!o.linkSpread){for(const v of alive(st,tgt.faction))if(v.id!==tgt.id&&sv(v,'link')>0){const r=Math.max(1,Math.round(d*.3));ev.push({t:'hit',a:att.id,d:v.id,dmg:r,txt:'絲線把傷害傳給 '+v.name+'：'+r});dealTo(D,st,v,r,ev,{noShare:true,linkSpread:true});}}}
function saveLife(D,st,t,ev){const bl=alive(st,t.faction).find(v=>v.id!==t.id&&tm(v,'bearLethal')&&(v.bearCd||0)<=st.round&&v.hp>Math.round(t.maxHp*.2));if(bl&&!(sv(t,'undying')>0)&&!(tm(t,'undyingOnce')&&!t.lifeUsed)){const give=Math.round(t.maxHp*.2);t.hp=give;bl.hp=Math.max(1,bl.hp-give);bl.bearCd=st.round+3;ev.push({t:'share',a:bl.id,d:t.id,dmg:give,txt:bl.name+' 用緋線把 '+t.name+' 拉回來（替他承受 '+give+'）'});addSt(D,st,bl,'might',2,ev,null);return true;}
 let pct=0;if(sv(t,'undying')>0){pct=.25;t.st.undying=0;}else if(tm(t,'undyingOnce')&&!t.lifeUsed){pct=tm(t,'undyingOnce');t.lifeUsed=1;}
 if(!pct)return false;t.hp=Math.max(1,Math.round(t.maxHp*pct));ev.push({t:'heal',d:t.id,txt:t.name+' 撐住了（留下 '+t.hp+' 生命）'});return true;}
function onDown(D,st,t,ev){st.downN=st.downN||{};st.downN[t.faction]=(st.downN[t.faction]||0)+1;
 if(tm(t,'deathBlast')){ev.push({t:'skill',a:t.id,txt:t.name+'〔還火〕'});for(const e of alive(st).filter(v=>v.faction!==t.faction&&manhattan(v,t)<=2)){const dm=Math.round((t.dmg==='MAGICAL'?t.mag:t.atk)*tm(t,'deathBlast'));ev.push({t:'hit',a:t.id,d:e.id,dmg:dm,txt:'還火燒到 '+e.name+'：'+dm});dealTo(D,st,e,dm,ev,{noShare:true});}}
 if(tm(t,'deathHealTeam'))for(const a of alive(st,t.faction))if(manhattan(a,t)<=2)healU(D,st,t,a,tm(t,'deathHealTeam'),.1,ev,t.name+'〔燃己〕');}
function onKill(D,st,att,ev){if(att.hp<=0)return;if(tm(att,'killTeamHeal'))for(const a of alive(st,att.faction))healU(D,st,att,a,tm(att,'killTeamHeal'),0,ev,'');
 if(tm(att,'killSelfHeal'))healU(D,st,att,att,tm(att,'killSelfHeal'),0,ev,'');
 if(tm(att,'killCd'))for(const k in att.cd)if(att.cd[k]>0)att.cd[k]--;}
function wake(D,st,u,ev){if(!(u.slumber>0))return;u.slumber=0;ev.push({t:'say',txt:u.name+' 從蟄伏中醒來了！'});addSt(D,st,u,'might',3,ev,null);if(tm(u,'wakeTeam'))for(const a of alive(st,u.faction))if(a.id!==u.id)addSt(D,st,a,'might',3,ev,null);}
// 開戰時：天賦給的狀態
function openSt(D,st,ev){for(const u of st.units){if(u.hp<=0)continue;const o=tm(u,'open');if(Array.isArray(o))for(const [k,d] of o)addSt(D,st,u,k,d,ev,null);if(tm(u,'openShield'))u.st.shield=Math.round(u.maxHp*tm(u,'openShield'));
 const ot=tm(u,'openTeam');if(Array.isArray(ot))for(const a of st.units.filter(v=>v.faction===u.faction&&v.hp>0))for(const [k,d] of ot)addSt(D,st,a,k,d,ev,null);
 if(tm(u,'slumber')){u.slumber=1;ev.push({t:'say',txt:u.name+' 蟄伏著（受到的傷害減半、移動 −1）'});}}}
// 回合結束：持續傷害、再生、狀態倒數
function tickSt(D,st,ev){for(const u of alive(st)){
 for(const k of DOTS)if(sv(u,k)>0&&u.hp>0){const n=(u.st[k+'N']||1)*(1+(u.st[k+'P']||0));const s0=soldiers(u),h0=u.hp;
  if(u.sol>0)u.sol=Math.max(0,u.sol-Math.round(n*u.hpPer));else u.hp=Math.max(1,u.hp-Math.round(u.maxHp*.04*n));
  ev.push({t:'dot',d:u.id,txt:u.name+' '+STN[k]+'：'+(s0!==soldiers(u)?'士兵 '+s0+'→'+soldiers(u):'生命 '+h0+'→'+u.hp)});
  u.st[k]--;if(u.st[k]<=0){u.st[k+'N']=0;u.st[k+'P']=0;}}
 if(sv(u,'regen')>0||tm(u,'regenSelf')){const p=(sv(u,'regen')>0?.06:0)+tm(u,'regenSelf');const h=Math.min(u.maxHp-u.hp,Math.round(u.maxHp*p));const s0=soldiers(u);u.hp+=h;if(sv(u,'regen')>0)u.sol=Math.min(u.solMax,u.sol+u.hpPer);if(h>0||soldiers(u)>s0)ev.push({t:'heal',d:u.id,txt:u.name+' 再生：回復 '+h});}
 if(tm(u,'auraRegen'))for(const a of alive(st,u.faction))if(manhattan(a,u)<=2&&a.hp<a.maxHp){a.hp+=Math.min(a.maxHp-a.hp,Math.round(a.maxHp*tm(u,'auraRegen')));}
 if(tm(u,'auraCleanse'))for(const a of alive(st,u.faction))if(manhattan(a,u)<=2){for(const k of DOTS)if(sv(a,k)>0){a.st[k]=0;a.st[k+'N']=0;break;}}
 if(tm(u,'selfCleanse3')&&st.round%3===0&&clearBad(u,9))ev.push({t:'say',txt:u.name+'〔蛻皮〕清掉了身上的壞狀態'});
 if(sv(u,'doom')>0){u.st.doom--;if(u.st.doom<=0&&u.st.doomV){const v=u.st.doomV;u.st.doomV=0;ev.push({t:'hit',a:u.st.doomBy||u.id,d:u.id,dmg:v,txt:u.name+' 身上的延爆詛咒爆開：'+v});dealTo(D,st,u,v,ev,{noShare:true});}}
 for(const k of TIMED)if(sv(u,k)>0){u.st[k]--;if(k==='pact'&&u.st.pact<=0)u.st.pactN=0;}
 if(u.slumber>0&&st.round>=3)wake(D,st,u,ev);}}
// 通用技能：可以點的目標
function genTargets(D,st,u,to,S){const [a,b]=S.range||[0,0];
 if(S.tg==='enemy'){if(S.shape==='line')return targetsFrom(D,st,u,to,[1,1],true,true);return targetsFrom(D,st,u,to,S.range,true,!!S.noLos);}
 if(S.tg==='ally')return alive(st,u.faction).filter(v=>{const d=v.id===u.id?0:manhattan(to,v);return d>=a&&d<=b;}).map(v=>v.id);
 if(S.tg==='tile'){const out=[];for(let y=0;y<st.h;y++)for(let x=0;x<st.w;x++){const d=Math.abs(x-to.x)+Math.abs(y-to.y);if(d>=a&&d<=b)out.push(key(x,y));}return out;}
 return ['SELF'];}
// 通用技能：實際打到誰
function genArea(D,st,u,to,S,a){const isFoe=v=>v.faction!==u.faction&&sv(v,'stealth')<=0;let foes=[],allies=[];a=a||{};
 if(S.shape==='one'){const t=st.units.find(v=>v.id===a.target&&v.hp>0);if(t){if(S.tg==='ally')allies=[t];else foes=[t];}}
 else if(S.shape==='line'){const t=st.units.find(v=>v.id===a.target);if(t){const dx=Math.sign(t.x-to.x),dy=Math.sign(t.y-to.y);for(let i=1;i<=(S.len||3);i++){const v=unitAt(st,to.x+dx*i,to.y+dy*i);if(v&&isFoe(v))foes.push(v);}}}
 else if(S.shape==='area'){const c=a.at;if(c)for(const v of alive(st))if(Math.abs(v.x-c.x)<=1&&Math.abs(v.y-c.y)<=1&&isFoe(v))foes.push(v);}
 else if(S.shape==='around'){for(const v of alive(st))if(isFoe(v)&&manhattan(v,to)<=(S.r||1))foes.push(v);}
 else if(S.shape==='areaAlly'){const cc=a.at;if(cc)for(const v of alive(st,u.faction))if(Math.abs(v.x-cc.x)<=1&&Math.abs(v.y-cc.y)<=1)allies.push(v);}
 else if(S.shape==='allyAround'){for(const v of alive(st,u.faction)){const d=v.id===u.id?0:manhattan(v,to);if(d<=(S.r||1))allies.push(v);}}
 return {foes,allies};}
function applyHitSt(D,st,u,f,S,ev){for(const s of S.st||[]){if(s[2]!=null&&s[2]<1&&roll(st)>=s[2])continue;addSt(D,st,f,s[0],s[1],ev,u);}
 const ss=tm(u,'skillSt');if(Array.isArray(ss)&&roll(st)<ss[2])addSt(D,st,f,ss[0],ss[1],ev,u);
 if(tm(u,'slowFreeze')&&sv(f,'slow')>0&&roll(st)<tm(u,'slowFreeze'))addSt(D,st,f,'freeze',1,ev,u);}
function doGen(D,st,u,to,S,a,ev,cost){ev.push({t:'skill',a:u.id,sk:a.skill,at:a.at||null,tgt:a.target||null,big:S.cd>=5,txt:u.name+'「'+S.name+'」'});
 const A=genArea(D,st,u,to,S,a);const self=S.self||{};
 if(self.heal)healU(D,st,u,u,self.heal,0,ev,'');
 if(self.shield)u.st.shield=Math.max(sv(u,'shield'),Math.round(u.maxHp*self.shield));
 const so={mult:S.mult,noCounter:true,area:S.shape!=='one',skill:true,label:S.name,useDef:S.useDef,charge:cost,chargeP:S.chargeP,fx:S.fx};
 const hitOne=(f,mult)=>{if(f.hp<=0)return null;let m=mult;const pn=f.st.pactN||0;if(S.pactJudge&&pn){m+=S.pactJudge*pn;ev.push({t:'say',txt:'裁定：'+f.name+' 身上 '+pn+' 層厄契'});}if(S.shatter&&(sv(f,'freeze')>0||sv(f,'slow')>0)){m*=S.shatter;ev.push({t:'say',txt:f.name+' 碎裂！'});}
  const r=strike(D,st,u,to,f.id,ev,{...so,mult:m});if(r.hit&&f.hp>0)applyHitSt(D,st,u,f,S,ev);if(S.pactJudge&&pn&&r.hit){f.st.pact=0;f.st.pactN=0;if(pn>=3&&f.hp>0){addSt(D,st,f,'brk',2,ev,u);addSt(D,st,f,'fear',2,ev,u);}}return r;};
 if(S.shape==='rand'){const [ra,rb]=S.range||[1,3];for(let i=0;i<(S.hits||1);i++){const pool=alive(st).filter(v=>v.faction!==u.faction&&sv(v,'stealth')<=0&&manhattan(v,to)>=ra&&manhattan(v,to)<=rb);if(!pool.length)break;hitOne(pool[Math.floor(roll(st)*pool.length)%pool.length],S.mult);}}
 else if(S.mult>0){for(const f of A.foes)for(let h=0;h<(S.hits||1)&&f.hp>0;h++){const r=hitOne(f,S.mult);if(r&&r.hit&&tm(u,'bounce')&&roll(st)<tm(u,'bounce')){const o2=alive(st).find(v=>v.faction!==u.faction&&v.id!==f.id&&manhattan(v,f)<=2);if(o2){ev.push({t:'say',txt:'漣漪彈到 '+o2.name});strike(D,st,u,to,o2.id,ev,{...so,mult:S.mult*.5});}}}}
 else if(!S.doom){for(const f of A.foes)applyHitSt(D,st,u,f,S,ev);}
 if(S.doom){for(const f of A.foes){const p=withPos(u,to,()=>calc(D,st,u,to,f.id,{mult:S.doom*(1+tm(u,'doomP')),skill:true}));f.st.doom=3;f.st.doomV=Math.max(f.st.doomV||0,p.dmg);f.st.doomBy=u.id;ev.push({t:'status',d:f.id,txt:f.name+'：延爆詛咒（3 回合後爆開，約 '+p.dmg+'）'});}}
 if(S.quench)for(const f of A.foes){f.st.burn=0;f.st.burnN=0;}
 if(S.blockWarn&&a.at&&st.warn){const w0=st.warn.length;st.warn=st.warn.filter(w=>!(Math.abs(w.x-a.at.x)<=1&&Math.abs(w.y-a.at.y)<=1));if(st.warn.length<w0)ev.push({t:'purify',txt:'封界擋下了 '+(w0-st.warn.length)+' 格正在擴散的污染'});}
 const al=S.ally;if(al){for(const t of A.allies){let pct=al.heal||0;if(S.perPoison)pct+=S.perPoison*alive(st).filter(v=>v.faction!==u.faction&&sv(v,'poison')>0).length;
   if(pct||al.sol)healU(D,st,u,t,pct,al.sol||0,ev,'',al.low);
   if(al.shield)t.st.shield=Math.max(sv(t,'shield'),Math.round(t.maxHp*al.shield));
   if(al.cleanse){const hadDot=['burn','bleed','poison','doom'].some(k=>sv(t,k)>0);const n=clearBad(t,al.cleanse);if(n)ev.push({t:'say',txt:t.name+' 解除了 '+n+' 個壞狀態'});if(al.cleanseShield&&hadDot&&n){t.st.shield=Math.max(sv(t,'shield'),Math.round(t.maxHp*al.cleanseShield));ev.push({t:'shield',d:t.id,txt:t.name+' 得到月光護盾'});}}
   for(const s of al.st||[]){if(s[2]!=null&&roll(st)>=s[2])continue;addSt(D,st,t,s[0],s[1],ev,u);}}
  if(al.shield&&A.allies.length)ev.push({t:'say',txt:'護盾：'+A.allies.map(v=>v.name).join('、')});}
 if(S.oath){const t=st.units.find(v=>v.id===a.target);if(t){t.st.oath=S.oath;t.oathBy=u.id;ev.push({t:'status',d:t.id,txt:u.name+' 和 '+t.name+' 立誓（'+S.oath+' 回合）'});}}
 if(S.poisonNear){const t=A.allies[0]||u;const e=alive(st).filter(v=>v.faction!==u.faction).sort((p,q)=>manhattan(p,t)-manhattan(q,t)||(p.id<q.id?-1:1))[0];if(e&&manhattan(e,t)<=3)addSt(D,st,e,'poison',3,ev,u);}
 for(const s of self.st||[])addSt(D,st,u,s[0],s[1],ev,u);
 if(self.sure)u.st.sure=1;
 if(self.retreat&&a.target&&u.hp>0){const t=st.units.find(v=>v.id===a.target);if(t){const dx=Math.sign(to.x-t.x),dy=Math.sign(to.y-t.y);const nx=u.x+dx,ny=u.y+dy;if(inside(st,nx,ny)&&T(D,st,nx,ny).pass&&!unitAt(st,nx,ny)){u.x=nx;u.y=ny;ev.push({t:'move',a:u.id,from:{...to},to:{x:nx,y:ny},txt:u.name+' 退回 ('+nx+','+ny+')'});}}}}
// AI：評估通用技能
function aiGen(D,st,u,pos,c,sk,S,add,posPen,near,allies){const base={type:'ACT',actorId:u.id,to:pos,act:'SKILL',skill:sk};const pp=posPen(c);
 const stV=f=>(S.st||[]).reduce((s,x)=>s+((x[0]==='freeze'||x[0]==='charm')?6:x[0]==='seal'?(f.skills&&f.skills.length?3:1):2)*(x[2]==null?1:x[2])*(sv(f,x[0])>0?.3:1),0);
 const dmgV=(f,mult,hits)=>{const p=preview(D,st,u,pos,f.id,{mult:mult*(hits||1),noCounter:true,skill:true,area:S.shape!=='one',useDef:S.useDef});return scoreHit(D,st,u,pos,f.id,p);};
 const foeVal=list=>list.reduce((s,f)=>s+(S.mult>0?dmgV(f,S.mult,S.hits):0)+stV(f)+(S.doom?4:0),0);
 if(S.tg==='enemy'){for(const tid of withPos(u,pos,()=>genTargets(D,st,u,pos,S))){const A=withPos(u,pos,()=>genArea(D,st,u,pos,S,{target:tid}));if(!A.foes.length)continue;add(foeVal(A.foes)+1+pp,{...base,target:tid});}return;}
 if(S.tg==='tile'&&S.shape==='areaAlly'){if(near>4)return;let best=null,bv=0;for(const t of allies.concat([u])){for(const [dx,dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const x=(t.id===u.id?pos.x:t.x)+dx,y=(t.id===u.id?pos.y:t.y)+dy;const d=Math.abs(x-pos.x)+Math.abs(y-pos.y);if(d<S.range[0]||d>S.range[1]||!inside(st,x,y))continue;const A=withPos(u,pos,()=>genArea(D,st,u,pos,S,{at:{x,y}}));const v=A.allies.length*1.6;if(v>bv){bv=v;best={x,y};}}}if(best&&bv>=3)add(bv+pp,{...base,at:best});return;}
 if(S.tg==='tile'){if(near>6)return;const seen=new Set();for(const f of alive(st).filter(v=>v.faction!==u.faction)){for(const [dx,dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const x=f.x+dx,y=f.y+dy;const k=key(x,y);if(seen.has(k)||!inside(st,x,y))continue;seen.add(k);const d=Math.abs(x-pos.x)+Math.abs(y-pos.y);if(d<S.range[0]||d>S.range[1])continue;const A=withPos(u,pos,()=>genArea(D,st,u,pos,S,{at:{x,y}}));if(!A.foes.length)continue;add(foeVal(A.foes)+(A.foes.length>1?3:0)+pp,{...base,at:{x,y}});}}return;}
 if(S.tg==='ally'){for(const tid of withPos(u,pos,()=>genTargets(D,st,u,pos,S))){const t=st.units.find(v=>v.id===tid);let v=0;if(S.ally){const miss=(t.maxHp-t.hp)/t.maxHp;v+=miss*14*(S.ally.heal?1:0)+(S.ally.cleanse?BAD.filter(k=>sv(t,k)>0).length*2:0);}if(S.oath)v+=(t.id!==u.id&&near<=4&&!(sv(t,'oath')>0))?(1-t.hp/t.maxHp)*10+3:-5;if(S.poisonNear)v+=1;if(v>2.5)add(v+pp,{...base,target:tid});}return;}
 const A=withPos(u,pos,()=>genArea(D,st,u,pos,S,{}));let v=0;
 if(S.shape==='around')v=A.foes.length?foeVal(A.foes)+(A.foes.length>1?2:-2):-9;
 else if(S.shape==='rand'){const [ra,rb]=S.range||[1,3];const pool=alive(st).filter(f=>f.faction!==u.faction&&sv(f,'stealth')<=0&&manhattan(f,pos)>=ra&&manhattan(f,pos)<=rb);v=pool.length?pool.reduce((s,f)=>s+dmgV(f,S.mult,1),0)/pool.length*(S.hits||1)*.8:-9;}
 else if(S.shape==='allyAround'&&S.ally){for(const t of A.allies){if(S.ally.heal)v+=(t.maxHp-t.hp)/t.maxHp*8;if((S.ally.shield||(S.ally.st||[]).some(x=>['ward','proxy','might'].includes(x[0])))&&near<=3)v+=2;if((S.ally.st||[]).some(x=>x[0]==='regen'))v+=(t.maxHp-t.hp)/t.maxHp*3;if(S.ally.cleanse)v+=BAD.filter(k=>sv(t,k)>0).length*2;}if(S.self&&S.self.st&&S.self.st.some(x=>x[0]==='taunt'))v+=near<=2?3:0;}
 else {v=near<=3?5:-3;if(S.self&&S.self.st&&S.self.st.some(x=>x[0]==='undying'||x[0]==='shell'))v+=u.hp<u.maxHp*.6?5:-2;if(S.self&&S.self.st&&S.self.st.some(x=>x[0]==='stealth'||x[0]==='echo'))v+=near<=4?1:-3;}
 if(v>2)add(v+pp,base);}

// ---------- 行動驗證 ----------
const ACTS=['ATTACK','WAIT','GUARD','SKILL','RESCUE'];
function moveOpts(D,u,a){if(a.act==='SKILL'&&a.skill==='shadowStep'){const S=D.skills.shadowStep;return {extra:S.extraMove,ignoreZoc:true};}return {};}
function skillTargets(D,st,u,to,sk){sk=sk||u.skills[0];const S=D.skills[sk];if(!S)return [];
 return withPos(u,to,()=>{
  if(S.kind==='attack')return targetsFrom(D,st,u,to,S.range,true,!!S.noLos);
  if(S.kind==='around')return targetsFrom(D,st,u,to,[1,1],true);
  if(S.kind==='dash')return targetsFrom(D,st,u,to,null,true);
  if(S.kind==='ally')return alive(st,u.faction).filter(v=>{const d=v.id===u.id?0:manhattan(to,v);return d>=S.range[0]&&d<=S.range[1];}).map(v=>v.id);
  if(S.kind==='gen')return genTargets(D,st,u,to,S);
  if(S.kind==='zone'){const out=[];for(let y=0;y<st.h;y++)for(let x=0;x<st.w;x++){const d=Math.abs(x-to.x)+Math.abs(y-to.y);if(d>=S.range[0]&&d<=S.range[1])out.push(key(x,y));}return out;}
  return [];});}
function validate(D,st,a){if(st.result)return 'battle_over';
 if(a.type==='RETREAT'){if(st.result)return 'over';return null;}
 if(a.type==='END_PHASE')return st.phase==='PLAYER'?null:'not_player_phase';
 if(a.type!=='ACT')return 'bad_type';const u=st.units.find(v=>v.id===a.actorId);if(!u||u.hp<=0)return 'no_actor';
 const want=st.phase==='PLAYER'?'P':'E';if(u.faction!==want)return 'not_your_unit';if(u.usedAct)return 'already_acted';
 if(!ACTS.includes(a.act))return 'bad_act';
 const to=a.to||{x:u.x,y:u.y};if(!inside(st,to.x,to.y))return 'out_of_map';const R=reachable(D,st,u,moveOpts(D,u,a));if(!R.has(key(to.x,to.y)))return 'unreachable';
 if(a.act==='RESCUE'&&!(u.faction==='P'&&st.escort&&st.escort.status==='trapped'&&manhattan(to,st.escort)<=1))return 'not_rescuable';
 if(a.act==='ATTACK'){const ts=withPos(u,to,()=>targetsFrom(D,st,u,to));if(!ts.includes(a.target))return 'bad_target';}
 if(a.act==='SKILL'){if(!a.skill||!u.skills.includes(a.skill))return 'no_skill';if((u.cd[a.skill]||0)>0)return 'cooldown';if(sv(u,'seal')>0)return 'sealed';const S=D.skills[a.skill];const ts=skillTargets(D,st,u,to,a.skill);
  if(S.kind==='gen'){if(S.tg==='enemy'||S.tg==='ally'){if(!ts.includes(a.target))return 'bad_target';}if(S.tg==='tile'){if(!a.at||!ts.includes(key(a.at.x,a.at.y)))return 'bad_target';}}
  if(S.kind==='attack'||S.kind==='ally'){if(!ts.includes(a.target))return 'bad_target';}
  if(S.kind==='around'&&!ts.length)return 'no_target';
  if(S.kind==='dash'&&a.target!=null){if(!ts.includes(a.target))return 'bad_target';}
  if(S.kind==='zone'){if(!a.at||!ts.includes(key(a.at.x,a.at.y)))return 'bad_target';}}
 return null;}

function apply(D,st0,a){const err=validate(D,st0,a);if(err)return {ok:false,error:err,state:st0,events:[]};const st=clone(st0);const ev=[];
 if(a.type==='RETREAT'){st.result={win:false,reason:'撤退了'};st.phase='RESULT';ev.push({t:'end',txt:'失敗：撤退了'});}
 else if(a.type==='END_PHASE'){phaseEnd(st,'P');runEnemyPhase(D,st,ev);}else doAct(D,st,a,ev);
 st.eventLog.push(...ev.map(e=>({...e,round:st.round})));if(st.eventLog.length>500)st.eventLog=st.eventLog.slice(-500);
 return {ok:true,state:st,events:ev};}

// ---------- 結算 ----------
function doAct(D,st,a,ev){const u=st.units.find(v=>v.id===a.actorId);const to=a.to||{x:u.x,y:u.y};const cost=reachable(D,st,u,moveOpts(D,u,a)).get(key(to.x,to.y))||0;
 u.stay=!(to.x!==u.x||to.y!==u.y);if(to.x!==u.x||to.y!==u.y){ev.push({t:'move',a:u.id,from:{x:u.x,y:u.y},to:{...to},txt:u.name+' 移動到 ('+to.x+','+to.y+')'+(a.act==='SKILL'&&a.skill==='shadowStep'?'〔影徑〕':'')});u.x=to.x;u.y=to.y;}
 const attackWithCounter=(tid,o)=>{const r=strike(D,st,u,to,tid,ev,o);const tgt=tid==='GATE'?null:st.units.find(v=>v.id===tid);
  if(!o.noCounter&&tgt&&tgt.hp>0&&u.hp>0&&canCounter(tgt)){const [ra,rb]=rangeOf(D,st,tgt,tgt);const d=manhattan(to,tgt);if(d>=ra&&d<=rb&&(d===1||los(D,st,tgt,to))&&!(tgt.st&&tgt.st.stun))strike(D,st,tgt,{x:tgt.x,y:tgt.y},u.id,ev,{counter:true});}return r;};
 if(a.act==='RESCUE'){st.escort.status='escorting';st.escort.carrier=u.id;u.escorting=true;ev.push({t:'rescue',a:u.id,txt:u.name+' 解開了繩索，開始護送推車人。移動 −1，其他隊伍請掩護回程。'});}
 else if(a.act==='ATTACK'){attackWithCounter(a.target,{charge:cost,normal:true});}
 else if(a.act==='GUARD'){u.guard=true;ev.push({t:'guard',a:u.id,txt:u.name+' 守備（防禦 +30%，到下次行動前）'});}
 else if(a.act==='SKILL'){const sk=a.skill,S=D.skills[sk];u.cd[sk]=hasT(u,'quick')?Math.max(2,S.cd-1):S.cd;if(tm(u,'freeSkillOnce')&&!u.freeUsed){u.freeUsed=1;u.cd[sk]=0;ev.push({t:'say',txt:u.name+' 這一招不進入冷卻'});}
  if(tm(u,'castCost')){const c0=Math.round(u.maxHp*tm(u,'castCost'));u.hp=Math.max(1,u.hp-c0);}
  if(S.kind==='gen'){doGen(D,st,u,to,S,a,ev,cost);}else
  if(sk==='guardStance'){u.st.gs=S.dur;ev.push({t:'skill',a:u.id,txt:u.name+'「'+S.name+'」：相鄰隊友的傷害 40% 由它承受，持續 '+S.dur+' 回合'});}
  else if(sk==='pierce'){const t=st.units.find(v=>v.id===a.target);const dx=t.x-to.x,dy=t.y-to.y;const behind=unitAt(st,t.x+dx,t.y+dy);
   ev.push({t:'skill',a:u.id,txt:u.name+'「'+S.name+'」'});strike(D,st,u,to,t.id,ev,{mult:S.mult,noCounter:true,area:true,label:'突刺'});
   if(behind&&behind.faction!==u.faction&&behind.hp>0)strike(D,st,u,to,behind.id,ev,{mult:S.mult,noCounter:true,area:true,label:'貫穿'});}
  else if(sk==='markShot'){ev.push({t:'skill',a:u.id,txt:u.name+'「'+S.name+'」'});const r=strike(D,st,u,to,a.target,ev,{mult:S.mult,label:'標記射擊'});const t=st.units.find(v=>v.id===a.target);
   if(r.hit&&t.hp>0){t.st.mark=Math.max(t.st.mark,S.mark);ev.push({t:'status',d:t.id,txt:t.name+' 被標記 '+S.mark+' 回合（受到傷害 +20%）'});}
   if(t.hp>0&&u.hp>0&&canCounter(t)){const [ra,rb]=rangeOf(D,st,t,t);const d=manhattan(to,t);if(d>=ra&&d<=rb&&(d===1||los(D,st,t,to)))strike(D,st,t,{x:t.x,y:t.y},u.id,ev,{counter:true});}}
  else if(sk==='bind'){ev.push({t:'skill',a:u.id,txt:u.name+'「'+S.name+'」'});const r=strike(D,st,u,to,a.target,ev,{mult:S.mult,noCounter:true,label:'束縛'});const t=st.units.find(v=>v.id===a.target);
   if(r.hit&&t.hp>0){t.st.root=Math.max(t.st.root,S.root);ev.push({t:'status',d:t.id,txt:t.name+' 被束縛：下一個回合不能移動'});}}
  else if(sk==='mend'){const t=st.units.find(v=>v.id===a.target);const cl=t.st.root>0||t.st.mark>0;t.st.root=0;t.st.mark=0;healU(D,st,u,t,S.heal,S.solHeal,ev,u.name+'「'+S.name+'」');if(cl)ev.push({t:'say',txt:t.name+' 解除了束縛與標記'});
   if(S.purify){let n=0;for(const [dx,dy] of [[0,0],...DIRS]){const x=t.x+dx,y=t.y+dy;if(!inside(st,x,y))continue;const w0=st.warn.length;st.warn=st.warn.filter(w=>!(w.x===x&&w.y===y));if(st.warn.length<w0)n++;if(tileAt(st,x,y)==='FLESH'){st.tiles[y*st.w+x]='PLAIN';n++;}}
    if(n){updCorr(D,st);ev.push({t:'purify',a:u.id,txt:'光縫淨化了 '+n+' 格污染（濁度 '+st.corr+'）'});}}}
  else if(sk==='lampZone'){st.zones=st.zones.filter(z=>z.owner!==u.id);st.zones.push({x:a.at.x,y:a.at.y,faction:u.faction,owner:u.id,until:st.round+S.dur-1});ev.push({t:'zone',a:u.id,txt:u.name+'「'+S.name+'」：以 ('+a.at.x+','+a.at.y+') 為中心 3×3，持續 '+S.dur+' 回合'});}
  else if(sk==='shadowStep'){ev.push({t:'skill',a:u.id,txt:u.name+'「'+S.name+'」'});if(a.target!=null)attackWithCounter(a.target,{flank:S.flank});}
  else if(sk==='massMend'){ev.push({t:'skill',a:u.id,txt:u.name+'「'+S.name+'」'});for(const t of alive(st,u.faction)){if(manhattan(t,to)>S.radius)continue;healU(D,st,u,t,S.heal,S.solHeal,ev,'');}}
  else if(sk==='sweep'){ev.push({t:'skill',a:u.id,txt:u.name+'「'+S.name+'」'});for(const tid of skillTargets(D,st,u,to,sk)){const t=st.units.find(v=>v.id===tid);if(t&&t.hp>0)strike(D,st,u,to,tid,ev,{mult:S.mult,noCounter:true,area:true,label:'橫掃'});}}
  else if(S.kind==='attack'){ev.push({t:'skill',a:u.id,txt:u.name+'「'+S.name+'」'});const r=strike(D,st,u,to,a.target,ev,{mult:S.mult,noCounter:!!S.noCounter,flank:S.flank,label:S.name});const t=st.units.find(v=>v.id===a.target);
   if(r.hit&&t&&t.hp>0&&(S.push||S.pull)){const dx=Math.sign(t.x-to.x),dy=Math.sign(t.y-to.y);const dir=S.push?1:-1;let sx=dx,sy=dy;if(sx&&sy){if(Math.abs(t.x-to.x)>=Math.abs(t.y-to.y))sy=0;else sx=0;}
    const nx=t.x+sx*dir,ny=t.y+sy*dir;if(inside(st,nx,ny)&&T(D,st,nx,ny).pass&&!unitAt(st,nx,ny)&&!(nx===to.x&&ny===to.y)){t.x=nx;t.y=ny;ev.push({t:'push',d:t.id,txt:t.name+(S.push?' 被撞退':' 被拉近')+'到 ('+nx+','+ny+')'});}else ev.push({t:'push',d:t.id,txt:t.name+(S.push?' 後面被擋住，撞不動':' 拉不動')});}
   if(!S.noCounter&&t&&t.hp>0&&u.hp>0&&canCounter(t)){const [ra,rb]=rangeOf(D,st,t,t);const d=manhattan(to,t);if(d>=ra&&d<=rb&&(d===1||los(D,st,t,to)))strike(D,st,t,{x:t.x,y:t.y},u.id,ev,{counter:true});}}}
 else ev.push({t:'wait',a:u.id,txt:u.name+' 待機'});
 u.usedAct=true;objAfterAct(D,st,u,ev);checkEnd(D,st,ev);}
// 救人：我方行動結束時站在還沒救的屋子上
function objAfterAct(D,st,u,ev){const O=st.obj||{};if(O.type!=='rescue'||u.faction!=='P'||u.hp<=0)return;const k=key(u.x,u.y);if(O.tiles.some(([x,y])=>x===u.x&&y===u.y)&&!st.done.includes(k)){st.done.push(k);ev.push({t:'say',txt:u.name+' 把屋裡的人帶出來了（'+st.done.length+'／'+O.need+'）'});}}

// ---------- 回合流程 ----------
function M_(D,st){return D.missions[st.missionId];}
function phaseStart(st,f){for(const u of alive(st,f)){u.usedAct=false;u.guard=false;u.stay=false;for(const k in u.cd)if(u.cd[k]>0)u.cd[k]--;if(sv(u,'freeze')>0||sv(u,'charm')>0){u.usedAct=true;u.st.freeze=0;u.st.charm=0;u.skipped=1;}else u.skipped=0;}}
function phaseEnd(st,f){for(const u of alive(st,f))if(u.st.root>0)u.st.root--;}
function roundStart(D,st,ev=[]){const M=M_(D,st);
 // 預告到期的格子生效（燈界裡的不會）
 const due=st.warn.filter(w=>w.at===st.round);st.warn=st.warn.filter(w=>w.at!==st.round);let changed=0;
 for(const w of due){if(inZone(st,w.x,w.y,'P')){ev.push({t:'stabilize',txt:'燈界穩住了 ('+w.x+','+w.y+')：這一格沒有被污染。'});continue;}if(T(D,st,w.x,w.y).pass&&tileAt(st,w.x,w.y)!=='FLESH'){st.tiles[w.y*st.w+w.x]=w.to;changed++;}}
 if(changed){updCorr(D,st);ev.push({t:'corrupt',txt:changed+' 格變成了污染地（濁度 '+st.corr+'）'});}
 for(const e of M.events.filter(e=>e.round===st.round)){
  if(e.terrain)for(const [x,y,t] of e.terrain){if(inZone(st,x,y,'P')){ev.push({t:'stabilize',txt:'燈界穩住了 ('+x+','+y+')：這一格沒有被異變改寫。'});continue;}st.tiles[y*st.w+x]=t;}
  if(e.spawnCommander)spawnCmd(D,st,M,ev);
  if(e.wave){const F=D.factions[st.faction];const em=1+(D.levelStep||0)*Math.min(st.level||0,D.levelMax||0);for(const [si,x,y] of e.wave){const [t,name,art]=F.slots[si];const p=freeNear(D,st,x,y);if(!p)continue;const u=makeUnit(D,t,'E'+(st.nextId++),'E',p.x,p.y,{name,glyph:name[0],art:'enemies/tok_'+art+'.webp',por:'enemies/por_'+art+'.webp'});{u.hp=u.maxHp=Math.round(u.hp*em*EMH(D));u.atk=Math.round(u.atk*em*EMA(D));u.mag=Math.round(u.mag*em*EMA(D));}st.units.push(u);}ev.push({t:'spawn',txt:'援軍進場'});}
  if(e.warn)for(const [x,y] of e.warn)st.warn.push({x,y,to:'FLESH',at:st.round+1});if(e.pressure)st.pressure=true;
  if(e.say)ev.push({t:'say',txt:'【第 '+st.round+' 回合】'+e.say});}
 if(st.round>1&&st.round%2===0)for(const u of alive(st,'P'))if(hasP(u,'refill')&&u.sol<u.solMax){const n0=soldiers(u);u.sol=Math.min(u.solMax,u.sol+u.hpPer);if(soldiers(u)>n0)ev.push({t:'heal',d:u.id,txt:u.name+'〔補員〕補回 1 名士兵'});}
 phaseStart(st,'P');st.phase='PLAYER';return ev;}
function spawnCmd(D,st,M,ev){const F=D.factions[st.faction];const [t,name,art]=F.commander;const [cx,cy]=M.commanderAt;const p=freeNear(D,st,cx,cy);if(!p)return;const u=makeUnit(D,t,'E'+(st.nextId++),'E',p.x,p.y,{name,glyph:name[0],art:'bosses/tok_'+art+'.webp',por:'bosses/por_'+art+'.webp',commander:true});const em=1+(D.levelStep||0)*Math.min(st.level||0,D.levelMax||0);{u.hp=u.maxHp=Math.round(u.hp*em*EMH(D));u.atk=Math.round(u.atk*em*EMA(D));u.mag=Math.round(u.mag*em*EMA(D));}
 if(D.cmdSkill&&D.cmdSkill[st.faction]&&D.skills[D.cmdSkill[st.faction]])u.skills=[D.cmdSkill[st.faction]];
 if(M.cmdMult){const k=M.cmdMult;if(k.hp){u.hp=u.maxHp=Math.round(u.hp*k.hp);u.sol=u.solMax=Math.round(u.solMax*k.hp);}if(k.atk){u.atk=Math.round(u.atk*k.atk);u.mag=Math.round(u.mag*k.atk);}if(k.def)u.def=Math.round(u.def*k.def);}
 if(M.commanderLeash){u.anchor={x:p.x,y:p.y};u.leash=M.commanderLeash;}st.units.push(u);ev.push({t:'spawn',a:u.id,txt:u.name+' 進場：'+F.line});}
function pendingSpawns(D,st){const M=M_(D,st);return M.events.some(e=>e.round>st.round&&(e.wave||e.spawnCommander));}
function freeNear(D,st,x,y){for(let r=0;r<6;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.abs(dx)+Math.abs(dy)!==r)continue;const nx=x+dx,ny=y+dy;if(inside(st,nx,ny)&&T(D,st,nx,ny).pass&&!unitAt(st,nx,ny))return {x:nx,y:ny};}return null;}
function runEnemyPhase(D,st,ev){st.phase='ENEMY';phaseStart(st,'E');
 const order=alive(st,'E').map(u=>u.id);st.frames=[];
 for(const id of order){if(st.result)break;const u=st.units.find(v=>v.id===id);if(!u||u.hp<=0)continue;if(u.usedAct){if(u.skipped){const sub=[{t:'say',txt:u.name+' 動不了（凍住／魅惑）'}];ev.push(...sub);st.frames.push({actor:id,units:st.units.map(v=>[v.id,v.x,v.y,v.hp,v.sol]),gate:st.gate.hp,events:sub});}continue;}const a=plan(D,st,u);const err=validate(D,st,a);
  if(err){ev.push({t:'ai_error',a:id,txt:'AI 行動不合法：'+err});u.usedAct=true;continue;}const sub=[];doAct(D,st,a,sub);ev.push(...sub);
  st.frames.push({actor:id,units:st.units.map(v=>[v.id,v.x,v.y,v.hp,v.sol]),gate:st.gate.hp,events:sub});}
 phaseEnd(st,'E');if(!st.result)roundEnd(D,st,ev);}
function roundEnd(D,st,ev){const M=M_(D,st);
 for(const u of st.units){if(u.st.mark>0)u.st.mark--;if(u.st.gs>0)u.st.gs--;}
 pollute(D,st,ev);if(st.result)return;tickSt(D,st,ev);checkEnd(D,st,ev);if(st.result)return;
 st.zones=st.zones.filter(z=>z.until>st.round);
 const O=st.obj||{type:'gate'};
 if(O.type==='hold'){const on=f=>alive(st,f).some(u=>O.tiles.some(([x,y])=>u.x===x&&u.y===y));if(on('P')&&!on('E')){st.hold++;ev.push({t:'say',txt:'守住驛站一回合（'+st.hold+'／'+O.need+'）'});if(st.hold>=O.need){st.result={win:true,reason:'守住驛站 '+O.need+' 回合'};ev.push({t:'end',txt:'勝利：'+st.result.reason});st.phase='RESULT';return;}}}
 if(O.type==='reach'){const n=alive(st,'P').filter(u=>O.tiles.some(([x,y])=>u.x===x&&u.y===y)).length;if(n>=O.need){st.result={win:true,reason:n+' 隊抵達對岸'};ev.push({t:'end',txt:'勝利：'+st.result.reason});st.phase='RESULT';return;}if(n)ev.push({t:'say',txt:'對岸已經有 '+n+'／'+O.need+' 隊'});}
 if(O.type==='defend'){const n=alive(st,'E').filter(u=>O.tiles.some(([x,y])=>u.x===x&&u.y===y)).length;if(n){st.breach+=n;ev.push({t:'say',txt:'有 '+n+' 隊敵人過了橋（'+st.breach+'／'+O.max+'）'});if(st.breach>=O.max){st.result={win:false,reason:'太多敵人過了橋'};ev.push({t:'end',txt:'失敗：'+st.result.reason});st.phase='RESULT';return;}}}
 if(O.seals){for(const [x,y] of O.seals){const k=key(x,y);if(st.lit.includes(k))continue;const p=alive(st,'P').some(u=>u.x===x&&u.y===y),e=alive(st,'E').some(u=>u.x===x&&u.y===y);if(p&&!e){st.lit.push(k);ev.push({t:'say',txt:'燈點起來了（'+st.lit.length+'／'+O.seals.length+'）'+(st.lit.length>=O.seals.length?'：鐘聲停了，指揮官不再被保護':'')});}}}
 if(st.round>=M.roundLimit&&alive(st,'P').length){if((O.type==='gate'&&st.gate.hp>0)||O.type==='defend'){st.result={win:true,reason:O.type==='defend'?'守住石橋到第 '+M.roundLimit+' 回合結束':'守住城門到第 '+M.roundLimit+' 回合結束'};ev.push({t:'end',txt:'勝利：'+st.result.reason});}
  else{st.result={win:false,reason:O.timeout?O.timeout:O.type==='boss'?'時間到了，指揮退回礦坑深處':O.type==='hold'?'時間到了，驛站沒能守住':'時間到了，霧裡還有敵人'};ev.push({t:'end',txt:'失敗：'+st.result.reason});}st.phase='RESULT';return;}
 st.round++;roundStart(D,st,ev);checkEnd(D,st,ev);}
function updCorr(D,st){const n=st.tiles.filter(t=>t==='FLESH').length;st.corr=Math.min(100,n*D.corruption.perTile);}
// 污染：侵蝕站在上面的我方、到 100 時壓迫城門、往外擴散（先預告，隔一回合才生效）
function pollute(D,st,ev){const K=D.corruption;updCorr(D,st);
 for(const u of alive(st,'P'))if(tileAt(st,u.x,u.y)==='FLESH'&&u.sol>0&&!hasP(u,'clean')){const n0=soldiers(u);u.sol=Math.max(0,u.sol-K.erodeSoldiers*u.hpPer);if(soldiers(u)<n0)ev.push({t:'soldier',d:u.id,txt:u.name+' 站在污染地上，士兵被侵蝕 '+(n0-soldiers(u))+' 名'});}
 if(st.corr>=100&&st.gate.hp>0){st.gate.hp=Math.max(0,st.gate.hp-K.gateHitAt100);ev.push({t:'gate',txt:'濁度滿了：污染爬上城門，城門 −'+K.gateHitAt100});checkEnd(D,st,ev);if(st.result)return;}
 const src=[];for(let y=0;y<st.h;y++)for(let x=0;x<st.w;x++)if(tileAt(st,x,y)==='FLESH'&&!inZone(st,x,y,'P'))src.push({x,y});
 if(!src.length)return;let want=st.corr>=75?K.spreadAt75:K.spreadPerRound;const start=Math.floor(roll(st)*src.length);let made=0;
 for(let i=0;i<src.length&&made<want&&st.warn.length<K.maxWarn;i++){const s=src[(start+i)%src.length];
  const nb=DIRS.map(([dx,dy])=>({x:s.x+dx,y:s.y+dy})).filter(p=>inside(st,p.x,p.y)&&T(D,st,p.x,p.y).pass&&tileAt(st,p.x,p.y)!=='FLESH'&&!st.warn.some(w=>w.x===p.x&&w.y===p.y)&&!inZone(st,p.x,p.y,'P'));
  if(!nb.length)continue;const p=nb[Math.floor(roll(st)*nb.length)];st.warn.push({x:p.x,y:p.y,to:'FLESH',at:st.round+2});made++;}
 if(made)ev.push({t:'warn',txt:'污染正在擴散：'+made+' 格出現暗紅的微光，下下回合開始時會變成污染地（濁度 '+st.corr+'）'});}
function checkEnd(D,st,ev){if(st.result)return;
 if(st.escort&&st.escort.status==='escorting'){const u=st.units.find(u=>u.id===st.escort.carrier);if(!u||u.hp<=0){st.escort.status='failed';st.result={win:false,reason:'護送隊倒下，救援未能完成'};}else{st.escort.x=u.x;st.escort.y=u.y;if(st.obj.exit.some(([x,y])=>u.x===x&&u.y===y)){st.escort.status='safe';st.result={win:true,reason:'推車人已平安撤回南門'};}}if(st.result){st.phase='RESULT';ev.push({t:'end',txt:(st.result.win?'勝利：':'失敗：')+st.result.reason});return;}}
 const O=st.obj||{type:'gate'};const lose=(!st.gate.none&&st.gate.hp<=0)?'城門被打破':!alive(st,'P').length?'我方全滅':null;
 const cmdDown=st.units.some(u=>u.commander&&u.hp<=0);const routed=O.type==='rout'&&!alive(st,'E').length&&!pendingSpawns(D,st);const saved=O.type==='rescue'&&st.done&&st.done.length>=O.need;
 if(lose){st.result={win:false,reason:lose};}else if(cmdDown&&O.type!=='rout'&&O.type!=='escort'){st.result={win:true,reason:O.type==='gate'?'擊倒敵軍指揮官，城門還在':'擊倒敵方指揮官'};}else if(routed){st.result={win:true,reason:'霧裡的敵人全部清掉了'};}else if(saved){st.result={win:true,reason:'村裡的人都救出來了'};}
 if(st.result){st.phase='RESULT';ev.push({t:'end',txt:(st.result.win?'勝利：':'失敗：')+st.result.reason});}}

// ---------- AI（敵我共用；只送出合法行動） ----------
function distMap(D,st,targets){const dm=new Map();const q=[];for(const t of targets){dm.set(key(t.x,t.y),0);q.push([0,t.x,t.y]);}
 while(q.length){q.sort((a,b)=>a[0]-b[0]);const [c,x,y]=q.shift();if(c>dm.get(key(x,y)))continue;for(const [dx,dy] of DIRS){const nx=x+dx,ny=y+dy;if(!inside(st,nx,ny))continue;const t=T(D,st,nx,ny);if(!t.pass)continue;const nc=c+t.cost;if(nc<(dm.get(key(nx,ny))??Infinity)){dm.set(key(nx,ny),nc);q.push([nc,nx,ny]);}}}return dm;}
const effHp=t=>t.hp+t.sol;
function scoreHit(D,st,u,c,tid,p,extra){const tgt=tid==='GATE'?null:st.units.find(v=>v.id===tid);const exp=p.dmg*p.hit;
 const killV=p.kill?(tgt&&tgt.commander?14:10):0;
 const objV=tgt?(exp/Math.max(1,effHp(tgt)))*6+(tgt.troop==='MAGE'||tgt.troop==='ARCHER'||tgt.troop==='CLERIC'?1:0)+(tgt.commander?3:0):(u.faction==='E'?(st.pressure?7:4)*(exp/30):0);
 const terr=terrainDef(D,st,c.x,c.y)*10;const cnt=(p.cm-1)*10;const risk=p.counter&&!p.kill?(p.counter.dmg*p.counter.hit/Math.max(1,effHp(u)))*10:0;
 const taunt=tgt&&sv(tgt,'taunt')>0&&u.faction!==tgt.faction?8:0;
 return killV*4+objV*3+terr*2+cnt*2-risk*3+taunt+(extra||0);}
function plan(D,st,u,style){if(st.escort&&st.escort.status==='trapped'&&u.faction==='P'&&manhattan(u,st.escort)<=1)return {type:'ACT',actorId:u.id,to:{x:u.x,y:u.y},act:'RESCUE'};const opts=[];const add=(s,a)=>opts.push({s,a});
 const R=reachable(D,st,u);let cand=[...R.keys()].map(k=>{const [x,y]=k.split(',').map(Number);return {x,y,c:R.get(k)};}).sort((a,b)=>a.y-b.y||a.x-b.x);
 if(u.escorting&&st.obj.type==='escort'){const dm=distMap(D,st,st.obj.exit.map(([x,y])=>({x,y})));cand.sort((a,b)=>(dm.get(key(a.x,a.y))??999)-(dm.get(key(b.x,b.y))??999));const p=cand[0];return {type:'ACT',actorId:u.id,to:{x:p.x,y:p.y},act:'GUARD'};}
 if(u.anchor&&u.leash){const c2=cand.filter(c=>manhattan(c,u.anchor)<=u.leash);if(c2.length)cand=c2;}
 const O=st.obj||{type:'gate'};
 const foes=alive(st).filter(v=>v.faction!==u.faction);const allies=alive(st,u.faction);
 const near=foes.length?Math.min(...foes.map(f=>manhattan(f,u))):99;
 const hold=style==='hold'&&u.faction==='P';
 const objTiles=O.type==='escort'&&u.faction==='P'?(st.escort.status==='trapped'?[st.escort]:st.escort.carrier===u.id?O.exit.map(([x,y])=>({x,y})):null):O.type==='hold'?O.tiles.map(([x,y])=>({x,y})):(O.type==='rescue'&&u.faction==='P')?O.tiles.filter(([x,y])=>!st.done.includes(key(x,y))).map(([x,y])=>({x,y})):(O.type==='reach'&&u.faction==='P')?O.tiles.map(([x,y])=>({x,y})):(O.type==='defend'&&u.faction==='E')?O.tiles.map(([x,y])=>({x,y})):(O.seals&&u.faction==='P')?O.seals.filter(([x,y])=>!st.lit.includes(key(x,y))).map(([x,y])=>({x,y})):null;
 const posPen=c=>(hold&&O.type==='gate'&&c.y<6?-(6-c.y)*1.5:0)+(objTiles&&objTiles.some(t=>t.x===c.x&&t.y===c.y)?(u.faction==='P'?2.5:2):0)-(u.faction==='P'&&tileAt(st,c.x,c.y)==='FLESH'&&!hasP(u,'clean')?1.5:0);
 const ready=sv(u,'seal')>0?[]:u.skills.filter(k=>!(u.cd[k]>0)&&D.skills[k]);
 for(const c of cand){const pos={x:c.x,y:c.y};
  for(const tid of withPos(u,pos,()=>targetsFrom(D,st,u,pos))){const p=preview(D,st,u,pos,tid,{charge:c.c});add(scoreHit(D,st,u,pos,tid,p)+posPen(c),{type:'ACT',actorId:u.id,to:pos,act:'ATTACK',target:tid});}
  for(const sk of ready){const S=D.skills[sk];
   if(S.kind==='around'){const ts=skillTargets(D,st,u,pos,sk);if(ts.length){let tot=0;for(const tid of ts){const p=preview(D,st,u,pos,tid,{mult:S.mult,noCounter:true,area:true});tot+=scoreHit(D,st,u,pos,tid,p);}add(tot+ (ts.length>1?3:-2)+posPen(c),{type:'ACT',actorId:u.id,to:pos,act:'SKILL',skill:sk});}}
   if(S.kind==='attack'){for(const tid of skillTargets(D,st,u,pos,sk)){const tgt=st.units.find(v=>v.id===tid);const p=preview(D,st,u,pos,tid,{mult:S.mult,noCounter:!!S.noCounter,area:!!S.area,flank:S.flank});let extra=1;
     if(S.push&&manhattan(tgt,st.gate)<=2)extra+=3;if(S.pull&&tgt.rmax>=2)extra+=2;
     if(sk==='pierce'){const b=unitAt(st,tgt.x+(tgt.x-pos.x),tgt.y+(tgt.y-pos.y));if(b&&b.faction!==u.faction)extra+=6;}
     if(sk==='markShot'&&!p.kill)extra+=tgt.st.mark>0?-2:3;
     if(sk==='bind'&&!p.kill)extra+=(tgt.st.root>0?-3:(tgt.move>=4?6:3)+(manhattan(tgt,st.gate)<=4?3:0));
     add(scoreHit(D,st,u,pos,tid,p,extra)+posPen(c),{type:'ACT',actorId:u.id,to:pos,act:'SKILL',skill:sk,target:tid});}}
   if(sk==='guardStance'&&near<=5){const adj=allies.filter(v=>v.id!==u.id&&manhattan(v,pos)===1).length;if(adj)add(adj*3+(near<=2?2:0)+posPen(c),{type:'ACT',actorId:u.id,to:pos,act:'SKILL',skill:sk});}
   if(sk==='massMend'){let v=0;for(const t of allies){if(manhattan(t,pos)>S.radius)continue;v+=(t.maxHp-t.hp)/t.maxHp*7+(t.solMax-t.sol)/Math.max(1,t.solMax)*3;}if(v>3)add(v+posPen(c),{type:'ACT',actorId:u.id,to:pos,act:'SKILL',skill:sk});}
   if(S.kind==='ally'){for(const tid of skillTargets(D,st,u,pos,sk)){const t=st.units.find(v=>v.id===tid);const miss=(t.maxHp-t.hp)/t.maxHp,ms=(t.solMax-t.sol)/Math.max(1,t.solMax);let pur=0;for(const [dx,dy] of [[0,0],...DIRS]){const x=t.x+dx,y=t.y+dy;if(inside(st,x,y)&&(tileAt(st,x,y)==='FLESH'||st.warn.some(w=>w.x===x&&w.y===y)))pur++;}const v=miss*14+ms*5+(t.st.root>0||t.st.mark>0?3:0)+pur*2.5;if(v>2.5)add(v+posPen(c),{type:'ACT',actorId:u.id,to:pos,act:'SKILL',skill:sk,target:tid});}}
   if(S.kind==='gen'){aiGen(D,st,u,pos,c,sk,S,add,posPen,near,allies);continue;}
   if(S.kind==='zone'&&near<=6&&c.x===u.x&&c.y===u.y){let best=null;for(const k of skillTargets(D,st,u,pos,sk)){const [x,y]=k.split(',').map(Number);if(!inside(st,x,y))continue;const al=allies.filter(v=>Math.abs(v.x-x)<=1&&Math.abs(v.y-y)<=1).length;const wv=(st.warn||[]).filter(w=>Math.abs(w.x-x)<=1&&Math.abs(w.y-y)<=1).length;const v=al*2.2+wv*4;if(!best||v>best.v)best={v,x,y};}
    if(best&&best.v>=4)add(best.v,{type:'ACT',actorId:u.id,to:pos,act:'SKILL',skill:sk,at:{x:best.x,y:best.y}});}}
 }
 const S=ready.includes('shadowStep')?D.skills.shadowStep:null;
 if(S&&S.kind==='dash'){const R2=reachable(D,st,u,{extra:S.extraMove,ignoreZoc:true});for(const k of R2.keys()){const [x,y]=k.split(',').map(Number);const pos={x,y};
   for(const tid of withPos(u,pos,()=>targetsFrom(D,st,u,pos,null,true))){const p=preview(D,st,u,pos,tid,{flank:S.flank});add(scoreHit(D,st,u,pos,tid,p,R.has(k)?0:2)+posPen({x,y}),{type:'ACT',actorId:u.id,to:pos,act:'SKILL',skill:'shadowStep',target:tid});}}}
 opts.sort((a,b)=>b.s-a.s);const best=opts[0];
 if(best&&best.s>(hold?-2:-6))return best.a;
 // 沒有好的選擇：往目標靠近（守門打法：留在門前）
 let goals;const gateOn=!st.gate.none;
 if(objTiles&&objTiles.length)goals=[...objTiles,...(u.faction==='E'?foes:[])];
 else if(u.faction==='E'&&gateOn&&(u.troop!=='ARCHER'&&u.troop!=='MAGE'||st.pressure)){const g=st.gate;goals=[{x:g.x,y:g.y-1},...foes];}
 else if(hold&&gateOn){goals=[{x:st.gate.x,y:st.gate.y-1},{x:st.gate.x-1,y:st.gate.y-1},{x:st.gate.x+1,y:st.gate.y-1},{x:st.gate.x,y:st.gate.y-2}];}
 else if(u.faction==='P'&&O.type==='boss'){const cm=foes.filter(f=>f.commander);goals=cm.length?cm:foes;}
 else goals=foes;
 if(!goals.length)return {type:'ACT',actorId:u.id,to:{x:u.x,y:u.y},act:'WAIT'};
 const dm=distMap(D,st,goals);let pick=null;
 for(const c of cand){const d=dm.get(key(c.x,c.y))??999;const s=-d+terrainDef(D,st,c.x,c.y)*2;if(!pick||s>pick.s+1e-9)pick={s,c:{x:c.x,y:c.y}};}
 return {type:'ACT',actorId:u.id,to:pick.c,act:((hold&&gateOn)||near<=3)?'GUARD':'WAIT'};}

// ---------- 重播 ----------
function replay(D,missionId,seed,actions,opts){let st=createBattle(D,missionId,seed,opts);for(const a of actions){const r=apply(D,st,a);if(!r.ok)throw new Error('replay failed at '+JSON.stringify(a)+': '+r.error);st=r.state;}return st;}

const API={sv,tm,STN,genTargets,genArea,hasP,updCorr,SCHEMA,createBattle,apply,validate,reachable,targetsFrom,skillTargets,preview,calc,plan,replay,hash,rngAt,los,key,manhattan,unitAt,tileAt,alive,rangeOf,counterMult,clone,soldiers,solMaxN,splitPreview,inZone,moveOpts,withPos};
if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.TACTICS=API;
})(this);
