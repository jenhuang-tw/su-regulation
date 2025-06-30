<template>
    <div>
        <p>國立臺北大學學生自治會 法規系統 v2.1</p>
        <p>請優先至本會網站查詢。任何疑問請洽總會秘書處。</p>
        <ul>
            <li v-for="([id, title]) in lawList" :key="id">
            {{ id.toString().padStart(4, '0') }}.
            <NuxtLink :to="`/regulation/${id}/embed`">{{ title }}</NuxtLink>
            </li>
        </ul>
        <NuxtImg src="/union-seal-from_fb_20110914.jpg" sizes="sm:90vw md:50vw lg:300px" />
    </div>
</template>

<script setup lang="js">

const lawList = [
  [7,'學生自治訴訟法'],
  [58,'組織章程'],
  [63,'學生法院組織法'],
  [94,'學生代表推派辦法'],
  [252,'三峽議會助理聘任辦法'],
  [286,'學生法官自律辦法'],
  [561,'臺學聯章程施行法'],
  [581,'自治資訊公開法'],
  [602,'榮典授予辦法'],
  [1359,'跨校區事務條例'],
];
</script>