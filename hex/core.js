// 燈火邊境 —— 規則核心（純函式、可重播）
(function(root){
'use strict';
const DIRS=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
const key=(q,r)=>q+','+r;
const dist=(a,b)=>(Math.abs(a.q-b.q)+Math.abs(a.r-b.r)+Math.abs(a.q+a.r-b.q-b.r))/2;
function hash(){let h=2166136261>>>0;for(const a of arguments){const s=String(a);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}h^=124;h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function rng(...salt){let a=hash(...salt);return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function pickW(list,r){let tot=0;for(const x of list)tot+=x.w;let v=r()*tot;for(const x of list){v-=x.w;if(v<0)return x;}return list[list.length-1];}
const clone=o=>JSON.parse(JSON.stringify(o));

function cellsIn(R){const out=[];for(let q=-R;q<=R;q++)for(let r=Math.max(-R,-q-R);r<=Math.min(R,-q+R);r++)out.push({q,r});return out;}
function nb(st,c){const out=[];for(const [dq,dr] of DIRS){const n=st.cells[key(c.q+dq,c.r+dr)];if(n)out.push(n);}return out;}
function ring(st,c,rad){return Object.values(st.cells).filter(x=>dist(x,c)<=rad);}

function newGame(D,seed){
 seed=seed>>>0||1;const R=D.radius;const r=rng(seed,'map');
 const st={v:1,seed,day:1,res:clone(D.start),cells:{},members:[],log:[],result:null,recruited:[],stats:{built:0,purified:0,explored:0}};
 const tw=Object.entries(D.terrainWeight).map(([t,w])=>({t,w}));
 for(const p of cellsIn(R)){const d=dist(p,{q:0,r:0});let t;
  if(d===0)t='town';
  else if(d===1)t=['plain','forest','plain','hill','plain','swamp'][(DIRS.findIndex(([a,b])=>a===p.q&&b===p.r)+Math.floor(r()*6))%6];
  else t=pickW(tw,r).t;
  if(d<=2&&t==='water')t='plain';
  st.cells[key(p.q,p.r)]={q:p.q,r:p.r,t,rev:d<=2,taint:0,b:null};}
 // 確保第 1 圈有農地、林地、礦脈、油沼
 const r1=nb(st,{q:0,r:0});for(const t of ['plain','forest','hill','swamp']){if(r1.some(c=>c.t===t))continue;const cnt={};r1.forEach(c=>cnt[c.t]=(cnt[c.t]||0)+1);const dup=r1.find(c=>cnt[c.t]>1);if(dup)dup.t=t;}
 // 污染巢：最外圈、相隔 120 度
 const off=Math.floor(r()*6);const corners=[[R,0],[R,-R],[0,-R],[-R,0],[-R,R],[0,R]];
 for(let i=0;i<D.nest.count;i++){const [q,rr]=corners[(off+i*2)%6];const c=st.cells[key(q,rr)];c.t='nest';c.nest=D.nest.hp;c.taint=3;for(const n of nb(st,c))if(n.t!=='water')n.taint=Math.max(n.taint,1);}
 for(const id of D.startTeam)addMember(D,st,id);
 st.log.push({day:1,txt:'南門外的燈還亮著。往外，是迷霧和污染。'});
 return st;
}
function addMember(D,st,id){const h=D.heroes[id];st.members.push({id,name:h.name,stam:D.maxStam,task:null});}
function cap(D,st){let c=D.town.cap;for(const x of Object.values(st.cells))if(x.b&&!x.taint)c+=(D.buildings[x.b].cap||0);return c;}
function owned(c){return c.t==='town'||!!c.b;}
function costOf(D,st,b){const n=Object.values(st.cells).filter(c=>c.b===b).length;const o={};for(const [k,v] of Object.entries(D.buildings[b].cost))o[k]=Math.ceil(v*(1+D.costGrow*n));return o;}
function canPay(res,cost){return Object.entries(cost).every(([k,v])=>(res[k]||0)>=v);}
function pay(res,cost){for(const [k,v] of Object.entries(cost))res[k]-=v;}
function gain(res,g,mult){for(const [k,v] of Object.entries(g||{}))res[k]=(res[k]||0)+v*(mult||1);}

// ── 照明／結界／守夜：今晚哪些格子污染進不來
function protectedSet(D,st,useOil){const P=new Set();const lit=new Set();
 let oil=st.res.oil;
 for(const c of Object.values(st.cells)){
  if(c.t==='town')for(const x of ring(st,c,D.town.light))lit.add(key(x.q,x.r));
  if(!c.b||c.taint)continue;const B=D.buildings[c.b];
  if(B.light){if(oil>=B.oilUse){oil-=B.oilUse;for(const x of ring(st,c,B.light))lit.add(key(x.q,x.r));}}
  if(B.ward)for(const x of ring(st,c,B.ward))P.add(key(x.q,x.r));}
 for(const m of st.members)if(m.task&&m.task.type==='guard'){const c=st.cells[m.task.cell];for(const x of ring(st,c,1))P.add(key(x.q,x.r));}
 if(useOil)st.res.oil=oil;
 return {P,lit,oilLeft:oil};}

// ── 可以做的事
function buildOptions(D,st,k){const c=st.cells[k];if(!c||!c.rev||c.b||c.taint||c.t==='nest')return [];
 if(!nb(st,c).some(owned))return [];
 return Object.entries(D.buildings).filter(([,B])=>B.on.includes(c.t)).map(([id,B])=>{const cost=costOf(D,st,id);return {id,B,cost,ok:canPay(st.res,cost)};});}
function taskOptions(D,st,k){const c=st.cells[k];if(!c)return [];const o=[];
 if(!c.rev){if(nb(st,c).some(n=>n.rev&&D.terrain[n.t].walk))o.push('explore');return o;}
 if(!D.terrain[c.t].walk)return o;
 if(c.taint||c.nest)o.push('purify');
 if(!c.taint&&D.terrain[c.t].gather&&!c.b)o.push('gather');
 if(!c.taint&&c.t!=='nest')o.push('guard');
 return o;}
function busy(st,k){return st.members.filter(m=>m.task&&m.task.cell===k);}

function apply(D,st0,a){const st=clone(st0);if(st.result)return {ok:false,error:'遊戲已結束'};
 const E=[];const fail=e=>({ok:false,error:e});
 if(a.type==='BUILD'){const c=st.cells[a.cell];const opt=buildOptions(D,st,a.cell).find(o=>o.id===a.b);if(!opt)return fail('這裡不能蓋');if(!opt.ok)return fail('資源不夠');
  if(busy(st,a.cell).some(m=>m.task.type==='gather'))return fail('有人正在這裡採集');
  pay(st.res,opt.cost);c.b=a.b;st.stats.built++;E.push({t:'build',cell:a.cell,b:a.b});}
 else if(a.type==='DEMOLISH'){const c=st.cells[a.cell];if(!c||!c.b)return fail('沒有建築');c.b=null;E.push({t:'demolish',cell:a.cell});}
 else if(a.type==='ASSIGN'){const m=st.members.find(x=>x.id===a.m);if(!m)return fail('沒有這位成員');
  if(m.task)return fail('已經有工作了');if(m.stam<1)return fail('太累了，今天要休息');
  if(!taskOptions(D,st,a.cell).includes(a.task))return fail('這裡不能做這件事');
  m.task={type:a.task,cell:a.cell};m.stam-=1;E.push({t:'assign',m:a.m,task:a.task,cell:a.cell});}
 else if(a.type==='UNASSIGN'){const m=st.members.find(x=>x.id===a.m);if(!m||!m.task)return fail('沒有工作');m.task=null;m.stam+=1;}
 else if(a.type==='RECRUIT'){if(!st.pending||!st.pending.length)return fail('沒有人在等');const id=a.id||st.pending[0];
  if(st.members.length>=cap(D,st))return fail('住不下了，先蓋宿舍');if(!canPay(st.res,D.recruitCost))return fail('補給不夠，招待不了新成員');pay(st.res,D.recruitCost);st.pending=st.pending.filter(x=>x!==id);addMember(D,st,id);E.push({t:'recruit',id});}
 else if(a.type==='END_DAY'){endDay(D,st,E);}
 else return fail('不明的指令');
 return {ok:true,state:st,events:E};}

function endDay(D,st,E){const r=rng(st.seed,'night',st.day);const rep={day:st.day,lines:[],gain:{},lost:[],newTaint:[],found:[]};
 const H=id=>D.heroes[id];
 // 1) 白天的工作
 for(const m of st.members){if(!m.task)continue;const c=st.cells[m.task.cell];const s=H(m.id)[D.tasks[m.task.type].stat];
  if(m.task.type==='explore'){const rad=s>=3?1:0;const rv=[c,...(rad?nb(st,c):[])];let n=0;for(const x of rv)if(!x.rev){x.rev=true;n++;}st.stats.explored+=n;
   rep.lines.push(`${m.name}探索了${D.terrain[c.t].name}${n>1?'一帶':''}。`);
   if(c.t==='ruins'&&!c.looted){c.looted=true;const f=pickW(D.finds,r);if(f.recruit){const pool=Object.keys(D.heroes).filter(id=>!st.members.some(x=>x.id===id)&&!(st.pending||[]).includes(id));if(pool.length){const id=pool[Math.floor(r()*pool.length)];st.pending=(st.pending||[]).concat(id);rep.found.push(`${f.txt}是${H(id).name}。`);}else{gain(st.res,{coin:2});rep.found.push('廢墟裡只剩幾枚渡鴉幣。');}}else{gain(st.res,f.gain);gain(rep.gain,f.gain);rep.found.push(f.txt);}}}
  else if(m.task.type==='purify'){if(c.nest){c.nest=Math.max(0,c.nest-s);if(c.nest===0){c.t='ruins';c.taint=0;c.looted=false;delete c.nest;st.stats.purified++;rep.lines.push(`${m.name}拔除了一座污染巢！`);E.push({t:'nestDown',cell:key(c.q,c.r)});gain(st.res,{coin:3});gain(rep.gain,{coin:3});}else rep.lines.push(`${m.name}削弱了污染巢（還剩 ${c.nest}）。`);}
   else{const before=c.taint;c.taint=Math.max(0,c.taint-s);if(before&&!c.taint)st.stats.purified++;rep.lines.push(`${m.name}淨化了${D.terrain[c.t].name}${c.taint?'，還沒洗乾淨':''}。`);}}
  else if(m.task.type==='gather'){const g=D.terrain[c.t].gather;const mult=1+(s-1)*.5;const got={};for(const [k,v] of Object.entries(g))got[k]=Math.floor(v*mult);gain(st.res,got);gain(rep.gain,got);rep.lines.push(`${m.name}從${D.terrain[c.t].name}帶回了東西。`);}
  else if(m.task.type==='guard'){rep.lines.push(`${m.name}今晚守在${D.terrain[c.t].name}。`);}}
 // 2) 產出
 const out={};const tw=D.town.out;gain(out,tw);
 for(const c of Object.values(st.cells)){if(!c.b||c.taint)continue;const B=D.buildings[c.b];if(!B.out)continue;gain(out,B.out);
  if(B.adj){const n=Math.min(B.adj.max,nb(st,c).filter(x=>x.b===c.b&&!x.taint).length);const k=Object.keys(B.adj).find(x=>x!=='max');out[k]=(out[k]||0)+n*B.adj[k];}}
 gain(st.res,out);gain(rep.gain,out);
 // 3) 吃飯
 const eat=st.members.length*D.foodPerMember;let hungry=false;if(st.res.food>=eat)st.res.food-=eat;else{st.res.food=0;hungry=true;rep.lines.push('補給不夠，大家餓著肚子睡了，體力沒有恢復。');}
 rep.eat=eat;
 // 4) 夜晚：燈油、污染擴散
 const oil0=st.res.oil;const {P,lit}=protectedSet(D,st,true);rep.oilUsed=oil0-st.res.oil;
 const calm=st.calm;st.calm=false;
 const p=Math.min(D.spread.cap,D.spread.base+D.spread.perDay*st.day)*(calm?.4:1);
 const src=Object.values(st.cells).filter(c=>c.taint>0);const add=[];
 for(const c of src){const k=key(c.q,c.r);
  // 被照到、被守住的污染會慢慢退
  if((P.has(k)||lit.has(k))&&!c.nest){c.taint=Math.max(0,c.taint-1);continue;}
  const pc=c.nest?Math.min(.9,p*D.spread.nestMult):p*(.6+.2*c.taint);
  for(const n of nb(st,c)){const nk=key(n.q,n.r);if(n.taint||n.t==='water'||P.has(nk))continue;if(r()<pc*(lit.has(nk)?D.spread.litMult:1))add.push(n);}
  if(!c.nest&&c.taint<3&&r()<D.spread.grow)c.taint++;}
 for(const n of add)if(!n.taint){n.taint=1;rep.newTaint.push(key(n.q,n.r));}
 // 5) 被污染吞沒
 for(const c of Object.values(st.cells)){if(c.b&&c.taint>=3){rep.lost.push(`${D.buildings[c.b].name}被污染吞沒了。`);c.b=null;c.t=c.t==='town'?'town':'ruins';c.looted=true;}}
 for(const k of rep.newTaint){const c=st.cells[k];if(c.b)rep.lost.push(`${D.buildings[c.b].name}被污染波及，暫時停工。`);}
 const town=Object.values(st.cells).find(c=>c.t==='town');
 // 6) 恢復體力
 let rest=0;for(const c of Object.values(st.cells))if(c.b&&!c.taint)rest+=D.buildings[c.b].rest||0;rest=Math.min(2,rest);
 for(const m of st.members){const worked=!!m.task;m.task=null;if(!hungry)m.stam=Math.min(D.maxStam,m.stam+(worked?1:2)+rest);}
 // 7) 勝負
 const nests=Object.values(st.cells).filter(c=>c.nest).length;
 if(town.taint>0){st.result={win:false,txt:'污染漫進了南門。燈，熄了。'};}
 else if(nests===0){st.result={win:true,txt:'三座污染巢都拔除了。南門外的路，又能走了。'};}
 st.day++;
 // 8) 早上的小事
 if(!st.result){const r2=rng(st.seed,'morning',st.day);const ev=pickW(D.morning,r2);if(ev.txt){rep.morning=ev.txt;if(ev.gain){gain(st.res,ev.gain);gain(rep.gain,ev.gain);}if(ev.calm)st.calm=true;}}
 st.lastReport=rep;st.log.push({day:rep.day,txt:rep.lines.concat(rep.found,rep.lost).join(' ')});if(st.log.length>40)st.log.shift();
 E.push({t:'night',rep});}

function forecast(D,st){const {P,lit}=protectedSet(D,st,false);let need=0;for(const c of Object.values(st.cells))if(c.b&&!c.taint&&D.buildings[c.b].light)need+=D.buildings[c.b].oilUse;
 const front=new Set();for(const c of Object.values(st.cells))if(c.taint>0)for(const n of nb(st,c))if(n.rev&&!n.taint&&n.t!=='water'&&!P.has(key(n.q,n.r)))front.add(key(n.q,n.r));
 return {P,lit,front,oilNeed:need,oilShort:need>st.res.oil,eat:st.members.length*D.foodPerMember};}

const API={costOf,key,dist,DIRS,newGame,apply,buildOptions,taskOptions,protectedSet,forecast,cap,nb:(st,c)=>nb(st,c),canPay,busy};
if(typeof module!=='undefined')module.exports=API;else root.HEX=API;
})(this);
