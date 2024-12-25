<script setup lang="ts">
import PrimeIcon from '@/components/PrimeIcon/PrimeIcon.vue';

defineProps<{
  icon?: string;
  text: string;
}>();
</script>

<template>
  <span class="tree-item">
    <slot name="left-side" />
    <prime-icon v-if="icon" :icon="icon" />
    <span class="tree-item__text">
      {{ text }}
    </span>
  </span>
</template>

<style scoped lang="scss">
.tree-item {
  padding: 4px 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  @include font-14-500;
}
</style>
