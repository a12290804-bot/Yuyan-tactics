// 《渡鴉下潛》文字劇情 v0.27　通關後・深潛 20 階
// 對齊規則 v0.10。深潛 id：asc_1～asc_20。詞綴 excess/scheme/rot/rage。罪用 DATA.sinName。
// 說話人：yy:yan／yy:xi／yy:huang／yy:all、cl、gu、ry。
// 喚回主句不動。第 20 階每局只喚一次，第二次見 recall20.denied。
// 戒圖 id（923bd47）：ring_devotion / ring_pride / ring_envy / ring_obsess / ring_cruelty /
// ring_greed / ring_wrath / ring_sweetmalice / ring_vanity / ring_glutton。
// 說明見同目錄「文字_v0.27_通關後.md」。
// 直白改寫：發生什麼、是誰做的、對玩家有什麼影響，都用完整句子說清楚。

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
      flavor:'敵人又長出一層皮。要多砍一刀才打得死。',
      entry:[
        ['yy:yan', 'y_ex_yan', '敵人多長了一層皮。要多砍一刀。我記下來。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '這一層打完了。下面的敵人還會再長皮。']
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
      flavor:'地圖上多出一格菁英。那一格不是路，是多出來的敵人。',
      entry:[
        ['yy:xi', 'y_ex_xi', '地圖多了一格菁英♡ 正好，我正想多打一隻。']
      ],
      clear:[
        ['yy:xi', 'y_ex_xi', '多出來的那隻，我打掉了。下次地圖還會再多一格。']
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
      flavor:'營火還在燒，但休息回復的生命變少了。',
      entry:[
        ['yy:huang', 'y_ex_huang', '火還亮著。休息補不滿血。別指望它把妳暖回來。']
      ],
      clear:[
        ['yy:huang', 'y_ex_huang', '休息過了。血沒補滿。就是這一階的規則。']
      ],
      cl:['cl', 'worry', '姐姐，火比上次小。休息回復變少了。我再添一根。'],
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
      flavor:'敵人的普通一擊比以前重。',
      entry:[
        ['yy:yan', 'y_ex_yan', '敵人的牙長了。這一擊比以前重。我記重一筆。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '打回來了。敵人的攻擊還會再往上加。']
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
      flavor:'開局牌組裡會多一張詛咒。不是妳選的。',
      entry:[
        ['yy:xi', 'y_ex_xi', '誰塞進來的♡ 開局牌組裡就有一張詛咒。']
      ],
      clear:[
        ['yy:xi', 'y_ex_xi', '詛咒還在牌組底下。下一局開場還會再塞進來。']
      ],
      cl:['cl', 'firm', '姐姐，開局那張牌不是我們的。是詛咒。我寫下來了。'],
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
      flavor:'首領的生命變高了。牠還坐得住。',
      entry:[
        ['yy:huang', 'y_ex_huang', '首領的血更厚。牠還坐著。別急著報完。']
      ],
      clear:[
        ['yy:huang', 'y_ex_huang', '首領倒下了。椅子還是熱的。這一階打完了。']
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
      flavor:'商店的價錢變貴了。',
      entry:[
        ['yy:yan', 'y_ex_yan', '店裡的標價變貴了。買之前先算這筆划不划。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '付過了。巷口那盞燈今天是白的，以前是黃的。']
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
      flavor:'還沒出發，身上就已經有異化值。',
      entry:[
        ['yy:huang', 'y_ex_huang', '還沒下去，異化值就已經加上了。領圈上那隻眼已經睜開。']
      ],
      clear:[
        ['yy:huang', 'y_ex_huang', '異化值是開局就有的。我帶著它走完了這一階。']
      ],
      cl:['cl', 'worry', '姐姐，領圈跳得比出門時快。異化值開局就有了。'],
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
      flavor:'選牌本來可以看三張，現在只能看兩張。',
      entry:[
        ['yy:xi', 'y_ex_xi', '選牌少看一張。只剩兩張。夠狠就行♡']
      ],
      clear:[
        ['yy:xi', 'y_ex_xi', '兩張牌也打完了。下次還是只能看兩張。']
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
      flavor:'菁英名字前面會多一個詞綴：過剩、算計、腐、或狂。',
      entry:[
        ['yy:yan', 'y_ex_yan', '菁英會帶詞綴。過剩、算計、腐、狂。哪個跟上來，我就打哪個。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '帶詞綴的菁英打倒了。那個字還黏在手套上。']
      ],
      cl:['cl', 'firm', '姐姐，敵人名字前面多了一個字。我連那個字一起記。'],
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
      flavor:'出發以前，生命就先少一截。',
      entry:[
        ['yy:huang', 'y_ex_huang', '開局生命少了一截。純血能自己補，但不是現在。']
      ],
      clear:[
        ['yy:huang', 'y_ex_huang', '走完了。井口到樓梯今天只有十二階，以前是十三階。']
      ],
      cl:['cl', 'worry', '姐姐，井口到樓梯本來十三階。我數到十二。少的那一階，我畫在本子上。'],
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
      flavor:'敵人的格擋更厚。刀要多砍幾下才能打進去。',
      entry:[
        ['yy:yan', 'y_ex_yan', '敵人的殼更厚了。線要繞兩圈才切得開。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '外殼拆開了。裡面還有一層殼。這一階打完了。']
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
        ['yy:xi', 'y_ex_xi', '前半場算熱身♡ 生命掉到一半，首領會換成另一種打法。']
      ],
      clear:[
        ['yy:xi', 'y_ex_xi', '第二階段也打完了。首領沒有第三場。']
      ],
      cl:['cl', 'firm', '姐姐，首領生命掉到一半還會再變一次。燈我舉著。'],
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
      flavor:'菁英身上的遺物，有一半不會掉出來。',
      entry:[
        ['yy:huang', 'y_ex_huang', '菁英口袋裡的遺物，有一半不會掉出來。逼也沒用。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '渡鳥巷——……渡鴉巷。東西帶上來了，少一件遺物。']
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
      flavor:'這一章會抽出一宗罪。整層的敵人都帶著這個罪。',
      entry:[
        ['yy:all', 'y_full_merge', '罪醒了。這一章的敵人都跟著同一宗罪打。']
      ],
      clear:[
        ['yy:all', 'y_full_merge', '這一章的罪先按回去了。下一章還會再抽一宗。']
      ],
      cl:['cl', 'worry', '姐姐，這一章的敵人共用一個罪。不是我們家的字。'],
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
      flavor:'第一回合，手牌少抽一張。',
      entry:[
        ['yy:xi', 'y_ex_xi', '第一回合少抽一張。少一張就用疼的補♡']
      ],
      clear:[
        ['yy:xi', 'y_ex_xi', '缺的那張，我從敵人手上搶回來了。這一階打完了。']
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
      flavor:'戰鬥進入第十二回合以後，敵人的攻擊會越來越高。',
      entry:[
        ['yy:huang', 'y_ex_huang', '第十二回合以後敵人會發狂，攻擊變高。在那之前結束。']
      ],
      clear:[
        ['yy:yan', 'y_ex_yan', '十二回合以前收掉了。巷尾的貓今天朝人跪，不朝井口。']
      ],
      cl:['cl', 'worry', '巷尾的貓不朝井口跪了。牠看著我們，一聲都不叫。'],
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
      flavor:'連普通敵人都可能帶著詞綴。',
      entry:[
        ['yy:xi', 'y_ex_xi', '普通敵人也可能帶詞綴♡ 好啊，來齊。']
      ],
      clear:[
        ['yy:xi', 'y_ex_xi', '帶詞綴的、不帶的，都打倒了。茶是涼的，桌子卻是熱的。']
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
      flavor:'首領生命更高，敵人攻擊也更重。',
      entry:[
        ['yy:yan', 'y_ex_yan', '首領更厚，敵人攻擊也更重。帳再加一筆。']
      ],
      clear:[
        ['yy:huang', 'y_ex_huang', '打完了。桌上有五副碗，以前是四副。沒人知道是誰加的。']
      ],
      cl:['cl', 'firm', '桌上本來四副碗。第五副我先記著，不擦。'],
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
      flavor:'克勞德的喚回這一局只能用一次。第二次合相結束，沒有人喊，只能自己走出來。',
      entry:[
        ['cl', 'firm', '姐姐，看我。這一局我只能喊一次。聽到就回來。'],
        ['yy:yan', 'y_ex_yan', '聽到了。第一次我會回來。第二次沒有人喊，我們自己走。']
      ],
      clear:[
        ['yy:huang', 'y_ex_huang', '二十階走完了。'],
        ['yy:yan', 'y_ex_yan', '巷口的井還在往下。更深的地方現在走不到。']
      ],
      cl:['cl', 'worry', '姐姐，這一局我只能喊一次。第二次沒有人喊，我們要自己走出來。'],
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
      ['sc', null, '（第二次喚回沒有響起。克勞德這一局只能喊一次，已經用掉了。燈那邊沒有人。）'],
      ['yy:all', 'y_full_merge', '沒有人喊。這一局的喚回已經用完了。'],
      ['yy:huang', 'y_ex_huang', '喊過一次了。這次只能自己走出來。']
    ]
  },
  teaser:[
    ['sc', null, '（深潛 20 通關。）'],
    ['yy:huang', 'y_ex_huang', '這是最底嗎？'],
    ['yy:yan', 'y_ex_yan', '井底還有更深的地方。這二十層不是盡頭。'],
    ['cl', 'firm', '姐姐，更深的地方現在走不到。我也不給它起名。燈我還舉著。'],
    ['yy:xi', 'y_ex_xi', '對。走不到就對了♡ 現在別往下探。'],
    ['yy:all', 'y_full_merge', '更深的地方現在走不到，也不給它起名。'],
    ['gu', null, '我的卷宗還少一頁。余巷的下落還不清楚。現在不要結案。']
  ],
  titleBottom:{
    id:'最底',
    when:'第一次通關 asc_20，真潛提示 teaser 播完之後才給',
    title:'最底',
    body:'深潛二十階走完了。稱號是「最底」。井底還有更深的地方，現在走不到。',
    btn:'收下',
    line:['cl', 'worry', '稱號是「最底」。井底還有更深的地方，現在走不到。']
  },
  backs:[
    {
      id:'cb_asc5',
      when:'第一次通關 asc_5',
      n:'咒入袋',
      d:'卡背多印了一張符紙。那張符不是妳選的，是開局多出來的詛咒。',
      line:['yy:xi', 'y_ex_xi', '開局那張詛咒印到卡背上了♡ 揭下來還在。']
    },
    {
      id:'cb_asc10',
      when:'第一次通關 asc_10',
      n:'詞跟上身',
      d:'卡背多印了一個詞綴，有時是狂，有時是腐。',
      line:['yy:yan', 'y_ex_yan', '詞綴印在牌背上。開戰時會閃一下。']
    },
    {
      id:'cb_asc15',
      when:'第一次通關 asc_15',
      n:'罪醒了',
      d:'卡背畫著一宗罪，邊沒描完。下一章還會再抽一宗。',
      line:['yy:huang', 'y_ex_huang', '卡背上這宗罪的邊還沒描完。下一章還會再抽。']
    },
    {
      id:'cb_asc20',
      when:'第一次通關 asc_20',
      n:'只喚一次',
      d:'卡背是一盞燈，燈芯燒剩一截。這一局喚回只用得了一次。',
      line:['cl', 'firm', '燈還在。這一局我只能喊一次，這截燈芯我留著。']
    }
  ],
  events:[
    {
      id:'d27_lastfall',
      n:'還印著的那一跤',
      need:{
        cleared:1
      },
      txt:'地面上有一個倒下的印，大小是妳的。旁邊寫著妳上一局死掉的地方：{where}。字下面是打倒妳的敵人：{foe}。',
      opts:[
        {
          t:'踩進這個印裡',
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
          t:'撿起寫著敵名的那張紙',
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
      txt:'牆縫裡夾著半頁紙。開頭被撕掉了。剩下的字寫著「還有人沒回來」。沒有地址，沒有署名。不知道寫的是誰。',
      opts:[
        {
          t:'把半頁紙收進袖裡',
          r:[
            {
              cardRare:1
            }
          ],
          d:'得到一張稀有的牌'
        },
        {
          t:'讀完放回牆縫',
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
      txt:'井口到樓梯，妳記得是十三階。今天踩下去，多出一階。多的那一階是乾的，沒有灰塵。',
      opts:[
        {
          t:'踏上多出來的那一階',
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
          t:'跳過這一階，不踩',
          r:[
            {
              heal:6
            }
          ],
          d:'回復 6 生命'
        },
        {
          t:'在多出來的那一階做個記號',
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
      txt:'公會的長桌還在。上首那把椅子是空的。椅面上沒有灰塵，也沒有名字。公會沒有首領。從來沒有人在這把椅子上坐過。',
      opts:[
        {
          t:'不坐，走開',
          r:[
            {
              heal:12
            }
          ],
          d:'回復 12 生命'
        },
        {
          t:'在椅背上留下一根黑銀頭髮',
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
          d:'得到 15 渡鴉幣。值班的人搖頭：公會沒有首領。沒有人接這句。'
        }
      ]
    },
    {
      id:'d27_fifthbowl',
      n:'多出來的碗',
      need:{
        ascMin:7
      },
      txt:'巷裡那張桌子本來是四副碗筷，現在是五副。第五隻碗是溫的，裡面是空的。沒人知道是誰擺上的。',
      opts:[
        {
          t:'把第五副碗筷收走',
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
          t:'把第五隻碗倒扣回去',
          r:[
            {
              heal:10
            }
          ],
          d:'回復 10 生命'
        },
        {
          t:'不動這五副碗，直接離開',
          r:[],
          d:'沒有得失，離開'
        }
      ]
    },
    {
      id:'d27_catturn',
      n:'井口的貓',
      need:{
        ascMin:10
      },
      txt:'巷尾的貓還在。牠本來朝井口跪，現在改朝妳跪。一聲都不叫。',
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
          t:'繞過這隻貓，不看',
          r:[
            {
              heal:8
            }
          ],
          d:'回復 8 生命'
        },
        {
          t:'問牠井下面還有沒有路',
          r:[
            {
              alien:8
            },
            {
              gold:30
            }
          ],
          d:'異化值 +8，得到 30 渡鴉幣。貓不回答。更深的路現在走不到。'
        }
      ]
    },
    {
      id:'d27_returntag',
      n:'退回來的名牌',
      need:{
        cleared:1
      },
      txt:'一枚名牌被退到腳邊。正面刻著妳上一局死掉的地方：{where}。背面只有一個爪印，沒有名字。',
      opts:[
        {
          t:'把名牌掛回領圈旁邊',
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
          t:'把名牌丟回井裡',
          r:[
            {
              gold:40
            }
          ],
          d:'得到 40 渡鴉幣'
        },
        {
          t:'把名牌交給妹妹收著',
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
      txt:'第九層的巢，底板有一格是空的。空格裡沒有東西，只有刮痕，從裡頭往外抓。看不到裡面還有什麼。',
      opts:[
        {
          t:'把手伸進空格裡',
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
          t:'用線把空格縫上',
          r:[
            {
              heal:8
            }
          ],
          d:'回復 8 生命'
        },
        {
          t:'記下刮痕朝外的方向，不伸手',
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
      txt:'燈那邊傳來半個字。喚回那句只喊到「姐——」就斷了。旁邊沒有第二個人，也不是克勞德在喊。',
      opts:[
        {
          t:'自己把後半句說完',
          r:[
            {
              heal:10
            }
          ],
          d:'回復 10 生命'
        },
        {
          t:'站住等，看還會不會再喊',
          r:[
            {
              alien:10
            }
          ],
          d:'異化值 +10。沒有人再喊。'
        },
        {
          t:'把這半個字寫進本子',
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
      txt:'顧沉舟的卷宗又少了一頁。他說不是先前缺的那一頁。空白的地方有水漬，不是墨。缺的那頁現在找不到。',
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
          t:'幫他對著燈光看水漬',
          r:[
            {
              gold:25
            }
          ],
          d:'得到 25 渡鴉幣。水漬下仍看不出字。'
        },
        {
          t:'不問缺的是哪一頁，離開',
          r:[
            {
              heal:6
            }
          ],
          d:'回復 6 生命'
        }
      ],
      talk:[
        ['gu', null, '缺的那頁還找不到。這件案子現在結不了。我不會在這裡結案。']
      ]
    }
  ],
  highTier:[
    {
      id:'mailbox',
      n:'倒懸郵筒怪',
      lines:[
        ['yy:yan', 'y_ex_yan', '倒懸的郵筒還在等信。它把妳當成要投進去的那封信。'],
        ['yy:yan', 'y_ex_yan', '把筒蓋蓋回去。這封退件不算數。']
      ]
    },
    {
      id:'scribe',
      n:'無名抄行者',
      lines:[
        ['yy:huang', 'y_ex_huang', '牠在抄妳剛才那一步。抄完會再走一次。'],
        ['yy:huang', 'y_ex_huang', '牠戶籍上沒有名字。空名字抄不走我。']
      ]
    },
    {
      id:'alchemist',
      n:'煉丹的師父',
      lines:[
        ['yy:yan', 'y_ex_yan', '爐子比他先醒。第二口丹是熱的，不要吃。'],
        ['yy:yan', 'y_ex_yan', '不吃。這爐我掀掉。']
      ]
    },
    {
      id:'jiangshi_boy',
      n:'走屍道童',
      lines:[
        ['yy:xi', 'y_ex_xi', '牠額頭的符紙又換新的了。舊符還在袖裡。'],
        ['yy:yan', 'y_ex_yan', '符貼不到我臉上。這張符對我無效。']
      ]
    },
    {
      id:'wgod',
      n:'游神',
      lines:[
        ['yy:huang', 'y_ex_huang', '神不在座位上。空座位自己在移動。'],
        ['yy:huang', 'y_ex_huang', '座位遊到我面前，就停在這裡。我在這裡打。']
      ]
    },
    {
      id:'chorus',
      n:'舊戶籍合唱體',
      lines:[
        ['yy:yan', 'y_ex_yan', '戶口簿上的名字一起出聲。少一個名字，牠們會補上一個。'],
        ['yy:yan', 'y_ex_yan', '合唱到第三句，我就把譜拆掉。']
      ]
    },
    {
      id:'welleye',
      n:'井底的眼',
      lines:[
        ['yy:huang', 'y_ex_huang', '牠把上次看妳的那三秒，又重放了一遍。'],
        ['yy:huang', 'y_ex_huang', '閉眼也沒用，牠還在看。我讓線下去打它。']
      ]
    },
    {
      id:'skel',
      n:'鎖鏈骷髏守衛',
      lines:[
        ['yy:yan', 'y_ex_yan', '鎖鏈比骨頭先打過來。鏈子記得上次的長度，會先勒到那個位置。'],
        ['yy:yan', 'y_ex_yan', '把鏈子收短。骨頭留給我拆。']
      ]
    },
    {
      id:'giant',
      n:'燭苔巨人',
      lines:[
        ['yy:xi', 'y_ex_xi', '苔還在長。燭芯比上一回長出一截。'],
        ['yy:xi', 'y_ex_xi', '苔我刮掉。火我來滅。']
      ]
    },
    {
      id:'ironlung',
      n:'鐵肺修女',
      lines:[
        ['yy:huang', 'y_ex_huang', '喇叭裡的禱告唱到第二段，調子變了。不要接唱。'],
        ['yy:yan', 'y_ex_yan', '第一段不要應。第二段也不要應。']
      ]
    },
    {
      id:'e04_jelly',
      n:'灰宴水母',
      lines:[
        ['yy:huang', 'y_ex_huang', '假笑更厚了。觸鬚上還掛著上一場的餘溫。'],
        ['yy:huang', 'y_ex_huang', '這場宴我不入席。在外面打。']
      ]
    },
    {
      id:'timekeeper',
      n:'計時官',
      lines:[
        ['yy:huang', 'y_ex_huang', '牠把上一局的秒針又往回撥了一格。想重打那一秒。'],
        ['yy:huang', 'y_ex_huang', '時間不借給牠。針我掰直。']
      ]
    },
    {
      id:'blindoff',
      n:'蒙眼的典獄',
      lines:[
        ['yy:xi', 'y_ex_xi', '蒙眼布是新的。布後面那隻眼是舊的，還在看。'],
        ['yy:xi', 'y_ex_xi', '牠蒙著眼。我偏要讓牠看清楚我是誰。']
      ]
    },
    {
      id:'badger',
      n:'鐘獾',
      lines:[
        ['yy:xi', 'y_ex_xi', '鐘聲慢了半拍，爪子卻打在準的位置。'],
        ['yy:xi', 'y_ex_xi', '鐘聲慢的那半拍，我先下口♡']
      ]
    },
    {
      id:'clocktower',
      n:'走慢的鐘塔',
      lines:[
        ['yy:yan', 'y_ex_yan', '鐘塔還在走。它走的是上一場沒走完的那一格時間。'],
        ['yy:yan', 'y_ex_yan', '把針停住。裡面的人會自己出來。']
      ]
    },
    {
      id:'ch4guard',
      n:'剪票員',
      lines:[
        ['yy:xi', 'y_ex_xi', '票根剪到一半，牠改剪袖口。'],
        ['yy:yan', 'y_ex_yan', '票是假的也要過。我過了。']
      ]
    },
    {
      id:'giant_x',
      n:'候車的巨人',
      lines:[
        ['yy:huang', 'y_ex_huang', '空位旁邊，牠又站直了一點。車還沒來。'],
        ['yy:huang', 'y_ex_huang', '末班車沒來。牠先倒下。']
      ]
    },
    {
      id:'e13_garden',
      n:'無聲菌庭',
      lines:[
        ['yy:huang', 'y_ex_huang', '四周聽不見聲音。菌已經長到靴面。'],
        ['yy:huang', 'y_ex_huang', '聽不見也照樣清掉。菌我收乾淨。']
      ]
    },
    {
      id:'n3_lamia',
      n:'白鱗的蛇蛛',
      lines:[
        ['yy:yan', 'y_ex_yan', '鱗是白的，網是熱的。牠按妳現在這張臉在織網。'],
        ['yy:huang', 'y_ex_huang', '網裡那張臉是我的。不給牠用。']
      ]
    },
    {
      id:'n3_lich',
      n:'結網的頭骨',
      lines:[
        ['yy:yan', 'y_ex_yan', '頭骨上的字多了一筆，寫的是妳的名字。'],
        ['yy:yan', 'y_ex_yan', '把字擦掉。骨頭留下。']
      ]
    },
    {
      id:'n3_deep',
      n:'沉在底下的影子',
      lines:[
        ['yy:huang', 'y_ex_huang', '影子比人先站起來。'],
        ['yy:huang', 'y_ex_huang', '先站起來的是影子。我把它按回地面以下。']
      ]
    },
    {
      id:'n3_kraken',
      n:'白色的眼群',
      lines:[
        ['yy:huang', 'y_ex_huang', '眼睛又多數出一隻。數不清的那一隻在看燈，想要這盞燈。'],
        ['yy:huang', 'y_ex_huang', '燈不給。眼睛我一隻一隻關上。']
      ]
    },
    {
      id:'n3_brood',
      n:'千子的窩',
      lines:[
        ['yy:yan', 'y_ex_yan', '窩裡的聲音比上一回更密。孩子又多了。'],
        ['yy:yan', 'y_ex_yan', '孩子再多，也過不了我這道線。']
      ]
    },
    {
      id:'n3_lamp',
      n:'襤褸的黃燈',
      lines:[
        ['yy:xi', 'y_ex_xi', '黃燈認錯人了。它喊的是另一張臉，不是現在站在這裡的這張。'],
        ['yy:huang', 'y_ex_huang', '燈我拿走。它叫錯的那個名字，我不還給它。']
      ]
    },
    {
      id:'wusign',
      n:'退件執事・無簽',
      lines:[
        ['yy:yan', 'y_ex_yan', '第二次簽名，牠寫的是妳的姓。'],
        ['yy:yan', 'y_ex_yan', '姓不借給牠。用我自己的命線打。']
      ]
    },
    {
      id:'qianhao',
      n:'總分揀機・千號',
      lines:[
        ['yy:xi', 'y_ex_xi', '千號排到一千零一。多出來的那一號是空號。'],
        ['yy:xi', 'y_ex_xi', '空號我來填。我填「停」。']
      ]
    },
    {
      id:'deepdrill',
      n:'掘進機・深挖',
      lines:[
        ['yy:huang', 'y_ex_huang', '它說下面還有更深的地方。現在走不到。我不跟著它往下挖。'],
        ['yy:huang', 'y_ex_huang', '挖到這裡為止。再往下不是給它挖的，也走不到。']
      ]
    },
    {
      id:'namegate',
      n:'千名之門',
      lines:[
        ['yy:yan', 'y_ex_yan', '門縫裡又多一個凹槽，長度正好是妳的身高。'],
        ['yy:yan', 'y_ex_yan', '凹槽空著。我不躺進去。']
      ]
    },
    {
      id:'lastpost',
      n:'最後一個郵差',
      lines:[
        ['yy:huang', 'y_ex_huang', '信袋裡有一封退件。收件人那一欄被寫過兩次，還是查無此人。'],
        ['yy:huang', 'y_ex_huang', '這封信我不簽收。你退回去。']
      ]
    },
    {
      id:'stationmaster',
      n:'站長・時刻表',
      lines:[
        ['yy:yan', 'y_ex_yan', '時刻表背面那班車，終點欄是空的。終點未知。'],
        ['yy:yan', 'y_ex_yan', '終點是空的。那班車我們不搭。']
      ]
    },
    {
      id:'nh_fox',
      n:'沒有回家的九尾',
      lines:[
        ['yy:yan', 'y_ex_yan', '九條尾巴尖是紅的。紅的位置和我身上那塊紅標記同一處。'],
        ['yy:xi', 'y_ex_xi', '那副耳墜是我的，還我。回家的路不給妳。']
      ]
    },
    {
      id:'nh_sea',
      n:'冷光之母',
      lines:[
        ['yy:huang', 'y_ex_huang', '牠要妳把燈留下。家裡更吵，我選吵的，燈帶走。'],
        ['yy:huang', 'y_ex_huang', '燈全部帶走。一盞都不留給牠。']
      ]
    },
    {
      id:'nh_her',
      n:'睡著的那一個',
      lines:[
        ['yy:yan', 'y_ex_yan', '她手裡還握著那張紙。紙上的字我看過。她的下落仍然不清楚。'],
        ['yy:huang', 'y_ex_huang', '就算她睜開眼，回家的也是我。她的下落這局不會揭開。']
      ]
    }
  ],
  traits:[
    {
      id:'excess',
      n:'過剩',
      blurb:'敵人多長出一截身體。多出來的那一截也是牠，砍不掉。',
      lines:[
        ['foe', null, '還有。還有。'],
        ['yy:yan', 'y_ex_yan', '多出來的那一層也是牠。砍不掉，我一併記上。'],
        ['yy:xi', 'y_ex_xi', '皮真厚♡ 那就多砍幾刀。']
      ]
    },
    {
      id:'scheme',
      n:'算計',
      blurb:'每三回合從妳手裡換走一張牌，改成詛咒，只活在這一場。',
      lines:[
        ['foe', null, '這張牌換走。改成我的詛咒。'],
        ['yy:huang', 'y_ex_huang', '每三回合換走一張牌。我先數。'],
        ['yy:yan', 'y_ex_yan', '這張詛咒只活在這一場。場結束就消失，帳我還記著。']
      ]
    },
    {
      id:'rot',
      n:'腐',
      blurb:'打中以後，下回合少 1 點能量。每一回合最多一次。',
      lines:[
        ['foe', null, '氣漏了。下一回合妳少 1 點能量。'],
        ['yy:xi', 'y_ex_xi', '下一回合少 1 點能量。那就在這一回合打完♡'],
        ['cl', 'worry', '姐姐，手沉了一下。能量要少了。先擋。']
      ]
    },
    {
      id:'rage',
      n:'狂',
      blurb:'生命低於一半時，攻擊更重。',
      lines:[
        ['foe', null, '生命掉到一半以下了。攻擊打開。'],
        ['yy:huang', 'y_ex_huang', '牠生命少了，攻擊反而更準。盡快收掉。'],
        ['yy:xi', 'y_ex_xi', '好♡ 我也是血越少越想砸。']
      ]
    }
  ],
  sins:[
    {
      id:'pride',
      n:'傲慢（傲）',
      wake:[
        ['yy:huang', 'y_ex_huang', '這一章，傲醒了。敵人都不低頭。']
      ],
      battle:[
        ['yy:huang', 'y_ex_huang', '牠們不低頭。那就讓刀自己過去。'],
        ['foe', null, '跪是你們的事。我不跪。']
      ]
    },
    {
      id:'greed',
      n:'貪婪（貪）',
      wake:[
        ['yy:yan', 'y_ex_yan', '這一章，貪醒了。敵人什麼都要多拿一份。']
      ],
      battle:[
        ['yy:yan', 'y_ex_yan', '想拿的東西，先過我的帳。'],
        ['foe', null, '那一件也是我的。']
      ]
    },
    {
      id:'glutton',
      n:'暴食（饞）',
      wake:[
        ['yy:xi', 'y_ex_xi', '這一章，饞醒了。敵人吃完一口，還會要下一口♡']
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
        ['yy:yan', 'y_ex_yan', '這一章，嫉醒了。敵人盯的是妳手上那盞燈。']
      ],
      battle:[
        ['yy:yan', 'y_ex_yan', '燈不借。看夠了就還手。'],
        ['cl', 'firm', '這盞燈是我的。不給。']
      ]
    },
    {
      id:'wrath',
      n:'暴怒（怒）',
      wake:[
        ['yy:xi', 'y_ex_xi', '這一章，怒醒了。敵人的怒氣關不掉♡']
      ],
      battle:[
        ['yy:xi', 'y_ex_xi', '發怒的跟我撞，正好。'],
        ['foe', null, '誰先動手，誰就要打完。']
      ]
    },
    {
      id:'sloth',
      n:'怠惰（怠）',
      wake:[
        ['yy:huang', 'y_ex_huang', '這一章，怠醒了。敵人動作會慢半拍，打中卻更重。']
      ],
      battle:[
        ['yy:huang', 'y_ex_huang', '敵人動作慢半拍，打中卻更重。不要跟著它把節奏放慢。'],
        ['foe', null, '再等一下。再等一下。']
      ]
    },
    {
      id:'thirst',
      n:'色慾（渴）',
      note:'只寫渴：要燈、要名字、要餘溫。不寫性。',
      wake:[
        ['yy:yan', 'y_ex_yan', '這一章，渴醒了。敵人看燈的時間比看路長。要的是光、名字和餘溫。']
      ],
      battle:[
        ['yy:yan', 'y_ex_yan', '別把燈舉太近。渴的敵人會跟著燈走，要的是光、名字和餘溫。'],
        ['cl', 'worry', '姐姐，牠在看燈芯。我們換一隻手舉，離遠一點。']
      ]
    }
  ],
  bossPhase2:[
    {
      id:'wusign',
      n:'退件執事・無簽',
      line:['yy:yan', 'y_ex_yan', '第一階段的退件不算數。牠開始簽第二次名。']
    },
    {
      id:'qianhao',
      n:'總分揀機・千號',
      line:['yy:xi', 'y_ex_xi', '編號從頭排過。第一號對準我♡']
    },
    {
      id:'deepdrill',
      n:'掘進機・深挖',
      line:['yy:huang', 'y_ex_huang', '鑽頭換成更快的一檔。它不會停，會一直挖。']
    },
    {
      id:'namegate',
      n:'千名之門',
      line:['yy:yan', 'y_ex_yan', '門又開了一道。它要的名字還不夠，還會繼續要。']
    },
    {
      id:'lastpost',
      n:'最後一個郵差',
      line:['yy:huang', 'y_ex_huang', '第一封寫著查無此人。牠把同一封信再送一次。']
    },
    {
      id:'stationmaster',
      n:'站長・時刻表',
      line:['yy:yan', 'y_ex_yan', '時刻表翻到背面。末班車還沒開。終點欄仍是空的。']
    },
    {
      id:'nh_fox',
      n:'沒有回家的九尾',
      line:['yy:xi', 'y_ex_xi', '九尾進入第二階段。九條尾巴全部張開了。']
    },
    {
      id:'nh_sea',
      n:'冷光之母',
      line:['yy:huang', 'y_ex_huang', '海發出的冷光變強了。所有的燈都轉向我。']
    },
    {
      id:'nh_her',
      n:'睡著的那一個',
      line:['yy:yan', 'y_ex_yan', '睡著的那一個睜開了眼睛。戰鬥進入第二階段。她的下落仍然不會在這一局揭開。']
    }
  ],
  rings:[
    {
      id:'pride',
      finger:'左拇指',
      n:'星核黑洞戒',
      img:'ring_pride',
      d:'戒面是一粒黑的星核，光只進得出不來。',
      lit:['yy:huang', 'y_ex_huang', '左拇指亮了。光進了這枚核，就出不來。']
    },
    {
      id:'envy',
      finger:'左食指',
      n:'轉動的眼珠戒',
      img:'ring_envy',
      d:'戒面是一顆會自己轉的眼珠，總望向別人手上的東西。',
      lit:['yy:yan', 'y_ex_yan', '左食指亮了。戒面上這隻眼先看別人手上的東西，再看我。']
    },
    {
      id:'obsess',
      finger:'左中指',
      n:'觸手神經戒',
      img:'ring_obsess',
      d:'戒圈是幾條細觸手，裡面走著神經，會自己收緊。',
      lit:['yy:yan', 'y_ex_yan', '左中指亮了。觸手繞了一圈，裡面的神經還在跳。']
    },
    {
      id:'devotion',
      finger:'左無名指',
      n:'渡鴉之鎖',
      img:'ring_devotion',
      d:'黑金婚戒，戒內嵌一滴淚狀的星。這是語凰嫣和渡鴉的誓，戴在左無名指。',
      lit:['yy:yan', 'y_ex_yan', '左無名指亮了。渡鴉之鎖是和渡鴉的誓，現在認渡鴉。']
    },
    {
      id:'cruelty',
      finger:'左小指',
      n:'人臉血肉戒',
      img:'ring_cruelty',
      d:'戒面是一張縮小的人臉，血色的紋會自己換表情。',
      lit:['yy:xi', 'y_ex_xi', '左小指亮了。戒面上這張小臉會自己換表情，換到最後一下♡']
    },
    {
      id:'greed',
      finger:'右拇指',
      n:'黃金咬指口',
      img:'ring_greed',
      d:'黃金鑄成的小口，齒合在指根上，合上就不鬆。',
      lit:['yy:yan', 'y_ex_yan', '右拇指亮了。這張金口咬在指根上，合上就不鬆。']
    },
    {
      id:'wrath',
      finger:'右食指',
      n:'荊棘詛咒戒',
      img:'ring_wrath',
      d:'一圈乾荊棘箍在指上，刺多半朝外，偶爾朝內扎進肉裡。',
      lit:['yy:xi', 'y_ex_xi', '右食指亮了。荊棘扎進肉裡，正好♡']
    },
    {
      id:'sweetmalice',
      finger:'右中指',
      n:'藏針珍珠戒',
      img:'ring_sweetmalice',
      d:'白玉戒面嵌一粒珍珠，珠下面藏著細針，戒沒亮的時候看不見針。',
      lit:['yy:yan', 'y_ex_yan', '右中指亮了。珠是白的，細針藏在珠下面。']
    },
    {
      id:'vanity',
      finger:'右無名指',
      n:'碎鑽磷光戒',
      img:'ring_vanity',
      d:'碎鑽嵌成一圈，鑽石自己會泛一層冷的磷光。',
      lit:['yy:huang', 'y_ex_huang', '右無名指亮了。碎鑽自己在泛冷的磷光。']
    },
    {
      id:'glutton',
      finger:'右小指',
      n:'血果凍戒',
      img:'ring_glutton',
      d:'戒面是一坨暗紅、帶蜜色的果凍，表面破了以後會慢慢重新合攏。',
      lit:['yy:xi', 'y_ex_xi', '右小指亮了。這坨果凍還沒冷，破了還會自己合上♡']
    }
  ],
  unlockHalfPalm:{
    id:'半掌',
    when:'同一局裡同時亮起 5 枚戒',
    title:'半掌',
    sfx:'sfx_ring',
    body:'同一局裡有五枚戒一起亮了。另外五指還沒亮。沒亮的五枚，這一局再簽，或等下一局再簽。',
    btn:'收下',
    line:['yy:yan', 'y_ex_yan', '半掌。五枚戒亮了，另外五指還沒亮。沒亮的五枚，這一局再簽或者下一局再簽。']
  },
  unlockTenColor:{
    id:'十指十色',
    when:'跨局累計十枚都亮過',
    also:'cb_rings',
    sfx:'sfx_ring_ten',
    title:'十指十色',
    body:'十枚戒都亮過了。卡背換成十枚戒的圖。渡鴉之鎖仍在左無名指，是最左邊那一枚。',
    btn:'收下',
    line:['yy:all', 'y_full_merge', '十指十色。十枚戒都亮過了。這一雙手齊了。']
  },
  ideas:['敵人認前臉：嫣在前時，厄契會被彈回來；熙在前時，自己流的血會養牠；凰在前時，回復會被牠先喝一口。讓玩家在換臉前先看清場上站的是誰。', '有一個首領會把這一局僅有的那一次喚回吞掉。吞掉以後，合相結束沒有人喊，只能自己走出來。深潛 20 已經限制次數，這個是把那一次也搶走。', '裡側搶牌在高階會搶走「就是不能在這一張臉上打出」的那一張，讓同體宿敵真的在拆台，不是只換色。', '撿到的半頁紙可以變成一張詛咒，或變成下一局開場的一條線索。線索可以指向下落還不清楚的人，或還沒走完的地方。不要寫成已經到了井的盡頭。余巷的下落仍是未知。', '帶著某一宗罪的敵人，會拒收對應的慾望契效果，要靠另外兩張臉過關。', '巷裡變動過的東西（少一階、第五隻碗、轉向的貓）如果玩家在事件裡做了記號，下一局還在，讓人願意再下去核對。']
};

if (typeof module !== 'undefined') module.exports = TEXT_V027;
