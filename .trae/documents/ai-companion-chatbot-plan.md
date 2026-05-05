## 摘要

做一个面向“孤独、需要倾诉”的用户的 AI 陪伴聊天 Web 应用（学习 vibe coding）。范围仅包含：页面设计、注册/登录（邮箱+密码）、与 AI 对话（OpenAI 兼容 API）；不做聊天记录持久化与其它功能。界面语言为中文，视觉风格为“温柔治愈”，AI 角色为“陪伴型倾听者”，并在检测到自伤/危机内容时显示危机求助提示。

---

## 当前状态分析（基于仓库实际情况）

- 当前工作区几乎为空，仅存在 [test](file:///workspace/test) 文件。
- 未检测到现有前端/后端工程结构（无 package.json、无源码目录）。
- 因此需要从 0 搭建一个全栈 Web 项目（前端 + 轻量后端 API）。

---

## 目标与验收标准

- 用户可以注册账号（邮箱+密码），并使用该账号登录/退出。
- 登录后进入聊天页：
  - 输入消息，获得 AI 回复（通过 OpenAI 兼容 API）。
  - 页面有明显“陪伴/鼓励”的氛围与文案，且整体视觉为温柔治愈风格。
- 不保存聊天记录：刷新页面后对话清空（最多可做“当前会话内的临时渲染”）。
- 安全边界：当用户消息包含自伤/危机暗示时，UI 必须显示危机提示组件（本地检测即可，不依赖模型判断）。
- 基础工程可本地启动，具备最小可用的环境变量配置说明。

---

## 方案与关键决策（已锁定）

- 前端/全栈框架：Next.js（App Router）+ TypeScript
  - 原因：学习成本可控；路由/页面/接口（Route Handlers）一体化，适合快速做“注册/登录 + 聊天 API”。
- UI 样式：Tailwind CSS（不引入复杂组件库，保持学习过程可控）
- 字体与视觉：使用更具“治愈感”的中文字体组合（例如：标题偏宋/衬线，正文偏圆润黑体；具体以 Google Fonts 可用字体为准），整体浅色基调 + 柔和渐变/噪点纹理 + 细腻动效。
- 账号体系：邮箱+密码
  - 密码采用强哈希（bcrypt 或等价方案），不记录明文，不在日志中输出敏感字段。
  - 登录态采用 HttpOnly Cookie 的会话（或签名 cookie）机制。
- 数据库：SQLite（仅存用户表与必要的会话/refresh 信息；不存聊天记录）
- AI 接口：OpenAI 兼容 API
  - 通过环境变量配置：API Base URL（可选）与 API Key（必须）。
  - 服务端统一代理调用，前端不直接暴露 Key。
- 危机提示：在前端对输入做关键字/正则检测（例如“想死/自杀/活不下去/割腕”等），触发时展示固定的求助提示卡片/弹窗，同时仍允许继续聊天（不做强制拦截）。

---

## 拟实现的页面与路由

- `/`：落地页
  - 产品定位、隐私与边界提示（“非专业医疗建议”等）、CTA（登录/注册/开始聊天）。
- `/auth/register`：注册页（邮箱、密码、确认密码）
- `/auth/login`：登录页（邮箱、密码）
- `/chat`：聊天页
  - 左侧（或顶部）显示轻量用户信息与退出按钮
  - 中间对话区（气泡/卡片式）
  - 底部输入框 + 发送按钮 + Enter 发送
  - 危机提示组件：检测触发后置顶展示或弹窗展示

---

## 后端接口（Route Handlers）设计

以 Next.js Route Handlers 为例（实际文件路径以 Next.js 约定为准）：

- `POST /api/auth/register`
  - 入参：`{ email, password }`
  - 行为：校验邮箱格式与密码强度 → bcrypt 哈希 → 写入 users 表（email 唯一）→ 返回成功
- `POST /api/auth/login`
  - 入参：`{ email, password }`
  - 行为：校验 → 对比哈希 → 写入/更新会话 → 设置 HttpOnly cookie → 返回成功
- `POST /api/auth/logout`
  - 行为：清除 cookie / 失效会话
- `POST /api/chat`
  - 入参：`{ messages: [{ role: 'user'|'assistant'|'system', content: string }] }`
  - 行为：
    - 校验已登录（无登录则 401）
    - 注入 system prompt（陪伴型倾听者、鼓励支持、避免医疗诊断等）
    - 代理调用 OpenAI 兼容 API（base url + key 来自 env）
    - 回传 assistant 消息文本

---

## 数据模型（SQLite）

最小化设计（仅为账号与会话服务）：

- `users`
  - `id`（uuid 或自增）
  - `email`（unique）
  - `password_hash`
  - `created_at`
- `sessions`（可选，取决于会话方案）
  - `id`
  - `user_id`
  - `expires_at`
  - `created_at`

说明：不保存 chat messages。

---

## 关键实现细节（避免后续再做选择）

### 鉴权中间层

- 在服务端提供一个读取 session 的 helper（从 cookie 解析 session id / token）。
- 在 `/chat` 页面加载时进行一次“是否已登录”的校验：
  - 未登录：重定向到 `/auth/login`
  - 已登录：渲染聊天 UI

### AI System Prompt（陪伴型倾听者）

- 基调：共情、接纳、温柔鼓励、帮助用户命名情绪、给出可执行的小步骤建议（非命令式）。
- 约束：不进行医疗/法律等专业诊断；遇到危机内容时建议联系专业帮助，并尊重用户感受。

### 危机提示（UI 层）

- 触发规则：用户消息命中关键词/正则即触发（可维护一个小词表）。
- 展示内容：
  - “如果你正在经历强烈的痛苦/有伤害自己的想法，你并不孤单……”
  - “请优先联系身边可信赖的人/专业机构/当地紧急求助电话”等通用措辞
  - 不在文档里硬编码特定地区号码（避免不准确）；以“当地紧急求助电话/心理援助热线”描述为主

---

## 具体改动清单（按文件/目录）

以下为将要创建的主要结构（示例，执行时按脚手架实际生成）：

- `package.json`：Next.js + TS + Tailwind + SQLite 驱动 + bcrypt 等依赖
- `.env.example`：示例环境变量（不提交真实 key）
- `src/app/`：
  - `page.tsx`（落地页）
  - `auth/login/page.tsx`
  - `auth/register/page.tsx`
  - `chat/page.tsx`
  - `api/auth/register/route.ts`
  - `api/auth/login/route.ts`
  - `api/auth/logout/route.ts`
  - `api/chat/route.ts`
- `src/lib/`：
  - `db.ts`（SQLite 连接与初始化）
  - `auth.ts`（session 读写、cookie 工具）
  - `openai.ts`（OpenAI 兼容 API 调用封装）
  - `crisis.ts`（危机关键词匹配工具）
- `src/components/`：
  - `AuthForm.tsx`
  - `ChatComposer.tsx`
  - `ChatMessageList.tsx`
  - `CrisisBanner.tsx`

---

## 安全与隐私注意事项（学习项目也要做到）

- 不在前端暴露 API Key；AI 调用必须由服务端代理。
- 密码只存 hash，不打印日志；接口报错不回显“邮箱是否存在”等过多信息（避免枚举）。
- Cookie 设置 `HttpOnly`、`Secure(生产)`、`SameSite=Lax`。
- 不做聊天记录落盘，减少隐私数据留存。

---

## 验证步骤（执行阶段要跑的检查）

- 安装依赖后，启动开发服务器，检查：
  - `/` 落地页正常显示（中文文案、治愈风格）
  - 注册成功 → 登录成功 → 进入 `/chat`
  - 未登录直接访问 `/chat` 会被重定向到 `/auth/login`
  - 发送消息可得到 AI 回复（在配置了 env 的前提下）
  - 输入命中危机关键词时，危机提示组件出现
- 运行类型检查与 lint（如工程默认提供）

