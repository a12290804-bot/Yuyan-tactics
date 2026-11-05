// 《永生戰棋》據點與成長：名單、招集（抽卡）、兵營（士兵團升級、強化、被動）、角色經驗、戰後獎勵。
// 和戰鬥核心分開；招集用的亂數可以注入（測試時固定），平常用瀏覽器亂數。
(function(root){
'use strict';
const RG='../raven-guild/';
const blankHero=()=>({star:0,sol:1,lv:1,xp:0,sq:{lv:1,tier:0,pas:[]}});
const TS=D=>D.teamSize||4;
function heroOf(D,id){return D.heroes.find(h=>h.id===id);}
function newCamp(D){const c={v:1,tickets:D.gacha.startTickets,supply:0,pulls:0,sincePity:0,firstTenUsed:false,roster:{},team:[],battles:0,wins:0,log:[]};
 for(const id of D.starters)c.roster[id]=blankHero();c.team=D.starters.slice(0,TS(D));return c;}
function fix(D,c){if(!c||c.v!==1)return newCamp(D);c.roster=c.roster||{};for(const id of Object.keys(c.roster))if(!heroOf(D,id))delete c.roster[id];
 for(const id of D.starters)if(!c.roster[id])c.roster[id]=blankHero();
 for(const id of Object.keys(c.roster)){const r=c.roster[id],b=blankHero();for(const k of Object.keys(b))if(r[k]==null)r[k]=b[k];r.sq=r.sq||b.sq;for(const k of ['lv','tier'])r.sq[k]=Math.max(k==='lv'?1:0,r.sq[k]|0);r.sq.pas=(r.sq.pas||[]).filter(p=>D.passives[p]);r.lv=Math.max(1,Math.min(D.xp.maxLv,r.lv|0));}
 c.team=(c.team||[]).filter(id=>c.roster[id]).slice(0,TS(D));for(const id of Object.keys(c.roster))if(c.team.length<TS(D)&&!c.team.includes(id))c.team.push(id);
 for(const k of ['tickets','supply','pulls','sincePity','battles','wins'])c[k]=Math.max(0,c[k]|0);return c;}
function mult(D,id,c){const h=heroOf(D,id),r=c.roster[id];return D.rarityMult[h.r]*(1+D.starStep*(r?r.star:0))*(1+D.xp.statStep*((r?r.lv:1)-1));}
function skillsOf(D,id,c){const h=heroOf(D,id),u=D.units[h.unit],r=c.roster[id];const out=[u.skill];if(r&&r.lv>=D.secondAt&&D.secondSkill[h.unit])out.push(D.secondSkill[h.unit]);return out;}
function soldiersOf(D,id,c){const h=heroOf(D,id);return (D.units[h.unit].soldiers||5)+((c.roster[id].sq||{}).tier||0);}
function slotsOf(D,r){return D.squad.slotsAt.filter(l=>r.sq.lv>=l).length;}
function art(h){return RG+h.src;}
// 出戰隊伍 → 戰鬥核心要的格式（士兵比例延續）
function teamFor(D,c){return c.team.map(id=>{const h=heroOf(D,id),r=c.roster[id],Q=D.squad;return {def:h.unit,rid:id,hero:id,name:h.name,title:h.title,lv:r.lv,mult:+mult(D,id,c).toFixed(3),sol:+(r.sol).toFixed(3),art:art(h),skills:skillsOf(D,id,c),soldiers:soldiersOf(D,id,c),hpPer:+(1+Q.hpStep*(r.sq.lv-1)).toFixed(3),sb:+(Q.baseBonus+Q.bonusStep*(r.sq.lv-1)).toFixed(3),pas:r.sq.pas.slice()};});}
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
function afterBattle(D,c,st){if(c.lastBattle===st.battleInstanceId)return {dup:true};c.lastBattle=st.battleInstanceId;const R=D.rewards;const win=st.result&&st.result.win;const got={tickets:0,supply:0};
 if(win){got.tickets+=R.win.tickets;got.supply+=R.win.supply;if(st.gate.hp>=200)got.tickets+=R.winClean.tickets;c.wins++;}else{got.tickets+=R.lose.tickets;got.supply+=R.lose.supply;}
 c.battles++;c.tickets+=got.tickets;c.supply+=got.supply;
 got.xp={};got.lvUp={};const X=D.xp;
 for(const u of st.units)if(u.faction==='P'&&u.rid&&c.roster[u.rid]){const r=c.roster[u.rid];r.sol=u.hp>0?+(u.sol/Math.max(1,u.solMax)).toFixed(3):0;const k=u.kills||0;const xp=X.join+(win?X.win:0)+X.kill*k;const up=addXp(D,r,xp);got.xp[u.rid]=xp;if(up)got.lvUp[u.rid]=r.lv;got.supply+=(D.rewards.perKill||0)*k;c.supply+=(D.rewards.perKill||0)*k;}
 c.log.unshift({t:'battle',win,fac:st.faction,got});c.log=c.log.slice(0,30);return got;}
const API={newCamp,fix,teamFor,pull,refill,refillCost,afterBattle,heroOf,mult,art,skillsOf,soldiersOf,slotsOf,sqLvCost,sqUp,tierCost,sqTier,learn,forget,addXp};
if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.CAMP=API;
})(this);
