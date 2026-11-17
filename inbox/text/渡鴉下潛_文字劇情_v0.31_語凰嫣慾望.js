// 《渡鴉下潛》文字劇情 v0.31　語凰嫣慾望
// 對齊規則 v0.13 污染化（e74d5be）。重寫語凰嫣核心台詞與卡牌短文，並加上十種慾望人格狀態劇情。
// 本檔取代：DATA.talk.start/win/lose 與 winMore/loseMore 的語凰嫣句、DATA.chars.yy.line、
// ALIEN 語凰嫣句、v0.26 換臉／醒來／搶牌／合相語凰嫣句、DESIRE（改為十個戒指契）。
// 新：battle 短句、desireState、八張 yy_t_* 與污染相關句子。
// 三面牌與戒指牌只補 fl，卡面效果與原打出句不改。喚回主句不動。
// 說明見同目錄「文字_v0.31_語凰嫣慾望.md」。

const TEXT_V031 = {
  ver:'v0.31',
  title:'語凰嫣慾望',
  rules:'v0.13',
  replaces:'talk.start/win/lose + winMore/loseMore (yy lines); chars.yy.line; ALIEN yy lines; v0.26 rotate/wake/steal/merge yy lines; DESIRE (10 ring pacts). New: battle barks, desireState, yy_t_* cards, taint lines. Ring and yy_f_* get fl only.',
  speaker:{
    'yy:huang':'凰',
    'yy:yan':'嫣',
    'yy:xi':'熙',
    'yy:all':'合相',
    cl:'克勞德'
  },
  note:'現行 DATA.talk 仍用 [\'yy\',\'smug\',句子]。新系統用 yy:yan／y_ex_yan。打出句不報數字。喚回主句「姐姐，看我。是我。」不要改。',

  talk:{
    start:{
      yy:[['yy','smug','下去。下面有我還沒吃到的。'],['cl',null,'姐姐，燈給妳。我在上面等妳。'],['yy','laugh','等著。吃完我就回來。回來還是餓。']]
    },
    win:{
      yy:[['yy','laugh','吃完了。還餓。'],['cl',null,'姐姐！……歡迎回來。']]
    },
    lose:{
      yy:[['yy','pout','還沒吃夠。線斷了，下次再咬。'],['cl',null,'姐姐回來就好。']]
    },
    winMore:{
      yy:[
        [['yy','smug','這一層吃乾了。手還是空的。'],['cl',null,'姐姐，妳衣服上沾了紙灰，還有一點紅的。我幫妳擦掉。']],
        [['yy','laugh','妹妹，燈還亮著吧？'],['cl',null,'一直亮著。只是剛剛，妳的影子比妳先回來。'],['yy','smug','它先回去搶位子。桌上沒剩給我的。']]
      ]
    },
    loseMore:{
      yy:[
        [['yy','annoy','不是輸。是還沒吃完，線先斷了。'],['cl',null,'嗯。斷掉的地方，我幫妳打了一個結。']],
        [['yy','pout','妹妹，別看我的嘴。……還沒擦乾淨。'],['cl',null,'我不看。我只是很高興妳回來了。']]
      ]
    }
  },

  chars:{
    yy:{
      line:'下去。下面有我還沒吃到的。'
    }
  },

  alien:{
    s0:{
      lines:[
        ['yy','smug','今天還餓得有禮貌。先走。'],
        ['yy','pout','裙子是乾的。這一層會補上。'],
        ['yy',null,'妹妹，燈提好。下面的留給我。']
      ]
    },
    s40:{
      lines:[
        ['yy','annoy','別盯著我的影子。它比我先伸出手。'],
        ['yy',null,'我剛剛咽了一下。手上什麼都沒有。'],
        ['yy','smug','走快點。下面在叫我，這次叫對了。']
      ]
    },
    s60:{
      lines:[
        ['yy',null,'妹妹，退後。'],
        ['yy',null,'餓了。不是肚子。'],
        ['yy',null,'這張牌被我看過一眼，字就糊了。']
      ]
    },
    s100:{
      lines:[
        ['yy',null,'不用輪了。三張嘴一起餓。'],
        ['yy',null,'吃進去的全漏出去。再餵。'],
        ['yy',null,'滿了？沒有。再來。']
      ]
    }
  },

  rotateStart:{
    yan:[
      ['yy:yan','y_ex_yan','呵。又輪到我了。先吃。'],
      ['yy:yan','y_ex_yan','來得正好。這張嘴，他們比較熟。'],
      ['yy:yan','y_ex_yan','……讓我再賴一會兒。吃可以，別催。']
    ],
    xi:[
      ['yy:xi','y_ex_xi','終於♡ 輪到我下口。'],
      ['yy:xi','y_ex_xi','雜魚看清楚，現在這張嘴是我的。'],
      ['yy:xi','y_ex_xi','笑一聲給你們聽。牙是尖的。']
    ],
    huang:[
      ['yy:huang','y_ex_huang','讓路。這一口我來算。'],
      ['yy:huang','y_ex_huang','吵夠了。從這裡起，聽我的。'],
      ['yy:huang','y_ex_huang','冠上的縫線在跳。站直。']
    ]
  },

  wakeHuang:{
    when:'每一局第一次異化值到 60',
    flash:'y_reveal_huang',
    flashSec:0.8,
    sfx:'sfx_reveal_huang',
    lines:[
      ['yy:huang','y_ex_huang','我醒了。這張嘴也餓。'],
      ['yy:yan','y_ex_yan','……這張臉，還早。'],
      ['yy:huang','y_ex_huang','這一局我會走到結束。讓路。'],
      ['yy:xi','y_ex_xi','呵♡ 白金色的也會餓。歡迎。']
    ]
  },

  steal:{
    yan:[
      ['yy:yan','y_ex_yan','這張，先借我吃一口。'],
      ['yy:yan','y_ex_yan','線在我手上更穩。'],
      ['yy:yan','y_ex_yan','呵。妳們打，我來改。']
    ],
    xi:[
      ['yy:xi','y_ex_xi','搶走了♡ 這張歸我。'],
      ['yy:xi','y_ex_xi','手鬆一點。我要這張下口。'],
      ['yy:xi','y_ex_xi','謝啦。疼的那一下，記我帳上。']
    ],
    huang:[
      ['yy:huang','y_ex_huang','這張，換一種吃法。'],
      ['yy:huang','y_ex_huang','費用我來削。牌還妳，效果不還。'],
      ['yy:huang','y_ex_huang','看清楚。下一拍是我的版本。']
    ]
  },

  merge:{
    turns:2,
    art:'y_full_merge',
    then:'callback',
    lines:[
      ['yy:all','y_full_merge','不用輪了。'],
      ['yy:all','y_full_merge','三張嘴疊在同一張上面。一起要。'],
      ['yy:all','y_full_merge','碎骨冠的縫線在數拍。同一個字：還要。'],
      ['yy:all','y_full_merge','回來？現在沒有人排在後面。']
    ]
  },

  callback:{
    sfx:'sfx_recall',
    sfxSec:0.9,
    mainKeep:'姐姐，看我。是我。',
    lines:[
      ['cl','firm','姐姐，看我。是我。'],
      ['cl','worry','燈在這裡。前臉是誰都好，往亮的地方走。'],
      ['cl','firm','妳是姐姐。三張臉，我都認得。回來。'],
      ['cl','smile','晚餐還熱著。回來吧。']
    ],
    after:['yy:yan','y_ex_yan','……回來了。嘴還是空的。']
  },

  battle:{
    play:[
      ['yy:yan','y_ex_yan','這張，吃掉。'],
      ['yy:yan','y_ex_yan','還要。'],
      ['yy:xi','y_ex_xi','進嘴♡'],
      ['yy:huang','y_ex_huang','不夠。下一張。'],
      ['yy:yan','y_ex_yan','這也是我的。']
    ],
    hurt:[
      ['yy:yan','y_ex_yan','這口我記著。'],
      ['yy:xi','y_ex_xi','疼。還能吃♡'],
      ['yy:huang','y_ex_huang','咬回來。']
    ],
    lowHp:[
      ['yy:yan','y_ex_yan','空了。再餵我。'],
      ['yy:xi','y_ex_xi','血少了。更餓♡'],
      ['yy:huang','y_ex_huang','還沒倒。再給我一口。']
    ],
    death:[
      ['yy:yan','y_ex_yan','還能再咬一口。……咬不到了。'],
      ['yy:xi','y_ex_xi','空了。真的空了。']
    ]
  },

  desire:{
    devotion:{n:'獻',pick:['yy:yan','y_ex_yan','這一局，鎖扣在我自己手上。渡鴉不在，也別想拿走。'],yx:['yy:xi','y_ex_xi','鎖歸她？我也扣得上。'],d:'鎖扣在自己手上。渡鴉不在，也不讓人拿走。'},
    pride:{n:'傲',pick:['yy:huang','y_ex_huang','跪著求我的，我可以看一眼。站著擋路的，不必了。'],yx:['yy:xi','y_ex_xi','低頭？她不會，我更不會。'],d:'不逃、不讓步，只跟夠格的對手算帳。'},
    envy:{n:'妒',pick:['yy:yan','y_ex_yan','別人手上的，我看著就餓。這一局，拿過來。'],yx:['yy:xi','y_ex_xi','牠有的，我們都要。'],d:'看見別人有什麼，就想搶過來。'},
    obsess:{n:'執',pick:['yy:yan','y_ex_yan','認定的東西，我不放手。手鬆了會更空。'],yx:['yy:xi','y_ex_xi','抓住了就別鬆。'],d:'盯上的東西不肯放。放了會更空。'},
    cruelty:{n:'虐',pick:['yy:xi','y_ex_xi','踩過一隻就膩。下一隻呢♡'],yx:['yy:xi','y_ex_xi','打完就膩。再找下一隻。'],d:'下手很重，打完就膩，再找下一隻。'},
    greed:{n:'貪',pick:['yy:yan','y_ex_yan','我要的，從來不是一點點。看得見的，全部扒過來。'],yx:['yy:xi','y_ex_xi','只拿這些？她太客氣了。'],d:'看得見的都想要。扒到手裡，手心還是空的。'},
    wrath:{n:'怒',pick:['yy:xi','y_ex_xi','氣吃不飽。這一局我不壓著了♡'],yx:['yy:xi','y_ex_xi','全部，打爛。'],d:'怒火沒有開關。只在熙面前臉時發動。'},
    sweetmalice:{n:'甜毒',pick:['yy:yan','y_ex_yan','茶先給你。杯底那口，是我的。'],yx:['yy:xi','y_ex_xi','甜的給你。苦的我留著♡'],d:'先給你甜的。杯底是空的，也是她的。'},
    vanity:{n:'虛',pick:['yy:huang','y_ex_huang','這一局我要是最好看的那一個。少一滴都不行。'],yx:['yy:xi','y_ex_xi','鏡子裡那個不夠。換一張。'],d:'滿著的時候最強。少一點，就討厭現在這張臉。'},
    glutton:{n:'饞',pick:['yy:xi','y_ex_xi','餓了。下面的東西先吃，吃完再問是什麼♡'],yx:['yy:xi','y_ex_xi','先吃。吃完再問是什麼。'],d:'吃完了還餓。飢餓從來不會停。'}
  },

  desireState:{
    devotion:{
      id:'devotion',
      n:'獻',
      art:'y_desire_devotion',
      finger:'左無名指',
      ring:'渡鴉之鎖',
      see:'她跪在血燭圈裡，頭仰著看你。左手無名指的渡鴉之鎖對著光，淚順著臉往下走，領圈跟著心跳脹縮。蠟燭一排排燒短，蠟油落到她膝蓋上，她不擦。圈外空著一個位置，她一直看著那裡。',
      line:['yy:yan','y_ex_yan','渡鴉，鎖還在。你不在，我自己扣上。']
    },
    pride:{
      id:'pride',
      n:'傲',
      art:'y_desire_pride',
      finger:'左拇指',
      ring:'星核黑洞戒',
      see:'她靠在顱骨椅上，一條腿疊著，下巴擱在手指邊。極樂黑銀長髮垂過扶手，她從高處往下看你。椅子很大，她坐不滿，把背又往上靠了一點，空出來的那一截跟著變大。',
      line:['yy:huang','y_ex_huang','小的站遠一點。夠格的，上來。']
    },
    envy:{
      id:'envy',
      n:'妒',
      art:'y_desire_envy',
      finger:'左食指',
      ring:'轉動的眼珠戒',
      see:'她側身擠在門框裡，身體貼著門邊，門框壓出一道痕。門縫後面有光，她盯著那道光，牙咬著下唇。門上的玻璃裡有她的倒影，倒影也在看同一處。門沒有開，她還是不走。',
      line:['yy:yan','y_ex_yan','裡面那件是我的。還沒拿到而已。']
    },
    obsess:{
      id:'obsess',
      n:'執',
      art:'y_desire_obsess',
      finger:'左中指',
      ring:'觸手神經戒',
      see:'她把兩隻手抬到臉旁邊，長指甲上還掛著血。項圈正中那隻眼睛睜著，對準你。她不眨眼。指甲在空中收緊，沒抓到東西，她把手再伸近一點。',
      line:['yy:yan','y_ex_yan','就你了。視線不准離開。']
    },
    cruelty:{
      id:'cruelty',
      n:'虐',
      art:'y_desire_cruelty',
      finger:'左小指',
      ring:'人臉血肉戒',
      see:'她一腳踩在被鎖住的怪物背上，神經鞭鬆鬆捲在手上。臉很平，一點也不興奮。鞭子打下去一下，她打了個哈欠。怪物不動了，她把腳拿開，又去找下一隻。',
      line:['yy:xi','y_ex_xi','叫啊。叫完還是這個樣子。']
    },
    greed:{
      id:'greed',
      n:'貪',
      art:'y_desire_greed',
      finger:'右拇指',
      ring:'黃金咬指口',
      see:'她趴在金幣堆上，兩手把幣往自己身上扒。十枚戒指都戴著，每扒一次，戒指就撞出一聲。金幣已經蓋過腰，她還在扒。扒完這一堆，手底下又空了一塊，她皺眉，繼續扒。',
      line:['yy:yan','y_ex_yan','這也是我的。那個也是。']
    },
    wrath:{
      id:'wrath',
      n:'怒',
      art:'y_desire_wrath',
      finger:'右食指',
      ring:'荊棘詛咒戒',
      see:'她整個人撲過來，帶血的手朝你抓。紅裙子被帶起來，碎石在旁邊飛。抓空了一次，她更氣，指甲在空氣裡又劃一回。牆面裂了，氣沒有變少。',
      line:['yy:xi','y_ex_xi','我流的，全部還你♡']
    },
    sweetmalice:{
      id:'sweetmalice',
      n:'甜毒',
      art:'y_desire_sweetmalice',
      finger:'右中指',
      ring:'藏針珍珠戒',
      see:'她穿著粉黑的洋娃娃裙，把一杯茶遞到你面前。嘴角掛下一絲黑的，滴在茶面上，茶還在響。你要是不接，她就把杯子又往前送一寸。黑絲還在滴，杯子一直不滿。',
      line:['yy:yan','y_ex_yan','喝啊。苦的留給我，甜的給你。']
    },
    vanity:{
      id:'vanity',
      n:'虛',
      art:'y_desire_vanity',
      finger:'右無名指',
      ring:'碎鑽磷光戒',
      see:'她背對你，側過臉去看鏡子。脊骨上一排骨環扣著，手指點在自己嘴唇上。鏡子裡的那張臉在笑，她這邊還沒笑完。她擦掉嘴角一點紅，鏡子裡的紅還在。她繼續看。',
      line:['yy:huang','y_ex_huang','再好看一點。現在這張不夠。']
    },
    glutton:{
      id:'glutton',
      n:'饞',
      art:'y_desire_glutton',
      finger:'右小指',
      ring:'血果凍戒',
      see:'她躺在一堆切開的石榴中間，正把一顆塞進嘴裡，紅汁沿著下巴往下走。盤子還滿著，杯子倒在旁邊。她吃完這一口，眼神還在找下一顆。桌子兩邊都是吃到一半的東西，沒有一盤是空的。',
      line:['yy:xi','y_ex_xi','吃完了。還餓♡']
    }
  },

  cardFlavor:{
    yy_f_swap:'換一張臉，餓的還是同一張嘴。',
    yy_f_three:'三張嘴一起要。',
    yy_f_wrap:'裹住了。裡面的也不准走。',
    yy_f_bite:'咬下去。鬆口會空。',
    yy_f_mask:'這張臉給你看。底下那張還在餓。',
    yy_f_grab:'前臉是我的。這幾口歸我。',
    yy_f_feed:'張嘴。先餵進去。',
    yy_f_nails:'掐進去就不放。',
    yy_f_ledger:'每一筆都記加的。沒有減。',
    yy_f_blame:'是她。別看我這張空的。',
    yy_f_rebirth:'倒下可以。起來還要再吃。',
    yy_f_one:'換來換去，最後只剩一張還餓的嘴。',
    yy_r_devotion:'鎖扣上了。空的那一邊，還在等。',
    yy_r_pride:'小的不算數。大的才配被我看一眼。',
    yy_r_envy:'妳手上那件，我看著就餓。',
    yy_r_obsess:'盯上了就不放。放了會更空。',
    yy_r_cruelty:'打完一隻，興趣就沒了。再找下一隻。',
    yy_r_greed:'扒到手裡，手心還是凹的。',
    yy_r_wrath:'氣吃不飽。越打越餓。',
    yy_r_sweetmalice:'茶是甜的。杯底是空的。',
    yy_r_vanity:'鏡子裡那張，永遠比現在這張多一點。',
    yy_r_glutton:'先把這張吃掉。吃完還要下一張。'
  },

  taint:{
    polluted:[
      ['yy:yan','y_ex_yan','這張被我吃過了。再打更重，也更要血。'],
      ['yy:xi','y_ex_xi','沾上了♡ 以後這張歸餓的那張嘴。'],
      ['yy:huang','y_ex_huang','污染留下了。這局不退。']
    ],
    mergeTaint:{
      n:2,
      keep:'run',
      line:['yy:all','y_full_merge','兩張被一起吃過。這局跟著走。']
    },
    chain:[
      ['yy:xi','y_ex_xi','停不下來。下一張，自己出去了♡'],
      ['yy:yan','y_ex_yan','手自己在動。別攔。'],
      ['yy:huang','y_ex_huang','還有。繼續。']
    ],
    withdrawal:[
      ['yy:yan','y_ex_yan','這一回合沒吃。手在抖。'],
      ['yy:xi','y_ex_xi','空著會疼。是妳自己不餵♡'],
      ['yy:huang','y_ex_huang','饜還在。沒吃，就用這個數來扣。']
    ],
    fullToAlien:[
      ['yy:huang','y_ex_huang','血是滿的。補進來的，全變成外漏。'],
      ['yy:yan','y_ex_yan','裝不下了。漏出去的，我還要。'],
      ['yy:xi','y_ex_xi','滿了更空♡ 再餵啊。']
    ],
    restPurify:{
      opt:'斷',
      d:'不回血。選 1 張牌，污染歸 0。',
      lines:[
        ['yy:yan','y_ex_yan','這一張，我吐出來。不回血。'],
        ['yy:huang','y_ex_huang','斷掉。下一口會少，先忍著。']
      ]
    }
  },

  taintCards:{
    yy_t_feed:{
      n:'餵我',c:0,t:'技',r:'普通',
      d:'選手上 1 張牌，污染 +1。回復 3 生命。',
      u:{d:'選手上 1 張牌，污染 +1。回復 5 生命。'},
      fl:'先餵我一口。這張以後更重。',
      line:['yy:yan','y_ex_yan','張嘴。餵我。']
    },
    yy_t_more:{
      n:'還要',c:1,t:'攻',r:'普通',
      d:'造成 6 傷害。這回合打過污染牌時，這張回到手上，費用 +1。',
      u:{d:'造成 8 傷害。這回合打過污染牌時，這張回到手上，費用 +1。'},
      fl:'不夠。再來一次。',
      line:['yy:xi','y_ex_xi','還要♡ 這張我會再抓回來。']
    },
    yy_t_devour:{
      n:'自噬',c:0,t:'技',r:'普通',
      d:'失去 4 生命，得到 2 能量，異化值 +5。',
      u:{d:'失去 3 生命，得到 2 能量，異化值 +5。'},
      fl:'先咬我自己。咬完才有下一手。',
      line:['yy:huang','y_ex_huang','先咬我自己。']
    },
    yy_t_empty:{
      n:'越吃越空',c:1,t:'攻',r:'罕見',
      d:'造成 3 傷害。這場戰鬥每打過 1 張污染牌，再加 4 傷害。',
      u:{d:'造成 5 傷害。這場戰鬥每打過 1 張污染牌，再加 5 傷害。'},
      fl:'吃過的每一張，這一擊全吐在妳身上。',
      line:['yy:yan','y_ex_yan','吃完了。裡面還是空的。']
    },
    yy_t_crave:{
      n:'渴',c:1,t:'能力',r:'罕見',
      d:'每回合開始，手上隨機 1 張牌污染 +1。只到這場戰鬥結束。',
      u:{d:'費用變 0。每回合開始，手上隨機 1 張牌污染 +1。只到這場戰鬥結束。'},
      fl:'每回合都要再沾一口。這場結束才停。',
      line:['yy:xi','y_ex_xi','渴。停不了♡']
    },
    yy_t_hoard:{
      n:'都是我的',c:1,t:'技',r:'罕見',
      d:'把棄牌堆所有污染牌拿回手上，每張失去 1 生命。',
      u:{d:'把棄牌堆所有污染牌拿回手上，每張失去 1 生命。再獲得 5 格擋。'},
      fl:'丟掉的也是我的。還我。',
      line:['yy:yan','y_ex_yan','丟掉的也是我的。還我。']
    },
    yy_t_binge:{
      n:'停不下來',c:2,t:'攻',r:'罕見',
      d:'造成 7 傷害。接著自動打出抽牌堆頂的攻擊牌，直到翻到不是攻擊的牌為止。每多打一張失去 2 生命。',
      u:{d:'造成 10 傷害。接著自動打出抽牌堆頂的攻擊牌，直到翻到不是攻擊的牌為止。每多打一張失去 2 生命。'},
      fl:'手不會停。不是攻擊的那張，才是煞車。',
      line:['yy:xi','y_ex_xi','手自己在動。別攔♡']
    },
    yy_t_hollow:{
      n:'空心',c:1,t:'技',r:'普通',
      d:'獲得「饜 ×3」格擋，然後饜歸 0。',
      u:{d:'獲得「饜 ×4」格擋，然後饜歸 0。'},
      fl:'用餓撐住。撐完，餓清掉。',
      line:['yy:huang','y_ex_huang','撐起來了。裡面沒東西。']
    }
  }
};

if (typeof module !== 'undefined') module.exports = TEXT_V031;
