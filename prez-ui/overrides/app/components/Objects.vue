<script setup>
import { computed } from "vue";
import { Objects } from "prez-components";

const props = defineProps({
  predicate: { type: Object, required: true },
  objects: { type: Array, required: true },
  term: { type: Object, required: true },
});
const term = resolveComponent("Term");

const objects = computed(() =>
  props.predicate.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
    ? props.objects.filter((object) => !object.value.startsWith("https://olis.dev/"))
    : props.objects,
);

const columnClass = computed(() =>
  props.predicate.value === "https://schema.org/publisher" ? "bdr-publisher-column" : undefined,
);
</script>

<template>
  <Objects v-bind="props" :class="columnClass" :objects="objects" :_components="{ term }">
    <template #default="slotProps"><slot v-bind="slotProps" /></template>
  </Objects>
</template>

<style>
.bdr-publisher-column {
  width: 50%;
  max-width: 50%;
}
</style>
