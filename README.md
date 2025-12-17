# VietProDev Discord Bot - Enterprise Edition 🚀

Bot Discord chuyên nghiệp cho quản lý công ty VietProDev, được xây dựng với kiến trúc Monolithic Handler chuẩn Enterprise.

## ✨ Tính năng

### 🎮 Giải trí & Game
- `/rps` - Chơi Kéo-Búa-Bao với bot (7 lựa chọn)
- `/ansang` - Gợi ý món ăn sáng ngẫu nhiên
- `/antrua` - Gợi ý món ăn trưa
- `/uonggi` - Gợi ý đồ uống

### 🛠️ Tiện ích
- `/ping` - Kiểm tra độ trễ bot
- `/help` - Hiển thị danh sách lệnh
- `/weather [city]` - Xem thời tiết

### 🎉 Tự động
- **Welcome System**: Chào mừng thành viên mới với embed đẹp + ảnh tùy chỉnh
- **Message Commands**: Hỗ trợ legacy commands (`!temp`, `!ansang`, etc.)

### 💾 Database (MongoDB)
- Lưu thông tin nhân viên (User model)
- Tracking stats game (điểm, level, thắng/thua)
- Hệ thống ticket support (Ticket model)

## 📂 Cấu trúc dự án

```
vietprodev-bot/
├── src/
│   ├── index.js              # Entry point
│   ├── configs/
│   │   └── config.js         # Cấu hình tĩnh (colors, IDs, messages)
│   ├── database/
│   │   ├── connect.js
│   │   └── models/
│   │       ├── User.js
│   │       └── Ticket.js
│   ├── handlers/             # Auto-loaders
│   │   ├── commandHandler.js
│   │   ├── eventHandler.js
│   │   └── componentHandler.js
│   ├── utils/
│   │   ├── logger.js         # Logger với màu sắc đẹp
│   │   └── fileLoader.js     # Đọc file đệ quy
│   ├── commands/
│   │   ├── utility/          # ping, help, weather
│   │   ├── fun/              # rps, ansang, antrua, uonggi
│   │   ├── admin/            # (Dự định: setup, clear)
│   │   └── hr/               # (Dự định: onboard, nghiphep)
│   ├── events/
│   │   ├── client/           # ready, interactionCreate, messageCreate
│   │   └── guild/            # guildMemberAdd
│   └── components/
│       ├── buttons/
│       ├── selectMenus/      # rps_select
│       └── modals/
├── assets/
│   └── images/
│       └── welcome-card.png  # Ảnh welcome (nếu có)
├── .env                      # Biến môi trường (KHÔNG commit)
├── .env.example
├── package.json
└── README.md
```

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone <repo-url>
cd VietProDev-Discord-Bot
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Sau đó điền thông tin vào `.env`:

```env
DISCORD_TOKEN=your_bot_token_here
APP_ID=your_application_id_here
MONGO_URI=mongodb://localhost:27017/vietprodev-bot
WELCOME_CHANNEL_ID=123456789
```

### 4. Bật Privileged Gateway Intents

Vào **Discord Developer Portal** → Bot → **Privileged Gateway Intents**:
- ✅ `PRESENCE INTENT`
- ✅ `SERVER MEMBERS INTENT`
- ✅ `MESSAGE CONTENT INTENT`

### 5. Chạy bot

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 📦 Dependencies

- **discord.js v14** - Discord API wrapper
- **mongoose** - MongoDB ODM
- **dotenv** - Quản lý biến môi trường
- **chalk** - Logger với màu sắc terminal

## 🎯 Sử dụng

### Slash Commands
Tất cả lệnh đều dùng `/` prefix:

```
/ping
/help
/rps
/ansang
/weather Biên Hòa
```

### Legacy Text Commands (Hỗ trợ backward compatibility)
```
!temp
!ansang
!antrua
!uonggi
```

## 🔧 Phát triển thêm

### Thêm Command mới

