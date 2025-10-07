export interface NavigationItem {
  icon: string;
  label: string;
  route: string;
}

export type NavItemType = 'page' | 'menu';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
  type: NavItemType;
  menuComponent?: any; // Optional: component to display in menu wrapper
} 