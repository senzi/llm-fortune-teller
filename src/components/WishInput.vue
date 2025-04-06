<script setup>
import { ref, computed } from 'vue';

// 定义组件事件
const emit = defineEmits(['submit']);

// 愿望输入
const wishInput = ref('');
const isSubmitting = ref(false);
const maxLength = 50;

// 示例愿望列表
const exampleWishes = [
  '希望身体健康',
  '希望顺利转行',
  '希望关系更亲密'
];

// 处理提交
function handleSubmit() {
  if (!wishInput.value.trim() || isSubmitting.value) return;
  if (wishInput.value.length > maxLength) return;
  
  isSubmitting.value = true;
  emit('submit', wishInput.value);
  
  // 重置状态（实际提交后会由父组件控制流程）
  setTimeout(() => {
    isSubmitting.value = false;
  }, 500);
}

// 填充示例愿望
function fillExampleWish(wish) {
  wishInput.value = wish;
}

// 计算剩余字数
const remainingChars = computed(() => {
  return maxLength - wishInput.value.length;
});
</script>

<template>
  <div class="wish-input-container">
    <h2 class="input-title">写下你的愿望</h2>
    
    <div class="input-wrapper">
      <input
        v-model="wishInput"
        type="text"
        class="wish-input"
        placeholder="请输入您的愿望..."
        :maxlength="maxLength"
        @keyup.enter="handleSubmit"
      />
      <span class="char-counter" :class="{ 'warning': remainingChars < 10 }">
        {{ remainingChars }}
      </span>
    </div>
    
    <button 
      @click="handleSubmit" 
      class="submit-button"
      :disabled="!wishInput.trim() || wishInput.length > maxLength || isSubmitting"
    >
      <span v-if="!isSubmitting">抽签</span>
      <span v-else class="loading-dots">抽签中<span>.</span><span>.</span><span>.</span></span>
    </button>
    
    <div class="examples-container">
      <p class="examples-title">示例：</p>
      <div class="examples-list">
        <button 
          v-for="(wish, index) in exampleWishes" 
          :key="index"
          @click="fillExampleWish(wish)"
          class="example-item"
        >
          {{ wish }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wish-input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.input-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.input-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 16px;
}

.wish-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.wish-input:focus {
  outline: none;
  border-color: #42b883;
}

.char-counter {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: #999;
}

.char-counter.warning {
  color: #e53935;
}

.submit-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  min-width: 120px;
}

.submit-button:hover:not(:disabled) {
  background-color: #369a6e;
}

.submit-button:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
}

.examples-container {
  margin-top: 24px;
  width: 100%;
}

.examples-title {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
  text-align: center;
}

.examples-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.example-item {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}

.example-item:hover {
  background-color: #e0f2f1;
  border-color: #80cbc4;
  color: #00796b;
}

/* 加载动画 */
.loading-dots span {
  animation: loadingDots 1.4s infinite;
  animation-fill-mode: both;
  margin-left: 2px;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loadingDots {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

@media (max-width: 768px) {
  .wish-input {
    font-size: 0.9rem;
  }
  
  .submit-button {
    font-size: 0.9rem;
    padding: 10px 20px;
  }
}
</style>
