import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TypingLesson } from './lesson.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private selectedLessonSubject = new BehaviorSubject<TypingLesson | null>(null);
  selectedLesson$ = this.selectedLessonSubject.asObservable();

  setSelectedLesson(lesson: TypingLesson) {
    this.selectedLessonSubject.next(lesson);
  }

  getSelectedLesson(): TypingLesson | null {
    return this.selectedLessonSubject.value;
  }
} 