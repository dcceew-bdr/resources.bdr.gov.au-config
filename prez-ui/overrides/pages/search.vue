<script setup lang="ts">
import { Search } from "lucide-vue-next";

const appConfig = useAppConfig();
const apiEndpoint = useGetPrezAPIEndpoint();
const { getPageUrl, pagination, formSubmitToNavigate } = usePageInfo();
const route = useRoute();
const getSearchPageUrl = () => getPageUrl().replace(/^\/search\/(?=\?)/, '/search');
const urlPath = ref(getSearchPageUrl());

const { status, error, data } = useSearch(apiEndpoint, urlPath);

const q = ref((route.query.q || '').toString());

// when a new page is navigated to
watch(() => route.fullPath, () => {
    urlPath.value = getSearchPageUrl();
});

const inSearchMode = computed(() => (route.query?.q || '').length > 0);
</script>

<template>
    <NuxtLayout contentonly>
        <template #default>
            <div class="max-w-6xl leading-relaxed">
                <div>
                    <h1 class="text-4xl pb-6 mt-16 mb-6">
                        <slot name="search-text">Search</slot>
                    </h1>
                    <p>This facility searches across the BDR's supporting models, vocabularies and some reference datasets only. It does <em>not</em> search across the main BDR biodiversity observations data which are not yet publicly available.</p>
                    <p><em>BDR Datasets are catalogued internall in DCCEEW and their metadata at least may soon be made available on this site, perhps Q1, 2026.</em></p>
                    <p class="text-center">Search the BDR's reference material:</p>

                    <div class="flex items-center justify-center">
                        <div class="flex-grow max-w-lg p-4">
                            <form method="get" @submit="formSubmitToNavigate">
                                <div class="flex flex-row">
                                    <Input type="search" autofocus autocomplete="false" name="q" v-model="q" placeholder="Enter keywords..." class="rounded-r-none" />
                                    <Button type="submit" class="rounded-l-none h-auto"><Search class="w-4 h-4" /></Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <Loading v-if="status == 'pending'" variant="search" />
                    <div v-if="status == 'success' && data?.count == 0 && inSearchMode" class="w-full pl-4 text-sm text-muted-foreground">
                        No results found
                    </div>

                </div>

                <div class="flex justify-center mt-4 mb-12">
                    <div class="max-w-4xl w-full">
                        <div v-if="error"><Message severity="error">{{ error }}</Message></div>
                        <div v-if="data">
                            <div v-if="data" :key="urlPath">
                                <SearchResults :results="data.data" />
                                <PrezPagination v-if="status == 'success' && data?.count > 0 && inSearchMode" :totalItems="data.count" :pagination="pagination" :maxReached="data.maxReached" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </NuxtLayout>
</template>
