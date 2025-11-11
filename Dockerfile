# 多阶段构建 Dockerfile
# 阶段 1: 构建前端
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

# 复制前端 package 文件
COPY client/package*.json ./

# 安装前端依赖（包括 devDependencies，因为构建需要）
# 如果 package-lock.json 存在则使用 npm ci，否则使用 npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# 复制前端源代码
COPY client/ ./

# 构建前端
RUN npm run build

# 阶段 2: 构建后端并运行
FROM node:18-alpine

WORKDIR /app

# 复制后端 package 文件
COPY package*.json ./

# 安装后端依赖
# 如果 package-lock.json 存在则使用 npm ci，否则使用 npm install
RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm install --only=production; fi

# 复制后端源代码
COPY server/ ./server/

# 从构建阶段复制前端构建文件
COPY --from=frontend-builder /app/client/build ./client/build

# 暴露端口（默认 3001，可通过环境变量修改）
EXPOSE 3001

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 启动应用
CMD ["node", "server/index.js"]

