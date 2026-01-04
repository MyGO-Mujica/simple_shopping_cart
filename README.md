# 购物车系统 - Web 大作业

## 项目简介

基于 Vue 3 + TypeScript + Element Plus 开发的前后端分离购物车系统，实现了用户注册登录、商品浏览、购物车管理、订单生成等完整的电商核心功能。

## 技术栈

### 前端框架
- **Vue 3.5** - 采用 Composition API 和 `<script setup>` 语法
- **TypeScript 5.9** - 类型安全的开发体验
- **Vite 7.2** - 快速的构建工具

### UI 组件库
- **Element Plus 2.13** - 基于 Vue 3 的组件库

### 状态管理
- **Pinia 3.0** - Vue 3 官方推荐的状态管理库

### 路由管理
- **Vue Router 4.6** - 单页面应用路由

### HTTP 请求
- **Axios 1.13** - Promise 基础的 HTTP 客户端

## 功能特性

### 1. 用户系统
- ✅ 用户注册 - 新用户账号创建
- ✅ 用户登录 - 身份验证和会话管理
- ✅ 登录状态持久化 - 使用 localStorage 保存用户信息

### 2. 商品管理
- ✅ 商品列表展示 - 分页显示商品信息
- ✅ 商品搜索 - 支持按商品名称模糊搜索
- ✅ 商品详情 - 显示商品图片、价格等信息

### 3. 购物车功能
- ✅ 添加商品到购物车 - 支持后端数据同步
- ✅ 购物车列表查看 - 实时显示购物车内容
- ✅ 删除购物车商品 - 单个删除功能
- ✅ 商品数量显示 - 只读模式展示
- ✅ 购物车总额计算 - 自动计算选中商品总价

### 4. 订单系统
- ✅ 生成订单 - 从购物车多选商品生成订单
- ✅ 订单列表 - 查看所有历史订单
- ✅ 订单详情 - 显示订单商品明细和总额
- ✅ 订单时间格式化 - 友好的时间显示

## 项目结构

```
shopping-cart/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口封装
│   │   ├── index.ts      # Axios 实例配置
│   │   ├── user.ts       # 用户相关接口
│   │   ├── goods.ts      # 商品相关接口
│   │   ├── cart.ts       # 购物车相关接口
│   │   └── order.ts      # 订单相关接口
│   ├── assets/            # 静态资源文件
│   ├── components/        # 公共组件
│   ├── router/            # 路由配置
│   │   └── index.ts      # 路由定义
│   ├── stores/            # Pinia 状态管理
│   │   ├── user.ts       # 用户状态
│   │   └── cart.ts       # 购物车状态
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts      # 全局类型
│   ├── utils/             # 工具函数
│   │   └── request.ts    # HTTP 请求工具
│   ├── views/             # 页面组件
│   │   ├── Login.vue     # 登录页
│   │   ├── Register.vue  # 注册页
│   │   ├── Products.vue  # 商品列表页
│   │   ├── Cart.vue      # 购物车页
│   │   └── Orders.vue    # 订单列表页
│   ├── App.vue            # 根组件
│   ├── main.ts            # 入口文件
│   └── style.css          # 全局样式
├── index.html             # HTML 模板
├── package.json           # 项目依赖
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── README.md              # 项目说明

```

## 后端接口文档

### 基础配置
- **Base URL**: `http://10.60.81.45:8080`
- **前端代理**: `/api` → 后端服务器

### 用户接口

#### 1. 用户登录
```
GET /user/userLogin?name={username}&password={password}
```
**返回**: 用户信息 JSON 对象

#### 2. 用户注册
```
GET /user/userRegister?name={username}&password={password}
```
**返回**: 注册结果

### 商品接口

#### 3. 获取商品列表
```
GET /goods/list
```
**返回**: 商品数组

### 购物车接口

#### 4. 添加商品到购物车
```
GET /cart/add?userId={userId}&goodsId={goodsId}&num={num}&price={price}
```
**返回**: 更新后的购物车列表

#### 5. 获取购物车列表
```
GET /cart/listByUser?userId={userId}
```
**返回**: 当前用户购物车内容

#### 6. 删除购物车商品
```
GET /cart/deleteById?userId={userId}&cartId={cartId}
```
**返回**: 更新后的购物车列表

### 订单接口

#### 7. 创建订单
```
GET /order/addCastOrder?userId={userId}&cartList={cartList}
```
**参数**: cartList 为购物车项 ID 列表，用逗号分隔
**返回**: 用户所有订单列表

#### 8. 获取订单列表
```
GET /order/listByUser?userId={userId}
```
**返回**: 用户所有订单详情

## 安装和运行

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
cd shopping-cart
npm install
```

### 开发环境运行
```bash
npm run dev
```
访问: http://localhost:5173

### 生产环境构建
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 核心技术实现

### 1. 响应式状态管理
使用 Pinia 管理全局状态，包括用户登录信息和购物车数据。

### 2. HTTP 请求拦截
- 请求拦截器：统一添加请求头
- 响应拦截器：统一处理错误和数据格式

### 3. 路由守卫
保护需要登录的页面，自动重定向到登录页。

### 4. 数据格式处理
- JSON 字符串自动解析
- 后端格式错误修正
- 类型安全的数据转换

### 5. 组件化开发
采用 Vue 3 Composition API，代码逻辑清晰，易于维护。

## 项目亮点

1. **类型安全**: 全程使用 TypeScript，减少运行时错误
2. **状态持久化**: 用户信息本地存储，刷新页面不丢失
3. **数据同步**: 购物车和订单实时与后端同步
4. **用户体验**: Element Plus 提供美观的 UI 组件
5. **错误处理**: 完善的异常捕获和用户提示
6. **代码规范**: 遵循 Vue 3 官方最佳实践

## 开发说明

### 代理配置
在 `vite.config.ts` 中配置了开发服务器代理：
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://10.60.81.45:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 状态管理
使用 Pinia 进行状态管理，支持 TypeScript 类型推导和 DevTools 调试。


