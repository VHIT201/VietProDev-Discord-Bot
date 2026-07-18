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
# Tải Lavalink.jar vào thư mục lavalink/
cd lavalink

# Tải bản mới nhất từ GitHub Releases
# https://github.com/lavalink-devs/Lavalink/releases
# Tải file Lavalink.jar
```

Hoặc dùng PowerShell:
```powershell
Invoke-WebRequest -Uri "https://github.com/lavalink-devs/Lavalink/releases/latest/download/Lavalink.jar" -OutFile "Lavalink.jar"
```

## Bước 3: Cấu hình

1. Chỉnh sửa file `application.yml`:
   - Đổi `password` thành mật khẩu mạnh của bạn
   - Cập nhật Spotify Client ID/Secret (lấy từ https://developer.spotify.com/dashboard)
   - Bật `spotify: true` trong phần `lavasrc.sources` nếu dùng Spotify

2. Thêm vào file `.env` của bot:
```env
LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass
```

## Bước 4: Chạy Lavalink

```powershell
cd lavalink
java -jar Lavalink.jar
```

Lavalink sẽ chạy ở `http://localhost:2333`

## Bước 5: Chạy bot

```powershell
# Terminal 1: Chạy Lavalink
cd lavalink
java -jar Lavalink.jar

# Terminal 2: Chạy bot
npm run dev
```

## Lưu ý

- Lavalink **phải chạy trước** khi bot khởi động
- Spotify **không phát trực tiếp** — Lavalink lấy metadata từ Spotify rồi tìm bản tương ứng trên YouTube để phát
- Plugin `youtube-source` giúp bypass một số hạn chế của YouTube (age-restriction, etc.)
- Nếu chạy production, nên dùng PM2 hoặc Docker cho Lavalink

## Docker (optional)

```yaml
# docker-compose.yml
version: '3'
services:
  lavalink:
    image: ghcr.io/lavalink-devs/lavalink:4
    container_name: lavalink
    ports:
      - "2333:2333"
    volumes:
      - ./application.yml:/opt/Lavalink/application.yml
    restart: unless-stopped
```

```bash
docker compose up -d
```
