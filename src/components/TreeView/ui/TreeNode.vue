<script setup lang="ts">
import TreeContainer from './TreeContainer.vue';
import { ITreeNode } from '@/shared/types/tree-view.ts';
import useTreeView from '@/composables/useTreeView.ts';

defineProps<{
  node: ITreeNode;
}>();

const { actions } = useTreeView();
</script>

<template>
  <li>
    <slot :node="node" />
    <TreeContainer v-if="actions.isExpanded(node.id)" :nodes="node.children || []">
      <template #default="{ node }">
        <slot :node="node" />
      </template>
    </TreeContainer>
  </li>
</template>
