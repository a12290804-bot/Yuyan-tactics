// 平衡模擬：node tests/sim.js [場數] [打法 free|hold] [隊伍,逗號分隔]
const D=require('../data.js'),C=require('../core.js');
function run(N,style,team,seedBase){let win=0,gate=0,lost=0,sol=0;const reasons={};const used={};
 for(let s=1;s<=N;s++){let st=C.createBattle(D,'MISSION_BC_001',(seedBase||7919)*s,{team});let n=0;
  while(!st.result&&n<400){n++;const ps=C.alive(st,'P').filter(u=>!u.usedAct);const a=ps.length?C.plan(D,st,ps[0],style):{type:'END_PHASE'};const r=C.apply(D,st,a);if(!r.ok)throw new Error(r.error+' '+JSON.stringify(a));if(a.act)used[a.act+(a.skill?':'+a.skill:'')+(a.form?':'+a.form:'')]=(used[a.act+(a.skill?':'+a.skill:'')+(a.form?':'+a.form:'')]||0)+1;st=r.state;}
  if(!st.result)throw new Error('no result');if(st.result.win)win++;reasons[st.result.reason]=(reasons[st.result.reason]||0)+1;gate+=st.gate.hp;lost+=st.units.filter(u=>u.faction==='P'&&u.hp<=0).length;}
 return {N,win:+(win/N).toFixed(2),gate:Math.round(gate/N),lost:+(lost/N).toFixed(2),reasons,used};}
module.exports=run;
if(require.main===module){const N=+process.argv[2]||100,style=process.argv[3]||'free',team=process.argv[4]?process.argv[4].split(','):undefined;console.log(JSON.stringify(run(N,style,team),null,1));}
