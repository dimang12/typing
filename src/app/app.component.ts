import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router'; 
import { NavItem } from './layout/navigation.interface';
import { NAV_ITEMS } from './layout/navigation.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'WhollyCity-Typing';

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.currentSection = url.split('/')[1] || '';
    });
  }

  ngOnInit(): void {
    console.log('AppComponent initialized');
  }

  navItems: NavItem[] = NAV_ITEMS;

  showUserMenu = false;
  showTooltip = false;
  tooltipText = '';
  tooltipPosition = { x: 0, y: 0 };

  currentSection: string = '';



  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  updateTooltipPosition(event: MouseEvent) {
    this.tooltipPosition = {
      x: event.clientX + 10,
      y: event.clientY + 10
    };
  }
}
