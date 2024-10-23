export interface MatMenuConfig<N> {
  name: string;
  class?: string;
  icon?: string;
  isMenu?: boolean;
  options?: Array<MatMenuConfig<N>>;
  onClick?: (node?: N) => void;
  hidden?: (node?: N) => boolean;
  disabled?: (node?: N) => boolean;
  visible?: (node?: N) => boolean
}
