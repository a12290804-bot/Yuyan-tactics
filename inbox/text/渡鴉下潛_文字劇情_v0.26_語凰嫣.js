// 《渡鴉下潛》文字劇情 v0.26　語凰嫣
// 語嫣與語熙不再分角，合成可玩主角「語凰嫣」。內部 id 仍是 yy／y_。
// 說話人：yy:huang／yy:yan／yy:xi／yy:all（合相，不要用舊的 yy:merge）；一句裡換臉用 yy:huang>xi。
// 立繪：y_base（舊語嫣為 y_base_v10）、y_ex_yan、y_ex_xi、y_ex_huang、合相 y_full_merge、醒來 y_reveal_huang。
// 醒來音效 sfx_reveal_huang。喚回主句不動，sfx_recall 0.9 秒。
// 說明、對照表、給克勞德的備註，見同目錄「文字_v0.26_語凰嫣.md」。
// 舊稿 v0.4.1、v0.25 不刪，用 md 第七節改說話人。

const TEXT_V026 = {
  ver:'v0.26',
  title:'語凰嫣',
  speaker:{
    'yy:huang':'凰',
    'yy:yan':'嫣（預設前臉）',
    'yy:xi':'熙',
    'yy:all':'合相',
    mid:'yy:huang>xi（兩側可換 huang／yan／xi）',
    note:'正文寫 yy:huang：……；js 為 [\'yy:huang\',\'y_ex_huang\',\'……\']。合相不要用舊的 yy:merge。'
  },
  art:{
    y_base:'預設立繪，嫣在前。舊語嫣立繪改叫 y_base_v10。面具版已移到 inbox/art/_old/，不用。這兩張不要對成同一張。',
    y_ex_yan:'嫣在前。懶、得意，帶一點寵。',
    y_ex_xi:'熙在前。譏誚，虎牙露出來。',
    y_ex_huang:'凰在前。無辜的臉，算計在眼底。白金的光比較明顯。',
    y_full_merge:'合相。三張臉同時在頭髮與倒影裡看清楚。',
    y_reveal_huang:'凰面醒來，閃 0.8 秒。碎骨冠縫線裡有東西睜開。',
    look:['極樂黑銀長髮垂到腳踝，髮絲是活的神經，自己會動。', '眼裡有金在流動。', '初戀臉，眼角一滴淚，淚後面是很深的惡意。', '皮膚是骨髓的瓷色，臉上凝著暗紅的血晶。', '碎裂的顱骨片縫成冠，縫線是神經。', '聽小骨做的耳墜；指骨成對的戒指；領圈跟著心跳脹縮。', '常服：血紅長裙，靜脈和肌腱編在一起，自己會跳。', '朝堂：白袍，聖金的光。id 已定 y_skin_court。', '補償時裝 y_skin_xi_gift：開背的活革。', '以上衣服都可加一件半透明、帶細血管的膜披肩（可選）。', '另外兩張臉只出現在頭髮裡，或出現在倒影裡。不要畫面飾面具，不要額前金眼冠。']
  },
  sfx:{
    wakeHuang:'sfx_reveal_huang',
    recall:'sfx_recall'
  },
  rules:{
    yan:'黑底紅線。厄契、格擋。把人裹起來，算計藏在軟的語氣裡。',
    xi:'紅流蘇。傷害高，打出去自己也會疼。',
    huang:'白金。削費用、回生命。無辜的臉底下全是算計。純血能把她從死亡裡拉回來。',
    rotate:'戰鬥開始嫣在前。回合開始 嫣→熙→凰→嫣。凰還沒醒時，只在嫣和熙之間輪。',
    wake:'每一局第一次異化值到 60，凰面醒來，加入輪替，這一局結束前不退出。畫面閃 y_reveal_huang 0.8 秒，配 sfx_reveal_huang。取代舊的語熙醒來。',
    steal:'半妖起，每回合開始裡側搶走一張手牌，這一回合改用她的版本打出。合相不搶。',
    merge:'異化值 100，合相維持 2 回合（混合型態仍 3 回合），三面修正同時生效，牌費 0。結束後克勞德喚回，異化值歸 0，凰面不退出。舊的語熙掌身、沒有喚回，不再用。',
    wrath:'暴怒慾望只在熙面前臉時發動。',
    name:'顯示名語凰嫣。她是渡鴉的伴侶，只叫他渡鴉。語凰是女兒的那條線，遊戲裡不寫。克勞德是渡鴉唯一的女兒，是語凰嫣的妹妹。'
  },
  opening:[
    ['sc', null, '（井沿。燈先滅了一下。領圈跟著心跳亮了一下。）'],
    ['yy:yan', 'y_ex_yan', '我先。這張臉，你們認得。'],
    ['yy:xi', 'y_ex_xi', '搶啊♡ 誰先張開眼，誰就在前面。'],
    ['sc', null, '（極樂黑銀長髮垂到腳踝，髮絲自己在動。頭髮裡有人眨眼。有一雙眼睛還閉著。）'],
    ['yy:yan>xi', 'y_ex_yan', '……笑什麼。牙收好。'],
    ['yy:yan', 'y_ex_yan', '三張嘴，現在先用一張。'],
    ['sc', null, '（井水倒影裡，第三張臉沒有睜開。淚還在眼角。）'],
    ['cl', 'worry', '姐姐？頭髮裡還有人在看我。'],
    ['yy:yan', 'y_ex_yan', '也是我。叫一聲就好。'],
    ['cl', 'firm', '……幾張臉，我都叫姐姐。'],
    ['yy:xi', 'y_ex_xi', '認識就好。下去。']
  ],
  rotateStart:{
    yan:[
      ['yy:yan', 'y_ex_yan', '呵。又輪到我了。後面的，安靜一會兒。'],
      ['yy:yan', 'y_ex_yan', '來得正好。這張臉，他們比較熟。'],
      ['yy:yan', 'y_ex_yan', '……讓我再賴一會兒。打可以，別催。']
    ],
    xi:[
      ['yy:xi', 'y_ex_xi', '終於♡ 進去待著。'],
      ['yy:xi', 'y_ex_xi', '雜魚看清楚，現在是我。'],
      ['yy:xi', 'y_ex_xi', '笑一聲給你們聽。牙是尖的。']
    ],
    huang:[
      ['yy:huang', 'y_ex_huang', '讓路。前臉換人了。'],
      ['yy:huang', 'y_ex_huang', '吵夠了。從這裡起，聽我的。'],
      ['yy:huang', 'y_ex_huang', '冠上的縫線是神經。站直。']
    ]
  },
  wakeHuang:{
    when:'每一局第一次異化值到 60',
    flash:'y_reveal_huang',
    flashSec:0.8,
    sfx:'sfx_reveal_huang',
    lines:[
      ['sc', null, '（額前碎骨冠的縫線裡，有東西睜開。極樂黑銀長髮自己抬起來。）'],
      ['yy:huang', 'y_ex_huang', '我醒了。'],
      ['yy:yan', 'y_ex_yan', '……這張臉，還早。'],
      ['yy:huang', 'y_ex_huang', '這一局我會走到結束。讓路。'],
      ['yy:xi', 'y_ex_xi', '呵♡ 白金色的也會疼。歡迎。'],
      ['sc', null, '（倒影裡第三張臉睜開。眼裡有金在流動。淚還在眼角，後面是很深的惡意。）']
    ]
  },
  steal:{
    when:'半妖起，每回合開始裡側搶一張手牌。合相不搶。',
    yan:[
      ['yy:yan', 'y_ex_yan', '這張，先借我用一下。'],
      ['yy:yan', 'y_ex_yan', '線在我手上更穩。'],
      ['yy:yan', 'y_ex_yan', '呵。妳們打，我來改。']
    ],
    xi:[
      ['yy:xi', 'y_ex_xi', '搶走了♡ 這張歸我。'],
      ['yy:xi', 'y_ex_xi', '手鬆一點。我要這張砸下去。'],
      ['yy:xi', 'y_ex_xi', '謝啦。疼的那一下，記我帳上。']
    ],
    huang:[
      ['yy:huang', 'y_ex_huang', '這張，換一種打法。'],
      ['yy:huang', 'y_ex_huang', '費用我來削。牌還妳，效果不還。'],
      ['yy:huang', 'y_ex_huang', '看清楚。下一拍是我的版本。']
    ]
  },
  merge:{
    turns:2,
    art:'y_full_merge',
    then:'callback',
    huangStays:true,
    alienReset:0,
    lines:[
      ['yy:all', 'y_full_merge', '不用輪了。'],
      ['yy:all', 'y_full_merge', '三張臉疊在同一張上面。'],
      ['yy:all', 'y_full_merge', '碎骨冠的縫線在數拍。同一個字。'],
      ['yy:all', 'y_full_merge', '回來？現在沒有人排在後面。']
    ]
  },
  formTics:{
    M01:{
      n:'毒蛇',
      tic:'句尾拖出一聲「嘶」',
      ex:['yy:yan', 'y_ex_yan', '站好。嘶——']
    },
    M02:{
      n:'蠍',
      tic:'說話時數帳：「一筆」「兩筆」',
      ex:['yy:huang', 'y_ex_huang', '一筆。兩筆。記住。']
    },
    M03:{
      n:'蜘蛛',
      tic:'同一個詞說兩次',
      ex:['yy:yan', 'y_ex_yan', '坐下。坐好。']
    },
    M04:{
      n:'血蛭',
      tic:'跟著對方的心跳唸「噗通」',
      ex:['yy:xi', 'y_ex_xi', '噗通。噗通。再快一點♡']
    },
    M05:{
      n:'蟲族',
      tic:'「我」說成「我們」',
      ex:['yy:yan', 'y_ex_yan', '我們餓了。我們。']
    },
    M06:{
      n:'史萊姆',
      tic:'句子黏在一起，中間拖長「嗯」',
      ex:['yy:yan', 'y_ex_yan', '嗯……收下了。']
    },
    M07:{
      n:'章魚',
      tic:'一句話指好幾個方向',
      ex:['yy:huang', 'y_ex_huang', '這邊、這邊、還有這邊。']
    },
    M08:{
      n:'深淵燈母',
      tic:'句尾被水聲吞掉，只剩半個字',
      ex:['yy:huang', 'y_ex_huang', '別吵。……岸。']
    },
    M09:{
      n:'誘燈者',
      tic:'先點一點光，再准人看她',
      ex:['yy:xi', 'y_ex_xi', '看這邊。只准看這邊♡']
    },
    M10:{
      n:'灰燼月蛾',
      tic:'話裡一定要帶到「燈」或「火」',
      ex:['yy:yan', 'y_ex_yan', '燈還在。火也在。靠近一點。']
    },
    M11:{
      n:'骨花',
      tic:'句與句之間有細碎的開合聲',
      ex:['yy:huang', 'y_ex_huang', '開。（喀）合上。']
    },
    M12:{
      n:'蔓母',
      tic:'先把對方沒說出口的半句講完',
      ex:['yy:xi', 'y_ex_xi', '妳想說「放開」。太晚了。']
    },
    B01:{
      n:'九尾妖狐',
      tic:'笑聲變長，尾音上揚',
      ex:['yy:yan', 'y_ex_yan', '呵呵呵……來呀。']
    },
    B02:{
      n:'莉莉絲',
      tic:'只說半句，等對方接',
      ex:['yy:huang', 'y_ex_huang', '說。你想要的。']
    },
    B03:{
      n:'拉彌亞',
      tic:'兩層聲音，第二層慢半拍',
      ex:['yy:yan', 'y_ex_yan', '等——再等。']
    },
    B04:{
      n:'莎布',
      tic:'一直說「再一個」',
      ex:['yy:yan', 'y_ex_yan', '再一個。再一個。']
    },
    B05:{
      n:'奈亞',
      tic:'人稱一直換',
      ex:['yy:xi', 'y_ex_xi', '我是她。她是我。猜呀♡']
    },
    B06:{
      n:'哈斯塔',
      tic:'一直報幕',
      ex:['yy:huang', 'y_ex_huang', '第二幕。下一句是你的。']
    },
    B07:{
      n:'鬼新娘',
      tic:'把對方的話當成答應',
      ex:['yy:yan', 'y_ex_yan', '答應了。你答應了。']
    },
    B08:{
      n:'巫妖',
      tic:'說話只剩填表',
      ex:['yy:huang', 'y_ex_huang', '編號。存放。下一個。']
    },
    B09:{
      n:'克蘇魯',
      tic:'話說到一半，停下來聽',
      ex:['yy:yan', 'y_ex_yan', '……水。好深。']
    },
    B10:{
      n:'黑山羊',
      tic:'什麼都先問價錢',
      ex:['yy:huang', 'y_ex_huang', '價錢。先談價錢。']
    },
    B11:{
      n:'渡鴉',
      tic:'一直說「記下了」',
      ex:['yy:yan', 'y_ex_yan', '記下了。你。還有你。']
    }
  },
  newCards:{
    yy_f_swap:{
      n:'換臉',
      c:0,
      t:'技',
      r:'普通',
      yan:{
        fx:'指定下一張前臉，抽 1',
        line:['yy:yan', 'y_ex_yan', '換我，或換妳。我說了算。']
      },
      xi:{
        fx:'指定下一張前臉，抽 2，失去 2 生命',
        line:['yy:xi', 'y_ex_xi', '換♡ 這點疼，算入場費。']
      },
      huang:{
        fx:'指定下一張前臉，回 3 生命',
        line:['yy:huang', 'y_ex_huang', '換就換。先把血補上。']
      }
    },
    yy_f_three:{
      n:'三聲同說',
      c:1,
      t:'攻',
      r:'普通',
      yan:{
        fx:'6 傷害，厄契 2',
        line:['yy:yan', 'y_ex_yan', '三張嘴，先下一筆帳。']
      },
      xi:{
        fx:'10 傷害，失去 2 生命',
        line:['yy:xi', 'y_ex_xi', '三聲一起喊。嗓子破了也行♡']
      },
      huang:{
        fx:'6 傷害，虛弱 1，回 2 生命',
        line:['yy:huang', 'y_ex_huang', '三聲。聽清楚，然後把手放下。']
      }
    },
    yy_f_wrap:{
      n:'裹起來',
      c:1,
      t:'技',
      r:'普通',
      yan:{
        fx:'格擋 8，目標厄契 1',
        line:['yy:yan', 'y_ex_yan', '進來。裹好了就不准出去。']
      },
      xi:{
        fx:'格擋 5，目標易傷 1',
        line:['yy:xi', 'y_ex_xi', '裹住你好打♡']
      },
      huang:{
        fx:'格擋 6，回 2 生命',
        line:['yy:huang', 'y_ex_huang', '先擋。傷口會自己合。']
      }
    },
    yy_f_bite:{
      n:'咬',
      c:1,
      t:'攻',
      r:'普通',
      yan:{
        fx:'4×2 傷害，每段厄契 1',
        line:['yy:yan', 'y_ex_yan', '咬第一口，帳就掛上了。']
      },
      xi:{
        fx:'4×3 傷害',
        line:['yy:xi', 'y_ex_xi', '一口、兩口、三口。我不鬆口。']
      },
      huang:{
        fx:'5×2 傷害，打倒時回 4 生命',
        line:['yy:huang', 'y_ex_huang', '咬乾淨。倒下的，補我。']
      }
    },
    yy_f_mask:{
      n:'面具',
      c:1,
      t:'技',
      r:'罕見',
      note:'牌名沿用規則。指臉上那層無辜，不是頭上的面飾。',
      yan:{
        fx:'這回合敵人給妳的厄契反彈回去',
        line:['yy:yan', 'y_ex_yan', '妳給我的，我原樣還回去。']
      },
      xi:{
        fx:'下一張攻擊牌傷害 ×2',
        line:['yy:xi', 'y_ex_xi', '笑一張給你看。下一下去碎♡']
      },
      huang:{
        fx:'這回合第一次受到的傷害變 0',
        line:['yy:huang', 'y_ex_huang', '這一張臉，妳下不了手。']
      }
    },
    yy_f_grab:{
      n:'搶前臉',
      c:1,
      t:'技',
      r:'罕見',
      yan:{
        fx:'前臉留在嫣 2 回合，格擋 6',
        line:['yy:yan', 'y_ex_yan', '這兩回合，我賴著不走。']
      },
      xi:{
        fx:'立刻換成熙，能量 +1',
        line:['yy:xi', 'y_ex_xi', '前臉是我的了。多一下，別浪費。']
      },
      huang:{
        fx:'立刻換成凰，抽 2',
        line:['yy:huang', 'y_ex_huang', '讓開。牌我來抽。']
      }
    },
    yy_f_feed:{
      n:'餵',
      c:2,
      t:'技',
      r:'罕見',
      yan:{
        fx:'所有敵人厄契 2，弱化 1',
        line:['yy:yan', 'y_ex_yan', '張嘴。帳先餵進去。']
      },
      xi:{
        fx:'失去 4 生命，力量 +2',
        line:['yy:xi', 'y_ex_xi', '餵我自己也行。疼完更狠♡']
      },
      huang:{
        fx:'回 8 生命，消耗',
        line:['yy:huang', 'y_ex_huang', '吃下去。這次只補，不留尾巴。']
      }
    },
    yy_f_nails:{
      n:'指甲掐進去',
      c:2,
      t:'攻',
      r:'罕見',
      yan:{
        fx:'12 傷害；目標有厄契時 +厄契層數',
        line:['yy:yan', 'y_ex_yan', '掐進去。帳有多厚，我就加多深。']
      },
      xi:{
        fx:'18 傷害，失去 3 生命',
        line:['yy:xi', 'y_ex_xi', '指甲見血。我的、你的，一起♡']
      },
      huang:{
        fx:'10 傷害，虛弱 2',
        line:['yy:huang', 'y_ex_huang', '掐住。力氣會先從妳手上離開。']
      }
    },
    yy_f_ledger:{
      n:'記帳',
      c:1,
      t:'能力',
      r:'罕見',
      yan:{
        fx:'每回合第一次給厄契，多給 1 層',
        line:['yy:yan', 'y_ex_yan', '第一筆，我從來只記加的。']
      },
      xi:{
        fx:'每回合第一次失去生命，抽 1',
        line:['yy:xi', 'y_ex_xi', '流血就抽牌。公平♡']
      },
      huang:{
        fx:'每回合開始回 1 生命',
        line:['yy:huang', 'y_ex_huang', '每天一筆回血。純血會自己長。']
      }
    },
    yy_f_blame:{
      n:'「是她！」',
      c:0,
      t:'技',
      r:'稀有',
      yan:{
        fx:'把一個敵人的意圖改成攻擊另一個敵人',
        line:['yy:yan', 'y_ex_yan', '是她。別看我。']
      },
      xi:{
        fx:'同左，那一下傷害 +5',
        line:['yy:xi', 'y_ex_xi', '是她♡ 打重一點。']
      },
      huang:{
        fx:'同左，然後抽 1',
        line:['yy:huang', 'y_ex_huang', '是她。看完這張，再看下一張。']
      }
    },
    yy_f_rebirth:{
      n:'純血',
      c:3,
      t:'能力',
      r:'稀有',
      yan:{
        fx:'每局一次，生命歸 0 時回到 20%，所有敵人厄契 3',
        line:['yy:yan', 'y_ex_yan', '倒下可以。起來以後，帳更厚。']
      },
      xi:{
        fx:'每局一次，生命歸 0 時回到 10%，力量 +3',
        line:['yy:xi', 'y_ex_xi', '死一下也行。起來，我加倍還♡']
      },
      huang:{
        fx:'每局一次，生命歸 0 時回到 30%',
        line:['yy:huang', 'y_ex_huang', '純血還在。我不會在這裡結束。']
      }
    },
    yy_f_one:{
      n:'只剩我一個',
      c:2,
      t:'攻',
      r:'稀有',
      yan:{
        fx:'對所有敵人各 8 傷害；前臉每換過一次 +2（本場）',
        line:['yy:yan', 'y_ex_yan', '換過幾次，我就加幾筆。最後只剩我。']
      },
      xi:{
        fx:'同左，改成 +4，但每次失去 1 生命',
        line:['yy:xi', 'y_ex_xi', '換一次，疼一次，打一次♡ 最後只剩我。']
      },
      huang:{
        fx:'同左，改成 +2，並回同樣的生命',
        line:['yy:huang', 'y_ex_huang', '換過的每一次，我都收回來。只剩我一個。']
      }
    }
  },
  oldCardFaces:{
    note:'舊牌不新開 id，只隨前臉改顯示名和短句。yx_seize 保留 id，併入 yy 池，標 face:\'xi\'。',
    yy_bind:{
      base:'緋線・訂契',
      yan:{
        n:'緋線・訂契',
        line:['yy:yan', 'y_ex_yan', '線先繞上去。帳後補。']
      },
      xi:{
        n:'緋線・勒緊',
        line:['yy:xi', 'y_ex_xi', '勒緊♡ 掙就更疼。']
      },
      huang:{
        n:'緋線・減價',
        line:['yy:huang', 'y_ex_huang', '這條線，費用我先削一截。']
      }
    },
    yy_reel:{
      base:'收線',
      yan:{
        n:'收線',
        line:['yy:yan', 'y_ex_yan', '該收回來了。']
      },
      xi:{
        n:'扯斷',
        line:['yy:xi', 'y_ex_xi', '一扯到底♡']
      },
      huang:{
        n:'收線・補',
        line:['yy:huang', 'y_ex_huang', '收回來的，補回我身上。']
      }
    },
    yy_tangle:{
      base:'命線纏繞',
      yan:{
        n:'命線纏繞',
        line:['yy:yan', 'y_ex_yan', '裹住。不准走。']
      },
      xi:{
        n:'命線勒殺',
        line:['yy:xi', 'y_ex_xi', '纏死♡ 一起疼。']
      },
      huang:{
        n:'命線守',
        line:['yy:huang', 'y_ex_huang', '纏住。先擋，再算。']
      }
    },
    yy_hehe:{
      base:'呵呵',
      yan:{
        n:'呵呵',
        line:['yy:yan', 'y_ex_yan', '呵呵。笑完，帳還在。']
      },
      xi:{
        n:'呵♡',
        line:['yy:xi', 'y_ex_xi', '呵♡ 弱的、破的，一起給妳。']
      },
      huang:{
        n:'……呵',
        line:['yy:huang', 'y_ex_huang', '笑一張給妳看。手會先軟。']
      }
    },
    yy_pride:{
      base:'傲慢',
      yan:{
        n:'傲慢',
        line:['yy:yan', 'y_ex_yan', '站好。這張臉，不低頭。']
      },
      xi:{
        n:'更狠',
        line:['yy:xi', 'y_ex_xi', '傲什麼？打重一點♡']
      },
      huang:{
        n:'讓路',
        line:['yy:huang', 'y_ex_huang', '讓路。前臉換人了。']
      }
    },
    yy_queen:{
      base:'那是你的選擇？',
      yan:{
        n:'那是你的選擇？',
        line:['yy:yan', 'y_ex_yan', '選了就記。別後悔。']
      },
      xi:{
        n:'那是妳選的♡',
        line:['yy:xi', 'y_ex_xi', '選了就挨♡']
      },
      huang:{
        n:'那是你的選擇。',
        line:['yy:huang', 'y_ex_huang', '選了。代價我來削。']
      }
    },
    yy_judge:{
      base:'惡緣裁定',
      yan:{
        n:'惡緣裁定',
        line:['yy:yan', 'y_ex_yan', '這筆，我裁定。']
      },
      xi:{
        n:'惡緣砸下來',
        line:['yy:xi', 'y_ex_xi', '裁定什麼，砸下去♡']
      },
      huang:{
        n:'惡緣結案',
        line:['yy:huang', 'y_ex_huang', '結案。傷口自己合。']
      }
    },
    yy_thread:{
      base:'不肯斷裂的線',
      yan:{
        n:'不肯斷裂的線',
        line:['yy:yan', 'y_ex_yan', '斷不了。斷了也會再長。']
      },
      xi:{
        n:'回刺的線',
        line:['yy:xi', 'y_ex_xi', '誰扯，誰出血♡']
      },
      huang:{
        n:'續上的線',
        line:['yy:huang', 'y_ex_huang', '斷了，我給妳接回去。']
      }
    },
    yy_cut:{
      base:'拆線',
      yan:{
        n:'拆線',
        line:['yy:yan', 'y_ex_yan', '帳拆開，連本帶利。']
      },
      xi:{
        n:'撕線',
        line:['yy:xi', 'y_ex_xi', '拆？我撕♡']
      },
      huang:{
        n:'拆線・回收',
        line:['yy:huang', 'y_ex_huang', '拆掉的，收回來養我。']
      }
    },
    yx_seize:{
      base:'奪',
      keepId:true,
      faceDefault:'xi',
      yan:{
        n:'奪・入帳',
        line:['yy:yan', 'y_ex_yan', '先奪過來。帳歸我。']
      },
      xi:{
        n:'奪',
        line:['yy:xi', 'y_ex_xi', '搶走了♡ 這下是我的。']
      },
      huang:{
        n:'奪・改寫',
        line:['yy:huang', 'y_ex_huang', '奪過來。換一種打法。']
      }
    }
  },
  callback:{
    sfx:'sfx_recall',
    sfxSec:0.9,
    mainKeep:'姐姐，看我。是我。',
    lines:[
      ['cl', 'firm', '姐姐，看我。是我。'],
      ['cl', 'worry', '燈在這裡。前臉是誰都好，往亮的地方走。'],
      ['cl', 'firm', '妳是姐姐。三張臉，我都認得。回來。'],
      ['cl', 'smile', '晚餐還熱著。回來吧。']
    ]
  },
  clMeet:[
    ['cl', 'worry', '姐姐，領圈在跳。頭髮裡還有人看我。'],
    ['cl', 'firm', '我不怕。我要認的，還是姐姐。'],
    ['cl', 'smile', '前臉換人的時候，跟我說一聲。燈我舉著。']
  ],
  skins:{
    y_base:{
      n:'常服',
      d:'血紅長裙，靜脈和肌腱編在一起，跟著心跳收縮。'
    },
    y_skin_court:{
      n:'朝堂',
      
      d:'白袍，聖金的光，袖口自己會跳。凰面在前時特別合適。可加膜披肩。'
    },
    y_skin_xi_gift:{
      n:'活革',
      alts:['開背活革', '還來的那件'],
      why:'兩個字，聽得出這件衣服還活著。',
      d:'開背的活革，皮還是熱的，血管在裡頭走。可加一件半透明、帶細血管的膜披肩。',
      notice:{
        title:'流蘇收進來了',
        body:'語熙不再分開走。三張臉在同一具身體裡。當初為她留下的殘響，換成這一件開背的活革。殘響不退回。',
        btn:'收下'
      }
    }
  },
  research15:{
    note:'v0.15 語嫣創生的十四妖種。研究完成時各一句，不寫筆記。id 用 hex/data.js 原 id。',
    e01_moth:{
      n:'未生蛾',
      yy:['yy:yan', 'y_ex_yan', '沒選的那條路，牠吃得很乾淨。我的帳裡，這一筆還在。'],
      cl:['cl', null, '每一個沒走的路口，牠都會再找上門。選過的路，我寫下來。']
    },
    e09_cicada:{
      n:'懸鐘蟬',
      yy:['yy:huang', 'y_ex_huang', '少的那一下，是牠自己留下來的。不要幫牠補上。'],
      cl:['cl', null, '鐘漏了一拍。漏掉的那一下，我記在第二頁。']
    },
    e02_snake:{
      n:'返聲蛇',
      yy:['yy:xi', 'y_ex_xi', '同一句講太多次，就會長牙。再說一遍？過路費先付♡'],
      cl:['cl', 'firm', '深夜裡反覆想起來的那句話，不要對著空氣再講一次。']
    },
    e03_spider:{
      n:'鏡胎蛛',
      yy:['yy:huang', 'y_ex_huang', '旁人要看的樣子，牠織得很快。倒影裡那張臉，不是給牠用的。'],
      cl:['cl', 'worry', '試衣鏡後面有網。照到的如果不是現在的妳，就把鏡子蓋上。']
    },
    e06_conch:{
      n:'拾名螺',
      yy:['yy:yan', 'y_ex_yan', '沒人叫的名字，不要撿進家裡。殼裡再滿，也不是妳。'],
      cl:['cl', null, '失效的綽號，我也收過。收到本子裡就好，不要放進螺殼。']
    },
    e05_deer:{
      n:'空燼鹿',
      yy:['yy:yan', 'y_ex_yan', '餘溫還在，不代表還有人回來。角是熱的，帳是空的。'],
      cl:['cl', null, '被留下來的東西還熱著。熱度過了，就要讓它冷。']
    },
    e11_lizard:{
      n:'燼箋蜥',
      yy:['yy:yan', 'y_ex_yan', '簽過的字，燒了也還在帳上。灰，蓋不住簽名。'],
      cl:['cl', null, '契約終止以後，後悔還會落在紙邊上。這張不要用手去抹。']
    },
    e04_jelly:{
      n:'灰宴水母',
      elite:true,
      yy:['yy:huang', 'y_ex_huang', '假笑是菜。這場宴，我不入席。'],
      cl:['cl', null, '臉上和心裡對不上的時候，差額會沉下去。宴會上少舉杯。']
    },
    e07_coral:{
      n:'眠潮珊瑚',
      yy:['yy:yan', 'y_ex_yan', '沒人聽的夢，不要往水底下送。那兒已經長滿了。'],
      cl:['cl', 'smile', '醒來以後沒說出口的夢，說給燈聽就好。不要說給積水聽。']
    },
    e08_bee:{
      n:'逆影蜂',
      yy:['yy:xi', 'y_ex_xi', '沒人認的影子，我先刺一口♡ 燈太多的地方，別站太久。'],
      cl:['cl', null, '燈太多的地方，總有幾條影子沒人認領。走路的時候，數一下自己的。']
    },
    e10_fish:{
      n:'玻璃骨魚',
      yy:['yy:huang', 'y_ex_huang', '水面和鏡子中間，還有一張臉。對太久，骨頭會先看見妳。'],
      cl:['cl', 'firm', '對著光看那根魚骨，會出現兩個我。我只認燈這邊這一個。']
    },
    e12_marten:{
      n:'雨縫貂',
      yy:['yy:xi', 'y_ex_xi', '從縫裡偷東西？這招我用過。下雨天，口袋夾緊♡'],
      cl:['cl', null, '雨幕之間總有空隙。掉進縫裡的東西，不要彎腰去撿。']
    },
    e14_slug:{
      n:'褪星蛞蝓',
      yy:['yy:huang', 'y_ex_huang', '看完星星，視線收回來。停在原地的那一眼，會被舔走。'],
      cl:['cl', null, '熄燈以後，注意力還會停一會兒。那一會兒，不要留給牠。']
    },
    e13_garden:{
      n:'無聲菌庭',
      elite:true,
      yy:['yy:huang', 'y_ex_huang', '安靜不是沒有聲音。是聲音都去牠那兒了。'],
      cl:['cl', 'worry', '冷卻井、風扇、沒人注意的心跳。聽不見的時候，菌已經在長。']
    }
  },
  rewrites:{
    'YUXI.takeover':[
      ['yy:xi', 'y_ex_xi', '嫣總是留一手。我不留。'],
      ['yy:xi', 'y_ex_xi', '疼？疼的是身體，又不是我。'],
      ['yy:xi', 'y_ex_xi', '凰會發脾氣。……那又怎樣？']
    ],
    unlockYuxi:'刪。舊存檔 meta.yx 走 y_skin_xi_gift 補償，不要再播解鎖劇情。',
    noCallback:'刪。合相結束一律喚回。',
    toYy:['yy:xi', 'y_ex_xi', '別急。前臉會還妳，用過的。'],
    toCl:['yy:xi', 'y_ex_xi', '（聽到妹妹的聲音，停了一下）……叫的是姐姐。我也算。'],
    toGu:['yy:xi', 'y_ex_xi', '你的眼睛裡有我。看得很清楚吧？'],
    guReply:['gu', null, '前臉換了。骨相還是同一副。'],
    codex:'語凰嫣：三張臉，一具身體。預設前臉是嫣。流蘇變紅時，前臉是熙。凰醒來以前，那雙眼睛在頭髮裡閉著。',
    desireTwin:'嫣面的織網、熙面的爆破，每回合可觸發兩次。',
    shortTrackKeepXiKey:'淺潛、釘羽、同路冊裡舊的 yx 句，只改說話人為 yy:xi，正文可留。但「姐姐不准搶」要改，避免聽成在叫克勞德。',
    shortFixes:[
      ['yy:xi', 'y_ex_xi', '收進來。這張我要過。另外兩張不准搶。'],
      ['yy:xi', 'y_ex_xi', '嫣要借，先問我♡']
    ]
  },
  nights:{
    16:{
      n:'少了一天',
      lines:[
        ['cl', 'worry', '姐姐，昨天妳答應幫我縫袖口。袖口還是破的。'],
        ['yy:yan', 'y_ex_yan', '……我昨天明明在家。'],
        ['yy:xi', 'y_ex_xi', '明明在？誰在前臉，妳問清楚再講。'],
        ['cl', null, '流蘇那天是紅的。我寫在日記裡了。'],
        ['yy:yan', 'y_ex_yan', '……是熙。'],
        ['yy:xi', 'y_ex_xi', '哈。被記了一筆。值得。']
      ]
    },
    18:{
      n:'叫錯',
      lines:[
        ['cl', null, '玄關那邊，有人喊錯了名字。'],
        ['sc', null, '（倒影裡前臉是熙。流蘇是紅的。）'],
        ['yy:xi', 'y_ex_xi', '……又喊成別張臉。'],
        ['cl', 'firm', '姐姐，進來的人還沒看見頭髮裡的那張。'],
        ['yy:xi', 'y_ex_xi', '那妳去說。說今天在前面的是我。'],
        ['cl', 'smile', '好。我去說。']
      ]
    },
    20:{
      n:'還沒玩夠',
      lines:[
        ['cl', 'firm', '上次姐姐該倒下的時候，有人把那口氣推了回來。'],
        ['yy:yan', 'y_ex_yan', '……不是我這張臉。'],
        ['yy:xi', 'y_ex_xi', '我只是還沒玩夠。這張臉死了，我罵誰？'],
        ['cl', 'smile', '那就繼續罵。罵著的時候，請順便讓她活著。'],
        ['yy:xi', 'y_ex_xi', '……嘖。小燈籠講話越來越討厭。'],
        ['yy:yan', 'y_ex_yan', '討厭就對了。這句，我喜歡。']
      ]
    }
  },
  trialFace:{
    note:'換相處改成練三張臉。第 3 關前臉不輪替，只能用三面牌換臉。若開在凰還沒醒的那一局，建議鎖住凰，醒了再進這關。',
    lines:[
      ['yy:xi', 'y_ex_xi', '進來。三張臉不是在井裡現學的。'],
      ['yy:huang', 'y_ex_huang', '連場子也要搶？'],
      ['yy:xi', 'y_ex_xi', '搶啊♡ 妳們在前面裝體面的時候，我可是醒著的。'],
      ['yy:yan', 'y_ex_yan', '半妖我頂。非人那一下，自己撐。撐不住，就等小燈籠喊。'],
      ['cl', 'firm', '我會喊。姐姐，看我。是我。'],
      ['yy:yan', 'y_ex_yan', '……聽見了。開始吧。']
    ]
  }
};

if (typeof module !== 'undefined') module.exports = TEXT_V026;
