<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    
    <header class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="text-xl font-bold text-gray-800 dark:text-gray-100 no-underline">
              NTPUSU法規系統
            </NuxtLink>
          </div>
          
          <div>
            <button 
              @click="toggleMode" 
              class="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="切換亮暗色模式"
            >
              <template v-if="colorMode.value === 'dark'">
                <Icon name="heroicons:sun-20-solid" class="w-6 h-6" />
              </template>
              <template v-else>
                <Icon name="heroicons:moon-20-solid" class="w-6 h-6" />
              </template>
            </button>
          </div>
          
        </div>
      </nav>
    </header>

    <main class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <slot />
    </main>

  </div>
</template>

<script setup>
// 亮暗色模式的邏輯
const colorMode = useColorMode();

// 允許在 'system', 'light', 'dark' 之間循環
function toggleMode() {
  // 檢查目前的 "實際" 狀態
  // 如果是 'dark'，就強制切換到 'light'，反之亦然。
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
}
</script>

<style>
@tailwind base;


body {
  margin: 0; /* 再次明確移除 body 的邊界 */
}
</style>