<script lang="ts" setup>
import { computed, type Component } from "vue";
import { SearchResults, type SearchResultsProps } from "prez-components";

const props = defineProps<SearchResultsProps>();
const rdfType = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const isPublicClass = (node: { value: string }) => !node.value.startsWith("https://olis.dev/");

const results = computed(() => props.results.map((result) => ({
  ...result,
  resource: {
    ...result.resource,
    rdfTypes: result.resource.rdfTypes?.filter(isPublicClass),
    properties: result.resource.properties?.[rdfType]
      ? {
          ...result.resource.properties,
          [rdfType]: {
            ...result.resource.properties[rdfType],
            objects: result.resource.properties[rdfType].objects.filter(isPublicClass),
          },
        }
      : result.resource.properties,
  },
})));

const node = resolveComponent("Node") as Component;
const term = resolveComponent("Term") as Component;
const literal = resolveComponent("Literal") as Component;
const itemLink = resolveComponent("ItemLink") as Component;
</script>

<template>
  <SearchResults
    v-bind="props"
    :results="results"
    :_components="{ node, term, literal, itemLink }"
  />
</template>
