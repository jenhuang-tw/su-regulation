<!-- pages/regulation/[id]/source-code.vue -->
<template>
  <div>
    <h1 style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: bold;">HTML 原始碼</h1>

    <button @click="copyToClipboard">
      Copy all
    </button>

    <textarea
      :value="generatedHtmlSource"
      readonly
    ></textarea>
  </div>
</template>

<script setup>
// 1. 從 vue 引入 computed
import { ref, computed, onMounted } from 'vue' 
import matter from 'gray-matter'

const route = useRoute();
const id = route.params.id;

const regulation = ref({
  titleFull: '',
  titleShort: '',
  modifiedType: '',
  modifiedDate: '',
  status: '',
  history: [], // 2. (修正) 初始值改為空陣列 []，避免 .map() 錯誤
  fullText: ''
})

onMounted(async () => {
  try {
    const res = await fetch(`/api/regulation/${id}`)
    if (!res.ok) throw new Error('前端呼叫 API 後，得到失敗的回應。')
    const data = await res.json()
    regulation.value = data
  } catch (err) {
    console.error('讀取錯誤：', err)
    regulation.value.fullText = '（讀取失敗）'
  }
})

// 3. (修正) 將 useHead 的 title 改為 computed，才能在資料載入後正確反應
useHead({
  title: computed(() => `${regulation.value.titleShort || '法規'} (原始碼) - 臺北大學學生會 法規系統`)
})

// --- 以下為新增的程式碼 ---

// 4. 建立 Computed Property 來產生原始碼字串
const generatedHtmlSource = computed(() => {
  // 處理 (廢止) 狀態
  const abandonedSpan = regulation.value.status === 'abandoned'
    ? ' <span style="color: red;">(廢止)</span>'
    : '';

  // 處理沿革 (<li> 列表)
  // 檢查 history 是否為陣列，避免 API 異常時出錯
  let historyItems = '';
  if (Array.isArray(regulation.value.history)) {
    historyItems = regulation.value.history
      .map(item => `  <li>${item}</li>`)
      .join('\n'); // 用換行符和縮排組合
  }

  // 使用模板字面值 (``) 來組合完整的 HTML 字串
  return `
<p><span style="font-weight: bold;">法規名稱：</span>${regulation.value.titleFull}${abandonedSpan}</p>
<p><span style="font-weight: bold;">${regulation.value.modifiedType}日期：</span>${regulation.value.modifiedDate}</p>
<h2 class="wp-block-heading">全文</h2>
<div>
${regulation.value.fullText || ''}
</div>
<h2 class="wp-block-heading">沿革</h2>
<ol>
${historyItems}
</ol>
  `.trim(); // .trim() 移除開頭和結尾多餘的空白
});

// 5. 撰寫複製到剪貼簿的功能
async function copyToClipboard() {
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