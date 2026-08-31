<script lang="ts" setup>
import { dumpNodeArray } from "prez-lib";

const defaultItemsPerPage = 50;
const appConfig = useAppConfig();
const route = useRoute();
const { globalProfiles } = useGlobalProfiles();

const pagination = computed(() => {
    const limit = parseInt(route.query.limit?.toString() || defaultItemsPerPage.toString());
    const page = parseInt(route.query.page?.toString() || '1');
    return { limit, page, first: (page - 1) * limit + 1 };
});
const getPageUrl = () => route.path + '?' + new URLSearchParams({
    ...route.query,
    page: pagination.value.page.toString(),
    limit: pagination.value.limit.toString(),
}).toString();

const urlPath = ref(getPageUrl());
const apiEndpoint = useGetPrezAPIEndpoint();
const { status, error, data } = useGetList(apiEndpoint, urlPath);
const apiUrl = (apiEndpoint + urlPath.value).split("?")[0];
const currentProfile = computed(() => data.value ? data.value.profiles.find(p => p.current) : undefined);
const currentFacetProfile = route.query.facet_profile?.toString() || undefined;
const header = computed(() => {
    const lastParent = data.value && data.value.parents?.length > 0
        ? data.value.parents[data.value.parents.length - 1]!.segment : false;
    return lastParent ? appConfig.nameSubstitutions?.[lastParent] || lastParent : "";
});

watch(() => route.fullPath, () => { urlPath.value = getPageUrl(); });
</script>

<template>
    <NuxtLayout sidepanel>
        <template #header-text><slot name="header-text" :data="data">{{ header }}</slot></template>
        <template #debug><pre class="p-2"><b>{{ currentProfile?.title }}</b><br>{{ dumpNodeArray(globalProfiles?.[currentProfile?.uri || '']) }}</pre></template>
        <template #breadcrumb>
            <slot name="breadcrumb" :data="data">
                <div :key="data?.parents.join()">
                    <ItemBreadcrumb v-if="data" :prepend="appConfig.breadcrumbPrepend || []" :name-substitutions="appConfig.nameSubstitutions" :parents="data.parents" />
                    <ItemBreadcrumb v-else-if="error" :custom-items="[{ url: '/', label: 'Unable to load page' }]" />
                    <ItemBreadcrumb v-else :prepend="appConfig.breadcrumbPrepend" :custom-items="[{ url: '#', label: '...' }]" />
                </div>
            </slot>
        </template>
        <template #default>
            <slot :data="data" :status="status">
                <slot name="top" :data="data" :status="status" />
                <slot v-if="error" name="message"><Message severity="error">{{ error }}</Message></slot>
                <slot v-else-if="status == 'pending'" name="loading" :status="status"><Loading /></slot>
                <div v-else-if="data?.data">
                    <slot name="list-top" :data="data" />
                    <!-- @vue-ignore -->
                    <Facets v-if="globalProfiles && currentFacetProfile && globalProfiles[currentFacetProfile]" :facets="data.facets" :profile="globalProfiles[currentFacetProfile]" />
                    <ItemList v-if="globalProfiles && currentProfile" :fields="globalProfiles?.[currentProfile?.uri || '']" :list="data.data" :key="urlPath" />
                    <Loading v-else />
                    <slot name="pagination" :data="data" :pagination="pagination"><PrezPagination :totalItems="data.count" :pagination="pagination" :maxReached="data.maxReached" /></slot>
                    <slot name="list-bottom" :data="data" />
                </div>
            </slot>
            <slot name="bottom" :data="data" :status="status" />
        </template>
        <template #sidepanel><ItemProfiles :key="status" :apiUrl="apiUrl" :loading="status == 'pending'" :profiles="data?.profiles" /></template>
    </NuxtLayout>
</template>
