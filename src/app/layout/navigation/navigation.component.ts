import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavItem } from '../navigation.interface';
import { NAV_ITEMS } from '../navigation.config';
import { RouterModule } from '@angular/router';
import { LessonsMenuComponent } from '../menus/lessons-menu/lessons-menu.component';

@Component({
  selector: 'app-navigation',
  imports: [CommonModule, RouterModule, LessonsMenuComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  navItems: NavItem[] = NAV_ITEMS;
  showMenuWrapper = false;
  activeMenuItem: NavItem | null = null;

  showUserMenu = false;
  showTooltip = false;
  tooltipText = '';
  tooltipPosition = { x: 0, y: 0 };

  onNavItemClick(item: NavItem, event: Event): void {
    if (item.type === 'menu') {
      event.preventDefault();
      this.activeMenuItem = item;
      this.showMenuWrapper = true;
    } else {
      // For 'page' type, let the routerLink handle navigation
      this.showMenuWrapper = false;
      this.activeMenuItem = null;
    }
  }

  closeMenu(): void {
    this.showMenuWrapper = false;
    this.activeMenuItem = null;
  }

  updateTooltipPosition(event: MouseEvent) {
    this.tooltipPosition = {
      x: event.clientX + 10,
      y: event.clientY + 10
    };
  }
}
