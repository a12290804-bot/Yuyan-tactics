# 燈火邊境（六角經營試作）v0.1

白鐵礦城南門外的六角地圖：白天蓋房子、派成員，晚上污染擴散。拔除三座污染巢就贏，污染漫進南門就輸。

- 網址：`https://a12290804-bot.github.io/Yuyan-tactics/hex/`
- 檔案：`data.js`（地形、建築、成員、事件都是資料表，加東西只要填表）、`core.js`（規則，純函式、可重播）、`index.html`（畫面）。
- 圖片：借用永生戰棋的地形圖（`../inbox/`）和渡鴉公會的立繪、道具圖（`../../raven-guild/images/`）。
- 測試：`node tests/core_tests.js`（15 項）；平衡：`node tests/sim.js 60 1`（用心玩）、`node tests/sim.js 60 0`（隨便玩）。
- 存檔：`localStorage` 的 `hex_save_v1`，跟戰棋分開。

## 加東西
- 新建築：在 `buildings` 加一筆（on 地形、cost、out 產出、adj 相鄰加成、light 照明、ward 結界、cap 住處、rest 體力）。
- 新成員：在 `heroes` 加一筆（四項能力 1～3、一句台詞）；探索廢墟時會隨機遇到。
- 新事件：`finds`（探索廢墟）、`morning`（早上）。
