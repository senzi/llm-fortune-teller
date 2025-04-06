<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 返回首页
function goHome() {
  router.push('/');
}
</script>

<template>
  <div class="error-container">
    <div class="error-card">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h2 class="error-title">内容审核未通过</h2>
      <p class="error-message">
        对不起，您的提交涉及不当内容。<br>我无法为您提供服务。
      </p>
      <p class="error-hint">
        请确保您的愿望内容符合社区规范。<br>不要包含敏感、不当或违规内容。
      </p>
      <button @click="goHome" class="home-button">
        返回首页
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.error-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 32px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.error-icon {
  color: #e53935;
  margin-bottom: 24px;
}

.error-title {
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 16px 0;
}

.error-message {
  font-size: 1.1rem;
  color: #555;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.error-hint {
  font-size: 0.9rem;
  color: #777;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.home-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.home-button:hover {
  background-color: #369a6e;
}

@media (max-width: 768px) {
  .error-card {
    padding: 24px;
  }
  
  .error-title {
    font-size: 1.3rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
}
</style>
