export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      // 1. 尝试从 ASSETS 绑定中获取静态文件
      let response = await env.ASSETS.fetch(request);
      
      // 2. 如果找到了文件 (200) 或者缓存 (304)，直接返回
      if (response.status >= 200 && response.status < 400) {
        return response;
      }

      // 3. SPA 路由回退：如果是 404 且不是 API/文件请求，返回 index.html
      if (response.status === 404 && !url.pathname.startsWith('/api/') && !url.pathname.includes('.')) {
        return await env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
      }

      return response;
    } catch (e) {
      return new Response("Internal Error", { status: 500 });
    }
  },
};
