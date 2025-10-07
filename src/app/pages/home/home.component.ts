import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypingComponent } from '../../features/typing/typing.component';
import { TypingLesson, LessonService } from '../../services/lesson.service';
import { BreadcrumbService, BreadcrumbItem } from '../../services/breadcrumb.service';
import { StateService } from '../../services/state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TypingComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  selectedLesson: TypingLesson | null = null;
  breadcrumb: BreadcrumbItem[] = [];
  showTyping = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private lessonService: LessonService,
    private breadcrumbService: BreadcrumbService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    // Subscribe to selected lesson changes
    const lessonSub = this.stateService.selectedLesson$.subscribe(lesson => {
      if (lesson) {
        this.selectedLesson = lesson;
        this.showTyping = true;
      }
    });
    this.subscriptions.push(lessonSub);

    // Subscribe to breadcrumb changes
    const breadcrumbSub = this.breadcrumbService.breadcrumb$.subscribe(items => {
      this.breadcrumb = items;
    });
    this.subscriptions.push(breadcrumbSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onBackToHome(): void {
    this.selectedLesson = null;
    this.showTyping = false;
    this.breadcrumbService.clearBreadcrumb();
  }
}