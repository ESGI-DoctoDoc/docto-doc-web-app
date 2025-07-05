import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  ssr: false,
  css: ['@/styles/styles.css'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ui: {
    colorMode: false,
  },
  vite: {
    plugins: [
      tailwindcss()
    ],
    define: {
      global: 'window',
    },
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
    }
  },
  runtimeConfig: {
    public: {
      apiKey: '',
      apiBase: '',
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    // '@nuxt/image'
  ],
})