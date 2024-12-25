<script setup lang="ts">
import TreeNode from './TreeNode.vue';
import { ITreeNode } from '@/shared/types/tree-view.ts';

defineProps<{
  nodes: ITreeNode[];
}>();
</script>

<template>
  <ul>
    <TreeNode v-for="node in nodes" :key="node.id" :node="node">
      <template #default="{ node }">
        <slot :node="node" />
      </template>
    </TreeNode>
  </ul>
</template>
