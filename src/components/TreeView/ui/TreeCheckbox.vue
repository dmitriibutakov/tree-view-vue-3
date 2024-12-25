<script setup lang="ts">
import { computed, defineEmits } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  indeterminate: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue']);

const isChecked = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>

<template>
  <div class="custom-checkbox" @click="isChecked = !props.indeterminate && !isChecked">
    <div
      class="custom-checkbox__box"
      :class="[
        isChecked
          ? 'custom-checkbox__box--checked'
          : indeterminate
            ? 'custom-checkbox__box--indeterminate'
            : '',
      ]"
    >
      <svg v-if="isChecked" viewBox="0 0 24 24" class="custom-checkbox__icon">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <div v-else-if="indeterminate" class="custom-checkbox__minus"/>
    </div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;

  &__box {
    width: 16px;
    height: 16px;
    border: 2px solid #666;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background-color: white;
    transition:
      background-color 0.2s,
      border-color 0.2s;

    &--checked {
      border-color: black;
      background-color: black;
    }

    &--indeterminate {
      border-color: black;
      background-color: white;
      position: relative;
    }
  }

  &__minus {
    width: 8px;
    height: 2px;
    background-color: black;
    border-radius: 1px;
  }

  &__icon {
    width: 12px;
    height: 12px;
    stroke: white;
    stroke-width: 2;
    fill: none;
  }
}
</style>
