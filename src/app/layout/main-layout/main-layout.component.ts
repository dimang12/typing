import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})

export class MainLayoutComponent {
  navItems: NavItem[] = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/login', label: 'Login', icon: 'login' },
    { path: '/register', label: 'Register', icon: 'person_add' }
  ];

  showUserMenu = false;
  showTooltip = false;
  tooltipText = '';
  tooltipPosition = { x: 0, y: 0 };

  constructor(private authService: AuthService) {}

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
  }

  updateTooltipPosition(event: MouseEvent) {
    this.tooltipPosition = {
      x: event.clientX + 10,
      y: event.clientY + 10
    };
  }
}
