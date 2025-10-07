import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TypingLesson, LessonService } from '../../services/lesson.service';
import { StateService } from '../../services/state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-typing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.css']
})
export class TypingComponent implements OnInit, OnDestroy {
  @ViewChild('inputField') inputField!: ElementRef;
  @Input() lesson!: TypingLesson;
  @Output() nextLesson = new EventEmitter<void>();
  
  targetText = '';
  userInput = '';
  isGameActive = true;
  isGameComplete = false;
  isPaused = false;
  startTime: number | null = null;
  pausedTime: number | null = null;
  totalPausedTime = 0;
  wpm = 0;
  accuracy = 100;
  correctChars = 0;
  totalChars = 0;
  private subscription: Subscription;

  constructor(
    private stateService: StateService,
    private lessonService: LessonService
  ) {
    this.subscription = this.stateService.selectedLesson$.subscribe(lesson => {
      if (lesson) {
        this.lesson = lesson;
        this.targetText = lesson.content;
        this.startNewGame();
      }
    });
  }

  ngOnInit() {
    this.targetText = this.lesson.content;
    this.startNewGame();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    // Focus input after view is initialized
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    });
  }

  startNewGame() {
    this.userInput = '';
    this.isGameActive = true;
    this.isGameComplete = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedTime = null;
    this.totalPausedTime = 0;
    this.wpm = 0;
    this.accuracy = 100;
    this.correctChars = 0;
    this.totalChars = 0;
    
    // Focus input when starting new game
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    });
  }

  onKeyDown(event: KeyboardEvent) {
    // Prevent default behavior for tab key
    if (event.key === 'Tab') {
      event.preventDefault();
    }
    
    // Prevent typing if game is not active
    if (!this.isGameActive) {
      event.preventDefault();
    }

    // Start timer on first keypress
    if (this.startTime === null && this.userInput.length === 0) {
      this.startTime = Date.now();
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.pausedTime = Date.now();
      this.isGameActive = false;
    } else {
      if (this.pausedTime) {
        this.totalPausedTime += Date.now() - this.pausedTime;
        this.pausedTime = null;
      }
      this.isGameActive = true;
      this.inputField.nativeElement.focus();
    }
  }

  checkInput() {
    if (!this.isGameActive || this.isPaused) return;

    this.totalChars = this.userInput.length;
    this.correctChars = 0;

    for (let i = 0; i < this.userInput.length; i++) {
      if (this.userInput[i] === this.targetText[i]) {
        this.correctChars++;
      }
    }

    // Calculate WPM only if timer has started
    if (this.startTime !== null) {
      const currentTime = Date.now();
      const timeElapsed = (currentTime - this.startTime) / 1000 / 60; // in minutes
      
      // Only calculate WPM if at least 1 second has passed
      if (timeElapsed > 0) {
        // WPM = (correct characters / 5) / time in minutes
        const wordsTyped = this.correctChars / 5;
        this.wpm = Math.round(wordsTyped / timeElapsed);
      }
    }
    
    // Calculate accuracy
    this.accuracy = Math.round((this.correctChars / this.totalChars) * 100) || 100;

    // Check if game is complete
    if (this.userInput.length === this.targetText.length) {
      this.isGameActive = false;
      this.isGameComplete = true;
    }
  }

  getCharClass(index: number): string {
    if (index >= this.userInput.length) return 'text-gray-400';
    if (this.userInput[index] === this.targetText[index]) {
      return 'text-green-600';
    }
    return 'text-red-600';
  }

  focusInput() {
    this.inputField.nativeElement.focus();
  }

  loadNextLesson() {
    if (!this.lesson.categoryId) {
      console.warn('No category ID found for current lesson');
      return;
    }

    // Get all lessons in the same category
    this.lessonService.getLessonsByCategoryId(this.lesson.categoryId).subscribe(lessons => {
      // Find current lesson index
      const currentIndex = lessons.findIndex(l => l.id === this.lesson.id);
      
      if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
        // Load next lesson in the same category
        const nextLesson = lessons[currentIndex + 1];
        this.stateService.setSelectedLesson(nextLesson);
      } else {
        // No more lessons in this category
        alert('🎉 Congratulations! You\'ve completed all lessons in this category!');
        this.startNewGame();
      }
    });
  }
} 