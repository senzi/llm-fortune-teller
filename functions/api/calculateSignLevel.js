// 简单哈希函数实现
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash); // 确保结果为正数
}

// 计算签等级函数
function calculateSignLevel(wish) {
  const now = new Date();
  const hourKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}`;
  const hashInput = `${wish.trim()}|${hourKey}`;
  const hash = simpleHash(hashInput);
  const mod = hash % 100;

  if (mod < 20) return "吉";    // 20%
  if (mod < 70) return "中";    // 50%
  return "平";                 // 30%
}

export async function onRequest(context) {
  // 获取请求来源
  const url = new URL(context.request.url);
  const origin = context.request.headers.get('Origin') || '';
  
  // 允许的域名列表 - 严格限制
  const allowedOrigins = [
    'https://lucky.closeai.moe',      // 生产域名
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
    
    // 如果用户愿望为空，返回错误
    if (!userWish.trim()) {
      return new Response(JSON.stringify({ error: '愿望内容不能为空' }), {
        status: 400,
        headers: responseHeaders
      });
    }
    
    // 计算签等级
    const level = calculateSignLevel(userWish);
    
    // 获取当前UTC时间（整点小时）
    const now = new Date();
    now.setUTCMinutes(0, 0, 0); // 设置为整点小时
    const timestamp = now.toISOString();
    
    // 返回结果
    return new Response(JSON.stringify({
      status: 'success',
      result: {
        level: level,
        timestamp: timestamp,
        wish: userWish
      }
    }), {
      headers: responseHeaders
    });
    
  } catch (error) {
    // 处理错误
    console.error('计算签等级时出错:', error);
    
    return new Response(JSON.stringify({
      status: 'error',
      message: '处理请求时发生错误',
      error: error.message
    }), {
      status: 500,
      headers: responseHeaders
    });
  }
}
