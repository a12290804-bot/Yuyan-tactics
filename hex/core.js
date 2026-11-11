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
function phFx(fx,ph){const m=ph==='full'?2.6:1.6;const out=fx.map(f=>{const g=f.slice();if(['d','da','b','pa','ink','heal','dLinked'].includes(g[0])&&typeof g[1]==='number')g[1]=Math.round(g[1]*m);return g;});out.push(ph==='half'?['dr',1]:['stun']);return out;}
const scarB=c=>Math.min(4,Math.floor((c.scar||0)/3));
function cardDef(D,c,ph){const b=D.cards[c.id];let d=(!c.up||!b.u)?b:Object.assign({},b,b.u,{n:b.n+'+'});
 if(c.scar>=9&&D.scarNames&&D.scarNames[c.id])d=Object.assign({},d,{n:D.scarNames[c.id]+(c.up&&b.u?'+':'')});
 if(c.left)d=Object.assign({},d,{n:'她留下的'+d.n});
 if(d.bl&&ph&&ph!=='h'){const P=ph==='mix'?'full':ph;const o=(b.ph&&b.ph[P])||{};d=Object.assign({},d,{fx:o.fx||phFx(d.fx,P)},o.img?{img:o.img}:{});}return d;}
function cost(D,c,ph){if(c.free)return 0;const k=cardDef(D,c).c;return k<0?k:ph==='full'?0:Math.max(0,k+(c.tax||0)+(c.oil||0)-(c.kd||0));}
const isYY=st=>st.ch==='yy'||st.ch==='yx';
const baseCh=st=>st.ch==='yx'?'yy':st.ch;
// 慾望契／心願（st.desire）、個性（st.persona）、癖好（st.hobby）
const M=(st,k)=>st.desire===k||st.persona===k||st.hobby===k;
const handMax=(D,st)=>10+(pas(D,st,'hand12')?2:0)-(M(st,'letter')?1:0);
function phaseOf(st){if(!st||!isYY(st))return 'h';if(st.combat&&st.combat.full)return st.combat.mix?'mix':'full';return (st.alien||0)>=40?'half':'h';}
function originOf(D,st){return (D.origins||{})[baseCh(st)+'_'+st.origin]||{};}
function subOf(D,st){return st.sub?((D.origins||{})[baseCh(st)+'_'+st.sub]||{}):{};}
function subOn(D,st){if(!st.sub)return false;if(isYY(st))return phaseOf(st)!=='h';if(st.combat&&st.combat.clMix)return true;return !!(st.combat&&st.combat.turn>=3);}
const pas=(D,st,k)=>originOf(D,st).passive===k||(st.sub&&subOf(D,st).passive===k&&subOn(D,st));
const pe=(E,k)=>{E&&E.push({t:'pas',k});};
const OT=(D,st,o,n)=>!!(st.otal&&st.otal.includes(o+'_'+n))&&(st.origin===o||(st.sub===o&&subOn(D,st)));
const TL=(st,k)=>!!(st.tal&&st.tal.includes(k))&&!(k==='yy_guard2'&&st.ch!=='yy');
const catOf=id=>id?id[0]:'';
function addAlien(D,st,n,E){if(!isYY(st)||!n)return;const a0=st.alien||0;const a=Math.max(st.ch==='yx'?40:0,Math.min(100,a0+n));if(st.ch==='yx'&&a===40&&a0>40&&st.combat)st.combat.drawLess=(st.combat.drawLess||0)+2;if(a===a0)return;st.alien=a;E&&E.push({t:'alien',n:a-a0,v:a});
 if(a0<40&&a>=40)E&&E.push({t:'phase',to:'half'});if(a0>=40&&a<40&&!(st.combat&&st.combat.full))E&&E.push({t:'phase',to:'h'});
 if(a0<60&&a>=60&&!st.flags.yx){st.flags.yx=1;E&&E.push({t:'yxWake'});}
 if(a>=100&&st.combat&&!st.combat.full&&!st.combat.fullNext){st.combat.fullNext=1;E&&E.push({t:'fullSoon'});if(st.combat.yx)E&&E.push({t:'unlockYx'});}}
