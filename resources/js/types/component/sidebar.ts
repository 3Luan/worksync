import type { Component } from 'vue';
import { UserRole } from '../model';

export interface NavItem {
  title: string;
  routeName?: string;
  icon?: Component;
  isActive?: boolean;
  badge?: number;
  requiredRoles?: UserRole[];
  submenu?: SubItem[];
  isTranslated?: boolean;
}

export interface SubItem {
  title: string;
  routeName: string;
  isActive?: boolean;
}
