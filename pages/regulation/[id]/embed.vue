<template>
    <div>

<p><span style="font-weight: bold;">法規名稱：</span>{{ regulation.titleFull }} <span v-if="regulation.status === 'abandoned'"><span style="color: red;">(廢止)</span></span></p>

<p><span style="font-weight: bold;">{{ regulation.modifiedType }}日期：</span>{{ regulation.modifiedDate }}</p>

<h2 class="wp-block-heading">全文</h2>

<div v-if="regulation.fullText" v-html="regulation.fullText"></div>

<h2 class="wp-block-heading">沿革</h2>
<ol>
  <li v-for="(item, index) in regulation.history" :key="index" v-html="item"></li>
</ol>
    </div>
</template>

<script setup>

import matter from 'gray-matter'

const route = useRoute();
const id = route.params.id;

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
    const res = await fetch(`/api/regulation/${id}`)
    if (!res.ok) throw new Error('前端呼叫 API 後，得到失敗的回應。')
    const data = await res.json()
    regulation.value = data
  } catch (err) {
    console.error('讀取錯誤：', err)
    regulation.value.fullText = '（讀取失敗）'
  }
})

useHead({
  title: () => regulation.value.titleShort + ' - 臺北大學學生會法規系統'
})
</script>