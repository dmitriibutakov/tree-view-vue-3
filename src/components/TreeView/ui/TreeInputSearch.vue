<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: string;
}>();

const searchQuery = ref(props.modelValue);

watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<template>
  <div class="search-container">
    <input v-model="searchQuery" type="text" class="search-input" placeholder="Enter your search" />
  </div>
</template>

<style scoped lang="scss">
.search-container {
  width: 100%;
  max-width: 264px;
  margin-bottom: 1rem;

  .search-input {
    width: 100%;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;

    &:focus {
      border-color: #888;
      box-shadow: 0 0 5px rgba(136, 136, 136, 0.3);
    }
  }
}
</style>
