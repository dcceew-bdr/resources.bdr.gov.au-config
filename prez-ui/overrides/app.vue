<script setup lang="ts">
import ResourcesContent from '~/components/ResourcesContent.vue';

const route = useRoute();
</script>

<template>
  <ResourcesContent v-if="route.path === '/'" />
  <NuxtPage v-else />
</template>
