// 平衡模擬：node tests/sim.js [局數] [角色 yy|cl]
const D=require('../data.js'),C=require('../core.js');
const N=+process.argv[2]||100,CH=process.argv[3]||'yy',OR=(process.argv[4]&&process.argv[4]!=='-')?process.argv[4]:undefined,CHAP=+process.argv[5]||1;
function incoming(st){const c=st.combat;let s=0;for(const e of C.alive(c)){const m=e.intent;if(m.a){const am=(D.enemies[e.id].boss||D.enemies[e.id].elite)?1:(D.layers[st.layer].atkMul||1);s+=C.dmgCalc(Math.round(m.a*am),e,c)*(m.h||1);}}return s;}
function score(st,card){const d=C.cardDef(D,card);let s=0;const inc=incoming(st)-st.combat.block;
 for(const f of d.fx){if(f[0]==='d')s+=f[1]*(f[2]||1)+(f[3]&&f[3].startsWith('ink')?st.combat.ink*+f[3].slice(3):0);if(f[0]==='da')s+=f[1]*(f[2]||1)*C.alive(st.combat).length*.8;if(f[0]==='b')s+=inc>0?Math.min(f[1],inc)*1.3:f[1]*.2;if(f[0]==='dr')s+=3*f[1];if(f[0]==='pw')s+=st.combat.turn<3?20:4;if(f[0]==='pa')s+=f[1]*2.2;if(f[0]==='jd')s+=(C.alive(st.combat).reduce((a,e)=>Math.max(a,e.st.pact||0),0))*f[1];if(f[0]==='st')s+=5;if(f[0]==='ink')s+=f[1]*2;if(f[0]==='en'||f[0]==='ep')s+=4;if(f[0]==='hp')s+=st.hp<st.maxHp*.6?f[1]:1;if(f[0]==='cp'||f[0]==='rw')s+=4;if(f[0]==='px2')s+=8;}
 if(d.fx.some(f=>f[3]&&f[3].startsWith('ink'))&&st.combat.ink<2)s*=.5;
 return s/Math.max(.6,C.cost(D,card));}
function evalSt(st){if(st.screen!=='combat')return st.screen==='over'?-1e6:1e5+st.hp*10;const c=st.combat;const a=C.alive(c);
 const inc=Math.max(0,incoming(st)-c.block);let v=-a.reduce((s,e)=>s+e.hp+e.block*.5,0)*1.0-inc*1.6;v+=c.enemies.filter(e=>e.hp<=0).length*60;
 for(const e of a){v+=(e.st.pact||0)*(2+(e.intent.a?1:0));v+=(e.st.vuln||0)*3+(e.st.weak||0)*(e.intent.a?3:1);if(e.st.link)v+=2;}
 v+=Math.min(c.ink,5)*2.2+(c.st.str||0)*6+c.energy*.1;for(const k in c.pw)v+=c.pw[k]*14;v+=c.hand.length*1.5;v+=st.hp*0.05;return v;}
function combatTurn(get,A){let st=get();for(let g=0;g<20&&st.screen==='combat';g++){st=get();if(st.screen!=='combat')break;const c=st.combat;let best=null,bv=evalSt(st);
  c.hand.forEach((card,i)=>{const k=C.cost(D,card);if(k<0||k>c.energy)return;const tgs=C.needsTarget(D,card)?C.alive(c):[null];for(const t of tgs){const r=C.apply(D,st,{type:'PLAY',i,target:t&&t.uid});if(!r.ok)continue;const v=evalSt(r.state)-(k===0?0:.5);if(v>bv){bv=v;best={i,t};}}});
  if(st.ch==='cl'&&c.energy>=1&&st.hp>24){const e=C.alive(c).find(e=>!D.enemies[e.id].boss&&e.hp<e.max*C.sendRate(D,st)&&e.hp>7);if(e&&A({type:'SEND',uid:e.uid,pay:'hp'})){st=get();continue;}}
  {const ti=c.hand.findIndex(x=>D.cards[x.id].purge);if(ti>=0&&c.energy>=1&&c.hand.some(x=>D.cards[x.id].t==='a')){A({type:'TEAR',i:ti});st=get();continue;}}
  if(st.lamp>0&&!c.stop&&incoming(st)-c.block>14){A({type:'LAMP'});st=get();}
  if(!best)break;if(!A({type:'PLAY',i:best.i,target:best.t&&best.t.uid}))break;st=get();}
 if(get().screen==='combat'){if(process.env.DBG){const s=get();console.log('T',s.combat.turn,'hp',s.hp,'blk',s.combat.block,s.combat.enemies.map(e=>e.id+':'+e.hp+':'+JSON.stringify(e.intent).slice(0,60)).join(' '));}A({type:'END_TURN'});}}
