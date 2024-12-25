export type ITreeNode<T = Record<string, unknown>> = {
  id: string;
  label: string;
  icon?: string;
  slotName?: string;
  checked?: boolean;
  children?: ITreeNode<T>[];
} & T;
