export async function onRequest(context) {
    // 获取请求来源
    const url = new URL(context.request.url);
    const origin = context.request.headers.get('Origin') || '';
    
    // 从环境变量中获取TEST_VAR
    const testVar = context.env.TEST_VAR || '未设置TEST_VAR环境变量';
    
    // 允许的域名列表 - 严格限制
    const allowedOrigins = [
      'https://lucky.closeai.moe',      // 你的生产域名
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
    
    // 移除开发模式的覆盖，确保严格执行访问控制
    // isAllowedOrigin = true; // 删除或注释掉这行
    
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
    
    // 你的API逻辑
    const responseData = {
      message: 'Hello from Cloudflare Pages Function!',
      timestamp: new Date().toISOString(),
      requestUrl: context.request.url,
      requestOrigin: origin,
      testVar: testVar
    };
    
    return new Response(JSON.stringify(responseData), {
      headers: responseHeaders
    });
  }