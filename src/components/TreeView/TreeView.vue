<script setup lang="ts">
import TreeContainer from './ui/TreeContainer.vue';
import TreeCheckbox from './ui/TreeCheckbox.vue';
import PrimeIcon from '@/components/PrimeIcon/PrimeIcon.vue';
import { ITreeNode } from '@/shared/types/tree-view.ts';
import { computed, onMounted, ref, watch } from 'vue';
import useTreeView from '@/composables/useTreeView.ts';
import TreeInputSearch from "@/components/TreeView/ui/TreeInputSearch.vue";

interface Control {
  name: string;
  action: () => void;
}
const props = defineProps<{
  nodes: ITreeNode[];
  showControls?: boolean;
  showChecks?: boolean;
  showSearch?: boolean;
}>();
const emit = defineEmits(['updateCheckboxes']);
const { actions, store } = useTreeView();

const searchQuery = ref('');

const controls: Control[] = [
  { name: 'Expand all', action: () => actions.expandAll() },
  { name: 'Collapse all', action: () => actions.collapseAll() },
];

const filteredNodes = computed(() => actions.filterTree(props.nodes, searchQuery.value));

onMounted(() => {
  actions.setupTree(props.nodes, props.showChecks);
});

watch(
  () => {
    return Object.entries(store.treeState).map(([key, node]) => ({
      id: key,
      checked: node.checked,
    }));
  },
  (newValue, oldValue) => {
    const hasChanges = newValue.some((newNode, index) => {
      const oldNode = oldValue[index];
      return oldNode && newNode.checked !== oldNode.checked;
    });

    if (hasChanges) {
      const result = actions.findLeafCheckedNodes(store.treeState);
      emit('updateCheckboxes', result);
    }
  },
  { deep: true, immediate: false },
);
</script>

<template>
  <div class="tree">
    <TreeInputSearch v-if="showSearch" v-model="searchQuery" />
    <div v-if="showControls" class="tree__controls controls">
      <button
        class="controls__control"
        v-for="(control, controlId) in controls"
        :key="controlId"
        @click="control.action"
      >
        {{ control.name }}
      </button>
    </div>
    <TreeContainer :nodes="filteredNodes">
      <template #default="{ node }">
        <button
          v-if="node?.children?.length"
          class="tree-item"
          @click="() => actions.toggleExpand(node.id)"
        >
          <PrimeIcon
            :class="[
              'tree-item__icon',
              {
                'tree-item__icon_rotated': actions.isExpanded(node.id),
              },
            ]"
            icon="angle-right"
          />
          <TreeCheckbox
            v-if="showChecks"
            :model-value="actions.isChecked(node.id)"
            :indeterminate="actions.hasChildrenChecked(node.id)"
            @update:model-value="actions.toggleCheck(node.id)"
            @click.stop
          />
          <slot :name="node.slotName ?? 'default'" :node="node" />
        </button>
        <span :class="['tree-item', 'tree-item_empty']" v-else>
          <TreeCheckbox
            v-if="showChecks"
            :model-value="actions.isChecked(node.id)"
            :indeterminate="actions.hasChildrenChecked(node.id)"
            @update:model-value="actions.toggleCheck(node.id)"
            @click.stop
          />
          <slot :name="node.slotName ?? 'default'" :node="node" />
        </span>
      </template>
    </TreeContainer>
  </div>
</template>
<style lang="scss">
.tree {
  @include resetStyles;
}
</style>
<style scoped lang="scss">
.tree {
  .controls {
    display: flex;
    gap: 16px;
    margin: 0 0 24px 0;
    &__control {
      font-size: 0.9rem;
      padding: 8px 16px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      background-color: white;
      transition: background-color 0.2s;
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }
  &-item {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    &__icon {
      transition: transform 0.2s ease-in-out;
      &_rotated {
        transform: rotate(90deg);
      }
    }
    &_empty {
      padding: 0 0 0 22px;
    }
  }
}
</style>
