import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypingComponent } from '../../features/typing/typing.component';
import { TypingLesson, LessonService } from '../../services/lesson.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TypingComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lesson: TypingLesson | undefined;
  lessonId = 'ERgFq1LmykVfnJkT60yD';

  constructor(private lessonService: LessonService) {
  }

  ngOnInit(): void {
    this.lessonService.getLesson(this.lessonId).subscribe(lesson => this.lesson = lesson);
  }
}
