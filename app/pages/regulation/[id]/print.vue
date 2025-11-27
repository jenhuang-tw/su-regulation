<template>
    <div class="print-page-wrapper">
        
        <div class="print-header">
            <p class="print-timestamp">{{ printTimestamp }}</p>
            <button @click="doPrint" class="print-button">列印本頁</button>
        </div>

        <h1 class="regulation-title-print">
            {{ regulation.titleFull }} 
            <span v-if="regulation.status === 'abandoned'" style="color: red;">(廢止)</span>
        </h1>

        <p class="regulation-date-print">
            {{ regulation.modifiedDate }}{{ regulation.modifiedType }}版本<br /><span style="font-size: smaller;">（完整修正歷程詳條文末）</span>
        </p>

        <div v-if="regulation.fullText" v-html="regulation.fullText"></div>

        <hr class="history-separator" />
        <p class="history-title">沿革</p>
        <ol>
            <li v-for="(item, index) in regulation.history" :key="index" v-html="item"></li>
        </ol>

    </div>
</template>

<script setup>
definePageMeta({
  layout: 'minimal'
})
// --- Script 區塊與前一版相同，無需變更 ---

import matter from 'gray-matter'

const route = useRoute();
const id = route.params.id;

// 用於儲存 "X年X月X日 HH:MM..." 的字串
const printTimestamp = ref('');

// 用於觸發瀏覽器列印
function doPrint() {
  window.print();
}

const regulation = ref({
  titleFull: '',
  titleShort: '',
  modifiedType: '',
  modifiedDate: '',
  status: '',
  history: '',
  fullText: ''
})

onMounted(async () => {
  try {
    const res = await fetch(`/api/regulation/single/${id}`)
    if (!res.ok) throw new Error('前端呼叫 API 後，得到失敗的回應。')
    const data = await res.json()
    regulation.value = data

    // 獲取資料後，設定當前的列印時間
    const now = new Date();
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const d = now.getDate().toString().padStart(2, '0');
    const h = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');
    printTimestamp.value = `臺北大學學生會法規系統 ${y}/${m}/${d} ${h}:${min} 列印`;

  } catch (err) {
    console.error('讀取錯誤：', err)
    regulation.value.fullText = '（讀取失敗）'
  }
})

useHead({
  // 更新頁面標題
  title: () => '列印「' + regulation.value.titleShort + '」 - 臺北大學學生會法規系統'
})
</script>

<style scoped>
/* * * ===================================
 * 一般列印設定
 * ===================================
 */

.print-page-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  
  font-family: 'Times New Roman', '標楷體', 'DFKai-SB', serif;
  font-size: 12pt;
  line-height: 16pt;
}

/* 標題 */
.history-title,
:deep(div.zhangJie),
:deep(p.law-division),
:deep(p.law-chapter),
:deep(p.law-section),
:deep(p.law-hxiang),
:deep(p.law-hsubsection),
:deep(p.law-hitem) {
    font-size: 14pt;
    line-height: 20pt;
    font-weight: bold;
    margin-top: 1.5em;
    margin-bottom: 1em;
}

/* "沿革" 前的分隔線 */
.history-separator {
    margin-top: 2em; /* 讓分隔線與法規內文有足夠間距 */
    border: none;
    border-top: 1px solid #000; /* 一條細黑線 */
}

/* --- 網頁頂部說明 --- */
.print-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 10pt;
  line-height: normal;
}

.print-timestamp {
  font-size: 9pt;
  color: #555;
  margin: 0;
}

.print-button {
  padding: 5px 10px;
  font-size: 9pt;
  cursor: pointer;
}

.regulation-title-print {
  text-align: center;
  font-weight: bold;
  font-size: 16pt;
  margin-top: 1rem;
  margin-bottom: 0.2rem;
  line-height: 25pt;
}

/* 需求 3: 日期置右 */
.regulation-date-print {
  text-align: right;
  margin-top: 1rem;
  margin-bottom: 2rem;
  font-size: 11pt;
}

/* --- 覆蓋線上法規資料庫的樣式，採用正式排版 --- */

:deep(p.xiang:not(:only-of-type)::before) {
  display: none;
  content: none;
}

/* 需求 1: 條號不與內文間有額外間距 */
:deep(p.law-art-num) {
    font-weight: bold;
    page-break-after: avoid;
    margin-bottom: 0; /* 移除條號下方的間距 */
}

/* 需求 1 (續): 緊接在條號後的第一項，移除頂端間距 */
:deep(p.law-art-num + p.xiang) {
    margin-top: 0;
}

/* 項(xiang)不冠數字，空兩格書寫" */
:deep(p.xiang) {
	margin-left: 0; /* 覆蓋法規資料庫之樣式 */
	text-indent: 2em;   /* 第一行縮排 2em */
	margin-top: 5px; 
  margin-bottom: 5px;
}

/* 款左方空三字元（比項次再多一字元，以清楚辨識），且凸排兩字元 */
:deep(p.kuan) {
	margin-left: 5em;
	text-indent: -2em;
	margin-top: 5px; 
  margin-bottom: 5px;
}

:deep(p.mu) {
	margin-left: 7em;
	text-indent: -3em;
	margin-top: 5px; 
  margin-bottom: 5px;
}

@media print {
  .print-header {
    display: none;
    /*
    border-bottom: 0px;
    padding-bottom: 0px;
    margin-bottom: 5px;
    text-align: right !important;
    font-family: 'Times New Roman', '新細明體', -apple-system, sans-serif;
    font-size: 9pt;
    */
  }
  .print-button {
    display: none;
  }
  .print-page-wrapper {
     margin: 0;
     padding: 0;
     max-width: 100%;
  }
}
</style>