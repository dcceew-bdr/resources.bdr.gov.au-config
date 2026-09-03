export default defineAppConfig({
    menu: () => [
        { "label": "Home", "url": "/", "active": true },
        { "label": "Resources", "url": "https://resources.dev.bdr.gov.au", "active": true },
        { "label": "Submit", "url": "https://submit.bdr.gov.au", "active": true },
    ],

    secondaryMenu: () => [
        { "label": "Catalogues", "url": "/catalogues-home", "active": true },
        { "label": "Search", "url": "/search", "active": true },
        { "label": "SPARQL", "url": "/sparql", "active": true },
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
