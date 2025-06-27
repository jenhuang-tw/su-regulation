<template>
    <div><pre>
&ltp>&ltspan style="font-weight: bold;">法規名稱：&lt/span>{{ regulation.titleFull }} <span v-if="regulation.status === 'abandoned'">&ltspan style="color: red;">(廢止)&lt/span></span>&lt/p>
&ltp>&ltspan style="font-weight: bold;">{{ regulation.modifiedType }}日期：&lt/span>{{ regulation.modifiedDate }}&lt/p>
&lth2 class="wp-block-heading">全文&lt/h2>
        <div v-if="regulation.fullText">{{ regulation.fullText }}</div>
&lth2 class="wp-block-heading">沿革&lt/h2>
&ltol>
            <div v-for="(item, index) in regulation.history" :key="index">
              &ltli>{{ item }}&lt/li>
            </div>
&lt/ol>
    </pre></div>
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
  title: regulation.titleShort + ' | 臺北大學學生會 法規系統'
})
</script>