<script setup>
import { computed } from "vue";
import { Predicate } from "prez-components";

const props = defineProps({
  predicate: { type: Object, required: true },
  objects: { type: Array, required: true },
});
const node = resolveComponent("Node");

const predicate = computed(() =>
  props.predicate.value === "https://schema.org/keywords"
    ? { ...props.predicate, label: { termType: "Literal", value: "Collection" } }
    : props.predicate,
);

const columnClass = computed(() =>
  props.predicate.value === "https://schema.org/publisher" ? "bdr-publisher-column" : undefined,
);
</script>

<template>
  <Predicate v-bind="props" :class="columnClass" :predicate="predicate" :_components="{ node }">
    <template #default="slotProps"><slot v-bind="slotProps" /></template>
  </Predicate>
</template>
