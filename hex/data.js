// 燈火邊境（六角經營試作）—— 資料
(function(root){
const T='../inbox/',RG='../../raven-guild/images/';
const DATA={
 version:'v0.1',
 radius:5,
 res:{
  food:{name:'補給',ic:RG+'food_bread.webp'},
  wood:{name:'木材',ic:RG+'i_wood.webp'},
  iron:{name:'白鐵',ic:RG+'i_ingot.webp'},
  oil:{name:'燈油',ic:RG+'i_oil.webp'},
  coin:{name:'渡鴉幣',ic:RG+'i_coin.webp'}
 },
 start:{food:10,wood:8,iron:3,oil:3,coin:0},
 terrain:{
  town:  {name:'南門據點',img:'../grok_1793885809048.jpg',build:false,walk:true},
  plain: {name:'荒原',ab:'原',img:T+'grok_1793874360251.jpg',build:true,walk:true,gather:{food:2}},
  forest:{name:'灰林',ab:'林',img:T+'grok_1793874364828.jpg',build:true,walk:true,gather:{wood:2}},
  hill:  {name:'礦脈丘',ab:'丘',img:T+'grok_1793874367354.jpg',build:true,walk:true,gather:{iron:1}},
  swamp: {name:'油沼',ab:'沼',img:T+'grok_1793874369982.jpg',build:true,walk:true,gather:{oil:1}},
  water: {name:'黑水',ab:'水',img:T+'grok_1793874380360.jpg',build:false,walk:false},
  ruins: {name:'廢墟',ab:'墟',img:T+'grok_1793874386264.jpg',build:true,walk:true,gather:{coin:1}},
  nest:  {name:'污染巢',img:T+'grok_1793874383076.jpg',build:false,walk:true}
 },
 // 地圖生成的比例（第 2 圈以外）
 terrainWeight:{plain:30,forest:24,hill:16,swamp:12,water:8,ruins:10},
 buildings:{
  farm:  {name:'農田',on:['plain'],cost:{wood:3},out:{food:1},adj:{food:1,max:2},ic:RG+'food_beans.webp',desc:'產補給。旁邊每有一塊農田多 1（最多多 2），連成一片最划算。'},
  lumber:{name:'伐木場',on:['forest'],cost:{food:2,wood:1},out:{wood:3},ic:RG+'i_wood.webp',desc:'產木材。'},
  mine:  {name:'礦坑',on:['hill'],cost:{wood:4},out:{iron:2},adj:{iron:1,max:2},ic:RG+'i_ingot.webp',desc:'產白鐵。旁邊每有一座礦坑多 1（最多多 2）。'},
  oilery:{name:'油坊',on:['swamp'],cost:{wood:3,iron:1},out:{oil:2},ic:RG+'i_oil.webp',desc:'從油沼熬出燈油。'},
  herb:  {name:'藥草園',on:['swamp','plain'],cost:{wood:3},out:{food:1},rest:1,ic:RG+'i_leaf.webp',desc:'產一點補給；每座讓所有成員晚上多恢復 1 點體力（最多 +2）。'},
  lamp:  {name:'燈塔',on:['plain','forest','hill','swamp','ruins'],cost:{wood:2,iron:3},light:2,oilUse:1,ic:RG+'i_torch.webp',desc:'每晚燒 1 燈油，照亮 2 格內。照到的地方污染很難進來，已經有的會慢慢退去。沒油就不亮。'},
  ward:  {name:'結界碑',on:['plain','forest','hill','swamp','ruins'],cost:{iron:4,coin:1},ward:1,ic:RG+'ev_stele.webp',desc:'守住自己和相鄰的格子，不用燈油。'},
  barracks:{name:'宿舍',on:['plain','ruins'],cost:{wood:4,iron:2},cap:2,ic:RG+'eq_lantern.webp',desc:'多住 2 位成員。'}
 },
 town:{out:{food:2,wood:1},light:0,cap:5},
 // 成員：探索 exp、淨化 pur、採集 gat、守衛 grd（1～3）
 heroes:{
  shieldF:{name:'霜綾',img:RG+'h_shieldF.webp',exp:1,pur:1,gat:1,grd:3,line:'我守這裡。天亮以前，什麼都別想過去。'},
  archerH:{name:'鳶',img:RG+'h_archerH.webp',exp:3,pur:1,gat:1,grd:1,line:'外面的路，我先去看。'},
  healerF:{name:'青蒿',img:RG+'h_healerF.webp',exp:1,pur:2,gat:2,grd:1,line:'藥箱裝滿了，走吧。'},
  mageF:{name:'夜漣',img:RG+'h_mageF.webp',exp:1,pur:3,gat:1,grd:1,line:'燈照得到的地方，就還是我們的。'},
  herb:{name:'芸',img:RG+'h_herb.webp',exp:2,pur:1,gat:3,grd:1,line:'這片苔長得好，明天再來採。'},
  horn:{name:'瞿山',img:RG+'h_horn.webp',exp:1,pur:1,gat:2,grd:3,line:'山沒倒，人就不退。'},
  foxgirl:{name:'緋汐',img:RG+'h_foxgirl.webp',exp:2,pur:2,gat:1,grd:1,line:'紅燈籠提著，走夜路不怕。'},
  tiekou:{name:'鐵扣',img:RG+'h_tiekou.webp',exp:1,pur:1,gat:3,grd:2,line:'礦坑的事，問我就對了。'},
  mageM:{name:'昏燭',img:RG+'h_mageM.webp',exp:2,pur:3,gat:1,grd:1,line:'灰白的火，也是火。'},
  knightW:{name:'伊恪',img:RG+'h_knightW.webp',exp:2,pur:1,gat:1,grd:3,line:'誓言還在，我就在。'},
  fox:{name:'燈守',img:RG+'h_fox.webp',exp:3,pur:2,gat:1,grd:1,line:'（尾巴的墨火晃了晃，往前跑去。）'},
  spider:{name:'織燭',img:RG+'h_spider.webp',exp:2,pur:1,gat:2,grd:2,line:'（銀絲在廢墟間拉開，像一座小橋。）'}
 },
 startTeam:['shieldF','archerH','healerF','mageF'],
 maxStam:3,
 tasks:{
  explore:{name:'探索',stat:'exp',desc:'走進迷霧，看清楚這一帶。'},
  purify:{name:'淨化',stat:'pur',desc:'洗掉污染；也能削弱污染巢。'},
  gather:{name:'採集',stat:'gat',desc:'從這塊地帶回資源。'},
  guard:{name:'守夜',stat:'grd',desc:'今晚守在這裡，這格和相鄰的格子污染進不來。'}
 },
 nest:{count:3,hp:8},
 spread:{base:.09,perDay:.014,cap:.42,grow:.25,litMult:.2,nestMult:1.8},
 foodPerMember:1,
 costGrow:.3,
 recruitCost:{food:6},
 // 探索廢墟的發現
 finds:[
  {w:30,txt:'倒塌的倉庫裡還有能用的木料。',gain:{wood:4}},
  {w:24,txt:'一箱沒被污染的乾糧。',gain:{food:5}},
  {w:18,txt:'牆縫裡塞著幾枚渡鴉幣。',gain:{coin:2}},
  {w:16,txt:'半罐封好的燈油。',gain:{oil:3}},
  {w:14,txt:'生鏽的白鐵零件，敲一敲還能用。',gain:{iron:3}},
  {w:18,txt:'廢墟裡有人在等著被找到。',recruit:true}
 ],
 // 早上的隨機小事
 morning:[
  {w:10,txt:'商隊經過南門，留下一些補給。',gain:{food:3}},
  {w:8,txt:'風向變了，污染的氣味淡了一點。',calm:true},
  {w:6,txt:'夜裡的燈火引來了迷路的人，他們留下一點白鐵當作謝禮。',gain:{iron:2}},
  {w:30,txt:null}
 ]
};
if(typeof module!=='undefined')module.exports=DATA;else root.HEX_DATA=DATA;
})(this);
