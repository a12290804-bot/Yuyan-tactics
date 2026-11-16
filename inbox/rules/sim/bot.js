const path=require('path').join(__dirname,'../../../hex/')+'/';
const C=require(process.env.CORE||path+'core.js');const D0=require(path+'data.js');
function inc(st){const c=st.combat;if(!c)return 0;let s=0;for(const e of c.enemies){if(e.hp<=0||!e.intent)continue;const m=e.intent;if(m.a)s+=C.dmgCalc(m.a,e,c)*(m.h||1);}return s;}
function score(st,hp0){if(st.screen==='over')return st.result&&st.result.win?1e6:-1e6;if(st.screen!=='combat')return 1e5+st.hp*10;const c=st.combat;let eh=0,n=0;for(const e of c.enemies)if(e.hp>0){eh+=e.hp+e.block*0.5;n++;}const I=inc(st);const blk=Math.min(c.block,I);return -eh-n*8+blk*1.3+st.hp*1.5-(st.alien||0)*0.05;}
function combatTurn(D,st){for(let k=0;k<30;k++){const c=st.combat;if(!c||st.screen!=='combat')return st;let best=null,bs=score(st)-0.01;
 for(let i=0;i<c.hand.length;i++){const tg=c.enemies.filter(e=>e.hp>0);const ts=C.needsTarget(D,c.hand[i])?tg.map(e=>e.uid):[undefined];for(const t of ts){const r=C.apply(D,st,{type:'PLAY',i,target:t});if(!r.ok)continue;const s=score(r.state||r.st||r.s);if(s>bs){bs=s;best=r;}}}
 if(!best)break;st=best.state||best.st||best.s;}
 if(st.screen==='combat'){const r=C.apply(D,st,{type:'END_TURN'});if(r.ok)st=r.state||r.st||r.s;else throw new Error('endturn '+r.error);}return st;}
function A(D,st,a){const r=C.apply(D,st,a);return r.ok?(r.state||r.st||r.s):null;}
function step(D,st,rng){switch(st.screen){
 case 'combat':return combatTurn(D,st);
 case 'map':{if(st.row>=D.map.rows-1)return A(D,st,{type:'MOVE',c:'boss'});const map=st.maps[st.layer];const opts=[];for(let c=0;c<D.map.cols;c++)if(C.canMove(D,st,c))opts.push(c);const row=map.rows[st.row+1];const pr=t=>{const lo=st.hp<st.maxHp*.5;return ({rest:lo?9:2,fight:lo?2:5,elite:lo?0:(st.hp>st.maxHp*.8?6:3),event:4,shop:3,chest:5,mystery:4,altar:3})[t]??3;};opts.sort((a,b)=>pr(row[b].t)-pr(row[a].t));return A(D,st,{type:'MOVE',c:opts[0]});}
 case 'reward':{const R=st.reward;if(R.relicChoice)return A(D,st,{type:'PICK_RELIC',i:0});if(!R.cardTaken&&R.cards&&R.cards.length&&st.deck.length<26){let bi=0,bv=-1;R.cards.forEach((id,i)=>{const d=D.cards[id];let v=(d.r||1)*2+(d.bl&&d.bl===st.origin?3:0)+(d.t==='a'?1:0);if(v>bv){bv=v;bi=i;}});return A(D,st,{type:'PICK_CARD',i:bi});}return A(D,st,{type:'LEAVE'});}
 case 'rest':{if(st.hp<st.maxHp*.7){const r=A(D,st,{type:'REST'});if(r)return r;}const c=st.deck.find(x=>!x.up&&D.cards[x.id].u&&D.cards[x.id].t!=='x');if(c){const r=A(D,st,{type:'SMITH',uid:c.uid});if(r)return r;}return A(D,st,{type:'REST'})||A(D,st,{type:'LEAVE'});}
 case 'event':{if(st.pick){const p=st.pick;const x=st.deck.find(z=>D.cards[z.id].t==='x')||st.deck.find(z=>/strike|atk|射擊/.test(z.id))||st.deck[0];if(p.mode==='remove')return A(D,st,{type:'REMOVE',uid:x.uid})||A(D,st,{type:'LEAVE'});if(p.mode==='transform')return A(D,st,{type:'TRANSFORM',uid:x.uid});if(p.mode==='choose')return A(D,st,{type:'CHOOSE',i:0});}if(!st.event.done){for(let i=0;i<4;i++){const r=A(D,st,{type:'EVENT',i});if(r)return r;}}return A(D,st,{type:'LEAVE'});}
 case 'shop':{if(st.pick&&st.pick.mode==='remove'){}
  const x=st.deck.find(z=>D.cards[z.id].t==='x');if(x&&!st.shop.removed&&st.gold>=st.shop.removeCost){const r=A(D,st,{type:'REMOVE',uid:x.uid});if(r)return r;}
  const ri=st.shop.relics.findIndex(r=>!r.sold&&r.price<=st.gold);if(ri>=0){const r=A(D,st,{type:'BUY_RELIC',i:ri});if(r)return r;}
  return A(D,st,{type:'LEAVE'});}
 case 'chest':return A(D,st,{type:'LEAVE'});
 case 'prep':{if(st.prep.relics)return A(D,st,{type:'PREP_RELIC',i:0});if(st.prep.cards)return A(D,st,{type:'PREP_CARD',i:0});return A(D,st,{type:'PREP_DONE'});}
 case 'chask':return A(D,st,{type:'CH_END'});
 default:{if(st.pick){const x=st.deck[0];return A(D,st,{type:'CHOOSE',i:0})||A(D,st,{type:'REMOVE',uid:x.uid})||A(D,st,{type:'TRANSFORM',uid:x.uid});}return A(D,st,{type:'LEAVE'});}
}}
function run(D,seed,ch,meta,opt){let st=C.newRun(D,seed,ch,meta,opt);if(st.state)st=st.state;for(let k=0;k<4000;k++){if(st.screen==='over')return {win:!!(st.result&&st.result.win),layer:st.layer,hp:st.hp,floors:st.stats.floors};const n=step(D,st);if(!n)return {win:false,stuck:st.screen,layer:st.layer,err:1};st=n;}return {win:false,stuck:'loop',layer:st.layer};}
module.exports={run,C,D0};
if(require.main===module){const [ch='yy',origin,N=40]=process.argv.slice(2);const meta=C.newMeta?C.newMeta():null;let w=0;const L={};const st={};for(let s=1;s<=+N;s++){let r;try{r=run(D0,s*7919,ch,meta,{origin:origin||undefined});}catch(e){r={win:false,err:e.message.slice(0,60)};}if(r.win)w++;else{L[r.layer]=(L[r.layer]||0)+1;if(r.err||r.stuck)st[r.stuck||r.err]=(st[r.stuck||r.err]||0)+1;}}console.log(ch,origin||'-','win',w+'/'+N,'deathLayer',JSON.stringify(L),'stuck',JSON.stringify(st));}
