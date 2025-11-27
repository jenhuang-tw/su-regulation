<!-- pages/regulation/[id]/source-code.vue -->
<template>
  <div>
    <h1 style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: bold;">HTML 原始碼</h1>

    <div v-if="pending">正在產生原始碼...</div>
    
    <div v-else-if="error" style="color: red;">
      讀取失敗：{{ error.message }}
    </div>

    <div v-else>
        <button @click="copyToClipboard">
          Copy all
        </button>

        <textarea
          :value="generatedHtmlSource"
          readonly
        ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue' 
import { useRegulation } from '~/composables/useRegulation';

const route = useRoute();
const id = route.params.id as string;

// --- 使用 Composable ---
const { data: regulation, pending, error } = await useRegulation(id);

useHead({
  title: computed(() => regulation.value 
    ? `${regulation.value.titleShort} (原始碼) - 臺北大學學生會 法規系統`
    : '載入中...')
})

// 建立 Computed Property 來產生原始碼字串
const generatedHtmlSource = computed(() => {
  if (!regulation.value) return '';

  const reg = regulation.value;

  // 處理 (廢止) 狀態
  const abandonedSpan = reg.status === 'abandoned'
    ? ' <span style="color: red;">(廢止)</span>'
    : '';

  // 處理沿革 (<li> 列表)
  // 檢查 history 是否為陣列，避免 API 異常時出錯
  let historyItems = '';
  if (Array.isArray(reg.history)) {
    historyItems = reg.history
      .map(item => `  <li>${item}</li>`)
      .join('\n'); // 用換行符和縮排組合
  }

  // 組合 HTML
  return `
<p><span style="font-weight: bold;">法規名稱：</span>${reg.titleFull}${abandonedSpan}</p>
<p><span style="font-weight: bold;">${reg.modifiedType}日期：</span>${reg.modifiedDate}</p>
<h2 class="wp-block-heading">全文</h2>
<div>
${reg.fullText || ''}
</div>
<h2 class="wp-block-heading">沿革</h2>
<ol>
${historyItems}
</ol>
  `.trim(); // .trim() 移除開頭和結尾多餘的空白
});

// 複製到剪貼簿 (僅 Client 端)
async function copyToClipboard() {
  if (!generatedHtmlSource.value) return;
  
  try {
    await navigator.clipboard.writeText(generatedHtmlSource.value);
    alert('已成功複製到剪貼簿！');
  } catch (err) {
    console.error('無法複製文字: ', err);
    alert('複製失敗，請檢查瀏覽器權限或主控台錯誤。');
  }
}
</script>

<style scoped>
/* 加上樣式讓按鈕和 textarea 看起來更合適 */
button {
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  transition: background-color 0.2s;
  margin-bottom: 12px;
}

button:hover {
  background-color: #0056b3;
}

textarea {
  width: 100%;
  min-height: 400px; 
  font-family: monospace; /* 使用等寬字體更像程式碼 */
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box; /* 確保 padding 不會撐開寬度 */
  background-color: #f9f9f9;
  line-height: 1.5;
}
</style>