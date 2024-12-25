import { reactive } from 'vue';
import { ITreeNode } from '@/shared/types/tree-view.ts';

type TreeNodeState = {
  expanded: boolean;
  checked?: boolean;
  hasChildrenChecked?: boolean;
  children?: TreeState;
} & Pick<ITreeNode, 'id' | 'label'>;

type TreeState = Record<string, TreeNodeState>;

const treeState = reactive<TreeState>({});

export default function useTreeView() {
  const setupTreeNode = (node: ITreeNode, parentState: TreeState, showChecks = false) => {
    const stateNode: TreeNodeState = { expanded: false, id: node.id, label: node.label ?? '' };
    if (showChecks) stateNode.checked = node.checked ?? false;
    if (node.children?.length) {
      stateNode.children = {};
      node.children.forEach((childNode) =>
        setupTreeNode(childNode, stateNode.children!, showChecks),
      );
    }
    parentState[node.id] = stateNode;
  };

  const setupTree = (nodes: ITreeNode[], showChecks = false) => {
    nodes.forEach((node) => setupTreeNode(node, treeState, showChecks));
  };

  const toggleExpand = (nodeId: ITreeNode['id']) => {
    const node = findNode(nodeId, treeState);
    if (node) {
      node.expanded = !node.expanded;
      if (!node.expanded && node.children) updateChildrenState(node.children, 'expanded', false);
    }
  };

  const setCheckState = (node: TreeNodeState, isChecked: boolean) => {
    node.checked = isChecked;
    if (!isChecked && node.hasChildrenChecked) {
      node.hasChildrenChecked = false;
    }
    if (node.children) {
      updateChildrenState(node.children, 'checked', isChecked);
      if (!isChecked) {
        updateChildrenState(node.children, 'hasChildrenChecked', false);
      }
    }
    updateParentCheckState(getNodeIdFromState(treeState, node));
  };

  const expandAll = () => traverseTree(treeState, (node) => (node.expanded = true));

  const collapseAll = () => traverseTree(treeState, (node) => (node.expanded = false));

  const updateChildrenState = (
    state: TreeState,
    key: keyof Pick<TreeNodeState, 'checked' | 'hasChildrenChecked' | 'expanded'>,
    value: boolean,
  ) => {
    Object.values(state).forEach((node) => {
      if (key in node) {
        (node as any)[key] = value;
      }
      if (node.children) {
        updateChildrenState(node.children, key, value);
      }
    });
  };
  const traverseTree = (state: TreeState, callback: (node: TreeNodeState) => void) => {
    Object.values(state).forEach((node) => {
      callback(node);
      if (node.children) traverseTree(node.children, callback);
    });
  };

  const findNode = (nodeId: ITreeNode['id'], state: TreeState): TreeNodeState | null => {
    if (state[nodeId]) return state[nodeId];
    for (const key in state) {
      if (state[key].children) {
        const childState = findNode(nodeId, state[key].children!);
        if (childState) return childState;
      }
    }
    return null;
  };

  const findParentNode = (
    nodeId: ITreeNode['id'],
    state: TreeState,
    parent: TreeNodeState | null = null,
  ): TreeNodeState | null => {
    for (const key in state) {
      if (key === nodeId) return parent;
      if (state[key].children) {
        const childParent = findParentNode(nodeId, state[key].children!, state[key]);
        if (childParent) return childParent;
      }
    }
    return null;
  };

  const getNodeIdFromState = (state: TreeState, targetNode: TreeNodeState): string => {
    for (const key in state) {
      if (state[key] === targetNode) return key;
      if (state[key].children) {
        const childId = getNodeIdFromState(state[key].children!, targetNode);
        if (childId) return childId;
      }
    }
    return '';
  };
  //
  const toggleCheck = (nodeId: ITreeNode['id']) => {
    const node = findNode(nodeId, treeState);
    if (node) {
      const newCheckedState = !(node.checked || node?.hasChildrenChecked);
      setCheckState(node, newCheckedState);
      updateParentCheckState(nodeId);
    }
  };
  //
  const updateParentCheckState = (nodeId: ITreeNode['id']) => {
    const parent = findParentNode(nodeId, treeState);
    if (parent && parent.children) {
      const children = Object.values(parent.children);

      parent.hasChildrenChecked = children.some(
        (child) => child.checked || child.hasChildrenChecked,
      );

      parent.checked = children.every((child) => child.checked)
        ? true
        : children.some((child) => child.checked || child.hasChildrenChecked)
          ? undefined
          : false;
      updateParentCheckState(getNodeIdFromState(treeState, parent));
    }
  };
  const findLeafCheckedNodes = (state: TreeState): { id: string; label: string }[] => {
    const result: { id: string; label: string }[] = [];
    const traverse = (state: TreeState) => {
      Object.entries(state).forEach(([id, node]) => {
        if (node.checked && (!node.children || Object.keys(node.children).length === 0)) {
          result.push({ id, label: node?.label || '' });
        } else if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(state);
    return result;
  };
  const filterTree = (tree: ITreeNode[], query: string): ITreeNode[] => {
    if (!query) return tree;

    return tree
      .map((node) => {
        const match = node.label.toLowerCase().includes(query.toLowerCase());
        if (node.children) {
          const filteredChildren = filterTree(node.children, query);
          if (filteredChildren.length > 0 || match) {
            return { ...node, children: filteredChildren };
          }
        }
        return match ? { ...node, children: [] } : null;
      })
      .filter(Boolean) as ITreeNode[];
  };
  const isExpanded = (nodeId: ITreeNode['id']) => !!findNode(nodeId, treeState)?.expanded;

  const isChecked = (nodeId: ITreeNode['id']) => !!findNode(nodeId, treeState)?.checked;

  const hasChildrenChecked = (nodeId: ITreeNode['id']) =>
    !!findNode(nodeId, treeState)?.hasChildrenChecked;

  return {
    store: { treeState },
    actions: {
      setupTree,
      toggleExpand,
      toggleCheck,
      expandAll,
      collapseAll,
      isExpanded,
      isChecked,
      filterTree,
      hasChildrenChecked,
      findLeafCheckedNodes,
    },
  };
}
