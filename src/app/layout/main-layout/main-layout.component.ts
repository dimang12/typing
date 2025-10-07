import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { SubNavigationComponent } from '../sub-navigation/sub-navigation.component';
import { TypingLesson, LessonService } from '../../services/lesson.service';
import { NavItem } from '../navigation.interface';
import { NAV_ITEMS } from '../navigation.config';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NavigationComponent, SubNavigationComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})

export class MainLayoutComponent implements OnInit {
  navItems: NavItem[] = NAV_ITEMS;

  showUserMenu = false;
  showTooltip = false;
  tooltipText = '';
  tooltipPosition = { x: 0, y: 0 };

  currentSection: string = '';
  allLessons: TypingLesson[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private lessonService: LessonService
  ) {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.currentSection = url.split('/')[1] || '';
    });
  }

  ngOnInit(): void {
    this.lessonService.getLessons().subscribe((lessons) => {
      this.allLessons = lessons;
    });
  }

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
