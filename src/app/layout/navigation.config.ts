import { NavItem } from './navigation.interface';
import { LessonsMenuComponent } from './menus/lessons-menu/lessons-menu.component';

export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Home', icon: 'home', type: 'page' },
  { path: '/lessons', label: 'Lessons', icon: 'school', type: 'menu', menuComponent: LessonsMenuComponent }
];