function needsTarget(D,c,ph){return (cardDef(D,c,ph).fx||[]).some(f=>(['d','jd','dBlock','dGold','dLost','dAl','dVine','vineX2','dLure','lk','px2','ep','stun','lk1','wrap','tails','lie','constrict','needle','taste','sign','paIf','dKept','dInk','dLow','dDebuff','dSkill','dIfN'].includes(f[0])||(f[0]==='st'&&f[3]==='t'))||((f[0]==='st'||f[0]==='pa')&&(f[f.length-1]==='t')));}
function opText(D,f){const S=D.status;const sc=typeof f[3]==='string'?f[3]:null;
 const scT=sc?(sc.startsWith('pact')?`，目標每有 1 層厄契多 ${sc.slice(4)}`:sc.startsWith('ink')?`，用掉所有墨，每 1 墨多 ${sc.slice(3)}`:''):'';
 switch(f[0]){
  case 'd':return `造成 ${f[1]} 點傷害${f[2]>1?` ${f[2]} 次`:''}${scT}`;
  case 'da':return `對所有敵人造成 ${f[1]} 點傷害${f[2]>1?` ${f[2]} 次`:''}${sc?`，每個敵人每有 1 層厄契多 ${sc.slice(4)}`:''}`;
  case 'b':return `獲得 ${f[1]} 格擋`;
  case 'dr':return `抽 ${f[1]} 張牌`;
  case 'en':return `獲得 ${f[1]} 能量`;
  case 'ep':return `目標有厄契時，獲得 ${f[1]} 能量`;
  case 'st':if(f[2]<0)return (f[3]==='s'?'自己的':f[3]==='a'?'所有敵人的':'敵人的')+S[f[1]].name+' '+f[2];return f[3]==='s'?`獲得 ${f[2]} 層${S[f[1]].name}`:f[3]==='a'?`所有敵人獲得 ${f[2]} 層${S[f[1]].name}`:`給予 ${f[2]} 層${S[f[1]].name}`;
  case 'pa':return f[2]==='a'?`所有敵人獲得 ${f[1]} 層厄契`:`給予 ${f[1]} 層厄契`;
  case 'ink':return `獲得 ${f[1]} 墨`;
  case 'jd':return `用掉目標所有厄契，每層造成 ${f[1]} 點傷害`;
  case 'lk':return `用命線連住目標和其他敵人 2 回合`;
  case 'dd':return `抽 ${f[1]} 張牌，再棄 ${f[2]} 張`;
  case 'keepOne':return '手上最貴的另一張牌，留到下回合';
  case 'dKept':return `造成 ${f[1]} 傷害，手上每有一張保留的牌再 +${f[2]}`;
  case 'inkAll':return `對所有敵人造成 ${f[1]} 傷害，得到 ${f[2]} 墨`;
  case 'dInk':return `造成 ${f[1]} 傷害，用掉所有墨，每 1 墨再 +${f[2]}`;
  case 'sendUp':return `本回合送回的門檻放寬 ${Math.round(f[1]*100)}%`;
  case 'dLow':return `造成 ${f[1]} 傷害；目標生命已經低到可以送回時，再 +${f[2]}`;
  case 'copyHand':return '手上多一張手中最貴的另一張牌的複製（這回合用）';
  case 'thorns':return `本回合每次被攻擊，攻擊者失去 ${f[1]} 生命`;
  case 'dDebuff':return `造成 ${f[1]} 傷害；目標身上有虛弱、易傷或厄契時，傷害 ×1.5`;
  case 'revealAll':return '看穿所有敵人的意圖';
  case 'dSkill':return `造成 ${f[1]} 傷害；本回合打出過技能牌的話，再打一次`;
  case 'sendB':return `本回合每送回一個敵人，得到 ${f[1]} 格擋`;
  case 'mirage':return f[1]>=1?'本回合下一張攻擊再結算一次（全額）':'本回合下一張攻擊再結算一次，第二次只造成一半傷害';
  case 'tails':return f[2]?`所有敵人這回合傷害 -3，並獲得 ${f[1]} 層厄契`:`目標這回合造成的傷害 -3，並給予 ${f[1]} 層厄契`;
  case 'lie':return f[1]?'把目標的意圖改成「停手」':'把目標的意圖改成「防禦」';
  case 'mask':return f[1]?'手上多一張手牌中費用最高的攻擊的複製（這回合用），再抽 1 張':'手上多一張「打擊」的複製（這回合用），再抽 1 張';
  case 'firstPa':return `如果這是本回合第一張攻擊，再給予 ${f[1]} 層厄契並抽 1 張`;
  case 'paIf':return `給予 ${f[1]} 層厄契；目標已有 ${f[2]} 層以上時，再給予 ${f[3]} 層`;
  case 'cleanse':return '清除自己的虛弱與易傷';
  case 'gold':return f[1]<0?`失去 ${-f[1]} 渡鴉幣`:`得到 ${f[1]} 渡鴉幣`;
  case 'dGold':return `造成 ${f[1]} 傷害，身上每 ${f[2]} 渡鴉幣再 +1`;
  case 'dLost':return `造成 ${f[1]} 傷害，每少 ${f[2]} 點生命再 +1`;
  case 'dAl':return `造成 ${f[1]} 傷害，異化值每 ${f[2]} 點再 +1`;
  case 'dVine':return `目標每有 1 層藤，造成 ${f[1]} 傷害`;
  case 'vineX2':return '目標身上的藤加倍';
  case 'dLure':return `造成等於誘燈生命 ${f[1]===1?'':f[1]+' 倍'}的傷害`;
  case 'drFree':return `抽 ${f[1]} 張，這回合不用能量`;
  case 'dig':return '從棄牌堆拿回最貴的一張牌';
  case 'addTemp':return `手上多 ${f[2]} 張「${(D.cards[f[1]]||{}).n||''}」`;
  case 'hardB':return `得到 ${f[1]} 點不會消失的格擋`;
  case 'lureUp':return `誘燈 +${f[1]} 生命（沒有就點一盞）`;
  case 'dBlock':return `造成等於格擋 ${Math.round(f[1]*100)}% 的傷害`;
  case 'constrict':return `造成「目標厄契 ×${f[1]}」點傷害（不消耗厄契）`;
  case 'ifPaSt':return `如果目標有厄契，再給予 ${f[2]} 層${S[f[1]].name}`;
  case 'wait':return '下回合第一張攻擊費用 -1、傷害 +3';
  case 'needle':return `對有厄契的敵人造成 ${f[1]} 傷害（不消耗厄契）；牠生命低於 20% 時，改為裁定一次`;
  case 'killHeal':return `如果這張牌打倒敵人，回復 ${f[1]} 生命`;
  case 'lk1':return `命線連住目標 2 回合`;
  case 'ifLinkB':return `如果場上有被命線連住的敵人，再獲得 ${f[1]} 格擋`;
  case 'wrap':return `造成 ${f[1]} 傷害並命線連住目標；牠已被連住時，改為 ${f[1]} 傷害、給予 2 層厄契並抽 1 張`;
  case 'dLinked':return `對所有被命線連住的敵人造成 ${f[1]} 傷害`;
  case 'heal':return `回復 ${f[1]} 生命`;
  case 'taste':return `看穿目標的意圖；如果牠下一步是攻擊，回復 ${f[1]} 生命`;
  case 'pool':return '本回合每回復 1 生命，再獲得 1 格擋';
  case 'drainH':return `回復造成傷害的 ${Math.round(f[1]*100)}%`;
  case 'ifHealedA':return `如果本回合已經回復過生命，再對所有敵人造成 ${f[1]} 傷害`;
  case 'stop':return '所有敵人停手 1 回合';
  case 'dIfN':return `本場已打出 ${f[2]} 張牌以上時，傷害改為 ${f[3]}`;
  case 'ifLowDr':return '生命低於一半時，再抽 1 張';
  case 'stackTop':return '把抽牌堆頂 5 張排成最好的順序，然後抽 2 張';
  case 'noAtkLinked':return '被命線連住的敵人這回合不能攻擊';
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
 st.sub=(opt.sub&&opt.sub!==opt.origin)?opt.sub:null;st.tal=((meta&&meta.prof&&meta.prof[ch==='yx'?'yy':ch]||{}).spent||[]).slice();{const bc=ch==='yx'?'yy':ch;const om=(meta&&meta.om)||{};st.otal=[];for(const k in om)if(k.startsWith(bc+'_'))st.otal.push(...(om[k].spent||[]));}
 st.desire=opt.desire||null;st.persona=opt.persona||null;st.hobby=opt.hobby||null;st.shards=0;st.marks=0;
 st.tt={cs:[],ts:[],el:[],kill:[],rest:0,on:[]};for(const tg of [st.persona,st.desire,st.hobby]){if(!tg)continue;{const td=tagDefOf(D,tg);const ef=td&&td.eff;if(ef){for(const k of ['cs','ts','el','kill'])if(ef[k])st.tt[k].push(...ef[k]);if(ef.rest)st.tt.rest+=ef.rest;if(ef.rs){if(ef.rs.gold)st.gold=Math.max(0,st.gold+ef.rs.gold);if(ef.rs.maxhp){st.maxHp+=ef.rs.maxhp;st.hp=Math.max(1,Math.min(st.maxHp,st.hp+ef.rs.maxhp));}}}}const o=meta&&meta.tm&&meta.tm[tg];const T=(D.tagtal||{})[tg];if(!o||!T)continue;for(const tier of o.spent){const ef=(T[tier-1]||{}).eff||{};st.tt.on.push(tg+'_'+tier);for(const k of ['cs','ts','el','kill'])if(ef[k])st.tt[k].push(...ef[k]);if(ef.rest)st.tt.rest+=ef.rest;if(ef.rs){if(ef.rs.gold)st.gold+=ef.rs.gold;if(ef.rs.maxhp){st.maxHp+=ef.rs.maxhp;st.hp+=ef.rs.maxhp;}}}}
 if(meta&&meta.letter){st.gold+=meta.letter;st.flags.gotLetter=meta.letter;}
 if(meta&&meta.dotGold){st.gold+=meta.dotGold;st.flags.gotDot=meta.dotGold;}
 if(meta&&meta.grudges)st.grudgeList=meta.grudges.slice();
 if(opt.persona==='petty'&&meta&&meta.grudges)st.grudges=meta.grudges.slice();
 st.hob=(meta&&meta.hobbies||[]).slice();
 if(meta&&(meta.runs||0)>=2&&(meta.fourth||0)<9){addCard(st,'x_fourth');st.fourthN=meta.fourth||0;}
 if(meta&&meta.left&&meta.left.ch===baseCh({ch}))st.left=clone(meta.left);
 st.dossier={};st.pages=meta&&meta.pages||0;st.com=opt.com||null;st.stats.rests=0;
 st.origin=opt.origin||C.origin||null;st.alien=ch==='yx'?60:0;if(ch==='yx')st.flags.yx=1;st.reso={};st.wick=10;st.lamp=(st.otal&&st.otal.includes('lamp_3')&&st.origin==='lamp')?1:0;st.stats.ph={h:0,half:0,full:0};st.stats.sent=0;
 const O=originOf(D,st);if(O.hpB){st.maxHp+=O.hpB;st.hp+=O.hpB;}if(O.start&&(ch==='yy'||ch==='cl')){const drop=ch==='yy'?['yy_bind','yy_reel']:['cl_pen','cl_stroke'];st.deck=st.deck.filter(x=>!drop.includes(x.id));for(const id of O.start)addCard(st,id);}if(O.swap){let n=O.swap[1];for(const c of st.deck){if(n&&c.id==='strike'){c.id=O.swap[0];n--;}}}
 gainRelic(D,st,C.relic);
 st.v=2;st.kp=(meta&&meta.keeper||[]).slice();const K=id=>st.kp.includes(id);
 if(K('m_hp1')){st.maxHp+=5;st.hp+=5;}if(K('m_hp2')){st.maxHp+=5;st.hp+=5;}if(K('m_hp3')){st.maxHp+=8;st.hp+=8;}if(K('m_gold'))st.gold+=40;if(K('m_gold2'))st.gold+=60;
 const prep={};if(K('m_relic')){const p=shuffle(st,commonRelics(D,st)).slice(0,3);if(p.length)prep.relics=p;}if(K('m_remove'))prep.remove=1;if(K('m_card')){const p=pool(D,st).filter(k=>D.cards[k].r===1);prep.cards=shuffle(st,p).slice(0,3);}
 if(K('m_relic2')&&prep.relics){const p=relicPool(D,st).filter(k=>!prep.relics.includes(k)&&!COSTLY.includes(k));if(p.length)prep.relics.push(pick(st,p));}
 if(prep.relics||prep.remove||prep.cards){st.prep=prep;st.screen='prep';}
 st.chapter=opt.chapter||1;const CH=(D.chapters||[]).find(c=>c.id===st.chapter)||{from:0,to:3};st.endLayer=CH.to;
 if(st.chapter>1){st.layer=CH.from;st.maps=[];st.maps[CH.from]=warpMap(D,st,genMap(D,st,CH.from));st.prep=st.prep||{};const P=st.prep;if(!P.relics){const p=shuffle(st,commonRelics(D,st)).slice(0,3);if(p.length)P.relics=p;}if(!P.cards){const p=pool(D,st).filter(k=>D.cards[k].r>=2);P.cards=shuffle(st,p).slice(0,3);}st.screen='prep';const B=CH.bonus||{};if(B.hp){st.maxHp+=B.hp;st.hp+=B.hp;}if(B.up){const can=shuffle(st,st.deck.filter(x=>!x.up&&D.cards[x.id].u));can.slice(0,B.up).forEach(x=>x.up=1);}if(B.gold)st.gold+=B.gold;}
 else st.maps.push(warpMap(D,st,genMap(D,st,0)));
 if(opt.mode==='g'){st.mode='g';st.trial=opt.trial||(D.trials[0]||{}).id;st.gi=0;st.prep=null;st.screen='gnext';st.left=null;st.com=null;if(opt.deck&&opt.deck.length){st.deck=[];for(const x of opt.deck){addCard(st,x.id);st.deck[st.deck.length-1].up=x.up?1:0;}}}
 return st;}
const COSTLY=['eyebutton','borrowedheart','namelesslamp','tornphoto'];
function commonRelics(D,st){return relicPool(D,st).filter(k=>!D.relics[k].ch&&!COSTLY.includes(k)&&k!=='anchor');}
function addCard(st,id,up){const c={uid:st.uid++,id,up:up?1:0};st.deck.push(c);return c;}
function genMap(D,st,L){const M=D.map;const rows=[];const Lw=(D.layers[L]||{}).w||{};
 for(let r=0;r<M.rows;r++){const row=[];for(let c=0;c<M.cols;c++){let t;if(r===0)t='fight';else if(r===M.rows-1)t='rest';else if(r===Math.floor(M.rows/2)&&c===1)t='chest';else{const w=Object.assign({},M.w,Lw);if(r<2){delete w.elite;delete w.altar;}if(r>=M.rows-2)delete w.rest;t=pickW(st,w);}const n={t,e:[]};if(t==='mystery')n.q=pickW(st,M.q);row.push(n);}rows.push(row);}
 for(let r=0;r<M.rows-1;r++)for(let c=0;c<M.cols;c++){const opts=[c-1,c,c+1].filter(x=>x>=0&&x<M.cols);const k=R(st);const e=shuffle(st,opts.slice()).slice(0,k<.35?1:k<.85?2:3);rows[r][c].e=e.sort();}
 // 確保下一排每一格至少有人連得到
 for(let r=1;r<M.rows;r++)for(let c=0;c<M.cols;c++){if(!rows[r-1].some(n=>n.e.includes(c))){const from=Math.min(M.cols-1,Math.max(0,c+(R(st)<.5?-1:1)));const src=rows[r-1][Math.abs(from-c)<=1?from:c];if(!src.e.includes(c)){src.e.push(c);src.e.sort();}}}
 return {rows};}

// ── 遺物
function has(st,id){return st.relics.includes(id);}
function gainRelic(D,st,id){if(!id||has(st,id))return;st.relics.push(id);if(id==='vial'){st.maxHp+=10;st.hp+=10;}if(id==='borrowedheart'){st.maxHp+=15;st.hp+=15;}if(id==='tornphoto')addCard(st,'x_name');}
function relicPool(D,st){return Object.keys(D.relics).filter(k=>!D.relics[k].start&&!has(st,k)&&(!D.relics[k].ch||D.relics[k].ch===st.ch)&&(k!=='anchor'||st.unlocked.includes('relic2')));}

// ── 牌池
function pool(D,st,minR){const nw=(st.ch==='yy'||st.ch==='cl')&&st.origin;const tags=[st.persona,st.desire,st.hobby].filter(Boolean);
 if(nw)return Object.keys(D.cards).filter(k=>{const c=D.cards[k];if(c.r<1||c.t==='x')return false;if(c.g)return st.mode==='g';if(c.bl)return c.bl===st.origin||c.bl===st.sub;if(c.tag)return tags.includes(c.tag);return false;}).filter(k=>!minR||D.cards[k].r>=minR);
 return Object.keys(D.cards).filter(k=>{const c=D.cards[k];if(c.r<1||c.t==='x')return false;if(c.tag)return false;if(c.bl&&c.bl!==st.origin&&c.bl!==st.sub)return false;if(c.g&&st.mode!=='g')return false;if(c.ch!==baseCh(st)&&c.ch!==st.ch&&c.ch!=='any')return false;if(st.ch==='yx'&&k==='yy_restrain')return false;if(c.lock&&!st.unlocked.includes(c.lock))return false;if(minR&&c.r<minR)return false;return true;});}
function subRoll(D,st){if(!st.sub||R(st)>=.4)return null;const P=pool(D,st);const a=P.filter(k=>D.cards[k].bl===st.origin),b=P.filter(k=>D.cards[k].bl===st.sub),n=P.filter(k=>!D.cards[k].bl);if(!a.length||!b.length||!n.length)return null;const out=[pick(st,a),pick(st,b),pick(st,n)];return M(st,'obsess')?out.slice(0,2):out;}
function rollCards(D,st,n,elite){const out=[];let guard=0;while(out.length<n&&guard++<200){const v=R(st);const r=v<(elite?.12:.05)?3:v<(elite?.5:.37)?2:1;const p=pool(D,st).filter(k=>D.cards[k].r===r&&!out.includes(k));if(st.origin&&R(st)<.3){const q=p.filter(k=>D.cards[k].bl===st.origin);if(q.length){out.push(pick(st,q));continue;}}if(p.length)out.push(pick(st,p));}return out;}

// ── 戰鬥
function mkEnemy(D,st,id,i){const E=D.enemies[id];const L=D.layers[st.layer]||{};const FM=(D.chars[baseCh(st)]||{}).foe||{};const hp=Math.round(ri(st,E.hp[0],E.hp[1])*(E.boss?1:E.elite?(1+((L.hpMul||1)-1)*.35):(L.hpMul||1))*(FM.hp||1));const e={uid:'e'+i+'_'+st.n,id,n:E.n,hp,max:hp,block:0,st:{},mi:-1,last:[],intent:null};
 if(st.grudges&&st.grudges.includes(id)){e.hp=e.max=Math.max(1,Math.round(hp*.8));}
 if(st.pettyNext&&st.grudges&&st.grudges.includes(id)){e.hp=e.max=Math.max(1,Math.round(e.max*.9));}
 if(TL(st,'yy_grudge1b')&&st.hitBy&&st.hitBy.includes(id))e.st.pact=(e.st.pact||0)+1;
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
 if(pas(D,st,'lure')){c.lure=5;pe(E,'lure');}
 if(M(st,'sloth'))c.extraDraw0=-1;
 if(M(st,'dread')){for(const e of c.enemies)addSt(e,'weak',1);addSt(c,'weak',1);}
 if(TL(st,'yy_guard1b'))c.b0=(c.b0||0)+3;
 if(M(st,'perfume')){const a=c.enemies.filter(e=>e.hp>0);if(a.length)addSt(pick(st,a),'weak',1);}
 if(M(st,'mirror')&&phaseOf(st)==='h')c.b0=(c.b0||0)+4;
 if(pas(D,st,'lampOil')){c.ink+=1;pe(E,'lampOil');}
 if(M(st,'possess')&&c.hand===undefined){}
 if(st.next){const n=st.next;if(n.drawLess)c.drawLessT1=(c.drawLessT1||0)+n.drawLess;if(n.draw)c.extraDraw0=(c.extraDraw0||0)+n.draw;if(n.pact)for(const e of c.enemies)addSt(e,'pact',n.pact);if(n.block)c.b0=(c.b0||0)+n.block;if(n.str)addSt(c,'str',n.str);if(n.shade)c.shade=n.shade;if(n.flame)c.flame2=1;if(n.obs)c.obs2=1;st.next=null;}
 if(st.ch==='cl'&&st.sub)c.clMix=0;
 if(st.mode==='g'&&st.tRule){c.rule=st.tRule;if(c.rule==='talisman')c.handQ=['x_talisman'];if(c.rule==='hidden')for(const e of c.enemies)e.hid=1;if(c.rule==='well')for(const e of c.enemies)e.shutNoPact=1;}
 if(TL(st,'cl_write1'))c.ink+=1;
 if(M(st,'glutton'))selfHurt(D,st,3,E,true,true);
 if(M(st,'grudge'))c.pw.grudge=(c.pw.grudge||0)+1;
 if(M(st,'firm')&&kind==='elite')c.b0=(c.b0||0)+10;
 if(st.marks>0){c.markKeep=1;st.marks--;}
 if(M(st,'possess'))c.possessLock=1;
 c.extraDraw=(M(st,'letter')?1:0)+(st.namesNext?1:0);st.namesNext=0;
 if(has(st,'eyebutton')){c.maxE=4;c.draw.splice(Math.floor(R(st)*(c.draw.length+1)),0,{uid:'w'+st.uid++,id:'x_whisper',up:0});}
 if(has(st,'namelesslamp'))selfHurt(D,st,3,E,true);
 if(has(st,'thread'))for(const e of c.enemies)addSt(e,'pact',1);
 if(has(st,'mask'))for(const e of c.enemies)addSt(e,'vuln',1);
 if(has(st,'whet'))addSt(c,'str',1);
 if(has(st,'shell'))c.block+=10;
 if(has(st,'inkpot'))gainInk(st,c,3,E);
 {const A=()=>c.enemies.filter(e=>e.hp>0);const one=()=>{const a=A();return a.length?pick(st,a):null;};
  if(OT(D,st,'B01',2)){const e=one();if(e)addSt(e,'weak',1);}
  if(OT(D,st,'M02',2))for(const e of A())addSt(e,'vuln',1);
  if(OT(D,st,'B02',1)){const e=one();if(e)addSt(e,'weak',2);}
  if(OT(D,st,'M03',2))for(const e of A())e.st.link=Math.max(e.st.link||0,2);
  if(OT(D,st,'B07',3))for(const e of A())e.st.link=Math.max(e.st.link||0,2);
  if(OT(D,st,'B04',2))c.handQ=(c.handQ||[]).concat(['b_hatch']);
  if(OT(D,st,'B05',3))c.e1=(c.e1||0)+1;
  if(OT(D,st,'B06',3))addSt(c,'str',1);
  if(OT(D,st,'B08',2))c.b0=(c.b0||0)+6;
  if(OT(D,st,'M07',2))for(const e of A())addSt(e,'weak',1);
  if(OT(D,st,'M11',2)){c.b0=(c.b0||0)+6;c.hard=(c.hard||0)+6;}
  if(OT(D,st,'M12',3))for(const e of A())addSt(e,'vine',1);
  if(OT(D,st,'paper',2))c.b0=(c.b0||0)+4;
  if(OT(D,st,'ink',2))c.ink+=2;
  if(OT(D,st,'lamp',1))c.ink+=1;
  if(OT(D,st,'mirror',3)){const e=one();if(e)addSt(e,'vuln',1);}
  if(OT(D,st,'M09',1)&&c.lure)c.lure=12;
 }
 if(st.tt){tagFx(D,st,st.tt.cs,E,true);if(kind==='elite'||kind==='boss')tagFx(D,st,st.tt.el,E,true);}
 for(const e of c.enemies)chooseIntent(D,st,e);
 if(pas(D,st,'shop20')){const h=c.enemies.filter(e=>e.hid);if(h.length)pick(st,h).hid=0;const a=c.enemies.filter(e=>e.hp>0);if(a.length)addSt(pick(st,a),'weak',1);pe(E,'shop20');}
 if(pas(D,st,'moth')){if(c.enemies.some(e=>e.hid))pe(E,'moth');for(const e of c.enemies)e.hid=0;}
 if(M(st,'envy')){const b=c.enemies.find(e=>e.st.str);if(b)addSt(c,'str',b.st.str);}
 startTurn(D,st,E);return E;}
let CUR=null;
function addSt(u,k,n){const c=CUR&&CUR.combat;if(k==='pact'&&n>0&&c&&u!==c){if(u.shutNoPact&&u.intent&&u.intent.shut)return;if(c.pw.hiss&&(u.st.pact||0)>=3&&(u.hissN||0)<(c.pw.hissMax?2:1)){u.hissN=(u.hissN||0)+1;n+=1;}}
 u.st[k]=(u.st[k]||0)+n;if(k==='str'?u.st[k]===0:u.st[k]<=0)delete u.st[k];}
function healP(st,n,E){const c=st.combat;const h=Math.min(n,st.maxHp-st.hp);if(h<=0)return 0;st.hp+=h;E&&E.push({t:'heal',n:h});if(c){c.healedT=1;if(c.pool){c.block+=h;E&&E.push({t:'block',n:h});}}return h;}
function gainInk(st,c,n,E){c.ink+=n;if(c.pw.inkBlock)c.block+=c.pw.inkBlock*n;if(c.ink>=10)E.push({t:'ach',id:'ink10'});}
function draw(D,st,n,E){const c=st.combat;for(let i=0;i<n;i++){if(c.hand.length>=handMax(D,st))break;if(!c.draw.length){if(!c.disc.length)break;c.draw=shuffle(st,c.disc);c.disc=[];E&&E.push({t:'shuffle'});}const x=c.draw.pop();c.hand.push(x);const xd=D.cards[x.id];if(xd&&xd.t==='x'&&E)addAlien(D,st,5,E);if(xd&&xd.onDraw&&xd.onDraw[0]==='hurt'&&E)selfHurt(D,st,xd.onDraw[1],E);}}
function startTurn(D,st,E){const c=st.combat;c.turn++;c.atkN=0;
 c.seqT='';c.sacN=0;c.voiced=0;c.skillT=0;c.sung=0;c.sendUp=0;c.thornsT=0;c.healedT=0;c.pool=0;c.centerN=0;c.p1b=c.p1b||0;for(const e of c.enemies){delete e.minus3;delete e.hissN;}
 if(c.waitNext){c.waitNext=0;c.waitOn=1;}else c.waitOn=0;
 if(pas(D,st,'tether')&&st.hp<st.maxHp*(OT(D,st,'line',2)?.6:.5)&&st.hp>0){pe(E,'tether');healP(st,OT(D,st,'line',1)?3:2,E);if(OT(D,st,'line',3)){c.block+=3;E.push({t:'block',n:3});}}c.leeched=0;c.firstCard=0;c.skillN=0;c.jelly=0;
 if(pas(D,st,'coral')){c.hard=Math.min(c.hard||0,c.block);c.block=c.hard;}
 else if(pas(D,st,'slime')){if(c.block>1)pe(E,'slime');if(OT(D,st,'M06',2)&&c.block>=10)c.slimeDraw=1;c.block=Math.floor(c.block*(OT(D,st,'M06',1)?.75:.5));}
 else if(!(c.turn===2&&has(st,'anchor')))c.block=0;
 c.boughtE=0;
 if(TL(st,'yy_guard1')&&st.hp<st.maxHp*.3){c.block+=4;E.push({t:'block',n:4});}
 if(TL(st,'cl_pain2')&&st.hp<st.maxHp*.3){c.block+=6;E.push({t:'block',n:6});}
 if(pas(D,st,'molt3')&&c.turn%(OT(D,st,'B03',1)?2:3)===0){pe(E,'molt3');if(OT(D,st,'B03',2)){c.block+=6;E.push({t:'block',n:6});}if(OT(D,st,'B03',3)){healP(st,4,E);c.moltDraw=1;}for(const k of ['weak','vuln','frail'])delete c.st[k];E.push({t:'molt'});}
 if(pas(D,st,'vine')){let n=0;const vd=OT(D,st,'M12',1)?3:2;for(const e of alive(c))if(e.st.vine){e.hp=Math.max(0,e.hp-vd*e.st.vine);n+=e.st.vine;E.push({t:'hit',to:e.uid,n:vd*e.st.vine,blocked:0});}if(n){if(OT(D,st,'M12',2))n*=2;pe(E,'vine');st.hp=Math.min(st.maxHp,st.hp+n);E.push({t:'heal',n});killCheck(D,st,E);if(st.screen!=='combat')return;}}
 if(st.ch==='gu'&&c.draw.length<5)c.guE=1;else c.guE=0;
 if(c.turn===1&&c.b0){c.block+=c.b0;E.push({t:'block',n:c.b0});}
 if(c.keptB){c.block+=c.keptB;E.push({t:'block',n:c.keptB});c.keptB=0;}
 if(isYY(st)){if(st.hp<st.maxHp/2)addAlien(D,st,5,E);
  if(c.fullNext){c.fullNext=0;c.full=1;st.flags.transformed=1;if(st.sub&&st.ch==='yy'){c.mix=1;c.mixT=2;const a=catOf(st.origin),b=catOf(st.sub);c.pair=a==='B'&&b==='B'?'BB':a==='M'&&b==='M'?'MM':'BM';}E.push({t:'transform',origin:st.origin,mix:c.mix?st.sub:null,pair:c.pair});}
  c.yx=(c.yxAt===c.turn&&!c.full)?1:0;if(c.yx)E.push({t:'yxTurn'});
  const ph=phaseOf(st);st.stats.ph[ph]=(st.stats.ph[ph]||0)+1;
  if(ph==='half'){selfHurt(D,st,1,E,true,true);}}
 c.energy=c.maxE+(c.turn===1&&has(st,'lantern')?1:0);if(c.mix)c.energy++;if(c.turn===1&&c.e1)c.energy+=c.e1;
 if(c.pw.pactTurn)for(const e of alive(c))addSt(e,'pact',c.pw.pactTurn);
 if(c.pw.strTurn)addSt(c,'str',c.pw.strTurn);
 if(has(st,'quill'))gainInk(st,c,1,E);
 if(c.pw.inkTurn)gainInk(st,c,c.pw.inkTurn,E);
 if(has(st,'paperweight')&&c.ink>=5){c.energy++;E.push({t:'relic',id:'paperweight'});}
 if(M(st,'stubborn')&&st.hp<st.maxHp*.3)c.energy++;
 if(c.guE)c.energy++;
 if(M(st,'sloth')&&c.turn===1)c.slothT=1;
 draw(D,st,Math.max(0,5-(c.drawLess||0)-(c.turn===1?(c.drawLessT1||0):0))+(pas(D,st,'hand12')?(pe(E,'hand12'),1):0)+(c.turn===1?(c.extraDraw||0)+(c.extraDraw0||0):0)+(phaseOf(st)==='half'?1:0)+(c.turn===1&&has(st,'feather')?2:0)+(c.turn===1&&has(st,'tornphoto')?3:0)+(c.pw.drawTurn||0),E);
 {let xd=0;if(c.slimeDraw){c.slimeDraw=0;xd++;}if(c.moltDraw){c.moltDraw=0;xd++;}if(c.paperDraw){c.paperDraw=0;xd++;}if(c.turn===1&&OT(D,st,'M07',1))xd++;if(xd)draw(D,st,xd,E);if(OT(D,st,'M07',3)&&c.hand.length>=8){c.energy++;pe(E,'hand12');}}
 {const P=c.pw,A=alive(c);if(P.charm&&A.length)addSt(pick(st,A),'weak',P.charm);if(P.shedP){delete c.st.weak;delete c.st.vuln;delete c.st.frail;}
  if(P.brood)for(let i=0;i<P.brood&&c.hand.length<handMax(D,st);i++)c.hand.push({uid:'x'+st.uid++,id:'b_hatch',up:0,temp:1,free:1});
  if(P.hive)for(let i=0;i<P.hive&&c.hand.length<handMax(D,st);i++)c.hand.push({uid:'x'+st.uid++,id:'b_bug',up:0,temp:1,free:1});
  if(P.lureTurn)c.lure=(c.lure||0)+4*P.lureTurn;if(P.hardTurn){const n=4*P.hardTurn;c.block+=n;c.hard=(c.hard||0)+n;E.push({t:'block',n});}
  if(P.vineTurn)for(const e of A)addSt(e,'vine',P.vineTurn);}
 if(st.tt&&st.tt.ts.length)tagFx(D,st,st.tt.ts,E,false);
 if(pas(D,st,'brideLink')){let hit=0;for(const e of alive(c))if(e.st.link){e.hp=Math.max(0,e.hp-3);E.push({t:'hit',to:e.uid,n:3,blocked:0});hit=1;}if(hit){pe(E,'brideLink');killCheck(D,st,E);if(st.screen!=='combat')return;}}
 if(c.stealQ&&c.stealQ.length){for(const q of c.stealQ){const e=c.enemies.find(x=>x.uid===q.uid&&x.hp>0);if(!e)continue;e.stolen=e.stolen||[];for(let i=0;i<q.n&&c.hand.length;i++){const k=Math.floor(R(st)*c.hand.length);const x=c.hand.splice(k,1)[0];if(!x.temp)e.stolen.push(strip(x));E.push({t:'steal',uid:e.uid,id:x.id});}}c.stealQ=[];}
 c.drawLess=0;
 if(c.slothT){c.slothT=0;for(const x of c.hand)x.kd=(x.kd||0)+1;c.slothClear=1;}
 for(const x of c.hand)delete x.ring;
 if(st.ch==='yy'&&(st.alien||0)>=60&&!c.yx&&!c.full){const can=c.hand.filter(x=>D.cards[x.id].t!=='x');if(can.length){pick(st,can).ring=1;E.push({t:'ring'});}}
 if(c.possessLock&&c.turn===1){const can=c.hand.filter(x=>D.cards[x.id].t!=='x');if(can.length){pick(st,can).lock='possess';c.locks=1;}}
 if(c.possessLock&&c.turn===2){for(const x of [...c.hand,...c.draw,...c.disc])if(x.lock==='possess')delete x.lock;c.possessLock=0;}
 if(c.dumpNext){c.dumpNext=0;c.disc.push(...c.hand.filter(x=>!x.temp).map(strip));c.hand=[];E.push({t:'dump'});}
 if(c.oilNext){const can=c.hand.filter(x=>cardDef(D,x).c>=0&&!x.oil);shuffle(st,can).slice(0,c.oilNext).forEach(x=>x.oil=1);E.push({t:'oil',n:Math.min(c.oilNext,can.length)});c.oilNext=0;}
 if(c.grabQ&&c.grabQ.length){for(const uid of c.grabQ){const e=c.enemies.find(x=>x.uid===uid&&x.hp>0);const can=c.hand.filter(x=>!x.lock&&cardDef(D,x).c>=0);if(e&&can.length){pick(st,can).lock=uid;c.locks=1;E.push({t:'grab',uid});}}c.grabQ=[];}
 if(c.handQ&&c.handQ.length){for(const id of c.handQ){const x={uid:'x'+st.uid++,id,up:0,temp:1};if(c.hand.length<10)c.hand.push(x);}E.push({t:'handAdd',n:c.handQ.length});c.handQ=[];}
 if(c.taxNext){const can=c.hand.filter(x=>cardDef(D,x).c>=0);shuffle(st,can).slice(0,c.taxNext).forEach(x=>x.tax=1);E.push({t:'tax',n:Math.min(c.taxNext,can.length)});c.taxNext=0;}
 E.push({t:'turn',n:c.turn});}
const alive=c=>c.enemies.filter(e=>e.hp>0);
function dmgCalc(base,att,def){let d=base+(att.st.str||0);if(att.st.weak)d*=.75;if(def.st.vuln)d*=1.5;return Math.max(0,Math.floor(d));}
function hitEnemy(D,st,e,amt,E,noLink){const c=st.combat;if(!noLink&&amt>0&&e.st&&e.st.link&&pas(D,st,'linkPlus1')){amt=Math.ceil(amt*(OT(D,st,'M03',1)?1.35:1.25));pe(E,'linkPlus1');}if(e.intent&&e.intent.shut&&amt>0){E.push({t:'shut',uid:e.uid});amt=0;}
 if(e.hid&&amt>0){e.hid=0;E.push({t:'reveal',uid:e.uid});}
 if(e.realm>0&&amt>=10){e.realm--;E.push({t:'realmBreak',uid:e.uid,v:e.realm});}
 if(e.parts&&amt>0){e.pd+=amt;while(e.pd>=12&&e.parts.length){e.pd-=12;const pid=e.parts.shift();E.push({t:'partBreak',uid:e.uid,id:pid});}
  if(e.cd!=null&&!hasPart(e,'spring')){e.cdd=(e.cdd||0)+amt;while(e.cdd>=10){e.cdd-=10;e.cd++;E.push({t:'cdUp',uid:e.uid});}if(e.intent&&e.intent.tick)e.intent.n='倒數 '+(e.cd-1);}}
 if(e.st&&e.st.link&&c.pw.center&&amt>0&&(c.centerN||0)<(c.centerMax||5)){c.centerN=(c.centerN||0)+1;st.hp=Math.min(st.maxHp,st.hp+1);c.healedT=1;}
 const b=Math.min(e.block,amt);e.block-=b;const real=amt-b;e.hp=Math.max(0,e.hp-real);E.push({t:'hit',to:e.uid,n:amt,blocked:b});
 if(!noLink&&e.st.link&&real>0)for(const o of alive(c))if(o!==e&&o.st.link)hitEnemy(D,st,o,c.pw.linkFull?real:Math.floor(real/2),E,true);
 splitCheck(D,st,e,E);
 return amt;}
function splitCheck(D,st,e,E){const c=st.combat;const sp=D.enemies[e.id].split;if(!sp||e.split||e.hp<=0||e.hp>e.max*sp)return;e.split=1;const half=Math.floor(e.hp/2);if(half<1)return;
 const n=mkEnemy(D,st,e.id,c.enemies.length);n.hp=n.max=half;e.hp=e.max=e.hp-half;n.split=1;n.st={};chooseIntent(D,st,n);chooseIntent(D,st,e);c.enemies.push(n);E.push({t:'split',uid:e.uid,nu:n.uid});}
function lossHook(D,st,n,E){const c=st.combat;if(n<=0)return;
 if(c&&pas(D,st,'sacrifice')){c.lossAcc=(c.lossAcc||0)+n;const sq=OT(D,st,'B10',1)?4:5,sm=OT(D,st,'B10',2)?3:2;while(c.lossAcc>=sq&&(c.sacN||0)<sm){c.lossAcc-=sq;c.sacN=(c.sacN||0)+1;c.energy++;if(OT(D,st,'B10',3))draw(D,st,1,E);pe(E,'sacrifice');E.push({t:'sacrifice'});}}
 if(st.ch==='yx'&&c){const a=alive(c);if(a.length)hitEnemy(D,st,pick(st,a),n,E,true);}
 if(st.hp<=0&&TL(st,'yy_guard2')&&!st.flags.clSave){st.flags.clSave=1;st.hp=Math.ceil(st.maxHp*.25);E.push({t:'clSave'});}
 if(st.hp<=0&&pas(D,st,'phylactery')&&(st.flags.phyl||0)<(OT(D,st,'B08',3)?2:1)){pe(E,'phylactery');st.flags.phyl=(st.flags.phyl||0)+1;st.hp=Math.ceil(st.maxHp*(OT(D,st,'B08',1)?.25:.1));E.push({t:'revive'});}}
function selfHurt(D,st,n,E,floor1,noAl){const c=st.combat;if(!noAl&&M(st,'thirst'))addAlien(D,st,n,E);if(c&&TL(st,'cl_pain1b')&&!c.p1b){c.p1b=1;n=Math.max(1,n-2);}if(!noAl)addAlien(D,st,n*2,E);st.hp-=n;lossHook(D,st,n,E);
 if(c)for(const e of alive(c))if(hasPart(e,'lung')){e.hp=Math.min(e.max,e.hp+n);E.push({t:'lungHeal',uid:e.uid,n});}if(floor1&&st.hp<1)st.hp=1;if(c)c.hurt+=n;E.push({t:'selfHurt',n});lowCheck(D,st,E);
 if(st.hp<=0&&has(st,'mirror')&&!st.flags.mirror){st.flags.mirror=1;st.hp=Math.ceil(st.maxHp*.3);E.push({t:'relic',id:'mirror'});}}
function lowCheck(D,st,E){const c=st.combat;if(!c||c.fox||!has(st,'foxhair')||st.hp<=0||st.hp>=st.maxHp/2)return;c.fox=1;st.hp=Math.min(st.maxHp,st.hp+10);for(const e of alive(c))addSt(e,'pact',3);E.push({t:'relic',id:'foxhair'});}
function hitPlayer(D,st,amt,E,src){const c=st.combat;if(src&&amt>0&&has(st,'lampshade')&&!c.shade){c.shade=1;amt=Math.floor(amt/2);E.push({t:'relic',id:'lampshade'});}if(src&&c.lure>0&&amt>0){pe(E,'lure');const t=Math.min(c.lure,amt);c.lure-=t;amt-=t;E.push({t:'lure',n:t,left:c.lure});if(c.lure<=0){E.push({t:'lureBreak'});const lb=OT(D,st,'M09',2)?12:6;for(const e of alive(c))hitEnemy(D,st,e,lb,E,true);if(OT(D,st,'M09',3)&&!c.relit){c.relit=1;c.lure=8;}}}
 const b=Math.min(c.block,amt);c.block-=b;const real=amt-b;st.hp-=real;c.hurt+=real;lossHook(D,st,real,E);E.push({t:'hurt',n:amt,blocked:b,src});if(src&&c.thornsT){const a0=c.enemies.find(x=>x.uid===src);if(a0&&a0.hp>0){a0.hp=Math.max(0,a0.hp-c.thornsT);E.push({t:'hit',to:a0.uid,n:c.thornsT,blocked:0});}}
 if(src){c.lastSrc=src;const a=c.enemies.find(x=>x.uid===src);if(a&&M(st,'spite')&&a.hp>0){a.hp=Math.max(0,a.hp-2);E.push({t:'hit',to:a.uid,n:2,blocked:0});}if(a&&real>0){a.hitMe=1;a.hits=(a.hits||0)+1;st.hitBy=st.hitBy||[];if(!st.hitBy.includes(a.id))st.hitBy.push(a.id);
  if(TL(st,'yy_grudge1')&&!c.g1){c.g1=1;addSt(a,'pact',2);E.push({t:'tal',k:'yy_grudge1'});}
  if(TL(st,'yy_grudge2')&&a.hits===3&&a.st.pact){const n=a.st.pact;delete a.st.pact;E.push({t:'tal',k:'yy_grudge2'});E.push({t:'judge',n});hitEnemy(D,st,a,n*3,E);}}}if(real>0&&st.hp>0)lowCheck(D,st,E);
 if(st.hp<=0&&has(st,'mirror')&&!st.flags.mirror){st.flags.mirror=1;st.hp=Math.ceil(st.maxHp*.3);E.push({t:'relic',id:'mirror'});}}
function killCheck(D,st,E){const c=st.combat;for(const e of c.enemies.slice())if(e.hp<=0&&!e.dead){e.dead=1;st.stats.kills++;E.push({t:'kill',id:e.id,uid:e.uid});if(TL(st,'yy_greed1')){st.gold+=3;}if(M(st,'glutton')&&st.hp>0)st.hp=Math.min(st.maxHp,st.hp+2);
  if(M(st,'eyegem')&&D.enemies[e.id].fac==='eldritch'&&R(st)<.3){st.shards=(st.shards||0)+1;E.push({t:'shard',n:st.shards});if(st.shards>=3){st.shards-=3;const p=relicPool(D,st);if(p.length){const id=pick(st,p);gainRelic(D,st,id);E.push({t:'relicGot',id});}}}
  if(D.enemies[e.id].drop)E.push({t:'drop',id:D.enemies[e.id].drop});if(has(st,'namelesslamp')&&st.hp>0)st.hp=Math.min(st.maxHp,st.hp+3);
  if(e.stolen&&e.stolen.length){c.disc.push(...e.stolen);E.push({t:'return',n:e.stolen.length});e.stolen=[];}
  if(st.tt&&st.tt.kill.length)tagFx(D,st,st.tt.kill,E,false);
  if(OT(D,st,'B02',2)){st.gold+=4;E.push({t:'gold',n:4});}
  if(e.st.link&&pas(D,st,'brideLink')){pe(E,'brideLink');const bn=OT(D,st,'B07',1)?14:10;for(const o of alive(c))if(o.st.link){o.hp=Math.max(0,o.hp-bn);E.push({t:'hit',to:o.uid,n:bn,blocked:0});}if(OT(D,st,'B07',2)){c.block+=5;E.push({t:'block',n:5});}}
  if(e.st.link&&OT(D,st,'M03',3)&&c.netT!==c.turn){c.netT=c.turn;c.energy++;draw(D,st,1,E);pe(E,'linkPlus1');}
  if(D.enemies[e.id].twin)for(const o of alive(c))if(o.id===e.id)realmUp(D,st,o,2,E);
  if(c.locks)for(const x of [...c.hand,...c.draw,...c.disc])if(x.lock===e.uid)delete x.lock;
  const od=D.enemies[e.id].onDeath;if(od)for(const id of od){const n=mkEnemy(D,st,id,c.enemies.length);chooseIntent(D,st,n);c.enemies.push(n);E.push({t:'spawn',uid:n.uid,id});}}
 if(c.enemies.some(e=>e.hp<=0&&!e.dead)){killCheck(D,st,E);return;}
 if(!alive(c).length)winCombat(D,st,E);}

function play(D,st,i,target,E){const c=st.combat;const card=c.hand[i];if(!card)return 'no_card';const ph=phaseOf(st);const d=cardDef(D,card,ph);
 if(card.id==='x_fourth'&&st.fourthN>=8&&!st.flags.fourthUsed){st.flags.fourthUsed=1;c.hand.splice(i,1);c.stop=1;E.push({t:'fourth'});return null;}
 if(d.t==='x'||d.c<0)return '這張牌不能打出';
 if(card.lock&&(card.lock==='possess'||c.enemies.some(e=>e.uid===card.lock&&e.hp>0)))return card.lock==='possess'?'這張牌被她自己「佔」住了，下回合才能用':'這張牌被抓住了';
 if(d.t==='a'&&c.hand.some(x=>(D.cards[x.id].lockAtk)))return '被鎮屍符鎮住了，先撕掉它';
 let k=cost(D,card,ph);if(d.t==='a'&&c.waitOn)k=Math.max(0,k-1);if(c.pw.draft&&!c.firstCard)k=Math.max(0,k-1);if(c.mix&&c.pair==='BB'&&d.bl)k=Math.max(0,k-1);if(pas(D,st,'script')&&c.seqT==='as'){k=0;pe(E,'script');if(OT(D,st,'B06',1))c.scriptDraw=1;if(OT(D,st,'B06',2))c.scriptE=1;}if(k>c.energy)return '能量不夠';
 let tg=null;if(needsTarget(D,card,ph)){tg=c.enemies.find(e=>e.uid===target&&e.hp>0);if(!tg){const a=alive(c);if(a.length===1)tg=a[0];else return '請選一個目標';}}
 c.energy-=k;c.hand.splice(i,1);st.stats.cards++;E.push({t:'play',id:card.id,up:card.up,tg:tg&&tg.uid});
 let total=0,gk=(d.fx.find(f=>f[0]==='gk')||[0,0])[1];
 const hasDmg=d.fx.some(f=>f[0]==='d'||f[0]==='da');const sb=isYY(st)?scarB(card):0;let scarN=0;
 const FX=card.ring?d.fx.concat(d.fx.filter(f=>!['hurt','hurtq','mhp','al','ep','en'].includes(f[0]))):d.fx;
 const dos=st.ch==='gu'?((c.tmpDos||0)+(tg?(st.dossier[D.enemies[tg.id].fac]||0):0)):0;
 const firstAtkT=d.t==='a'&&c.atkN===0;c.nPlay=(c.nPlay||0)+1;
 const echoM=(d.t==='a'&&c.echo)?c.echo:0;if(echoM)c.echo=0;
 let waitB=0;if(d.t==='a'&&c.waitOn){c.waitOn=0;waitB=3;}
 const atk=d.t==='a';const van=M(st,'vanity')?((st.alien||0)<40?2:-1):0;const phB=((atk&&ph==='half')?(M(st,'thirst')?2:1):0)+van-(atk&&M(st,'guard')?1:0)+(hasDmg?sb:0)+(atk?dos:0)+waitB+(atk&&c.pw.drive&&d.bl&&tg&&tg.st.pact?2*c.pw.drive:0);const wr=(c.yx&&M(st,'wrath'))?2:1;const gr=e=>(M(st,'grudge')&&e.hitMe?2:0);const dbl=(atk&&pas(D,st,'ink6Double')&&c.ink>=(OT(D,st,'ink',1)?5:6))?2:1;
 if(atk&&!c.firstAtk){c.firstAtk=1;if(pas(D,st,'firstAtkPact1')){pe(E,'firstAtkPact1');for(const e of (tg?[tg]:alive(c)))addSt(e,'pact',OT(D,st,'B01',1)?2:1);}}
 if(atk&&tg&&OT(D,st,'M05',2)&&d.fx.some(f=>f[0]==='d'&&(f[2]||1)>1)&&pas(D,st,'swarm'))addSt(tg,'pact',1);
 if(atk&&OT(D,st,'B01',3)){c.foxN=(c.foxN||0)+1;if(c.foxN%4===0){pe(E,'firstAtkPact1');for(const e of alive(c))addSt(e,'pact',1);}}
 const bonusOf=()=>phB+((d.t==='a'&&c.pw.beast&&st.hp<st.maxHp/2)?c.pw.beast:0);
 for(const f of FX){
  switch(f[0]){
   case 'd':{const hits=f[2]||1;let bonus=(pas(D,st,'swarm')&&(hits>1||OT(D,st,'M05',3))?(pe(E,'swarm'),(hits>1&&OT(D,st,'M05',1))?2:1):0)+phB+((d.t==='a'&&c.pw.beast&&st.hp<st.maxHp/2)?c.pw.beast:0);const sc=f[3];
    if(sc&&sc.startsWith('pact'))bonus+=(tg.st.pact||0)*(+sc.slice(4));
    if(sc&&sc.startsWith('ink')){bonus+=c.ink*(+sc.slice(3));if(c.ink)E.push({t:'inkUse',n:c.ink});if(c.ink>=5&&has(st,'inkstone'))c.inkDraw=1;c.ink=0;}
    for(let h=0;h<hits;h++){if(tg.hp<=0)break;total+=hitEnemy(D,st,tg,dmgCalc((f[1]+bonus+gr(tg))*dbl*wr,c,tg),E);}
    if(echoM&&tg.hp>0)for(let h=0;h<hits;h++)total+=hitEnemy(D,st,tg,Math.max(1,Math.floor(dmgCalc((f[1]+bonus+gr(tg))*dbl*wr,c,tg)*echoM)),E);break;}
   case 'da':{const hits=f[2]||1;for(let h=0;h<hits;h++)for(const e of alive(c)){const bonus=phB+(f[3]?(e.st.pact||0)*(+f[3].slice(4)):0)+((d.t==='a'&&c.pw.beast&&st.hp<st.maxHp/2)?c.pw.beast:0);total+=hitEnemy(D,st,e,dmgCalc((f[1]+bonus+gr(e))*dbl*wr,c,e),E);}break;}
   case 'b':{const n=Math.max(0,(TL(st,'cl_pain1')&&st.hp<st.maxHp/2?2:0)+f[1]+(hasDmg?0:sb)+(c.st.dex||0)+(M(st,'guard')?2:0)-(M(st,'envy')&&alive(c).some(e=>e.st.str)?2:0));c.block+=n;E.push({t:'block',n});break;}
   case 'dr':draw(D,st,f[1],E);break;
   case 'en':c.energy+=f[1];break;
   case 'ep':if(tg.st.pact)c.energy+=f[1];break;
   case 'st':{const who=f[3];if(who==='s')addSt(c,f[1],f[2]);else for(const e of (who==='a'?alive(c):[tg]))addSt(e,f[1],f[2]);break;}
   case 'pa':{let bonus=0;if(has(st,'silkglove')&&!c.silk){c.silk=1;bonus=2;E.push({t:'relic',id:'silkglove'});}for(const e of (f[2]==='a'?alive(c):[tg])){addSt(e,'pact',f[1]+bonus);if(pas(D,st,'vine'))addSt(e,'vine',1);if(e.st.pact>=20)E.push({t:'ach',id:'pact20'});}break;}
   case 'ink':gainInk(st,c,f[1],E);break;
   case 'jd':{const n=tg.st.pact||0;delete tg.st.pact;if(n){E.push({t:'judge',n});total+=hitEnemy(D,st,tg,dmgCalc(f[1]*n,c,tg),E);if(has(st,'knot')&&tg.hp>0)tg.st.pact=(tg.st.pact||0)+2;if(tg.hp<=0&&c.pw.shell){c.block+=6;E.push({t:'block',n:6});}if(tg.hp<=0&&pas(D,st,'judgeKillHeal3')){pe(E,'judgeKillHeal3');const jh=OT(D,st,'M02',1)?6:3;st.hp=Math.min(st.maxHp,st.hp+jh);E.push({t:'heal',n:jh});if(OT(D,st,'M02',3))c.energy++;}}break;}
   case 'lk':{const ln=2+(pas(D,st,'linkPlus1')?(pe(E,'linkPlus1'),OT(D,st,'M03',1)?2:1):0)+(M(st,'embroider')?1:0);tg.st.link=Math.max(tg.st.link||0,ln);for(const e of alive(c))if(e!==tg)e.st.link=Math.max(e.st.link||0,ln);if(has(st,'needle'))for(const e of alive(c))addSt(e,'pact',1);break;}
   case 'ka':c.keepAll=1;break;
   case 'hurt':selfHurt(D,st,f[1],E);scarN+=f[1];break;
   case 'dos':c.tmpDos=(c.tmpDos||0)+f[1];break;
   case 'keepOne':{const x=c.hand.filter(y=>y!==card&&!y.temp).sort((a,b)=>cardDef(D,b).c-cardDef(D,a).c)[0];if(x){x.hold=1;E.push({t:'hold'});}break;}
   case 'dKept':if(tg&&tg.hp>0){const n=c.hand.filter(y=>y!==card&&(cardDef(D,y).keep||y.hold)).length;total+=hitEnemy(D,st,tg,dmgCalc(f[1]+n*f[2]+bonusOf(),c,tg),E);}break;
   case 'inkAll':for(const e of alive(c))total+=hitEnemy(D,st,e,dmgCalc(f[1]+bonusOf(),c,e),E);gainInk(st,c,f[2],E);break;
   case 'dInk':if(tg&&tg.hp>0){const n=c.ink;c.ink=0;if(n)E.push({t:'inkUse',n});total+=hitEnemy(D,st,tg,dmgCalc(f[1]+n*f[2]+bonusOf(),c,tg),E);}break;
   case 'sendUp':c.sendUp=(c.sendUp||0)+f[1];break;
   case 'dLow':if(tg&&tg.hp>0){const low=tg.hp<tg.max*sendRate(D,st);total+=hitEnemy(D,st,tg,dmgCalc(f[1]+(low?f[2]:0)+bonusOf(),c,tg),E);}break;
   case 'copyHand':{const o=c.hand.filter(y=>y!==card&&D.cards[y.id].t!=='x');if(o.length&&c.hand.length<handMax(D,st)){const x=o.sort((a,b)=>cardDef(D,b).c-cardDef(D,a).c)[0];c.hand.push({uid:'x'+st.uid++,id:x.id,up:x.up,temp:1});E.push({t:'mimicCard'});}break;}
   case 'thorns':c.thornsT=(c.thornsT||0)+f[1];break;
   case 'dDebuff':if(tg&&tg.hp>0){const db=tg.st.weak||tg.st.vuln||tg.st.pact;total+=hitEnemy(D,st,tg,dmgCalc(Math.round((f[1]+bonusOf())*(db?1.5:1)),c,tg),E);}break;
   case 'revealAll':for(const e of alive(c))e.hid=0;break;
   case 'dSkill':if(tg&&tg.hp>0){const n=c.skillT?2:1;for(let h=0;h<n&&tg.hp>0;h++)total+=hitEnemy(D,st,tg,dmgCalc(f[1]+bonusOf(),c,tg),E);}break;
   case 'mirage':c.echo=f[1]>=1?1:.5;break;
   case 'tails':for(const e of (f[2]?alive(c):[tg]))if(e&&e.hp>0){e.minus3=1;addSt(e,'pact',f[1]);}break;
   case 'lie':if(tg&&tg.hp>0){tg.intent=f[1]?{i:-1,n:'停手',idle:1}:{i:-1,n:'防禦',b:6};E.push({t:'lie',uid:tg.uid});}break;
   case 'mask':{let id='strike';if(f[1]){const at=c.hand.filter(x=>x!==card&&D.cards[x.id].t==='a').sort((a,b)=>cardDef(D,b).c-cardDef(D,a).c)[0];if(at)id=at.id;}if(c.hand.length<handMax(D,st))c.hand.push({uid:'x'+st.uid++,id,up:0,temp:1});draw(D,st,1,E);break;}
   case 'firstPa':if(firstAtkT&&tg&&tg.hp>0){addSt(tg,'pact',f[1]);draw(D,st,1,E);}break;
   case 'paIf':if(tg&&tg.hp>0){const had=(tg.st.pact||0)>=f[2];addSt(tg,'pact',f[1]);if(had)addSt(tg,'pact',f[3]);}break;
   case 'cleanse':delete c.st.weak;delete c.st.vuln;break;
   case 'gold':st.gold=Math.max(0,st.gold+f[1]);E.push({t:'gold',n:f[1]});break;
   case 'dGold':if(tg&&tg.hp>0)total+=hitEnemy(D,st,tg,dmgCalc(f[1]+Math.floor(st.gold/f[2])+bonusOf(),c,tg),E);break;
   case 'dLost':if(tg&&tg.hp>0)total+=hitEnemy(D,st,tg,dmgCalc(f[1]+Math.floor((st.maxHp-st.hp)/f[2])+bonusOf(),c,tg),E);break;
   case 'dAl':if(tg&&tg.hp>0)total+=hitEnemy(D,st,tg,dmgCalc(f[1]+Math.floor((st.alien||0)/f[2])+bonusOf(),c,tg),E);break;
   case 'dVine':if(tg&&tg.hp>0&&tg.st.vine)total+=hitEnemy(D,st,tg,dmgCalc(f[1]*tg.st.vine+bonusOf(),c,tg),E);break;
   case 'vineX2':if(tg&&tg.st.vine)tg.st.vine*=2;break;
   case 'dLure':if(tg&&tg.hp>0)total+=hitEnemy(D,st,tg,dmgCalc(Math.floor((c.lure||0)*f[1])+bonusOf(),c,tg),E);break;
   case 'drFree':{const h0=c.hand.length;draw(D,st,f[1],E);for(const x of c.hand.slice(h0))x.free=1;break;}
   case 'dig':{if(c.disc.length&&c.hand.length<handMax(D,st)){const b=c.disc.slice().sort((a,b)=>cardDef(D,b).c-cardDef(D,a).c)[0];c.disc.splice(c.disc.indexOf(b),1);c.hand.push(b);}break;}
   case 'addTemp':for(let i=0;i<f[2]&&c.hand.length<handMax(D,st);i++)c.hand.push({uid:'x'+st.uid++,id:f[1],up:0,temp:1,free:D.cards[f[1]].c===0?1:undefined});break;
   case 'hardB':c.block+=f[1];c.hard=(c.hard||0)+f[1];E.push({t:'block',n:f[1]});break;
   case 'lureUp':c.lure=(c.lure||0)+f[1];E.push({t:'lure',n:0,left:c.lure});break;
   case 'dBlock':if(tg&&tg.hp>0)total+=hitEnemy(D,st,tg,dmgCalc(Math.floor(c.block*f[1])+bonusOf(),c,tg),E);break;
   case 'constrict':if(tg&&tg.hp>0){const n=(tg.st.pact||0)*f[1];if(n)total+=hitEnemy(D,st,tg,dmgCalc(n,c,tg),E);}break;
   case 'ifPaSt':if(tg&&tg.hp>0&&tg.st.pact)addSt(tg,f[1],f[2]);break;
   case 'wait':c.waitNext=1;break;
   case 'needle':if(tg&&tg.hp>0&&tg.st.pact){if(tg.hp<tg.max*.2){const n=tg.st.pact;delete tg.st.pact;E.push({t:'judge',n});total+=hitEnemy(D,st,tg,dmgCalc(f[2]*n,c,tg),E);if(tg.hp<=0&&pas(D,st,'judgeKillHeal3')){pe(E,'judgeKillHeal3');healP(st,OT(D,st,'M02',1)?6:3,E);if(OT(D,st,'M02',3))c.energy++;}if(tg.hp<=0&&c.pw.shell){c.block+=6*c.pw.shell;}}else total+=hitEnemy(D,st,tg,dmgCalc(f[1],c,tg),E);}break;
   case 'killHeal':if(tg&&tg.hp<=0)healP(st,f[1],E);break;
   case 'lk1':if(tg&&tg.hp>0){tg.st.link=Math.max(tg.st.link||0,2+(pas(D,st,'linkPlus1')?(pe(E,'linkPlus1'),OT(D,st,'M03',1)?2:1):0)+(M(st,'embroider')?1:0));}break;
   case 'ifLinkB':if(alive(c).some(e=>e.st.link)){c.block+=f[1];E.push({t:'block',n:f[1]});}break;
   case 'wrap':if(tg&&tg.hp>0){const was=!!tg.st.link;total+=hitEnemy(D,st,tg,dmgCalc(f[1]+bonusOf(),c,tg),E);if(tg.hp>0){if(was){addSt(tg,'pact',2);draw(D,st,1,E);}else tg.st.link=Math.max(tg.st.link||0,2+(pas(D,st,'linkPlus1')?(pe(E,'linkPlus1'),OT(D,st,'M03',1)?2:1):0));}}break;
   case 'dLinked':for(const e of alive(c).filter(e=>e.st.link))total+=hitEnemy(D,st,e,dmgCalc(f[1]+bonusOf(),c,e),E);break;
   case 'noAtkLinked':for(const e of alive(c).filter(e=>e.st.link)){e.stun=1;E.push({t:'stun',uid:e.uid});}break;
   case 'heal':healP(st,f[1],E);break;
   case 'taste':if(tg&&tg.hp>0){tg.hid=0;if(tg.intent&&tg.intent.a)healP(st,f[1],E);}break;
   case 'pool':c.pool=1;break;
   case 'drainH':{const h=Math.floor(total*f[1]);if(h)healP(st,h,E);break;}
   case 'ifHealedA':if(c.healedT)for(const e of alive(c))total+=hitEnemy(D,st,e,dmgCalc(f[1],c,e),E);break;
   case 'stop':c.stop=1;E.push({t:'stopAll'});break;
   case 'dIfN':if(tg&&tg.hp>0)total+=hitEnemy(D,st,tg,dmgCalc((c.nPlay>f[2]?f[3]:f[1])+bonusOf(),c,tg),E);break;
   case 'ifLowDr':if(st.hp<st.maxHp/2)draw(D,st,1,E);break;
   case 'stackTop':{const top=c.draw.splice(Math.max(0,c.draw.length-5));top.sort((a,b)=>(D.cards[a.id].t==='x'?-9:D.cards[a.id].r)-(D.cards[b.id].t==='x'?-9:D.cards[b.id].r));c.draw.push(...top);draw(D,st,2,E);break;}
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
   case 'sendB':c.sendBlock=(c.sendBlock||0)+f[1];break;
   case 'pw':c.pw[f[1]]=(c.pw[f[1]]||0)+f[2];E.push({t:'power',id:f[1]});if(has(st,'blackfeather')){c.block+=4;E.push({t:'block',n:4});}break;
   case 'px2':if(tg.st.pact){tg.st.pact*=2;if(tg.st.pact>=20)E.push({t:'ach',id:'pact20'});}break;
   case 'rw':{const n=c.hand.length;c.disc.push(...c.hand.filter(x=>!x.temp));c.hand=[];draw(D,st,n,E);break;}
  }
  if(!alive(c).length)break;}
 c.lastCard={dmg:total,block:d.fx.filter(f=>f[0]==='b').reduce((a,f)=>a+f[1],0)};
 if(dbl===2){c.ink=OT(D,st,'ink',3)?2:0;E.push({t:'inkUse',n:6});pe(E,'ink6Double');}
 if(d.bl){addAlien(D,st,4,E);st.reso=st.reso||{};st.reso[d.bl]=(st.reso[d.bl]||0)+1;}
 if(gk&&tg&&tg.hp<=0){st.gold+=gk;E.push({t:'gold',n:gk});}
 if(st.hp<=0){c.hand=c.hand;loseRun(D,st,E);return null;}
 if(total>st.stats.dmgMax)st.stats.dmgMax=total;if(total>=30)E.push({t:'ach',id:'big30'});
 if(d.t==='a'){c.atkN++;if(c.atkN===3&&has(st,'bell'))draw(D,st,1,E);}
 if(c.inkDraw){c.inkDraw=0;draw(D,st,1,E);E.push({t:'relic',id:'inkstone'});}
 delete card.kd;
 if(scarN&&isYY(st)){card.scar=(card.scar||0)+scarN;const dk=st.deck.find(x=>x.uid===card.uid);if(dk)dk.scar=card.scar;E.push({t:'scar',n:card.scar});}
 if(card.ring){addAlien(D,st,10,E);delete card.ring;c.ringPlayed=1;}
 if(atk&&total>0&&pas(D,st,'leech')&&(c.leeched||0)<(OT(D,st,'M04',1)?2:1)){c.leeched=(c.leeched||0)+1;const raw=Math.max(2,Math.floor(total*((c.pw.young?(c.pw.youngFull?.45:.35):.25)+(OT(D,st,'M04',3)?.15:0))));const h=Math.min(st.maxHp-st.hp,raw);pe(E,'leech');if(OT(D,st,'M04',2)&&raw>h){c.block+=raw-h;E.push({t:'block',n:raw-h});}if(h>0){c.healedT=1;st.hp=Math.min(st.maxHp,st.hp+h);E.push({t:'heal',n:h});}}
 if(d.t==='s'&&pas(D,st,'hatch')&&c.hatchT!==c.turn&&c.hand.length<handMax(D,st)){c.hatchT=c.turn;pe(E,'hatch');c.hand.push({uid:'x'+st.uid++,id:'b_hatch',up:OT(D,st,'B04',1)?1:0,temp:1,free:1});}
 if(c.scriptDraw){c.scriptDraw=0;draw(D,st,1,E);}if(c.scriptE){c.scriptE=0;c.energy++;}
 if(d.t==='p'&&pas(D,st,'hatch'))for(let hi=0;hi<(OT(D,st,'B04',3)?2:1)&&c.hand.length<handMax(D,st);hi++){pe(E,'hatch');c.hand.push({uid:'x'+st.uid++,id:'b_hatch',up:OT(D,st,'B04',1)?1:0,temp:1,free:1});}
 if(d.t==='s'&&pas(D,st,'moth')&&!c.skillN){c.skillN=1;addAlien(D,st,5,E);}
 if((c.firstCard||0)<(OT(D,st,'B05',2)?2:1)){c.firstCard=(c.firstCard||0)+1;if(pas(D,st,'mimicFirst')){const o=c.hand.filter(x=>D.cards[x.id].t!=='x'&&!x.temp);if(o.length&&c.hand.length<handMax(D,st)){const x=pick(st,o);c.hand.push({uid:'x'+st.uid++,id:x.id,up:x.up,temp:1,free:OT(D,st,'B05',1)?1:undefined});pe(E,'mimicFirst');E.push({t:'mimicCard'});}}}
 c.seqT=((c.seqT||'')+d.t).slice(-2);
 if(atk&&c.pw.nine){const a=alive(c);if(a.length){if(c.pw.nineAll)for(const e of a)addSt(e,'pact',1);else addSt(pick(st,a),'pact',c.pw.nine);}}
 if(c.mix&&c.pair==='BM'&&d.bl){draw(D,st,1,E);c.block+=3;E.push({t:'block',n:3});}
 if(d.t==='s'){c.skillT=1;if(c.pw.song&&!c.sung){c.sung=1;c.block+=3*c.pw.song;E.push({t:'block',n:3*c.pw.song});}}
 if(d.t==='s'&&pas(D,st,'call')&&(c.voiced||0)<(OT(D,st,'voice',2)?2:1)){c.voiced=(c.voiced||0)+1;pe(E,'call');draw(D,st,1,E);if(c.voiced===1&&OT(D,st,'voice',1)){c.block+=2;E.push({t:'block',n:2});}if(c.voiced===1&&OT(D,st,'voice',3)){const a=alive(c);if(a.length)addSt(pick(st,a),'weak',1);}}
 if(d.t==='s'&&pas(D,st,'moth')&&c.mothT!==c.turn){c.mothT=c.turn;draw(D,st,1,E);pe(E,'moth');if(OT(D,st,'M10',1)){const a=alive(c);if(a.length)addSt(pick(st,a),'weak',1);}if(OT(D,st,'M10',2)){c.block+=3;E.push({t:'block',n:3});}if(OT(D,st,'M10',3)&&phaseOf(st)!=='h')draw(D,st,1,E);}
 if(M(st,'obsess')&&!c.obs){c.obs=card.uid;}else if(c.obs2===1&&!card.temp){c.obs2=card.uid;}
 if(d.t!=='p'&&!card.temp){{const o=strip(card);delete o.oil;(d.ex?c.exh:c.disc).push(o);}}
 killCheck(D,st,E);return null;}

function endTurn(D,st,E){const c=st.combat;
 if(c.hand.some(x=>x.ring)&&!c.ringPlayed)c.drawLess=(c.drawLess||0)+1;c.ringPlayed=0;
 if(c.slothClear){c.slothClear=0;for(const x of [...c.hand,...c.disc])delete x.kd;}
 if(c.pw.hold&&st.hp<st.maxHp/2){c.block+=6*c.pw.hold;E.push({t:'block',n:6*c.pw.hold});}
 if(c.mix&&c.pair==='MM')for(const e of alive(c))addSt(e,'pact',2);
 if(c.rule==='drill')for(const e of alive(c))addSt(e,'str',1);
 if(c.pw.split){c.block+=3*c.pw.split;E.push({t:'block',n:3*c.pw.split});}
 if(pas(D,st,'slime')&&OT(D,st,'M06',3)){c.block+=3;E.push({t:'block',n:3});}
 if(pas(D,st,'coral')&&OT(D,st,'M11',3)&&(c.hard||0)>=15){pe(E,'coral');for(const e of alive(c)){e.hp=Math.max(0,e.hp-3);E.push({t:'hit',to:e.uid,n:3,blocked:0});}killCheck(D,st,E);if(st.screen!=='combat')return;}
 if(has(st,'candle')&&c.energy>0){c.block+=4*c.energy;E.push({t:'block',n:4*c.energy});}
 for(const x of c.hand){const xd=D.cards[x.id];if(xd&&xd.endHand&&xd.endHand[0]==='hurt')selfHurt(D,st,xd.endHand[1],E);}
 if(st.hp<=0){loseRun(D,st,E);return;}
 const kp=x=>c.keepAll?!x.temp:(cardDef(D,x).keep||x.hold);const keep=c.hand.filter(kp).map(x=>{delete x.tax;delete x.free;delete x.hold;return x;});c.disc.push(...c.hand.filter(x=>!kp(x)&&!x.temp).map(strip));c.hand=keep;c.keepAll=0;
 if(c.obs2&&c.obs2!==1&&c.obs2!==2){const k=c.disc.findIndex(x=>x.uid===c.obs2);if(k>=0){c.hand.push(c.disc.splice(k,1)[0]);E.push({t:'obsess'});}c.obs2=2;}
 if(c.obs&&c.obs!==1){const k=c.disc.findIndex(x=>x.uid===c.obs);if(k>=0){c.hand.push(c.disc.splice(k,1)[0]);E.push({t:'obsess'});}c.obs=1;}
 if(c.markKeep){c.markKeep=0;const k=c.disc.length-1;if(k>=0){const best=c.disc.slice().sort((a,b)=>cardDef(D,b).c-cardDef(D,a).c)[0];c.disc.splice(c.disc.indexOf(best),1);c.hand.push(best);E.push({t:'bookmark'});}}
 if(keep.length&&c.pw.keepInk)gainInk(st,c,keep.length*c.pw.keepInk,E);
 if(keep.length&&pas(D,st,'keepBlock2')){c.keptB=keep.length*(OT(D,st,'paper',1)?3:2);pe(E,'keepBlock2');if(keep.length>=2&&OT(D,st,'paper',3))c.paperDraw=1;}
 if(TL(st,'cl_write2'))for(const x of keep)x.kd=(x.kd||0)+1;
 if(M(st,'knit'))for(const e of alive(c))if(e.st.link)addSt(e,'pact',1);
 if(pas(D,st,'pactGrow1')){let g=0;const cap=OT(D,st,'M01',1)?12:8;for(const e of alive(c))if(e.st.pact&&e.st.pact<cap){e.st.pact=Math.min(cap,e.st.pact+(OT(D,st,'M01',3)&&e.st.pact>=5?2:1));g=1;}if(g)pe(E,'pactGrow1');
  if(OT(D,st,'M01',2)){for(const e of alive(c))if((e.st.pact||0)>=6){e.hp=Math.max(0,e.hp-3);E.push({t:'hit',to:e.uid,n:3,blocked:0});}killCheck(D,st,E);if(st.screen!=='combat')return;}}
 if(pas(D,st,'coral')&&c.energy>0){pe(E,'coral');const n=c.energy*(OT(D,st,'M11',1)?5:4);c.block+=n;c.hard=(c.hard||0)+n;E.push({t:'block',n});}
 if(c.full&&c.mix){c.mixT--;if(c.mixT<=0){selfHurt(D,st,6,E,false,true);if(st.hp<=0){loseRun(D,st,E);return;}c.full=0;c.mix=0;st.alien=0;st.flags['full'+st.layer]=1;st.flags.mixUsed=1;E.push({t:'recall'});}}
 else if(c.full){selfHurt(D,st,8,E,false,true);if(st.hp<=0){loseRun(D,st,E);return;}
  if(st.ch==='yx'&&c.full<2){c.full=2;}else{c.full=0;st.alien=st.ch==='yx'?60:0;st.flags['full'+st.layer]=1;E.push({t:st.ch==='yx'?'fullEnd':'recall'});}}
 if(keep.length&&has(st,'redbookmark')){c.block+=3;E.push({t:'block',n:3});}
 // 敵人回合
 for(const e of alive(c)){if(e.pblock){e.block=Math.min(e.block,e.pblock);e.pblock=e.block;}else e.block=0;}
 const halfNow=phaseOf(st)==='half';
 for(const e of c.enemies){if(e.hp<=0)continue;if(c.stop){continue;}if(e.stun){delete e.stun;E.push({t:'stunned',uid:e.uid});continue;}
  if(halfNow&&D.enemies[e.id].timid&&alive(c).length>1&&R(st)<.2){e.hp=0;e.dead=1;e.fled=1;E.push({t:'flee',uid:e.uid});continue;}
  const m=e.intent;E.push({t:'enemyAct',uid:e.uid,n:m.n});const EE=D.enemies[e.id];
  if(m.solo){breakthrough(D,st,e,E);if(c.rule==='heal2')hitPlayer(D,st,2,E,null);}
  if(m.tick){e.cd--;}
  if(m.boom){e.cd=EE.cd;}
  if(m.mimic){const L=c.lastCard||{dmg:0,block:0};m.a=L.dmg>0?L.dmg:(L.block?0:EE.mimicBase||0);if(L.block)e.block+=L.block;}
  if(m.realmAll)for(const o of alive(c))if(o!==e)realmUp(D,st,o,1,E);
  if(m.drawLess)c.drawLess=(c.drawLess||0)+m.drawLess;
  if(m.healAlly){const o=alive(c).filter(x=>x!==e);if(o.length){const t=pick(st,o);t.hp=Math.min(t.max,t.hp+m.healAlly);if(c.rule==='heal2'){hitPlayer(D,st,2,E,null);}realmUp(D,st,t,1,E);E.push({t:'allyHeal',uid:t.uid});}}
  if(m.addHand)for(let i=0;i<m.addHand[1];i++)(c.handQ=c.handQ||[]).push(m.addHand[0]);
  if(m.call){e.num=(e.num||0)+1;E.push({t:'call',uid:e.uid,n:e.num});if(e.num===4)c.dumpNext=1;}
  if(m.gaze){if(isYY(st))addAlien(D,st,m.gaze,E);else if(st.ch==='cl'){st.wick=Math.max(1,(st.wick==null?10:st.wick)-3);E.push({t:'wickDrain',n:3});}}
  if(m.grab)(c.grabQ=c.grabQ||[]).push(e.uid);
  if(m.oil){if(hasPart(e,'tube')){if(st.ch==='cl'){if(c.ink){const n=Math.min(c.ink,2);c.ink-=n;E.push({t:'drain',n});}}else c.oilNext=(c.oilNext||0)+1;}else m.a=EE.noPart||0;}
  if(m.sew){const cand=alive(c).filter(x=>x.parts&&x.parts.length<D.enemies[x.id].parts.length);const t=cand.length?pick(st,cand):e;if(t.parts&&t.parts.length<D.enemies[t.id].parts.length){const all=D.enemies[t.id].parts.map(p=>p.id);const miss=all.filter(p=>!t.parts.includes(p));t.parts.unshift(miss[miss.length-1]);t.pd=0;E.push({t:'sewn',uid:t.uid});}t.block+=8;t.pblock=(t.pblock||0)+8;}
  if(m.lung){if(hasPart(e,'nail'))m.a=9;else m.a=0;if(hasPart(e,'horn')){const x={uid:'x'+st.uid++,id:'x_whisper',up:0};c.draw.splice(Math.floor(R(st)*(c.draw.length+1)),0,x);E.push({t:'curseIn'});}}
  if(m.a&&c.shade){m.a=Math.max(0,m.a-c.shade);c.shade=0;}
  if(m.idle){E.push({t:'stunned',uid:e.uid});continue;}
  if(c.rule==='well'&&m.gaze){m.a=(m.a||0)+5;}
  if(m.a&&hasPart(e,'needle'))m.a+=2;
  if(m.a&&e.minus3)m.a=Math.max(0,m.a-3);
  if(e.jb){e.jb--;if(!e.jb){addSt(e,'str',e.jbN||2);e.jbN=0;}}
  if(m.a){const hits=m.h||1;const am=((D.enemies[e.id].boss||D.enemies[e.id].elite)?1:((D.layers[st.layer]||{}).atkMul||1))*(((D.chars[baseCh(st)]||{}).foe||{}).atk||1);for(let h=0;h<hits;h++){const hp0=st.hp;hitPlayer(D,st,dmgCalc(Math.round(m.a*am),e,c),E,e.uid);if(st.hp<hp0&&c.pw.grudge)addSt(e,'pact',c.pw.grudge);if(st.hp<=0)break;}
   if(pas(D,st,'reflect')&&c.mirT!==c.turn&&e.hp>0){c.mirT=c.turn;e.hp=Math.max(0,e.hp-3);E.push({t:'hit',to:e.uid,n:3,blocked:0});pe(E,'reflect');}
   if(c.pw.sting&&e.stingT!==c.turn&&e.hp>0){e.stingT=c.turn;e.hp=Math.max(0,e.hp-3*c.pw.sting);E.push({t:'hit',to:e.uid,n:3*c.pw.sting,blocked:0});}
   if(pas(D,st,'jelly')&&(OT(D,st,'M08',3)?e.jt!==c.turn:!c.jelly)){c.jelly=1;e.jt=c.turn;pe(E,'jelly');const js=OT(D,st,'M08',1)?3:2;if(!e.jb){addSt(e,'str',-js);e.jbN=js;}e.jb=2;if(OT(D,st,'M08',2)){e.hp=Math.max(0,e.hp-3);E.push({t:'hit',to:e.uid,n:3,blocked:0});}}
   if(e.st.pact){const n=e.st.pact+(has(st,'redring')?1:0);e.hp=Math.max(0,e.hp-n);E.push({t:'recoil',to:e.uid,n});if(e.hp<=0&&has(st,'ledger')){st.gold+=8;E.push({t:'relic',id:'ledger'});}}
   if(c.pw.pactThorn)addSt(e,'pact',c.pw.pactThorn);}
  if(m.b)e.block+=m.b;
  if(m.s)addSt(e,m.s[0],m.s[1]);
  if(m.st)addSt(c,m.st[0],m.st[1]);
  if(m.heal)e.hp=Math.min(e.max,e.hp+m.heal);
  const refl=()=>{if(pas(D,st,'reflect')&&(c.reflected||0)<(OT(D,st,'mirror',1)?2:1)){c.reflected=(c.reflected||0)+1;pe(E,'reflect');if(OT(D,st,'mirror',2)){c.block+=6;E.push({t:'block',n:6});}return true;}return false;};
  if(m.tax&&!refl())c.taxNext=(c.taxNext||0)+m.tax;
  if(m.clr==='pact'&&e.st.pact){e.block+=e.st.pact;delete e.st.pact;E.push({t:'clr',uid:e.uid});}
  if(m.drainInk&&c.ink){const n=Math.min(c.ink,m.drainInk);c.ink-=n;E.push({t:'drain',n});}
  if(m.addCard&&!(D.cards[m.addCard[0]].t==='x'&&refl()))for(let i=0;i<m.addCard[1];i++){const x={uid:'x'+st.uid++,id:m.addCard[0],up:0};if(D.cards[m.addCard[0]].t==='x')c.draw.splice(Math.floor(R(st)*(c.draw.length+1)),0,x);else c.disc.push(x);}
  if(m.steal&&!refl())(c.stealQ=c.stealQ||[]).push({uid:e.uid,n:m.steal});
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
 if(st.mode==='g'){st.combat=null;st.gi++;st.stats.floors++;const T=(D.trials||[]).find(t=>t.id===st.trial);E.push({t:'gStage',n:st.gi});
  if(st.gi>=T.stages.length){const P=T.prize||[];st.gpick=shuffle(st,P.slice()).slice(0,3);if(st.gpick.length){st.screen='gpick';}else{st.screen='over';st.result={win:true,g:1};E.push({t:'runEnd',win:true,g:1,trial:st.trial,ch:st.ch,floors:st.gi,memory:(T.memory||10)*T.stages.length});}}
  else{const h=Math.round(st.maxHp*(T.heal||.15));st.hp=Math.min(st.maxHp,st.hp+h);st.screen='gnext';}return;}
 if(st.ch==='gu'){const f=D.enemies[c.enemies[0].id].fac;if(f)st.dossier[f]=(st.dossier[f]||0)+1;}
 if(kind==='boss'&&st.layer===1&&(st.pages||0)>=9)E.push({t:'unlockGu'});if(has(st,'blotter')&&c.ink>=2){st.hp=Math.min(st.maxHp,st.hp+Math.floor(c.ink/2));}
 if(c.hurt===0)E.push({t:'ach',id:'nohit'});
 E.push({t:'ach',id:'first_win'});if(kind==='elite'){st.stats.elites++;E.push({t:'ach',id:'first_elite'});}
 if(has(st,'bandage'))st.hp=Math.min(st.maxHp,st.hp+6);
 const g=D.gold[kind]||D.gold.fight;let gold=ri(st,g[0],g[1]);if(has(st,'purse'))gold=Math.floor(gold*1.5);if(M(st,'greed'))gold=Math.floor(gold*1.5);if(M(st,'pride')&&kind!=='fight')gold*=2;if(kind==='elite'&&(st.kp||[]).includes('m_elite'))gold=Math.floor(gold*1.5);if(kind==='elite'&&M(st,'jewel'))gold+=25;
 if(kind==='elite'&&M(st,'names'))st.namesNext=1;
 if(kind==='elite'&&M(st,'possess')){const can=st.deck.filter(x=>D.cards[x.id].r>0&&D.cards[x.id].t!=='x');if(can.length){const x=pick(st,can);addCard(st,x.id);st.deck[st.deck.length-1].up=x.up;E.push({t:'possess',id:x.id});}}
 if(kind==='elite'&&st.layer===1)E.push({t:'page'});st.gold+=gold;
 if(st.gold>=200)E.push({t:'ach',id:'gold200'});
 const rw={gold,cards:subRoll(D,st)||rollCards(D,st,M(st,'obsess')?2:3,kind!=='fight'),relic:null,relicChoice:null,cardTaken:false};
 if(kind==='elite'){const p=relicPool(D,st);if(p.length){rw.relic=pick(st,p);gainRelic(D,st,rw.relic);}if(M(st,'pride')){const p2=relicPool(D,st);if(p2.length){rw.relic2=pick(st,p2);gainRelic(D,st,rw.relic2);}}}
 if(kind==='boss'){if(st.layer===0){if(st.com==='c_nofix'&&!st.stats.rests)st.comDone=1;if(st.com==='c_quiet'&&!st.stats.elites)st.comDone=1;}if(st.com==='c_letter'&&st.deck.some(x=>x.id==='x_regret'))st.comDone=1;
  st.stats.bosses++;const bid=c.enemies[0].id;E.push({t:'ach',id:{wusign:'boss1',qianhao:'boss2',deepdrill:'boss3',namegate:'boss4',lastpost:'boss5',stationmaster:'boss6'}[bid]});
  const p=shuffle(st,relicPool(D,st)).slice(0,3);rw.relicChoice=p;st.hp=Math.min(st.maxHp,st.hp+Math.ceil((st.maxHp-st.hp)*.75));}
 if(st.relics.length>=6)E.push({t:'ach',id:'relic6'});
 st.reward=rw;st.combat=null;st.screen='reward';E.push({t:'win',kind,gold});}
function loseRun(D,st,E){const c=st.combat;const k=c&&c.lastSrc&&c.enemies.find(x=>x.uid===c.lastSrc);
 if(st.mode==='g'){st.screen='over';st.result={win:false,g:1};st.combat=null;E.push({t:'runEnd',win:false,g:1,ch:st.ch,floors:st.gi,memory:st.gi*((D.trials.find(t=>t.id===st.trial)||{}).memory||10)});return;}
 {const can=st.deck.filter(x=>D.cards[x.id].r>0&&D.cards[x.id].t!=='x');if(can.length){const x=pick(st,can);E.push({t:'leftCard',card:{id:x.id,up:x.up,scar:x.scar||0,ch:baseCh(st),ttl:3}});}}st.screen='over';st.result={win:false,killer:k?k.id:null};st.combat=null;E.push({t:'runEnd',win:false,killer:k?k.id:null,chapter:st.chapter||1,fourth:st.fourthN!=null?1:0,dot:st.flags.dot?1:0,desire:st.desire,com:comOk(st)?st.com:null,ch:st.ch,origin:st.origin,ph:st.stats.ph,persona:st.persona,hobby:st.hobby,floors:st.stats.floors,memory:memoryOf(D,st,false),tcom:tcomList(D,st,false)});}
function tcomOk(D,st,need,win){const S=st.stats||{};for(const k in need){const v=need[k];switch(k){
 case 'win':if(!win)return false;break;case 'floors':if((S.floors||0)<v)return false;break;case 'kills':if((S.kills||0)<v)return false;break;
 case 'elites':if((S.elites||0)<v)return false;break;case 'gold':if(st.gold<v)return false;break;case 'hp':if(st.hp<st.maxHp*v)return false;break;
 case 'deck':if(st.deck.length>v)return false;break;case 'cards':if(st.deck.length<v)return false;break;case 'played':if((S.cards||0)<v)return false;break;
 case 'relics':if(st.relics.length<v)return false;break;case 'rests':if((S.rests||0)>v)return false;break;case 'restsMin':if((S.rests||0)<v)return false;break;
 case 'alienMax':if((st.alien||0)>v)return false;break;case 'transformed':if(!(S.ph&&S.ph.full))return false;break;case 'sent':if((S.sent||0)<v)return false;break;
 default:return false;}}return true;}
function tcomList(D,st,win){if(st.mode==='g'||st.ch==='gu')return [];return [st.persona,st.desire,st.hobby].filter(t=>t&&(D.tcom||{})[t]&&tcomOk(D,st,D.tcom[t].need,win));}
function comOk(st){if(!st.com)return false;const S=st.stats;if(st.com==='c_greed'&&st.gold>=300)return true;if(st.com==='c_return'&&(S.sent||0)>=3)return true;
 if(st.com==='c2_full'&&st.flags.transformed)return true;if(st.com==='c2_scar'&&st.deck.some(x=>(x.scar||0)>=9))return true;if(st.com==='c2_curse'&&st.deck.filter(x=>x.id&&x.id.startsWith('x_')).length>=3&&st.result&&st.result.win)return true;
 if(st.com==='c2_light'&&st.flags.lit)return true;if(st.com==='c2_thin'&&st.deck.length<=12&&st.result&&st.result.win)return true;if(st.com==='c2_noshop'&&!S.bought&&st.result&&st.result.win)return true;if(st.com==='c2_kill'&&(S.kills||0)>=30)return true;if(st.com==='c2_mix'&&st.flags.mixUsed)return true;
 return !!st.comDone;}
function memoryOf(D,st,win){const M=D.memory;return st.stats.floors*M.perFloor+st.stats.elites*M.perElite+st.stats.bosses*M.perBoss+(win?M.win:0);}

// ── 地圖
function canMove(D,st,c){const map=st.maps[st.layer];if(c==='boss')return st.row===D.map.rows-1;if(M(st,'dread')&&typeof c==='number'){const row=map.rows[st.row+1];if(row&&row[c]&&row[c].t==='elite')return false;}if(st.row===-1)return c>=0&&c<D.map.cols;if(st.row>=D.map.rows-1)return false;return map.rows[st.row][st.col].e.includes(c);}
function enter(D,st,c,E){const L=D.layers[st.layer];st.stats.floors++;
 if(c==='boss'){st.row=D.map.rows;startCombat(D,st,[L.boss],'boss').forEach(x=>E.push(x));E.push({t:'boss',id:L.boss});return;}
 st.row++;st.col=c;const nd=st.maps[st.layer].rows[st.row][c];let t=nd.t;if(t==='mystery'){t=nd.q||'event';E.push({t:'mystery',to:t});}E.push({t:'enter',node:t});
 if(t==='altar'){st.event={id:'altar',done:null};st.screen='event';return;}
 if(t==='fight'){const set=pick(st,L.fights);startCombat(D,st,set,'fight').forEach(x=>E.push(x));}
 else if(t==='elite'){const el=pick(st,L.elites);startCombat(D,st,Array.isArray(el)?el:[el],'elite').forEach(x=>E.push(x));}
 else if(t==='rest'){st.screen='rest';if(st.com==='c_lamp'&&st.layer>=1)st.comDone=1;}
 else if(t==='chest'){const p=relicPool(D,st);const id=p.length?pick(st,p):null;if(id)gainRelic(D,st,id);else st.gold+=50;st.reward={chest:id,gold:id?0:50};st.screen='chest';if(st.relics.length>=6)E.push({t:'ach',id:'relic6'});}
 else if(t==='shop'){if(M(st,'greed'))addAlien(D,st,10,E);st.shop=genShop(D,st);st.screen='shop';}
 else if(t==='event'){const myT=[st.persona,st.desire,st.hobby].filter(Boolean);const okEv=e=>!e.special&&(!e.chap||e.chap===(st.chapter||1))&&(!e.ch||e.ch===baseCh(st))&&!(e.hob&&(st.hob||[]).includes(e.hob))&&(!e.tag||myT.includes(e.tag));let ev=D.events.filter(e=>okEv(e)&&!st.seenEv.includes(e.id));if(!ev.length){st.seenEv=[];ev=D.events.filter(okEv);}const tev=ev.filter(e=>e.tag);let e=(tev.length&&R(st)<.45)?pick(st,tev):pick(st,ev);if(st.left&&!st.flags.leftSeen&&st.layer===0){st.flags.leftSeen=1;e=D.events.find(x=>x.id==='left_card')||e;}else st.seenEv.push(e.id);st.event={id:e.id,done:null};if(has(st,'map'))st.gold+=15;st.screen='event';}}
function genShop(D,st){const P=D.shop;const cs=[];const p=pool(D,st);const used=new Set();for(let i=0;i<5+(isYY(st)&&phaseOf(st)==='h'?1:0)+(M(st,'greed')?1:0);i++){const left=p.filter(k=>!used.has(k));if(!left.length)break;let id=pick(st,left);if(M(st,'pride')&&D.cards[id].r<3){const up=p.filter(k=>D.cards[k].r===D.cards[id].r+1&&!used.has(k));if(up.length)id=pick(st,up);}used.add(id);const r=D.cards[id].r;cs.push({id,price:Math.round(P.card[r-1]*(.9+R(st)*.2)*Math.max(.5,(M(st,'queen')?1.2:1)*(pas(D,st,'shop20')?(OT(D,st,'B02',3)?.7:.8):1)*(TL(st,'yy_greed1b')?.9:1)*((st.kp||[]).includes('m_shop')?.9:1))*(M(st,'pride')?1.1:1)),sold:false});}
 const rp=shuffle(st,relicPool(D,st)).slice(0,2).map(id=>({id,price:ri(st,P.relic[0],P.relic[1]),sold:false}));const dx=st.desire&&D.shopX&&D.shopX[st.desire];return {cards:cs,relics:rp,removed:false,removeCost:P.remove,x:dx?{id:st.desire,price:dx.price,sold:false}:null};}

function warpMap(D,st,m){if(M(st,'books')||(st.kp||[]).includes('m_map'))for(const r of m.rows)for(const n of r)if(n.t==='mystery')n.seen=1;st.layerCorrupt=st.layerCorrupt||{};const a=isYY(st)?(st.alien||0):0;st.layerCorrupt[st.layer]=a;const mid=[];m.rows.forEach((r,ri)=>{if(ri>0&&ri<m.rows.length-1)r.forEach(n=>mid.push(n));});
 if(a>=40){const r=mid.find(n=>n.t==='rest');if(r)r.t='fight';const f=mid.find(n=>n.t==='fight'&&n!==r);if(f)f.t='shop';for(const n of mid)if(n.t==='mystery')n.seen=1;}
 if(st.layer>0&&st.flags['full'+(st.layer-1)]){const f=mid.filter(n=>n.t==='fight');if(f.length){const n=f[Math.floor(f.length/2)];n.t='elite';n.nest=1;}}
 return m;}
function nextAfterBoss(D,st,E){if(M(st,'home'))st.hp=Math.min(st.maxHp,st.hp+15);if(st.homeBonus){st.hp=Math.min(st.maxHp,st.hp+st.homeBonus);st.homeBonus=0;}st.layer++;if(st.layer>=(st.endLayer||3)){st.screen='over';st.result={win:true};E.push({t:'ach',id:'win_'+st.ch});if(st.chapter===2)E.push({t:'ach',id:'win_ch2'});E.push({t:'runEnd',win:true,chapter:st.chapter||1,fourth:st.fourthN!=null?1:0,dot:st.flags.dot?1:0,desire:st.desire,com:comOk(st)?st.com:null,ch:st.ch,origin:st.origin,ph:st.stats.ph,persona:st.persona,hobby:st.hobby,floors:st.stats.floors,memory:memoryOf(D,st,true),tcom:tcomList(D,st,true)});return;}
 st.row=-1;st.col=null;st.maps[st.layer]=warpMap(D,st,genMap(D,st,st.layer));st.screen='map';E.push({t:'layer',n:st.layer});}
function backToMap(D,st,E){st.reward=null;st.event=null;st.shop=null;st.pick=null;if(st.row>=D.map.rows){nextAfterBoss(D,st,E);return;}st.screen='map';if(st.deck.length>=25)E.push({t:'ach',id:'deck25'});}

// ── 事件結果
function evOpts(D,st,ev){const o=ev.opts.slice();const X=D.evX&&D.evX[st.persona];if(X&&!ev.special)o.push(X);return o;}
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
  if(r.next){st.next=st.next||{};for(const k in r.next)st.next[k]=(st.next[k]||0)+r.next[k];}
  if(r.flame)E.push({t:'flame'});
  if(r.dot)st.flags.dot=1;
  if(r.queen){if(st.gold>=15){st.gold-=15;addCard(st,'n_lantern');out.push({card:'n_lantern'});}else{addAlien(D,st,8,E);out.push({kicked:1});}}
  if(r.sly){if(R(st)<.7){const p=relicPool(D,st);if(p.length){const id=pick(st,p);gainRelic(D,st,id);out.push({relic:id});}}else{if(st.gold>=40)st.gold-=40;else{st.hp=Math.max(1,st.hp-8);}out.push({caught:1});}}
  if(r.petty){if(st.grudgeList&&st.grudgeList.length){st.pettyNext=1;st.grudges=st.grudgeList.slice();out.push({petty:1});}else{st.next=st.next||{};st.next.block=(st.next.block||0)+8;}}
  if(r.curious){if(R(st)<.7)pend={mode:'choose',cards:rollCards(D,st,3,false)};else{addAlien(D,st,10,E);out.push({curse:1});}}
  if(r.relicRandom){const p=relicPool(D,st);if(p.length){const id=pick(st,p);gainRelic(D,st,id);out.push({relic:id});}}
  if(r.upgradeRandom)for(let k=0;k<r.upgradeRandom;k++){const up=st.deck.filter(c=>!c.up&&D.cards[c.id].u);if(up.length){const c=pick(st,up);c.up=1;out.push({upgraded:c.id});}}
  if(r.cardRare){const p=pool(D,st,3);if(p.length){const id=pick(st,p);addCard(st,id);out.push({card:id});}}
  if(r.cardPick)pend={mode:'choose',cards:rollCards(D,st,3,false)};
  if(r.removePick)pend={mode:'remove'};
  if(r.transformPick)pend={mode:'transform'};}
 return {out,pend};}

