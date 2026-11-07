// 背景音樂與音效各自保存。用單一播放器切歌，避免快速切換時重疊。
(function(root){
'use strict';
function createBgm(D, env){
 const read=k=>{try{return env.localStorage.getItem(k);}catch(e){return null;}};
 const write=(k,v)=>{try{env.localStorage.setItem(k,String(v));}catch(e){}};
 const choices=[
  ['auto','跟隨場景'],['hall','據點／標題'],['explore','地圖探索'],
  ['battle','戰場'],['boss','首領戰'],['palanquin','無人迎親・轎中有名']
 ];
 const valid=k=>choices.some(([id])=>id===k);
 const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
 let on=read('yyt_bgm')!=='0';
 const saved=read('yyt_bgm_volume');
 let volume=saved!==null&&Number.isFinite(Number(saved))?clamp(Number(saved)):45;
 let mode=read('yyt_bgm_mode');
 if(!valid(mode))mode='auto';
 let scene=null,current=null,player=null,context=null,gain=null,attempt=null;

 function ensurePlayer(){
  if(player)return;
  player=new env.Audio();
  player.loop=true;
  const Context=env.AudioContext||env.webkitAudioContext;
  if(Context){
   try{
    context=new Context();
    gain=context.createGain();
    gain.connect(context.destination);
    context.createMediaElementSource(player).connect(gain);
   }catch(e){context=null;gain=null;}
  }
 }
 function applyVolume(){
  if(gain)gain.gain.value=volume/100;
  else if(player)player.volume=volume/100;
 }
 function sync(){
  const name=mode==='auto'?scene:mode;
  if(!on||volume===0||!name){
   if(player)player.pause();
   attempt=null;
   return;
  }
  ensurePlayer();
  applyVolume();
  if(current!==name){
   current=name;
   player.src=D.localBgm?.[name]||D.bgmRoot+name+'.mp3';
   attempt=null;
  }
  if(context?.state==='suspended'||context?.state==='interrupted')context.resume().catch(()=>{});
  if(player.paused&&!attempt){
   const pending=player.play();
   attempt=pending;
   pending.catch(()=>{}).finally(()=>{if(attempt===pending)attempt=null;});
  }
 }
 return {
  choices,
  play(k){scene=D.bgm[k]||k;sync();},
  unlock:sync,
  set(v){on=!!v;write('yyt_bgm',on?'1':'0');sync();},
  isOn:()=>on,
  volume:()=>volume,
  setVolume(n){if(Number.isFinite(Number(n))){volume=clamp(Number(n));write('yyt_bgm_volume',volume);sync();}},
  mode:()=>mode,
  setMode(k){if(valid(k)){mode=k;write('yyt_bgm_mode',k);sync();}}
 };
}
if(typeof module!=='undefined'&&module.exports)module.exports=createBgm;
else root.createBgm=createBgm;
})(this);
