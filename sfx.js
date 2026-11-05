// 《永生戰棋》音效：全部用程式即時合成，不需要音檔。
(function(root){
'use strict';
let ctx=null,master=null,on=true;
try{on=localStorage.getItem('yyt_sfx')!=='0';}catch(e){}
function ac(){if(!ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;ctx=new A();master=ctx.createGain();master.gain.value=.55;master.connect(ctx.destination);}if(ctx.state==='suspended')ctx.resume();return ctx;}
function noiseBuf(c,dur){const n=Math.floor(c.sampleRate*dur);const b=c.createBuffer(1,n,c.sampleRate);const d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return b;}
function env(g,t,a,peak,d){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+d);}
function noise(o){const c=ac();if(!c)return;const t=c.currentTime+(o.at||0);const s=c.createBufferSource();s.buffer=noiseBuf(c,o.dur+.05);const f=c.createBiquadFilter();f.type=o.type||'lowpass';f.frequency.setValueAtTime(o.f0||1200,t);if(o.f1)f.frequency.exponentialRampToValueAtTime(o.f1,t+o.dur);f.Q.value=o.q||.8;const g=c.createGain();env(g,t,o.a||.005,o.v||.5,o.dur);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+o.dur+.06);}
function tone(o){const c=ac();if(!c)return;const t=c.currentTime+(o.at||0);const s=c.createOscillator();s.type=o.wave||'sine';s.frequency.setValueAtTime(o.f0,t);if(o.f1)s.frequency.exponentialRampToValueAtTime(o.f1,t+o.dur);const g=c.createGain();env(g,t,o.a||.01,o.v||.3,o.dur);s.connect(g);g.connect(master);s.start(t);s.stop(t+o.a+o.dur+.05);}
const LIB={
 click:()=>tone({f0:880,f1:660,dur:.06,v:.12,wave:'triangle'}),
 move:()=>{noise({f0:500,dur:.07,v:.18});noise({f0:420,dur:.07,v:.15,at:.11});},
 slash:()=>{noise({type:'bandpass',f0:3200,f1:900,dur:.16,v:.5,q:1.2});noise({f0:300,dur:.12,v:.35,at:.05});},
 pierce:()=>{noise({type:'highpass',f0:2500,f1:5000,dur:.12,v:.4});tone({f0:300,f1:120,dur:.12,v:.2,wave:'square',at:.04});},
 arrow:()=>{noise({type:'bandpass',f0:5000,f1:1500,dur:.22,v:.3,q:3});noise({f0:600,dur:.06,v:.35,at:.22});},
 magic:()=>{tone({f0:300,f1:900,dur:.25,v:.2,wave:'sawtooth'});tone({f0:600,f1:1500,dur:.25,v:.1});noise({type:'bandpass',f0:1800,dur:.25,v:.15,q:4});},
 hit:()=>{noise({f0:900,f1:200,dur:.14,v:.55});tone({f0:140,f1:60,dur:.14,v:.35,wave:'triangle'});},
 crit:()=>{noise({f0:1600,f1:200,dur:.22,v:.7});tone({f0:90,f1:40,dur:.3,v:.5,wave:'triangle'});tone({f0:1760,dur:.18,v:.12,at:.03});},
 miss:()=>noise({type:'bandpass',f0:2600,f1:600,dur:.2,v:.22,q:2}),
 guard:()=>{tone({f0:520,dur:.25,v:.18,wave:'square'});tone({f0:780,dur:.3,v:.12,wave:'square',at:.02});noise({type:'highpass',f0:3000,dur:.15,v:.2});},
 heal:()=>[0,.08,.16,.24].forEach((at,i)=>tone({f0:[523,659,784,1046][i],dur:.35,v:.12,at})),
 bind:()=>{tone({f0:220,f1:440,dur:.3,v:.15,wave:'triangle'});noise({type:'bandpass',f0:1200,f1:2400,dur:.3,v:.12,q:6});},
 shadow:()=>{noise({type:'bandpass',f0:800,f1:3000,dur:.25,v:.25,q:1});tone({f0:200,f1:100,dur:.25,v:.12});},
 mark:()=>{tone({f0:1200,dur:.12,v:.15,wave:'square'});tone({f0:1600,dur:.12,v:.12,wave:'square',at:.1});},
 lamp:()=>{tone({f0:392,dur:.6,v:.14});tone({f0:587,dur:.6,v:.1,at:.05});tone({f0:784,dur:.7,v:.08,at:.1});},
 form:()=>{noise({f0:700,dur:.08,v:.25});noise({f0:700,dur:.08,v:.25,at:.12});tone({f0:330,dur:.15,v:.1,wave:'square',at:.12});},
 down:()=>{noise({f0:400,f1:80,dur:.5,v:.45});tone({f0:110,f1:45,dur:.5,v:.3,wave:'triangle'});},
 corrupt:()=>{tone({f0:70,f1:50,dur:.9,v:.3,wave:'sawtooth'});noise({f0:300,f1:120,dur:.9,v:.15});},
 purify:()=>{tone({f0:1046,dur:.8,v:.12});tone({f0:1568,dur:.8,v:.08,at:.06});noise({type:'highpass',f0:4000,dur:.4,v:.08});},
 spawn:()=>{tone({f0:55,dur:1.2,v:.35,wave:'sawtooth'});tone({f0:82,dur:1.2,v:.2,wave:'sawtooth',at:.1});noise({f0:200,dur:1,v:.2});},
 turn:()=>{tone({f0:220,dur:.25,v:.15,wave:'triangle'});tone({f0:330,dur:.3,v:.12,wave:'triangle',at:.12});},
 win:()=>[0,.15,.3,.5].forEach((at,i)=>tone({f0:[392,494,587,784][i],dur:.6,v:.16,wave:'triangle',at})),
 lose:()=>[0,.25,.5].forEach((at,i)=>tone({f0:[294,247,196][i],dur:.7,v:.16,wave:'triangle',at})),
 gacha:()=>{tone({f0:200,f1:800,dur:.8,v:.12,wave:'sawtooth'});noise({type:'bandpass',f0:500,f1:3000,dur:.8,v:.12,q:2});},
 r1:()=>[0,.1].forEach((at,i)=>tone({f0:[659,988][i],dur:.5,v:.14,at})),
 r2:()=>{[0,.1,.2,.3,.45].forEach((at,i)=>tone({f0:[523,659,784,1046,1318][i],dur:.9,v:.14,at,wave:'triangle'}));tone({f0:65,dur:1.4,v:.2,wave:'sawtooth'});}
};
function play(k){if(!on)return;try{const f=LIB[k];if(f)f();}catch(e){}}
function setOn(v){on=!!v;try{localStorage.setItem('yyt_sfx',on?'1':'0')}catch(e){}if(on)play('click');}
// 依戰鬥事件挑音效
function forEvents(evs,D,st){if(!on||!evs||!evs.length)return;let i=0;const seq=[];
 for(const e of evs){if(e.t==='hit'){const a=st&&st.units.find(u=>u.id===e.a);let k=e.crit?'crit':'hit';const pre=a?(a.dmg==='MAGICAL'?'magic':a.rmax>=2?'arrow':a.troop==='SPEAR'?'pierce':'slash'):'slash';seq.push(pre);seq.push(k);}
  else if(e.t==='miss')seq.push('miss');else if(e.t==='down')seq.push('down');else if(e.t==='move')seq.push('move');
  else if(e.t==='skill'||e.t==='zone'||e.t==='heal'||e.t==='status'||e.t==='form'){const m={zone:'lamp',heal:'heal',form:'form'}[e.t];if(m)seq.push(m);else if(/守護/.test(e.txt))seq.push('guard');else if(/影徑/.test(e.txt))seq.push('shadow');else if(/束縛/.test(e.txt))seq.push('bind');else if(/標記/.test(e.txt))seq.push('mark');}
  else if(e.t==='corrupt'||e.t==='warn')seq.push('corrupt');else if(e.t==='purify'||e.t==='stabilize')seq.push('purify');else if(e.t==='spawn')seq.push('spawn');else if(e.t==='end')seq.push(/勝利/.test(e.txt)?'win':'lose');}
 const uniq=[];for(const k of seq)if(uniq[uniq.length-1]!==k)uniq.push(k);
 uniq.slice(0,6).forEach((k,j)=>setTimeout(()=>play(k),j*130));}
root.SFX={play,setOn,isOn:()=>on,forEvents,unlock:()=>{ac();}};
})(this);
