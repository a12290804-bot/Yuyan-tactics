// 《渡鴉下潛》文字劇情 v0.27　通關後・深潛 20 階
// 對齊規則 v0.10。深潛 id：asc_1～asc_20。詞綴 excess/scheme/rot/rage。罪用 DATA.sinName。
// 說話人：yy:yan／yy:xi／yy:huang／yy:all、cl、gu、ry。
// 喚回主句不動。第 20 階每局只喚一次，第二次見 recall20.denied。
// 戒圖 id（923bd47）：ring_devotion / ring_pride / ring_envy / ring_obsess / ring_cruelty /
// ring_greed / ring_wrath / ring_sweetmalice / ring_vanity / ring_glutton。
// 說明見同目錄「文字_v0.27_通關後.md」。

const TEXT_V027 = {
  ver:'v0.27',
  title:'通關後・深潛 20 階',
  rules:'v0.10',
  asc:[
    {
      id:'asc_1',
      lv:1,
      n:'多一層皮',
      key:'foeHp',
      flavor:'牠們又長出一層。刀要多劃一次。',
      entry:[
        ['yy:yan', 'y_ex_yan', '多一層皮而已。我記帳。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '這一口，先收下。下面還有。']
      ],
      ring:{
        pact:'pride',
        img:'ring_pride',
        n:'星核黑洞戒',
        finger:'左拇指'
      }
    },
    {
      id:'asc_2',
      lv:2,
      n:'多一格爪印',
      key:'eliteNodes',
      flavor:'地圖上多一格不是路，是眼睛。',
      entry:[
        ['yy:xi', 'y_ex_xi', '多一格♡ 正好，我正想多打一隻。']
      ],
      clear:[
        ['yy:xi', 'y_ex_xi', '爪印我蓋回去了。下次還會多。']
      ],
      ring:{
        pact:'envy',
        img:'ring_envy',
        n:'轉動的眼珠戒',
        finger:'左食指'
      }
    },
    {
      id:'asc_3',
      lv:3,
      n:'餘溫不夠',
      key:'restHeal',
      flavor:'營火還在，暖意先走了。',
      entry:[
        ['yy:huang', 'y_ex_huang', '火還亮。不要指望它暖。']
      ],
      clear:[
        ['yy:huang', 'y_ex_huang', '休息過了。血沒補滿。']
      ],
      cl:['cl', 'worry', '姐姐，火比上次小。我再添一根。'],
      ring:{
        pact:'obsess',
        img:'ring_obsess',
        n:'觸手神經戒',
        finger:'左中指'
      }
    },
    {
      id:'asc_4',
      lv:4,
      n:'牙更長',
      key:'foeAtk',
      flavor:'普通的一擊，比記憶裡重。',
      entry:[
        ['yy:yan', 'y_ex_yan', '牙長了。挨的那一下，記重一筆。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '打回來了。牙還在長。']
      ],
      ring:{
        pact:'devotion',
        img:'ring_devotion',
        n:'渡鴉之鎖',
        finger:'左無名指'
      }
    },
    {
      id:'asc_5',
      lv:5,
      n:'咒先入袋',
      key:'startCurse',
      flavor:'牌組裡多一張不是妳選的咒。',
      entry:[
        ['yy:xi', 'y_ex_xi', '誰塞進來的♡ 開局就有咒。']
      ],
      clear:[
        ['yy:xi', 'y_ex_xi', '咒還在袋底。下次我咬回去。']
      ],
      cl:['cl', 'firm', '姐姐，開局那張牌不是我們的。我寫下來了。'],
      ring:{
        pact:'cruelty',
        img:'ring_cruelty',
        n:'人臉血肉戒',
        finger:'左小指'
      }
    },
    {
      id:'asc_6',
      lv:6,
      n:'首領還坐著',
      key:'bossHp',
      flavor:'首領的座位還沒空。',
      entry:[
        ['yy:huang', 'y_ex_huang', '牠還坐著。別急著報完。']
      ],
      clear:[
        ['yy:huang', 'y_ex_huang', '座位空了。椅子還是熱的。']
      ],
      ring:{
        pact:'greed',
        img:'ring_greed',
        n:'黃金咬指口',
        finger:'右拇指'
      }
    },
    {
      id:'asc_7',
      lv:7,
      n:'標價帶刺',
      key:'shopMul',
      flavor:'店裡的價錢會咬手。',
      entry:[
        ['yy:yan', 'y_ex_yan', '標價燙手。買不買，先看這筆帳划不划。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '付過了。巷口那盞燈，今天偏白。']
      ],
      ring:{
        pact:'wrath',
        img:'ring_wrath',
        n:'荊棘詛咒戒',
        finger:'右食指'
      }
    },
    {
      id:'asc_8',
      lv:8,
      n:'井先喝一口',
      key:'startAlien',
      flavor:'還沒下去，井先在身上留了一口。',
      entry:[
        ['yy:huang', 'y_ex_huang', '井先喝了一口。領圈那隻眼，已經睜開。']
      ],
      clear:[
        ['yy:huang', 'y_ex_huang', '異化是開局就有的。我帶著它走完。']
      ],
      cl:['cl', 'worry', '姐姐，領圈跳得比出門時快。'],
      ring:{
        pact:'sweetmalice',
        img:'ring_sweetmalice',
        n:'藏針珍珠戒',
        finger:'右中指'
      }
    },
    {
      id:'asc_9',
      lv:9,
      n:'少看一眼',
      key:'rewardChoices',
      flavor:'本來可以看三張，現在少看一眼。',
      entry:[
        ['yy:xi', 'y_ex_xi', '少看一眼。一眼。夠狠就行♡']
      ],
      clear:[
        ['yy:xi', 'y_ex_xi', '兩張也打完了。兩張。']
      ],
      ring:{
        pact:'vanity',
        img:'ring_vanity',
        n:'碎鑽磷光戒',
        finger:'右無名指'
      }
    },
    {
      id:'asc_10',
      lv:10,
      n:'詞跟上身',
      key:'eliteTrait',
      flavor:'菁英身上多了一個字，跟著牠打。',
      entry:[
        ['yy:yan', 'y_ex_yan', '過剩、算計、腐、狂。哪個字跟上來，我就打哪個。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '詞綴剝下來了。字還黏在手套上。']
      ],
      cl:['cl', 'firm', '姐姐，名字前面多了一個字。我連那個字一起記。'],
      ring:{
        pact:'glutton',
        img:'ring_glutton',
        n:'血果凍戒',
        finger:'右小指'
      }
    },
    {
      id:'asc_11',
      lv:11,
      n:'開局少一截',
      key:'startHp',
      flavor:'出發以前，血先少了一截。',
      entry:[
        ['yy:huang', 'y_ex_huang', '血少了一截。純血會自己補，但不是現在。']
      ],
      clear:[
        ['yy:huang', 'y_ex_huang', '走完了。井口到樓梯，今天少一階。']
      ],
      cl:['cl', 'worry', '十三階……我數到十二。少的那一階，我畫在本子上。'],
      ring:{
        pact:'pride',
        img:'ring_pride',
        n:'星核黑洞戒',
        finger:'左拇指'
      }
    },
    {
      id:'asc_12',
      lv:12,
      n:'殼更厚',
      key:'foeBlock',
      flavor:'打在殼上，殼更厚。',
      entry:[
        ['yy:yan', 'y_ex_yan', '殼。殼更厚。線要繞兩圈。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '殼拆開了。裡面還是殼。']
      ],
      ring:{
        pact:'envy',
        img:'ring_envy',
        n:'轉動的眼珠戒',
        finger:'左食指'
      }
    },
    {
      id:'asc_13',
      lv:13,
      n:'下半場',
      key:'bossPhase2',
      flavor:'首領生命掉到一半，會換成另一種打法。',
      entry:[
        ['yy:xi', 'y_ex_xi', '前半場算熱身♡ 後半場才是牠。']
      ],
      clear:[
        ['yy:xi', 'y_ex_xi', '下半場也打完了。牠還想再來一場？']
      ],
      cl:['cl', 'firm', '姐姐，牠還有後半。燈我舉著。'],
      ring:{
        pact:'obsess',
        img:'ring_obsess',
        n:'觸手神經戒',
        finger:'左中指'
      }
    },
    {
      id:'asc_14',
      lv:14,
      n:'遺物躲起來',
      key:'eliteRelic',
      flavor:'菁英口袋裡的遺物，有一半不亮出來。',
      entry:[
        ['yy:huang', 'y_ex_huang', '遺物不肯來。逼也沒用，它會自己躲。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '渡鳥巷——……渡鴉巷。東西帶上來了，少一件。']
      ],
      ring:{
        pact:'devotion',
        img:'ring_devotion',
        n:'渡鴉之鎖',
        finger:'左無名指'
      }
    },
    {
      id:'asc_15',
      lv:15,
      n:'罪醒了',
      key:'chapterSin',
      flavor:'這一章有一宗罪醒了，整層的敵人都跟著它。',
      entry:[
        ['yy:all', 'y_full_merge', '罪醒了。這一章，牠們共用一個字。']
      ],
      clear:[
        ['yy:all', 'y_full_merge', '這一章的罪，先按回去。下一章還會再抽。']
      ],
      cl:['cl', 'worry', '姐姐，空氣裡多了一個字。不是我們家的。'],
      ring:{
        pact:'cruelty',
        img:'ring_cruelty',
        n:'人臉血肉戒',
        finger:'左小指'
      }
    },
    {
      id:'asc_16',
      lv:16,
      n:'起手缺一張',
      key:'firstDraw',
      flavor:'第一回合，手裡少一張。',
      entry:[
        ['yy:xi', 'y_ex_xi', '少一張。少一張。用疼的補♡']
      ],
      clear:[
        ['yy:xi', 'y_ex_xi', '缺的那張，我從別人手上搶回來了。']
      ],
      ring:{
        pact:'greed',
        img:'ring_greed',
        n:'黃金咬指口',
        finger:'右拇指'
      }
    },
    {
      id:'asc_17',
      lv:17,
      n:'第十二拍',
      key:'enrage',
      flavor:'第十二拍以後，牠們越打越醒。',
      entry:[
        ['yy:huang', 'y_ex_huang', '第十二拍。在那之前結束。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '十二拍以前收掉了。巷尾的貓，今天朝人跪。']
      ],
      cl:['cl', 'worry', '貓不朝井口了。牠看著我們。一聲都不叫。'],
      ring:{
        pact:'wrath',
        img:'ring_wrath',
        n:'荊棘詛咒戒',
        finger:'右食指'
      }
    },
    {
      id:'asc_18',
      lv:18,
      n:'人人帶詞',
      key:'foeTrait',
      flavor:'連雜魚都可能帶著那個字。',
      entry:[
        ['yy:xi', 'y_ex_xi', '雜魚也開口了♡ 好啊，來齊。']
      ],
      clear:[
        ['yy:xi', 'y_ex_xi', '帶詞的、不帶的，都倒下了。茶是涼的，桌子是熱的。']
      ],
      ring:{
        pact:'sweetmalice',
        img:'ring_sweetmalice',
        n:'藏針珍珠戒',
        finger:'右中指'
      }
    },
    {
      id:'asc_19',
      lv:19,
      n:'再硬一截',
      key:'bossHp+foeAtk',
      flavor:'首領更硬，牙也更長。',
      entry:[
        ['yy:yan', 'y_ex_yan', '再硬一截。帳，加一筆。']
      ],
      clear:[
        ['yy:huang', 'y_ex_huang', '打完了。桌上五副碗。誰加的那一副，不要問。']
      ],
      cl:['cl', 'firm', '第四副我認得。第五副……我先記著，不擦。'],
      ring:{
        pact:'vanity',
        img:'ring_vanity',
        n:'碎鑽磷光戒',
        finger:'右無名指'
      }
    },
    {
      id:'asc_20',
      lv:20,
      n:'只喚一次',
      key:'recallOnce',
      flavor:'喚回這一局只夠用一次。第二次，沒有人喊。',
      entry:[
        ['cl', 'firm', '姐姐，看我。這一局我只能喊一次。聽到就回來。'],
        ['yy:yan', 'y_ex_yan', '聽到了。第一次，我會回來。']
      ],
      clear:[
        ['yy:huang', 'y_ex_huang', '最底。'],
        ['yy:yan', 'y_ex_yan', '最底。……燈還在往下指。']
      ],
      cl:['cl', 'worry', '稱號是「最底」。可是井還在跳。'],
      ring:{
        pact:'glutton',
        img:'ring_glutton',
        n:'血果凍戒',
        finger:'右小指'
      }
    }
  ],
  recall20:{
    first:[
      ['cl', 'firm', '姐姐，看我。是我。']
    ],
    warn:[
      ['cl', 'firm', '姐姐，看我。這一局我只能喊一次。聽到就回來。']
    ],
    denied:[
      ['sc', null, '（喚回沒有響起。燈的方向是空的。）'],
      ['yy:all', 'y_full_merge', '……沒有人喊。'],
      ['yy:huang', 'y_ex_huang', '喊過一次了。這次自己走。']
    ]
  },
  teaser:[
    ['sc', null, '（深潛 20 通關。）'],
    ['yy:huang', 'y_ex_huang', '最底？'],
    ['yy:yan', 'y_ex_yan', '巷口的井還在跳。跳的不是這一截。'],
    ['cl', 'firm', '姐姐，燈還有一截。我沒寫完。'],
    ['yy:xi', 'y_ex_xi', '哈。寫不完就對了♡'],
    ['yy:all', 'y_full_merge', '再下去的那一截，現在還不叫它。'],
    ['gu', null, '我的卷宗還少一頁。別急著結案。']
  ],
  titleBottom:{
    id:'最底',
    when:'第一次通關 asc_20，真潛提示 teaser 播完之後才給',
    title:'最底',
    body:'深潛二十階走完了。稱號落下。井還在跳。',
    btn:'收下',
    line:['cl', 'worry', '稱號是「最底」。可是井還在跳。']
  },
  backs:[
    {
      id:'cb_asc5',
      when:'第一次通關 asc_5',
      n:'咒入袋',
      d:'卡背多一張不是妳選的符紙。',
      line:['yy:xi', 'y_ex_xi', '咒印上去了♡ 揭下來還會在。']
    },
    {
      id:'cb_asc10',
      when:'第一次通關 asc_10',
      n:'詞跟上身',
      d:'卡背多了一個字，有時是狂，有時是腐。',
      line:['yy:yan', 'y_ex_yan', '字印在牌背上。打的時候會亮一下。']
    },
    {
      id:'cb_asc15',
      when:'第一次通關 asc_15',
      n:'罪醒了',
      d:'卡背是一宗沒寫全的罪。',
      line:['yy:huang', 'y_ex_huang', '罪的邊還沒描完。正好。']
    },
    {
      id:'cb_asc20',
      when:'第一次通關 asc_20',
      n:'只喚一次',
      d:'卡背是一盞燈，燈芯只剩一截。',
      line:['cl', 'firm', '燈還在。這一截，我留著。']
    }
  ],
  events:[
    {
      id:'d27_lastfall',
      n:'還印著的那一跤',
      need:{
        cleared:1
      },
      txt:'地面上有一個倒下去的印，大小是妳的。旁邊寫著上次的地點：{where}。字下面還有一個名字：{foe}。',
      opts:[
        {
          t:'踩進去',
          r:[
            {
              alien:8
            },
            {
              upgradeRandom:1
            }
          ],
          d:'異化值 +8，隨機升級一張牌'
        },
        {
          t:'把印擦掉',
          r:[
            {
              heal:10
            }
          ],
          d:'回復 10 生命'
        },
        {
          t:'撿起寫著名字的那張紙',
          r:[
            {
              card:'x_regret'
            }
          ],
          d:'牌組加入「沉重的回憶」'
        }
      ]
    },
    {
      id:'d27_halfpage',
      n:'沒有署名的半頁',
      need:{
        cleared:1
      },
      txt:'牆縫裡夾著半頁紙。開頭被撕掉了。剩下的字寫：還有人沒回來。沒有地址，沒有署名。',
      opts:[
        {
          t:'收進袖裡',
          r:[
            {
              cardRare:1
            }
          ],
          d:'得到一張稀有的牌'
        },
        {
          t:'讀完放回',
          r:[
            {
              heal:8
            }
          ],
          d:'回復 8 生命'
        },
        {
          t:'把撕口的方向記下來',
          r:[
            {
              gold:25
            },
            {
              alien:5
            }
          ],
          d:'得到 25 渡鴉幣，異化值 +5'
        }
      ]
    },
    {
      id:'d27_stairs',
      n:'數不準的階',
      need:{
        ascMin:5
      },
      txt:'井口到樓梯，妳記得是十三階。今天踩下去，多出一階。多的那一階是乾的，沒有塵。',
      opts:[
        {
          t:'踏上去',
          r:[
            {
              hurt:6
            },
            {
              relicRandom:1
            }
          ],
          d:'失去 6 生命，得到一件遺物'
        },
        {
          t:'跳過它',
          r:[
            {
              heal:6
            }
          ],
          d:'回復 6 生命'
        },
        {
          t:'在多的那一階做個記號',
          r:[
            {
              gold:20
            }
          ],
          d:'得到 20 渡鴉幣'
        }
      ]
    },
    {
      id:'d27_guildchair',
      n:'沒有人坐的位子',
      need:{
        cleared:1
      },
      txt:'公會的長桌還在。上首那把椅子是空的。椅面上沒有灰塵，也沒有名字。從來沒有人在那裡坐過一整夜。',
      opts:[
        {
          t:'不坐',
          r:[
            {
              heal:12
            }
          ],
          d:'回復 12 生命'
        },
        {
          t:'在椅背上留下一根白金頭髮',
          r:[
            {
              maxhp:3
            }
          ],
          d:'最大生命 +3'
        },
        {
          t:'問旁邊值班的人，誰坐上首',
          r:[
            {
              gold:15
            }
          ],
          d:'得到 15 渡鴉幣。他搖頭。沒有人接這句。'
        }
      ]
    },
    {
      id:'d27_fifthbowl',
      n:'多出來的碗',
      need:{
        ascMin:7
      },
      txt:'巷裡那張桌子，本來四副碗筷。現在是五副。第五隻碗是溫的，裡面沒有東西。',
      opts:[
        {
          t:'把第五副收走',
          r:[
            {
              cardPick:1
            },
            {
              alien:6
            }
          ],
          d:'從三張牌選一張，異化值 +6'
        },
        {
          t:'把碗倒扣',
          r:[
            {
              heal:10
            }
          ],
          d:'回復 10 生命'
        },
        {
          t:'不動',
          r:[],
          d:'離開'
        }
      ]
    },
    {
      id:'d27_catturn',
      n:'井口的貓',
      need:{
        ascMin:10
      },
      txt:'巷尾的貓還在。牠不朝井口跪了。牠朝妳。一聲都不叫。',
      opts:[
        {
          t:'蹲下去看牠的眼睛',
          r:[
            {
              upgradeRandom:1
            },
            {
              hurt:4
            }
          ],
          d:'隨機升級一張牌，失去 4 生命'
        },
        {
          t:'繞過去',
          r:[
            {
              heal:8
            }
          ],
          d:'回復 8 生命'
        },
        {
          t:'問牠下面還有沒有路',
          r:[
            {
              alien:8
            },
            {
              gold:30
            }
          ],
          d:'異化值 +8，得到 30 渡鴉幣。貓不答。'
        }
      ]
    },
    {
      id:'d27_returntag',
      n:'退回來的名牌',
      need:{
        cleared:1
      },
      txt:'一枚名牌被退到腳邊。正面刻著妳上一次倒下的地方：{where}。背面只有一個爪印。',
      opts:[
        {
          t:'掛回領圈旁邊',
          r:[
            {
              maxhp:5
            },
            {
              hurt:5
            }
          ],
          d:'最大生命 +5，失去 5 生命'
        },
        {
          t:'丟回井裡',
          r:[
            {
              gold:40
            }
          ],
          d:'得到 40 渡鴉幣'
        },
        {
          t:'交給妹妹收著',
          r:[
            {
              heal:14
            }
          ],
          d:'回復 14 生命'
        }
      ]
    },
    {
      id:'d27_undershelf',
      n:'巢底下那一格',
      need:{
        ascMin:13
      },
      txt:'第九層的巢，底板有一格是空的。空格裡沒有東西，只有刮痕，從裡頭往外抓。',
      opts:[
        {
          t:'伸手進去',
          r:[
            {
              hurt:10
            },
            {
              cardRare:1
            }
          ],
          d:'失去 10 生命，得到一張稀有的牌'
        },
        {
          t:'用線縫上',
          r:[
            {
              heal:8
            }
          ],
          d:'回復 8 生命'
        },
        {
          t:'記下刮痕的方向',
          r:[
            {
              gold:20
            }
          ],
          d:'得到 20 渡鴉幣'
        }
      ]
    },
    {
      id:'d27_halfcall',
      n:'沒喊完的那一聲',
      need:{
        ascMin:15
      },
      txt:'燈的方向傳來半個字。喚回該有的那一句，只落到「姐——」就斷了。空氣裡沒有第二個人。',
      opts:[
        {
          t:'自己把後面接上',
          r:[
            {
              heal:10
            }
          ],
          d:'回復 10 生命'
        },
        {
          t:'等',
          r:[
            {
              alien:10
            }
          ],
          d:'異化值 +10'
        },
        {
          t:'把這半個字寫下來',
          r:[
            {
              upgradeRandom:1
            }
          ],
          d:'隨機升級一張牌'
        }
      ]
    },
    {
      id:'d27_blankpage',
      n:'卷宗空白',
      need:{
        ascMin:3
      },
      txt:'顧沉舟的卷宗又少了一頁。他說不是同一頁。空白的地方有水漬，不是墨。',
      opts:[
        {
          t:'把空白那頁抄走',
          r:[
            {
              card:'x_whisper'
            }
          ],
          d:'牌組加入「耳邊的低語」'
        },
        {
          t:'幫他對光照一下',
          r:[
            {
              gold:25
            }
          ],
          d:'得到 25 渡鴉幣'
        },
        {
          t:'不問',
          r:[
            {
              heal:6
            }
          ],
          d:'回復 6 生命'
        }
      ],
      talk:[
        ['gu', null, '我不會在這裡結案。']
      ]
    }
  ],
  highTier:[
    {
      id:'mailbox',
      n:'倒懸郵筒怪',
      lines:[
        ['yy:yan', 'y_ex_yan', '筒口朝下，還在等信。信是妳。'],
        ['yy:yan', 'y_ex_yan', '蓋回去。退件無效。']
      ]
    },
    {
      id:'scribe',
      n:'無名抄行者',
      lines:[
        ['yy:huang', 'y_ex_huang', '牠在抄妳剛才那一步。抄完會再走一次。'],
        ['yy:huang', 'y_ex_huang', '名字空著的，抄不走我。']
      ]
    },
    {
      id:'alchemist',
      n:'煉丹的師父',
      lines:[
        ['yy:yan', 'y_ex_yan', '爐子比他先醒。第二口丹是熱的。'],
        ['yy:yan', 'y_ex_yan', '不吃。這爐我掀掉。']
      ]
    },
    {
      id:'jiangshi_boy',
      n:'走屍道童',
      lines:[
        ['yy:xi', 'y_ex_xi', '符紙又換新的了。舊的還在袖裡。'],
        ['yy:yan', 'y_ex_yan', '符貼不到我臉上。']
      ]
    },
    {
      id:'wgod',
      n:'游神',
      lines:[
        ['yy:huang', 'y_ex_huang', '神不在座上，座還在遊。'],
        ['yy:huang', 'y_ex_huang', '遊到我面前，就停在這裡。']
      ]
    },
    {
      id:'chorus',
      n:'舊戶籍合唱體',
      lines:[
        ['yy:yan', 'y_ex_yan', '戶口簿一起出聲。少一個名字，牠們會補。'],
        ['yy:yan', 'y_ex_yan', '合唱到第三句，我會拆譜。']
      ]
    },
    {
      id:'welleye',
      n:'井底的眼',
      lines:[
        ['yy:huang', 'y_ex_huang', '牠把上次看妳的三秒，又放了一遍。'],
        ['yy:huang', 'y_ex_huang', '閉眼也沒用。我讓線下去。']
      ]
    },
    {
      id:'skel',
      n:'鎖鏈骷髏守衛',
      lines:[
        ['yy:yan', 'y_ex_yan', '鎖比骨先動手。鏈會記得長度。'],
        ['yy:yan', 'y_ex_yan', '鏈收短。骨頭留給我。']
      ]
    },
    {
      id:'giant',
      n:'燭苔巨人',
      lines:[
        ['yy:xi', 'y_ex_xi', '苔在長。燭芯比上一回長一截。'],
        ['yy:xi', 'y_ex_xi', '苔刮掉。火我來滅。']
      ]
    },
    {
      id:'ironlung',
      n:'鐵肺修女',
      lines:[
        ['yy:huang', 'y_ex_huang', '喇叭裡的禱告，第二段起了調。'],
        ['yy:yan', 'y_ex_yan', '別應。第二段也不應。']
      ]
    },
    {
      id:'e04_jelly',
      n:'灰宴水母',
      lines:[
        ['yy:huang', 'y_ex_huang', '假笑更厚。觸鬚上掛著上一場的餘溫。'],
        ['yy:huang', 'y_ex_huang', '這場宴，我還是不入席。']
      ]
    },
    {
      id:'timekeeper',
      n:'計時官',
      lines:[
        ['yy:huang', 'y_ex_huang', '牠把上一局的秒針，又撥回來一格。'],
        ['yy:huang', 'y_ex_huang', '時間不借。針我掰直。']
      ]
    },
    {
      id:'blindoff',
      n:'蒙眼的典獄',
      lines:[
        ['yy:xi', 'y_ex_xi', '布是新的。布後面那隻眼不是。'],
        ['yy:xi', 'y_ex_xi', '蒙眼的，我偏要牠看清楚。']
      ]
    },
    {
      id:'badger',
      n:'鐘獾',
      lines:[
        ['yy:xi', 'y_ex_xi', '鐘聲慢半拍，爪卻準。'],
        ['yy:xi', 'y_ex_xi', '慢的那一拍，我先下口♡']
      ]
    },
    {
      id:'clocktower',
      n:'走慢的鐘塔',
      lines:[
        ['yy:yan', 'y_ex_yan', '塔還在走，走的是上一場沒走完的那一格。'],
        ['yy:yan', 'y_ex_yan', '停針。人從裡面出來。']
      ]
    },
    {
      id:'ch4guard',
      n:'剪票員',
      lines:[
        ['yy:xi', 'y_ex_xi', '票根剪到一半，改剪袖口。'],
        ['yy:yan', 'y_ex_yan', '票是假的也要過。我過了。']
      ]
    },
    {
      id:'giant_x',
      n:'候車的巨人',
      lines:[
        ['yy:huang', 'y_ex_huang', '空位旁邊，牠又站直了一點。'],
        ['yy:huang', 'y_ex_huang', '末班車沒來。牠先倒下。']
      ]
    },
    {
      id:'e13_garden',
      n:'無聲菌庭',
      lines:[
        ['yy:huang', 'y_ex_huang', '聽不見的時候，菌已經長到靴面。'],
        ['yy:huang', 'y_ex_huang', '安靜的，我也收。']
      ]
    },
    {
      id:'n3_lamia',
      n:'白鱗的蛇蛛',
      lines:[
        ['yy:yan', 'y_ex_yan', '鱗是白的，網是熱的。網按現在這張臉織。'],
        ['yy:huang', 'y_ex_huang', '網裡那張臉，不是給牠用的。']
      ]
    },
    {
      id:'n3_lich',
      n:'結網的頭骨',
      lines:[
        ['yy:yan', 'y_ex_yan', '頭骨上的字，多了一筆，是妳的。'],
        ['yy:yan', 'y_ex_yan', '字擦掉。骨留下。']
      ]
    },
    {
      id:'n3_deep',
      n:'沉在底下的影子',
      lines:[
        ['yy:huang', 'y_ex_huang', '影子比人先站起來。'],
        ['yy:huang', 'y_ex_huang', '沉的，我按回去。']
      ]
    },
    {
      id:'n3_kraken',
      n:'白色的眼群',
      lines:[
        ['yy:huang', 'y_ex_huang', '眼睛又多數一隻。數不清的那隻在看燈。'],
        ['yy:huang', 'y_ex_huang', '燈不給。眼我一隻一隻關。']
      ]
    },
    {
      id:'n3_brood',
      n:'千子的窩',
      lines:[
        ['yy:yan', 'y_ex_yan', '窩裡的聲音比上一回密。'],
        ['yy:yan', 'y_ex_yan', '孩子再多，也過不了這道線。']
      ]
    },
    {
      id:'n3_lamp',
      n:'襤褸的黃燈',
      lines:[
        ['yy:xi', 'y_ex_xi', '黃燈認錯人了。它喊的不是現在這張臉。'],
        ['yy:huang', 'y_ex_huang', '燈我拿走。名字不還。']
      ]
    },
    {
      id:'wusign',
      n:'退件執事・無簽',
      lines:[
        ['yy:yan', 'y_ex_yan', '第二次簽名，牠簽的是妳的姓。'],
        ['yy:yan', 'y_ex_yan', '姓不借。命線夠用。']
      ]
    },
    {
      id:'qianhao',
      n:'總分揀機・千號',
      lines:[
        ['yy:xi', 'y_ex_xi', '千號排到一千零一。多的那一號是空的。'],
        ['yy:xi', 'y_ex_xi', '空號我來填。填「停」。']
      ]
    },
    {
      id:'deepdrill',
      n:'掘進機・深挖',
      lines:[
        ['yy:huang', 'y_ex_huang', '它說下面還有。我不跟著這句走。'],
        ['yy:huang', 'y_ex_huang', '挖到這裡。再往下，不是給它的。']
      ]
    },
    {
      id:'namegate',
      n:'千名之門',
      lines:[
        ['yy:yan', 'y_ex_yan', '門縫裡又多一個凹槽，長度剛好。'],
        ['yy:yan', 'y_ex_yan', '凹槽空著。我不躺進去。']
      ]
    },
    {
      id:'lastpost',
      n:'最後一個郵差',
      lines:[
        ['yy:huang', 'y_ex_huang', '信袋裡有一封退件，收件人寫過兩次。'],
        ['yy:huang', 'y_ex_huang', '這封我不簽收。你退回去。']
      ]
    },
    {
      id:'stationmaster',
      n:'站長・時刻表',
      lines:[
        ['yy:yan', 'y_ex_yan', '背面那班車，終點欄是空白。'],
        ['yy:yan', 'y_ex_yan', '空白我認得。我們不搭。']
      ]
    },
    {
      id:'nh_fox',
      n:'沒有回家的九尾',
      lines:[
        ['yy:yan', 'y_ex_yan', '九條尾巴尖是紅的。紅的位置，跟我一樣。'],
        ['yy:xi', 'y_ex_xi', '耳墜還我。回去的路不給妳。']
      ]
    },
    {
      id:'nh_sea',
      n:'冷光之母',
      lines:[
        ['yy:huang', 'y_ex_huang', '牠要妳把燈留下。家裡更吵，我選吵的。'],
        ['yy:huang', 'y_ex_huang', '燈全帶走。一盞不留。']
      ]
    },
    {
      id:'nh_her',
      n:'睡著的那一個',
      lines:[
        ['yy:yan', 'y_ex_yan', '她手裡那張紙還在。字我看過。不是在下面。'],
        ['yy:huang', 'y_ex_huang', '醒來也沒用。回家的是我。']
      ]
    }
  ],
  traits:[
    {
      id:'excess',
      n:'過剩',
      blurb:'東西多出來。多的那一截也是牠，打不掉。',
      lines:[
        ['foe', null, '還有。還有。'],
        ['yy:yan', 'y_ex_yan', '多的那一層，我一併記上。'],
        ['yy:xi', 'y_ex_xi', '皮真厚♡ 那就多砍幾刀。']
      ]
    },
    {
      id:'scheme',
      n:'算計',
      blurb:'每三回合從妳手裡換走一張牌，改成詛咒，只活在這一場。',
      lines:[
        ['foe', null, '這張，換我的。'],
        ['yy:huang', 'y_ex_huang', '三拍一換。我先數。'],
        ['yy:yan', 'y_ex_yan', '咒是暫住的。場結束，帳還在。']
      ]
    },
    {
      id:'rot',
      n:'腐',
      blurb:'打中以後，下回合少 1 點能量。每一回合最多一次。',
      lines:[
        ['foe', null, '氣漏了。'],
        ['yy:xi', 'y_ex_xi', '下一拍少一口氣。那就這一口打完♡'],
        ['cl', 'worry', '姐姐，手沉了一下。先擋。']
      ]
    },
    {
      id:'rage',
      n:'狂',
      blurb:'生命低於一半時，攻擊更重。',
      lines:[
        ['foe', null, '半以下。打開。'],
        ['yy:huang', 'y_ex_huang', '血少了，牠反而準。盡快收。'],
        ['yy:xi', 'y_ex_xi', '好♡ 我也是血越少越想砸。']
      ]
    }
  ],
  sins:[
    {
      id:'pride',
      n:'傲慢（傲）',
      wake:[
        ['yy:huang', 'y_ex_huang', '這一章，傲醒了。牠們不低頭。']
      ],
      battle:[
        ['yy:huang', 'y_ex_huang', '不低頭的，我讓路給刀。'],
        ['foe', null, '跪是你們的事。']
      ]
    },
    {
      id:'greed',
      n:'貪婪（貪）',
      wake:[
        ['yy:yan', 'y_ex_yan', '這一章，貪醒了。什麼都要多拿一筆。']
      ],
      battle:[
        ['yy:yan', 'y_ex_yan', '想拿的，先過我的帳。'],
        ['foe', null, '那件，也是我的。']
      ]
    },
    {
      id:'glutton',
      n:'暴食（饞）',
      wake:[
        ['yy:xi', 'y_ex_xi', '這一章，饞醒了。還會有下一口♡']
      ],
      battle:[
        ['yy:xi', 'y_ex_xi', '餵不飽的，就讓它噎著。'],
        ['foe', null, '還不夠。再近一點。']
      ]
    },
    {
      id:'envy',
      n:'嫉妒（嫉）',
      wake:[
        ['yy:yan', 'y_ex_yan', '這一章，嫉醒了。牠們盯的是妳手上那盞。']
      ],
      battle:[
        ['yy:yan', 'y_ex_yan', '燈不借。看夠了就還手。'],
        ['cl', 'firm', '這盞是我的。不給。']
      ]
    },
    {
      id:'wrath',
      n:'暴怒（怒）',
      wake:[
        ['yy:xi', 'y_ex_xi', '這一章，怒醒了。開關壞了♡']
      ],
      battle:[
        ['yy:xi', 'y_ex_xi', '怒的跟我撞，正好。'],
        ['foe', null, '誰先動手，誰就要打完。']
      ]
    },
    {
      id:'sloth',
      n:'怠惰（怠）',
      wake:[
        ['yy:huang', 'y_ex_huang', '這一章，怠醒了。動作會慢半拍，打中卻更沉。']
      ],
      battle:[
        ['yy:huang', 'y_ex_huang', '慢的那一下，不要跟著它睡。'],
        ['foe', null, '……再等。再等。']
      ]
    },
    {
      id:'thirst',
      n:'色慾（渴）',
      note:'只寫渴：要燈、要名字、要餘溫。不寫性。',
      wake:[
        ['yy:yan', 'y_ex_yan', '這一章，渴醒了。牠們看燈的時間比看路長。']
      ],
      battle:[
        ['yy:yan', 'y_ex_yan', '別把燈舉太近。渴的東西會跟著亮走。'],
        ['cl', 'worry', '姐姐，牠在看燈芯。我們換一隻手舉。']
      ]
    }
  ],
  bossPhase2:[
    {
      id:'wusign',
      n:'退件執事・無簽',
      line:['yy:yan', 'y_ex_yan', '退件無效。牠改簽第二次。']
    },
    {
      id:'qianhao',
      n:'總分揀機・千號',
      line:['yy:xi', 'y_ex_xi', '編號重新排。從我開始♡']
    },
    {
      id:'deepdrill',
      n:'掘進機・深挖',
      line:['yy:huang', 'y_ex_huang', '鑽頭換了一檔。它不會停。']
    },
    {
      id:'namegate',
      n:'千名之門',
      line:['yy:yan', 'y_ex_yan', '門又開了一道。名字還不夠。']
    },
    {
      id:'lastpost',
      n:'最後一個郵差',
      line:['yy:huang', 'y_ex_huang', '查無此人。牠要再送一次。']
    },
    {
      id:'stationmaster',
      n:'站長・時刻表',
      line:['yy:yan', 'y_ex_yan', '時刻表翻到背面。末班車還沒開。']
    },
    {
      id:'nh_fox',
      n:'沒有回家的九尾',
      line:['yy:xi', 'y_ex_xi', '沒回去的那一隻，尾巴全張開了。']
    },
    {
      id:'nh_sea',
      n:'冷光之母',
      line:['yy:huang', 'y_ex_huang', '冷光更亮。燈全朝我。']
    },
    {
      id:'nh_her',
      n:'睡著的那一個',
      line:['yy:yan', 'y_ex_yan', '睡著的那一個，眼睛睜開了。']
    }
  ],
  rings:[
    {
      id:'pride',
      finger:'左拇指',
      n:'星核黑洞戒',
      img:'ring_pride',
      d:'戒面是一粒黑的星核，光只進不出。',
      lit:['yy:huang', 'y_ex_huang', '左拇指亮了。光進了這枚核，就不出來。']
    },
    {
      id:'envy',
      finger:'左食指',
      n:'轉動的眼珠戒',
      img:'ring_envy',
      d:'戒面是一顆會自己轉的眼珠，總望向別人手上的東西。',
      lit:['yy:yan', 'y_ex_yan', '左食指亮了。這隻眼，先看別人再看我。']
    },
    {
      id:'obsess',
      finger:'左中指',
      n:'觸手神經戒',
      img:'ring_obsess',
      d:'戒圈是幾條細觸手，裡面走著神經，會自己收緊。',
      lit:['yy:yan', 'y_ex_yan', '左中指亮了。觸手繞了一圈，神經還在跳。']
    },
    {
      id:'devotion',
      finger:'左無名指',
      n:'渡鴉之鎖',
      img:'ring_devotion',
      d:'黑金婚戒，戒內嵌一滴淚狀的星。是與渡鴉的誓，戴在左無名指。',
      lit:['yy:yan', 'y_ex_yan', '左無名指亮了。渡鴉之鎖認這個人。']
    },
    {
      id:'cruelty',
      finger:'左小指',
      n:'人臉血肉戒',
      img:'ring_cruelty',
      d:'戒面是一張縮小的人臉，血色的紋會自己換表情。',
      lit:['yy:xi', 'y_ex_xi', '左小指亮了。這張小臉，換到最後一下♡']
    },
    {
      id:'greed',
      finger:'右拇指',
      n:'黃金咬指口',
      img:'ring_greed',
      d:'黃金鑄成的小口，齒合在指根上，合上就不鬆。',
      lit:['yy:yan', 'y_ex_yan', '右拇指亮了。這張金口，合上就不鬆。']
    },
    {
      id:'wrath',
      finger:'右食指',
      n:'荊棘詛咒戒',
      img:'ring_wrath',
      d:'一圈乾荊棘箍在指上，刺朝外，偶爾朝內。',
      lit:['yy:xi', 'y_ex_xi', '右食指亮了。荊棘咬進來，正好♡']
    },
    {
      id:'sweetmalice',
      finger:'右中指',
      n:'藏針珍珠戒',
      img:'ring_sweetmalice',
      d:'白玉戒面嵌一粒珍珠，珠下面藏著細針，不亮的時候看不見。',
      lit:['yy:yan', 'y_ex_yan', '右中指亮了。珠是白的，針在下面。']
    },
    {
      id:'vanity',
      finger:'右無名指',
      n:'碎鑽磷光戒',
      img:'ring_vanity',
      d:'碎鑽嵌成一圈，自己會泛一層冷的磷光。',
      lit:['yy:huang', 'y_ex_huang', '右無名指亮了。碎鑽自己在泛冷光。']
    },
    {
      id:'glutton',
      finger:'右小指',
      n:'血果凍戒',
      img:'ring_glutton',
      d:'戒面是一坨暗紅、帶蜜色的果凍，表面會慢慢重新合攏。',
      lit:['yy:xi', 'y_ex_xi', '右小指亮了。這坨還沒冷，還會合上♡']
    }
  ],
  unlockHalfPalm:{
    id:'半掌',
    when:'同一局裡同時亮起 5 枚戒',
    title:'半掌',
    sfx:'sfx_ring',
    body:'五枚戒一起亮了。掌心還是暗的。另外五指，等下一局，或等這一局再簽。',
    btn:'收下',
    line:['yy:yan', 'y_ex_yan', '半掌。亮的五指我認得，暗的五指我也記得。']
  },
  unlockTenColor:{
    id:'十指十色',
    when:'跨局累計十枚都亮過',
    also:'cb_rings',
    sfx:'sfx_ring_ten',
    title:'十指十色',
    body:'十指都亮過了。卡背換成十枚戒。渡鴉之鎖仍在左無名指，最左那一枚。',
    btn:'收下',
    line:['yy:all', 'y_full_merge', '十指十色。這一雙手，帳齊了。']
  },
  ideas:['敵人認前臉：嫣在前時，厄契會被彈回來；熙在前時，自己流的血會養牠；凰在前時，回復會被牠先喝一口。讓玩家在換臉前先看清場上站的是誰。', '有一個首領會把這一局僅有的那一次喚回吞掉。吞掉以後，合相結束沒有人喊，只能自己走出來。深潛 20 已經限制次數，這個是把那一次也搶走。', '裡側搶牌在高階會搶走「就是不能在這一張臉上打出」的那一張，讓同體宿敵真的在拆台，不是只換色。', '撿到的半頁紙可以變成一張詛咒，或變成下一局開場的一條線索。線索指向還沒收束的人和地方，不要指向井的盡頭。', '帶著某一宗罪的敵人，會拒收對應的慾望契效果，要靠另外兩張臉過關。', '巷裡變動過的東西（少一階、第五隻碗、轉向的貓）如果玩家在事件裡做了記號，下一局還在，讓人願意再下去核對。']
};

if (typeof module !== 'undefined') module.exports = TEXT_V027;
