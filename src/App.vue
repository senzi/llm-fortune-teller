<script setup>
import { ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue'

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
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />

  <div class="api-section">
    <button @click="callApi" :disabled="loading" class="api-button">
      {{ loading ? '加载中...' : '调用API' }}
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
</style>