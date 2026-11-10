// 渡鴉下潛 規則大師交件 v0.3 —— 暗黑詭異改版（限 20 歲以上，心理恐怖為主，不獵奇）
// 用法：v0.2 的 id 全部不變（圖片照舊對得上），只覆蓋下面 rename 裡的名字；其他區塊合併進 data.js。
// 標「★新效果」的地方需要 core.js 加程式，說明在 rules_v0.3_說明.md。
const sk=n=>'../../raven-guild/images/sk_'+n+'.webp';
const I='../../raven-guild/images/';
module.exports={
// ── 一、改名（只改 n，id 和數值照 v0.2）
rename:{
 cards:{
  yy_redline:'縫上', yy_tug:'扯一下', yy_tease:'耳語', yy_bow:'纏成繭', yy_spindle:'紡人',
  yy_fine:'利息', yy_collect:'連皮帶骨', yy_dear:'別看，妹妹', yy_redfate:'生死同線',
  cl_bookmark:'折角', cl_draft:'未完的句子', cl_shelter:'躲進字裡', cl_reread:'再讀一遍',
  cl_hold:'別出聲', cl_patience:'墨不會乾', cl_lamplight:'不能熄的燈', cl_epilogue:'寫下結局',
  cl_letter:'寄不出去的信', x_tired:'沉重的眼皮'
 },
 enemies:{
  envelope:'舔過的信封', slip:'撕下的字條', postage:'欠資的人', papercopy:'剪出來的妳',
  magpie:'叼眼喜鵲', matchmaker:'冥婚媒婆', slagslime:'會呼吸的礦渣', debtlamp:'吸墨礦燈', foreman:'沒有臉的工頭'
 },
 relics:{
  needle:'穿過指頭的針', knot:'解不開的結', ledger:'記著死人的帳本', silkglove:'別人的手套',
  inkstone:'會滲的硯台', redbookmark:'夾著頭髮的書籤', paperweight:'壓著東西的紙鎮', blotter:'吸飽了的吸墨紙',
  lampshade:'摸起來是溫的燈罩', blackfeather:'不是渡鴉的羽毛'
 }
},
// ── 二、新卡
cards:{
 // 詛咒牌：不能打出，會被敵人、事件、遺物塞進牌組
 x_whisper:{n:'耳邊的低語',c:-1,t:'x',r:0,ch:'none',img:sk('hex'),onDraw:['hurt',2]},      // ★新：抽到時失去 2 生命
 x_glove:{n:'不是妳的手',c:-1,t:'x',r:0,ch:'none',img:sk('garrote'),endHand:['hurt',3]},    // ★新：回合結束還在手上，失去 3 生命
 x_name:{n:'被劃掉的名字',c:-1,t:'x',r:0,ch:'none',img:sk('wither'),noRemove:1},           // ★新：商店和事件都不能移除
 // 代價牌：強，但要付血
 yy_bloodpact:{n:'以血立契',c:0,t:'s',r:2,ch:'yy',img:sk('rotcurse'),fx:[['hurt',3],['pa',3,'t'],['ep',1]],u:{fx:[['hurt',3],['pa',5,'t'],['ep',1]]}}, // ★新 fx hurt
 yy_snip:{n:'剪斷',c:1,t:'a',r:2,ch:'yy',img:sk('snap'),fx:[['hurt',4],['jd',5]],u:{fx:[['hurt',4],['jd',6]]}},
 yy_lastknot:{n:'最後一個結',c:2,t:'a',r:3,ch:'yy',img:sk('chain'),ex:1,fx:[['mhp',-3],['lk'],['da',9,1,'pact2']],u:{fx:[['mhp',-3],['lk'],['da',12,1,'pact2']]}}, // ★新 fx mhp
 cl_bloodink:{n:'以血研墨',c:0,t:'s',r:2,ch:'cl',img:sk('mend'),fx:[['hurt',3],['ink',3]],u:{fx:[['hurt',3],['ink',4]]}},
 cl_mouthful:{n:'把字吞下去',c:1,t:'s',r:2,ch:'cl',img:sk('vanish'),keep:1,fx:[['hurt',2],['dr',2],['ink',1]],u:{fx:[['hurt',2],['dr',3],['ink',1]]}},
 cl_lastpage:{n:'最後一頁',c:3,t:'a',r:3,ch:'cl',img:sk('pierce'),ex:1,fx:[['mhp',-4],['d',18,1,'ink2']],u:{fx:[['mhp',-4],['d',24,1,'ink2']]}},
 // 語嫣的本性：貪心、記仇、妖物血脈
 yy_greed:{n:'貪',c:1,t:'a',r:1,ch:'yy',img:sk('snap'),fx:[['d',7],['gk',8]],u:{fx:[['d',10],['gk',12]]}}, // ★新 fx gk：這張打倒敵人時多得 n 渡鴉幣
 yy_grudge:{n:'記仇',c:1,t:'p',r:2,ch:'yy',img:sk('hex'),fx:[['pw','grudge',1]],u:{c:0}}, // ★新能力 grudge：每次受到攻擊傷害，攻擊者獲得 1 層厄契
 yy_sliteye:{n:'豎瞳',c:1,t:'p',r:3,ch:'yy',img:sk('chain'),fx:[['pw','beast',3]],u:{fx:[['pw','beast',5]]}}, // ★新能力 beast：生命低於一半時，攻擊牌傷害 +{n}
 cl_erase:{n:'塗掉',c:0,t:'s',r:1,ch:'cl',img:sk('vanish'),fx:[['bury',1],['dr',1]],u:{fx:[['bury',2],['dr',1]]}}, // ★v0.3.2 新 fx bury：把手上 n 張詛咒放到抽牌堆底
 n_offering:{n:'供品',c:0,t:'s',r:1,ch:'any',img:sk('incense'),ex:1,fx:[['hurt',2],['en',2]],u:{fx:[['hurt',1],['en',2]]}}
},
// ── 三、敵人加詛咒招式（加進 v0.2 敵人的 mv 陣列）
enemyMoves:{
 matchmaker:[{n:'下聘',addCard:['x_name',1],w:1}],
 papercopy:[{n:'貼耳',a:4,addCard:['x_whisper',1],w:1}],
 debtlamp:[{n:'握住',addCard:['x_glove',1],b:6,w:1}]
},
// ── 四、代價遺物（好處很大，但會塞詛咒或扣東西）
relics:{
 eyebutton:{n:'眼珠鈕扣',ic:'i_seal',d:'每回合多 1 點能量。每場戰鬥開始時，抽牌堆加入一張「耳邊的低語」。'},
 borrowedheart:{n:'借來的心跳',ic:'i_leaf',d:'最大生命 +15。休息時回復的生命減半。'},
 namelesslamp:{n:'無名者的燈',ic:'i_torch',d:'打倒敵人時回復 3 生命。每場戰鬥開始時失去 3 生命。'},
 foxhair:{n:'髮根的白狐毛',ic:'i_moss',ch:'yy',d:'生命第一次低於一半時，回復 10 生命，並給所有敵人 3 層厄契。'},
 tornphoto:{n:'撕掉一半的合照',ic:'i_moss',d:'撿起時，牌組加入一張「被劃掉的名字」。每場戰鬥第一回合多抽 3 張牌。'}
},
// ── 五、兩難事件（用現有的事件獎勵欄位，只有 maxhp 負數要小修）
events:[
 {id:'lostglove',n:'失物招領',img:I+'bg_sort.webp',txt:'櫃檯上擺著一隻手套，尺寸剛好是妳的手。登記簿上寫著領取人是妳，日期是明天。',opts:[
   {t:'簽名領走',r:[{relicRandom:1},{card:'x_glove'}],d:'得到一件遺物，牌組加入一張「不是妳的手」'},
   {t:'簽別人的名字',r:[{gold:45},{card:'x_name'}],d:'得到 45 渡鴉幣，牌組加入「被劃掉的名字」'},
   {t:'假裝沒看到',r:[],d:'離開'}]},
 {id:'knock',n:'敲門聲',img:I+'bg_inn.webp',txt:'門外有人用妳自己的聲音叫妳開門。聲音很溫柔，也很耐心。',opts:[
   {t:'開門（失去 10 生命）',r:[{hurt:10},{cardRare:1}],d:'失去 10 生命，得到一張稀有的牌'},
   {t:'把耳朵貼上去',r:[{upgradeRandom:2},{card:'x_whisper'}],d:'隨機升級兩張牌，牌組加入「耳邊的低語」'},
   {t:'用身體頂住門',r:[{hurt:3}],d:'失去 3 生命，敲門聲停了'}]},
 {id:'scale',n:'空著的秤',img:I+'bg_stele.webp',txt:'秤的一邊放著一顆還在跳的東西，另一邊空著。旁邊寫著：請放上等重的。',opts:[
   {t:'放上一張牌',r:[{removePick:1},{maxhp:6}],d:'移除一張牌，最大生命 +6'},
   {t:'放上自己的一部分',r:[{maxhp:-8},{relicRandom:1},{relicRandom:1}],d:'最大生命 -8，得到兩件遺物'},
   {t:'把那顆東西拿走',r:[{heal:20},{card:'x_whisper'},{card:'x_whisper'}],d:'回復 20 生命，牌組加入兩張「耳邊的低語」'}]}
]
};
