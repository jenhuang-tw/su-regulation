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
definePageMeta({
  layout: 'minimal'
})

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

const { data: regulationData, error } = await useFetch(`/api/regulation/single/${id}`)

if (error.value) {
  // console.error('讀取錯誤：', error.value)
  regulation.value.fullText = `<span style="color: red;">【讀取失敗】有問題請將以下錯誤訊息回報給會網維護小組：${error.value}</span>`
} else if (regulationData.value) {
  regulation.value = regulationData.value
}

useHead({
  title: () => regulation.value.titleShort + ' - 臺北大學學生會法規系統'
})
</script>