1. Tạo file trong `src/commands/<category>/<name>.js`:

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mycommand')
        .setDescription('Mô tả'),
    
    async execute(interaction, client) {
        await interaction.reply('Hello!');
    }
};
```

2. Bot sẽ tự động load khi restart!

### Thêm Event mới

Tạo file trong `src/events/<category>/<eventName>.js`:

```js
module.exports = {
    name: 'messageDelete',
    async execute(message, client) {
        console.log('Tin nhắn bị xóa');
    }
};
```

### Thêm Button/Select Menu/Modal

Tạo file trong `src/components/<type>/<id>.js`:

```js
module.exports = {
    id: 'my_button',
    async execute(interaction, client) {
        await interaction.reply('Button clicked!');
    }
};
```

## 📝 Ghi chú

- Bot sử dụng **CommonJS** (`require`) thay vì ES6 modules
- MongoDB là **optional** - nếu không có `MONGO_URI` bot vẫn chạy bình thường (không lưu stats)
- Tất cả handlers đều **auto-load** files đệ quy
- Slash commands tự động đăng ký khi bot `ready`

## 🆘 Xử lý lỗi

### Lỗi: "Missing Access"
- Kiểm tra bot có quyền `Send Messages`, `Embed Links` trong channel

### Lỗi: "Unknown interaction"
- Slash commands có thể mất 1-5 phút để đồng bộ toàn cầu
- Xóa cache Discord (Ctrl+R) hoặc đợi

### Lỗi kết nối MongoDB
- Kiểm tra MongoDB đã chạy: `mongod`
- Hoặc comment dòng `MONGO_URI` trong `.env` để chạy không cần DB

## 📄 License

MIT © VietProDev

---

**Made with ❤️ by VietProDev Team**


Fetching credentials is covered in detail in the [getting started guide](https://discord.com/developers/docs/getting-started).

> 🔑 Environment variables can be added to the `.env` file in Glitch or when developing locally, and in the Secrets tab in Replit (the lock icon on the left).

### Install slash commands

The commands for the example app are set up in `commands.js`. All of the commands in the `ALL_COMMANDS` array at the bottom of `commands.js` will be installed when you run the `register` command configured in `package.json`:

```
npm run register
```

### Run the app

After your credentials are added, go ahead and run the app:

```
node app.js
```

> ⚙️ A package [like `nodemon`](https://github.com/remy/nodemon), which watches for local changes and restarts your app, may be helpful while locally developing.

If you aren't following the [getting started guide](https://discord.com/developers/docs/getting-started), you can move the contents of `examples/app.js` (the finished `app.js` file) to the top-level `app.js`.

### Set up interactivity

The project needs a public endpoint where Discord can send requests. To develop and test locally, you can use something like [`ngrok`](https://ngrok.com/) to tunnel HTTP traffic.

Install ngrok if you haven't already, then start listening on port `3000`:

```
ngrok http 3000
```

You should see your connection open:

```
Tunnel Status                 online
Version                       2.0/2.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://1234-someurl.ngrok.io -> localhost:3000

Connections                  ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

Copy the forwarding address that starts with `https`, in this case `https://1234-someurl.ngrok.io`, then go to your [app's settings](https://discord.com/developers/applications).

On the **General Information** tab, there will be an **Interactions Endpoint URL**. Paste your ngrok address there, and append `/interactions` to it (`https://1234-someurl.ngrok.io/interactions` in the example).

Click **Save Changes**, and your app should be ready to run 🚀

## Other resources
- Read **[the documentation](https://discord.com/developers/docs/intro)** for in-depth information about API features.
- Browse the `examples/` folder in this project for smaller, feature-specific code examples
- Join the **[Discord Developers server](https://discord.gg/discord-developers)** to ask questions about the API, attend events hosted by the Discord API team, and interact with other devs.
- Check out **[community resources](https://discord.com/developers/docs/topics/community-resources#community-resources)** for language-specific tools maintained by community members.
