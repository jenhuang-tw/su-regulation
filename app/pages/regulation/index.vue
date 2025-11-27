<template>
  <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 sm:p-6">
    
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      <NuxtLink to="/" class="text-blue-600 dark:text-blue-400 hover:underline">首頁</NuxtLink>
      <span class="text-gray-400 dark:text-gray-600 mx-1">/</span>
      法規系統
    </p>

    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
      國立臺北大學學生自治會 法規系統
    </h1>
    <p class="text-base text-gray-700 dark:text-gray-300 mb-8">
      法規系統是本會內部法制作業使用。一般同學可至<a href="https://ntpusu.org/regulation-index" target="_blank" class="text-blue-500 hover:text-blue-400 hover:underline">
            會網法規資料庫
          </a>查詢。使用上的任何疑問請洽總會秘書處。
    </p>

    <div class="max-w-3xl mx-auto">
      
      <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">依校區篩選：</h3>
        <div class="flex flex-wrap gap-6">
          <label class="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              value="common" 
              v-model="selectedTypes"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            >
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-200">共通法規</span>
          </label>

          <label class="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              value="sanxia" 
              v-model="selectedTypes"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            >
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-200">三峽校區</span>
          </label>

          <label class="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              value="taipei" 
              v-model="selectedTypes"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            >
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-200">臺北校區</span>
          </label>
        </div>
      </div>

      <div class="overflow-visible rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="min-w-full">
          <thead class="bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-600">
            <tr>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">
                代碼
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                法規
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">
                功能
              </th>
            </tr>
          </thead>
          
          <tbody class="bg-white dark:bg-gray-800">
            <tr v-for="([id, title]) in filteredLawList" :key="id" class="border-b-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ id.toString().padStart(4, '0') }}
              </td>
              
              <td class="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                <!-- <NuxtLink :to="`https://ntpusu.org/?p=${id}`" target="_blank" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"> -->
                  {{ title }}
                <!-- </NuxtLink> -->
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                <div class="relative inline-block text-left">
                  <button 
                    @click.stop="toggleMenu(id)" 
                    type="button" 
                    class="p-2 text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 hover:drop-shadow-lg focus:outline-none bg-white dark:bg-gray-800 rounded-full"
                    title="展開選單"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  <div 
                    v-if="activeMenuId === id" 
                    class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  >
                    <div class="py-1 flex flex-col text-left" role="menu" aria-orientation="vertical">
                      
                      <span class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">法制作業</span>
                      <NuxtLink :to="`/regulation/${id}/print`" target="_blank" class="block px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-600 hover:underline" role="menuitem">
                        列印
                      </NuxtLink>
                      <NuxtLink :to="`/regulation/${id}/amend`" target="_blank" class="block px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-600 hover:underline" role="menuitem">
                        對照表
                      </NuxtLink>

                      <div class="border-t border-gray-100 dark:border-gray-600 my-1"></div>

                      <span class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">IT 功能</span>
                      <NuxtLink :to="`/regulation/${id}/embed`" target="_blank" class="block px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-600 hover:underline" role="menuitem">
                        預覽
                      </NuxtLink>
                      <NuxtLink :to="`/regulation/${id}/source-code`" target="_blank" class="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 hover:underline" role="menuitem">
                        原始碼
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </td>

            </tr>
            <tr v-if="filteredLawList.length === 0">
              <td colspan="3" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                沒有符合篩選條件的法規。
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <NuxtImg 
      src="/union-seal-from_fb_20110914.jpg" 
      class="w-full max-w-[200px] mx-auto mt-8 rounded-lg shadow-md"
    />
  </div>
</template>

<script setup lang="js">
definePageMeta({
  layout: 'default' 
})

useHead({
  title: '法規列表 | 臺北大學學生會 法規系統'
})

// 1. 定義篩選狀態，預設全部勾選
const selectedTypes = ref(['common', 'sanxia', 'taipei']);

// 2. 控制選單開關
const activeMenuId = ref(null);

const toggleMenu = (id) => {
  if (activeMenuId.value === id) {
    activeMenuId.value = null;
  } else {
    activeMenuId.value = id;
  }
};

// 點擊視窗其他地方關閉選單
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (activeMenuId.value !== null && !e.target.closest('button')) {
      activeMenuId.value = null;
    }
  });
});

// 從 API 獲取法規清單
const { data: lawListResponse, pending, error } = await useFetch('/api/regulation/list'); 
const lawList = computed(() => lawListResponse.value || []);

// 3. 建立計算屬性來過濾法規清單
const filteredLawList = computed(() => {
  
  return lawList.value.filter(([id]) => {
    const idStr = id.toString();
    let show = false;

    // 共通法規：編號以 3 或 6 開頭
    if (selectedTypes.value.includes('common')) {
      if (idStr.startsWith('3') || idStr.startsWith('6')) show = true;
    }

    // 三峽校區：編號以 1 或 2 開頭
    if (selectedTypes.value.includes('sanxia')) {
      if (idStr.startsWith('1') || idStr.startsWith('2')) show = true;
    }

    // 臺北校區：編號以 4 或 5 開頭
    if (selectedTypes.value.includes('taipei')) {
      if (idStr.startsWith('4') || idStr.startsWith('5')) show = true;
    }

    return show;
  });
});
</script>