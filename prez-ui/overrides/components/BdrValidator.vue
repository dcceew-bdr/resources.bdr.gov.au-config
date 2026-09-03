<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

// Import shadcn-vue components as needed
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

// --- State Variables ---
const activeTab = ref('text')
const textInputValue = ref('')
const fileInputValue: Ref<File | null> = ref(null)
const selectedFormat = ref('text/turtle')
const selectedValidator = ref('')
const validationReport: Ref<any | null> = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

// --- Data ---
const formatOptions = [
  { name: 'Turtle', value: 'text/turtle' },
  { name: 'JSON-LD', value: 'application/ld+json' },
  { name: 'JSON', value: 'application/json' },
]

const validatorOptions = [
  { name: 'ABIS Validator', value: 'ABIS Validator' },
  { name: 'ABIS + BDR Validator', value: 'ABIS + BDR Validator' },
  { name: 'BDR Submissions Manifest Validator', value: 'BDR Submissions Manifest Validator' },
  { name: 'VocPub Vocabulary Validator', value: 'VocPub Vocabulary Validator' },
  { name: 'GeoSPARQL Validator', value: 'GeoSPARQL Validator' },
]

// --- Computed Properties ---
const currentInputData = computed(() => {
  return activeTab.value === 'text' ? textInputValue.value : fileInputValue.value
})

// --- State for Button Disabled ---
const isButtonDisabled = ref(true);

// --- Watcher to update button disabled state ---
watch(
  // Revert to watching individual refs
  [activeTab, textInputValue, fileInputValue, selectedFormat, selectedValidator, isLoading],
  ([tab, text, file, format, validator, loading]) => {
    console.log('[Button Watcher] State:', { tab, text: !!text, file: !!file, format, validator, loading });
    const commonDisabled = loading || !validator || !format;
    console.log('[Button Watcher] Common Disabled:', commonDisabled, { loading, validator: !!validator, format: !!format });
    const inputMissing = (tab === 'text' && !text) || (tab === 'file' && !file);
    console.log('[Button Watcher] Input Missing:', inputMissing, { tab, text: !!text, file: !!file });
    const finalDisabledState = commonDisabled || inputMissing;
    console.log('[Button Watcher] Final Disabled State:', finalDisabledState);
    isButtonDisabled.value = finalDisabledState;
  },
  { immediate: true }
);


// --- Methods ---
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    fileInputValue.value = target.files[0];
    console.log('[File Change] File selected:', fileInputValue.value.name);
    activeTab.value = 'file'; // Ensure the tab is set to file
    // Auto-select format based on file extension
    const fileName = fileInputValue.value.name.toLowerCase();
    if (fileName.endsWith('.ttl')) {
      selectedFormat.value = 'text/turtle';
      console.log('[File Change] Auto-selected format: text/turtle');
    } else if (fileName.endsWith('.json') || fileName.endsWith('.jsonld')) {
      selectedFormat.value = 'application/ld+json';
      console.log('[File Change] Auto-selected format: application/ld+json');
    }
    textInputValue.value = ''; // Clear text input when file is selected
  } else {
    console.log('[File Change] File selection cleared.');
    fileInputValue.value = null;
  }
}

const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      resolve(typeof result === 'string' ? result : '');
    };
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

const validateData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  validationReport.value = null;
  let dataToSend: string | null = null;
  const currentTab = activeTab.value;

  isLoading.value = true;
  errorMessage.value = '';

  // Check common requirements first
  if (!selectedValidator.value || !selectedFormat.value) {
    errorMessage.value = 'Please select a format and choose a validator.';
    isLoading.value = false;
    return;
  }

  // Handle input based on the captured tab value
  if (currentTab === 'text') {
    dataToSend = textInputValue.value;
    if (!dataToSend) {
        errorMessage.value = 'Please provide input data in the text area.';
        isLoading.value = false;
        return;
    }
  } else if (currentTab === 'file') {
    if (!fileInputValue.value) {
      errorMessage.value = 'Please select a file.';
      isLoading.value = false;
      return;
    }
    try {
      dataToSend = await readFileContent(fileInputValue.value);
      if (dataToSend === '') {
          errorMessage.value = 'The selected file is empty. Please provide a file with content.';
          isLoading.value = false;
          return;
      }
    } catch (error) {
      errorMessage.value = 'Error reading file.';
      isLoading.value = false;
      console.error(error);
      return;
    }
  } else {
      errorMessage.value = 'Invalid input method selected.';
      isLoading.value = false;
      return;
  }

  // Proceed with API call
  try {
    const response = await fetch('https://abis-portal-api.azurewebsites.net/api/v1/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        data: dataToSend,
        format: selectedFormat.value,
        shacl_shapes: selectedValidator.value,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      const errorDetail = result.detail ? (Array.isArray(result.detail) ? result.detail.map((e: any) => e.msg).join(', ') : result.detail) : `HTTP error! Status: ${response.status}`;
      throw new Error(errorDetail);
    }

    validationReport.value = result

  } catch (error: any) {
    console.error('Validation Error:', error)
    errorMessage.value = `Validation failed: ${error.message}`
    validationReport.value = null
  } finally {
    isLoading.value = false
  }
}

