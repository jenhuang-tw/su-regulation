<template>
    <div>
        <div v-if="pending" style="padding: 20px; text-align: center;">
            載入中...
        </div>

        
        <div v-else-if="error" style="padding: 20px; color: red;">
            【讀取失敗】有問題請將以下錯誤訊息回報給會網維護小組：{{ error.message }}
        </div>

        <!-- 成功載入 -->
        <div v-else-if="regulation">
            <p>
                <span style="font-weight: bold;">法規名稱：</span>
                {{ regulation.titleFull }} 
                <span v-if="regulation.status === 'abandoned'">
                    <span style="color: red;">(廢止)</span>
                </span>
            </p>

            <p>
                <span style="font-weight: bold;">{{ regulation.modifiedType }}日期：</span>
                {{ regulation.modifiedDate }}
            </p>

            <h2 class="wp-block-heading">全文</h2>
            <div v-if="regulation.fullText" v-html="regulation.fullText"></div>

            <h2 class="wp-block-heading">沿革</h2>
            <ol>
                <li v-for="(item, index) in regulation.history" :key="index" v-html="item"></li>
            </ol>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'minimal'
})

const route = useRoute();
const id = route.params.id as string;

// 使用 Composable (API 優化)
import { useRegulation } from '~/composables/useRegulation';
const { data: regulation, pending, error } = await useRegulation(id);

useHead({
  title: () => regulation.value 
    ? `${regulation.value.titleShort} - 臺北大學學生會法規系統`
    : '載入中...'
})
</script>