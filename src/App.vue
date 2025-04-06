<script setup>
import { ref } from 'vue';

// Hello API 测试
const apiResponse = ref(null);
const loading = ref(false);
const error = ref(null);

async function callApi() {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch('/api/hello');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    apiResponse.value = await response.json();
  } catch (err) {
    error.value = err.message;
    console.error('API调用失败:', err);
  } finally {
    loading.value = false;
  }
}

// ValidateWish API 测试
const wishInput = ref('');
const wishResponse = ref(null);
const wishLoading = ref(false);
const wishError = ref(null);

async function validateWish() {
  wishLoading.value = true;
  wishError.value = null;
  try {
    const response = await fetch('/api/validateWish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wish: wishInput.value }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    wishResponse.value = await response.json();
  } catch (err) {
    wishError.value = err.message;
    console.error('验证愿望失败:', err);
  } finally {
    wishLoading.value = false;
  }
}
</script>

<template>
  <div class="api-section">
    <h2>测试 Hello API</h2>
    <button @click="callApi" :disabled="loading" class="api-button">
      {{ loading ? '加载中...' : '调用Hello API' }}
    </button>

    <div v-if="apiResponse" class="api-response">
      <h3>API响应:</h3>
      <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>

      <div class="env-var-display" v-if="apiResponse.testVar">
        <h4>环境变量:</h4>
        <p>TEST_VAR = {{ apiResponse.testVar }}</p>
      </div>
    </div>

    <div v-if="error" class="api-error">
      <p>错误: {{ error }}</p>
    </div>
  </div>

  <div class="api-section wish-section">
    <h2>测试 ValidateWish API</h2>
    <div class="wish-form">
      <textarea 
        v-model="wishInput" 
        placeholder="请输入您的愿望..." 
        :disabled="wishLoading"
        class="wish-input"
      ></textarea>
      <button 
        @click="validateWish" 
        :disabled="wishLoading || !wishInput.trim()" 
        class="api-button"
      >
        {{ wishLoading ? '验证中...' : '验证愿望' }}
      </button>
    </div>

    <div v-if="wishResponse" class="api-response">
      <h3>验证结果:</h3>
      <pre>{{ JSON.stringify(wishResponse, null, 2) }}</pre>
      
      <div v-if="wishResponse.result" class="wish-result" :class="wishResponse.result.category">
        <h4>审核结果: {{ wishResponse.result.category === 'allow' ? '通过' : '拒绝' }}</h4>
        <p>{{ wishResponse.result.reason }}</p>
      </div>
    </div>

    <div v-if="wishError" class="api-error">
      <p>错误: {{ wishError }}</p>
    </div>
  </div>
</template>

<style scoped>

.env-var-display {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #e3f2fd;
  border-radius: 4px;
  border-left: 4px solid #2196f3;
}

.env-var-display h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #0d47a1;
}

.env-var-display p {
  margin: 0;
  font-family: monospace;
  font-size: 1.1rem;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.api-section {
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.api-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.api-button:hover:not(:disabled) {
  background-color: #369a6e;
}

.api-button:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
}

.api-response {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-align: left;
}

.api-response pre {
  margin: 0;
  white-space: pre-wrap;
}

.api-error {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 4px;
}

/* 愿望验证相关样式 */
.wish-section {
  margin-top: 2rem;
}

.wish-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wish-input {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
}

.wish-result {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
}

.wish-result.allow {
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
}

.wish-result.block {
  background-color: #ffebee;
  border-left: 4px solid #f44336;
}

.wish-result h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.wish-result.allow h4 {
  color: #2e7d32;
}

.wish-result.block h4 {
  color: #c62828;
}

.wish-result p {
  margin: 0;
}
</style>
