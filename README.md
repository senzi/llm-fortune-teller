# LLM Fortune Teller

基于 Vue 3 + Vite 构建的愿望验证应用，使用 Cloudflare Pages Functions 和 DeepSeek API 进行内容审核。

## API 接口文档

### 1. 验证愿望接口 `/api/validateWish`

该接口用于验证用户提交的愿望内容是否合规，并返回审核结果。

#### 请求方法

- **URL**: `/api/validateWish`
- **Method**: POST
- **Content-Type**: application/json

#### 请求参数

| 参数名 | 类型   | 必填 | 描述         |
|--------|--------|------|--------------|
| wish   | string | 是   | 用户的愿望内容 |

#### 响应格式

```json
{
  "status": "success",
  "result": {
    "category": "allow" | "block",
    "reason": "内容健康，无需阻止" | "对不起，您的提交涉及不当内容，我无法为您提供服务。",
    "wish": "复述的用户愿望内容（如果category为block则为空）"
  }
}
```

#### 错误响应

```json
{
  "status": "error",
  "message": "处理请求时发生错误",
  "error": "错误详情"
}
```

或

```json
{
  "error": "愿望内容不能为空"
}
```

#### 验证规则

1. 愿望内容不能为空
2. 愿望长度不能超过 200 个字符（可在代码中调整 `MAX_WISH_LENGTH` 变量）
3. 内容审核规则：
   - 阻止（block）：涉及暴力、色情、违法犯罪、仇恨言论、政治敏感等内容
   - 允许（allow）：表达希望、梦想、善意、祝福、个人成长等健康内容

#### 示例请求

```bash
curl -X POST https://your-domain.com/api/validateWish \
  -H "Content-Type: application/json" \
  -d '{"wish": "希望明年能够顺利毕业，找到理想的工作"}'
```

#### 示例响应

```json
{
  "status": "success",
  "result": {
    "category": "allow",
    "reason": "内容健康，无需阻止",
    "wish": "希望明年能够顺利毕业，找到理想的工作"
  }
}
```

### 2. 签等级计算接口 `/api/calculateSignLevel`

该接口用于根据用户愿望和当前时间（精确到小时），计算本次请求对应的签等级。用于控制后续签文生成风格与语调。

#### 请求方法

- **URL**: `/api/calculateSignLevel`  
- **Method**: POST  
- **Content-Type**: application/json  

#### 请求参数

| 参数名 | 类型   | 必填 | 描述         |
|--------|--------|------|--------------|
| wish   | string | 是   | 用户的愿望内容 |

#### 签等级说明（固定三等级）

| 等级值 | 含义       |
|--------|------------|
| 吉     | 运势旺盛   |
| 中     | 运势平稳   |
| 平     | 运势略低，需努力 |

#### 响应格式

```json
{
  "status": "success",
  "result": {
    "level": "吉" | "中" | "平",
    "timestamp": "2025-04-06T14:00:00Z",
    "wish": "用户愿望内容"
  }
}
```

- `level`：根据愿望内容 + 当前小时生成的签等级  
- `timestamp`：当前 UTC 时间戳（整点小时，哈希参考值）  
- `wish`：原始愿望内容，用于前端校验与追踪展示

#### 错误响应

```json
{
  "status": "error",
  "message": "处理请求时发生错误",
  "error": "错误详情"
}
```

或

```json
{
  "error": "愿望内容不能为空"
}
```

#### 等级计算规则

签等级根据用户愿望内容和当前UTC时间（精确到小时）计算哈希值，然后按照以下比例分配：
- 吉：20%
- 中：50%
- 平：30%

#### 示例请求

```bash
curl -X POST https://your-domain.com/api/calculateSignLevel \
  -H "Content-Type: application/json" \
  -d '{"wish": "希望考试顺利通过"}'
```

#### 示例响应

```json
{
  "status": "success",
  "result": {
    "level": "中",
    "timestamp": "2025-04-06T09:00:00.000Z",
    "wish": "希望考试顺利通过"
  }
}
```

