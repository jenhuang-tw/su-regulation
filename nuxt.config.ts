// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['@/assets/css/regulation-format.css'],

  nitro: {
    preset: 'Vercel'
  },

  app: {
    head: {
      title: '國立臺北大學學生自治會 法規系統 v2.1',
      htmlAttrs: { lang: 'zh-Hant-TW', },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { "charset": "utf-8" }
      ],
      noscript: [
        { textContent: 'JavaScript is required' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/ntpusu-favicon.ico' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180', href: '/ntpusu-apple-touch-icon.png' },
        { rel: 'manifest', href: '/ntpusu-site.webmanifest' }
      ]
    }
  },

  modules: ['@nuxt/image']

})
