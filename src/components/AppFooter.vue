<script setup>
// AppFooter.vue - 页面底部组件
</script>

<template>
  <footer class="app-footer">
    <div class="disclaimer">
      本项目由 AI 模型生成内容，仅供娱乐参考，不构成任何建议。使用模型：Deepseek LLM。
    </div>
    <div class="copyright">
      © 2025 DeepLuck | 开源项目地址：
      <a href="https://github.com/senzi/llm-fortune-teller" target="_blank">
        GitHub - senzi/llm-fortune-teller
      </a>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 2rem;
  padding: 1.5rem 0;
  background-color: rgba(255, 255, 255, 0.7);
  color: #999;
  font-size: 12px;
  text-align: center;
  width: 100%;
}

.disclaimer {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.copyright {
  line-height: 1.5;
}

.copyright a {
  color: #999;
  text-decoration: underline;
}

.copyright a:hover {
  color: #666;
}

@media (max-width: 768px) {
  .app-footer {
    padding: 1rem 10px;
  }
}
</style>