// ── 主要入口
function apply(D,st0,a){const st=clone(st0);CUR=st;const E=[];const fail=e=>({ok:false,error:e});
 if(st.screen==='over')return fail('這一局已經結束');
 switch(a.type){
  case 'MOVE':if(st.screen!=='map')return fail('現在不能移動');if(!canMove(D,st,a.c))return fail('走不到那裡');enter(D,st,a.c,E);break;
  case 'PLAY':{if(st.screen!=='combat')return fail('不在戰鬥中');const e=play(D,st,a.i,a.target,E);if(e)return fail(e);break;}
  case 'END_TURN':if(st.screen!=='combat')return fail('不在戰鬥中');endTurn(D,st,E);break;
  case 'PICK_CARD':{if(st.screen!=='reward'||st.reward.cardTaken)return fail('不能選');const id=st.reward.cards[a.i];if(!id)return fail('沒有這張');addCard(st,id);st.reward.cardTaken=true;E.push({t:'gotCard',id});break;}
  case 'SKIP_CARD':if(st.screen!=='reward')return fail('不能跳過');st.reward.cardTaken=true;break;
  case 'PICK_RELIC':{if(st.screen!=='reward'||!st.reward.relicChoice)return fail('不能選');const id=st.reward.relicChoice[a.i];if(!id)return fail('沒有這件');gainRelic(D,st,id);st.reward.relicChoice=null;st.reward.relicTaken=id;break;}
  case 'LEAVE':if(!['reward','chest','shop','event','rest'].includes(st.screen))return fail('不能離開');if(st.screen==='reward'&&st.reward.relicChoice)return fail('先選一件遺物');backToMap(D,st,E);break;
  case 'REST':if(st.screen!=='rest'||st.flags.rested)return fail('不能休息');{let n=Math.floor((st.maxHp*.3)*(M(st,'spite')?.5:1))+(has(st,'teapot')?15:0)+((st.kp||[]).includes('m_rest')?5:0)+((st.kp||[]).includes('m_rest2')?5:0)+(M(st,'glutton')?10:0)+((st.tt&&st.tt.rest)||0);if(has(st,'borrowedheart'))n=Math.floor(n/2);st.hp=Math.min(st.maxHp,st.hp+n);st.stats.rests=(st.stats.rests||0)+1;E.push({t:'heal',n});backToMap(D,st,E);}break;
  case 'SLEEP':if(st.screen!=='rest'||!M(st,'lazy'))return fail('不能睡');st.hp=st.maxHp;addAlien(D,st,15,E);E.push({t:'heal',n:st.maxHp});backToMap(D,st,E);break;
  case 'TEA':if(st.screen!=='rest'||!M(st,'tea'))return fail('沒有茶具');addCard(st,'yy_restrain');E.push({t:'tea'});backToMap(D,st,E);break;
  case 'WRITE':if(st.screen!=='rest'||!M(st,'letters')||st.flags.wrote)return fail('現在不能寫信');if(st.gold<30)return fail('要留 30 渡鴉幣在信封裡');st.gold-=30;st.flags.wrote=1;E.push({t:'letter',n:30});break;
  case 'SMITH':if(st.screen!=='rest')return fail('不能強化');if(M(st,'grudge'))return fail('怨氣太重，靜不下來磨牌');{const c=st.deck.find(x=>x.uid===a.uid);if(!c||c.up||!D.cards[c.id].u)return fail('這張不能強化');c.up=1;E.push({t:'upgraded',id:c.id});backToMap(D,st,E);}break;
  case 'BUY_CARD':{st.stats.bought=(st.stats.bought||0)+1;if(st.screen!=='shop')return fail('不在商店');const it=st.shop.cards[a.i];if(!it||it.sold)return fail('賣完了');if(st.gold<it.price)return fail('渡鴉幣不夠');st.gold-=it.price;it.sold=true;addCard(st,it.id);E.push({t:'gotCard',id:it.id});break;}
  case 'BUY_RELIC':{if(st.screen!=='shop')return fail('不在商店');st.stats.bought=(st.stats.bought||0)+1;if(M(st,'home'))return fail('想回家的人，不帶多餘的東西');const it=st.shop.relics[a.i];if(!it||it.sold)return fail('賣完了');if(st.gold<it.price)return fail('渡鴉幣不夠');st.gold-=it.price;it.sold=true;gainRelic(D,st,it.id);if(st.relics.length>=6)E.push({t:'ach',id:'relic6'});break;}
  case 'REMOVE':{if(st.screen!=='shop'&&!(st.pick&&st.pick.mode==='remove'))return fail('不能移除');if(M(st,'remember'))return fail('每一張都捨不得拿掉');const i=st.deck.findIndex(x=>x.uid===a.uid);if(i>=0&&D.cards[st.deck[i].id].noRemove)return fail('這張牌不能被移除');if(i<0)return fail('沒有這張');
   if(st.screen==='shop'){if(st.shop.removed)return fail('這間店只能移除一次');if(st.gold<st.shop.removeCost)return fail('渡鴉幣不夠');st.gold-=st.shop.removeCost;st.shop.removed=true;st.shop.removeCost+=25;}
   else st.pick=null;st.deck.splice(i,1);if(M(st,'bookmark'))st.marks=(st.marks||0)+1;E.push({t:'removed'});break;}
  case 'TRANSFORM':{if(!(st.pick&&st.pick.mode==='transform'))return fail('不能轉換');const c=st.deck.find(x=>x.uid===a.uid);if(!c)return fail('沒有這張');if(D.cards[c.id].noRemove)return fail('這張牌不能被換掉');const p=pool(D,st).filter(k=>k!==c.id);c.id=pick(st,p);c.up=0;st.pick=null;E.push({t:'transformed',id:c.id});break;}
  case 'CHOOSE':{if(!(st.pick&&st.pick.mode==='choose'))return fail('不能選');if(a.i!=null){const id=st.pick.cards[a.i];if(!id)return fail('沒有這張');addCard(st,id);E.push({t:'gotCard',id});}st.pick=null;break;}
  case 'EVENT':{if(st.screen!=='event'||st.event.done)return fail('不能選');const ev=D.events.find(e=>e.id===st.event.id);const opt=evOpts(D,st,ev)[a.i];if(!opt)return fail('沒有這個選項');if(opt.per&&opt.per!==st.persona)return fail('沒有這個選項');if(opt.need&&opt.need.gold&&st.gold<opt.need.gold)return fail('渡鴉幣不夠');
   const {out,pend}=applyEvent(D,st,opt,E);st.event.done={i:a.i,out};if(pend){if(pend.mode==='remove'&&!st.deck.length){}else st.pick=pend;}break;}
  case 'PREP_RELIC':{if(st.screen!=='prep'||!st.prep.relics)return fail('不能選');const id=st.prep.relics[a.i];if(!id)return fail('沒有這件');gainRelic(D,st,id);st.prep.relics=null;E.push({t:'relicGot',id});break;}
  case 'PREP_REMOVE':{if(st.screen!=='prep'||!st.prep.remove)return fail('不能移除');const i=st.deck.findIndex(x=>x.uid===a.uid);if(i<0)return fail('沒有這張');st.deck.splice(i,1);st.prep.remove=0;E.push({t:'removed'});break;}
  case 'PREP_CARD':{if(st.screen!=='prep'||!st.prep.cards)return fail('不能選');const id=st.prep.cards[a.i];if(!id)return fail('沒有這張');addCard(st,id);st.prep.cards=null;break;}
  case 'PREP_DONE':if(st.screen!=='prep')return fail('不在出發準備');st.prep=null;st.screen='map';break;
  case 'REROLL_MAP':{if(st.screen!=='map'||st.row!==-1)return fail('只能在這一層還沒走之前換');if(!(st.kp||[]).includes('m_skip'))return fail('還沒有第二張地圖');const k='rr'+st.layer;if(st.flags[k])return fail('這一層已經換過了');st.flags[k]=1;st.maps[st.layer]=genMap(D,st,st.layer);E.push({t:'reroll'});break;}
  case 'PURGE':{if(st.screen!=='rest'||!(st.kp||[]).includes('m_purge'))return fail('不能燒');const i=st.deck.findIndex(x=>x.uid===a.uid);if(i<0||D.cards[st.deck[i].id].t!=='x')return fail('只能燒詛咒');const id=st.deck[i].id;st.deck.splice(i,1);E.push({t:'purged',id});backToMap(D,st,E);break;}
  case 'BUY_E':{if(st.screen!=='combat'||!TL(st,'yy_greed2'))return fail('還不會');const c=st.combat;if(c.boughtE)return fail('這回合已經買過了');if(st.gold<30)return fail('渡鴉幣不夠（要 30）');st.gold-=30;c.energy++;c.boughtE=1;E.push({t:'tal',k:'yy_greed2'});break;}
  case 'G_NEXT':{if(st.screen!=='gnext')return fail('現在不能開打');const T=(D.trials||[]).find(t=>t.id===st.trial);const sg=T&&T.stages[st.gi];if(!sg)return fail('沒有下一場');st.layer=sg.l;const L=D.layers[sg.l];let ids;if(sg.ids)ids=sg.ids;else if(sg.k==='boss')ids=[L.boss];else if(sg.k==='elite'){const el=pick(st,L.elites);ids=Array.isArray(el)?el:[el];}else ids=pick(st,L.fights);st.tRule=sg.rule||null;startCombat(D,st,ids,sg.k).forEach(x=>E.push(x));st.tRule=null;break;}
  case 'BUY_X':{if(st.screen!=='shop'||!st.shop.x||st.shop.x.sold)return fail('沒有這件');const X=st.shop.x,id=X.id;if(st.gold<X.price)return fail('渡鴉幣不夠');if(id==='vanity'&&(st.alien||0)>=40)return fail('現在不要照。');st.gold-=X.price;X.sold=true;st.next=st.next||{};
   if(id==='greed'){const p=pool(D,st);for(const it of st.shop.cards.filter(x=>!x.sold).slice(0,2)){it.id=pick(st,p);}}
   else if(id==='glutton')healP(st,10,E);else if(id==='grudge')st.next.pact=(st.next.pact||0)+1;else if(id==='obsess')st.next.obs=1;
   else if(id==='vanity'){const p=pool(D,st);const nid=pick(st,p);st.shop.cards.push({id:nid,price:Math.round(D.shop.card[D.cards[nid].r-1]),sold:false});}
   else if(id==='envy'){const p=relicPool(D,st);if(p.length){const r=pick(st,p);gainRelic(D,st,r);E.push({t:'relicGot',id:r});}}
   else if(id==='wrath'){st.next.str=2;st.shop.cards.forEach(x=>x.sold=true);st.shop.relics.forEach(x=>x.sold=true);E.push({t:'smash'});backToMap(D,st,E);}
   else if(id==='home')st.homeBonus=(st.homeBonus||0)+5;else if(id==='letter')st.next.draw=(st.next.draw||0)+1;else if(id==='guard')st.next.shade=3;else if(id==='remember')st.next.flame=1;
   E.push({t:'boughtX',id});break;}
  case 'HOLD':{if(st.screen!=='combat'||!TL(st,'cl_write1b'))return fail('還不會');const c=st.combat;if(c.held)return fail('這一場已經夾過書籤了');const x=c.hand[a.i];if(!x)return fail('沒有這張');x.hold=1;c.held=1;E.push({t:'hold'});break;}
  case 'PEEK_SWAP':{if(st.screen!=='combat'||!pas(D,st,'whisper'))return fail('聽不見');const c=st.combat;if((c.swapN||0)>=(OT(D,st,'B09',2)?2:1)&&c.swapped===c.turn)return fail('這回合已經換過了');if(c.draw.length<3)return fail('抽牌堆不夠三張');if(c.swapped!==c.turn)c.swapN=0;c.swapN=(c.swapN||0)+1;c.swapped=c.turn;pe(E,'whisper');if(OT(D,st,'B09',3)){c.block+=3;E.push({t:'block',n:3});}const L=c.draw.length;const t=c.draw[L-1];c.draw[L-1]=c.draw[L-3];c.draw[L-3]=t;if(!OT(D,st,'B09',1))selfHurt(D,st,2,E);if(st.hp<=0){loseRun(D,st,E);}break;}
  case 'SIGN':{if(st.screen!=='combat'||!pas(D,st,'pactSwap'))return fail('沒有契約可簽');const c=st.combat;if((c.signed||0)>=(OT(D,st,'B11',1)?2:1))return fail('這一場已經簽過了');const x=c.hand[a.i];const e=c.enemies.find(z=>z.uid===a.uid&&z.hp>0);if(!x||!e)return fail('要選一張手牌和一個敵人');c.signed=(c.signed||0)+1;if(OT(D,st,'B11',2))c.energy++;if(OT(D,st,'B11',3))addSt(e,'pact',3);c.hand.splice(a.i,1);if(!x.temp)c.exh.push(strip(x));pe(E,'pactSwap');
   const m=e.intent||{};if(m.a){const n=dmgCalc(m.a,e,c)*(m.h||1);c.block+=n;E.push({t:'block',n});}else draw(D,st,2,E);e.intent={i:-1,n:'停手',idle:1};E.push({t:'lie',uid:e.uid});break;}
  case 'RETRIEVE':{if(st.screen!=='combat'||st.ch!=='cl'||!st.sub)return fail('不能收回');const c=st.combat;if(c.retrieved)return fail('這一場已經收回過了');const k=c.exh.findIndex(x=>D.cards[x.id].bl===st.sub);if(k<0)return fail('消耗堆裡沒有副面貌的牌');c.retrieved=1;c.hand.push(c.exh.splice(k,1)[0]);break;}
  case 'G_PICK':{if(st.screen!=='gpick')return fail('現在不能選');const id=st.gpick[a.i];if(!id)return fail('沒有這張');const T=(D.trials||[]).find(t=>t.id===st.trial);st.screen='over';st.result={win:true,g:1};E.push({t:'runEnd',win:true,g:1,gCard:id,trial:st.trial,ch:st.ch,floors:st.gi,memory:(T.memory||10)*T.stages.length});break;}
  case 'EYE':{if(st.screen!=='combat'||st.ch!=='gu')return fail('沒有義眼');const c=st.combat;if(c.eyeUsed)return fail('這一場已經用過了');const e=c.enemies.find(x=>x.uid===a.uid&&x.hp>0);if(!e)return fail('沒有這個敵人');c.eyeUsed=1;e.hid=0;c.eye=e.uid;E.push({t:'eye',uid:e.uid});break;}
  case 'TEAR':{if(st.screen!=='combat')return fail('不在戰鬥中');const c=st.combat;const x=c.hand[a.i];if(!x||!D.cards[x.id].purge)return fail('這張撕不掉');if(c.energy<1)return fail('能量不夠');c.energy--;c.hand.splice(a.i,1);E.push({t:'torn',id:x.id});break;}
  case 'SEND':{if(st.screen!=='combat'||st.ch!=='cl')return fail('只有克勞德能送回');const c=st.combat;const e=c.enemies.find(x=>x.uid===a.uid&&x.hp>0);if(!e)return fail('沒有這個敵人');const isB=D.enemies[e.id].boss;if(c.rule==='drill')return fail('這一場不能送回');if(isB&&!TL(st,'cl_lamp2'))return fail('首領不能送回');
   if(!(e.hp<e.max*(isB?.1:sendRate(D,st))))return fail('牠還不想走');const freeSend=OT(D,st,'window',3)&&!c.freeSent;if(c.energy<1&&!freeSend)return fail('能量不夠');if(freeSend){c.freeSent=1;c.energy++;}
   if(pas(D,st,'window')){c.energy--;pe(E,'window');}
   else if(a.pay==='hp'){c.energy--;selfHurt(D,st,TL(st,'cl_lamp1')?2:4,E,false,true);if(st.hp<=0){loseRun(D,st,E);break;}}
   else{const x=c.hand[a.pay];if(!x)return fail('要選一張手牌');c.energy--;c.hand.splice(a.pay,1);if(!x.temp)c.exh.push(strip(x));}
   e.hp=0;e.sent=1;st.stats.sent=(st.stats.sent||0)+1;E.push({t:'sent',uid:e.uid,id:e.id});if(pas(D,st,'lampOil')){pe(E,'lampOil');draw(D,st,1,E);if(OT(D,st,'lamp',2))healP(st,3,E);}if(OT(D,st,'window',2)){c.block+=4;E.push({t:'block',n:4});}if(c.sendBlock){c.block+=c.sendBlock;E.push({t:'block',n:c.sendBlock});}if(c.flame2)E.push({t:'flame'});if(M(st,'remember'))E.push({t:'sent',uid:e.uid,id:e.id,extra:1});
   if(M(st,'lamps')){st.flags.wh=!st.flags.wh;if(!st.flags.wh)st.wick=(st.wick==null?10:st.wick)-1;}else st.wick=(st.wick==null?10:st.wick)-1;if(st.wick<=0){st.wick=10;st.lamp=(st.lamp||0)+1;E.push({t:'lampReady'});}
   killCheck(D,st,E);break;}
  case 'LAMP':{if(st.screen!=='combat'||!(st.lamp>0))return fail('燈還沒亮');const c=st.combat;if(c.stop)return fail('這一回合已經照過了');st.lamp--;c.stop=1;st.flags.lit=1;E.push({t:'lampLight'});if(TL(st,'cl_lamp1b'))E.push({t:'flame'});break;}
  case 'QUIT':{st.combat=null;st.screen='over';st.result={win:false,quit:true};E.push({t:'runEnd',win:false,quit:true,chapter:st.chapter||1,fourth:st.fourthN!=null?1:0,dot:st.flags.dot?1:0,desire:st.desire,com:comOk(st)?st.com:null,ch:st.ch,origin:st.origin,ph:st.stats.ph,persona:st.persona,hobby:st.hobby,floors:st.stats.floors,memory:memoryOf(D,st,false),tcom:[]});break;}
  default:return fail('不明的指令');}
 if(!st0.combat&&st.combat){const s0=clone(st0);delete s0.pre;st.pre={s:s0,a};}
 if(!st.combat&&st.pre)delete st.pre;
 return {ok:true,state:st,events:E};}

