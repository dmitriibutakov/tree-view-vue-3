import type { Meta, StoryObj } from '@storybook/vue3';
import { TreeView } from '@/index.ts';
import PrimeIcon from '@/components/PrimeIcon/PrimeIcon.vue';
import ItemListTree from '@/components/ItemListTree/ItemListTree.vue';
import { ITreeNode } from '@/shared/types/tree-view.ts';
import { v4 as uuidv4 } from 'uuid';
import { onMounted, reactive } from 'vue';

const meta: Meta<typeof TreeView> = {
  component: TreeView,
  tags: ['autodocs'],
  argTypes: {
    showControls: {
      control: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TreeView>;
const nodes = reactive<ITreeNode[]>([
  {
    id: uuidv4(),
    label: 'Archive',
    icon: 'folder',
    children: [
      {
        id: uuidv4(),
        label: 'Settings',
        icon: 'cog',
        children: [
          {
            id: uuidv4(),
            label: 'Document 1',
            icon: 'file',
            slotName: 'greenText',
            children: [
              { id: uuidv4(), label: 'File 1', icon: 'file' },
              { id: uuidv4(), label: 'File 2', icon: 'file', slotName: 'greenText' },
            ],
          },
          { id: uuidv4(), label: 'Document 2', icon: 'file' },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    label: 'Main',
    icon: 'home',
    slotName: 'greenText',
    children: [{ id: uuidv4(), label: 'Document 3', icon: 'file' }],
  },
  {
    id: uuidv4(),
    label: 'Calendar',
    icon: 'calendar',
    children: [
      { id: uuidv4(), label: 'Meeting 1', icon: 'calendar' },
      { id: uuidv4(), label: 'Meeting 2', icon: 'calendar', slotName: 'greenText' },
      { id: uuidv4(), label: 'Meeting 3', icon: 'calendar' },
    ],
  },
  {
    id: uuidv4(),
    label: 'Favorites',
    icon: 'star',
    children: [
      {
        id: uuidv4(),
        label: 'Main',
        icon: 'star',
        children: [
          {
            id: uuidv4(),
            label: 'Delayed',
            icon: 'star',
            children: [
              { id: uuidv4(), label: 'Film 1', icon: 'youtube' },
              { id: uuidv4(), label: 'Film 2', icon: 'youtube' },
            ],
          },
        ],
      },
    ],
  },
]);

export const treeExampleCustomSlots: Story = {
  render: (args) => {
    return {
      components: { TreeView, PrimeIcon, ItemListTree },
      setup() {
        onMounted(() => {
          console.log(nodes, 'nodesWithCheckboxes unsorted');
          setTimeout(() => {
            nodes.reverse();
            console.log(nodes, 'nodesWithCheckboxes sorted');
          }, 1000);
        });
        return { args, nodes };
      },
      template: `
        <TreeView v-bind="args" show-controls :nodes="nodes">
          <template #default="{ node }">
            <ItemListTree :icon="node.icon" :text="node.label"/>
          </template>
          <template #greenText="{ node }">
            <ItemListTree style="color: lightseagreen;" :icon="node.icon" :text="node.label"/>
          </template>
        </TreeView>
      `,
    };
  },
};
export const treeExampleCheckboxes: Story = {
  render: (args) => {
    return {
      components: { TreeView, ItemListTree },
      setup() {
        const updateCheckboxes = (node: ITreeNode[]) => {
          console.log(node, 'updated checkboxes');
        };
        return { args, nodes, updateCheckboxes };
      },
      template: `
        <TreeView v-bind="args" :nodes="nodes" show-checks @update-checkboxes="updateCheckboxes">
          <template #default="{ node }">
            <ItemListTree :icon="node.icon" :text="node.label"/>
          </template>
          <template #greenText="{ node }">
            <ItemListTree style="color: lightseagreen;" :icon="node.icon" :text="node.label"/>
          </template>
        </TreeView>
      `,
    };
  },
};
export const treeExample3: Story = {
  render: (args) => {
    return {
      components: { TreeView, ItemListTree },
      setup() {
        return { args, nodes };
      },
      template: `
        <TreeView v-bind="args" :nodes="nodes" show-search>
          <template #default="{ node }">
            <ItemListTree :icon="node.icon" :text="node.label"/>
          </template>
          <template #greenText="{ node }">
            <ItemListTree style="color: lightseagreen;" :icon="node.icon" :text="node.label"/>
          </template>
        </TreeView>
      `,
    };
  },
};