// Reset other input when switching tabs
watch(activeTab, (newTab, oldTab) => {
  console.log(`[Tab Watcher] Switched from ${oldTab} to ${newTab}`);
  if (newTab === 'text') {
    console.log('[Tab Watcher] Clearing file input.');
    fileInputValue.value = null;
  } else {
    console.log('[Tab Watcher] Clearing text input.');
    textInputValue.value = '';
  }
});

</script>

<template>
  <div class="p-4 border rounded-md shadow-sm bg-white">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
       <div>
         <label for="formatSelect" class="block text-sm font-medium text-gray-700 mb-1">Data Format</label>
          <Select id="formatSelect" v-model="selectedFormat" :disabled="isLoading">
            <SelectTrigger>
              <SelectValue placeholder="Select data format..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Formats</SelectLabel>
                <SelectItem v-for="format in formatOptions" :key="format.value" :value="format.value">
                  {{ format.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
       </div>
       <div>
         <label for="validatorSelect" class="block text-sm font-medium text-gray-700 mb-1">Validator Profile</label>
          <Select id="validatorSelect" v-model="selectedValidator" :disabled="isLoading">
            <SelectTrigger>
              <SelectValue placeholder="Select validator profile..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Validators</SelectLabel>
                <SelectItem v-for="validator in validatorOptions" :key="validator.value" :value="validator.value">
                  {{ validator.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
       </div>
    </div>

    <Tabs v-model:value="activeTab" default-value="text" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="text" @click="activeTab = 'text'">
          Text Input
        </TabsTrigger>
        <TabsTrigger value="file" @click="activeTab = 'file'">
          File Upload
        </TabsTrigger>
      </TabsList>
      <TabsContent value="text" class="mt-4">
        <Textarea
          v-model="textInputValue"
          placeholder="Paste your data here..."
          class="w-full h-40"
          :disabled="isLoading"
        />
      </TabsContent>
      <TabsContent value="file" class="mt-4">
        <Input
          type="file"
          accept=".ttl,.json,.jsonld"
          @change="handleFileChange"
          :disabled="isLoading"
          class="w-full"
        />
        <p v-if="fileInputValue" class="text-sm text-muted-foreground mt-2">
          Selected file: {{ fileInputValue.name }}
        </p>
      </TabsContent>
    </Tabs>

    <div class="mt-6 flex justify-start">
      <Button @click="validateData" :disabled="isButtonDisabled">
        <span v-if="isLoading">Validating...</span>
        <span v-else>Validate</span>
      </Button>
    </div>

    <!-- Validation Results -->
    <div v-if="isLoading" class="mt-4 text-center">
      Loading...
    </div>
    <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      <strong>Error:</strong> {{ errorMessage }}
    </div>
    <div v-if="validationReport && !errorMessage" class="mt-6">
      <h4 class="text-lg font-semibold mb-2">Validation Results</h4>
      <div class="p-3 bg-gray-100 border border-gray-300 rounded max-h-96 overflow-auto">
        <pre class="text-sm whitespace-pre-wrap break-words">{{ JSON.stringify(validationReport, null, 2) }}</pre>
      </div>
       <p v-if="validationReport.conforms" class="mt-2 text-green-600 font-semibold">Validation Conforms</p>
       <p v-else class="mt-2 text-orange-600 font-semibold">Validation Does Not Conform</p>
    </div>
  </div>
</template>
