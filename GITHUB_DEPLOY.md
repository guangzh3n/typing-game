# GitHub 部署到 Portainer 指南

## 快速部署步骤

### 1. 确保代码已推送到 GitHub

代码已经准备好推送到 GitHub。如果还没有推送，运行：

```bash
git push -u origin main
```

**注意**：如果遇到认证问题，你可能需要：
- 使用 GitHub Personal Access Token 作为密码
- 或者配置 SSH 密钥

### 2. 在 Portainer 中部署

1. **登录 Portainer**
   - 访问：`http://100.103.96.123:9443`
   - 登录你的账号

2. **创建 Stack**
   - 点击左侧菜单 **"Stacks"**
   - 点击 **"Add stack"** 按钮
   - 输入 Stack 名称：`kids-typing-game`

3. **配置 Repository**
   - 选择 **"Repository"** 标签
   - 填写以下信息：
     - **Repository URL**: `https://github.com/guangzh3n/typing-game.git`
     - **Repository reference**: `main`
     - **Compose path**: `docker-compose.yml`
   - 如果仓库是私有的，需要配置认证：
     - 点击 **"Authentication"**
     - 输入 GitHub 用户名和 Personal Access Token

4. **部署**
   - 点击 **"Deploy the stack"** 按钮
   - Portainer 会自动：
     - 克隆 GitHub 仓库
     - 构建 Docker 镜像
     - 启动容器

5. **访问应用**
   - 部署完成后，访问：`http://100.103.96.123:3001`

### 3. 后续更新

当代码更新后：

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```

2. **在 Portainer 中更新**
   - 进入 Stack 页面
   - 点击 **"Editor"** 标签
   - 点击 **"Pull and redeploy"** 按钮
   - 或者点击 **"Update the stack"**

## GitHub Personal Access Token（如果需要）

如果仓库是私有的，需要创建 Personal Access Token：

1. 访问 GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token (classic)"
3. 选择权限：至少需要 `repo` 权限
4. 生成并复制 token
5. 在 Portainer 的 Repository 配置中使用这个 token 作为密码

## 故障排除

### 构建失败

- 检查 Portainer 日志
- 确认 GitHub 仓库 URL 正确
- 确认分支名称正确（main 或 master）
- 确认 docker-compose.yml 文件在仓库根目录

### 认证失败

- 检查 GitHub 用户名和 token 是否正确
- 确认 token 有正确的权限
- 如果是公开仓库，可以尝试不使用认证

### 容器无法启动

- 查看容器日志：在 Portainer 中点击容器 → "Logs"
- 检查端口是否被占用
- 检查环境变量设置

