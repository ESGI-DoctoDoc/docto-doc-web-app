import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  ssr: false,
  css: ['@/styles/styles.css'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    // '@nuxtjs/i18n'
  ],
  // i18n: {
  //   defaultLocale: 'fr',
  //   locales: [
  //     { code: 'fr', name: 'Français', file: 'fr.locale.ts' },
  //   ],
  // }
})