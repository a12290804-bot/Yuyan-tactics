// 35 種 7 選 4 隊伍，各跑 N 場（兩種打法）
const run=require('./sim.js');const ALL=['P_SHIELD','P_SPEAR','P_ARCHER','P_LANTERN','P_HEALER','P_WEAVER','P_SCOUT'];const N=+process.argv[2]||20;
const combos=[];for(let a=0;a<7;a++)for(let b=a+1;b<7;b++)for(let c=b+1;c<7;c++)for(let d=c+1;d<7;d++)combos.push([ALL[a],ALL[b],ALL[c],ALL[d]]);
const rows=[];for(const t of combos){const f=run(N,'free',t,101),h=run(N,'hold',t,211);rows.push({team:t.map(x=>x.slice(2)).join('+'),free:f.win,hold:h.win,lostF:f.lost,lostH:h.lost});}
rows.sort((a,b)=>(b.free+b.hold)-(a.free+a.hold));for(const r of rows)console.log(r.team.padEnd(34),'free',r.free.toFixed(2),'hold',r.hold.toFixed(2),'lost',r.lostF,r.lostH);
const avg=k=>(rows.reduce((s,r)=>s+r[k],0)/rows.length).toFixed(2);console.log('AVG free',avg('free'),'hold',avg('hold'));
const per={};for(const u of ALL){const rs=rows.filter(r=>r.team.includes(u.slice(2)));per[u]=(rs.reduce((s,r)=>s+r.free+r.hold,0)/(2*rs.length)).toFixed(2);}console.log('per unit',per);