function sendRate(D,st){return (pas(D,st,'window')?(OT(D,st,'window',1)?.4:.35):.25)+(M(st,'gentle')?.05:0)+((st.combat&&st.combat.sendUp)||0);}
// ── 存檔（v:2）：戰鬥中只存戰前狀態，讀檔時重跑進場那一步（同一個種子，結果一樣）
function saveForm(st){if(!st)return null;if(st.pre)return Object.assign(clone(st.pre.s),{v:2,resume:st.pre.a});return st;}
function migrateRun(D,s){if(!s)return null;s=clone(s);
 const C0=D.chars[s.ch]||{};if(s.origin===undefined)s.origin=C0.origin||null;if(s.alien==null)s.alien=0;if(s.wick==null)s.wick=10;if(!s.endLayer){s.endLayer=3;s.chapter=1;}if(s.lamp==null)s.lamp=0;s.reso=s.reso||{};s.stats.ph=s.stats.ph||{h:0,half:0,full:0};
 if((s.v||1)<2){s.v=2;s.kp=s.kp||[];s.flags=s.flags||{};
  if(s.combat){const c=s.combat,L=D.layers[s.layer]||{};const got=c.enemies.map(e=>e.id);let ids;
   if(c.kind==='boss')ids=[L.boss];else if(c.kind==='elite')ids=[got[0]];else ids=(L.fights||[]).find(set=>set.every((id,i)=>got[i]===id))||[got[0]];
   s.combat=null;startCombat(D,s,ids,c.kind);}}
 return s;}
