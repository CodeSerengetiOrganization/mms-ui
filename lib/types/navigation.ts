export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: NavigationItem[];
  expanded?: boolean;
}

export interface SidebarMenuConfig {
  navigationItems: NavigationItem[];
}
