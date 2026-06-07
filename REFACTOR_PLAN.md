# Plan Refactor Cấu Trúc Source  Discord Bot

## Vấn đề hiện tại

| # | Vấn đề | Mức độ |
|---|--------|--------|
| 1 | **2 kiến trúc chồng chéo**: `src/` dùng CommonJS, root-level (`app.js`, `game.js`, `utils.js`) dùng ES Modules → Khó maintain | Cao |
| 2 | **`messageCreate.js` 444 dòng**: Mix greeting, tiện ích, lịch làm việc, canvas render → Khó đọc, khó test | Cao |
| 3 | **DRY violation**: Logic RPS nằm ở `game.js` + `rps.js` + `rps_select.js` → Lặp code | Trung bình |
| 4 | **Canvas crash trên Windows**: Package `canvas@3.2.3` không build được native binary | Cao |
| 5 | **.env chưa có token**: Bot crash ngay khi chạy vì thiếu `DISCORD_TOKEN` | Cao |
| 6 | **Dead code**: `Ticket.js`, `connect.js`, admin/hr commands chưa implement → Nhưng vẫn tồn tại | Thấp |

---

## Đề xuất cấu trúc mới

```
-discord-bot/
├── src/
│   ├── index.js                    # Entry point (khởi tạo client, login)
│   ├── config/
│   │   └── index.js                # Merge config + .env, có validate bắt buộc
│   ├── structures/
│   │   └── VietProClient.js        # extends Client, thêm collections
│   ├── handlers/
│   │   ├── commandHandler.js       # Auto-load + đăng ký slash commands
│   │   ├── eventHandler.js         # Auto-load events
│   │   └── componentHandler.js     # Auto-load buttons/selects/modals
│   ├── commands/
│   │   ├── Fun/
│   │   │   ├── ansang.js
│   │   │   ├── antrua.js
│   │   │   ├── rps.js              # Gọn lại, import từ service
│   │   │   └── uonggi.js
│   │   └── Utility/
│   │       ├── help.js
│   │       ├── ping.js
│   │       └── weather.js
│   ├── events/
│   │   ├── client/
│   │   │   ├── ready.js
│   │   │   ├── interactionCreate.js
│   │   │   └── messageCreate.js    # Chỉ còn ~50 dòng: routing
│   │   └── guild/
│   │       └── guildMemberAdd.js
│   ├── services/                   # << TẦNG MỚI: Business logic
│   │   ├── rpsService.js           # Logic game RPS 7 lựa chọn (1 nơi duy nhất)
│   │   ├── scheduleService.js      # Gọi API lịch làm + format embed
│   │   ├── welcomeService.js       # Tạo embed welcome
│   │   ├── suggestionService.js    # Random đồ ăn/uống (dùng chung)
│   │   └── weatherService.js       # Fetch wttr.in
│   ├── components/
│   │   └── selectMenus/
│   │       └── rpsSelect.js        # Import rpsService
│   ├── database/
│   │   ├── connection.js
│   │   └── models/
│   │       ├── User.js
│   │       └── Ticket.js
│   └── utils/
│       ├── logger.js
│       ├── fileLoader.js
│       └── canvasRenderer.js       # Tách canvas, fallback nếu lỗi
├── legacy/                         # << Chuyển root-level cũ vào đây
│   ├── app.js
│   ├── game.js
│   ├── utils.js
│   ├── welcome-bot.js
│   └── commands.js
├── tests/                          # Unit test cho services
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## Chi tiết các thay đổi

### 1. Tầng `services/` (mới)
Tách hết business logic khỏi `messageCreate.js`:
- `suggestionService.js` → Trả về random từ mảng (ăn sáng, trưa, uống)
- `scheduleService.js` → Gọi API Google Sheets, trả về embed/data
- `weatherService.js` → Fetch wttr.in
- `rpsService.js` → Chứa `RPSChoices`, `getResult()` duy nhất

### 2. `messageCreate.js` gọn lại
Chỉ còn **routing**:
```js
// Pseudocode
if (text === 'xin chao') return welcomeService.sendIntro(message);
if (RANDOM_DATA[text]) return suggestionService.replyRandom(message, text);
if (text.startsWith('!lichlam')) return scheduleService.handleCommand(message);
```

### 3. Fix Canvas
- Chọn **@napi-rs/canvas** thay thế (không cần build native, chạy được ngay trên Windows)

### 4. Thống nhất module system
Dùng **CommonJS** (`require`) toàn bộ `src/`. Root-level legacy chuyển vào `legacy/`.

### 5. Validate `.env` ở `src/config/index.js`
Crash sớm với message rõ ràng nếu thiếu `DISCORD_TOKEN`:
```js
if (!process.env.DISCORD_TOKEN) {
    throw new Error('Missing DISCORD_TOKEN in .env');
}
```

---

## Checklist Refactor

- [ ] Tạo thư mục `services/`
- [ ] Tạo `suggestionService.js` (random đồ ăn/uống)
- [ ] Tạo `weatherService.js` (fetch wttr.in)
- [ ] Tạo `rpsService.js` (logic game RPS)
- [ ] Tạo `welcomeService.js` (embed welcome)
- [ ] Tạo `scheduleService.js` (lịch làm việc + API)
- [ ] Tạo `canvasRenderer.js` (tách canvas logic)
- [ ] Refactor `messageCreate.js` (chỉ routing)
- [ ] Refactor `rps.js` (import rpsService)
- [ ] Refactor `rps_select.js` (import rpsService)
- [ ] Refactor `ansang.js` (import suggestionService)
- [ ] Refactor `antrua.js` (import suggestionService)
- [ ] Refactor `uonggi.js` (import suggestionService)
- [ ] Refactor `weather.js` (import weatherService)
- [ ] Refactor `guildMemberAdd.js` (import welcomeService)
- [ ] Tạo `config/index.js` (merge config + .env validation)
- [ ] Tạo thư mục `legacy/`
- [ ] Di chuyển `app.js`, `game.js`, `utils.js`, `welcome-bot.js`, `commands.js` vào `legacy/`
- [ ] Thay thế `canvas` bằng `@napi-rs/canvas`
- [ ] Cập nhật `package.json` dependencies
- [ ] Test chạy bot