function loadRun(D,s){s=migrateRun(D,s);if(!s)return null;if(s.resume){const a=s.resume;delete s.resume;const r=apply(D,s,a);if(r.ok)return r.state;}return s;}

// ── 永久進度（回憶、成就、圖鑑）
function profOf(meta,ch){ch=ch==='yx'?'yy':ch;meta.prof=meta.prof||{};meta.prof[ch]=meta.prof[ch]||{xp:0,pts:0,spent:[]};const p=meta.prof[ch];if(p.pts==null)p.pts=Math.floor((p.xp||0)/25);return p;}
const LV=xp=>Math.floor(xp/25);
function tagOf(meta,k){meta.tm=meta.tm||{};if(!meta.tm[k])meta.tm[k]={pts:1,spent:[],runs:0};return meta.tm[k];}
function metaTTal(D,meta0,k,tier){const meta=migrateMeta(meta0);const T=(D.tagtal||{})[k];if(!T||!T[tier-1])return {ok:false,error:'沒有這個天賦'};const o=tagOf(meta,k);if(o.spent.includes(tier))return {ok:false,error:'已經學會了'};
 if(tier===2){if(!o.spent.includes(1))return {ok:false,error:'要先學會低語'};if((meta.echo||0)<60)return {ok:false,error:'殘響不夠（要 60）'};meta.echo-=60;}else{if((o.pts||0)<2)return {ok:false,error:'熟練不夠（要 2 點）'};o.pts-=2;}o.spent.push(tier);return {ok:true,meta};}
