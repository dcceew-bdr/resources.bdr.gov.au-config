<script setup lang="ts">
import { ChevronRight, ChevronLeft } from "lucide-vue-next";

const props = defineProps<{
    sidepanel?: boolean;
    contentonly?: boolean;
}>();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();
const secondaryMenuItems = (typeof appConfig.secondaryMenu === 'function' ? appConfig.secondaryMenu() : appConfig.secondaryMenu) || [];
const globalConfig = useGlobalConfig(); // needed for checking if SPARQL is enabled
const expandSidePanel = ref(false);
const showDebugPanel = ref(false);

onBeforeMount(() => {
    if (typeof localStorage !== 'undefined') {
        expandSidePanel.value = !!localStorage.getItem('expandSidePanel');
        showDebugPanel.value = runtimeConfig.public.prezDebug && !!localStorage.getItem('debug');
        watch(expandSidePanel, val => localStorage.setItem('expandSidePanel', val && '1' || ''));
        watch(showDebugPanel, val => localStorage.setItem('debug', val && '1' || ''));
    }
});

</script>

<template>
    <div class="flex flex-col min-h-screen">
        <BdrLayoutHeader />

        <BdrLayoutNav v-model="showDebugPanel" />

        <div style="height: 30px; background-color: #083A42;"></div>

        <div class="bg-[#EBF5FB]">
            <div class="container mx-auto">
                <nav class="flex">
                    <template v-for="item in secondaryMenuItems" :key="item.label">
                        <a
                            v-if="item.url.startsWith('http')"
                            :href="item.url"
                            target="_blank"
                            class="secondary-nav-item"
                        >{{ item.label }}</a>
                        <NuxtLink
                            v-else
                            :to="item.url"
                            class="secondary-nav-item"
                        >{{ item.label }}</NuxtLink>
                    </template>
                </nav>
            </div>
        </div>

        <!-- page heading -->
        <slot v-if="!contentonly" name="header">
            <div class="">
                <div class="container mx-auto flex flex-row">
                    <div class="px-4 py-4 flex-grow">
                        <slot name="breadcrumb" />
                        <h1 class="text-4xl pb-6 pt-3">
                            <slot name="header-text" />
                        </h1>
                    </div>
                    
                    <div v-if="showDebugPanel" class="m-2 bg-gray-200 rounded-lg text-[12px] leading-[12px]">
                        <slot name="debug" />
                    </div>
                </div>
            </div>
        </slot>
        <div v-else-if="showDebugPanel" class="bg-gray-100">
            <div class="container px-4 py-4 mx-auto">
                <slot name="debug" />
            </div>
        </div>

        <!-- content -->
        <div class="container mx-auto flex-grow">
            <div v-if="sidepanel" class="section grid grid-cols-4 gap-4">
                <div :class="expandSidePanel ? 'col-span-3 relative' : 'col-span-4 relative'">
                    <slot />
                    <Button
                        v-if="!expandSidePanel"
                        title="Show sidepanel"
                        variant="outline"
                        size="icon"
                        class="absolute right-0 top-[-5px] pointer-events-auto bg-white border-2 border-gray-300 rounded-full"
                        @click="expandSidePanel = !expandSidePanel"
                    >
                        <ChevronLeft class="size-4" />
                    </Button>
                </div>
                <div v-if="expandSidePanel" class="relative">
                    <slot name="sidepanel" />
                    <Button
                        title="Hide sidepanel"
                        variant="outline"
                        size="icon"
                        class="absolute right-0 top-[-5px] pointer-events-auto bg-white border-2 border-gray-300 rounded-full"
                        @click="expandSidePanel = !expandSidePanel"
                    >
                        <ChevronRight class="size-4" />
                    </Button>
                </div>
            </div>
            <div v-else class="section">
                <slot />
            </div>
        </div>

        <BdrLayoutFooter />
    </div>
</template>

<style>
.secondary-nav-item {
    color: #083A42 !important;
    font-size: 14px !important;
    padding: 8px 16px !important;
    font-weight: bold !important;
    text-decoration: none !important;
}
</style>
