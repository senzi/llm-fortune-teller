<script setup>
// HeaderLogo组件 - 显示DeepLuck品牌标志
</script>

<template>
  <header class="header-logo">
    <h1 class="logo-text">DeepLuck</h1>
    <p class="logo-subtitle">愿望有回应，命运有风格</p>
  </header>
</template>

<style scoped>
.header-logo {
  text-align: center;
  padding: 15px 0 10px;
  margin-bottom: 10px;
}

.logo-text {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(45deg, #42b883, #35495e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
}

.logo-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 8px 0 0;
  font-weight: 300;
}

@media (max-width: 768px) {
  .logo-text {
    font-size: 2rem;
  }
  
  .logo-subtitle {
    font-size: 0.9rem;
  }
}
</style>
