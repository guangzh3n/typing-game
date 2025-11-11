# 部署指南

## Docker 部署（推荐 - 适用于 NAS）

### 前置要求

- Docker 和 Docker Compose 已安装
- 端口 3001 可用（可在 docker-compose.yml 中修改）

### 快速开始

1. **克隆或下载项目到你的 NAS**

```bash
cd /path/to/your/projects
git clone <your-repo-url> piano-game
cd piano-game
```

2. **使用 Docker Compose 启动**

```bash
# 构建并启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止容器
docker-compose down
```

3. **访问应用**

打开浏览器访问：`http://你的NAS IP:3001`

### 自定义配置

#### 修改端口

编辑 `docker-compose.yml`，修改端口映射：

```yaml
ports:
  - "8080:3001"  # 将主机端口改为 8080
```

#### 使用自定义域名

如果你有反向代理（如 Nginx、Traefik），可以：

1. 修改 `docker-compose.yml` 添加标签（以 Traefik 为例）：

```yaml
services:
  typing-game:
    # ... 其他配置
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.typing-game.rule=Host(`typing.yourdomain.com`)"
      - "traefik.http.routers.typing-game.entrypoints=websecure"
      - "traefik.http.routers.typing-game.tls.certresolver=letsencrypt"
```

2. 或者使用 Nginx 反向代理：

```nginx
server {
    listen 80;
    server_name typing.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 手动构建 Docker 镜像

如果你想手动构建镜像：

```bash
# 构建镜像
docker build -t kids-typing-game:latest .

# 运行容器
docker run -d \
  --name kids-typing-game \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  --restart unless-stopped \
  kids-typing-game:latest
```

### 更新应用

```bash
# 停止当前容器
docker-compose down

# 重新构建镜像（如果有代码更新）
docker-compose build --no-cache

# 启动新容器
docker-compose up -d
```

### 查看日志

```bash
# 实时查看日志
docker-compose logs -f

# 查看最近 100 行日志
docker-compose logs --tail=100
```

### 故障排除

#### 容器无法启动

```bash
# 查看容器状态
docker-compose ps

# 查看详细日志
docker-compose logs typing-game

# 检查端口是否被占用
netstat -tuln | grep 3001
# 或
lsof -i :3001
```

#### 应用无法访问

1. 检查防火墙设置
2. 确认端口映射正确
3. 检查容器是否正在运行：`docker-compose ps`

#### 重新构建镜像

如果遇到构建问题，可以清理并重新构建：

```bash
# 停止并删除容器
docker-compose down

# 删除镜像
docker rmi kids-typing-game

# 清理构建缓存
docker builder prune

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

---

## cPanel 部署（传统方式）

### 快速部署步骤

### 1. 本地准备

```bash
# 1. 安装所有依赖
npm run install-all

# 2. 构建前端
cd client
npm run build
cd ..
```

### 2. 上传文件到 cPanel

使用 FTP 或 cPanel 文件管理器，将以下文件上传到你的网站目录（通常是 `public_html` 或子目录）：

```
piano-game/
├── server/
│   └── index.js
├── client/
│   └── build/          # 整个 build 目录
├── package.json
├── .env                # 需要创建，见下方
└── .htaccess           # 可选
```

### 3. 在 cPanel 中配置 Node.js

1. 登录 cPanel
2. 找到 **"Node.js Selector"** 或 **"Setup Node.js App"**
3. 点击 **"Create Application"**
4. 填写以下信息：
   - **Node.js Version**: 选择 18.x 或更高
   - **Application Mode**: Production
   - **Application Root**: `/home/你的用户名/public_html/你的应用目录`
   - **Application URL**: 选择你的域名或子域名
   - **Application Startup File**: `server/index.js`
5. 点击 **"Create"**

### 4. 设置环境变量

在 Node.js App 管理页面，添加以下环境变量：

```
NODE_ENV=production
PORT=3001
```

**注意**: cPanel 可能会自动分配端口，请检查实际分配的端口号。

### 5. 安装依赖和构建

在 Node.js App 管理页面，点击 **"Terminal"** 或使用 SSH，运行：

```bash
cd /home/你的用户名/public_html/你的应用目录
npm install
cd client
npm install
npm run build
cd ..
```

### 6. 修改服务器配置（如果需要）

如果 cPanel 分配的端口不是 3001，需要修改 `server/index.js`：

```javascript
const PORT = process.env.PORT || 3001; // 这会自动使用环境变量中的端口
```

### 7. 启动应用

在 Node.js App 管理页面，点击 **"Restart App"** 或 **"Start"**。

### 8. 配置静态文件服务

确保 `server/index.js` 中的生产环境配置正确：

```javascript
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}
```

## 故障排除

### 问题 1: 应用无法启动

- 检查 Node.js 版本是否支持（需要 14+）
- 检查 `server/index.js` 路径是否正确
- 查看 cPanel 错误日志

### 问题 2: API 请求失败

- 检查后端服务器是否运行
- 检查端口配置
- 检查 CORS 设置

### 问题 3: 静态文件无法加载

- 确保 `client/build` 目录已上传
- 检查 `server/index.js` 中的静态文件路径
- 检查文件权限

### 问题 4: 端口冲突

- cPanel 通常会分配特定端口
- 使用环境变量 `PORT` 来设置端口
- 检查 cPanel Node.js 应用设置中的端口号

## 替代方案：仅部署静态文件

如果 cPanel 不支持 Node.js，可以：

1. 将后端部署到其他服务（如 Heroku、Railway、Render）
2. 修改前端 API 地址指向后端服务
3. 只上传 `client/build` 目录到 cPanel

修改 `client/src/components/TypingGame.js`：

```javascript
const response = await fetch('https://your-backend-url.com/api/words?level=${selectedLevel}&count=20');
```

## 联系支持

如果遇到问题，请检查：
- cPanel 错误日志
- Node.js 应用日志
- 浏览器控制台错误
