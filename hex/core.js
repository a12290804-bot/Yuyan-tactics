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
const strip=x=>{const o={uid:x.uid,id:x.id,up:x.up};if(x.oil)o.oil=x.oil;if(x.scar)o.scar=x.scar;if(x.left)o.left=1;return o;};
const TIMED=['vuln','weak','link','regen'];

// ── 卡牌
// 專屬牌（有 bl）的三相：沒有另外寫 ph 的，用「纏頸」模板——半妖 ×1.6 加抽 1；完全非人 ×2.6 加「目標這回合不能行動」
function phFx(fx,ph){const m=ph==='full'?2.6:1.6;const out=fx.map(f=>{const g=f.slice();if(['d','da','b','pa','ink'].includes(g[0])&&typeof g[1]==='number')g[1]=Math.round(g[1]*m);return g;});out.push(ph==='half'?['dr',1]:['stun']);return out;}
const scarB=c=>Math.min(4,Math.floor((c.scar||0)/3));
function cardDef(D,c,ph){const b=D.cards[c.id];let d=(!c.up||!b.u)?b:Object.assign({},b,b.u,{n:b.n+'+'});
 if(c.scar>=9&&D.scarNames&&D.scarNames[c.id])d=Object.assign({},d,{n:D.scarNames[c.id]+(c.up&&b.u?'+':'')});
 if(c.left)d=Object.assign({},d,{n:'她留下的'+d.n});
 if(d.bl&&ph&&ph!=='h'){const o=(b.ph&&b.ph[ph])||{};d=Object.assign({},d,{fx:o.fx||phFx(d.fx,ph)},o.img?{img:o.img}:{});}return d;}
function cost(D,c,ph){if(c.free)return 0;const k=cardDef(D,c).c;return k<0?k:ph==='full'?0:k+(c.tax||0)+(c.oil||0);}
const isYY=st=>st.ch==='yy'||st.ch==='yx';
const baseCh=st=>st.ch==='yx'?'yy':st.ch;
// 慾望契／心願（st.desire）、個性（st.persona）、癖好（st.hobby）
const M=(st,k)=>st.desire===k||st.persona===k||st.hobby===k;
const handMax=(D,st)=>10+(pas(D,st,'hand12')?2:0)-(M(st,'letter')?1:0);
function phaseOf(st){if(!st||!isYY(st))return 'h';if(st.combat&&st.combat.full)return 'full';return (st.alien||0)>=40?'half':'h';}
function originOf(D,st){return (D.origins||{})[baseCh(st)+'_'+st.origin]||{};}
const pas=(D,st,k)=>originOf(D,st).passive===k;
function addAlien(D,st,n,E){if(!isYY(st)||!n)return;const a0=st.alien||0;const a=Math.max(st.ch==='yx'?40:0,Math.min(100,a0+n));if(st.ch==='yx'&&a===40&&a0>40&&st.combat)st.combat.drawLess=(st.combat.drawLess||0)+2;if(a===a0)return;st.alien=a;E&&E.push({t:'alien',n:a-a0,v:a});
 if(a0<40&&a>=40)E&&E.push({t:'phase',to:'half'});if(a0>=40&&a<40&&!(st.combat&&st.combat.full))E&&E.push({t:'phase',to:'h'});
 if(a0<60&&a>=60&&!st.flags.yx){st.flags.yx=1;E&&E.push({t:'yxWake'});}
 if(a>=100&&st.combat&&!st.combat.full&&!st.combat.fullNext){st.combat.fullNext=1;E&&E.push({t:'fullSoon'});if(st.combat.yx)E&&E.push({t:'unlockYx'});}}
function needsTarget(D,c,ph){return (cardDef(D,c,ph).fx||[]).some(f=>(['d','jd','lk','px2','ep','stun'].includes(f[0]))||((f[0]==='st'||f[0]==='pa')&&(f[f.length-1]==='t')));}
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
  case 'dd':return `抽 ${f[1]} 張牌，再棄 ${f[2]} 張`;
  case 'rc':return `從棄牌堆拿最上面的一張牌回手上`;
  case 'dos':return `這場戰鬥，卷宗暫時 +${f[1]}`;
  case 'seize':return `拿走目標 1 層力量`;
  case 'al':return f[1]<0?`異化值 ${f[1]}`:`異化值 +${f[1]}`;
  case 'stun':return `目標這回合不能行動`;
  case 'hurtq':return `失去 ${f[1]} 生命`;
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
function desc(D,c,ph){const d=cardDef(D,c,ph);if(d.t==='x'){let s='不能打出。';if(d.onDraw)s+=`抽到時，失去 ${d.onDraw[1]} 生命。`;if(d.endHand)s+=`回合結束時還在手上，失去 ${d.endHand[1]} 生命。`;if(d.noRemove)s+='不能被移除。';if(d.lockAtk)s='在手上時，不能打出攻擊牌。花 1 能量撕掉。';return s;}if(!d.fx.length)return '沒有效果。'+(d.ex?'消耗。':'');let s=d.fx.map(f=>opText(D,f).replace(/。$/,'')).join('。')+'。';if(d.keep)s+='保留。';if(d.ex)s+='消耗。';return s;}

