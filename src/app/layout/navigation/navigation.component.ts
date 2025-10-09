import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
export class NavigationComponent implements OnInit {
  navItems: NavItem[] = NAV_ITEMS;
  showMenuWrapper = false;
  activeMenuItem: NavItem | null = null;

  showUserMenu = false;
  showTooltip = false;
  tooltipText = '';
  tooltipPosition = { x: 0, y: 0 };

  constructor(private router: Router) {}

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

  ngOnInit(): void {
    // Select the 'Home' nav item by default. If it's a menu, open it.
    if (this.navItems && this.navItems.length > 0) {
      const home = this.navItems.find(i => i.label.toLowerCase() === 'home');
      this.activeMenuItem = home || this.navItems[0];
      if (this.activeMenuItem.type === 'menu') {
        this.showMenuWrapper = true;
      }
    }
    // Sync with current router URL so the correct nav item appears active after a page refresh
    const setActiveFromUrl = (url: string) => {
      const match = this.navItems.find(i => i.path === url || (i.path !== '/' && url.startsWith(i.path)));
      if (match) {
        this.activeMenuItem = match;
        // Only open menu wrapper if it's a menu
        this.showMenuWrapper = match.type === 'menu' ? this.showMenuWrapper : false;
      }
    };

    setActiveFromUrl(this.router.url);

    this.router.events.subscribe((evt: any) => {
      if (evt instanceof NavigationEnd) {
        setActiveFromUrl(evt.urlAfterRedirects);
      }
    });
  }

  closeMenu(): void {
    this.showMenuWrapper = false;
    this.activeMenuItem = this.navItems.find(i => i.label.toLowerCase() === 'home') || null;
  }

  updateTooltipPosition(event: MouseEvent) {
    this.tooltipPosition = {
      x: event.clientX + 10,
      y: event.clientY + 10
    };
  }
}
