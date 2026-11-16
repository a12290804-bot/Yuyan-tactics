const {run,C,D0}=require('./bot.js');const N=+process.argv[2]||200;const off=+process.argv[4]||0;
const mk=f=>{const D=Object.assign({},D0);D.layers=D0.layers.map(l=>Object.assign({},l));D.chars=JSON.parse(JSON.stringify(D0.chars));D.origins=JSON.parse(JSON.stringify(D0.origins));f(D);return D;};
const V={base:D=>{},swap:D=>{D.origins.yy_B01.swap=['b_b01_foxfire',2];},l0:D=>{V.swap(D);D.layers[0].hpMul=1.4;D.layers[0].atkMul=1.1;},l0only:D=>{D.layers[0].hpMul=1.4;D.layers[0].atkMul=1.1;},pkg:D=>{V.swap(D);D.layers[0].hpMul=1.35;D.layers[0].atkMul=1.1;D.layers[1].hpMul=1.25;D.layers[1].atkMul=1.1;}};
const k=process.argv[3];const D=mk(V[k]);let w=0;const L={};for(let s=1;s<=N;s++){let r;try{r=run(D,(s+off)*104729+13,'yy',C.newMeta(),{origin:process.env.O||'B01'});}catch(e){r={layer:'e'}}if(r.win)w++;else L[r.layer]=(L[r.layer]||0)+1;}
console.log((process.env.TAG||'orig'),k,process.env.O||'B01',w+'/'+N,JSON.stringify(L));
