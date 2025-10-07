import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TypingLesson } from '../../services/lesson.service';
import { MatIconModule } from '@angular/material/icon';
import { StateService } from '../../services/state.service';

export interface SubNavItem {
  path: string;
  label: string;
}

interface LessonNode {
  name: string;
  children?: LessonNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-sub-navigation',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatIconModule
  ],
  templateUrl: './sub-navigation.component.html',
  styleUrls: ['./sub-navigation.component.css']
})
export class SubNavigationComponent implements OnInit {
  @Input() currentSection: string = '';
  @Input() allLessons: TypingLesson[] = [];
  activeLessonId: string | null = null;

  private _transformer = (node: LessonNode, level: number): FlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  constructor(private stateService: StateService) {
    this.stateService.selectedLesson$.subscribe(lesson => {
      if (lesson) {
        this.activeLessonId = lesson.id;
      }
    });
  }

  ngOnInit(): void {
  }

  onLessonSelect(lesson: TypingLesson) {
    this.activeLessonId = lesson.id;
    this.stateService.setSelectedLesson(lesson);
  }

  isLessonActive(lessonId: string): boolean {
    return this.activeLessonId === lessonId;
  }

  get subNavItems(): SubNavItem[] {
    switch (this.currentSection) {
      case 'dashboard':
        return [
          { path: '/dashboard/overview', label: 'Overview' },
          { path: '/dashboard/stats', label: 'Statistics' },
          { path: '/dashboard/progress', label: 'Progress' }
        ];
      case 'profile':
        return [
          { path: '/profile/settings', label: 'Settings' },
          { path: '/profile/history', label: 'History' },
          { path: '/profile/achievements', label: 'Achievements' }
        ];
      default:
        return [];
    }
  }
}