// ── 開新的一局
function newRun(D,seed,ch,meta,opt){seed=seed>>>0||1;const C=D.chars[ch];opt=opt||{};
 const st={v:1,seed,n:0,ch,hp:C.hp,maxHp:C.hp,gold:99,deck:[],relics:[],layer:0,row:-1,col:null,maps:[],screen:'map',combat:null,reward:null,event:null,shop:null,pick:null,
  stats:{floors:0,elites:0,bosses:0,kills:0,dmgMax:0,cards:0},flags:{},uid:1,seenEv:[],unlocked:(meta&&meta.unlocked||[]).slice(),result:null,log:[]};
 for(const id of C.deck)addCard(st,id);
 st.desire=opt.desire||null;st.persona=opt.persona||null;st.hobby=opt.hobby||null;st.shards=0;st.marks=0;
 if(meta&&meta.letter){st.gold+=meta.letter;st.flags.gotLetter=meta.letter;}
 if(opt.persona==='petty'&&meta&&meta.grudges)st.grudges=meta.grudges.slice();
 st.hob=(meta&&meta.hobbies||[]).slice();
 if(meta&&(meta.runs||0)>=2&&(meta.fourth||0)<9){addCard(st,'x_fourth');st.fourthN=meta.fourth||0;}
 if(meta&&meta.left&&meta.left.ch===baseCh({ch}))st.left=clone(meta.left);
 st.dossier={};st.pages=meta&&meta.pages||0;st.com=opt.com||null;st.stats.rests=0;
 st.origin=opt.origin||C.origin||null;st.alien=ch==='yx'?60:0;if(ch==='yx')st.flags.yx=1;st.reso={};st.wick=10;st.lamp=0;st.stats.ph={h:0,half:0,full:0};st.stats.sent=0;
 const O=originOf(D,st);if(O.swap){let n=O.swap[1];for(const c of st.deck){if(n&&c.id==='strike'){c.id=O.swap[0];n--;}}}
 gainRelic(D,st,C.relic);
 st.v=2;st.kp=(meta&&meta.keeper||[]).slice();const K=id=>st.kp.includes(id);
 if(K('m_hp1')){st.maxHp+=5;st.hp+=5;}if(K('m_hp2')){st.maxHp+=5;st.hp+=5;}if(K('m_gold'))st.gold+=40;
 const prep={};if(K('m_relic')){const p=shuffle(st,commonRelics(D,st)).slice(0,3);if(p.length)prep.relics=p;}if(K('m_remove'))prep.remove=1;
 if(prep.relics||prep.remove){st.prep=prep;st.screen='prep';}
 st.maps.push(warpMap(D,st,genMap(D,st,0)));
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
function pool(D,st,minR){return Object.keys(D.cards).filter(k=>{const c=D.cards[k];if(c.r<1||c.t==='x')return false;if(c.bl&&c.bl!==st.origin)return false;if(c.ch!==baseCh(st)&&c.ch!==st.ch&&c.ch!=='any')return false;if(st.ch==='yx'&&k==='yy_restrain')return false;if(c.lock&&!st.unlocked.includes(c.lock))return false;if(minR&&c.r<minR)return false;return true;});}
function rollCards(D,st,n,elite){const out=[];let guard=0;while(out.length<n&&guard++<200){const v=R(st);const r=v<(elite?.12:.05)?3:v<(elite?.5:.37)?2:1;const p=pool(D,st).filter(k=>D.cards[k].r===r&&!out.includes(k));if(p.length)out.push(pick(st,p));}return out;}

// ── 戰鬥
function mkEnemy(D,st,id,i){const E=D.enemies[id];const L=D.layers[st.layer]||{};const hp=Math.round(ri(st,E.hp[0],E.hp[1])*(E.boss?1:E.elite?(1+((L.hpMul||1)-1)*.35):(L.hpMul||1)));const e={uid:'e'+i+'_'+st.n,id,n:E.n,hp,max:hp,block:0,st:{},mi:-1,last:[],intent:null};
 if(st.grudges&&st.grudges.includes(id)){e.hp=e.max=Math.max(1,Math.round(hp*.8));}
 if(E.realm)e.realm=0;if(E.parts){e.parts=E.parts.map(p=>p.id);e.pd=0;}if(E.cd)e.cd=E.cd;if(E.call)e.num=0;return e;}
const hasPart=(e,id)=>!!(e.parts&&e.parts.includes(id));
function breakthrough(D,st,e,E){e.realm=0;e.hp=Math.min(e.max,e.hp+Math.round(e.max*.3));addSt(e,'str',3);E.push({t:'breakthrough',uid:e.uid});}
function realmUp(D,st,e,n,E){if(e.realm==null||e.hp<=0)return;e.realm+=n;E.push({t:'realm',uid:e.uid,v:e.realm});if(e.realm>=3)breakthrough(D,st,e,E);}
function chooseIntent(D,st,e){const E=D.enemies[e.id];let i;
 if(E.seq){e.mi=(e.mi+1)%E.mv.length;i=e.mi;}
 else{const w={};E.mv.forEach((m,k)=>{if(E.mv.length>1&&e.last.length>=2&&e.last[0]===k&&e.last[1]===k)return;w[k]=m.w;});i=+pickW(st,w);e.last=[i].concat(e.last).slice(0,2);}
 e.intent=Object.assign({i},E.mv[i]);
 if(E.soloBreak&&e.intent.healAlly&&st.combat&&alive(st.combat).length<=1)e.intent={i:-1,n:E.soloBreak,solo:1};
 if(e.cd!=null)e.intent=e.cd<=1?{i:-1,n:E.boom[0],a:E.boom[1],boom:1}:{i:-1,n:'倒數 '+(e.cd-1),tick:1};
 if(E.hidden&&!(st.combat&&st.combat.eye===e.uid)&&!pas(D,st,'moth'))e.hid=1;}
function startCombat(D,st,ids,kind){const ens=ids.map((id,i)=>mkEnemy(D,st,id,i));if(ids.length>1)for(const e of ens){e.hp=e.max=Math.round(e.max*.85);}const c={kind,enemies:ens,draw:shuffle(st,st.deck.map(strip)),hand:[],disc:[],exh:[],energy:0,maxE:3,block:0,st:{},pw:{},ink:0,turn:0,hurt:0,atkN:0,log:[]};
 st.combat=c;st.screen='combat';const E=[];
 if(isYY(st)&&st.flags.yx&&R(st)<.15)c.yxAt=2+Math.floor(R(st)*3);
 if(pas(D,st,'lure'))c.lure=10;
 if(M(st,'glutton'))selfHurt(D,st,3,E,true,true);
 if(M(st,'grudge'))c.pw.grudge=(c.pw.grudge||0)+1;
 if(M(st,'firm')&&kind==='elite')c.block+=10;
 if(st.marks>0){c.markKeep=1;st.marks--;}
 c.extraDraw=(M(st,'letter')?1:0)+(st.namesNext?1:0);st.namesNext=0;
 if(has(st,'eyebutton')){c.maxE=4;c.draw.splice(Math.floor(R(st)*(c.draw.length+1)),0,{uid:'w'+st.uid++,id:'x_whisper',up:0});}
 if(has(st,'namelesslamp'))selfHurt(D,st,3,E,true);
 if(has(st,'thread'))for(const e of c.enemies)addSt(e,'pact',1);
 if(has(st,'mask'))for(const e of c.enemies)addSt(e,'vuln',1);
 if(has(st,'whet'))addSt(c,'str',1);
 if(has(st,'shell'))c.block+=10;
 if(has(st,'inkpot'))gainInk(st,c,3,E);
 for(const e of c.enemies)chooseIntent(D,st,e);
 if(pas(D,st,'shop20')){const h=c.enemies.filter(e=>e.hid);if(h.length)pick(st,h).hid=0;}
 if(pas(D,st,'moth'))for(const e of c.enemies)e.hid=0;
 if(M(st,'envy')){const b=c.enemies.find(e=>e.st.str);if(b)addSt(c,'str',b.st.str);}
 startTurn(D,st,E);return E;}
function addSt(u,k,n){u.st[k]=(u.st[k]||0)+n;if(u.st[k]<=0)delete u.st[k];}
function gainInk(st,c,n,E){c.ink+=n;if(c.pw.inkBlock)c.block+=c.pw.inkBlock*n;if(c.ink>=10)E.push({t:'ach',id:'ink10'});}
function draw(D,st,n,E){const c=st.combat;for(let i=0;i<n;i++){if(c.hand.length>=handMax(D,st))break;if(!c.draw.length){if(!c.disc.length)break;c.draw=shuffle(st,c.disc);c.disc=[];E&&E.push({t:'shuffle'});}const x=c.draw.pop();c.hand.push(x);const xd=D.cards[x.id];if(xd&&xd.t==='x'&&E)addAlien(D,st,5,E);if(xd&&xd.onDraw&&xd.onDraw[0]==='hurt'&&E)selfHurt(D,st,xd.onDraw[1],E);}}
function startTurn(D,st,E){const c=st.combat;c.turn++;c.atkN=0;
 c.seqT='';c.sacN=0;c.leeched=0;c.firstCard=0;c.skillN=0;c.jelly=0;
 if(pas(D,st,'coral')){c.hard=Math.min(c.hard||0,c.block);c.block=c.hard;}
 else if(pas(D,st,'slime'))c.block=Math.floor(c.block/2);
 else if(!(c.turn===2&&has(st,'anchor')))c.block=0;
 if(pas(D,st,'molt3')&&c.turn%3===0){for(const k of ['weak','vuln','frail'])delete c.st[k];E.push({t:'molt'});}
 if(pas(D,st,'vine')){let n=0;for(const e of alive(c))if(e.st.vine){e.hp=Math.max(0,e.hp-2*e.st.vine);n+=e.st.vine;E.push({t:'hit',to:e.uid,n:2*e.st.vine,blocked:0});}if(n){st.hp=Math.min(st.maxHp,st.hp+n);E.push({t:'heal',n});killCheck(D,st,E);if(st.screen!=='combat')return;}}
 if(st.ch==='gu'&&c.draw.length<5)c.guE=1;else c.guE=0;
 if(c.keptB){c.block+=c.keptB;E.push({t:'block',n:c.keptB});c.keptB=0;}
 if(isYY(st)){if(st.hp<st.maxHp/2)addAlien(D,st,5,E);
  if(c.fullNext){c.fullNext=0;c.full=1;E.push({t:'transform',origin:st.origin});}
  c.yx=(c.yxAt===c.turn&&!c.full)?1:0;if(c.yx)E.push({t:'yxTurn'});
  const ph=phaseOf(st);st.stats.ph[ph]=(st.stats.ph[ph]||0)+1;
  if(ph==='half'){selfHurt(D,st,1,E,true,true);}}
 c.energy=c.maxE+(c.turn===1&&has(st,'lantern')?1:0);
 if(c.pw.pactTurn)for(const e of alive(c))addSt(e,'pact',c.pw.pactTurn);
 if(c.pw.strTurn)addSt(c,'str',c.pw.strTurn);
 if(has(st,'quill'))gainInk(st,c,1,E);
 if(c.pw.inkTurn)gainInk(st,c,c.pw.inkTurn,E);
 if(has(st,'paperweight')&&c.ink>=5){c.energy++;E.push({t:'relic',id:'paperweight'});}
 if(M(st,'stubborn')&&st.hp<st.maxHp*.3)c.energy++;
 if(c.guE)c.energy++;
 draw(D,st,Math.max(0,5-(c.drawLess||0))+(pas(D,st,'hand12')?1:0)+(c.turn===1?(c.extraDraw||0):0)+(phaseOf(st)==='half'?1:0)+(c.turn===1&&has(st,'feather')?2:0)+(c.turn===1&&has(st,'tornphoto')?3:0)+(c.pw.drawTurn||0),E);
 if(c.stealQ&&c.stealQ.length){for(const q of c.stealQ){const e=c.enemies.find(x=>x.uid===q.uid&&x.hp>0);if(!e)continue;e.stolen=e.stolen||[];for(let i=0;i<q.n&&c.hand.length;i++){const k=Math.floor(R(st)*c.hand.length);const x=c.hand.splice(k,1)[0];if(!x.temp)e.stolen.push(strip(x));E.push({t:'steal',uid:e.uid,id:x.id});}}c.stealQ=[];}
 c.drawLess=0;
 for(const x of c.hand)delete x.ring;
 if(st.ch==='yy'&&(st.alien||0)>=60&&!c.yx&&!c.full){const can=c.hand.filter(x=>D.cards[x.id].t!=='x');if(can.length){pick(st,can).ring=1;E.push({t:'ring'});}}
 if(c.dumpNext){c.dumpNext=0;c.disc.push(...c.hand.filter(x=>!x.temp).map(strip));c.hand=[];E.push({t:'dump'});}
 if(c.oilNext){const can=c.hand.filter(x=>cardDef(D,x).c>=0&&!x.oil);shuffle(st,can).slice(0,c.oilNext).forEach(x=>x.oil=1);E.push({t:'oil',n:Math.min(c.oilNext,can.length)});c.oilNext=0;}
 if(c.grabQ&&c.grabQ.length){for(const uid of c.grabQ){const e=c.enemies.find(x=>x.uid===uid&&x.hp>0);const can=c.hand.filter(x=>!x.lock&&cardDef(D,x).c>=0);if(e&&can.length){pick(st,can).lock=uid;c.locks=1;E.push({t:'grab',uid});}}c.grabQ=[];}
 if(c.handQ&&c.handQ.length){for(const id of c.handQ){const x={uid:'x'+st.uid++,id,up:0,temp:1};if(c.hand.length<10)c.hand.push(x);}E.push({t:'handAdd',n:c.handQ.length});c.handQ=[];}
 if(c.taxNext){const can=c.hand.filter(x=>cardDef(D,x).c>=0);shuffle(st,can).slice(0,c.taxNext).forEach(x=>x.tax=1);E.push({t:'tax',n:Math.min(c.taxNext,can.length)});c.taxNext=0;}
 E.push({t:'turn',n:c.turn});}
const alive=c=>c.enemies.filter(e=>e.hp>0);
function dmgCalc(base,att,def){let d=base+(att.st.str||0);if(att.st.weak)d*=.75;if(def.st.vuln)d*=1.5;return Math.max(0,Math.floor(d));}
function hitEnemy(D,st,e,amt,E,noLink){const c=st.combat;if(e.intent&&e.intent.shut&&amt>0){E.push({t:'shut',uid:e.uid});amt=0;}
 if(e.hid&&amt>0){e.hid=0;E.push({t:'reveal',uid:e.uid});}
 if(e.realm>0&&amt>=10){e.realm--;E.push({t:'realmBreak',uid:e.uid,v:e.realm});}
 if(e.parts&&amt>0){e.pd+=amt;while(e.pd>=12&&e.parts.length){e.pd-=12;const pid=e.parts.shift();E.push({t:'partBreak',uid:e.uid,id:pid});}
  if(e.cd!=null&&!hasPart(e,'spring')){e.cdd=(e.cdd||0)+amt;while(e.cdd>=10){e.cdd-=10;e.cd++;E.push({t:'cdUp',uid:e.uid});}if(e.intent&&e.intent.tick)e.intent.n='倒數 '+(e.cd-1);}}
 const b=Math.min(e.block,amt);e.block-=b;const real=amt-b;e.hp=Math.max(0,e.hp-real);E.push({t:'hit',to:e.uid,n:amt,blocked:b});
 if(!noLink&&e.st.link&&real>0)for(const o of alive(c))if(o!==e&&o.st.link)hitEnemy(D,st,o,c.pw.linkFull?real:Math.floor(real/2),E,true);
 splitCheck(D,st,e,E);
 return amt;}
function splitCheck(D,st,e,E){const c=st.combat;const sp=D.enemies[e.id].split;if(!sp||e.split||e.hp<=0||e.hp>e.max*sp)return;e.split=1;const half=Math.floor(e.hp/2);if(half<1)return;
 const n=mkEnemy(D,st,e.id,c.enemies.length);n.hp=n.max=half;e.hp=e.max=e.hp-half;n.split=1;n.st={};chooseIntent(D,st,n);chooseIntent(D,st,e);c.enemies.push(n);E.push({t:'split',uid:e.uid,nu:n.uid});}
function lossHook(D,st,n,E){const c=st.combat;if(n<=0)return;
 if(c&&pas(D,st,'sacrifice')){c.lossAcc=(c.lossAcc||0)+n;while(c.lossAcc>=5&&(c.sacN||0)<2){c.lossAcc-=5;c.sacN=(c.sacN||0)+1;c.energy++;E.push({t:'sacrifice'});}}
 if(st.ch==='yx'&&c){const a=alive(c);if(a.length)hitEnemy(D,st,pick(st,a),n,E,true);}
 if(st.hp<=0&&pas(D,st,'phylactery')&&!st.flags.phyl){st.flags.phyl=1;st.hp=Math.ceil(st.maxHp*.3);E.push({t:'revive'});}}
function selfHurt(D,st,n,E,floor1,noAl){const c=st.combat;if(!noAl)addAlien(D,st,n*2,E);st.hp-=n;lossHook(D,st,n,E);
 if(c)for(const e of alive(c))if(hasPart(e,'lung')){e.hp=Math.min(e.max,e.hp+n);E.push({t:'lungHeal',uid:e.uid,n});}if(floor1&&st.hp<1)st.hp=1;if(c)c.hurt+=n;E.push({t:'selfHurt',n});lowCheck(D,st,E);
 if(st.hp<=0&&has(st,'mirror')&&!st.flags.mirror){st.flags.mirror=1;st.hp=Math.ceil(st.maxHp*.3);E.push({t:'relic',id:'mirror'});}}
function lowCheck(D,st,E){const c=st.combat;if(!c||c.fox||!has(st,'foxhair')||st.hp<=0||st.hp>=st.maxHp/2)return;c.fox=1;st.hp=Math.min(st.maxHp,st.hp+10);for(const e of alive(c))addSt(e,'pact',3);E.push({t:'relic',id:'foxhair'});}
function hitPlayer(D,st,amt,E,src){const c=st.combat;if(src&&amt>0&&has(st,'lampshade')&&!c.shade){c.shade=1;amt=Math.floor(amt/2);E.push({t:'relic',id:'lampshade'});}if(src&&c.lure>0&&amt>0){const t=Math.min(c.lure,amt);c.lure-=t;amt-=t;E.push({t:'lure',n:t,left:c.lure});if(c.lure<=0){E.push({t:'lureBreak'});for(const e of alive(c))hitEnemy(D,st,e,8,E,true);}}
 const b=Math.min(c.block,amt);c.block-=b;const real=amt-b;st.hp-=real;c.hurt+=real;lossHook(D,st,real,E);E.push({t:'hurt',n:amt,blocked:b,src});if(src){c.lastSrc=src;const a=c.enemies.find(x=>x.uid===src);if(a&&real>0)a.hitMe=1;}if(real>0&&st.hp>0)lowCheck(D,st,E);
 if(st.hp<=0&&has(st,'mirror')&&!st.flags.mirror){st.flags.mirror=1;st.hp=Math.ceil(st.maxHp*.3);E.push({t:'relic',id:'mirror'});}}
function killCheck(D,st,E){const c=st.combat;for(const e of c.enemies.slice())if(e.hp<=0&&!e.dead){e.dead=1;st.stats.kills++;E.push({t:'kill',id:e.id,uid:e.uid});if(M(st,'glutton')&&st.hp>0)st.hp=Math.min(st.maxHp,st.hp+2);
  if(M(st,'eyegem')&&D.enemies[e.id].fac==='eldritch'&&R(st)<.3){st.shards=(st.shards||0)+1;E.push({t:'shard',n:st.shards});if(st.shards>=3){st.shards-=3;const p=relicPool(D,st);if(p.length){const id=pick(st,p);gainRelic(D,st,id);E.push({t:'relicGot',id});}}}
  if(D.enemies[e.id].drop)E.push({t:'drop',id:D.enemies[e.id].drop});if(has(st,'namelesslamp')&&st.hp>0)st.hp=Math.min(st.maxHp,st.hp+3);
  if(e.stolen&&e.stolen.length){c.disc.push(...e.stolen);E.push({t:'return',n:e.stolen.length});e.stolen=[];}
  if(e.st.link&&pas(D,st,'brideLink')){for(const o of alive(c))if(o.st.link){o.hp=Math.max(0,o.hp-8);E.push({t:'hit',to:o.uid,n:8,blocked:0});}}
  if(D.enemies[e.id].twin)for(const o of alive(c))if(o.id===e.id)realmUp(D,st,o,2,E);
  if(c.locks)for(const x of [...c.hand,...c.draw,...c.disc])if(x.lock===e.uid)delete x.lock;
  const od=D.enemies[e.id].onDeath;if(od)for(const id of od){const n=mkEnemy(D,st,id,c.enemies.length);chooseIntent(D,st,n);c.enemies.push(n);E.push({t:'spawn',uid:n.uid,id});}}
 if(c.enemies.some(e=>e.hp<=0&&!e.dead)){killCheck(D,st,E);return;}
 if(!alive(c).length)winCombat(D,st,E);}

function play(D,st,i,target,E){const c=st.combat;const card=c.hand[i];if(!card)return 'no_card';const ph=phaseOf(st);const d=cardDef(D,card,ph);
 if(card.id==='x_fourth'&&st.fourthN>=8&&!st.flags.fourthUsed){st.flags.fourthUsed=1;c.hand.splice(i,1);c.stop=1;E.push({t:'fourth'});return null;}
 if(d.t==='x'||d.c<0)return '這張牌不能打出';
 if(card.lock&&c.enemies.some(e=>e.uid===card.lock&&e.hp>0))return '這張牌被抓住了';
 if(d.t==='a'&&c.hand.some(x=>(D.cards[x.id].lockAtk)))return '被鎮屍符鎮住了，先撕掉它';
 let k=cost(D,card,ph);if(pas(D,st,'script')&&c.seqT==='as'&&d.t==='p')k=0;if(k>c.energy)return '能量不夠';
 let tg=null;if(needsTarget(D,card,ph)){tg=c.enemies.find(e=>e.uid===target&&e.hp>0);if(!tg){const a=alive(c);if(a.length===1)tg=a[0];else return '請選一個目標';}}
 c.energy-=k;c.hand.splice(i,1);st.stats.cards++;E.push({t:'play',id:card.id,up:card.up,tg:tg&&tg.uid});
 let total=0,gk=(d.fx.find(f=>f[0]==='gk')||[0,0])[1];
 const hasDmg=d.fx.some(f=>f[0]==='d'||f[0]==='da');const sb=isYY(st)?scarB(card):0;let scarN=0;
 const FX=card.ring?d.fx.concat(d.fx.filter(f=>!['hurt','hurtq','mhp','al','ep','en'].includes(f[0]))):d.fx;
 const dos=st.ch==='gu'?((c.tmpDos||0)+(tg?(st.dossier[D.enemies[tg.id].fac]||0):0)):0;
 const atk=d.t==='a';const van=M(st,'vanity')?((st.alien||0)<40?2:-1):0;const phB=((atk&&ph==='half')?1:0)+van-(atk&&M(st,'guard')?1:0)+(hasDmg?sb:0)+(atk?dos:0);const wr=(c.yx&&M(st,'wrath'))?2:1;const gr=e=>(M(st,'grudge')&&e.hitMe?2:0);const dbl=(atk&&pas(D,st,'ink6Double')&&c.ink>=6)?2:1;
 if(atk&&!c.firstAtk){c.firstAtk=1;if(pas(D,st,'firstAtkPact1'))for(const e of (tg?[tg]:alive(c)))addSt(e,'pact',1);}
 for(const f of FX){
  switch(f[0]){
   case 'd':{const hits=f[2]||1;let bonus=(hits>1&&pas(D,st,'swarm')?1:0)+phB+((d.t==='a'&&c.pw.beast&&st.hp<st.maxHp/2)?c.pw.beast:0);const sc=f[3];
    if(sc&&sc.startsWith('pact'))bonus+=(tg.st.pact||0)*(+sc.slice(4));
    if(sc&&sc.startsWith('ink')){bonus+=c.ink*(+sc.slice(3));if(c.ink)E.push({t:'inkUse',n:c.ink});if(c.ink>=5&&has(st,'inkstone'))c.inkDraw=1;c.ink=0;}
    for(let h=0;h<hits;h++){if(tg.hp<=0)break;total+=hitEnemy(D,st,tg,dmgCalc((f[1]+bonus+gr(tg))*dbl*wr,c,tg),E);}break;}
   case 'da':{const hits=f[2]||1;for(let h=0;h<hits;h++)for(const e of alive(c)){const bonus=phB+(f[3]?(e.st.pact||0)*(+f[3].slice(4)):0)+((d.t==='a'&&c.pw.beast&&st.hp<st.maxHp/2)?c.pw.beast:0);total+=hitEnemy(D,st,e,dmgCalc((f[1]+bonus+gr(e))*dbl*wr,c,e),E);}break;}
   case 'b':{const n=Math.max(0,f[1]+(hasDmg?0:sb)+(c.st.dex||0)+(M(st,'guard')?2:0)-(M(st,'envy')&&alive(c).some(e=>e.st.str)?2:0));c.block+=n;E.push({t:'block',n});break;}
   case 'dr':draw(D,st,f[1],E);break;
   case 'en':c.energy+=f[1];break;
   case 'ep':if(tg.st.pact)c.energy+=f[1];break;
   case 'st':{const who=f[3];if(who==='s')addSt(c,f[1],f[2]);else for(const e of (who==='a'?alive(c):[tg]))addSt(e,f[1],f[2]);break;}
   case 'pa':{let bonus=0;if(has(st,'silkglove')&&!c.silk){c.silk=1;bonus=2;E.push({t:'relic',id:'silkglove'});}for(const e of (f[2]==='a'?alive(c):[tg])){addSt(e,'pact',f[1]+bonus);if(pas(D,st,'vine'))addSt(e,'vine',1);if(e.st.pact>=20)E.push({t:'ach',id:'pact20'});}break;}
   case 'ink':gainInk(st,c,f[1],E);break;
   case 'jd':{const n=tg.st.pact||0;delete tg.st.pact;if(n){E.push({t:'judge',n});total+=hitEnemy(D,st,tg,dmgCalc(f[1]*n,c,tg),E);if(has(st,'knot')&&tg.hp>0)tg.st.pact=(tg.st.pact||0)+2;if(tg.hp<=0&&pas(D,st,'judgeKillHeal3')){st.hp=Math.min(st.maxHp,st.hp+3);E.push({t:'heal',n:3});}}break;}
   case 'lk':{const ln=2+(pas(D,st,'linkPlus1')?1:0)+(M(st,'embroider')?1:0);tg.st.link=Math.max(tg.st.link||0,ln);for(const e of alive(c))if(e!==tg)e.st.link=Math.max(e.st.link||0,ln);if(has(st,'needle'))for(const e of alive(c))addSt(e,'pact',1);break;}
   case 'ka':c.keepAll=1;break;
   case 'hurt':selfHurt(D,st,f[1],E);scarN+=f[1];break;
   case 'dos':c.tmpDos=(c.tmpDos||0)+f[1];break;
   case 'dd':{draw(D,st,f[1],E);for(let q=0;q<f[2]&&c.hand.length;q++){const x=c.hand.find(y=>D.cards[y.id].t==='x')||c.hand.slice().sort((a,b)=>(D.cards[a.id].r||0)-(D.cards[b.id].r||0))[0];c.hand.splice(c.hand.indexOf(x),1);if(!x.temp)c.disc.push(strip(x));}break;}
   case 'rc':{if(c.disc.length&&c.hand.length<handMax(D,st)){c.hand.push(c.disc.pop());}break;}
   case 'seize':{if(tg&&tg.st.str>0){tg.st.str--;addSt(c,'str',1);E.push({t:'seize'});}break;}
   case 'hurtq':selfHurt(D,st,f[1],E,false,true);break;
   case 'al':addAlien(D,st,f[1],E);break;
   case 'stun':if(tg&&tg.hp>0){tg.stun=1;E.push({t:'stun',uid:tg.uid});}break;
   case 'mhp':st.maxHp=Math.max(1,st.maxHp+f[1]);st.hp=Math.min(st.hp,st.maxHp);E.push({t:'mhp',n:f[1]});break;
   case 'gk':break;
   case 'hp':st.hp=Math.min(st.maxHp,st.hp+f[1]);E.push({t:'heal',n:f[1]});break;
   case 'cp':{const others=c.hand.filter(x=>D.cards[x.id].t!=='x');if(others.length&&c.hand.length<10){const o=pick(st,others);c.hand.push({uid:'t'+st.uid++,id:o.id,up:o.up,free:1,temp:1});}break;}
   case 'pw':c.pw[f[1]]=(c.pw[f[1]]||0)+f[2];E.push({t:'power',id:f[1]});if(has(st,'blackfeather')){c.block+=4;E.push({t:'block',n:4});}break;
   case 'px2':if(tg.st.pact){tg.st.pact*=2;if(tg.st.pact>=20)E.push({t:'ach',id:'pact20'});}break;
   case 'rw':{const n=c.hand.length;c.disc.push(...c.hand.filter(x=>!x.temp));c.hand=[];draw(D,st,n,E);break;}
  }
  if(!alive(c).length)break;}
 c.lastCard={dmg:total,block:d.fx.filter(f=>f[0]==='b').reduce((a,f)=>a+f[1],0)};
 if(dbl===2){c.ink=0;E.push({t:'inkUse',n:6});}
 if(d.bl){addAlien(D,st,4,E);st.reso=st.reso||{};st.reso[d.bl]=(st.reso[d.bl]||0)+1;}
 if(gk&&tg&&tg.hp<=0){st.gold+=gk;E.push({t:'gold',n:gk});}
 if(st.hp<=0){c.hand=c.hand;loseRun(D,st,E);return null;}
 if(total>st.stats.dmgMax)st.stats.dmgMax=total;if(total>=30)E.push({t:'ach',id:'big30'});
 if(d.t==='a'){c.atkN++;if(c.atkN===3&&has(st,'bell'))draw(D,st,1,E);}
 if(c.inkDraw){c.inkDraw=0;draw(D,st,1,E);E.push({t:'relic',id:'inkstone'});}
 if(scarN&&isYY(st)){card.scar=(card.scar||0)+scarN;const dk=st.deck.find(x=>x.uid===card.uid);if(dk)dk.scar=card.scar;E.push({t:'scar',n:card.scar});}
 if(card.ring){addAlien(D,st,10,E);delete card.ring;c.ringPlayed=1;}
 if(atk&&total>0&&pas(D,st,'leech')&&!c.leeched){c.leeched=1;const h=Math.floor(total*.2);if(h){st.hp=Math.min(st.maxHp,st.hp+h);E.push({t:'heal',n:h});}}
 if(d.t==='p'&&pas(D,st,'hatch')&&c.hand.length<handMax(D,st))c.hand.push({uid:'x'+st.uid++,id:'b_hatch',up:0,temp:1,free:1});
 if(d.t==='s'&&pas(D,st,'moth')&&!c.skillN){c.skillN=1;addAlien(D,st,5,E);}
 if(!c.firstCard){c.firstCard=1;if(pas(D,st,'mimicFirst')){const o=c.hand.filter(x=>D.cards[x.id].t!=='x'&&!x.temp);if(o.length&&c.hand.length<handMax(D,st)){const x=pick(st,o);c.hand.push({uid:'x'+st.uid++,id:x.id,up:x.up,temp:1});E.push({t:'mimicCard'});}}}
 c.seqT=((c.seqT||'')+d.t).slice(-2);
 if(M(st,'obsess')&&!c.obs){c.obs=card.uid;}
 if(d.t!=='p'&&!card.temp){{const o=strip(card);delete o.oil;(d.ex?c.exh:c.disc).push(o);}}
 killCheck(D,st,E);return null;}

function endTurn(D,st,E){const c=st.combat;
 if(c.hand.some(x=>x.ring)&&!c.ringPlayed)c.drawLess=(c.drawLess||0)+1;c.ringPlayed=0;
 if(has(st,'candle')&&c.energy>0){c.block+=4*c.energy;E.push({t:'block',n:4*c.energy});}
 for(const x of c.hand){const xd=D.cards[x.id];if(xd&&xd.endHand&&xd.endHand[0]==='hurt')selfHurt(D,st,xd.endHand[1],E);}
 if(st.hp<=0){loseRun(D,st,E);return;}
 const kp=x=>c.keepAll?!x.temp:cardDef(D,x).keep;const keep=c.hand.filter(kp).map(x=>{delete x.tax;delete x.free;return x;});c.disc.push(...c.hand.filter(x=>!kp(x)&&!x.temp).map(strip));c.hand=keep;c.keepAll=0;
 if(c.obs&&c.obs!==1){const k=c.disc.findIndex(x=>x.uid===c.obs);if(k>=0){c.hand.push(c.disc.splice(k,1)[0]);E.push({t:'obsess'});}c.obs=1;}
 if(c.markKeep){c.markKeep=0;const k=c.disc.length-1;if(k>=0){const best=c.disc.slice().sort((a,b)=>cardDef(D,b).c-cardDef(D,a).c)[0];c.disc.splice(c.disc.indexOf(best),1);c.hand.push(best);E.push({t:'bookmark'});}}
 if(keep.length&&c.pw.keepInk)gainInk(st,c,keep.length*c.pw.keepInk,E);
 if(keep.length&&pas(D,st,'keepBlock2'))c.keptB=keep.length*2;
 if(pas(D,st,'pactGrow1'))for(const e of alive(c))if(e.st.pact&&e.st.pact<10)e.st.pact++;
 if(pas(D,st,'coral')&&c.energy>0){const n=c.energy*4;c.block+=n;c.hard=(c.hard||0)+n;E.push({t:'block',n});}
 if(c.full){selfHurt(D,st,8,E,false,true);if(st.hp<=0){loseRun(D,st,E);return;}
  if(st.ch==='yx'&&c.full<2){c.full=2;}else{c.full=0;st.alien=st.ch==='yx'?60:0;st.flags['full'+st.layer]=1;E.push({t:st.ch==='yx'?'fullEnd':'recall'});}}
 if(keep.length&&has(st,'redbookmark')){c.block+=3;E.push({t:'block',n:3});}
 // 敵人回合
 for(const e of alive(c)){if(e.pblock){e.block=Math.min(e.block,e.pblock);e.pblock=e.block;}else e.block=0;}
 const halfNow=phaseOf(st)==='half';
 for(const e of c.enemies){if(e.hp<=0)continue;if(c.stop){continue;}if(e.stun){delete e.stun;E.push({t:'stunned',uid:e.uid});continue;}
  if(halfNow&&D.enemies[e.id].timid&&alive(c).length>1&&R(st)<.2){e.hp=0;e.dead=1;e.fled=1;E.push({t:'flee',uid:e.uid});continue;}
  const m=e.intent;E.push({t:'enemyAct',uid:e.uid,n:m.n});const EE=D.enemies[e.id];
  if(m.solo){breakthrough(D,st,e,E);}
  if(m.tick){e.cd--;}
  if(m.boom){e.cd=EE.cd;}
  if(m.mimic){const L=c.lastCard||{dmg:0,block:0};m.a=L.dmg>0?L.dmg:(L.block?0:EE.mimicBase||0);if(L.block)e.block+=L.block;}
  if(m.realmAll)for(const o of alive(c))if(o!==e)realmUp(D,st,o,1,E);
  if(m.drawLess)c.drawLess=(c.drawLess||0)+m.drawLess;
  if(m.healAlly){const o=alive(c).filter(x=>x!==e);if(o.length){const t=pick(st,o);t.hp=Math.min(t.max,t.hp+m.healAlly);realmUp(D,st,t,1,E);E.push({t:'allyHeal',uid:t.uid});}}
  if(m.addHand)for(let i=0;i<m.addHand[1];i++)(c.handQ=c.handQ||[]).push(m.addHand[0]);
  if(m.call){e.num=(e.num||0)+1;E.push({t:'call',uid:e.uid,n:e.num});if(e.num===4)c.dumpNext=1;}
  if(m.gaze){if(isYY(st))addAlien(D,st,m.gaze,E);else if(st.ch==='cl'){st.wick=Math.max(1,(st.wick==null?10:st.wick)-3);E.push({t:'wickDrain',n:3});}}
  if(m.grab)(c.grabQ=c.grabQ||[]).push(e.uid);
  if(m.oil){if(hasPart(e,'tube')){if(st.ch==='cl'){if(c.ink){const n=Math.min(c.ink,2);c.ink-=n;E.push({t:'drain',n});}}else c.oilNext=(c.oilNext||0)+1;}else m.a=EE.noPart||0;}
  if(m.sew){const cand=alive(c).filter(x=>x.parts&&x.parts.length<D.enemies[x.id].parts.length);const t=cand.length?pick(st,cand):e;if(t.parts&&t.parts.length<D.enemies[t.id].parts.length){const all=D.enemies[t.id].parts.map(p=>p.id);const miss=all.filter(p=>!t.parts.includes(p));t.parts.unshift(miss[miss.length-1]);t.pd=0;E.push({t:'sewn',uid:t.uid});}t.block+=8;t.pblock=(t.pblock||0)+8;}
  if(m.lung){if(hasPart(e,'nail'))m.a=9;else m.a=0;if(hasPart(e,'horn')){const x={uid:'x'+st.uid++,id:'x_whisper',up:0};c.draw.splice(Math.floor(R(st)*(c.draw.length+1)),0,x);E.push({t:'curseIn'});}}
  if(m.a&&hasPart(e,'needle'))m.a+=2;
  if(e.jb){e.jb--;if(!e.jb)addSt(e,'str',2);}
  if(m.a){const hits=m.h||1;const am=(D.enemies[e.id].boss||D.enemies[e.id].elite)?1:((D.layers[st.layer]||{}).atkMul||1);for(let h=0;h<hits;h++){const hp0=st.hp;hitPlayer(D,st,dmgCalc(Math.round(m.a*am),e,c),E,e.uid);if(st.hp<hp0&&c.pw.grudge)addSt(e,'pact',c.pw.grudge);if(st.hp<=0)break;}
   if(pas(D,st,'jelly')&&!c.jelly){c.jelly=1;addSt(e,'str',-2);e.jb=2;}
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
 if(c.stop){c.stop=0;for(const e of alive(c))delete e.stun;}
 else{for(const e of alive(c))if(e.realm!=null)realmUp(D,st,e,1,E);
  if(alive(c).some(e=>D.enemies[e.id].stare)){if(isYY(st))addAlien(D,st,5,E);else if(st.ch==='cl'&&st.wick>1){st.wick--;E.push({t:'wickDrain',n:1});}}}
 killCheck(D,st,E);if(st.screen!=='combat')return;
 // 回合結束：計時的狀態減 1
 for(const u of [c,...alive(c)]){for(const k of TIMED)if(u.st[k]){if(k==='regen'&&u===c)st.hp=Math.min(st.maxHp,st.hp+u.st[k]);u.st[k]--;if(!u.st[k])delete u.st[k];}}
 for(const e of alive(c))chooseIntent(D,st,e);
 startTurn(D,st,E);if(st.hp<=0)loseRun(D,st,E);}

function winCombat(D,st,E){const c=st.combat;const kind=c.kind;
 if(st.ch==='gu'){const f=D.enemies[c.enemies[0].id].fac;if(f)st.dossier[f]=(st.dossier[f]||0)+1;}
 if(kind==='boss'&&st.layer===1&&(st.pages||0)>=9)E.push({t:'unlockGu'});addAlien(D,st,-15,E);if(has(st,'blotter')&&c.ink>=2){st.hp=Math.min(st.maxHp,st.hp+Math.floor(c.ink/2));}
 if(c.hurt===0)E.push({t:'ach',id:'nohit'});
 E.push({t:'ach',id:'first_win'});if(kind==='elite'){st.stats.elites++;E.push({t:'ach',id:'first_elite'});}
 if(has(st,'bandage'))st.hp=Math.min(st.maxHp,st.hp+6);
 const g=D.gold[kind]||D.gold.fight;let gold=ri(st,g[0],g[1]);if(has(st,'purse'))gold=Math.floor(gold*1.5);if(M(st,'greed'))gold=Math.floor(gold*1.5);if(M(st,'pride')&&kind!=='fight')gold*=2;
 if(kind==='elite'&&M(st,'names'))st.namesNext=1;
 if(kind==='elite'&&st.layer===1)E.push({t:'page'});st.gold+=gold;
 if(st.gold>=200)E.push({t:'ach',id:'gold200'});
 const rw={gold,cards:rollCards(D,st,M(st,'obsess')?2:3,kind!=='fight'),relic:null,relicChoice:null,cardTaken:false};
 if(kind==='elite'){const p=relicPool(D,st);if(p.length){rw.relic=pick(st,p);gainRelic(D,st,rw.relic);}if(M(st,'pride')){const p2=relicPool(D,st);if(p2.length){rw.relic2=pick(st,p2);gainRelic(D,st,rw.relic2);}}}
 if(kind==='boss'){if(st.layer===0){if(st.com==='c_nofix'&&!st.stats.rests)st.comDone=1;if(st.com==='c_quiet'&&!st.stats.elites)st.comDone=1;}if(st.com==='c_letter'&&st.deck.some(x=>x.id==='x_regret'))st.comDone=1;
  st.stats.bosses++;const bid=c.enemies[0].id;E.push({t:'ach',id:{wusign:'boss1',qianhao:'boss2',deepdrill:'boss3'}[bid]});
  const p=shuffle(st,relicPool(D,st)).slice(0,3);rw.relicChoice=p;st.hp=Math.min(st.maxHp,st.hp+Math.ceil((st.maxHp-st.hp)*.75));}
 if(st.relics.length>=6)E.push({t:'ach',id:'relic6'});
 st.reward=rw;st.combat=null;st.screen='reward';E.push({t:'win',kind,gold});}
function loseRun(D,st,E){const c=st.combat;const k=c&&c.lastSrc&&c.enemies.find(x=>x.uid===c.lastSrc);
 {const can=st.deck.filter(x=>D.cards[x.id].r>0&&D.cards[x.id].t!=='x');if(can.length){const x=pick(st,can);E.push({t:'leftCard',card:{id:x.id,up:x.up,scar:x.scar||0,ch:baseCh(st),ttl:3}});}}st.screen='over';st.result={win:false,killer:k?k.id:null};st.combat=null;E.push({t:'runEnd',win:false,killer:k?k.id:null,fourth:st.fourthN!=null?1:0,com:comOk(st)?st.com:null,ch:st.ch,origin:st.origin,ph:st.stats.ph,persona:st.persona,floors:st.stats.floors,memory:memoryOf(D,st,false)});}
function comOk(st){if(!st.com)return false;if(st.com==='c_greed'&&st.gold>=300)return true;if(st.com==='c_return'&&(st.stats.sent||0)>=3)return true;return !!st.comDone;}
function memoryOf(D,st,win){const M=D.memory;return st.stats.floors*M.perFloor+st.stats.elites*M.perElite+st.stats.bosses*M.perBoss+(win?M.win:0);}

// ── 地圖
function canMove(D,st,c){const map=st.maps[st.layer];if(c==='boss')return st.row===D.map.rows-1;if(st.row===-1)return c>=0&&c<D.map.cols;if(st.row>=D.map.rows-1)return false;return map.rows[st.row][st.col].e.includes(c);}
function enter(D,st,c,E){const L=D.layers[st.layer];st.stats.floors++;
 if(c==='boss'){st.row=D.map.rows;startCombat(D,st,[L.boss],'boss').forEach(x=>E.push(x));E.push({t:'boss',id:L.boss});return;}
 st.row++;st.col=c;const t=st.maps[st.layer].rows[st.row][c].t;E.push({t:'enter',node:t});
 if(t==='fight'){const set=pick(st,L.fights);startCombat(D,st,set,'fight').forEach(x=>E.push(x));}
 else if(t==='elite'){const el=pick(st,L.elites);startCombat(D,st,Array.isArray(el)?el:[el],'elite').forEach(x=>E.push(x));}
 else if(t==='rest'){st.screen='rest';if(st.com==='c_lamp'&&st.layer>=1)st.comDone=1;}
 else if(t==='chest'){const p=relicPool(D,st);const id=p.length?pick(st,p):null;if(id)gainRelic(D,st,id);else st.gold+=50;st.reward={chest:id,gold:id?0:50};st.screen='chest';if(st.relics.length>=6)E.push({t:'ach',id:'relic6'});}
 else if(t==='shop'){if(M(st,'greed'))addAlien(D,st,10,E);st.shop=genShop(D,st);st.screen='shop';}
 else if(t==='event'){const okEv=e=>!e.special&&(!e.ch||e.ch===baseCh(st))&&!(e.hob&&(st.hob||[]).includes(e.hob));let ev=D.events.filter(e=>okEv(e)&&!st.seenEv.includes(e.id));if(!ev.length){st.seenEv=[];ev=D.events.filter(okEv);}let e=pick(st,ev);if(st.left&&!st.flags.leftSeen&&st.layer===0){st.flags.leftSeen=1;e=D.events.find(x=>x.id==='left_card')||e;}else st.seenEv.push(e.id);st.event={id:e.id,done:null};if(has(st,'map'))st.gold+=15;st.screen='event';}}
function genShop(D,st){const P=D.shop;const cs=[];const p=pool(D,st);const used=new Set();for(let i=0;i<5+(isYY(st)&&phaseOf(st)==='h'?1:0)+(M(st,'greed')?1:0);i++){const left=p.filter(k=>!used.has(k));if(!left.length)break;const id=pick(st,left);used.add(id);const r=D.cards[id].r;cs.push({id,price:Math.round(P.card[r-1]*(.9+R(st)*.2)*(M(st,'queen')?1.2:1)*(pas(D,st,'shop20')?.8:1)),sold:false});}
 const rp=shuffle(st,relicPool(D,st)).slice(0,2).map(id=>({id,price:ri(st,P.relic[0],P.relic[1]),sold:false}));return {cards:cs,relics:rp,removed:false,removeCost:P.remove};}

function warpMap(D,st,m){st.layerCorrupt=st.layerCorrupt||{};const a=isYY(st)?(st.alien||0):0;st.layerCorrupt[st.layer]=a;const mid=[];m.rows.forEach((r,ri)=>{if(ri>0&&ri<m.rows.length-1)r.forEach(n=>mid.push(n));});
 if(a>=40){const r=mid.find(n=>n.t==='rest');if(r)r.t='fight';const f=mid.find(n=>n.t==='fight'&&n!==r);if(f)f.t='shop';}
 if(st.layer>0&&st.flags['full'+(st.layer-1)]){const f=mid.filter(n=>n.t==='fight');if(f.length){const n=f[Math.floor(f.length/2)];n.t='elite';n.nest=1;}}
 return m;}
function nextAfterBoss(D,st,E){if(M(st,'home'))st.hp=Math.min(st.maxHp,st.hp+15);st.layer++;if(st.layer>=D.layers.length){st.screen='over';st.result={win:true};E.push({t:'ach',id:'win_'+st.ch});E.push({t:'runEnd',win:true,fourth:st.fourthN!=null?1:0,com:comOk(st)?st.com:null,ch:st.ch,origin:st.origin,ph:st.stats.ph,persona:st.persona,floors:st.stats.floors,memory:memoryOf(D,st,true)});return;}
 st.row=-1;st.col=null;st.maps.push(warpMap(D,st,genMap(D,st,st.layer)));st.screen='map';E.push({t:'layer',n:st.layer});}
function backToMap(D,st,E){st.reward=null;st.event=null;st.shop=null;st.pick=null;if(st.row>=D.map.rows){nextAfterBoss(D,st,E);return;}st.screen='map';if(st.deck.length>=25)E.push({t:'ach',id:'deck25'});}

// ── 事件結果
function applyEvent(D,st,opt,E){const out=[];let pend=null;
 for(const r of opt.r){
  if(r.gold){st.gold=Math.max(0,st.gold+r.gold);}
  if(r.heal)st.hp=Math.min(st.maxHp,st.hp+r.heal);
  if(r.hurt){st.hp-=r.hurt;if(st.hp<=0)st.hp=1;}
  if(r.maxhp){st.maxHp=Math.max(1,st.maxHp+r.maxhp);st.hp=Math.min(st.hp,st.maxHp);}
  if(r.card){addCard(st,r.card);}
  if(r.hobby){E.push({t:'hobby',id:r.hobby});}
  if(r.leftTake&&st.left){st.hp=Math.max(1,st.hp-10);const x=addCard(st,st.left.id);const dk=st.deck[st.deck.length-1];dk.up=st.left.up;if(st.left.scar)dk.scar=st.left.scar;dk.left=1;st.left=null;E.push({t:'leftTaken'});}
  if(r.leftSkip&&st.left){st.left=null;E.push({t:'leftSkip'});}
  if(r.alien){addAlien(D,st,r.alien,E);}
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
  case 'REST':if(st.screen!=='rest'||st.flags.rested)return fail('不能休息');{let n=Math.floor(st.maxHp*.3)+(has(st,'teapot')?15:0)+((st.kp||[]).includes('m_rest')?5:0)+(M(st,'glutton')?10:0);if(has(st,'borrowedheart'))n=Math.floor(n/2);st.hp=Math.min(st.maxHp,st.hp+n);st.stats.rests=(st.stats.rests||0)+1;addAlien(D,st,-30,E);E.push({t:'heal',n});backToMap(D,st,E);}break;
  case 'SLEEP':if(st.screen!=='rest'||!M(st,'lazy'))return fail('不能睡');st.hp=st.maxHp;addAlien(D,st,15,E);E.push({t:'heal',n:st.maxHp});backToMap(D,st,E);break;
  case 'TEA':if(st.screen!=='rest'||!M(st,'tea'))return fail('沒有茶具');addAlien(D,st,-25,E);E.push({t:'tea'});backToMap(D,st,E);break;
  case 'WRITE':if(st.screen!=='rest'||!M(st,'letters')||st.flags.wrote)return fail('現在不能寫信');if(st.gold<30)return fail('要留 30 渡鴉幣在信封裡');st.gold-=30;st.flags.wrote=1;E.push({t:'letter',n:30});break;
  case 'SMITH':if(st.screen!=='rest')return fail('不能強化');if(M(st,'grudge'))return fail('怨氣太重，靜不下來磨牌');{const c=st.deck.find(x=>x.uid===a.uid);if(!c||c.up||!D.cards[c.id].u)return fail('這張不能強化');c.up=1;E.push({t:'upgraded',id:c.id});backToMap(D,st,E);}break;
  case 'BUY_CARD':{if(st.screen!=='shop')return fail('不在商店');const it=st.shop.cards[a.i];if(!it||it.sold)return fail('賣完了');if(st.gold<it.price)return fail('渡鴉幣不夠');st.gold-=it.price;it.sold=true;addCard(st,it.id);E.push({t:'gotCard',id:it.id});break;}
  case 'BUY_RELIC':{if(st.screen!=='shop')return fail('不在商店');if(M(st,'home'))return fail('想回家的人，不帶多餘的東西');const it=st.shop.relics[a.i];if(!it||it.sold)return fail('賣完了');if(st.gold<it.price)return fail('渡鴉幣不夠');st.gold-=it.price;it.sold=true;gainRelic(D,st,it.id);if(st.relics.length>=6)E.push({t:'ach',id:'relic6'});break;}
  case 'REMOVE':{if(st.screen!=='shop'&&!(st.pick&&st.pick.mode==='remove'))return fail('不能移除');if(M(st,'remember'))return fail('每一張都捨不得拿掉');const i=st.deck.findIndex(x=>x.uid===a.uid);if(i>=0&&D.cards[st.deck[i].id].noRemove)return fail('這張牌不能被移除');if(i<0)return fail('沒有這張');
   if(st.screen==='shop'){if(st.shop.removed)return fail('這間店只能移除一次');if(st.gold<st.shop.removeCost)return fail('渡鴉幣不夠');st.gold-=st.shop.removeCost;st.shop.removed=true;st.shop.removeCost+=25;}
   else st.pick=null;st.deck.splice(i,1);if(M(st,'bookmark'))st.marks=(st.marks||0)+1;E.push({t:'removed'});break;}
  case 'TRANSFORM':{if(!(st.pick&&st.pick.mode==='transform'))return fail('不能轉換');const c=st.deck.find(x=>x.uid===a.uid);if(!c)return fail('沒有這張');if(D.cards[c.id].noRemove)return fail('這張牌不能被換掉');const p=pool(D,st).filter(k=>k!==c.id);c.id=pick(st,p);c.up=0;st.pick=null;E.push({t:'transformed',id:c.id});break;}
  case 'CHOOSE':{if(!(st.pick&&st.pick.mode==='choose'))return fail('不能選');if(a.i!=null){const id=st.pick.cards[a.i];if(!id)return fail('沒有這張');addCard(st,id);E.push({t:'gotCard',id});}st.pick=null;break;}
  case 'EVENT':{if(st.screen!=='event'||st.event.done)return fail('不能選');const ev=D.events.find(e=>e.id===st.event.id);const opt=ev.opts[a.i];if(!opt)return fail('沒有這個選項');if(opt.need&&opt.need.gold&&st.gold<opt.need.gold)return fail('渡鴉幣不夠');
   const {out,pend}=applyEvent(D,st,opt,E);st.event.done={i:a.i,out};if(pend){if(pend.mode==='remove'&&!st.deck.length){}else st.pick=pend;}break;}
  case 'PREP_RELIC':{if(st.screen!=='prep'||!st.prep.relics)return fail('不能選');const id=st.prep.relics[a.i];if(!id)return fail('沒有這件');gainRelic(D,st,id);st.prep.relics=null;E.push({t:'relicGot',id});break;}
  case 'PREP_REMOVE':{if(st.screen!=='prep'||!st.prep.remove)return fail('不能移除');const i=st.deck.findIndex(x=>x.uid===a.uid);if(i<0)return fail('沒有這張');st.deck.splice(i,1);st.prep.remove=0;E.push({t:'removed'});break;}
  case 'PREP_DONE':if(st.screen!=='prep')return fail('不在出發準備');st.prep=null;st.screen='map';break;
  case 'REROLL_MAP':{if(st.screen!=='map'||st.row!==-1)return fail('只能在這一層還沒走之前換');if(!(st.kp||[]).includes('m_skip'))return fail('還沒有第二張地圖');const k='rr'+st.layer;if(st.flags[k])return fail('這一層已經換過了');st.flags[k]=1;st.maps[st.layer]=genMap(D,st,st.layer);E.push({t:'reroll'});break;}
  case 'PURGE':{if(st.screen!=='rest'||!(st.kp||[]).includes('m_purge'))return fail('不能燒');const i=st.deck.findIndex(x=>x.uid===a.uid);if(i<0||D.cards[st.deck[i].id].t!=='x')return fail('只能燒詛咒');const id=st.deck[i].id;st.deck.splice(i,1);E.push({t:'purged',id});backToMap(D,st,E);break;}
  case 'EYE':{if(st.screen!=='combat'||st.ch!=='gu')return fail('沒有義眼');const c=st.combat;if(c.eyeUsed)return fail('這一場已經用過了');const e=c.enemies.find(x=>x.uid===a.uid&&x.hp>0);if(!e)return fail('沒有這個敵人');c.eyeUsed=1;e.hid=0;c.eye=e.uid;E.push({t:'eye',uid:e.uid});break;}
  case 'TEAR':{if(st.screen!=='combat')return fail('不在戰鬥中');const c=st.combat;const x=c.hand[a.i];if(!x||!D.cards[x.id].purge)return fail('這張撕不掉');if(c.energy<1)return fail('能量不夠');c.energy--;c.hand.splice(a.i,1);E.push({t:'torn',id:x.id});break;}
  case 'SEND':{if(st.screen!=='combat'||st.ch!=='cl')return fail('只有克勞德能送回');const c=st.combat;const e=c.enemies.find(x=>x.uid===a.uid&&x.hp>0);if(!e)return fail('沒有這個敵人');if(D.enemies[e.id].boss)return fail('首領不能送回');
   if(!(e.hp<e.max*sendRate(D,st)))return fail('牠還不想走');if(c.energy<1)return fail('能量不夠');
   if(pas(D,st,'window')){c.energy--;}
   else if(a.pay==='hp'){c.energy--;selfHurt(D,st,4,E,false,true);if(st.hp<=0){loseRun(D,st,E);break;}}
   else{const x=c.hand[a.pay];if(!x)return fail('要選一張手牌');c.energy--;c.hand.splice(a.pay,1);if(!x.temp)c.exh.push(strip(x));}
   e.hp=0;e.sent=1;st.stats.sent=(st.stats.sent||0)+1;E.push({t:'sent',uid:e.uid,id:e.id});if(M(st,'remember'))E.push({t:'sent',uid:e.uid,id:e.id,extra:1});
   if(M(st,'lamps')){st.flags.wh=!st.flags.wh;if(!st.flags.wh)st.wick=(st.wick==null?10:st.wick)-1;}else st.wick=(st.wick==null?10:st.wick)-1;if(st.wick<=0){st.wick=10;st.lamp=(st.lamp||0)+1;E.push({t:'lampReady'});}
   killCheck(D,st,E);break;}
  case 'LAMP':{if(st.screen!=='combat'||!(st.lamp>0))return fail('燈還沒亮');const c=st.combat;if(c.stop)return fail('這一回合已經照過了');st.lamp--;c.stop=1;E.push({t:'lampLight'});break;}
  case 'QUIT':{st.combat=null;st.screen='over';st.result={win:false,quit:true};E.push({t:'runEnd',win:false,quit:true,fourth:st.fourthN!=null?1:0,com:comOk(st)?st.com:null,ch:st.ch,origin:st.origin,ph:st.stats.ph,persona:st.persona,floors:st.stats.floors,memory:memoryOf(D,st,false)});break;}
  default:return fail('不明的指令');}
 if(!st0.combat&&st.combat){const s0=clone(st0);delete s0.pre;st.pre={s:s0,a};}
 if(!st.combat&&st.pre)delete st.pre;
 return {ok:true,state:st,events:E};}

function sendRate(D,st){return (pas(D,st,'window')?.35:.25)+(M(st,'gentle')?.05:0);}
// ── 存檔（v:2）：戰鬥中只存戰前狀態，讀檔時重跑進場那一步（同一個種子，結果一樣）
function saveForm(st){if(!st)return null;if(st.pre)return Object.assign(clone(st.pre.s),{v:2,resume:st.pre.a});return st;}
function migrateRun(D,s){if(!s)return null;s=clone(s);
 const C0=D.chars[s.ch]||{};if(s.origin===undefined)s.origin=C0.origin||null;if(s.alien==null)s.alien=0;if(s.wick==null)s.wick=10;if(s.lamp==null)s.lamp=0;s.reso=s.reso||{};s.stats.ph=s.stats.ph||{h:0,half:0,full:0};
 if((s.v||1)<2){s.v=2;s.kp=s.kp||[];s.flags=s.flags||{};
  if(s.combat){const c=s.combat,L=D.layers[s.layer]||{};const got=c.enemies.map(e=>e.id);let ids;
   if(c.kind==='boss')ids=[L.boss];else if(c.kind==='elite')ids=[got[0]];else ids=(L.fights||[]).find(set=>set.every((id,i)=>got[i]===id))||[got[0]];
   s.combat=null;startCombat(D,s,ids,c.kind);}}
 return s;}
function loadRun(D,s){s=migrateRun(D,s);if(!s)return null;if(s.resume){const a=s.resume;delete s.resume;const r=apply(D,s,a);if(r.ok)return r.state;}return s;}

// ── 永久進度（回憶、成就、圖鑑）
function newMeta(){return {v:2,memory:0,memSpent:0,echo:0,flame:0,keeper:[],desires:[],personas:[],hobbies:[],grudges:[],pages:0,letter:0,unlocked:[],ach:[],codex:{},runs:0,wins:{yy:0,cl:0},best:0,seen:[]};}
function migrateMeta(m){if(!m)return newMeta();m=clone(m);const n=newMeta();for(const k in n)if(m[k]===undefined)m[k]=n[k];m.v=2;return m;}
function echoOf(D,e){const E=D.echo||{fromMemory:1,quitRate:.5};const v=Math.floor((e.memory||0)*E.fromMemory);return e.quit?Math.floor(v*E.quitRate):v;}
function metaUnlock(D,meta0,kind,id){const meta=migrateMeta(meta0);
 if(kind==='desire'){if(meta.desires.includes(id))return {ok:false,error:'已經立過了'};if(!meta.ach.includes('boss1'))return {ok:false,error:'先打倒第一層的首領'};if(meta.echo<50)return {ok:false,error:'殘響不夠（要 50）'};meta.echo-=50;meta.desires.push(id);return {ok:true,meta};}
 if(kind==='persona'){if(meta.personas.includes(id))return {ok:false,error:'已經有了'};if(meta.memory-(meta.memSpent||0)<80)return {ok:false,error:'回憶不夠（要 80）'};meta.memSpent=(meta.memSpent||0)+80;meta.personas.push(id);return {ok:true,meta};}
 return {ok:false,error:'不明'};}
function metaBuy(D,meta0,id){const it=(D.keeper||[]).find(k=>k.id===id);if(!it)return {ok:false,error:'沒有這一項'};const meta=migrateMeta(meta0);if(meta.keeper.includes(id))return {ok:false,error:'已經有了'};if(it.need&&!meta.keeper.includes(it.need))return {ok:false,error:'要先有「'+D.keeper.find(k=>k.id===it.need).n+'」'};if(meta.echo<it.cost)return {ok:false,error:'殘響不夠'};meta.echo-=it.cost;meta.keeper.push(id);return {ok:true,meta};}
function metaApply(D,meta0,events){const meta=migrateMeta(meta0);const news={ach:[],codex:[],unlocks:[],memory:0,echo:0};
 for(const e of events){
  if(e.t==='ach'&&e.id&&!meta.ach.includes(e.id)){meta.ach.push(e.id);news.ach.push(e.id);}
  if(e.t==='kill'){if(!meta.codex[e.id])news.codex.push(e.id);meta.codex[e.id]=(meta.codex[e.id]||0)+1;if(Object.keys(meta.codex).length>=20&&!meta.ach.includes('codex20')){meta.ach.push('codex20');news.ach.push('codex20');}}
  if(e.t==='sent')meta.flame=(meta.flame||0)+1;
  if(e.t==='unlockYx')meta.yx=1;
  if(e.t==='unlockGu'){if(!meta.gu)news.gu=1;meta.gu=1;}
  if(e.t==='leftCard')meta.leftNext=e.card;
  if(e.t==='leftTaken'||e.t==='leftSkip')meta.left=null;
  if(e.t==='letter')meta.letterNext=e.n;
  if(e.t==='page')meta.pages=Math.min(9,(meta.pages||0)+1);
  if(e.t==='drop'&&!meta.hobbies.includes(e.id)){meta.hobbies.push(e.id);news.hobby=e.id;}
  if(e.t==='hobby'&&!meta.hobbies.includes(e.id)){meta.hobbies.push(e.id);news.hobby=e.id;}
  if(e.t==='runEnd'){meta.runs++;if(meta.runs>=3&&(meta.fourth||0)<9&&e.fourth)meta.fourth=(meta.fourth||0)+1;
   if(meta.leftNext){meta.left=meta.leftNext;meta.leftNext=null;}else if(meta.left){meta.left.ttl--;if(meta.left.ttl<=0)meta.left=null;}meta.letter=meta.letterNext||0;meta.letterNext=0;if(e.killer&&e.ch==='yy'&&!meta.grudges.includes(e.killer))meta.grudges.push(e.killer);meta.memory+=e.memory;news.memory=e.memory;let ec=echoOf(D,e);if(e.com){ec+=(D.comReward||15);news.com=e.com;meta.comDone=(meta.comDone||[]);if(!meta.comDone.includes(e.com))meta.comDone.push(e.com);}meta.echo+=ec;news.echo=ec;meta.com=null;
   if(e.win&&e.origin&&e.ph){const k=e.ch+'_'+e.origin;const m=Object.entries(e.ph).sort((a,b)=>b[1]-a[1])[0][0];meta.phWins=meta.phWins||{};meta.phWins[k]=meta.phWins[k]||[];if(!meta.phWins[k].includes(m))meta.phWins[k].push(m);}if(e.win)meta.wins[e.ch]=(meta.wins[e.ch]||0)+1;meta.best=Math.max(meta.best,e.floors||0);
   for(const u of D.unlocks)if(meta.memory>=u.at&&!meta.unlocked.includes(u.id)){meta.unlocked.push(u.id);news.unlocks.push(u.id);}}}
 return {meta,news};}

const API={newRun,apply,desc,cardDef,cost,needsTarget,canMove,alive,dmgCalc,newMeta,metaApply,memoryOf,pool,phaseOf,originOf,sendRate,handMax,metaUnlock,saveForm,migrateRun,loadRun,migrateMeta,metaBuy,echoOf};
if(typeof module!=='undefined')module.exports=API;else root.CARD=API;
})(this);
