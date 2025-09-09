import { SafeHtml } from "@angular/platform-browser";

export interface MenuItem {
  id: string;
  label: string;
  icon: SafeHtml;
  route?: string;
  badge?: {
    text: string;
    class: string;
  };
  children?: MenuItem[];
  isCollapsible?: boolean;
}

export interface MenuSection {
  id: string;
  items: MenuItem[];
  hasSeparator?: boolean;
}