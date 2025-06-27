<template>
    <div>
        <p>國立臺北大學學生自治會 法規系統 v2.1</p>
        <p>請優先至本會網站查詢。任何疑問請洽總會秘書處。</p>
        <ul>
            <li v-for="([id, title]) in lawList" :key="id">
            {{ id.toString().padStart(4, '0') }}.
            <a :href="`embed/${id}`">{{ title }}</a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="js">

useHead({
  title: '國立臺北大學學生自治會 法規系統 v2.1',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8'
});

const lawList = [
  [7,'學生自治訴訟法'],
  [58,'組織章程'],
	
  
  [63,'學生法院組織法'],
  [94,'學生代表推派辦法'],
  [252,'三峽議會助理聘任辦法'],
  [286,'學生法官自律辦法'],
  [561,'學聯章程施行法'],
  [581,'自治資訊公開法'],
  
  [1359,'跨校區事務條例']
];
</script>