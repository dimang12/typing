import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BreadcrumbItem {
  id: string;
  name: string;
  type: 'main' | 'sub';
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private readonly STORAGE_KEY = 'lesson_breadcrumb';
  private breadcrumbSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
  public breadcrumb$: Observable<BreadcrumbItem[]> = this.breadcrumbSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Set breadcrumb items
   */
  setBreadcrumb(items: BreadcrumbItem[]): void {
    this.breadcrumbSubject.next(items);
    this.saveToStorage(items);
  }

  /**
   * Add item to breadcrumb
   */
  addBreadcrumb(item: BreadcrumbItem): void {
    const current = this.breadcrumbSubject.value;
    const updated = [...current, item];
    this.setBreadcrumb(updated);
  }

  /**
   * Clear breadcrumb
   */
  clearBreadcrumb(): void {
    this.breadcrumbSubject.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Get current breadcrumb
   */
  getCurrentBreadcrumb(): BreadcrumbItem[] {
    return this.breadcrumbSubject.value;
  }

  /**
   * Navigate back to specific breadcrumb level
   */
  navigateToLevel(index: number): void {
    const current = this.breadcrumbSubject.value;
    const updated = current.slice(0, index + 1);
    this.setBreadcrumb(updated);
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(items: BreadcrumbItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving breadcrumb to localStorage:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as BreadcrumbItem[];
        this.breadcrumbSubject.next(items);
      }
    } catch (error) {
      console.error('Error loading breadcrumb from localStorage:', error);
    }
  }
}
