<script lang="ts" setup>
import { Cog } from "lucide-vue-next";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();

const showDebugPanel = defineModel<boolean>();

type MenuItem = {
    label: string;
    url: string;
    active?: boolean;
};

const menuItems: MenuItem[] = (typeof appConfig.menu === 'function' ? appConfig.menu() : appConfig.menu) || [];
</script>

<template>
    <div class="relative bg-white">
        <nav class="main-nav container mx-auto hidden md:flex md:flex-row border-b-2 border-gray-200">
            <template v-for="item in menuItems.filter(item => item.active)" :key="item.label">
                <a
                    v-if="item.url.startsWith('http')"
                    :href="item.url"
                    class="nav-item"
                >{{ item.label }}</a>
                <NuxtLink
                    v-else
                    :to="item.url"
                    class="nav-item"
                >{{ item.label }}</NuxtLink>
            </template>

            <!-- debug -->
            <div v-if="runtimeConfig.public.prezDebug" class="!ml-auto self-center">
                <div v-if="showDebugPanel">
                    <span
                        title="Toggle debug off"
                        class="hover:cursor-pointer hover:text-gray-500 text-blue-400"
                        @click="() => { showDebugPanel = !showDebugPanel }"
                    >
                        <Cog class="w-4 h-4" />
                    </span>
                </div>
                <span
                    v-else
                    title="Toggle debug on"
                    class="hover:cursor-pointer hover:text-gray-500 text-gray-300"
                    @click="() => { showDebugPanel = !showDebugPanel }"
                >
                    <Cog class="w-4 h-4" />
                </span>
            </div>
        </nav>
    </div>
</template>

<style scoped>
.nav-item {
    color: #083A42;
    font-weight: bold;
    font-size: 15px;
    padding: 0 24px;
    text-decoration: none;
    display: flex;
    align-items: center;
    height: 3.046875rem; /* 48.75px */
    border-bottom: 2px solid transparent;
}
.nav-item:hover {
    background-color: #f8f4f4;
    border-bottom-color: #a0ecf8;
}
.router-link-active {
    background-color: #f8f4f4;
    border-bottom-color: #a0ecf8;
}
</style>
