import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TypingLesson, LessonService } from '../../services/lesson.service';
import { StateService } from '../../services/state.service';
import { Subscription } from 'rxjs';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-typing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.css']
})
export class TypingComponent implements OnInit, OnDestroy {
  @ViewChild('inputField') inputField!: ElementRef;
  @ViewChild('wpmCanvas', { static: false }) wpmCanvas!: ElementRef<HTMLCanvasElement>;
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
  // history of recent WPM values for sparkline chart
  private readonly INITIAL_WPM_HISTORY_LENGTH = 12;
  wpmHistory: number[] = Array(this.INITIAL_WPM_HISTORY_LENGTH).fill(0);

  // Generate SVG polyline points for sparkline
  get sparklinePoints(): string {
    if (!this.wpmHistory || this.wpmHistory.length === 0) return '';
    const max = Math.max(...this.wpmHistory, 1);
    const len = this.wpmHistory.length;
    return this.wpmHistory.map((v, i) => {
      const x = (i * (80 / (len - 1 || 1)));
      const y = 24 - Math.min(24, (v / max) * 24);
      return `${x},${y}`;
    }).join(' ');
  }
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

  private wpmChart?: Chart;

  ngOnInit() {
    this.targetText = this.lesson.content;
    this.startNewGame();
  }

  ngAfterViewInit() {
    // Focus input after view is initialized
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    });

    // Initialize Chart.js sparkline
    if (this.wpmCanvas) {
      const canvas = this.wpmCanvas.nativeElement;
      // Ensure canvas has explicit size in device pixels
      canvas.width = 80;
      canvas.height = 24;
      canvas.style.width = '80px';
      canvas.style.height = '24px';
      // Create Chart using the canvas element directly
      const initialData = this.wpmHistory && this.wpmHistory.length ? [...this.wpmHistory] : [0];
      try {
        this.wpmChart = new Chart(canvas, {
          type: 'line',
          data: {
            labels: initialData.map((_, i) => i.toString()),
            datasets: [{
              data: initialData,
              borderColor: '#7c3aed',
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 0,
              fill: false,
              backgroundColor: 'transparent'
            }]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
              x: { display: false },
              y: { display: false, min: 0 }
            },
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            elements: { line: { capBezierPoints: true } }
          }
        } as ChartConfiguration);
        console.debug('[Typing] WPM chart initialized', { canvas, chart: this.wpmChart });
      } catch (err) {
        console.error('[Typing] Failed to initialize WPM chart', err);
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.wpmChart?.destroy();
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
  // reset history to flat zeros so the sparkline shows a baseline before typing
  this.wpmHistory = Array(this.INITIAL_WPM_HISTORY_LENGTH).fill(0);
    
    // Focus input when starting new game
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    });
    // ensure chart shows initial state after game start
    setTimeout(() => this.refreshWpmChart(), 50);
  }

  private refreshWpmChart() {
    if (!this.wpmChart) return;
    const data = this.wpmHistory && this.wpmHistory.length ? this.wpmHistory : [0];
    this.wpmChart.data.labels = data.map((_, i) => i.toString());
    this.wpmChart.data.datasets![0].data = data as any;
    try { this.wpmChart.update('none'); } catch (e) { /* ignore */ }
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
        // record to history if changed
        const last = this.wpmHistory.length ? this.wpmHistory[this.wpmHistory.length - 1] : null;
        if (last !== this.wpm) {
          this.wpmHistory.push(this.wpm);
          if (this.wpmHistory.length > 24) this.wpmHistory.shift();
          // update chart
          if (this.wpmChart) {
            this.wpmChart.data.labels = this.wpmHistory.map((_, i) => i.toString());
            this.wpmChart.data.datasets![0].data = this.wpmHistory as any;
            this.wpmChart.update('none');
          }
        }
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