function tagDefOf(D,tg){return (D.personas||{})[tg]||(D.desires||{})[tg]||(D.hobbies||{})[tg]||null;}
function tagFx(D,st,ops,E,start){const c=st.combat;for(const f of ops||[]){const n=f[1];const A=c?alive(c):[];switch(f[0]){
 case 'b':if(!c)break;if(start)c.b0=(c.b0||0)+n;else{c.block+=n;E.push({t:'block',n});}break;
 case 'bLow':if(c&&st.hp<st.maxHp/2){c.block+=n;E.push({t:'block',n});}break;
 case 'heal':healP(st,n,E);break;case 'hurt':selfHurt(D,st,n,E,true,true);break;
 case 'gold':st.gold+=n;E.push({t:'gold',n});break;
 case 'st':if(!c)break;if(f[3]==='a')for(const e of A)addSt(e,f[1],f[2]);else if(A.length)addSt(pick(st,A),f[1],f[2]);break;
 case 'link':if(A.length){const e=pick(st,A);e.st.link=Math.max(e.st.link||0,2);}break;
 case 'dr':if(!c)break;if(start)c.extraDraw0=(c.extraDraw0||0)+n;else draw(D,st,n,E);break;
 case 'drc':if(c&&R(st)*100<f[2])draw(D,st,n,E);break;
 case 'en':if(!c)break;if(start)c.e1=(c.e1||0)+n;else c.energy+=n;break;
 case 'en1':if(c&&c.ttE!==c.turn){c.ttE=c.turn;c.energy+=n;}break;
 case 'ink':if(c)c.ink+=n;break;
 case 'al':if(n<0)st.alien=Math.max(st.ch==='yx'?40:0,(st.alien||0)+n);else addAlien(D,st,n,E);break;
 case 'str':if(c)addSt(c,'str',n);break;
 case 'vine':if(c)for(const e of A)addSt(e,'vine',n);break;
 case 'hard':if(c){c.block+=n;c.hard=(c.hard||0)+n;}break;}}}
