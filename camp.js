// 《永生戰棋》據點與成長：名單、招集（抽卡）、兵營（士兵團升級、強化、被動）、角色經驗、戰後獎勵。
// 和戰鬥核心分開；招集用的亂數可以注入（測試時固定），平常用瀏覽器亂數。
(function(root){
'use strict';
const RG='../raven-guild/';
const blankHero=()=>({star:0,sol:1,lv:1,xp:0,sq:{lv:1,tier:0,pas:[]},eq:{w:null,a:null,t:null},tal:[],mastery:{},learned:[],cos:null,aff:0,chatDay:'',bond:[]});
const TS=D=>D.teamSize||4;
function heroOf(D,id){return D.heroes.find(h=>h.id===id);}
function newCamp(D){const c={v:1,tickets:D.gacha.startTickets,supply:0,pulls:0,sincePity:0,firstTenUsed:false,roster:{},team:[],battles:0,wins:0,log:[],inv:[],nextEq:1,mats:{ore:0,record:0,relic:0},coins:0,cosOwned:[],gifts:{},pcName:'',pcLook:'a',flags:{}};
 c.items={};c.pack=[];c.trades={};c.skillBooks={};c.cleared={};c.mapEvent=null;c.mats.herb=0;
 for(const id of D.starters)c.roster[id]=blankHero();c.team=D.starters.slice(0,TS(D));return c;}
function fix(D,c){if(!c||c.v!==1)return newCamp(D);c.roster=c.roster||{};for(const id of Object.keys(c.roster))if(!heroOf(D,id))delete c.roster[id];
 for(const id of D.starters)if(!c.roster[id])c.roster[id]=blankHero();
 for(const id of Object.keys(c.roster)){const r=c.roster[id],b=blankHero();for(const k of Object.keys(b))if(r[k]==null)r[k]=b[k];r.sq=r.sq||b.sq;for(const k of ['lv','tier'])r.sq[k]=Math.max(k==='lv'?1:0,r.sq[k]|0);r.sq.pas=(r.sq.pas||[]).filter(p=>D.passives[p]);r.lv=Math.max(1,Math.min(D.xp.maxLv,r.lv|0));}
 c.team=(c.team||[]).filter(id=>c.roster[id]).slice(0,TS(D));for(const id of Object.keys(c.roster))if(c.team.length<TS(D)&&!c.team.includes(id))c.team.push(id);
 for(const k of ['tickets','supply','pulls','sincePity','battles','wins'])c[k]=Math.max(0,c[k]|0);c.cleared=c.cleared&&typeof c.cleared==='object'?c.cleared:{};if(c.wins>0&&!Object.keys(c.cleared).length)c.cleared.MISSION_BC_001=true;
 c.inv=Array.isArray(c.inv)?c.inv.filter(e=>e&&D.equip&&D.equip[e.b]):[];c.nextEq=Math.max(c.nextEq|0,1,...c.inv.map(e=>(e.u|0)+1));c.mats=c.mats||{};for(const k of Object.keys(D.mats||{}))c.mats[k]=Math.max(0,c.mats[k]|0);
 const ids=new Set(c.inv.map(e=>e.u)),seen=new Set();for(const id of Object.keys(c.roster)){const r=c.roster[id];r.eq=r.eq||{};r.tal=Array.isArray(r.tal)?r.tal.filter(n=>talNode(D,n)):[];while(r.tal.length>talPts(D,r))r.tal.pop();if(typeof r.cos!=='string')r.cos=null;r.aff=Math.max(0,r.aff|0);if(typeof r.chatDay!=='string')r.chatDay='';r.bond=Array.isArray(r.bond)?r.bond.filter(x=>typeof x==='number'):[];for(const sl of Object.keys(D.eqSlots)){const u=r.eq[sl];if(u==null||!ids.has(u)||seen.has(u)||!fits(D,id,c.inv.find(e=>e.u===u),sl))r.eq[sl]=null;else seen.add(u);}}
 c.coins=Math.max(0,c.coins|0);c.cosOwned=Array.isArray(c.cosOwned)?c.cosOwned.filter(x=>typeof x==='string'):[];for(const id of Object.keys(c.roster)){const q=c.roster[id].cos;if(q&&!c.cosOwned.includes(q))c.cosOwned.push(q);}
 c.gifts=c.gifts&&typeof c.gifts==='object'?c.gifts:{};for(const k of Object.keys(c.gifts))c.gifts[k]=Math.max(0,c.gifts[k]|0);if(typeof c.pcName!=='string')c.pcName='';c.pcName=c.pcName.slice(0,12);if(c.pcLook!=='b')c.pcLook='a';c.flags=c.flags&&typeof c.flags==='object'?c.flags:{};c.mythSince=Math.max(0,c.mythSince|0);c.mythMarks=Math.max(0,c.mythMarks|0);c.skillBooks=c.skillBooks&&typeof c.skillBooks==='object'?c.skillBooks:{};for(const k of Object.keys(c.skillBooks)){if(!bookOf(D,k))delete c.skillBooks[k];else c.skillBooks[k]=Math.max(0,c.skillBooks[k]|0);}c.settledBattles=Array.isArray(c.settledBattles)?c.settledBattles.filter(v=>typeof v==='string'):[];if(c.lastBattle&&!c.settledBattles.includes(c.lastBattle))c.settledBattles.push(c.lastBattle);for(const [id,r]of Object.entries(c.roster)){r.mastery=r.mastery&&typeof r.mastery==='object'?r.mastery:{};for(const k of Object.keys(r.mastery)){if(!D.skills[k])delete r.mastery[k];else r.mastery[k]=Math.max(0,Math.min(D.practice.max,Number(r.mastery[k])||0));}r.learned=Array.isArray(r.learned)?[...new Set(r.learned.filter(k=>bookOf(D,k)?.kind==='active'&&bookOf(D,k).unit===heroOf(D,id).unit))]:[];}
 c.items=c.items&&typeof c.items==='object'?c.items:{};
 for(const k of Object.keys(D.fieldItems))c.items[k]=Math.max(0,c.items[k]|0);
 c.pack=Array.isArray(c.pack)?c.pack:[];
 c.pack=Object.entries(packFor(D,c)).flatMap(([k,n])=>Array(n).fill(k));
 c.trades=c.trades&&typeof c.trades==='object'?c.trades:{};
 for(const k of Object.keys(D.trades))c.trades[k]=Math.max(0,Math.min(12,c.trades[k]|0));
 if(!c.mapEvent||!['herb','ore','chest','palanquin'].includes(c.mapEvent.kind))c.mapEvent=null;
 for(const [id,r] of Object.entries(c.roster)){
  r.rank=r.rank===1?1:0;r.star=Math.max(0,Math.min(r.rank?D.maxStar:5,r.star|0));r.starBank=Math.max(0,Math.min(5,r.starBank|0));
  r.sq.promoted=r.sq.promoted===true;
  r.passiveKnown=Array.isArray(r.passiveKnown)?[...new Set(r.passiveKnown.filter(k=>D.bookCatalog[k]?.kind==='passive'))]:[];
  if(r.activeBook&&!r.learned.includes(r.activeBook))delete r.activeBook;
  if(r.passiveBook&&!r.passiveKnown.includes(r.passiveBook))delete r.passiveBook;
 }
 return c;}
function mult(D,id,c){const h=heroOf(D,id),r=c.roster[id];return D.rarityMult[h.r]*(1+D.starStep*Math.min(5,r?.star||0)+D.highStarStep*Math.max(0,(r?.star||0)-5)+D.rankStep*(r?.rank||0))*(1+D.xp.statStep*((r?r.lv:1)-1));}
function skillsOf(D,id,c){const h=heroOf(D,id),u=D.units[h.unit],r=c.roster[id];const lv=r?r.lv:1;return [...new Set(allSkillsOf(D,id).filter(x=>lv>=x[1]).map(x=>x[0]) .concat(activeBook(r||{})||[]))];}
// 全部技能（含還沒學會的），給角色頁看
function allSkillsOf(D,id){const h=heroOf(D,id),u=D.units[h.unit];const P=(D.personal||{})[id]||[];const A=D.personalAt||{skill:1,ult:10};const L=(D.personalLv||{})[id];
 if(L)return [[u.skill,1,'職業技'],...P.map((k,i)=>[k,L[i],i===P.length-1?'專屬奧義':'專屬技']),D.secondSkill[h.unit]?[D.secondSkill[h.unit],D.secondAt,'職業進階']:null].filter(Boolean).sort((a,b)=>a[1]-b[1]);
 return [[u.skill,1,'職業技'],P[0]?[P[0],A.skill,'專屬技']:null,D.secondSkill[h.unit]?[D.secondSkill[h.unit],D.secondAt,'職業進階']:null,P[1]?[P[1],A.ult,'專屬奧義']:null].filter(Boolean);}
function traitsOf(D,id){const h=heroOf(D,id);if(!h)return [];const L=((D.rarityTraits||{})[h.unit]||[]).slice(0,Math.min(3,h.r+1)).map(t=>({...t}));const t=(D.innateTxt||{})[id];if(h.r===3&&t)L.push({name:t[0],desc:t[1],fx:(D.innate||{})[id]||{}});return L;}
function traitFx(D,id){const o={};for(const t of traitsOf(D,id))for(const [k,v] of Object.entries(t.fx||{}))o[k]=(o[k]||0)+v;return o;}
function soldiersOf(D,id,c){const h=heroOf(D,id),r=c.roster[id];return (D.units[h.unit].soldiers||5)+((r.sq||{}).tier||0)+(r.sq.promoted?1:0)+(D.talents?talFx(D,r,h.unit).sold:0);}
function slotsOf(D,r){return D.squad.slotsAt.filter(l=>r.sq.lv>=l).length;}
function art(h){return h.src&&h.src.startsWith('inbox/')?h.src:RG+h.src;}
// 出戰隊伍 → 戰鬥核心要的格式（士兵比例延續）
function teamFor(D,c,cosArt){return c.team.map((id,i)=>{const h=heroOf(D,id),r=c.roster[id],Q=D.squad,T=talFx(D,r,h.unit);for(const [k,v] of Object.entries(traitFx(D,id))){if(k in T&&k!=='tm'&&k!=='flags')T[k]+=v;else T.tm[k]=(T.tm[k]||0)+v;}for(const [k,v] of Object.entries(D.bookCatalog[r.passiveBook]?.fx||{}))T.tm[k]=(T.tm[k]||0)+v;const o={def:h.unit,rid:id,hero:id,name:h.name,title:h.title,lv:r.lv,mult:+mult(D,id,c).toFixed(3),sol:+(r.sol).toFixed(3),art:art(h),skills:skillsOf(D,id,c),soldiers:soldiersOf(D,id,c),hpPer:+((1+Q.hpStep*(r.sq.lv-1))*(1+T.solP)*(r.sq.promoted?1.1:1)).toFixed(3),sb:+(Q.baseBonus+Q.bonusStep*(r.sq.lv-1)+T.sb).toFixed(3),pas:r.sq.pas.slice(),eq:heroEq(D,c,id),mastery:{...(r.mastery||{})}};
  const tal={};for(const k of ['atkP','defP','resP','hpP','crit','hit','eva','move'])if(T[k])tal[k]=T[k];if(Object.keys(T.tm).length)o.tm=T.tm;if(T.flags.length)tal.flags=T.flags.slice();if(Object.keys(tal).length)o.tal=tal;const cp=r.cos&&cosArt&&cosArt(r.cos,id);if(cp)o.por=cp;if(i===0)o.pack=packFor(D,c);return o;});}
// ---------- 裝備 ----------
function fits(D,id,e,sl){if(!e)return false;const B=D.equip[e.b],h=heroOf(D,id);if(!B||!h)return false;if(sl&&B.slot!==sl)return false;return !B.units||B.units.includes(h.unit);}
function eqStats(D,e){const B=D.equip[e.b],k=D.eqRarity.mult[e.r]*(1+D.eqPlusStep*(e.p||0));const o={};for(const s of Object.keys(B.st))o[s]=+(B.st[s]*(B.fixed?.includes(s)?1:k)).toFixed(1);return o;}
function eqName(D,e){return D.equip[e.b].name+(e.p?' +'+e.p:'');}
function heroEq(D,c,id){const r=c.roster[id],o={};if(!r||!r.eq)return o;for(const sl of Object.keys(D.eqSlots)){const e=c.inv.find(x=>x.u===r.eq[sl]);if(!e)continue;const s=eqStats(D,e);for(const k of Object.keys(s))o[k]=(o[k]||0)+s[k];}for(const k of Object.keys(o))o[k]=+o[k].toFixed(1);return o;}
function ownerOf(c,u){for(const id of Object.keys(c.roster)){const q=c.roster[id].eq;if(q)for(const sl of Object.keys(q))if(q[sl]===u)return {id,sl};}return null;}
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
 const team=st.units.filter(u=>u.faction==='P'&&u.rid).map(u=>u.unitType||u.def);const usable=Object.keys(D.equip).filter(k=>!D.equip[k].units||D.equip[k].units.some(x=>team.includes(x)));const all=Object.keys(D.equip);
 const rollR=()=>{const x=rng();return x<R.rarity[2]?2:x<R.rarity[2]+R.rarity[1]?1:0;};
 const give=(b,r)=>{const e=addEq(D,c,b,r);out.eq.push(e.full?{b,r,full:true,ore:e.ore}:{u:e.u,b,r});};
 if(first&&win)give(usable[Math.floor(rng()*usable.length)%usable.length],Math.max(R.firstClearR,rollR()));
 if(rng()<(win?R.winEqChance:R.loseEqChance)){const pool=rng()<.6?usable:all;give(pool[Math.floor(rng()*pool.length)%pool.length],rollR());}
 const ore=win?ri(...R.winOre):ri(...R.loseOre);c.mats.ore+=ore;out.mats.ore=ore;
 if(win&&rng()<R.recordChance){c.mats.record++;out.mats.record=1;}
 const M=D.missions[st.missionId]||{};if(win&&!(R.relicSkip||[]).includes(st.missionId)&&(M.threat||0)>=R.relicThreat){const rr=rng();if(first||rr<R.relicChance){c.mats.relic++;out.mats.relic=1;}}
 return out;}
// ---------- 天賦 ----------
function talNode(D,nid){if(!D.talents)return null;if(typeof nid==='string'&&nid.startsWith('p_')){const hid=nid.slice(2,nid.lastIndexOf('_'));const L=(D.ptal||{})[hid]||[];const i=L.findIndex(n=>n.id===nid);return i>=0?{p:'me',hid,i,n:L[i]}:null;}for(const p of Object.keys(D.talents)){const i=D.talents[p].nodes.findIndex(n=>n.id===nid);if(i>=0)return {p,i,n:D.talents[p].nodes[i]};}return null;}
function talPts(D,r){return Math.floor((r.lv||1)/(D.talentEvery||2));}
function talFree(D,r){return talPts(D,r)-(r.tal||[]).length;}
function talCan(D,c,id,nid){const r=c.roster[id],T=talNode(D,nid);if(!T)return '沒有這個天賦';if(r.tal.includes(nid))return '已經點了';if(talFree(D,r)<1)return '天賦點不夠（每 '+D.talentEvery+' 級 1 點）';
 if(T.p==='me'&&T.hid!==id)return '這不是這位成員的天賦';const prev=T.p==='me'?D.ptal[T.hid][T.i-1]:D.talents[T.p].nodes[T.i-1];if(prev&&!r.tal.includes(prev.id))return '要先點「'+prev.name+'」';if(T.n.relic&&(c.mats.relic||0)<T.n.relic)return '要 '+T.n.relic+' 個發光的舊物';return null;}
function talLearn(D,c,id,nid){const e=talCan(D,c,id,nid);if(e)return {ok:false,error:e};const T=talNode(D,nid);if(T.n.relic)c.mats.relic-=T.n.relic;c.roster[id].tal.push(nid);return {ok:true};}
function talReset(D,c,id){const r=c.roster[id];if(!r.tal.length)return {ok:false,error:'還沒有點天賦'};if(c.supply<D.talentResetCost)return {ok:false,error:'補給不夠（要 '+D.talentResetCost+'）'};c.supply-=D.talentResetCost;let back=0;for(const n of r.tal){const T=talNode(D,n);if(T&&T.n.relic)back+=T.n.relic;}c.mats.relic+=back;r.tal=[];return {ok:true,relic:back};}
function talFx(D,r,unit){const o={atkP:0,defP:0,resP:0,hpP:0,crit:0,hit:0,eva:0,solP:0,sb:0,sold:0,move:0,flags:[],tm:{}};for(const n of (r.tal||[])){const T=talNode(D,n);if(!T)continue;for(const [k,v] of Object.entries(T.n.fx)){if(k==='flag')o.flags.push(v);else if(k in o&&k!=='tm'&&k!=='flags')o[k]+=v;else if(typeof v==='number')o.tm[k]=(o.tm[k]||0)+v;else o.tm[k]=v;}}
 // 治療師的「鋒」改成治療量
 if(unit==='P_HEALER'&&o.atkP){o.tm.healP=(o.tm.healP||0)+o.atkP*2.5;o.atkP=0;}if(o.tm.quick){o.flags.push('quick');delete o.tm.quick;}return o;}
// ---------- 神秘角色：開局二選一 ----------
function chooseMythic(D,c,id){const h=heroOf(D,id);if(!h||!h.myth)return {ok:false,error:'沒有這位'};if(c.mythic)return {ok:false,error:'已經選過了'};c.mythic=id;if(!c.roster[id])c.roster[id]=blankHero();if(!c.team.includes(id)){if(c.team.length>=TS(D))c.team[c.team.length-1]=id;else c.team.push(id);}return {ok:true};}
// ---------- 渡鴉幣與時裝 ----------
function buyCostume(D,c,cid,price){if(c.cosOwned.includes(cid))return {ok:false,error:'已經有了'};if(c.coins<price)return {ok:false,error:'渡鴉幣不夠（要 '+price+'）'};c.coins-=price;c.cosOwned.push(cid);return {ok:true};}
// ---------- 好感與禮物 ----------
function affTier(D,r){const T=D.aff.tiers;let t=0;for(let i=0;i<T.length;i++)if((r.aff||0)>=T[i])t=i;return t;}
function chat(D,c,id,day){const r=c.roster[id];if(!r)return {ok:false};if(r.chatDay===day)return {ok:true,gain:0,tier:affTier(D,r)};const t0=affTier(D,r);r.chatDay=day;r.aff+=D.aff.chat;return {ok:true,gain:D.aff.chat,tier:affTier(D,r),up:affTier(D,r)>t0};}
function giveGift(D,c,id,g,likes){const r=c.roster[id];if(!r||!(c.gifts[g]>0))return {ok:false,error:'沒有這個禮物'};c.gifts[g]--;const t0=affTier(D,r);const liked=(likes||[]).includes(g);const n=liked?D.aff.giftLike:D.aff.gift;r.aff+=n;return {ok:true,gain:n,liked,tier:affTier(D,r),up:affTier(D,r)>t0};}
function addGift(c,g,n){c.gifts[g]=(c.gifts[g]||0)+(n||1);}
// ---------- 委託板 ----------
function questNew(D,c,rng){const Q=D.quests;const done=Object.keys(c.cleared||{}).filter(m=>D.missions[m]);if(!done.length)return null;const mid=done[Math.floor(rng()*done.length)%done.length];const M=D.missions[mid];const ks=Object.keys(Q.kinds);const k=ks[Math.floor(rng()*ks.length)%ks.length];
 let n=0;if(k==='fast')n=Math.max(3,Math.ceil(M.roundLimit*.7));else if(k==='kills')n=6+Math.floor(rng()*3);else if(k==='soldiers')n=[50,60,70][Math.floor(rng()*3)%3];
 const rw=JSON.parse(JSON.stringify(Q.rewards[Math.floor(rng()*Q.rewards.length)%Q.rewards.length]));return {id:'q'+(c.qn=(c.qn|0)+1),mission:mid,kind:k,n,from:Q.from[Math.floor(rng()*Q.from.length)%Q.from.length],rw};}
function questFill(D,c,rng){rng=rng||Math.random;c.quests=Array.isArray(c.quests)?c.quests.filter(q=>q&&D.missions[q.mission]&&D.quests.kinds[q.kind]):[];let guard=0;while(c.quests.length<D.quests.max&&guard++<20){const q=questNew(D,c,rng);if(!q)break;if(c.quests.some(x=>x.mission===q.mission&&x.kind===q.kind))continue;c.quests.push(q);}return c.quests;}
function questText(D,q){const M=D.missions[q.mission];return D.quests.kinds[q.kind].txt.replace('{place}',M.place||M.name).replace('{n}',q.n);}
function questMet(D,q,st){if(!st.result||!st.result.win||st.missionId!==q.mission)return false;const P=st.units.filter(u=>u.faction==='P');
 if(q.kind==='noloss')return P.every(u=>u.hp>0);if(q.kind==='fast')return st.round<=q.n;if(q.kind==='kills')return P.reduce((s,u)=>s+(u.kills||0),0)>=q.n;
 if(q.kind==='soldiers'){const a=P.reduce((s,u)=>s+Math.round(u.sol/Math.max(1,u.hpPer)),0),b=P.reduce((s,u)=>s+Math.round(u.solMax/Math.max(1,u.hpPer)),0);return b>0&&a*100>=q.n*b;}return false;}
function questGive(D,c,rw,st,rng){const out={mats:{},eq:[]};for(const [k,v] of Object.entries(rw)){if(k==='tickets')c.tickets+=v;else if(k==='supply')c.supply+=v;else if(k==='coins')c.coins+=v;else if(k==='gift'){const L=D.giftDrop.list;for(let i=0;i<v;i++){const g=L[Math.floor(rng()*L.length)%L.length];addGift(c,g);(out.gifts=out.gifts||[]).push(g);}continue;}else if(k==='eq'){const team=st?st.units.filter(u=>u.faction==='P'&&u.rid).map(u=>u.unitType||u.def):[];const usable=Object.keys(D.equip).filter(b=>!D.equip[b].units||D.equip[b].units.some(x=>team.includes(x)));const pool=usable.length?usable:Object.keys(D.equip);for(let i=0;i<v;i++){const b=pool[Math.floor(rng()*pool.length)%pool.length];const r=rng()<.25?2:1;const e=addEq(D,c,b,r);out.eq.push(e.full?{b,r,full:true,ore:e.ore}:{u:e.u,b,r});}continue;}else c.mats[k]=(c.mats[k]||0)+v;out.mats[k]=v;}return out;}
function questCheck(D,c,st,rng){rng=rng||Math.random;c.quests=Array.isArray(c.quests)?c.quests:[];const got=[];for(const q of c.quests.slice()){if(questMet(D,q,st)){const g=questGive(D,c,q.rw,st,rng);got.push({q,g});c.quests=c.quests.filter(x=>x.id!==q.id);c.qdone=(c.qdone|0)+1;}}questFill(D,c,rng);return got;}
function questReroll(D,c,rng){if(c.supply<D.quests.rerollCost)return {ok:false,error:'補給不夠（要 '+D.quests.rerollCost+'）'};c.supply-=D.quests.rerollCost;c.quests=[];questFill(D,c,rng);return {ok:true};}
// ---------- 招集 ----------
function rollRarity(D,c,rng){const R=D.gacha.rates,x=rng();let r=x<(R[3]||0)?3:x<(R[3]||0)+R[2]?2:x<(R[3]||0)+R[2]+R[1]?1:0;if((c.mythSince||0)+1>=D.gacha.mythPity)r=3;else if(c.sincePity+1>=D.gacha.pity&&r<2)r=2;return r;}
function pickHero(D,r,rng){const pool=D.heroes.filter(h=>h.r===r);return pool[Math.floor(rng()*pool.length)%pool.length];}
function grantHero(D,c,h){const had=!!c.roster[h.id];let note;if(!had){c.roster[h.id]=blankHero();note='新成員';if(c.team.length<TS(D))c.team.push(h.id);}else if(c.roster[h.id].star<(c.roster[h.id].rank?D.maxStar:5)){c.roster[h.id].star++;note='重複：星級 +1';}else if(!c.roster[h.id].rank&&(c.roster[h.id].starBank||0)<5){c.roster[h.id].starBank=(c.roster[h.id].starBank||0)+1;note='重複：保存一枚星印，突破後升星';}else{c.supply+=20;note='重複（星級已滿）：補給 +20';}return {id:h.id,name:h.name,title:h.title,r:h.r,isNew:!had,note};}
function exchangeMythic(D,c,id){const h=heroOf(D,id);if(!h||h.r!==3)return {ok:false,error:'沒有這位神秘成員'};if((c.mythMarks||0)<D.gacha.mythExchange)return {ok:false,error:'燈印不足'};c.mythMarks-=D.gacha.mythExchange;return {ok:true,results:[grantHero(D,c,h)]};}
function pull(D,c,n,rng){rng=rng||Math.random;if(!Number.isInteger(n)||![1,10].includes(n))return {ok:false,error:'招集次數不正確'};if(c.tickets<n)return {ok:false,error:'招集券不夠'};c.tickets-=n;const out=[];let hasElite=false,hasLegend=false;
 for(let i=0;i<n;i++){let r=rollRarity(D,c,rng);if(n===10&&i===9){if(!hasElite&&r<1)r=1;if(!c.firstTenUsed&&D.gacha.firstTen&&!hasLegend&&r<2)r=2;}hasElite=hasElite||r>=1;hasLegend=hasLegend||r>=2;c.pulls++;c.sincePity=r>=2?0:c.sincePity+1;c.mythSince=r===3?0:(c.mythSince||0)+1;c.mythMarks=(c.mythMarks||0)+1;out.push(grantHero(D,c,pickHero(D,r,rng)));}
 if(n===10)c.firstTenUsed=true;c.log.unshift({t:'pull',n,ids:out.map(o=>o.id)});c.log=c.log.slice(0,30);return {ok:true,results:out};}
// 救援支線：領獎與解鎖均持久保存，重打不會重複給一次性獎勵。
function acceptRescue(D,c){if(c.flags.rescueAccepted)return {ok:false,error:'已經接下請託'};if(!(c.cleared||{}).MISSION_BC_001)return {ok:false,error:'先守住南門'};c.flags.rescueAccepted=true;return {ok:true};}
function rescueOutcome(c,st){if(st.missionId!=='MISSION_RESCUE')return null;if(st.result&&st.result.win&&st.escort&&st.escort.status==='safe'){if(c.flags.rescueSafe)return null;c.flags.rescueSafe=true;return 'safe';}c.flags.rescueAttempted=true;return 'retry';}
function claimRescue(D,c){if(!c.flags.rescueSafe||c.flags.rescueReward)return {ok:false,error:'還沒有可領取的謝禮'};c.flags.rescueReward=true;c.supply+=40;c.tickets+=2;return {ok:true};}
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
function afterBattle(D,c,st,rng){rng=rng||Math.random;if(c.lastBattle===st.battleInstanceId||(c.settledBattles||[]).includes(st.battleInstanceId))return {dup:true};c.settledBattles=c.settledBattles||[];c.settledBattles.push(st.battleInstanceId);c.lastBattle=st.battleInstanceId;const R=D.rewards;const win=st.result&&st.result.win;const got={tickets:0,supply:0};
 if(win){got.tickets+=R.win.tickets;got.supply+=R.win.supply;if(!st.gate.none&&st.gate.hp>=200)got.tickets+=R.winClean.tickets;c.wins++;c.cleared=c.cleared||{};if(!c.cleared[st.missionId]){c.cleared[st.missionId]=true;got.first=true;got.tickets+=2;got.supply+=(R.firstSupply||0);}}else{got.tickets+=R.lose.tickets;got.supply+=R.lose.supply;}
 c.battles++;c.tickets+=got.tickets;c.supply+=got.supply;
 got.xp={};got.lvUp={};got.practice={};const X=D.xp;
 for(const u of st.units)if(u.faction==='P'&&u.rid&&c.roster[u.rid]){const r=c.roster[u.rid];for(const [sk,n]of Object.entries(u.practiceGain||{})){if(!D.skills[sk]||!(u.skills||[]).includes(sk))continue;r.mastery=r.mastery||{};const gain=Math.max(0,Math.min(D.practice.battleCap,Number(n)||0,D.practice.max-(r.mastery[sk]||0)));if(gain){r.mastery[sk]=(r.mastery[sk]||0)+gain;(got.practice[u.rid]=got.practice[u.rid]||{})[sk]=gain;}}r.sol=u.hp>0?+(u.sol/Math.max(1,u.solMax)).toFixed(3):0;const k=u.kills||0;const xp=X.join+(win?X.win:0)+X.kill*k;const up=addXp(D,r,xp);got.xp[u.rid]=xp;if(up)got.lvUp[u.rid]=r.lv;got.supply+=(D.rewards.perKill||0)*k;c.supply+=(D.rewards.perKill||0)*k;}
 if(D.equip)got.drops=rollDrops(D,c,st,win,!!got.first,rng);if(D.coins){const k=win?D.coins.win+(got.first?D.coins.first:0):D.coins.lose;c.coins+=k;got.coins=k;}
 if(D.giftDrop&&win&&rng()<D.giftDrop.chance){const g=D.giftDrop.list[Math.floor(rng()*D.giftDrop.list.length)%D.giftDrop.list.length];addGift(c,g);got.gift=g;}
 if(D.quests)got.quests=questCheck(D,c,st,rng);got.rescue=rescueOutcome(c,st);got.skillBook=rollSkillBook(D,c,st,!!got.first,rng);
 if(win){
  if(c.cleared.MISSION_MINE&&!c.flags.heroBookGift){giveBook(c,'br_hero');c.flags.heroBookGift=true;got.rankBook='br_hero';}
  if(c.cleared.MISSION_POST&&!c.flags.squadBookGift){giveBook(c,'br_squad');c.flags.squadBookGift=true;got.squadBook='br_squad';}
  mapEventAfterWin(D,c,st,rng);
 }
 c.log.unshift({t:'battle',win,fac:st.faction,got:{tickets:got.tickets,supply:got.supply}});c.log=c.log.slice(0,30);return got;}

// 技能書是職業用的補充技能，不包含角色專屬與神秘技能。
function bookOf(D,k){return Object.hasOwn(D.bookCatalog,k)?D.bookCatalog[k]:null;}
function bookBuy(D,c,k){
 const b=bookOf(D,k);if(!b)return {ok:false,error:'沒有這本技能書'};
 const price=bookPrice(D,b);if(c.coins<price)return {ok:false,error:'渡鴉幣不足'};
 c.coins-=price;giveBook(c,k);return {ok:true};
}
function bookSell(D,c,k){if(!bookOf(D,k)||!((c.skillBooks||{})[k]>0))return {ok:false,error:'沒有這本技能書'};c.skillBooks[k]--;c.supply+=D.bookRules.sellSupply;return {ok:true};}
function bookDesc(D,b){return b.kind==='active'?D.skills[b.skill].desc:b.desc;}
function bookPrice(D,b){return b.price||D.bookRules.price;}
function activeBook(r){return r.activeBook===undefined?(r.learned||[])[0]:r.activeBook;}
function selectBook(D,c,id,kind,k){
 const r=c.roster[id],field=kind==='passive'?'passiveBook':'activeBook',known=kind==='passive'?r?.passiveKnown:r?.learned;
 if(!r||(k&&!known?.includes(k)))return {ok:false,error:'尚未研習這本書'};
 r[field]=k||'';return {ok:true};
}
function bookEligibility(D,c,id,k){
 const b=bookOf(D,k),r=c.roster[id],h=heroOf(D,id);
 if(!r||!h||!b||(b.unit&&h.unit!==b.unit))return '職業不符';
 if(b.kind==='heroRank')return r.rank?'已突破':r.star<5||r.lv<10?'需五星且 Lv10':'';
 if(b.kind==='squadRank')return r.sq.promoted?'已晉升':r.sq.lv<D.squad.maxLv||r.sq.tier<D.squad.maxTier?'需兵團 Lv5 且三階':'';
 if(b.kind==='squad')return r.sq.pas.includes(b.pas)?'兵團已有這項本事':r.sq.pas.length>=slotsOf(D,r)?'兵團沒有空的被動欄':'';
 const level=b.minLv||D.bookRules.minLv;
 if(r.lv<level)return '需 Lv'+level;
 if((b.kind==='passive'?r.passiveKnown:r.learned)?.includes(k))return '已學會，技能書保留';
 return '';
}
function bookLearn(D,c,id,k){
 const error=bookEligibility(D,c,id,k);if(error)return {ok:false,error};
 if(!((c.skillBooks||{})[k]>0))return {ok:false,error:'沒有這本技能書'};
 const b=bookOf(D,k),r=c.roster[id];
 c.skillBooks[k]--;
 if(b.kind==='heroRank'){
  r.rank=1;
  r.star=Math.min(D.maxStar,5+(r.starBank||0));r.starBank=0;
 }else if(b.kind==='squadRank'){
  const n=Math.round(r.sol*soldiersOf(D,id,c));
  r.sq.promoted=true;r.sol=+(n/soldiersOf(D,id,c)).toFixed(3);
 }else if(b.kind==='squad')r.sq.pas.push(b.pas);
 else if(b.kind==='passive'){
  r.passiveKnown=r.passiveKnown||[];r.passiveKnown.push(k);
  if(r.passiveBook===undefined)r.passiveBook=k;
 }else{
  const selected=activeBook(r);
  r.learned=r.learned||[];r.learned.push(k);
  if(!selected&&r.activeBook===undefined)r.activeBook=k;
 }
 return {ok:true};
}
function rollSkillBook(D,c,st,first,rng){
 if(!st.result?.win||(!first&&rng()>=D.bookRules.dropChance))return null;
 const ids=st.units.filter(u=>u.faction==='P'&&c.roster[u.rid]).map(u=>u.rid);
 const units=new Set(ids.map(id=>heroOf(D,id).unit));
 const catalog=Object.entries(D.bookCatalog);
 const eligible=catalog.filter(([,b])=>b.kind==='active'&&(!units.size||units.has(b.unit)));
 const fresh=eligible.filter(([k,b])=>!c.skillBooks?.[k]&&ids.some(id=>heroOf(D,id).unit===b.unit&&!c.roster[id].learned?.includes(k)));
 const support=catalog.filter(([,b])=>b.kind==='passive'||b.kind==='squad');
 const pool=first&&fresh.length?fresh:!first&&rng()<.3?support:eligible;
 if(!pool.length)return null;
 const k=pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))][0];
 giveBook(c,k);return k;
}
function giveBook(c,k){c.skillBooks=c.skillBooks||{};c.skillBooks[k]=(c.skillBooks[k]||0)+1;}
function buyFieldItem(D,c,k){
 const item=D.fieldItems[k];if(!item)return {ok:false,error:'沒有這件物品'};
 if(c.coins<item.price)return {ok:false,error:'渡鴉幣不足'};
 c.coins-=item.price;giveItem(c,k);return {ok:true};
}
function buySupplies(D,c){
 const {price,amount}=D.shopSupply;
 if(c.coins<price)return {ok:false,error:'渡鴉幣不足'};
 c.coins-=price;c.supply+=amount;return {ok:true};
}
function giveItem(c,k){c.items=c.items||{};c.items[k]=(c.items[k]||0)+1;}
function packFor(D,c){
 const out={};let n=0;
 for(const k of c.pack||[]){
  if(!Object.hasOwn(D.fieldItems,k)||n>=D.packMax||(out[k]||0)>=(c.items?.[k]||0))continue;
  out[k]=(out[k]||0)+1;n++;
 }
 return out;
}
function packItem(D,c,k,add){
 c.pack=c.pack||[];
 if(add){
  if(!Object.hasOwn(D.fieldItems,k)||c.pack.length>=D.packMax||c.pack.filter(x=>x===k).length>=(c.items?.[k]||0))return false;
  c.pack.push(k);
 }else{
  const i=c.pack.indexOf(k);if(i<0)return false;c.pack.splice(i,1);
 }
 return true;
}
function spendItem(c,k){
 if(!(c.items?.[k]>0))return false;
 c.items[k]--;const i=c.pack?.indexOf(k)??-1;if(i>=0)c.pack.splice(i,1);return true;
}
function tradeLevel(c,k){return Math.min(5,1+Math.floor((c.trades?.[k]||0)/3));}
function trainTrade(c,k){c.trades=c.trades||{};c.trades[k]=Math.min(12,(c.trades[k]||0)+1);}
function craftItem(D,c,k){
 const costs={bandage:['herb',2],smoke:['ore',2],oil:['herb',3]};
 const cost=costs[k];if(!cost)return {ok:false,error:'沒有這份配方'};
 const [material,n]=cost;
 if(k==='oil'&&tradeLevel(c,'craft')<2)return {ok:false,error:'工匠 Lv2 才能製作'};
 if((c.mats?.[material]||0)<n)return {ok:false,error:'材料不足'};
 c.mats[material]-=n;giveItem(c,k);trainTrade(c,'craft');return {ok:true};
}
function mapEventAfterWin(D,c,st,rng){
 if(c.mapEvent||!c.cleared?.MISSION_BC_001)return;
 const first=!c.flags.mapFirst;
 if(!first&&rng()>=.55)return;
 const list=['herb','ore','chest','palanquin'];
 const kind=first?'herb':list[Math.min(3,Math.floor(rng()*4))];
 c.flags.mapFirst=true;c.mapEvent={kind,mission:st.missionId};
}
function mapEventClaim(D,c,take){
 const event=c.mapEvent;if(!event)return {ok:false,error:'此事件已處理'};
 const k=event.kind;
 if(take&&k==='palanquin'&&c.supply<10)return {ok:false,error:'至少需要 10 補給'};
 c.mapEvent=null;if(!take)return {ok:true,note:'沿原路回南門。'};
 if(k==='herb'||k==='ore'){
  const n=1+tradeLevel(c,k);
  c.mats[k]=(c.mats[k]||0)+n;trainTrade(c,k);
  return {ok:true,note:(k==='herb'?'藥草':'白鐵礦石')+' +'+n};
 }
 if(k==='chest'){c.coins+=8;giveItem(c,'bandage');return {ok:true,note:'渡鴉幣 +8，急救布包 +1。'};}
 c.supply-=10;giveItem(c,'oil');giveBook(c,'bs_hold');
 if(!c.flags.roadFavor)c.flags.roadFavor='waiting';
 return {ok:true,note:'補給 −10，淨路燈油和《守路列譜》各 +1。'};
}
function finishRoadFavor(c){
 if(c.flags.roadFavor!=='waiting')return {ok:false,error:'這份請託已經處理'};
 if(!spendItem(c,'bandage'))return {ok:false,error:'請先準備一份急救布包'};
 c.flags.roadFavor='done';giveBook(c,'bp_care');return {ok:true};
}
const API={finishRoadFavor,bookDesc,bookPrice,bookEligibility,activeBook,selectBook,buySupplies,buyFieldItem,packItem,packFor,spendItem,tradeLevel,craftItem,mapEventClaim,bookOf,bookLearn,bookBuy,bookSell,rollSkillBook,traitsOf,traitFx,rollRarity,exchangeMythic,acceptRescue,rescueOutcome,claimRescue,chooseMythic,allSkillsOf,buyCostume,affTier,chat,giveGift,addGift,questNew,questFill,questText,questMet,questGive,questCheck,questReroll,talNode,talPts,talFree,talCan,talLearn,talReset,talFx,fits,eqStats,eqName,heroEq,ownerOf,addEq,equip,unequip,enhanceCost,enhance,dismantleGain,dismantle,useRecord,rollDrops,newCamp,fix,teamFor,pull,refill,refillCost,afterBattle,heroOf,mult,art,skillsOf,soldiersOf,slotsOf,sqLvCost,sqUp,tierCost,sqTier,learn,forget,addXp};
if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.CAMP=API;
})(this);
