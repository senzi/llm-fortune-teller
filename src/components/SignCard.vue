<script setup>
import { ref } from 'vue';

// 接收签文数据作为prop
const props = defineProps({
  signData: {
    type: Object,
    required: true
  }
});

// 定义事件
const emit = defineEmits(['restart']);

// 显示模式：classic, modern, both
const displayMode = ref('classic');

// 切换显示模式
function toggleMode() {
  if (displayMode.value === 'classic') {
    displayMode.value = 'modern';
  } else if (displayMode.value === 'modern') {
    displayMode.value = 'both';
  } else {
    displayMode.value = 'classic';
  }
}

// 重新抽签
function handleRestart() {
  emit('restart');
}
</script>

<template>
  <div class="sign-card-container">
    <div class="sign-card" :class="props.signData.level">
      <!-- 愿望内容 -->
      <div class="wish-header">
        <h3 class="wish-text">{{ props.signData.confirmed_wish }}</h3>
        <div class="sign-level-badge">{{ props.signData.level }}</div>
      </div>
      
      <!-- 签文内容 - 经典模式 -->
      <div v-if="displayMode === 'classic' || displayMode === 'both'" class="sign-content classic">
        <div class="sign-text">
          <h4 class="content-title">签文</h4>
          <p class="text-content">{{ props.signData.sign_text.classic }}</p>
        </div>
        
        <div class="sign-interpretation">
          <h4 class="content-title">解签</h4>
          <p class="text-content">{{ props.signData.interpretation.classic }}</p>
        </div>
      </div>
      
      <!-- 签文内容 - 现代模式 -->
      <div v-if="displayMode === 'modern' || displayMode === 'both'" class="sign-content modern">
        <div class="sign-text">
          <h4 class="content-title">签文</h4>
          <p class="text-content">{{ props.signData.sign_text.modern }}</p>
        </div>
        
        <div class="sign-interpretation">
          <h4 class="content-title">解签</h4>
          <p class="text-content">{{ props.signData.interpretation.modern }}</p>
        </div>
      </div>
      
      <!-- 签文风格 -->
      <div class="sign-tone">
        <span class="tone-label">{{ props.signData.tone }}</span>
      </div>
      
      <!-- 免责声明 -->
      <div class="disclaimer">
        本签文由AI生成，仅供娱乐参考，不构成任何建议。使用模型：Deepseek LLM。
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button @click="toggleMode" class="toggle-button">
        切换风格 ({{ displayMode }})
      </button>
      <button @click="handleRestart" class="restart-button">
        再抽一次
      </button>
    </div>
  </div>
</template>

<style scoped>
.sign-card-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.sign-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* 签等级样式 */
.sign-card.吉 {
  border-left: 5px solid #4caf50;
}

.sign-card.中 {
  border-left: 5px solid #ff9800;
}

.sign-card.平 {
  border-left: 5px solid #9e9e9e;
}

.wish-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.wish-text {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  flex: 1;
}

.sign-level-badge {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 16px;
  margin-left: 12px;
}

.sign-card.吉 .sign-level-badge {
  background-color: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
}

.sign-card.中 .sign-level-badge {
  background-color: rgba(255, 152, 0, 0.1);
  color: #ef6c00;
}

.sign-card.平 .sign-level-badge {
  background-color: rgba(158, 158, 158, 0.1);
  color: #616161;
}

.sign-content {
  margin-bottom: 15px;
  transition: opacity 0.3s ease;
}

.sign-content.classic {
  border-left: 3px solid #9c27b0;
  padding-left: 16px;
}

.sign-content.modern {
  border-left: 3px solid #2196f3;
  padding-left: 16px;
}

.content-title {
  font-size: 1rem;
  color: #555;
  margin: 0 0 8px 0;
}

.sign-text {
  margin-bottom: 12px;
}

.text-content {
  margin: 0;
  line-height: 1.6;
  color: #333;
  white-space: pre-line;
}

.sign-content.classic .text-content {
  font-family: 'SimSun', serif;
}

.sign-tone {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  margin-bottom: 12px;
}

.tone-label {
  font-size: 0.9rem;
  padding: 4px 12px;
  border-radius: 16px;
  background-color: #f5f5f5;
  color: #555;
}

.disclaimer {
  font-size: 0.75rem;
  color: #999;
  text-align: center;
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px dashed #eee;
  line-height: 1.3;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.toggle-button, .restart-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.toggle-button {
  background-color: #f5f5f5;
  color: #333;
}

.toggle-button:hover {
  background-color: #e0e0e0;
}

.restart-button {
  background-color: #42b883;
  color: white;
}

.restart-button:hover {
  background-color: #369a6e;
}

@media (max-width: 768px) {
  .sign-card {
    padding: 16px;
  }
  
  .wish-text {
    font-size: 1.1rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .toggle-button, .restart-button {
    width: 100%;
  }
}
</style>