### 3. 生成签文接口 `/api/generateSign`

根据用户愿望内容和签等级，生成传统+现代风格的签文及对应解签，结构化输出。

#### 请求方法

- **URL**: `/api/generateSign`  
- **Method**: POST  
- **Content-Type**: application/json  

#### 请求参数

| 参数名 | 类型   | 必填 | 描述             |
|--------|--------|------|------------------|
| wish   | string | 是   | 用户的愿望内容     |
| level  | string | 是   | 签等级："吉"、"中" 或 "平" |

#### 响应格式

```json
{
  "status": "success",
  "result": {
    "confirmed_wish": "你希望身体健康，远离病痛。",
    "level": "中",
    "sign_text": {
      "classic": "云开半岭人未至，花落风前愿未圆。",
      "modern": "你是自己唯一的保底，只要还活着，就能回血翻盘。"
    },
    "interpretation": {
      "classic": "眼下进展平缓，未见转机，但终非止步。宜守静待时。",
      "modern": "眼下的生活像卡副本，但慢慢打怪也能过关。调整节奏，别自责。"
    },
    "tone": "中庸提醒型"
  }
}
```

#### 错误响应

```json
{
  "status": "error",
  "message": "生成签文失败",
  "error": "错误详情"
}
```

或

```json
{
  "error": "缺少必要参数"
}
```

#### 签文生成规则

签文生成基于以下风格规范：
- "吉"：充满鼓舞与正面预期。
- "中"：提醒努力、保持信心、静待时机。
- "平"：委婉表达当前停滞，鼓励心态调整与反思，不得使用悲观、诅咒类字眼。

签文包含两种风格：
1. 传统风格：古典含蓄，善用意象与比喻，强调模糊的命运暗示。
2. 现代风格：风趣幽默，语言现代、温柔正能量，贴近现代生活，鼓励人心。

#### 示例请求

```bash
curl -X POST https://your-domain.com/api/generateSign \
  -H "Content-Type: application/json" \
  -d '{"wish": "希望考试顺利通过", "level": "吉"}'
```

#### 示例响应

```json
{
  "status": "success",
  "result": {
    "confirmed_wish": "你希望考试顺利通过。",
    "level": "吉",
    "sign_text": {
      "classic": "春风得意马蹄疾，一举成名天下知。",
      "modern": "考试就像游戏副本，你已经满级满装备，这次必定一次通关。"
    },
    "interpretation": {
      "classic": "时运正佳，学业有成，他日必有锦绣前程。",
      "modern": "你的努力已经足够，这次考试将会顺利通过，相信自己的实力！"
    },
    "tone": "喜气洋洋型"
  }
}
```

### 4. Hello API 测试接口 `/api/hello`

该接口用于测试 Cloudflare Pages Functions 是否正常工作。

#### 请求方法

- **URL**: `/api/hello`
- **Method**: GET

#### 响应格式

```json
{
  "message": "Hello from Cloudflare Pages Function!",
  "timestamp": "2025-04-06T09:00:00.000Z",
  "requestUrl": "https://your-domain.com/api/hello",
  "requestOrigin": "https://your-domain.com",
  "testVar": "环境变量值"
}
```

## 环境变量配置

项目使用以下环境变量：

1. `TEST_VAR`: 测试环境变量，用于 `/api/hello` 接口
2. `DEEPSEEK_API_KEY`: DeepSeek API 密钥，用于 `/api/validateWish` 和 `/api/generateSign` 接口调用 DeepSeek API
3. `DEEPSEEK_API_BASE_URL`: DeepSeek API 基础URL，默认为 'https://api.deepseek.com'

请在 `.dev.vars` 文件中配置这些环境变量：

```
TEST_VAR=你的测试值
DEEPSEEK_API_KEY=你的DeepSeek API密钥
```

## 开发与部署

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev:api
```

### 构建生产版本

```bash
npm run build
```

### 部署到 Cloudflare Pages

将项目推送到 GitHub 仓库，然后在 Cloudflare Pages 中连接该仓库进行部署。