function otOf(meta,k){meta.om=meta.om||{};if(!meta.om[k])meta.om[k]={pts:2,spent:[]};return meta.om[k];}
function otLeft(D,o){return (o.pts||0)-o.spent.reduce((a,id)=>a+(((D.otal||{})[id]||{}).cost||1),0);}
function metaOTal(D,meta0,k,id){const meta=migrateMeta(meta0);const t=(D.otal||{})[id];if(!t||t.ok!==k)return {ok:false,error:'沒有這個天賦'};const o=otOf(meta,k);if(o.spent.includes(id))return {ok:false,error:'已經學會了'};if(t.need&&!o.spent.includes(t.need))return {ok:false,error:'要先學會前一格'};if(otLeft(D,o)<t.cost)return {ok:false,error:'熟練不夠（要 '+t.cost+' 點）'};o.spent.push(id);return {ok:true,meta};}
function talCost(D,id){return ((D.talents||{})[id]||{}).cost||1;}
function talLeft(D,p){return (p.pts||0)-p.spent.reduce((a,id)=>a+talCost(D,id),0);}
function metaTalent(D,meta0,ch,id){const meta=migrateMeta(meta0);const t=(D.talents||{})[id];if(!t||t.ch!==ch)return {ok:false,error:'沒有這個天賦'};const p=profOf(meta,ch);if(p.spent.includes(id))return {ok:false,error:'已經學會了'};if(t.need&&!p.spent.includes(t.need))return {ok:false,error:'要先學會前一格'};if(talLeft(D,p)<t.cost)return {ok:false,error:'天賦點不夠（要 '+t.cost+' 點）'};p.spent.push(id);return {ok:true,meta};}
function metaKeep(D,meta0,card){const meta=migrateMeta(meta0);meta.col=meta.col||[];meta.col.push({id:card.id,up:card.up?1:0});meta.keepPending=0;return meta;}
function deckOk(D,meta,ch,deck){const R=D.deckRule||{min:10,max:15,same:2};if(deck.length<R.min)return '至少要 '+R.min+' 張';if(deck.length>R.max)return '最多 '+R.max+' 張';const cnt={};const own={};for(const x of (meta.col||[])){const k=x.id+'|'+(x.up?1:0);own[k]=(own[k]||0)+1;}
 const use={};for(const x of deck){const d=D.cards[x.id];if(!d)return '有一張不認得的牌';const free=d.r===0&&d.t!=='x'&&!d.bl&&(d.ch==='any'||d.ch===(ch==='yx'?'yy':ch)||d.ch===ch||d.ch==='none'&&false||x.id==='strike'||x.id==='guard');if(d.ch!=='any'&&d.ch!==ch&&d.ch!==(ch==='yx'?'yy':ch)&&!(x.id==='strike'||x.id==='guard'))return '「'+d.n+'」不是這個角色的牌';cnt[x.id]=(cnt[x.id]||0)+1;if(!free){if(cnt[x.id]>R.same)return '「'+d.n+'」最多放 '+R.same+' 張';const k=x.id+'|'+(x.up?1:0);use[k]=(use[k]||0)+1;if(use[k]>(own[k]||0))return '收藏裡的「'+d.n+'」不夠';}}return null;}
