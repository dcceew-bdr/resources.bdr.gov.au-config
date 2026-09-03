// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: [
      "@nuxtjs/tailwindcss",
      "shadcn-nuxt",
      "@nuxtjs/color-mode",
    ],
    extends: [
        "prez-ui"
    ],
    vite: {
        server: {
            allowedHosts: [
                "bdr.gov.au",
                "resources.bdr.gov.au",
                "resources.dev.bdr.gov.au"
            ],
            hmr: {
                host: "localhost",
                protocol: "ws",
            },
            // watch: {
            //     usePolling: true
            // }
        },
        optimizeDeps: {
            include: ["@triply/yasgui"]
        }
    },
    app: {
        head: {
            title: "BDR Resources",
            link: [
                { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap", type: "text/css" }
            ]
        },
    },
    hooks: {
        'pages:extend'(pages) {
            const rootPage = pages.find(page => page.path === '/');
            if (rootPage) {
                rootPage.file = new URL('./pages/index.vue', import.meta.url).pathname;
            }
        },
    },
});
