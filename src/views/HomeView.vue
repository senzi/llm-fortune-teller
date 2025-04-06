<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import HeaderLogo from '../components/HeaderLogo.vue';
import WishInput from '../components/WishInput.vue';
import StepFlow from '../components/StepFlow.vue';
import SignCard from '../components/SignCard.vue';

// 路由
const router = useRouter();

// 状态管理
const currentStep = ref(0); // 0: 输入愿望, 1: 验证愿望, 2: 计算签等级, 3: 生成签文, 4: 展示结果
const wishText = ref('');
const isLoading = ref(false);
const error = ref(null);

// 签文结果数据
const signResult = reactive({
  confirmed_wish: '',
  level: '',
  sign_text: {
    classic: '',
    modern: ''
  },
  interpretation: {
    classic: '',
    modern: ''
  },
  tone: ''
});

// 处理愿望提交
async function handleWishSubmit(wish) {
  wishText.value = wish;
  error.value = null;
  
  try {
    // 步骤1: 验证愿望
    currentStep.value = 1;
    isLoading.value = true;
    const validateResult = await validateWish(wish);
    
    // 如果验证不通过，跳转到错误页面
    if (validateResult.result.category === 'block') {
      router.push('/error');
      return;
    }
    
    // 步骤2: 计算签等级
    currentStep.value = 2;
    const levelResult = await calculateSignLevel(wish);
    const signLevel = levelResult.result.level;
    
    // 在"掐指一算"步骤多停留2秒
    // 同时开始生成签文的请求（不等待结果）
    const generatePromise = generateSign(wish, signLevel);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 步骤3: 生成签文
    currentStep.value = 3;
    const generateResult = await generatePromise;
    
    // 保存结果
    Object.assign(signResult, generateResult.result);
    
    // 步骤4: 展示结果
    currentStep.value = 4;
    
  } catch (err) {
    error.value = err.message || '处理请求时发生错误';
    currentStep.value = 0;
  } finally {
    isLoading.value = false;
  }
}

// 重新开始
function handleRestart() {
  currentStep.value = 0;
  wishText.value = '';
  error.value = null;
  // 重置签文结果
  Object.assign(signResult, {
    confirmed_wish: '',
    level: '',
    sign_text: { classic: '', modern: '' },
    interpretation: { classic: '', modern: '' },
    tone: ''
  });
}

// API调用函数
async function validateWish(wish) {
  const response = await fetch('/api/validateWish', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Referer': window.location.origin + '/'
    },
    body: JSON.stringify({ wish })
  });
  
  if (!response.ok) {
    throw new Error(`验证愿望失败: ${response.status}`);
  }
  
  return await response.json();
}

async function calculateSignLevel(wish) {
  const response = await fetch('/api/calculateSignLevel', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Referer': window.location.origin + '/'
    },
    body: JSON.stringify({ wish })
  });
  
  if (!response.ok) {
    throw new Error(`计算签等级失败: ${response.status}`);
  }
  
  return await response.json();
}

async function generateSign(wish, level) {
  const response = await fetch('/api/generateSign', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Referer': window.location.origin + '/'
    },
    body: JSON.stringify({ wish, level })
  });
  
  if (!response.ok) {
    throw new Error(`生成签文失败: ${response.status}`);
  }
  
  return await response.json();
}
</script>

<template>
  <div class="home-container">
    <HeaderLogo />
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-if="currentStep === 0" class="input-section">
      <WishInput @submit="handleWishSubmit" />
    </div>
    
    <div v-else-if="currentStep < 4" class="processing-section">
      <StepFlow :current-step="currentStep" />
    </div>
    
    <div v-else class="result-section">
      <SignCard 
        :sign-data="signResult" 
        @restart="handleRestart"
      />
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 16px 0;
  text-align: center;
}

.input-section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 10px 0;
  margin-top: -10px; /* 减少与标题的间距 */
}

.processing-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  margin-top: -10px; /* 减少与标题的间距 */
}

.result-section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 10px 0;
  margin-top: -10px; /* 减少与标题的间距 */
}
</style>
