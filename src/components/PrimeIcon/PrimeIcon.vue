<script setup lang="ts">
import 'primeicons/primeicons.css';

defineProps<{
  icon: string;
}>();
</script>

<template>
  <i :class="['icon pi', `pi-${icon}`]" />
</template>

<style scoped>
.icon {
  color: #b6b6b6;
}
</style>
