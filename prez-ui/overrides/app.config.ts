export default defineAppConfig({
    menu: () => [
        { "label": "Home", "url": "https://bdr.gov.au", "active": true },
        { "label": "Resources", "url": "https://resources.bdr.gov.au", "active": true },
        { "label": "Submit", "url": "https://submit.bdr.gov.au", "active": true },
    ],

    secondaryMenu: () => [
        { "label": "Catalogues", "url": "/catalogues-home", "active": true },
        { "label": "Search", "url": "/search", "active": true },
        { "label": "Models", "url": "https://linked.data.gov.au/def/bdr-pr", "active": true },
        { "label": "API", "url": "/docs", "active": true },
    ],

    nameSubstitutions: {
        'catalogues': 'Catalogues'
    },

    pagination: {
        itemsPerPage: 50
    }
});

declare module '@nuxt/schema' {
    interface AppConfigInput {
        menu?: (() => Array<{ label: string, url: string, active?: boolean }>) | Array<{ label: string, url: string, active?: boolean }>,
        secondaryMenu?: (() => Array<{ label: string, url: string, active?: boolean }>) | Array<{ label: string, url: string, active?: boolean }>,
        nameSubstitutions?: Record<string, string>,
        breadcrumbPrepend?: Array<{ label: string, url: string }>,
        utilsMenu?: Array<{ label: string, url: string }>
    }
}
