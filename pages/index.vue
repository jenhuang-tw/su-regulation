<template>
    <div>
        <h1>國立臺北大學學生自治會 法規系統 v2.1</h1>
        <p>請優先至本會網站查詢。任何疑問請洽總會秘書處。</p>
        
        <table>
            <thead>
                <tr>
                    <th>編號</th>
                    <th>會網法規頁面</th>
                    <th>查看 HTML 原始碼</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="([id, title]) in lawList" :key="id">
                    <td>{{ id.toString().padStart(4, '0') }}</td>
                    <td>
                        <NuxtLink :to="`https://ntpusu.org/?p=${id}`" target="_blank">{{ title }}</NuxtLink>
                    </td>
                    <td>
                        <NuxtLink :to="`/regulation/${id}/embed`">原始碼</NuxtLink>
                    </td>
                </tr>
            </tbody>
        </table>
        
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
  [254,'三峽校區學生議員出缺席規則'],
  [286,'學生法官自律辦法'],
  [561,'臺學聯章程施行法'],
  [581,'自治資訊公開法'],
  [588,'自治法規標準法'],
  [602,'榮典授予辦法'],
  [607,'總會選委會組織法'],
  [612,'總會組織、職權行使法'],
  [765,'三峽校區學生議會組織、職權行使法'],
  [1359,'跨校區事務條例'],
  [2194,'三峽校區學生議會委員會規程'],
];
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f0f0f0;
}

a {
  color: #0066cc;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>