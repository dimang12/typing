import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

export interface TypingLesson {
  id: string;
  title: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  categoryId: string; // Reference to TypingLessonCategories document ID
  order?: number;
  estimatedTime?: number;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  constructor(private firestore: Firestore) {}

  /**
   * Get all lessons
   * @returns Observable<TypingLesson[]>
   */
  getLessons(): Observable<TypingLesson[]> {
    const lessonsRef = collection(this.firestore, 'TypingLessons');
    return from(getDocs(lessonsRef)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as TypingLesson))
      )
    );
  }

  /**
   * Get a lesson by id
   * @param id - The id of the lesson
   * @returns Observable<TypingLesson>
   */
  getLesson(id: string): Observable<TypingLesson> {
    const lessonRef = doc(this.firestore, 'TypingLessons', id);
    return from(getDoc(lessonRef)).pipe(
      map(doc => ({ id: doc.id, ...doc.data() } as TypingLesson))
    );
  }

  /**
   * Get lessons by difficulty
   * @param difficulty - The difficulty of the lessons
   * @returns Observable<TypingLesson[]>
   */   
  getLessonsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Observable<TypingLesson[]> {
    return this.getLessons().pipe(
      map(lessons => lessons.filter(lesson => lesson.difficulty === difficulty))
    );
  }

  /**
   * Get lessons by category ID
   * @param categoryId - The ID of the category
   * @returns Observable<TypingLesson[]>
   */
  getLessonsByCategoryId(categoryId: string): Observable<TypingLesson[]> {
    return this.getLessons().pipe(
      map(lessons => lessons
        .filter(lesson => lesson.categoryId === categoryId)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
      )
    );
  }

  /**
   * Count lessons by category ID
   * @param categoryId - The ID of the category
   * @returns Observable<number>
   */
  countLessonsByCategoryId(categoryId: string): Observable<number> {
    return this.getLessonsByCategoryId(categoryId).pipe(
      map(lessons => lessons.length)
    );
  }
}
