<template>
  <div>
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 mx-auto">
      
      <NuxtImg 
        src="/union-seal-from_fb_20110914.jpg" 
        class="w-24 h-24 mx-auto mb-6 rounded-full shadow-md object-cover" 
        alt="NTPU 學生會 會徽"
      />

      <h1 class="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
        臺北大學學生自治會<br>法規系統 v2.2
      </h1>

      <div class="text-center mb-6">
        <NuxtLink 
          to="/regulation" 
          class="no-underline inline-block text-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
        >
          進入法規系統
        </NuxtLink>
      </div>

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
definePageMeta({
  layout: 'default'
})

useHead({
  title: '法規系統 v2.2 - 臺北大學學生會'
})
</script>

<style scoped>
</style>