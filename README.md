# 渡鴉下潛（肉鴿卡牌試作）v0.2

語嫣或克勞德，從天闕市一路往下走三層：選路、打牌、撿遺物，打倒每一層的首領。輸了也會留下「回憶」，累積起來會解鎖新牌、新遺物和回憶之書的故事。

- 網址：`https://a12290804-bot.github.io/Yuyan-tactics/hex/`
- 檔案：`data.js`（卡牌、敵人、遺物、事件、對話、成就都是資料表）、`core.js`（規則，純函式、同一個種子結果一樣）、`index.html`（畫面）。
- 圖片：全部借用渡鴉公會網站的圖（`../../raven-guild/images/`）。
- 存檔：`localStorage` 的 `dive_run_v1`（這一局）、`dive_meta_v1`（回憶、圖鑑、成就）。
- 測試：`node tests/core_tests.js`（73 項）；平衡模擬：`node tests/sim.js 300 yy`、`node tests/sim.js 300 cl`。

## 加東西
- 新卡：在 `cards` 加一筆。效果寫成 fx 清單，說明文字會自動產生。
- 新敵人：在 `enemies` 加一筆，再放進 `layers` 的 fights／elites。
- 新事件：在 `events` 加一筆（選項的結果寫在 r）。
- 新故事：在 `stories` 加對話，在 `unlocks` 設要累積多少回憶。