function newMeta(){return {v:2,col:[],prof:{},memory:0,memSpent:0,echo:0,flame:0,keeper:[],desires:[],personas:[],hobbies:[],grudges:[],pages:0,letter:0,unlocked:[],ach:[],codex:{},runs:0,wins:{yy:0,cl:0},best:0,seen:[]};}
function convCol(D,meta){if(!meta||meta.colV>=14)return meta;meta.colV=14;const out=[];(meta.col||[]).forEach((x,i)=>{const c=D.cards[x.id];if(c&&!c.bl&&!c.tag&&!c.g&&c.r>=1&&(c.ch==='yy'||c.ch==='cl')){const cand=Object.keys(D.cards).filter(k=>{const d=D.cards[k];return d.bl&&d.ch===c.ch&&d.r===c.r;});if(cand.length){out.push({id:cand[(i*7919+x.id.length)%cand.length],up:x.up});return;}}out.push(x);});meta.col=out;return meta;}
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
  if(e.t==='sent'||e.t==='flame')meta.flame=(meta.flame||0)+1;
  const grant=id=>{if(!meta.ach.includes(id)){meta.ach.push(id);news.ach.push(id);}};
  if(e.t==='transform')grant(e.mix?'mix1':'full1');if(e.t==='recall')grant('recall1');if(e.t==='yxWake')grant('yx60');if(e.t==='sent'&&meta.flame>=20)grant('flame20');if(e.t==='lampLight')grant('lamp1');
  if(e.t==='scar'&&e.n>=9)grant('scar9');if(e.t==='possess')grant('possess1');if(e.t==='breakthrough')grant('xian1');if(e.t==='partBreak')grant('flesh1');if(e.t==='reveal')grant('eld1');
  if(e.t==='runEnd'){if(e.g&&e.win)grant('trial1');if(e.win&&e.origin&&e.ch!=='gu')grant('win_'+e.ch+'_'+e.origin);if(e.win&&e.ch==='yx')grant('win_yx');if(e.win&&e.ch==='gu')grant('win_gu');if(e.win&&e.desire)grant('win_desire');if((meta.runs||0)+1>=10)grant('runs10');if((meta.runs||0)+1>=30)grant('runs30');}
  if(e.t==='unlockYx')meta.yx=1;
  if(e.t==='unlockGu'){if(!meta.gu)news.gu=1;meta.gu=1;}
  if(e.t==='leftCard')meta.leftNext=e.card;
  if(e.t==='leftTaken'||e.t==='leftSkip')meta.left=null;
  if(e.t==='letter')meta.letterNext=e.n;
  if(e.t==='page')meta.pages=Math.min(9,(meta.pages||0)+1);
  if(e.t==='drop'&&!meta.hobbies.includes(e.id)){meta.hobbies.push(e.id);news.hobby=e.id;}
  if(e.t==='hobby'&&!meta.hobbies.includes(e.id)){meta.hobbies.push(e.id);news.hobby=e.id;}
  if(e.t==='runEnd'){const p=profOf(meta,e.ch);const gain=(e.floors||0)+(e.win?10:0);p.xp+=gain;news.xp=gain;const pg=e.ch==='gu'?0:(1+(e.win?1:0));p.pts+=pg;news.pts=pg;{const tgs=[e.persona,e.desire,e.hobby].filter(Boolean);if(tgs.length&&!e.g){news.tags=[];for(const tg of tgs){const o=tagOf(meta,tg);const g=1+(e.win?1:0);o.pts+=g;o.runs=(o.runs||0)+1;news.tags.push([tg,g]);if(e.win&&(D.tcom||{})[tg]&&!meta.ach.includes('tg_'+tg)){meta.ach.push('tg_'+tg);news.ach.push('tg_'+tg);}}}}if(e.tcom&&e.tcom.length){meta.tcomDone=meta.tcomDone||{};news.tcom=[];for(const tg of e.tcom){const T=(D.tcom||{})[tg];if(!T)continue;const first=!meta.tcomDone[tg];meta.tcomDone[tg]=(meta.tcomDone[tg]||0)+1;const g=first?T.echo:Math.floor(T.echo/3);meta.echo+=g;news.tcom.push([tg,g,first?1:0]);}}if(e.origin&&e.ch!=='gu'&&!e.g){const ok=(e.ch==='yx'?'yy':e.ch)+'_'+e.origin;const o=otOf(meta,ok);const og=1+Math.floor((e.floors||0)/8)+(e.win?2:0);o.pts+=og;news.opts=og;news.ok=ok;}
   if(e.win&&!e.g){meta.keepPending=1;meta.chWins=meta.chWins||{};meta.chWins[e.chapter||1]=(meta.chWins[e.chapter||1]||0)+1;}
   if(e.dot&&e.win)meta.dotGold=15;
   if(e.win&&!e.g&&D.bookX)for(const b of D.bookX){if(meta.bookX&&meta.bookX.includes(b.id))continue;const ok=(b.id==='bx1'&&e.ch==='yy'&&e.origin==='B01'&&e.ph&&e.ph.h>=Math.max(e.ph.half||0,e.ph.full||0))||(b.id==='bx2'&&e.origin==='M01'&&['obsess','grudge'].includes(e.desire))||(b.id==='bx3'&&e.fourth);if(ok){meta.bookX=meta.bookX||[];meta.bookX.push(b.id);news.bookX=b.id;}}
   if(e.win&&e.g&&e.gCard){meta.col=meta.col||[];meta.col.push({id:e.gCard,up:0});news.gCard=e.gCard;meta.trialWins=(meta.trialWins||0)+1;}
   if(!e.g)meta.dotGold=e.dot&&e.win?15:0;
   meta.runs++;if(!e.g&&meta.runs>=3&&(meta.fourth||0)<9&&e.fourth)meta.fourth=(meta.fourth||0)+1;
   if(e.g){}else if(meta.leftNext){meta.left=meta.leftNext;meta.leftNext=null;}else if(meta.left){meta.left.ttl--;if(meta.left.ttl<=0)meta.left=null;}meta.letter=meta.letterNext||0;meta.letterNext=0;if(e.killer&&e.ch==='yy'&&!meta.grudges.includes(e.killer))meta.grudges.push(e.killer);meta.memory+=e.memory;news.memory=e.memory;let ec=echoOf(D,e);if(e.com){ec+=(D.comReward||15);news.com=e.com;meta.comDone=(meta.comDone||[]);if(!meta.comDone.includes(e.com))meta.comDone.push(e.com);}meta.echo+=ec;news.echo=ec;meta.com=null;
   if(e.win&&e.origin&&e.ph){const k=e.ch+'_'+e.origin;const m=Object.entries(e.ph).sort((a,b)=>b[1]-a[1])[0][0];meta.phWins=meta.phWins||{};meta.phWins[k]=meta.phWins[k]||[];if(!meta.phWins[k].includes(m))meta.phWins[k].push(m);}if(e.win)meta.wins[e.ch]=(meta.wins[e.ch]||0)+1;meta.best=Math.max(meta.best,e.floors||0);
   for(const u of D.unlocks)if(meta.memory>=u.at&&!meta.unlocked.includes(u.id)){meta.unlocked.push(u.id);news.unlocks.push(u.id);}}}
 return {meta,news};}

const API={newRun,apply,desc,cardDef,cost,needsTarget,canMove,alive,dmgCalc,newMeta,metaApply,memoryOf,pool,phaseOf,originOf,sendRate,handMax,metaUnlock,metaTalent,talLeft,metaOTal,convCol,metaTTal,tagOf,otOf,otLeft,talCost,evOpts,metaKeep,deckOk,profOf,LV,subOn,subOf,saveForm,migrateRun,loadRun,migrateMeta,metaBuy,echoOf,tcomOk,tcomList,tagDefOf};
if(typeof module!=='undefined')module.exports=API;else root.CARD=API;
})(this);
