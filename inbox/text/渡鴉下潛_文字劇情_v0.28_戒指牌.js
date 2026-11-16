// 《渡鴉下潛》文字劇情 v0.28　十枚戒指牌・十戒全開
// 對齊規則 v0.9 第十段、第十一段（79cf76d、70321c9）。
// 說話人：yy:yan／yy:xi／yy:huang／yy:all、cl。
// 立繪：y_ex_yan、y_ex_xi、y_ex_huang、y_full_merge。卡圖：ring_<id>。
// 喚回主句不動。說明見同目錄「文字_v0.28_戒指牌.md」。
// 升級標 u.d 的整數是「約 +40%」四捨五入的建議值；u.pending 為待規則大師確認的項目。
// 沒有可乘數字的升級用 {X}。

const TEXT_V028 = {
  ver:'v0.28',
  title:'戒指牌・十戒全開',
  rules:'v0.9',
  speaker:{
    'yy:huang':'凰',
    'yy:yan':'嫣',
    'yy:xi':'熙',
    'yy:all':'合相／十戒全開',
    cl:'克勞德'
  },
  newCards:{
    yy_r_devotion:{
      n:'渡鴉之鎖',
      c:1,
      t:'技',
      r:'ring',
      img:'ring_devotion',
      pact:'devotion',
      finger:'左無名指',
      d:'格擋 10，這次的格擋留到下一回合不消失。牌組裡有這張時，喚回多回 10 生命。',
      u:{
        d:'格擋 14，這次的格擋留到下一回合不消失。牌組裡有這張時，喚回多回 14 生命。',
        pending:'格擋與喚回回復按約 40% 改為 14。留下格擋這條不改。待確認。'
      },
      line:['yy:yan', 'y_ex_yan', '鎖扣上了。渡鴉不在，我自己守。']
    },
    yy_r_pride:{
      n:'星核黑洞戒',
      c:1,
      t:'攻',
      r:'ring',
      img:'ring_pride',
      pact:'pride',
      finger:'左拇指',
      d:'對菁英、首領造成 14 傷害；對一般敵人造成 7 傷害。',
      u:{
        d:'對菁英、首領造成 20 傷害；對一般敵人造成 10 傷害。',
        pending:'14×1.4≈20，7×1.4≈10。待確認。'
      },
      line:['yy:huang', 'y_ex_huang', '小的不值得我認真。大的過來。']
    },
    yy_r_envy:{
      n:'轉動的眼珠戒',
      c:0,
      t:'技',
      r:'ring',
      img:'ring_envy',
      pact:'envy',
      finger:'左食指',
      d:'把一個敵人身上的一種增益搬到自己身上。消耗。',
      u:{
        d:'{X}',
        pending:'費用已是 0，沒有可乘的數字。請定：搬兩種增益、不再消耗，或另寫一條。'
      },
      line:['yy:yan', 'y_ex_yan', '妳身上那個好東西，給我。']
    },
    yy_r_obsess:{
      n:'觸手神經戒',
      c:1,
      t:'技',
      r:'ring',
      img:'ring_obsess',
      pact:'obsess',
      finger:'左中指',
      d:'標記一個敵人「執」：這場戰鬥中對它的傷害 +3。同時只能有一個「執」。',
      u:{
        d:'標記一個敵人「執」：這場戰鬥中對它的傷害 +4。同時只能有一個「執」。',
        pending:'+3×1.4≈4。待確認。'
      },
      line:['yy:yan', 'y_ex_yan', '就妳了。這場我只看妳。']
    },
    yy_r_cruelty:{
      n:'人臉血肉戒',
      c:1,
      t:'攻',
      r:'ring',
      img:'ring_cruelty',
      pact:'cruelty',
      finger:'左小指',
      d:'造成 6 傷害。目標每有一種負面狀態，再加 3 傷害。',
      u:{
        d:'造成 8 傷害。目標每有一種負面狀態，再加 4 傷害。',
        pending:'6×1.4≈8，3×1.4≈4。待確認。'
      },
      line:['yy:xi', 'y_ex_xi', '妳身上的傷越多，我越好下手♡']
    },
    yy_r_greed:{
      n:'黃金咬指口',
      c:0,
      t:'攻',
      r:'ring',
      img:'ring_greed',
      pact:'greed',
      finger:'右拇指',
      d:'失去 2 生命，造成 5 傷害。打倒目標得 15 渡鴉幣。',
      u:{
        d:'失去 2 生命，造成 7 傷害。打倒目標得 21 渡鴉幣。',
        pending:'5×1.4=7，15×1.4=21。失去 2 生命建議不加倍。待確認。'
      },
      line:['yy:yan', 'y_ex_yan', '咬指口先咬我一口。妳倒下，錢歸我。']
    },
    yy_r_wrath:{
      n:'荊棘詛咒戒',
      c:1,
      t:'攻',
      r:'ring',
      img:'ring_wrath',
      pact:'wrath',
      finger:'右食指',
      d:'造成 8 傷害。這回合自己每失去過一次生命，再加 4 傷害。',
      u:{
        d:'造成 11 傷害。這回合自己每失去過一次生命，再加 6 傷害。',
        pending:'8×1.4≈11，4×1.4≈6。待確認。'
      },
      line:['yy:xi', 'y_ex_xi', '我流的血都記著。現在還給妳♡']
    },
    yy_r_sweetmalice:{
      n:'藏針珍珠戒',
      c:1,
      t:'技',
      r:'ring',
      img:'ring_sweetmalice',
      pact:'sweetmalice',
      finger:'右中指',
      d:'一個敵人的下一次攻擊，有一半傷害打回它自己。',
      u:{
        d:'一個敵人的下一次攻擊，有 {X} 傷害打回它自己。',
        pending:'一半沒有整數可乘。40% 加成會變成七成，請定一個寫法。'
      },
      line:['yy:yan', 'y_ex_yan', '打我啊。打多重，一半回到妳身上。']
    },
    yy_r_vanity:{
      n:'碎鑽磷光戒',
      c:2,
      t:'能力',
      r:'ring',
      img:'ring_vanity',
      pact:'vanity',
      finger:'右無名指',
      d:'每回合第一張打出的牌再打一次，數值減半。',
      u:{
        c:1,
        d:'每回合第一張打出的牌再打一次，數值減半。',
        pending:'規則已寫死：升級後費用改成 1，效果不變。'
      },
      line:['yy:huang', 'y_ex_huang', '第一下要漂亮。再來一次。']
    },
    yy_r_glutton:{
      n:'血果凍戒',
      c:1,
      t:'攻',
      r:'ring',
      img:'ring_glutton',
      pact:'glutton',
      finger:'右小指',
      d:'造成 7 傷害，回復造成傷害的一半。消耗。',
      u:{
        d:'造成 10 傷害，回復造成傷害的一半。消耗。',
        pending:'7×1.4≈10。回復仍按一半算。消耗是否拿掉，待確認。'
      },
      line:['yy:xi', 'y_ex_xi', '咬一口，補一口♡']
    }
  },
  faceNote:'戒指牌不另開 fc。套規則第三段的前臉修正和三相。嫣：厄契與格擋 +2。熙：傷害 +3，攻擊時失去 1 生命。凰：費用 2 以上的第一張費用 -1，攻擊附虛弱 1，格擋牌回 1 生命，回復 +2。合相與十戒全開期間三面同時生效，費用 0。',
  ringLight:{
    start:{
      body:'這一局簽了這個慾望契。{finger}的{n}開局就亮。牌組多一張它的專屬牌。',
      line:['yy:yan', 'y_ex_yan', '這一局簽了這個慾望契。{finger}的{n}開局就亮。']
    },
    lit:{
      devotion:{
        when:'被克勞德喚回一次',
        line:['yy:yan', 'y_ex_yan', '左無名指的渡鴉之鎖亮了。']
      },
      pride:{
        when:'打倒一個菁英，那場戰鬥失去的生命不超過 10',
        line:['yy:huang', 'y_ex_huang', '左拇指的星核黑洞戒亮了。']
      },
      envy:{
        when:'同時持有 4 個遺物',
        line:['yy:yan', 'y_ex_yan', '左食指的轉動的眼珠戒亮了。']
      },
      obsess:{
        when:'同一場戰鬥裡，同一張牌打出 3 次',
        line:['yy:yan', 'y_ex_yan', '左中指的觸手神經戒亮了。']
      },
      cruelty:{
        when:'一個敵人身上同時有 3 種負面狀態',
        line:['yy:xi', 'y_ex_xi', '左小指的人臉血肉戒亮了♡']
      },
      greed:{
        when:'同時持有 200 渡鴉幣',
        line:['yy:yan', 'y_ex_yan', '右拇指的黃金咬指口亮了。']
      },
      wrath:{
        when:'一場戰鬥失去 25 生命以上，仍然打贏',
        line:['yy:xi', 'y_ex_xi', '右食指的荊棘詛咒戒亮了♡']
      },
      sweetmalice:{
        when:'一個敵人被反傷或其他敵人的攻擊打倒',
        line:['yy:yan', 'y_ex_yan', '右中指的藏針珍珠戒亮了。']
      },
      vanity:{
        when:'以滿血結束一場戰鬥',
        line:['yy:huang', 'y_ex_huang', '右無名指的碎鑽磷光戒亮了。']
      },
      glutton:{
        when:'牌組達到 30 張',
        line:['yy:xi', 'y_ex_xi', '右小指的血果凍戒亮了♡']
      }
    },
    sfx:'sfx_ring',
    oncePerRun:true
  },
  unlockHalfPalm:{
    id:'半掌',
    when:'同一局亮 5 枚',
    title:'半掌',
    sfx:'sfx_ring',
    body:'同一局裡有五枚戒一起亮了。全部戒指牌在這一刻升級。另外五指還沒亮。沒亮的五枚，要靠這一局的點亮條件，不能再簽第二個慾望契。',
    btn:'收下',
    line:['yy:yan', 'y_ex_yan', '五枚亮了。戒指牌都變強了。']
  },
  unlockTenColor:{
    id:'十指十色',
    when:'同一局十枚全亮',
    also:'cb_rings',
    sfx:'sfx_ring_ten',
    title:'十指十色',
    body:'這一局十枚戒全亮了。稱號是十指十色。卡背換成十枚戒的圖。之後下一次異化值到 100，合相改成十戒全開，持續 3 回合。',
    btn:'收下',
    line:['yy:all', 'y_full_merge', '十枚都亮了。下一次合相，十戒全開。']
  },
  tenOpen:{
    id:'十戒全開',
    need:'同一局十枚全亮，之後下一次異化值到 100',
    turns:3,
    oncePerRun:true,
    sfx:'sfx_merge',
    hand:'牌組裡的十張戒指牌全部放進手牌。這 3 回合手牌上限不算，費用 0。三張臉的修正同時生效。',
    resolve:['devotion', 'pride', 'envy', 'obsess', 'cruelty', 'greed', 'wrath', 'sweetmalice', 'vanity', 'glutton'],
    resolveNote:'從左手無名指的渡鴉之鎖開始，再左手拇指、食指、中指、小指，再右手拇指、食指、中指、無名指、小指。每枚戒指的被動或連動每回合最多觸發一次。vanity 再打一次的那張牌不會再觸發 vanity。glutton 的效果不會被 obsess 再加強。',
    open:[
      ['yy:yan', 'y_ex_yan', '左無名指的渡鴉之鎖先亮。'],
      ['yy:huang', 'y_ex_huang', '左手拇指、食指、中指、小指接著亮。'],
      ['yy:xi', 'y_ex_xi', '右手五指也亮了。十張戒指牌全部進入手牌，這 3 回合費用是 0，手牌上限不算。'],
      ['yy:all', 'y_full_merge', '全部都是我的。']
    ],
    turn:[
      ['yy:all', 'y_full_merge', '十戒全開，第 1 回合。打出戒指牌，之後打出的戒指牌傷害和格擋各加 2，最多加到 18。'],
      ['yy:all', 'y_full_merge', '十戒全開，第 2 回合。連動還在。傷害和格擋繼續往上加，最多加到 18。'],
      ['yy:all', 'y_full_merge', '十戒全開，最後一回合。這回合結束後，喚回照常發動。']
    ],
    stack:{
      id:'tenlink',
      n:'十戒連動',
      d:'這 3 回合裡，每打出一張戒指牌，之後打出的戒指牌傷害和格擋各 +2。可疊加，最多 +18。第一張不加。打到第十張時，那一張是 +18。沒有傷害、也沒有格擋的戒指牌打出時，層數照樣加 1。',
      hideAtZero:true,
      ui:'連動 +{v}',
      hint:'已疊 {n} 層，傷害和格擋各 +{v}，最多 +18。',
      step:2,
      max:18
    },
    end:{
      recall:['cl', 'firm', '姐姐，看我。是我。'],
      sfx:'sfx_recall',
      sfxDur:0.9,
      note:'主句不動。異化值歸 0，凰面不退出。深潛 20 若這一局已經喚過一次，改播 recall20.denied，不要改寫主句。'
    }
  }
};

if (typeof module !== 'undefined') module.exports = TEXT_V028;