const TL=k=>Object.values(D[k]).filter(t=>t.v15&&t.ch===CH).map(t=>t.id);const TP=TL('personas'),TD=TL('desires'),TH=TL('hobbies');
function play(seed){const tg=process.env.TAG?{persona:TP[seed%TP.length],desire:TD[(seed>>3)%TD.length],hobby:TH[(seed>>5)%TH.length]}:{};let st=C.newRun(D,seed,CH,{unlocked:[],pol:{yy:+(process.env.POL||0),cl:+(process.env.POL||0)}},Object.assign({origin:OR,chapter:CHAP,short:process.env.SHORT?1:0},tg));const A=a=>{const r=C.apply(D,st,a);if(r.ok){st=r.state;return true;}return false;};if(st.screen==='prep'){if(st.prep.relics)A({type:'PREP_RELIC',i:0});if(st.prep.cards)A({type:'PREP_CARD',i:0});A({type:'PREP_DONE'});}
 for(let g=0;g<3000&&st.screen!=='over';g++){
  const s=st.screen;if(s==='chask'){A({type:process.env.CONT?'CH_CONT':'CH_END'});continue;}
  if(s==='map'){const map=st.maps[st.layer];if(st.row===D.map.rows-1){A({type:'MOVE',c:'boss'});st.__last='boss';continue;}
   const opts=st.row===-1?Array.from({length:D.map.cols},(_,i)=>i):map.rows[st.row][st.col].e;const nr=st.row+1;
   const pref=t=>({fight:3,elite:st.hp>st.maxHp*.8?2:-3,rest:st.hp<st.maxHp*.7?6:1,shop:st.gold>120?4:0,event:2,chest:5,mystery:2,altar:2}[t]||1);
   const c=opts.slice().sort((a,b)=>pref(map.rows[nr][b].t)-pref(map.rows[nr][a].t))[0];st.__last=map.rows[nr][c].t;A({type:'MOVE',c});st.__last=map.rows[nr][c].t;}
  else if(s==='combat'){combatTurn(()=>st,A);if(st.screen!=='combat'&&process.env.TR)console.log('  after',st.__last,'hp',st.hp,'deck',st.deck.length);}
  else if(s==='reward'){if(st.reward.relicChoice)A({type:'PICK_RELIC',i:0});if(!st.reward.cardTaken){const cs=st.reward.cards;const i=cs.findIndex(id=>D.cards[id].r>=2);if(i>=0&&st.deck.length<26)A({type:'PICK_CARD',i});else if(cs.length&&st.deck.length<20)A({type:'PICK_CARD',i:0});else A({type:'SKIP_CARD'});}A({type:'LEAVE'});}
  else if(s==='rest'){if(st.hp<st.maxHp*.7)A({type:'REST'});else{const c=st.deck.find(x=>!x.up&&D.cards[x.id].u&&D.cards[x.id].r>=1)||st.deck.find(x=>!x.up&&D.cards[x.id].u);if(!c||!A({type:'SMITH',uid:c.uid}))A({type:'REST'});}}
  else if(s==='shop'){const sh=st.shop;sh.cards.forEach((it,i)=>{if(D.cards[it.id].r>=2&&st.gold>=it.price+20)A({type:'BUY_CARD',i});});sh.relics.forEach((it,i)=>{if(st.gold>=it.price)A({type:'BUY_RELIC',i});});const st0=st.deck.find(x=>x.id==='strike');if(st0&&st.gold>=sh.removeCost)A({type:'REMOVE',uid:st0.uid});A({type:'LEAVE'});}
  else if(s==='event'){if(!st.event.done){const ev=D.events.find(e=>e.id===st.event.id);let i=ev.opts.findIndex(o=>!(o.need&&st.gold<o.need.gold));A({type:'EVENT',i});}
   if(st.pick){if(st.pick.mode==='choose')A({type:'CHOOSE',i:0});else if(st.pick.mode==='remove'){const c=st.deck.find(x=>x.id==='x_regret')||st.deck.find(x=>x.id==='strike')||st.deck.find(x=>!D.cards[x.id].noRemove);A({type:'REMOVE',uid:c.uid});}else{const c=st.deck.find(x=>x.id==='strike')||st.deck.find(x=>!D.cards[x.id].noRemove);A({type:'TRANSFORM',uid:c.uid});}}
   A({type:'LEAVE'});}
  else if(s==='chest')A({type:'LEAVE'});}
 return st;}
let W=0;const fl=[],where={};for(let s=1;s<=N;s++){const st=play(s*104729);if(st.result&&st.result.win)W++;fl.push(st.stats.floors);const k=st.result&&st.result.win?'贏':('第'+(st.layer+1)+'層'+st.__last+(process.env.WHO&&st.combat?':'+st.combat.enemies.map(e=>e.id).join('+'):''));where[k]=(where[k]||0)+1;}
console.log(`${D.chars[CH].name}${OR?'・'+OR:''}${CHAP>1?'（第'+CHAP+'章）':''} ${N} 局：贏 ${W}（${Math.round(W/N*100)}%）平均走到第 ${(fl.reduce((a,b)=>a+b,0)/N).toFixed(1)} 步`,JSON.stringify(where));
