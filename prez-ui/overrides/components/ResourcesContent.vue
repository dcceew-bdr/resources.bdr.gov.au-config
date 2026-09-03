<script setup lang="ts">
// Import the validator component
import BdrValidator from '@/components/BdrValidator.vue';
import BdrLayout from '../layouts/default.vue';
import { watch } from 'vue'; // Import watch if needed elsewhere, or remove if only used in BdrValidator
</script>
<template>
  <BdrLayout>
    <template #header-text>Resources</template>
    <template #default>
      <div class="flex gap-8 items-start container mx-auto py-8"> <!-- Added items-start -->
        <div class="w-2/3 leading-relaxed"> <!-- Main content area -->
        <p>
          The catalogues of the BDR's content can be accessed at the <a href="/catalogues">catalogues
            page</a> where both human- (web page- and machine-readable content is organised according to the 
          <a href="https://ogcapi.ogc.org/records/">Open Geospatial Consortium's Records API</a>.
        </p>
        <p>          
          The BDR can also be searched via other standardised and specialised tools, see the <a href="/search">search page</a>.
        </p>

        <!-- BDR Tools Section -->
        <div class="mt-12 pt-8 border-t border-gray-300">
          <h2 class="text-3xl font-semibold mb-4">BDR Tools</h2>
          
          <div class="p-6 border border-green-600 rounded bg-green-50">
            <h3 class="text-2xl font-semibold mb-2">Validate Data</h3>
            <p class="mb-4">Use this tool to validate data that should be sent to the BDR. You can select different forms of validation below for different scenarios.</p>

            <!-- Integrate the BdrValidator component -->
            <BdrValidator />
            <!-- End Validator Component -->

          </div>
        </div>
        <!-- End BDR Tools Section -->

        </div>
        <div class="w-1/3 mt-8 p-4 rounded bg-white space-y-6"> <!-- Sidebar container -->
          <div class="border-2 border-red-800 p-4 rounded">
            <h2 class="text-3xl font-semibold mb-4 text-red-800">ABIS</h2>
            <p class="mb-4">The BDR uses ABIS, the Australian Biodiversity Information Standard, as its main data model.</p>
            <h3 class="text-xl font-semibold mb-2">Here are important ABIS resources:</h3>
            <ul class="list-disc list-inside space-y-1">
              <li><a href="https://linked.data.gov.au/def/abis/overview" class="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">ABIS Overview (1 page)</a></li>
              <li><a href="https://linked.data.gov.au/def/abis" class="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">ABIS Specification</a></li>
              <li><a href="https://linked.data.gov.au/def/bdr-pr" class="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">BDR Profile of ABIS</a></li>
              <li><a href="https://resources.bdr.gov.au/catalogues/bdr-cat:vocabularies" class="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">ABIS Vocabularies</a></li>
            </ul>
          </div>
          <div class="border-2 border-blue-800 p-4 rounded">
            <h2 class="text-3xl font-semibold mb-4 text-blue-800">Systems</h2>
            <p class="mb-4">The BDR is part of a system of systems.</p>
            <h3 class="text-xl font-semibold mb-2">Here are other important systems:</h3>
            <ul class="list-disc list-inside space-y-1">
              <li><a href="https://www.tern.org.au" class="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">TERN</a></li>
              <li><a href="https://www.ala.org.au" class="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">Atlas of Living Australia</a></li>
              <li><a href="https://eia.testing.bdr.gov.au/" class="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">Environment Information Australia Demonstrator</a></li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </BdrLayout>
</template>
