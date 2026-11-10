// 渡鴉下潛 —— 規則核心（純函式、同一個種子結果一樣）
(function(root){
'use strict';
function hash(){let h=2166136261>>>0;for(const a of arguments){const s=String(a);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}h^=124;h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function rngAt(seed,n){let a=hash(seed,n);a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;}
const R=st=>rngAt(st.seed,st.n++);
const ri=(st,a,b)=>a+Math.floor(R(st)*(b-a+1));
const pick=(st,arr)=>arr[Math.floor(R(st)*arr.length)];
function pickW(st,obj){let tot=0;for(const k in obj)tot+=obj[k];let v=R(st)*tot;for(const k in obj){v-=obj[k];if(v<0)return k;}return Object.keys(obj)[0];}
function shuffle(st,a){for(let i=a.length-1;i>0;i--){const j=Math.floor(R(st)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const clone=o=>JSON.parse(JSON.stringify(o));
const TIMED=['vuln','weak','link','regen'];

// ── 卡牌
function cardDef(D,c){const b=D.cards[c.id];if(!c.up||!b.u)return b;return Object.assign({},b,b.u,{n:b.n+'+'});}
function cost(D,c){if(c.free)return 0;const k=cardDef(D,c).c;return k<0?k:k+(c.tax||0);}
function needsTarget(D,c){return cardDef(D,c).fx.some(f=>(['d','jd','lk','px2','ep'].includes(f[0]))||((f[0]==='st'||f[0]==='pa')&&(f[f.length-1]==='t')));}
function opText(D,f){const S=D.status;const sc=f[3];
 const scT=sc?(sc.startsWith('pact')?`，目標每有 1 層厄契多 ${sc.slice(4)}`:sc.startsWith('ink')?`，用掉所有墨，每 1 墨多 ${sc.slice(3)}`:''):'';
 switch(f[0]){
  case 'd':return `造成 ${f[1]} 點傷害${f[2]>1?` ${f[2]} 次`:''}${scT}`;
  case 'da':return `對所有敵人造成 ${f[1]} 點傷害${f[2]>1?` ${f[2]} 次`:''}${sc?`，每個敵人每有 1 層厄契多 ${sc.slice(4)}`:''}`;
  case 'b':return `獲得 ${f[1]} 格擋`;
  case 'dr':return `抽 ${f[1]} 張牌`;
  case 'en':return `獲得 ${f[1]} 能量`;
  case 'ep':return `目標有厄契時，獲得 ${f[1]} 能量`;
  case 'st':return f[3]==='s'?`獲得 ${f[2]} 層${S[f[1]].name}`:f[3]==='a'?`所有敵人獲得 ${f[2]} 層${S[f[1]].name}`:`給予 ${f[2]} 層${S[f[1]].name}`;
  case 'pa':return f[2]==='a'?`所有敵人獲得 ${f[1]} 層厄契`:`給予 ${f[1]} 層厄契`;
  case 'ink':return `獲得 ${f[1]} 墨`;
  case 'jd':return `用掉目標所有厄契，每層造成 ${f[1]} 點傷害`;
  case 'lk':return `用命線連住目標和其他敵人 2 回合`;
  case 'hp':return `回復 ${f[1]} 點生命`;
  case 'cp':return `複製手上另一張隨機的牌，這回合免費`;
  case 'pw':return D.powers[f[1]].replace('{n}',f[2]);
  case 'px2':return `目標的厄契加倍`;
  case 'rw':return `丟掉所有手牌，再抽同樣的張數`;
  case 'ka':return `這回合結束時，手上所有的牌都保留`;
  case 'hurt':return `失去 ${f[1]} 生命`;
  case 'mhp':return `最大生命永久 ${f[1]}`;
  case 'gk':return `如果打倒敵人，多得 ${f[1]} 渡鴉幣`;
 }return '';}
function desc(D,c){const d=cardDef(D,c);if(d.t==='x'){let s='不能打出。';if(d.onDraw)s+=`抽到時，失去 ${d.onDraw[1]} 生命。`;if(d.endHand)s+=`回合結束時還在手上，失去 ${d.endHand[1]} 生命。`;if(d.noRemove)s+='不能被移除。';return s;}if(!d.fx.length)return '沒有效果。'+(d.ex?'消耗。':'');let s=d.fx.map(f=>opText(D,f).replace(/。$/,'')).join('。')+'。';if(d.keep)s+='保留。';if(d.ex)s+='消耗。';return s;}

// ── 開新的一局
function newRun(D,seed,ch,meta){seed=seed>>>0||1;const C=D.chars[ch];
 const st={v:1,seed,n:0,ch,hp:C.hp,maxHp:C.hp,gold:99,deck:[],relics:[],layer:0,row:-1,col:null,maps:[],screen:'map',combat:null,reward:null,event:null,shop:null,pick:null,
  stats:{floors:0,elites:0,bosses:0,kills:0,dmgMax:0,cards:0},flags:{},uid:1,seenEv:[],unlocked:(meta&&meta.unlocked||[]).slice(),result:null,log:[]};
 for(const id of C.deck)addCard(st,id);
 gainRelic(D,st,C.relic);
 st.v=2;st.kp=(meta&&meta.keeper||[]).slice();const K=id=>st.kp.includes(id);
 if(K('m_hp1')){st.maxHp+=5;st.hp+=5;}if(K('m_hp2')){st.maxHp+=5;st.hp+=5;}if(K('m_gold'))st.gold+=40;
 const prep={};if(K('m_relic')){const p=shuffle(st,commonRelics(D,st)).slice(0,3);if(p.length)prep.relics=p;}if(K('m_remove'))prep.remove=1;
 if(prep.relics||prep.remove){st.prep=prep;st.screen='prep';}
 st.maps.push(genMap(D,st,0));
 return st;}
const COSTLY=['eyebutton','borrowedheart','namelesslamp','tornphoto'];
function commonRelics(D,st){return relicPool(D,st).filter(k=>!D.relics[k].ch&&!COSTLY.includes(k)&&k!=='anchor');}
function addCard(st,id,up){const c={uid:st.uid++,id,up:up?1:0};st.deck.push(c);return c;}
function genMap(D,st,L){const M=D.map;const rows=[];
 for(let r=0;r<M.rows;r++){const row=[];for(let c=0;c<M.cols;c++){let t;if(r===0)t='fight';else if(r===M.rows-1)t='rest';else{const w=Object.assign({},M.w);if(r<2)delete w.elite;if(r===M.rows-2)delete w.rest;t=pickW(st,w);}row.push({t,e:[]});}rows.push(row);}
 for(let r=0;r<M.rows-1;r++)for(let c=0;c<M.cols;c++){const opts=[c-1,c,c+1].filter(x=>x>=0&&x<M.cols);const e=shuffle(st,opts.slice()).slice(0,1+(R(st)<.55?1:0));rows[r][c].e=e.sort();}
 // 確保下一排每一格至少有人連得到
 for(let r=1;r<M.rows;r++)for(let c=0;c<M.cols;c++){if(!rows[r-1].some(n=>n.e.includes(c))){const from=Math.min(M.cols-1,Math.max(0,c+(R(st)<.5?-1:1)));const src=rows[r-1][Math.abs(from-c)<=1?from:c];if(!src.e.includes(c)){src.e.push(c);src.e.sort();}}}
 return {rows};}

// ── 遺物
function has(st,id){return st.relics.includes(id);}
function gainRelic(D,st,id){if(!id||has(st,id))return;st.relics.push(id);if(id==='vial'){st.maxHp+=10;st.hp+=10;}if(id==='borrowedheart'){st.maxHp+=15;st.hp+=15;}if(id==='tornphoto')addCard(st,'x_name');}
function relicPool(D,st){return Object.keys(D.relics).filter(k=>!D.relics[k].start&&!has(st,k)&&(!D.relics[k].ch||D.relics[k].ch===st.ch)&&(k!=='anchor'||st.unlocked.includes('relic2')));}

// ── 牌池
function pool(D,st,minR){return Object.keys(D.cards).filter(k=>{const c=D.cards[k];if(c.r<1||c.t==='x')return false;if(c.ch!==st.ch&&c.ch!=='any')return false;if(c.lock&&!st.unlocked.includes(c.lock))return false;if(minR&&c.r<minR)return false;return true;});}
function rollCards(D,st,n,elite){const out=[];let guard=0;while(out.length<n&&guard++<200){const v=R(st);const r=v<(elite?.12:.05)?3:v<(elite?.5:.37)?2:1;const p=pool(D,st).filter(k=>D.cards[k].r===r&&!out.includes(k));if(p.length)out.push(pick(st,p));}return out;}

// ── 戰鬥
function mkEnemy(D,st,id,i){const E=D.enemies[id];const L=D.layers[st.layer]||{};const hp=Math.round(ri(st,E.hp[0],E.hp[1])*(E.boss?1:E.elite?(1+((L.hpMul||1)-1)*.35):(L.hpMul||1)));return {uid:'e'+i+'_'+st.n,id,n:E.n,hp,max:hp,block:0,st:{},mi:-1,last:[],intent:null};}
function chooseIntent(D,st,e){const E=D.enemies[e.id];let i;
 if(E.seq){e.mi=(e.mi+1)%E.mv.length;i=e.mi;}
 else{const w={};E.mv.forEach((m,k)=>{if(e.last.length>=2&&e.last[0]===k&&e.last[1]===k)return;w[k]=m.w;});i=+pickW(st,w);e.last=[i].concat(e.last).slice(0,2);}
 e.intent=Object.assign({i},E.mv[i]);}
function startCombat(D,st,ids,kind){const ens=ids.map((id,i)=>mkEnemy(D,st,id,i));if(ids.length>1)for(const e of ens){e.hp=e.max=Math.round(e.max*.85);}const c={kind,enemies:ens,draw:shuffle(st,st.deck.map(x=>({uid:x.uid,id:x.id,up:x.up}))),hand:[],disc:[],exh:[],energy:0,maxE:3,block:0,st:{},pw:{},ink:0,turn:0,hurt:0,atkN:0,log:[]};
 st.combat=c;st.screen='combat';const E=[];
 if(has(st,'eyebutton')){c.maxE=4;c.draw.splice(Math.floor(R(st)*(c.draw.length+1)),0,{uid:'w'+st.uid++,id:'x_whisper',up:0});}
 if(has(st,'namelesslamp'))selfHurt(D,st,3,E,true);
 if(has(st,'thread'))for(const e of c.enemies)addSt(e,'pact',1);
 if(has(st,'mask'))for(const e of c.enemies)addSt(e,'vuln',1);
 if(has(st,'whet'))addSt(c,'str',1);
 if(has(st,'shell'))c.block+=10;
 if(has(st,'inkpot'))gainInk(st,c,3,E);
 for(const e of c.enemies)chooseIntent(D,st,e);
 startTurn(D,st,E);return E;}
function addSt(u,k,n){u.st[k]=(u.st[k]||0)+n;if(u.st[k]<=0)delete u.st[k];}
function gainInk(st,c,n,E){c.ink+=n;if(c.pw.inkBlock)c.block+=c.pw.inkBlock*n;if(c.ink>=10)E.push({t:'ach',id:'ink10'});}
function draw(D,st,n,E){const c=st.combat;for(let i=0;i<n;i++){if(c.hand.length>=10)break;if(!c.draw.length){if(!c.disc.length)break;c.draw=shuffle(st,c.disc);c.disc=[];E&&E.push({t:'shuffle'});}const x=c.draw.pop();c.hand.push(x);const xd=D.cards[x.id];if(xd&&xd.onDraw&&xd.onDraw[0]==='hurt'&&E)selfHurt(D,st,xd.onDraw[1],E);}}
function startTurn(D,st,E){const c=st.combat;c.turn++;c.atkN=0;
 if(!(c.turn===2&&has(st,'anchor')))c.block=0;
 c.energy=c.maxE+(c.turn===1&&has(st,'lantern')?1:0);
 if(c.pw.pactTurn)for(const e of alive(c))addSt(e,'pact',c.pw.pactTurn);
 if(c.pw.strTurn)addSt(c,'str',c.pw.strTurn);
 if(has(st,'quill'))gainInk(st,c,1,E);
 if(c.pw.inkTurn)gainInk(st,c,c.pw.inkTurn,E);
 if(has(st,'paperweight')&&c.ink>=5){c.energy++;E.push({t:'relic',id:'paperweight'});}
 draw(D,st,5+(c.turn===1&&has(st,'feather')?2:0)+(c.turn===1&&has(st,'tornphoto')?3:0)+(c.pw.drawTurn||0),E);
 if(c.stealQ&&c.stealQ.length){for(const q of c.stealQ){const e=c.enemies.find(x=>x.uid===q.uid&&x.hp>0);if(!e)continue;e.stolen=e.stolen||[];for(let i=0;i<q.n&&c.hand.length;i++){const k=Math.floor(R(st)*c.hand.length);const x=c.hand.splice(k,1)[0];if(!x.temp)e.stolen.push({uid:x.uid,id:x.id,up:x.up});E.push({t:'steal',uid:e.uid,id:x.id});}}c.stealQ=[];}
 if(c.taxNext){const can=c.hand.filter(x=>cardDef(D,x).c>=0);shuffle(st,can).slice(0,c.taxNext).forEach(x=>x.tax=1);E.push({t:'tax',n:Math.min(c.taxNext,can.length)});c.taxNext=0;}
 E.push({t:'turn',n:c.turn});}
const alive=c=>c.enemies.filter(e=>e.hp>0);
function dmgCalc(base,att,def){let d=base+(att.st.str||0);if(att.st.weak)d*=.75;if(def.st.vuln)d*=1.5;return Math.max(0,Math.floor(d));}
function hitEnemy(D,st,e,amt,E,noLink){const c=st.combat;const b=Math.min(e.block,amt);e.block-=b;const real=amt-b;e.hp=Math.max(0,e.hp-real);E.push({t:'hit',to:e.uid,n:amt,blocked:b});
 if(!noLink&&e.st.link&&real>0)for(const o of alive(c))if(o!==e&&o.st.link)hitEnemy(D,st,o,c.pw.linkFull?real:Math.floor(real/2),E,true);
 splitCheck(D,st,e,E);
 return amt;}
function splitCheck(D,st,e,E){const c=st.combat;const sp=D.enemies[e.id].split;if(!sp||e.split||e.hp<=0||e.hp>e.max*sp)return;e.split=1;const half=Math.floor(e.hp/2);if(half<1)return;
 const n=mkEnemy(D,st,e.id,c.enemies.length);n.hp=n.max=half;e.hp=e.max=e.hp-half;n.split=1;n.st={};chooseIntent(D,st,n);chooseIntent(D,st,e);c.enemies.push(n);E.push({t:'split',uid:e.uid,nu:n.uid});}
function selfHurt(D,st,n,E,floor1){const c=st.combat;st.hp-=n;if(floor1&&st.hp<1)st.hp=1;if(c)c.hurt+=n;E.push({t:'selfHurt',n});lowCheck(D,st,E);
 if(st.hp<=0&&has(st,'mirror')&&!st.flags.mirror){st.flags.mirror=1;st.hp=Math.ceil(st.maxHp*.3);E.push({t:'relic',id:'mirror'});}}
function lowCheck(D,st,E){const c=st.combat;if(!c||c.fox||!has(st,'foxhair')||st.hp<=0||st.hp>=st.maxHp/2)return;c.fox=1;st.hp=Math.min(st.maxHp,st.hp+10);for(const e of alive(c))addSt(e,'pact',3);E.push({t:'relic',id:'foxhair'});}
function hitPlayer(D,st,amt,E,src){const c=st.combat;if(src&&amt>0&&has(st,'lampshade')&&!c.shade){c.shade=1;amt=Math.floor(amt/2);E.push({t:'relic',id:'lampshade'});}const b=Math.min(c.block,amt);c.block-=b;const real=amt-b;st.hp-=real;c.hurt+=real;E.push({t:'hurt',n:amt,blocked:b,src});if(real>0&&st.hp>0)lowCheck(D,st,E);
 if(st.hp<=0&&has(st,'mirror')&&!st.flags.mirror){st.flags.mirror=1;st.hp=Math.ceil(st.maxHp*.3);E.push({t:'relic',id:'mirror'});}}
function killCheck(D,st,E){const c=st.combat;for(const e of c.enemies.slice())if(e.hp<=0&&!e.dead){e.dead=1;st.stats.kills++;E.push({t:'kill',id:e.id,uid:e.uid});if(has(st,'namelesslamp')&&st.hp>0)st.hp=Math.min(st.maxHp,st.hp+3);
  if(e.stolen&&e.stolen.length){c.disc.push(...e.stolen);E.push({t:'return',n:e.stolen.length});e.stolen=[];}
  const od=D.enemies[e.id].onDeath;if(od)for(const id of od){const n=mkEnemy(D,st,id,c.enemies.length);chooseIntent(D,st,n);c.enemies.push(n);E.push({t:'spawn',uid:n.uid,id});}}
 if(!alive(c).length)winCombat(D,st,E);}

function play(D,st,i,target,E){const c=st.combat;const card=c.hand[i];if(!card)return 'no_card';const d=cardDef(D,card);if(d.t==='x'||d.c<0)return '這張牌不能打出';
 const k=cost(D,card);if(k>c.energy)return '能量不夠';
 let tg=null;if(needsTarget(D,card)){tg=c.enemies.find(e=>e.uid===target&&e.hp>0);if(!tg){const a=alive(c);if(a.length===1)tg=a[0];else return '請選一個目標';}}
 c.energy-=k;c.hand.splice(i,1);st.stats.cards++;E.push({t:'play',id:card.id,up:card.up,tg:tg&&tg.uid});
 let total=0,gk=(d.fx.find(f=>f[0]==='gk')||[0,0])[1];
 for(const f of d.fx){
  switch(f[0]){
   case 'd':{const hits=f[2]||1;let bonus=(d.t==='a'&&c.pw.beast&&st.hp<st.maxHp/2)?c.pw.beast:0;const sc=f[3];
    if(sc&&sc.startsWith('pact'))bonus+=(tg.st.pact||0)*(+sc.slice(4));
    if(sc&&sc.startsWith('ink')){bonus+=c.ink*(+sc.slice(3));if(c.ink)E.push({t:'inkUse',n:c.ink});if(c.ink>=5&&has(st,'inkstone'))c.inkDraw=1;c.ink=0;}
    for(let h=0;h<hits;h++){if(tg.hp<=0)break;total+=hitEnemy(D,st,tg,dmgCalc(f[1]+bonus,c,tg),E);}break;}
   case 'da':{const hits=f[2]||1;for(let h=0;h<hits;h++)for(const e of alive(c)){const bonus=(f[3]?(e.st.pact||0)*(+f[3].slice(4)):0)+((d.t==='a'&&c.pw.beast&&st.hp<st.maxHp/2)?c.pw.beast:0);total+=hitEnemy(D,st,e,dmgCalc(f[1]+bonus,c,e),E);}break;}
   case 'b':{const n=f[1]+(c.st.dex||0);c.block+=n;E.push({t:'block',n});break;}
   case 'dr':draw(D,st,f[1],E);break;
   case 'en':c.energy+=f[1];break;
   case 'ep':if(tg.st.pact)c.energy+=f[1];break;
   case 'st':{const who=f[3];if(who==='s')addSt(c,f[1],f[2]);else for(const e of (who==='a'?alive(c):[tg]))addSt(e,f[1],f[2]);break;}
   case 'pa':{let bonus=0;if(has(st,'silkglove')&&!c.silk){c.silk=1;bonus=2;E.push({t:'relic',id:'silkglove'});}for(const e of (f[2]==='a'?alive(c):[tg])){addSt(e,'pact',f[1]+bonus);if(e.st.pact>=20)E.push({t:'ach',id:'pact20'});}break;}
   case 'ink':gainInk(st,c,f[1],E);break;
   case 'jd':{const n=tg.st.pact||0;delete tg.st.pact;if(n){E.push({t:'judge',n});total+=hitEnemy(D,st,tg,dmgCalc(f[1]*n,c,tg),E);if(has(st,'knot')&&tg.hp>0)tg.st.pact=(tg.st.pact||0)+2;}break;}
   case 'lk':{tg.st.link=Math.max(tg.st.link||0,2);for(const e of alive(c))if(e!==tg)e.st.link=Math.max(e.st.link||0,2);if(has(st,'needle'))for(const e of alive(c))addSt(e,'pact',1);break;}
   case 'ka':c.keepAll=1;break;
   case 'hurt':selfHurt(D,st,f[1],E);break;
   case 'mhp':st.maxHp=Math.max(1,st.maxHp+f[1]);st.hp=Math.min(st.hp,st.maxHp);E.push({t:'mhp',n:f[1]});break;
   case 'gk':break;
   case 'hp':st.hp=Math.min(st.maxHp,st.hp+f[1]);E.push({t:'heal',n:f[1]});break;
   case 'cp':{const others=c.hand.filter(x=>D.cards[x.id].t!=='x');if(others.length&&c.hand.length<10){const o=pick(st,others);c.hand.push({uid:'t'+st.uid++,id:o.id,up:o.up,free:1,temp:1});}break;}
   case 'pw':c.pw[f[1]]=(c.pw[f[1]]||0)+f[2];E.push({t:'power',id:f[1]});if(has(st,'blackfeather')){c.block+=4;E.push({t:'block',n:4});}break;
   case 'px2':if(tg.st.pact){tg.st.pact*=2;if(tg.st.pact>=20)E.push({t:'ach',id:'pact20'});}break;
   case 'rw':{const n=c.hand.length;c.disc.push(...c.hand.filter(x=>!x.temp));c.hand=[];draw(D,st,n,E);break;}
  }
  if(!alive(c).length)break;}
 if(gk&&tg&&tg.hp<=0){st.gold+=gk;E.push({t:'gold',n:gk});}
 if(st.hp<=0){c.hand=c.hand;loseRun(D,st,E);return null;}
 if(total>st.stats.dmgMax)st.stats.dmgMax=total;if(total>=30)E.push({t:'ach',id:'big30'});
 if(d.t==='a'){c.atkN++;if(c.atkN===3&&has(st,'bell'))draw(D,st,1,E);}
 if(c.inkDraw){c.inkDraw=0;draw(D,st,1,E);E.push({t:'relic',id:'inkstone'});}
 if(d.t!=='p'&&!card.temp){(d.ex?c.exh:c.disc).push({uid:card.uid,id:card.id,up:card.up});}
 killCheck(D,st,E);return null;}

function endTurn(D,st,E){const c=st.combat;
 if(has(st,'candle')&&c.energy>0){c.block+=4*c.energy;E.push({t:'block',n:4*c.energy});}
 for(const x of c.hand){const xd=D.cards[x.id];if(xd&&xd.endHand&&xd.endHand[0]==='hurt')selfHurt(D,st,xd.endHand[1],E);}
 if(st.hp<=0){loseRun(D,st,E);return;}
 const kp=x=>c.keepAll?!x.temp:cardDef(D,x).keep;const keep=c.hand.filter(kp).map(x=>{delete x.tax;delete x.free;return x;});c.disc.push(...c.hand.filter(x=>!kp(x)&&!x.temp).map(x=>({uid:x.uid,id:x.id,up:x.up})));c.hand=keep;c.keepAll=0;
 if(keep.length&&c.pw.keepInk)gainInk(st,c,keep.length*c.pw.keepInk,E);
 if(keep.length&&has(st,'redbookmark')){c.block+=3;E.push({t:'block',n:3});}
 // 敵人回合
 for(const e of alive(c)){e.block=0;}
 for(const e of c.enemies){if(e.hp<=0)continue;const m=e.intent;E.push({t:'enemyAct',uid:e.uid,n:m.n});
  if(m.a){const hits=m.h||1;const am=(D.enemies[e.id].boss||D.enemies[e.id].elite)?1:((D.layers[st.layer]||{}).atkMul||1);for(let h=0;h<hits;h++){const hp0=st.hp;hitPlayer(D,st,dmgCalc(Math.round(m.a*am),e,c),E,e.uid);if(st.hp<hp0&&c.pw.grudge)addSt(e,'pact',c.pw.grudge);if(st.hp<=0)break;}
   if(e.st.pact){const n=e.st.pact+(has(st,'redring')?1:0);e.hp=Math.max(0,e.hp-n);E.push({t:'recoil',to:e.uid,n});if(e.hp<=0&&has(st,'ledger')){st.gold+=8;E.push({t:'relic',id:'ledger'});}}
   if(c.pw.pactThorn)addSt(e,'pact',c.pw.pactThorn);}
  if(m.b)e.block+=m.b;
  if(m.s)addSt(e,m.s[0],m.s[1]);
  if(m.st)addSt(c,m.st[0],m.st[1]);
  if(m.heal)e.hp=Math.min(e.max,e.hp+m.heal);
  if(m.tax)c.taxNext=(c.taxNext||0)+m.tax;
  if(m.clr==='pact'&&e.st.pact){e.block+=e.st.pact;delete e.st.pact;E.push({t:'clr',uid:e.uid});}
  if(m.drainInk&&c.ink){const n=Math.min(c.ink,m.drainInk);c.ink-=n;E.push({t:'drain',n});}
  if(m.addCard)for(let i=0;i<m.addCard[1];i++){const x={uid:'x'+st.uid++,id:m.addCard[0],up:0};if(D.cards[m.addCard[0]].t==='x')c.draw.splice(Math.floor(R(st)*(c.draw.length+1)),0,x);else c.disc.push(x);}
  if(m.steal)(c.stealQ=c.stealQ||[]).push({uid:e.uid,n:m.steal});
  if(st.hp<=0)break;}
 if(st.hp<=0){loseRun(D,st,E);return;}
 killCheck(D,st,E);if(st.screen!=='combat')return;
 // 回合結束：計時的狀態減 1
 for(const u of [c,...alive(c)]){for(const k of TIMED)if(u.st[k]){if(k==='regen'&&u===c)st.hp=Math.min(st.maxHp,st.hp+u.st[k]);u.st[k]--;if(!u.st[k])delete u.st[k];}}
 for(const e of alive(c))chooseIntent(D,st,e);
 startTurn(D,st,E);if(st.hp<=0)loseRun(D,st,E);}

function winCombat(D,st,E){const c=st.combat;const kind=c.kind;if(has(st,'blotter')&&c.ink>=2){st.hp=Math.min(st.maxHp,st.hp+Math.floor(c.ink/2));}
 if(c.hurt===0)E.push({t:'ach',id:'nohit'});
 E.push({t:'ach',id:'first_win'});if(kind==='elite'){st.stats.elites++;E.push({t:'ach',id:'first_elite'});}
 if(has(st,'bandage'))st.hp=Math.min(st.maxHp,st.hp+6);
 const g=D.gold[kind]||D.gold.fight;let gold=ri(st,g[0],g[1]);if(has(st,'purse'))gold=Math.floor(gold*1.5);st.gold+=gold;
 if(st.gold>=200)E.push({t:'ach',id:'gold200'});
 const rw={gold,cards:rollCards(D,st,3,kind!=='fight'),relic:null,relicChoice:null,cardTaken:false};
 if(kind==='elite'){const p=relicPool(D,st);if(p.length){rw.relic=pick(st,p);gainRelic(D,st,rw.relic);}}
 if(kind==='boss'){st.stats.bosses++;const bid=c.enemies[0].id;E.push({t:'ach',id:{wusign:'boss1',qianhao:'boss2',deepdrill:'boss3'}[bid]});
  const p=shuffle(st,relicPool(D,st)).slice(0,3);rw.relicChoice=p;st.hp=Math.min(st.maxHp,st.hp+Math.ceil((st.maxHp-st.hp)*.75));}
 if(st.relics.length>=6)E.push({t:'ach',id:'relic6'});
 st.reward=rw;st.combat=null;st.screen='reward';E.push({t:'win',kind,gold});}
function loseRun(D,st,E){st.screen='over';st.result={win:false};st.combat=null;E.push({t:'runEnd',win:false,ch:st.ch,floors:st.stats.floors,memory:memoryOf(D,st,false)});}
function memoryOf(D,st,win){const M=D.memory;return st.stats.floors*M.perFloor+st.stats.elites*M.perElite+st.stats.bosses*M.perBoss+(win?M.win:0);}

// ── 地圖
function canMove(D,st,c){const map=st.maps[st.layer];if(c==='boss')return st.row===D.map.rows-1;if(st.row===-1)return c>=0&&c<D.map.cols;if(st.row>=D.map.rows-1)return false;return map.rows[st.row][st.col].e.includes(c);}
function enter(D,st,c,E){const L=D.layers[st.layer];st.stats.floors++;
 if(c==='boss'){st.row=D.map.rows;startCombat(D,st,[L.boss],'boss').forEach(x=>E.push(x));E.push({t:'boss',id:L.boss});return;}
 st.row++;st.col=c;const t=st.maps[st.layer].rows[st.row][c].t;E.push({t:'enter',node:t});
 if(t==='fight'){const set=pick(st,L.fights);startCombat(D,st,set,'fight').forEach(x=>E.push(x));}
 else if(t==='elite'){startCombat(D,st,[pick(st,L.elites)],'elite').forEach(x=>E.push(x));}
 else if(t==='rest'){st.screen='rest';}
 else if(t==='chest'){const p=relicPool(D,st);const id=p.length?pick(st,p):null;if(id)gainRelic(D,st,id);else st.gold+=50;st.reward={chest:id,gold:id?0:50};st.screen='chest';if(st.relics.length>=6)E.push({t:'ach',id:'relic6'});}
 else if(t==='shop'){st.shop=genShop(D,st);st.screen='shop';}
 else if(t==='event'){let ev=D.events.filter(e=>!st.seenEv.includes(e.id));if(!ev.length){st.seenEv=[];ev=D.events;}const e=pick(st,ev);st.seenEv.push(e.id);st.event={id:e.id,done:null};if(has(st,'map'))st.gold+=15;st.screen='event';}}
function genShop(D,st){const P=D.shop;const cs=[];const p=pool(D,st);const used=new Set();for(let i=0;i<5;i++){const left=p.filter(k=>!used.has(k));if(!left.length)break;const id=pick(st,left);used.add(id);const r=D.cards[id].r;cs.push({id,price:Math.round(P.card[r-1]*(.9+R(st)*.2)),sold:false});}
 const rp=shuffle(st,relicPool(D,st)).slice(0,2).map(id=>({id,price:ri(st,P.relic[0],P.relic[1]),sold:false}));return {cards:cs,relics:rp,removed:false,removeCost:P.remove};}

function nextAfterBoss(D,st,E){st.layer++;if(st.layer>=D.layers.length){st.screen='over';st.result={win:true};E.push({t:'ach',id:'win_'+st.ch});E.push({t:'runEnd',win:true,ch:st.ch,floors:st.stats.floors,memory:memoryOf(D,st,true)});return;}
 st.row=-1;st.col=null;st.maps.push(genMap(D,st,st.layer));st.screen='map';E.push({t:'layer',n:st.layer});}
function backToMap(D,st,E){st.reward=null;st.event=null;st.shop=null;st.pick=null;if(st.row>=D.map.rows){nextAfterBoss(D,st,E);return;}st.screen='map';if(st.deck.length>=25)E.push({t:'ach',id:'deck25'});}

// ── 事件結果
function applyEvent(D,st,opt,E){const out=[];let pend=null;
 for(const r of opt.r){
  if(r.gold){st.gold=Math.max(0,st.gold+r.gold);}
  if(r.heal)st.hp=Math.min(st.maxHp,st.hp+r.heal);
  if(r.hurt){st.hp-=r.hurt;if(st.hp<=0)st.hp=1;}
  if(r.maxhp){st.maxHp=Math.max(1,st.maxHp+r.maxhp);st.hp=Math.min(st.hp,st.maxHp);}
  if(r.card){addCard(st,r.card);}
  if(r.relicRandom){const p=relicPool(D,st);if(p.length){const id=pick(st,p);gainRelic(D,st,id);out.push({relic:id});}}
  if(r.upgradeRandom)for(let k=0;k<r.upgradeRandom;k++){const up=st.deck.filter(c=>!c.up&&D.cards[c.id].u);if(up.length){const c=pick(st,up);c.up=1;out.push({upgraded:c.id});}}
  if(r.cardRare){const p=pool(D,st,3);if(p.length){const id=pick(st,p);addCard(st,id);out.push({card:id});}}
  if(r.cardPick)pend={mode:'choose',cards:rollCards(D,st,3,false)};
  if(r.removePick)pend={mode:'remove'};
  if(r.transformPick)pend={mode:'transform'};}
 return {out,pend};}

// ── 主要入口
function apply(D,st0,a){const st=clone(st0);const E=[];const fail=e=>({ok:false,error:e});
 if(st.screen==='over')return fail('這一局已經結束');
 switch(a.type){
  case 'MOVE':if(st.screen!=='map')return fail('現在不能移動');if(!canMove(D,st,a.c))return fail('走不到那裡');enter(D,st,a.c,E);break;
  case 'PLAY':{if(st.screen!=='combat')return fail('不在戰鬥中');const e=play(D,st,a.i,a.target,E);if(e)return fail(e);break;}
  case 'END_TURN':if(st.screen!=='combat')return fail('不在戰鬥中');endTurn(D,st,E);break;
  case 'PICK_CARD':{if(st.screen!=='reward'||st.reward.cardTaken)return fail('不能選');const id=st.reward.cards[a.i];if(!id)return fail('沒有這張');addCard(st,id);st.reward.cardTaken=true;E.push({t:'gotCard',id});break;}
  case 'SKIP_CARD':if(st.screen!=='reward')return fail('不能跳過');st.reward.cardTaken=true;break;
  case 'PICK_RELIC':{if(st.screen!=='reward'||!st.reward.relicChoice)return fail('不能選');const id=st.reward.relicChoice[a.i];if(!id)return fail('沒有這件');gainRelic(D,st,id);st.reward.relicChoice=null;st.reward.relicTaken=id;break;}
  case 'LEAVE':if(!['reward','chest','shop','event','rest'].includes(st.screen))return fail('不能離開');if(st.screen==='reward'&&st.reward.relicChoice)return fail('先選一件遺物');backToMap(D,st,E);break;
  case 'REST':if(st.screen!=='rest'||st.flags.rested)return fail('不能休息');{let n=Math.floor(st.maxHp*.3)+(has(st,'teapot')?15:0)+((st.kp||[]).includes('m_rest')?5:0);if(has(st,'borrowedheart'))n=Math.floor(n/2);st.hp=Math.min(st.maxHp,st.hp+n);E.push({t:'heal',n});backToMap(D,st,E);}break;
  case 'SMITH':if(st.screen!=='rest')return fail('不能強化');{const c=st.deck.find(x=>x.uid===a.uid);if(!c||c.up||!D.cards[c.id].u)return fail('這張不能強化');c.up=1;E.push({t:'upgraded',id:c.id});backToMap(D,st,E);}break;
  case 'BUY_CARD':{if(st.screen!=='shop')return fail('不在商店');const it=st.shop.cards[a.i];if(!it||it.sold)return fail('賣完了');if(st.gold<it.price)return fail('渡鴉幣不夠');st.gold-=it.price;it.sold=true;addCard(st,it.id);E.push({t:'gotCard',id:it.id});break;}
  case 'BUY_RELIC':{if(st.screen!=='shop')return fail('不在商店');const it=st.shop.relics[a.i];if(!it||it.sold)return fail('賣完了');if(st.gold<it.price)return fail('渡鴉幣不夠');st.gold-=it.price;it.sold=true;gainRelic(D,st,it.id);if(st.relics.length>=6)E.push({t:'ach',id:'relic6'});break;}
  case 'REMOVE':{if(st.screen!=='shop'&&!(st.pick&&st.pick.mode==='remove'))return fail('不能移除');const i=st.deck.findIndex(x=>x.uid===a.uid);if(i>=0&&D.cards[st.deck[i].id].noRemove)return fail('這張牌不能被移除');if(i<0)return fail('沒有這張');
   if(st.screen==='shop'){if(st.shop.removed)return fail('這間店只能移除一次');if(st.gold<st.shop.removeCost)return fail('渡鴉幣不夠');st.gold-=st.shop.removeCost;st.shop.removed=true;st.shop.removeCost+=25;}
   else st.pick=null;st.deck.splice(i,1);E.push({t:'removed'});break;}
  case 'TRANSFORM':{if(!(st.pick&&st.pick.mode==='transform'))return fail('不能轉換');const c=st.deck.find(x=>x.uid===a.uid);if(!c)return fail('沒有這張');if(D.cards[c.id].noRemove)return fail('這張牌不能被換掉');const p=pool(D,st).filter(k=>k!==c.id);c.id=pick(st,p);c.up=0;st.pick=null;E.push({t:'transformed',id:c.id});break;}
  case 'CHOOSE':{if(!(st.pick&&st.pick.mode==='choose'))return fail('不能選');if(a.i!=null){const id=st.pick.cards[a.i];if(!id)return fail('沒有這張');addCard(st,id);E.push({t:'gotCard',id});}st.pick=null;break;}
  case 'EVENT':{if(st.screen!=='event'||st.event.done)return fail('不能選');const ev=D.events.find(e=>e.id===st.event.id);const opt=ev.opts[a.i];if(!opt)return fail('沒有這個選項');if(opt.need&&opt.need.gold&&st.gold<opt.need.gold)return fail('渡鴉幣不夠');
   const {out,pend}=applyEvent(D,st,opt,E);st.event.done={i:a.i,out};if(pend){if(pend.mode==='remove'&&!st.deck.length){}else st.pick=pend;}break;}
  case 'PREP_RELIC':{if(st.screen!=='prep'||!st.prep.relics)return fail('不能選');const id=st.prep.relics[a.i];if(!id)return fail('沒有這件');gainRelic(D,st,id);st.prep.relics=null;E.push({t:'relicGot',id});break;}
  case 'PREP_REMOVE':{if(st.screen!=='prep'||!st.prep.remove)return fail('不能移除');const i=st.deck.findIndex(x=>x.uid===a.uid);if(i<0)return fail('沒有這張');st.deck.splice(i,1);st.prep.remove=0;E.push({t:'removed'});break;}
  case 'PREP_DONE':if(st.screen!=='prep')return fail('不在出發準備');st.prep=null;st.screen='map';break;
  case 'REROLL_MAP':{if(st.screen!=='map'||st.row!==-1)return fail('只能在這一層還沒走之前換');if(!(st.kp||[]).includes('m_skip'))return fail('還沒有第二張地圖');const k='rr'+st.layer;if(st.flags[k])return fail('這一層已經換過了');st.flags[k]=1;st.maps[st.layer]=genMap(D,st,st.layer);E.push({t:'reroll'});break;}
  case 'PURGE':{if(st.screen!=='rest'||!(st.kp||[]).includes('m_purge'))return fail('不能燒');const i=st.deck.findIndex(x=>x.uid===a.uid);if(i<0||D.cards[st.deck[i].id].t!=='x')return fail('只能燒詛咒');const id=st.deck[i].id;st.deck.splice(i,1);E.push({t:'purged',id});backToMap(D,st,E);break;}
  case 'QUIT':{st.combat=null;st.screen='over';st.result={win:false,quit:true};E.push({t:'runEnd',win:false,quit:true,ch:st.ch,floors:st.stats.floors,memory:memoryOf(D,st,false)});break;}
  default:return fail('不明的指令');}
 if(!st0.combat&&st.combat){const s0=clone(st0);delete s0.pre;st.pre={s:s0,a};}
 if(!st.combat&&st.pre)delete st.pre;
 return {ok:true,state:st,events:E};}

// ── 存檔（v:2）：戰鬥中只存戰前狀態，讀檔時重跑進場那一步（同一個種子，結果一樣）
function saveForm(st){if(!st)return null;if(st.pre)return Object.assign(clone(st.pre.s),{v:2,resume:st.pre.a});return st;}
function migrateRun(D,s){if(!s)return null;s=clone(s);
 if((s.v||1)<2){s.v=2;s.kp=s.kp||[];s.flags=s.flags||{};
  if(s.combat){const c=s.combat,L=D.layers[s.layer]||{};const got=c.enemies.map(e=>e.id);let ids;
   if(c.kind==='boss')ids=[L.boss];else if(c.kind==='elite')ids=[got[0]];else ids=(L.fights||[]).find(set=>set.every((id,i)=>got[i]===id))||[got[0]];
   s.combat=null;startCombat(D,s,ids,c.kind);}}
 return s;}
function loadRun(D,s){s=migrateRun(D,s);if(!s)return null;if(s.resume){const a=s.resume;delete s.resume;const r=apply(D,s,a);if(r.ok)return r.state;}return s;}

// ── 永久進度（回憶、成就、圖鑑）
function newMeta(){return {v:2,memory:0,echo:0,keeper:[],unlocked:[],ach:[],codex:{},runs:0,wins:{yy:0,cl:0},best:0,seen:[]};}
function migrateMeta(m){if(!m)return newMeta();m=clone(m);const n=newMeta();for(const k in n)if(m[k]===undefined)m[k]=n[k];m.v=2;return m;}
function echoOf(D,e){const E=D.echo||{fromMemory:1,quitRate:.5};const v=Math.floor((e.memory||0)*E.fromMemory);return e.quit?Math.floor(v*E.quitRate):v;}
function metaBuy(D,meta0,id){const it=(D.keeper||[]).find(k=>k.id===id);if(!it)return {ok:false,error:'沒有這一項'};const meta=migrateMeta(meta0);if(meta.keeper.includes(id))return {ok:false,error:'已經有了'};if(it.need&&!meta.keeper.includes(it.need))return {ok:false,error:'要先有「'+D.keeper.find(k=>k.id===it.need).n+'」'};if(meta.echo<it.cost)return {ok:false,error:'殘響不夠'};meta.echo-=it.cost;meta.keeper.push(id);return {ok:true,meta};}
function metaApply(D,meta0,events){const meta=migrateMeta(meta0);const news={ach:[],codex:[],unlocks:[],memory:0,echo:0};
 for(const e of events){
  if(e.t==='ach'&&e.id&&!meta.ach.includes(e.id)){meta.ach.push(e.id);news.ach.push(e.id);}
  if(e.t==='kill'){if(!meta.codex[e.id])news.codex.push(e.id);meta.codex[e.id]=(meta.codex[e.id]||0)+1;if(Object.keys(meta.codex).length>=20&&!meta.ach.includes('codex20')){meta.ach.push('codex20');news.ach.push('codex20');}}
  if(e.t==='runEnd'){meta.runs++;meta.memory+=e.memory;news.memory=e.memory;const ec=echoOf(D,e);meta.echo+=ec;news.echo=ec;if(e.win)meta.wins[e.ch]=(meta.wins[e.ch]||0)+1;meta.best=Math.max(meta.best,e.floors||0);
   for(const u of D.unlocks)if(meta.memory>=u.at&&!meta.unlocked.includes(u.id)){meta.unlocked.push(u.id);news.unlocks.push(u.id);}}}
 return {meta,news};}

const API={newRun,apply,desc,cardDef,cost,needsTarget,canMove,alive,dmgCalc,newMeta,metaApply,memoryOf,pool,saveForm,migrateRun,loadRun,migrateMeta,metaBuy,echoOf};
if(typeof module!=='undefined')module.exports=API;else root.CARD=API;
})(this);
