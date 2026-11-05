// 《永生戰棋》據點與成長：名單、招集（抽卡）、兵營（士兵團升級、強化、被動）、角色經驗、戰後獎勵。
// 和戰鬥核心分開；招集用的亂數可以注入（測試時固定），平常用瀏覽器亂數。
(function(root){
'use strict';
const RG='../raven-guild/';
const blankHero=()=>({star:0,sol:1,lv:1,xp:0,sq:{lv:1,tier:0,pas:[]},eq:{w:null,a:null,t:null},tal:[],cos:null});
const TS=D=>D.teamSize||4;
function heroOf(D,id){return D.heroes.find(h=>h.id===id);}
function newCamp(D){const c={v:1,tickets:D.gacha.startTickets,supply:0,pulls:0,sincePity:0,firstTenUsed:false,roster:{},team:[],battles:0,wins:0,log:[],inv:[],nextEq:1,mats:{ore:0,record:0,relic:0}};
 for(const id of D.starters)c.roster[id]=blankHero();c.team=D.starters.slice(0,TS(D));return c;}
function fix(D,c){if(!c||c.v!==1)return newCamp(D);c.roster=c.roster||{};for(const id of Object.keys(c.roster))if(!heroOf(D,id))delete c.roster[id];
 for(const id of D.starters)if(!c.roster[id])c.roster[id]=blankHero();
 for(const id of Object.keys(c.roster)){const r=c.roster[id],b=blankHero();for(const k of Object.keys(b))if(r[k]==null)r[k]=b[k];r.sq=r.sq||b.sq;for(const k of ['lv','tier'])r.sq[k]=Math.max(k==='lv'?1:0,r.sq[k]|0);r.sq.pas=(r.sq.pas||[]).filter(p=>D.passives[p]);r.lv=Math.max(1,Math.min(D.xp.maxLv,r.lv|0));}
 c.team=(c.team||[]).filter(id=>c.roster[id]).slice(0,TS(D));for(const id of Object.keys(c.roster))if(c.team.length<TS(D)&&!c.team.includes(id))c.team.push(id);
 for(const k of ['tickets','supply','pulls','sincePity','battles','wins'])c[k]=Math.max(0,c[k]|0);c.cleared=c.cleared&&typeof c.cleared==='object'?c.cleared:{};if(c.wins>0&&!Object.keys(c.cleared).length)c.cleared.MISSION_BC_001=true;
 c.inv=Array.isArray(c.inv)?c.inv.filter(e=>e&&D.equip&&D.equip[e.b]):[];c.nextEq=Math.max(c.nextEq|0,1,...c.inv.map(e=>(e.u|0)+1));c.mats=c.mats||{};for(const k of Object.keys(D.mats||{}))c.mats[k]=Math.max(0,c.mats[k]|0);
 const ids=new Set(c.inv.map(e=>e.u)),seen=new Set();for(const id of Object.keys(c.roster)){const r=c.roster[id];r.eq=r.eq||{w:null,a:null,t:null};r.tal=Array.isArray(r.tal)?r.tal.filter(n=>talNode(D,n)):[];while(r.tal.length>talPts(D,r))r.tal.pop();if(typeof r.cos!=='string')r.cos=null;for(const sl of ['w','a','t']){const u=r.eq[sl];if(u==null||!ids.has(u)||seen.has(u)||!fits(D,id,c.inv.find(e=>e.u===u),sl))r.eq[sl]=null;else seen.add(u);}}
 return c;}
function mult(D,id,c){const h=heroOf(D,id),r=c.roster[id];return D.rarityMult[h.r]*(1+D.starStep*(r?r.star:0))*(1+D.xp.statStep*((r?r.lv:1)-1));}
function skillsOf(D,id,c){const h=heroOf(D,id),u=D.units[h.unit],r=c.roster[id];const out=[u.skill];if(r&&r.lv>=D.secondAt&&D.secondSkill[h.unit])out.push(D.secondSkill[h.unit]);return out;}
function soldiersOf(D,id,c){const h=heroOf(D,id),r=c.roster[id];return (D.units[h.unit].soldiers||5)+((r.sq||{}).tier||0)+(D.talents?talFx(D,r).sold:0);}
function slotsOf(D,r){return D.squad.slotsAt.filter(l=>r.sq.lv>=l).length;}
function art(h){return RG+h.src;}
// 出戰隊伍 → 戰鬥核心要的格式（士兵比例延續）
function teamFor(D,c,cosArt){return c.team.map(id=>{const h=heroOf(D,id),r=c.roster[id],Q=D.squad,T=talFx(D,r);const o={def:h.unit,rid:id,hero:id,name:h.name,title:h.title,lv:r.lv,mult:+mult(D,id,c).toFixed(3),sol:+(r.sol).toFixed(3),art:art(h),skills:skillsOf(D,id,c),soldiers:soldiersOf(D,id,c),hpPer:+((1+Q.hpStep*(r.sq.lv-1))*(1+T.solP)).toFixed(3),sb:+(Q.baseBonus+Q.bonusStep*(r.sq.lv-1)+T.sb).toFixed(3),pas:r.sq.pas.slice(),eq:heroEq(D,c,id)};
  const tal={};for(const k of ['atkP','defP','resP','hpP','crit','hit','eva'])if(T[k])tal[k]=T[k];if(T.flags.length)tal.flags=T.flags.slice();if(Object.keys(tal).length)o.tal=tal;const cp=r.cos&&cosArt&&cosArt(r.cos,id);if(cp)o.por=cp;return o;});}
// ---------- 裝備 ----------
function fits(D,id,e,sl){if(!e)return false;const B=D.equip[e.b],h=heroOf(D,id);if(!B||!h)return false;if(sl&&B.slot!==sl)return false;return !B.units||B.units.includes(h.unit);}
function eqStats(D,e){const B=D.equip[e.b],k=D.eqRarity.mult[e.r]*(1+D.eqPlusStep*(e.p||0));const o={};for(const s of Object.keys(B.st))o[s]=+(B.st[s]*k).toFixed(1);return o;}
function eqName(D,e){return D.equip[e.b].name+(e.p?' +'+e.p:'');}
function heroEq(D,c,id){const r=c.roster[id],o={};if(!r||!r.eq)return o;for(const sl of ['w','a','t']){const e=c.inv.find(x=>x.u===r.eq[sl]);if(!e)continue;const s=eqStats(D,e);for(const k of Object.keys(s))o[k]=(o[k]||0)+s[k];}for(const k of Object.keys(o))o[k]=+o[k].toFixed(1);return o;}
function ownerOf(c,u){for(const id of Object.keys(c.roster)){const q=c.roster[id].eq;if(q)for(const sl of ['w','a','t'])if(q[sl]===u)return {id,sl};}return null;}
function addEq(D,c,b,r){if(c.inv.length>=D.invMax){const ore=D.dismantle.base+D.dismantle.perR*r;c.mats.ore+=ore;return {full:true,ore,b,r};}const e={u:c.nextEq++,b,r,p:0};c.inv.push(e);return e;}
function equip(D,c,id,u){const e=c.inv.find(x=>x.u===u);if(!e)return {ok:false,error:'找不到這件裝備'};const sl=D.equip[e.b].slot;if(!fits(D,id,e,sl))return {ok:false,error:'這個職業不能用'};
 const o=ownerOf(c,u);if(o)c.roster[o.id].eq[o.sl]=null;c.roster[id].eq[sl]=u;return {ok:true,from:o&&o.id!==id?o.id:null};}
function unequip(D,c,id,sl){c.roster[id].eq[sl]=null;return {ok:true};}
function enhanceCost(D,e){return {ore:D.enhance.ore*(e.p+1)*(e.r+1),supply:D.enhance.supply*(e.p+1)};}
function enhance(D,c,u){const e=c.inv.find(x=>x.u===u);if(!e)return {ok:false,error:'找不到這件裝備'};if(e.p>=D.eqPlusMax)return {ok:false,error:'已經強化到 +'+D.eqPlusMax};const k=enhanceCost(D,e);
 if(c.mats.ore<k.ore)return {ok:false,error:'白鐵礦石不夠（要 '+k.ore+'）'};if(c.supply<k.supply)return {ok:false,error:'補給不夠（要 '+k.supply+'）'};c.mats.ore-=k.ore;c.supply-=k.supply;e.p++;return {ok:true,cost:k};}
function dismantleGain(D,e){return D.dismantle.base+D.dismantle.perR*e.r+D.dismantle.perPlus*e.p;}
function dismantle(D,c,u){const i=c.inv.findIndex(x=>x.u===u);if(i<0)return {ok:false,error:'找不到這件裝備'};if(ownerOf(c,u))return {ok:false,error:'有人穿著，先卸下'};const g=dismantleGain(D,c.inv[i]);c.inv.splice(i,1);c.mats.ore+=g;return {ok:true,ore:g};}
function useRecord(D,c,id,n){n=Math.max(1,n|0);if(c.mats.record<n)return {ok:false,error:'戰記本不夠'};const r=c.roster[id];if(r.lv>=D.xp.maxLv)return {ok:false,error:'已經是最高等級'};c.mats.record-=n;const up=addXp(D,r,D.recordXp*n);return {ok:true,up,lv:r.lv};}
function rollDrops(D,c,st,win,first,rng){const R=D.drops,out={eq:[],mats:{}};const ri=(a,b)=>a+Math.floor(rng()*(b-a+1));
 const team=st.units.filter(u=>u.faction==='P'&&u.rid).map(u=>u.def);const usable=Object.keys(D.equip).filter(k=>!D.equip[k].units||D.equip[k].units.some(x=>team.includes(x)));const all=Object.keys(D.equip);
 const rollR=()=>{const x=rng();return x<R.rarity[2]?2:x<R.rarity[2]+R.rarity[1]?1:0;};
 const give=(b,r)=>{const e=addEq(D,c,b,r);out.eq.push(e.full?{b,r,full:true,ore:e.ore}:{u:e.u,b,r});};
 if(first&&win)give(usable[Math.floor(rng()*usable.length)%usable.length],Math.max(R.firstClearR,rollR()));
 if(rng()<(win?R.winEqChance:R.loseEqChance)){const pool=rng()<.6?usable:all;give(pool[Math.floor(rng()*pool.length)%pool.length],rollR());}
 const ore=win?ri(...R.winOre):ri(...R.loseOre);c.mats.ore+=ore;out.mats.ore=ore;
 if(win&&rng()<R.recordChance){c.mats.record++;out.mats.record=1;}
 const M=D.missions[st.missionId]||{};if(win&&!(R.relicSkip||[]).includes(st.missionId)&&(M.threat||0)>=R.relicThreat){const rr=rng();if(first||rr<R.relicChance){c.mats.relic++;out.mats.relic=1;}}
 return out;}
// ---------- 天賦 ----------
function talNode(D,nid){if(!D.talents)return null;for(const p of Object.keys(D.talents)){const i=D.talents[p].nodes.findIndex(n=>n.id===nid);if(i>=0)return {p,i,n:D.talents[p].nodes[i]};}return null;}
function talPts(D,r){return Math.floor((r.lv||1)/(D.talentEvery||2));}
function talFree(D,r){return talPts(D,r)-(r.tal||[]).length;}
function talCan(D,c,id,nid){const r=c.roster[id],T=talNode(D,nid);if(!T)return '沒有這個天賦';if(r.tal.includes(nid))return '已經點了';if(talFree(D,r)<1)return '天賦點不夠（每 '+D.talentEvery+' 級 1 點）';
 const prev=D.talents[T.p].nodes[T.i-1];if(prev&&!r.tal.includes(prev.id))return '要先點「'+prev.name+'」';if(T.n.relic&&(c.mats.relic||0)<T.n.relic)return '要 '+T.n.relic+' 個發光的舊物';return null;}
function talLearn(D,c,id,nid){const e=talCan(D,c,id,nid);if(e)return {ok:false,error:e};const T=talNode(D,nid);if(T.n.relic)c.mats.relic-=T.n.relic;c.roster[id].tal.push(nid);return {ok:true};}
function talReset(D,c,id){const r=c.roster[id];if(!r.tal.length)return {ok:false,error:'還沒有點天賦'};if(c.supply<D.talentResetCost)return {ok:false,error:'補給不夠（要 '+D.talentResetCost+'）'};c.supply-=D.talentResetCost;let back=0;for(const n of r.tal){const T=talNode(D,n);if(T&&T.n.relic)back+=T.n.relic;}c.mats.relic+=back;r.tal=[];return {ok:true,relic:back};}
function talFx(D,r){const o={atkP:0,defP:0,resP:0,hpP:0,crit:0,hit:0,eva:0,solP:0,sb:0,sold:0,flags:[]};for(const n of (r.tal||[])){const T=talNode(D,n);if(!T)continue;for(const [k,v] of Object.entries(T.n.fx)){if(k==='flag')o.flags.push(v);else o[k]+=v;}}return o;}
// ---------- 委託板 ----------
function questNew(D,c,rng){const Q=D.quests;const done=Object.keys(c.cleared||{}).filter(m=>D.missions[m]);if(!done.length)return null;const mid=done[Math.floor(rng()*done.length)%done.length];const M=D.missions[mid];const ks=Object.keys(Q.kinds);const k=ks[Math.floor(rng()*ks.length)%ks.length];
 let n=0;if(k==='fast')n=Math.max(3,Math.ceil(M.roundLimit*.7));else if(k==='kills')n=6+Math.floor(rng()*3);else if(k==='soldiers')n=[50,60,70][Math.floor(rng()*3)%3];
 const rw=JSON.parse(JSON.stringify(Q.rewards[Math.floor(rng()*Q.rewards.length)%Q.rewards.length]));return {id:'q'+(c.qn=(c.qn|0)+1),mission:mid,kind:k,n,from:Q.from[Math.floor(rng()*Q.from.length)%Q.from.length],rw};}
function questFill(D,c,rng){rng=rng||Math.random;c.quests=Array.isArray(c.quests)?c.quests.filter(q=>q&&D.missions[q.mission]&&D.quests.kinds[q.kind]):[];let guard=0;while(c.quests.length<D.quests.max&&guard++<20){const q=questNew(D,c,rng);if(!q)break;if(c.quests.some(x=>x.mission===q.mission&&x.kind===q.kind))continue;c.quests.push(q);}return c.quests;}
function questText(D,q){const M=D.missions[q.mission];return D.quests.kinds[q.kind].txt.replace('{place}',M.place||M.name).replace('{n}',q.n);}
function questMet(D,q,st){if(!st.result||!st.result.win||st.missionId!==q.mission)return false;const P=st.units.filter(u=>u.faction==='P');
 if(q.kind==='noloss')return P.every(u=>u.hp>0);if(q.kind==='fast')return st.round<=q.n;if(q.kind==='kills')return P.reduce((s,u)=>s+(u.kills||0),0)>=q.n;
 if(q.kind==='soldiers'){const a=P.reduce((s,u)=>s+Math.round(u.sol/Math.max(1,u.hpPer)),0),b=P.reduce((s,u)=>s+Math.round(u.solMax/Math.max(1,u.hpPer)),0);return b>0&&a*100>=q.n*b;}return false;}
function questGive(D,c,rw,st,rng){const out={mats:{},eq:[]};for(const [k,v] of Object.entries(rw)){if(k==='tickets')c.tickets+=v;else if(k==='supply')c.supply+=v;else if(k==='eq'){const team=st?st.units.filter(u=>u.faction==='P'&&u.rid).map(u=>u.def):[];const usable=Object.keys(D.equip).filter(b=>!D.equip[b].units||D.equip[b].units.some(x=>team.includes(x)));const pool=usable.length?usable:Object.keys(D.equip);for(let i=0;i<v;i++){const b=pool[Math.floor(rng()*pool.length)%pool.length];const r=rng()<.25?2:1;const e=addEq(D,c,b,r);out.eq.push(e.full?{b,r,full:true,ore:e.ore}:{u:e.u,b,r});}continue;}else c.mats[k]=(c.mats[k]||0)+v;out.mats[k]=v;}return out;}
function questCheck(D,c,st,rng){rng=rng||Math.random;c.quests=Array.isArray(c.quests)?c.quests:[];const got=[];for(const q of c.quests.slice()){if(questMet(D,q,st)){const g=questGive(D,c,q.rw,st,rng);got.push({q,g});c.quests=c.quests.filter(x=>x.id!==q.id);c.qdone=(c.qdone|0)+1;}}questFill(D,c,rng);return got;}
function questReroll(D,c,rng){if(c.supply<D.quests.rerollCost)return {ok:false,error:'補給不夠（要 '+D.quests.rerollCost+'）'};c.supply-=D.quests.rerollCost;c.quests=[];questFill(D,c,rng);return {ok:true};}
// ---------- 招集 ----------
function rollRarity(D,c,rng){const R=D.gacha.rates;const x=rng();let r=x<R[2]?2:x<R[2]+R[1]?1:0;if(c.sincePity+1>=D.gacha.pity)r=2;return r;}
function pickHero(D,r,rng){const pool=D.heroes.filter(h=>h.r===r);return pool[Math.floor(rng()*pool.length)%pool.length];}
function pull(D,c,n,rng){rng=rng||Math.random;if(c.tickets<n)return {ok:false,error:'招集券不夠'};c.tickets-=n;const res=[];
 for(let i=0;i<n;i++){let r=rollRarity(D,c,rng);res.push(r);c.pulls++;c.sincePity=r===2?0:c.sincePity+1;}
 if(n===10){if(!res.some(r=>r>=1)){res[9]=1;}if(!c.firstTenUsed&&D.gacha.firstTen&&!res.some(r=>r===2)){res[9]=2;c.sincePity=0;}c.firstTenUsed=true;}
 const out=res.map(r=>{const h=pickHero(D,r,rng);const had=!!c.roster[h.id];let note;
  if(!had){c.roster[h.id]=blankHero();note='新成員';if(c.team.length<TS(D))c.team.push(h.id);}else if(c.roster[h.id].star<D.maxStar){c.roster[h.id].star++;note='重複：星級 +1（能力 +'+Math.round(D.starStep*100)+'%）';}else{c.supply+=20;note='重複（星級已滿）：補給 +20';}
  return {id:h.id,name:h.name,title:h.title,r:h.r,isNew:!had,note};});
 c.log.unshift({t:'pull',n,ids:out.map(o=>o.id)});c.log=c.log.slice(0,30);return {ok:true,results:out};}
// ---------- 兵營 ----------
function refillCost(D,c,id){const n=soldiersOf(D,id,c);const have=Math.round((c.roster[id].sol||0)*n);return (n-have)*D.barracks.costPerSoldier;}
function refill(D,c,id){const cost=refillCost(D,c,id);if(cost<=0)return {ok:false,error:'已經滿編'};if(c.supply<cost)return {ok:false,error:'補給不夠（要 '+cost+'）'};c.supply-=cost;c.roster[id].sol=1;return {ok:true,cost};}
function sqLvCost(D,r){return D.squad.lvCost*r.sq.lv;}
function sqUp(D,c,id){const r=c.roster[id];if(r.sq.lv>=D.squad.maxLv)return {ok:false,error:'士兵團已經滿級'};const cost=sqLvCost(D,r);if(c.supply<cost)return {ok:false,error:'補給不夠（要 '+cost+'）'};c.supply-=cost;r.sq.lv++;return {ok:true,cost};}
function tierCost(D,r){return D.squad.tierCost*(r.sq.tier+1);}
function sqTier(D,c,id){const r=c.roster[id];if(r.sq.tier>=D.squad.maxTier)return {ok:false,error:'已經強化到最高'};const cost=tierCost(D,r);if(c.supply<cost)return {ok:false,error:'補給不夠（要 '+cost+'）'};const n0=Math.round(r.sol*soldiersOf(D,id,c));c.supply-=cost;r.sq.tier++;r.sol=+(n0/soldiersOf(D,id,c)).toFixed(3);return {ok:true,cost};}
function learn(D,c,id,pk){const r=c.roster[id];if(!D.passives[pk])return {ok:false,error:'沒有這個被動'};if(r.sq.pas.includes(pk))return {ok:false,error:'已經學會了'};if(r.sq.pas.length>=slotsOf(D,r))return {ok:false,error:'被動欄位不夠（士兵團 Lv'+D.squad.slotsAt.join('／')+' 各開一格）'};if(c.supply<D.squad.passiveCost)return {ok:false,error:'補給不夠（要 '+D.squad.passiveCost+'）'};c.supply-=D.squad.passiveCost;r.sq.pas.push(pk);return {ok:true};}
function forget(D,c,id,pk){const r=c.roster[id];r.sq.pas=r.sq.pas.filter(p=>p!==pk);return {ok:true};}
function addXp(D,r,n){const X=D.xp;let up=0;r.xp+=n;while(r.lv<X.maxLv&&r.xp>=X.perLevel*r.lv){r.xp-=X.perLevel*r.lv;r.lv++;up++;}if(r.lv>=X.maxLv)r.xp=0;return up;}
// ---------- 戰後 ----------
function afterBattle(D,c,st,rng){rng=rng||Math.random;if(c.lastBattle===st.battleInstanceId)return {dup:true};c.lastBattle=st.battleInstanceId;const R=D.rewards;const win=st.result&&st.result.win;const got={tickets:0,supply:0};
 if(win){got.tickets+=R.win.tickets;got.supply+=R.win.supply;if(!st.gate.none&&st.gate.hp>=200)got.tickets+=R.winClean.tickets;c.wins++;c.cleared=c.cleared||{};if(!c.cleared[st.missionId]){c.cleared[st.missionId]=true;got.first=true;got.tickets+=2;c.tickets+=0;}}else{got.tickets+=R.lose.tickets;got.supply+=R.lose.supply;}
 c.battles++;c.tickets+=got.tickets;c.supply+=got.supply;
 got.xp={};got.lvUp={};const X=D.xp;
 for(const u of st.units)if(u.faction==='P'&&u.rid&&c.roster[u.rid]){const r=c.roster[u.rid];r.sol=u.hp>0?+(u.sol/Math.max(1,u.solMax)).toFixed(3):0;const k=u.kills||0;const xp=X.join+(win?X.win:0)+X.kill*k;const up=addXp(D,r,xp);got.xp[u.rid]=xp;if(up)got.lvUp[u.rid]=r.lv;got.supply+=(D.rewards.perKill||0)*k;c.supply+=(D.rewards.perKill||0)*k;}
 if(D.equip)got.drops=rollDrops(D,c,st,win,!!got.first,rng);if(D.quests)got.quests=questCheck(D,c,st,rng);
 c.log.unshift({t:'battle',win,fac:st.faction,got:{tickets:got.tickets,supply:got.supply}});c.log=c.log.slice(0,30);return got;}
const API={questNew,questFill,questText,questMet,questGive,questCheck,questReroll,talNode,talPts,talFree,talCan,talLearn,talReset,talFx,fits,eqStats,eqName,heroEq,ownerOf,addEq,equip,unequip,enhanceCost,enhance,dismantleGain,dismantle,useRecord,rollDrops,newCamp,fix,teamFor,pull,refill,refillCost,afterBattle,heroOf,mult,art,skillsOf,soldiersOf,slotsOf,sqLvCost,sqUp,tierCost,sqTier,learn,forget,addXp};
if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.CAMP=API;
})(this);
