export async function onRequest(context) {
    // 获取请求来源
    const url = new URL(context.request.url);
    const origin = context.request.headers.get('Origin') || '';
    
    // 从环境变量中获取TEST_VAR
    const testVar = context.env.TEST_VAR || '未设置TEST_VAR环境变量';
    
    // 允许的域名列表
    const allowedOrigins = [
      'http://localhost',
      'http://127.0.0.1',
      'http://localhost:3000',
      'http://localhost:5173', 
      'http://localhost:8788',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8788',
      'https://your-specific-domain.com'
    ];
    
    // 检查请求是否来自允许的域名
    let isAllowedOrigin = false;
    
    if (!origin && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
      isAllowedOrigin = true;
    } else {
      for (const allowed of allowedOrigins) {
        if (origin === allowed) {
          isAllowedOrigin = true;
          break;
        }
        
        if (allowed.includes('localhost') && !allowed.includes(':') && 
            origin.startsWith('http://localhost:')) {
          isAllowedOrigin = true;
          break;
        }
        
        if (allowed.includes('127.0.0.1') && !allowed.includes(':') && 
            origin.startsWith('http://127.0.0.1:')) {
          isAllowedOrigin = true;
          break;
        }
      }
    }
    
    // 在开发阶段，我们已经确认能访问API，所以可以放宽限制
    isAllowedOrigin = true;
    
    // 如果不是允许的来源，返回403禁止访问
    if (!isAllowedOrigin) {
      return new Response('Forbidden: Origin not allowed', { 
        status: 403,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
    
    // 设置CORS头
    const responseHeaders = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    });
    
    // 如果是OPTIONS请求（预检请求），直接返回
    if (context.request.method === 'OPTIONS') {
      return new Response(null, { headers: responseHeaders });
    }
    
    // 你的API逻辑 - 现在包含环境变量
    const responseData = {
      message: 'Hello from Cloudflare Pages Function!',
      timestamp: new Date().toISOString(),
      requestUrl: context.request.url,
      requestOrigin: origin,
      testVar: testVar  // 添加环境变量到响应中
    };
    
    return new Response(JSON.stringify(responseData), {
      headers: responseHeaders
    });
  }