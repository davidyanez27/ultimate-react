export type SubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  subItems?: SubItem[];
};

export type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  subItems?: SubItem[];
};