# Portainer 快速部署指南

## 方法 1: 使用 Portainer Stacks（最快 - 推荐）

### 步骤：

1. **登录 Portainer**
   - 打开浏览器访问：`http://100.103.96.123:9443`
   - 登录你的 Portainer 账号

2. **创建 Stack**
   - 在左侧菜单点击 **"Stacks"**
   - 点击 **"Add stack"** 按钮
   - 输入 Stack 名称：`kids-typing-game`

3. **选择部署方式**
   - 选择 **"Web editor"** 标签
   - 将下面的 `docker-compose.yml` 内容复制粘贴进去

4. **配置环境变量（可选）**
   - 如果需要修改端口，可以在 Web editor 中修改 `ports` 部分
   - 默认端口是 `3001:3001`

5. **部署**
   - 点击 **"Deploy the stack"** 按钮
   - Portainer 会自动构建镜像并启动容器

6. **访问应用**
   - 部署完成后，访问：`http://100.103.96.123:3001`

---

## 方法 2: 使用 Git Repository（适合代码更新）

### 步骤：

1. **准备 Git 仓库**
   - 将代码推送到 Git 仓库（GitHub、GitLab 等）
   - 或者使用 Portainer 的文件上传功能

2. **在 Portainer 中创建 Stack**
   - 点击 **"Stacks"** → **"Add stack"**
   - 选择 **"Repository"** 标签
   - 输入仓库 URL
   - 选择分支（通常是 `main` 或 `master`）
   - 输入 Compose 文件路径：`docker-compose.yml`

3. **部署**
   - 点击 **"Deploy the stack"**

---

## 方法 3: 使用 Portainer 的 Container 功能（手动部署）

### 步骤：

1. **构建镜像**
   - 在 Portainer 中，点击 **"Images"**
   - 点击 **"Build a new image"**
   - 选择 **"Upload"** 或 **"Repository"**
   - 如果使用上传，需要先打包项目为 tar.gz

2. **创建容器**
   - 点击 **"Containers"** → **"Add container"**
   - 输入容器名称：`kids-typing-game`
   - 选择镜像：`kids-typing-game:latest`
   - 配置端口映射：`3001:3001`
   - 设置环境变量：
     - `NODE_ENV=production`
     - `PORT=3001`
   - 点击 **"Deploy the container"**

---

## 推荐的 docker-compose.yml（用于 Portainer Web Editor）

```yaml
version: '3.8'

services:
  typing-game:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: kids-typing-game
    restart: unless-stopped
    ports:
      - "3001:3001"  # 格式: "主机端口:容器端口"
    environment:
      - NODE_ENV=production
      - PORT=3001
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

**注意**：如果使用 Portainer Web Editor，你需要先上传项目文件，或者使用 Git Repository 方式。

---

## 最快的方法（如果代码已经在 NAS 上）

如果你已经将项目文件上传到 NAS：

1. **通过 Portainer 终端构建**
   - 在 Portainer 中，点击 **"Containers"** → **"Add container"**
   - 选择 **"Advanced mode"**
   - 在 **"Command"** 部分，选择 **"Console"**
   - 或者直接使用 Portainer 的 **"Stacks"** → **"Add stack"** → **"Repository"**
   - 如果文件在本地文件系统，选择 **"Custom path"** 并指定项目路径

2. **使用 Portainer 的 File Browser**
   - 在 Portainer 中，找到 **"Volumes"** 或使用文件浏览器
   - 上传项目文件到 NAS
   - 然后在 Stacks 中使用 **"Custom path"** 指向该目录

---

## 使用 Git Repository（推荐用于持续更新）

### 步骤：

1. **将代码推送到 Git 仓库**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **在 Portainer 中创建 Stack**
   - 点击 **"Stacks"** → **"Add stack"**
   - 选择 **"Repository"** 标签
   - 填写：
     - **Repository URL**: `https://github.com/你的用户名/piano-game.git`
     - **Repository reference**: `main` 或 `master`
     - **Compose path**: `docker-compose.yml`
   - 点击 **"Deploy the stack"**

3. **后续更新**
   - 代码更新后，在 Portainer 的 Stack 页面
   - 点击 **"Editor"** → **"Pull and redeploy"**
   - 或者点击 **"Update the stack"**

---

## 故障排除

### 构建失败

- 检查 Portainer 日志
- 确保 Dockerfile 和 docker-compose.yml 路径正确
- 检查网络连接（如果需要下载依赖）

### 容器无法启动

- 检查端口是否被占用
- 查看容器日志：在 Portainer 中点击容器 → **"Logs"**
- 检查环境变量设置

### 无法访问应用

- 检查防火墙设置
- 确认端口映射正确
- 检查容器状态是否为 "Running"

---

## 快速部署检查清单

- [ ] 登录 Portainer (http://100.103.96.123:9443)
- [ ] 创建新 Stack
- [ ] 选择部署方式（Web Editor / Repository）
- [ ] 配置 docker-compose.yml
- [ ] 设置端口映射（默认 3001:3001）
- [ ] 部署 Stack
- [ ] 等待构建完成
- [ ] 访问 http://100.103.96.123:3001
- [ ] 测试应用功能

