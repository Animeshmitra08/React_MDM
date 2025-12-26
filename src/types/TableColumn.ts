export type TableColumn<T> = {
  key: string;
  title: string;
  width?: number;
  render?: (row: T) => React.ReactNode;
};

export type TableAction<T> = {
  key: string;
  label?: string;
  icon?: string;
  onPress: (row: T) => void;
  render?: (row: T) => React.ReactNode;
};