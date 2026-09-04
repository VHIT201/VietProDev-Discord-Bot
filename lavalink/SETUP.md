# Hướng dẫn cài đặt Lavalink v4

## Yêu cầu
- **Java 17+** (JDK hoặc JRE)
- **RAM tối thiểu 512MB** cho Lavalink

## Bước 1: Cài Java 17

### Windows
```powershell
winget install Microsoft.OpenJDK.17
```

### Linux (Ubuntu/Debian)
```bash
sudo apt install openjdk-17-jre
```

Kiểm tra:
```bash
java -version
```

## Bước 2: Tải Lavalink

```powershell
cd lavalink
Invoke-WebRequest -Uri "https://github.com/lavalink-devs/Lavalink/releases/latest/download/Lavalink.jar" -OutFile "Lavalink.jar"
```

## Bước 3: Tải youtube-source plugin

```powershell
cd lavalink/plugins
Invoke-WebRequest -Uri "https://github.com/lavalink-devs/youtube-source/releases/download/v1.18.1/youtube-plugin-1.18.1.jar" -OutFile "youtube-plugin-1.18.1.jar"
```

## Bước 4: Cấu hình .env

Thêm vào file `.env`:
```env
LAVALINK_HOST=127.0.0.1
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass
LAVALINK_SECURE=false
```

## Bước 5: Chạy Lavalink

```powershell
cd lavalink
java -jar Lavalink.jar
```

Lavalink sẽ chạy ở `http://localhost:2333`

## Bước 6: Chạy bot

```powershell
# Terminal 1: Chạy Lavalink
cd lavalink
java -jar Lavalink.jar

# Terminal 2: Chạy bot
npm run dev
```

## Lưu ý

- Lavalink **phải chạy trước** khi bot khởi động
- Plugin `youtube-source` giúp bypass một số hạn chế của YouTube
- Nếu chạy production, nên dùng PM2 cho Lavalink
