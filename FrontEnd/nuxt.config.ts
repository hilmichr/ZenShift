// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2025-09-23",
  app: {
    head: {
      title: "Firma Manager",
      htmlAttrs: { lang: "de" },
      meta: [{ name: "description", content: "Firma Manager" }],
    },
  },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  colorMode: {
    preference: "light",
  },
  ui: {
    icons: ["carbon"],
  },
});
