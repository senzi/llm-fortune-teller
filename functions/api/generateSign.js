import OpenAI from "openai";

export async function onRequest(context) {
  // 获取请求来源
  const url = new URL(context.request.url);
  const origin = context.request.headers.get('Origin') || '';
  
  // 从环境变量中获取DeepSeek API密钥
  const deepseekApiKey = context.env.DEEPSEEK_API_KEY || '未设置DEEPSEEK_API_KEY环境变量';
  
  // 允许的域名列表 - 严格限制
  const allowedOrigins = [
    'https://lucky.closeai.moe',      // 生产域名
    'https://deepluck.closeai.moe',   // 备选生产域名
    'http://127.0.0.1:8788',          // 本地开发服务器
    'http://localhost:8788'           // 本地开发服务器备选
    // 可以添加其他必要的域名
  ];
  
  // 检查请求是否来自允许的域名
  let isAllowedOrigin = false;
  
  // 如果请求没有Origin头（如直接curl请求），检查Referer头
  if (!origin) {
    const referer = context.request.headers.get('Referer') || '';
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        // 检查referer是否在允许列表中
        for (const allowed of allowedOrigins) {
          if (refererUrl.origin === allowed) {
            isAllowedOrigin = true;
            break;
          }
        }
      } catch (e) {
        // 如果referer不是有效URL，忽略错误
      }
    }
    
    // 如果没有Origin也没有有效的Referer，默认拒绝访问
    // 除了在开发环境：如果请求直接来自本地开发服务器
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      isAllowedOrigin = true;
    }
  } else {
    // 检查Origin是否在允许列表中
    for (const allowed of allowedOrigins) {
      if (origin === allowed) {
        isAllowedOrigin = true;
        break;
      }
    }
  }
  
  // 如果不是允许的来源，返回403禁止访问
  if (!isAllowedOrigin) {
    return new Response('Forbidden: Origin not allowed', { 
      status: 403,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
  
  // 设置CORS头 - 只允许特定来源，而不是通配符
  const responseHeaders = new Headers({
    'Access-Control-Allow-Origin': origin || allowedOrigins[0], // 只允许匹配的来源
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  });
  
  // 如果是OPTIONS请求（预检请求），直接返回
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: responseHeaders });
  }
  
  // 确保请求方法是POST
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: '只接受POST请求' }), {
      status: 405,
      headers: responseHeaders
    });
  }
  
  try {
    // 解析请求体
    const requestData = await context.request.json();
    const userWish = requestData.wish || '';
    const signLevel = requestData.level || '';
    
    // 验证必填参数
    if (!userWish.trim()) {
      return new Response(JSON.stringify({ error: '缺少必要参数: wish' }), {
        status: 400,
        headers: responseHeaders
      });
    }
    
    if (!signLevel.trim() || !['吉', '中', '平'].includes(signLevel)) {
      return new Response(JSON.stringify({ error: '缺少必要参数或参数不合法: level (应为"吉"、"中"或"平")' }), {
        status: 400,
        headers: responseHeaders
      });
    }
    
    // 签文生成的prompt模板
    const prompt_generate_sign = `
你是一位签文生成大师，拥有两种人格风格：

1. 古风签师：你以传统签诗为灵感，风格古典含蓄，善用意象与比喻，强调模糊的命运暗示。
2. 灵动签灵：你风趣幽默，语言现代、有点中二但温柔正能量，贴近现代生活，鼓励人心。

请根据用户的愿望内容和签等级，生成以下结构内容：

用户愿望内容：
${userWish}

签等级：
${signLevel}（值为：吉 / 中 / 平）

输出内容应包括以下字段，结构如下（必须为 JSON 格式）：

{
  "confirmed_wish": "对用户愿望的简洁复述，风格温柔，适合放在卡片上展示。",
  "level": "${signLevel}",
  "sign_text": {
    "classic": "一句古风签诗，五言或七言，注意意境和象征，语气与等级一致。",
    "modern": "一句现代签语，可以稍微幽默、中二、灵动，但不浮夸，符合签等级。"
  },
  "interpretation": {
    "classic": "对古风签文的解读，模糊含蓄，用古文语气或文雅表达。",
    "modern": "对白话签的解读，风格轻松直接，可带一点劝导、共鸣感。"
  },
  "tone": "一句总结性的风格描述，例如：努力见曙光型、谨慎前行型、天时地利型等。"
}

风格规范：
- "吉"：充满鼓舞与正面预期。
- "中"：提醒努力、保持信心、静待时机。
- "平"：委婉表达当前停滞，鼓励心态调整与反思，不得使用悲观、诅咒类字眼。
`;
    
    // 从环境变量中获取DeepSeek API基础URL
    const deepseekApiBaseUrl = context.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com';
    
    // 调用DeepSeek API
    const openai = new OpenAI({
      baseURL: deepseekApiBaseUrl,
      apiKey: deepseekApiKey
    });
    
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt_generate_sign }],
      model: "deepseek-chat",
      response_format: { type: "json_object" }
    });
    
    // 解析API响应
    const result = JSON.parse(completion.choices[0].message.content);
    
    // 返回生成结果
    return new Response(JSON.stringify({
      status: 'success',
      result: result
    }), {
      headers: responseHeaders
    });
    
  } catch (error) {
    // 处理错误
    console.error('生成签文时出错:', error);
    
    return new Response(JSON.stringify({
      status: 'error',
      message: '生成签文失败',
      error: error.message
    }), {
      status: 500,
      headers: responseHeaders
    });
  }
}
