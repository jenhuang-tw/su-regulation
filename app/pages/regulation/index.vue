<template>
  <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 sm:p-6">
    
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      <NuxtLink to="/" class="text-blue-600 dark:text-blue-400 hover:underline">首頁</NuxtLink>
      <span class="text-gray-400 dark:text-gray-600 mx-1">/</span>
      法規系統
    </p>

    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
      國立臺北大學學生自治會 法規系統 v2.2
    </h1>
    <p class="text-base text-gray-700 dark:text-gray-300 mb-8">
      法規系統是本會內部法制作業使用。一般同學可至<a href="https://ntpusu.org/regulation-index" target="_blank" class="text-blue-500 hover:text-blue-400 hover:underline">
            會網法規資料庫
          </a>查詢。使用上的任何疑問請洽總會秘書處。
    </p>

    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              編號
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              會網法規頁面
            </th>
            <th scope="col" colspan="2" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              法制作業
            </th>
            <th scope="col" colspan="2" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              會網 IT 功能
            </th>
          </tr>
        </thead>
        
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="([id, title]) in lawList" :key="id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ id.toString().padStart(4, '0') }}
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
              <NuxtLink :to="`https://ntpusu.org/?p=${id}`" target="_blank" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline">
                {{ title }}
              </NuxtLink>
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <NuxtLink :to="`/regulation/${id}/print`" target="_blank" class="text-indigo-600 dark:text-indigo-400 hover:underline">
                列印
              </NuxtLink>
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <NuxtLink :to="`/regulation/${id}/amend`" target="_blank" class="text-yellow-600 dark:text-yellow-400 hover:underline">
                對照表
              </NuxtLink>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <NuxtLink :to="`/regulation/${id}/embed`" target="_blank" class="text-green-600 dark:text-green-400 hover:underline">
                預覽
              </NuxtLink>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <NuxtLink :to="`/regulation/${id}/source-code`" target="_blank" class="text-gray-600 dark:text-gray-400 hover:underline">
                原始碼
              </NuxtLink>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
    
    <NuxtImg 
      src="/union-seal-from_fb_20110914.jpg" 
      class="w-full max-w-[200px] mx-auto mt-8 rounded-lg shadow-md"
    />
  </div>
</template>

<script setup lang="js">
// 關鍵：改用 'default' 佈局，
// 這樣 'preflight' 和暗色模式才會生效
definePageMeta({
  layout: 'default' 
})

useHead({
  title: '法規列表 | 臺北大學學生會 法規系統'
})

const lawList = [
  [7,'學生自治訴訟法'],
  [58,'組織章程'],
  [63,'學生法院組織法'],
  [94,'學生代表推派辦法'],
  [252,'三峽議會助理聘任辦法'],
  [254,'三峽校區學生議員出缺席規則'],
  [258,'三峽校區學生議會議事規則'],
  [272,'臺北議會互選議長副議長辦法'],
  [286,'學生法官自律辦法'],
  [561,'臺學聯章程施行法'],
  [581,'自治資訊公開法'],
  [588,'自治法規標準法'],
  [602,'榮典授予辦法'],
  [607,'總會選委會組織法'],
  [612,'總會組織、職權行使法'],
  [765,'三峽校區學生議會組織、職權行使法'],
  [769,'三峽校區學生議會秘書處組織規程'],
  [1165,'臺北校區補助系學會條例'],
  [1175,'臺北校區財務行政法'],
  [1359,'跨校區事務條例'],
  [2194,'三峽校區學生議會委員會規程'],
  [2254,'學生自治低落對策委員會規程'],
];
</script>

<style scoped>
/* 所有樣式都已被 Tailwind class 取代，
  因此這個 <style> 區塊可以保持空白或直接刪除。
*/
</style>