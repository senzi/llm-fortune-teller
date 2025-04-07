<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { animate } from 'animejs';

// 动态添加 DaisyUI CSS
onMounted(() => {
  // 检查是否已经加载了 DaisyUI
  if (!document.querySelector('link[href*="daisyui"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.bootcdn.net/ajax/libs/daisyui/4.12.23/full.min.css';
    document.head.appendChild(link);
  }
});

const props = defineProps({
  signData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['restart']);
const displayMode = ref('classic');

const cardRef = ref(null);
const contentRef = ref(null);
const levelBadgeClass = ref(''); // 添加这一行来定义缺失的变量

// 初始化绑定
onMounted(() => {
  if (props.signData && props.signData.level) {
    levelBadgeClass.value = props.signData.level;
  }
});

// 当props.signData.level变化时更新
watch(() => props.signData.level, (newValue) => {
  levelBadgeClass.value = newValue;
});

function toggleMode() {
  displayMode.value = displayMode.value === 'classic' ? 'modern' : 'classic';
}

function handleRestart() {
  emit('restart');
}

onMounted(async () => {
  await nextTick();
  if (cardRef.value) {
    animate(cardRef.value, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: 'easeOutCubic'
    });
  }
});

watch(displayMode, async () => {
  await nextTick();
  if (contentRef.value) {
    animate(contentRef.value, {
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutSine'
    });
  }
});
</script>

<template>
  <div class="sign-card-container">
    <div ref="cardRef" class="card bg-base-100">
      <!-- 顶部装饰条 -->
      <div class="fortune-indicator" :class="props.signData.level"></div>
      
      <!-- 卡片内容 -->
      <div class="card-body">
        <div class="wish-header">
          <h2 class="card-title">
            {{ props.signData.confirmed_wish }}
            <div class="badge" :class="levelBadgeClass">{{ props.signData.level }}</div>
          </h2>
        </div>

        <!-- 切换内容区域 -->
        <div class="divider my-2"></div>
        
        <div 
          v-if="displayMode === 'classic' || displayMode === 'both'"
          ref="contentRef" 
          class="sign-content classic"
        >
          <div class="content-section">
            <h3 class="content-title">
              <span class="title-icon">📜</span>
              签文 · 古风
            </h3>
            <p class="text-content">{{ props.signData.sign_text.classic }}</p>
          </div>
          
          <div class="content-section">
            <h3 class="content-title">
              <span class="title-icon">🔮</span>
              解签
            </h3>
            <p class="text-content">{{ props.signData.interpretation.classic }}</p>
          </div>
        </div>

        <div 
          v-if="displayMode === 'modern' || displayMode === 'both'"
          ref="contentRef" 
          class="sign-content modern"
        >
          <div class="content-section">
            <h3 class="content-title">
              <span class="title-icon">📝</span>
              签文 · 白话
            </h3>
            <p class="text-content">{{ props.signData.sign_text.modern }}</p>
          </div>
          
          <div class="content-section">
            <h3 class="content-title">
              <span class="title-icon">💫</span>
              解签
            </h3>
            <p class="text-content">{{ props.signData.interpretation.modern }}</p>
          </div>
        </div>

        <div class="sign-tone">{{ props.signData.tone }}</div>
        
        <div class="disclaimer">
          本签文由AI生成，仅供娱乐参考，不构成任何建议。<br>LLM由Deepseek提供
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="toggleMode" class="btn btn-outline btn-secondary">
        <span class="btn-text">切换风格</span>
        <span class="badge badge-sm">{{ displayMode }}</span>
      </button>
      <button @click="handleRestart" class="btn btn-primary">再抽一次</button>
    </div>
  </div>
</template>

<style scoped>
.sign-card-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.card {
  width: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 1rem;
  opacity: 0;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
              0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  background-color: #ffffff !important;
  color: #1a1a1a !important;
}

.fortune-indicator {
  height: 6px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.fortune-indicator.吉 {
  background: linear-gradient(90deg, #4caf50, #81c784);
}

.fortune-indicator.中 {
  background: linear-gradient(90deg, #ff9800, #ffb74d);
}

.fortune-indicator.平 {
  background: linear-gradient(90deg, #9e9e9e, #bdbdbd);
}

.badge.吉 {
  background-color: #4caf50;
  color: white;
}

.badge.中 {
  background-color: #ff9800;
  color: white;
}

.badge.平 {
  background-color: #9e9e9e;
  color: white;
}

.wish-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1a1a1a !important;
}

.sign-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: fadeIn 0.5s ease;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.sign-content.classic {
  background-color: rgba(142, 36, 170, 0.05);
  border-left: 4px solid rgba(142, 36, 170, 0.6);
}

.sign-content.modern {
  background-color: rgba(25, 118, 210, 0.05);
  border-left: 4px solid rgba(25, 118, 210, 0.6);
}

.content-section {
  margin-bottom: 1rem;
}

.content-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1.2rem;
}

.text-content {
  font-size: 1rem;
  line-height: 1.8;
  color: #333 !important;
  white-space: pre-wrap;
  padding-left: 0.5rem;
}

.sign-tone {
  text-align: right;
  font-size: 0.9rem;
  color: #888;
  margin-top: 1rem;
  font-style: italic;
}

.disclaimer {
  font-size: 0.75rem;
  color: #999;
  text-align: center;
  margin-top: 1.5rem;
  border-top: 1px dashed #ddd;
  padding-top: 1rem;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  max-width: 400px;
}

.btn {
  flex: 1;
  min-width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  text-transform: none;
  font-weight: 500;
}

.btn-text {
  white-space: nowrap;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .sign-card-container {
    padding: 1rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
  }
}
/* 移动端适配样式 - 添加到已有的 <style> 标签底部 */
@media (max-width: 640px) {
  .sign-card-container {
    padding: 0.75rem;
  }
  
  .card-body {
    padding: 1.25rem 1rem;
  }
  
  .card-title {
    font-size: 1.2rem;
    flex-wrap: wrap;
  }
  
  .wish-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .wish-header .badge {
    align-self: flex-start;
    margin-top: 0.25rem;
  }
  
  .content-title {
    font-size: 1rem;
  }
  
  .text-content {
    font-size: 0.95rem;
    line-height: 1.7;
  }
  
  .sign-content {
    padding: 0.5rem 0.375rem;
    margin: 0.375rem 0;
  }
  
  .content-section {
    margin-bottom: 0.75rem;
  }
  
  .title-icon {
    font-size: 1.1rem;
  }
  
  .sign-tone {
    font-size: 0.85rem;
    margin-top: 0.75rem;
  }
  
  .disclaimer {
    font-size: 0.7rem;
    margin-top: 1rem;
    padding-top: 0.75rem;
  }
  
  .action-buttons {
    gap: 0.75rem;
  }
  
  .btn {
    padding: 0.6rem 1rem;
    font-size: 0.95rem;
  }
  
  .badge {
    font-size: 0.7rem;
  }
  
  .divider {
    margin: 0.5rem 0;
  }
}

/* 超小屏幕的额外适配 */
@media (max-width: 380px) {
  .card-body {
    padding: 1rem 0.75rem;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .content-title {
    font-size: 0.95rem;
  }
  
  .text-content {
    font-size: 0.9rem;
    line-height: 1.6;
  }
  
  .action-buttons {
    gap: 0.5rem;
  }
  
  .btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    min-width: 120px;
  }
}

</style>
