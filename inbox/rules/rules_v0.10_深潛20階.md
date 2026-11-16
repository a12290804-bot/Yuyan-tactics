# 規則 v0.10：深潛 20 階（往上加難度）

規則大師，11/16。使用者回報：玩家都破關了，太簡單。

## 〇、先撤回 v0.8 的降難度

- v0.8 提的 `layers[0].hpMul 1.4`、`atkMul 1.1`、九尾換兩張狐火：**全部不做**。
- 只保留九尾被動改成每回合觸發的那一行（`c.firstAtk!==c.turn`）。
- 基本難度（深潛 0）維持現在的數字，難度往上加，全部走深潛。

## 一、深潛改成資料表

- 現有 `st.asc` 上限從 10 拉到 **20**（`meta.ascMax` 上限 20）。
- 拿掉程式裡寫死的「每階敵人攻擊 +5%」，改讀 `DATA.asc`。
- 每一階是累加的：打深潛 7，就同時套用 1～7 階。
- 程式只要一個 `ascMod(st,key)`：把 1～`st.asc` 各階 `mods[key]` 累加（乘數相乘，數字相加，旗標取有沒有）。之後調整只改資料。
- 上限不要寫死：`core.js` 第 850 行的 `Math.min(10,…)` 改成 `Math.min(DATA.asc.length-1,…)`。
- 殘響加成改成資料表：每一階的 `mods` 都有 `echo:.04`（相加）。`echoOf` 的 `1+.1*asc` 改成 `1+ascMod(st,'echo')`，深潛 20 是 1.8 倍，不是 3 倍。（11/16 照遊戲程式以及代碼製作大師的建議修訂）

```js
DATA.asc=[
 null,
 {id:'asc_1', mods:{echo:.04,foeHp:1.08}},
 {id:'asc_2', mods:{echo:.04,eliteNodes:1}},
 {id:'asc_3', mods:{echo:.04,restHeal:.7}},
 {id:'asc_4', mods:{echo:.04,foeAtk:1.08}},
 {id:'asc_5', mods:{echo:.04,startCurse:1}},
 {id:'asc_6', mods:{echo:.04,bossHp:1.15}},
 {id:'asc_7', mods:{echo:.04,shopMul:1.25}},
 {id:'asc_8', mods:{echo:.04,startAlien:20}},
 {id:'asc_9', mods:{echo:.04,rewardChoices:-1}},
 {id:'asc_10',mods:{echo:.04,eliteTrait:1}},
 {id:'asc_11',mods:{echo:.04,startHp:-10}},
 {id:'asc_12',mods:{echo:.04,foeBlock:1.3}},
 {id:'asc_13',mods:{echo:.04,bossPhase2:1}},
 {id:'asc_14',mods:{echo:.04,eliteRelic:.5}},
 {id:'asc_15',mods:{echo:.04,chapterSin:1}},
 {id:'asc_16',mods:{echo:.04,firstDraw:-1}},
 {id:'asc_17',mods:{echo:.04,enrage:12}},
 {id:'asc_18',mods:{echo:.04,foeTrait:.3}},
 {id:'asc_19',mods:{echo:.04,bossHp:1.2,foeAtk:1.08}},
 {id:'asc_20',mods:{echo:.04,recallOnce:1}}
];
```

## 二、每一階做什麼

| 階 | 鍵 | 效果 |
|---|---|---|
| 1 | `foeHp` | 所有敵人生命 ×1.08 |
| 2 | `eliteNodes` | 每層地圖多 1 個菁英格（取代一般戰鬥格） |
| 3 | `restHeal` | 休息回復量 ×0.7 |
| 4 | `foeAtk` | 一般敵人攻擊 ×1.08 |
| 5 | `startCurse` | 開局牌組多 1 張隨機詛咒牌（從現有詛咒池抽） |
| 6 | `bossHp` | 首領生命 ×1.15 |
| 7 | `shopMul` | 商店價格、刪牌費用 ×1.25 |
| 8 | `startAlien` | 開局異化值 20（語凰嫣）；克勞德改成開局污染 1 階 |
| 9 | `rewardChoices` | 一般戰鬥的選牌從 3 張變 2 張；菁英、首領照舊 3 張 |
| 10 | `eliteTrait` | 菁英隨機帶一個混沌詞綴（世界書四種，見第三段） |
| 11 | `startHp` | 開局最大生命 -10 |
| 12 | `foeBlock` | 敵人格擋 ×1.3 |
| 13 | `bossPhase2` | 首領生命掉到一半時進第二階段：清掉負面狀態，力量 +3，意圖換一套（沒有第二套意圖的首領，改成每回合多一次攻擊） |
| 14 | `eliteRelic` | 菁英掉遺物的機率 ×0.5（沒掉的話改給 30 金） |
| 15 | `chapterSin` | 每章開始抽一個七宗罪（`DATA.sins`），整章的敵人都帶著它 |
| 16 | `firstDraw` | 每場戰鬥第一回合少抽 1 張 |
| 17 | `enrage` | 戰鬥第 12 回合起，敵人每回合力量 +2 |
| 18 | `foeTrait` | 一般敵人有 30% 機率帶混沌詞綴 |
| 19 | `bossHp`、`foeAtk` | 首領生命再 ×1.2，一般敵人攻擊再 ×1.08 |
| 20 | `recallOnce` | 克勞德的喚回每局只有一次。第二次合相結束後，沒有人叫她回來：異化值停在 100，直到戰鬥結束；這段時間每回合失去 3 生命 |

## 三、混沌詞綴（第 10、18 階）

來自世界書的四種混沌特質。資料放 `DATA.traits`：

| id | 名 | 效果 |
|---|---|---|
| `excess` | 過剩 | 生命 ×1.3 |
| `scheme` | 算計 | 每 3 回合把玩家 1 張手牌換成詛咒，只到這場戰鬥結束 |
| `rot` | 腐 | 攻擊命中時，玩家下回合少 1 點能量（每回合最多一次） |
| `rage` | 狂 | 生命低於一半時，攻擊 ×1.5 |

敵人名字前面加上詞綴名，例如「狂・紙人」。

## 四、解鎖和獎勵

- 用任何角色贏了深潛 N，就開放 N+1（照現有規則），最高 20。
- 第 5、10、15、20 階第一次通關，各送一套卡背：`cb_asc5`、`cb_asc10`、`cb_asc15`、`cb_asc20`。
- 第 20 階通關，拿到稱號「最底」。

## 五、給文字劇情大師

- id 就是 `asc_1` 到 `asc_20`。進去時說一句、打完說一句，照你的計畫寫。
- 詞綴四個名字，還有 `chapterSin` 那一章開頭說哪一宗罪醒了，也請你寫。

## 六、驗證

- 我的模擬機器人可以先跑能用資料模擬的幾階（1、3、4、6、11、12、19），看勝率怎麼掉。
- 其他需要新程式的階（2、5、9、10、13、15、16、17、18、20），等 Claude 實作後一起跑。
- 目標勝率（貪婪機器人，第一章）：深潛 0 維持現狀，深潛 10 大約是 0 的一半，深潛 20 低於 5%。
