<template>
  <div class="relative min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    
    <button 
      @click="toggleMode" 
      class="absolute top-6 right-6 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="切換亮暗色模式"
    >
      <template v-if="colorMode.preference === 'dark'">
        <Icon name="heroicons:sun-20-solid" class="w-6 h-6" />
      </template>
      <template v-else>
        <Icon name="heroicons:moon-20-solid" class="w-6 h-6" />
      </template>
    </button>

    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
      
      <NuxtImg 
        src="/union-seal-from_fb_20110914.jpg" 
        class="w-24 h-24 mx-auto mb-6 rounded-full shadow-md" 
        alt="NTPU 學生會 會徽"
      />

      <h1 class="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
        臺北大學學生自治會<br>法規系統 v2.1
      </h1>

      <NuxtLink 
        to="/regulation" 
        class="block w-full text-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 mb-6"
      >
        進入法規系統
      </NuxtLink>

      <div class="text-center text-sm text-gray-600 dark:text-gray-400 space-y-3">
        <p>
          這個系統是本會內部維護資料使用的。
          <br class="sm:hidden" /> 如果您是本校同學，請查閱
          <a href="https://ntpusu.org/regulation-index" target="_blank" class="text-blue-500 hover:text-blue-400 hover:underline">
            法規資料庫官網
          </a>。
        </p>
        <p>
          GitHub 儲存庫：
          <a href="https://github.com/jenhuang-tw/su-regulation/tree/main/public/regulations" target="_blank" class="text-blue-500 hover:text-blue-400 hover:underline">
            法規資料
          </a>
        </p>
      </div>
      
    </div>
  </div>
</template>

<script setup>
// 步驟 1: 取得 @nuxtjs/color-mode 提供的 composable
const colorMode = useColorMode();

// 步驟 2: 建立切換函式
// 允許在 'system', 'light', 'dark' 之間循環
function toggleMode() {
  if (colorMode.preference === 'system') {
    colorMode.preference = 'light';
  } else if (colorMode.preference === 'light') {
    colorMode.preference = 'dark';
  } else {
    colorMode.preference = 'system';
  }
}

useHead({
  title: '法規系統 v2.1 - 臺北大學學生會'
})
</script>