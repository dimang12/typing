import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonService, TypingLesson } from '../../services/lesson.service';
import { LessonCategoryService } from '../../services/lesson-category.service';
import { BreadcrumbService, BreadcrumbItem } from '../../services/breadcrumb.service';
import { CategoryTree } from '../../models/lesson-category.interface';
import { TypingComponent } from '../../features/typing/typing.component';
import { StateService } from '../../services/state.service';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [CommonModule, TypingComponent],
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit, OnDestroy {
  mainCategories: CategoryTree[] = [];
  subCategories: CategoryTree[] = [];
  lessons: TypingLesson[] = [];
  lessonCounts: Map<string, number> = new Map();
  
  selectedMainCategory: CategoryTree | null = null;
  selectedSubCategory: CategoryTree | null = null;
  selectedLesson: TypingLesson | null = null;
  
  viewMode: 'main' | 'sub' | 'lessons' | 'typing' = 'main';
  breadcrumb: BreadcrumbItem[] = [];
  
  private subscriptions: Subscription[] = [];

  constructor(
    private lessonService: LessonService,
    private categoryService: LessonCategoryService,
    private breadcrumbService: BreadcrumbService,
    private stateService: StateService
  ) {
    // Subscribe to selected lesson changes
    const lessonSub = this.stateService.selectedLesson$.subscribe(lesson => {
      if (lesson) {
        this.selectedLesson = lesson;
        this.viewMode = 'typing';
      }
    });
    this.subscriptions.push(lessonSub);

    // Subscribe to breadcrumb changes
    const breadcrumbSub = this.breadcrumbService.breadcrumb$.subscribe(items => {
      this.breadcrumb = items;
    });
    this.subscriptions.push(breadcrumbSub);
  }

  ngOnInit(): void {
    this.loadMainCategories();
    this.restoreState();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Load main categories from Firestore
   */
  loadMainCategories(): void {
    this.categoryService.getCategoryTree().subscribe(categories => {
      this.mainCategories = categories;
      this.loadLessonCounts();
    });
  }

  /**
   * Load lesson counts for all categories
   */
  loadLessonCounts(): void {
    const allCategories = this.getAllCategoryIds();
    const countObservables = allCategories.map(catId => 
      this.lessonService.countLessonsByCategoryId(catId)
    );

    forkJoin(countObservables).subscribe(counts => {
      allCategories.forEach((catId, index) => {
        this.lessonCounts.set(catId, counts[index]);
      });
    });
  }

  /**
   * Get all category IDs (main and sub)
   */
  private getAllCategoryIds(): string[] {
    const ids: string[] = [];
    this.mainCategories.forEach(main => {
      if (main.id) ids.push(main.id);
      main.children?.forEach(sub => {
        if (sub.id) ids.push(sub.id);
      });
    });
    return ids;
  }

  /**
   * Handle main category click
   */
  onMainCategoryClick(category: CategoryTree): void {
    this.selectedMainCategory = category;
    this.subCategories = category.children || [];
    this.viewMode = 'sub';
    
    // Update breadcrumb
    this.breadcrumbService.setBreadcrumb([{
      id: category.id!,
      name: category.Cate_Name,
      type: 'main'
    }]);
  }

  /**
   * Handle sub category click
   */
  onSubCategoryClick(category: CategoryTree): void {
    this.selectedSubCategory = category;
    this.viewMode = 'lessons';
    
    // Load lessons for this sub-category
    this.lessonService.getLessonsByCategoryId(category.id!).subscribe(lessons => {
      this.lessons = lessons;
    });
    
    // Update breadcrumb
    const current = this.breadcrumbService.getCurrentBreadcrumb();
    this.breadcrumbService.setBreadcrumb([
      ...current,
      {
        id: category.id!,
        name: category.Cate_Name,
        type: 'sub'
      }
    ]);
  }

  /**
   * Handle lesson click
   */
  onLessonClick(lesson: TypingLesson): void {
    this.selectedLesson = lesson;
    this.stateService.setSelectedLesson(lesson);
    this.viewMode = 'typing';
  }

  /**
   * Navigate back to main categories
   */
  backToMain(): void {
    this.selectedMainCategory = null;
    this.selectedSubCategory = null;
    this.viewMode = 'main';
    this.breadcrumbService.clearBreadcrumb();
  }

  /**
   * Navigate back to sub categories
   */
  backToSub(): void {
    this.selectedSubCategory = null;
    this.viewMode = 'sub';
    this.breadcrumbService.navigateToLevel(0);
  }

  /**
   * Navigate back to lessons list
   */
  backToLessons(): void {
    this.selectedLesson = null;
    this.viewMode = 'lessons';
  }

  /**
   * Handle breadcrumb click
   */
  onBreadcrumbClick(index: number): void {
    const item = this.breadcrumb[index];
    
    if (item.type === 'main') {
      // Find the main category and navigate to it
      const mainCat = this.mainCategories.find(c => c.id === item.id);
      if (mainCat) {
        this.onMainCategoryClick(mainCat);
      }
    } else if (item.type === 'sub') {
      // Already in sub view, just update breadcrumb
      this.breadcrumbService.navigateToLevel(index);
      this.viewMode = 'lessons';
    }
  }

  /**
   * Restore state from breadcrumb on page load
   */
  private restoreState(): void {
    const breadcrumb = this.breadcrumbService.getCurrentBreadcrumb();
    if (breadcrumb.length === 0) return;

    // Wait for categories to load
    setTimeout(() => {
      // Restore main category
      const mainItem = breadcrumb[0];
      const mainCat = this.mainCategories.find(c => c.id === mainItem.id);
      
      if (mainCat) {
        this.selectedMainCategory = mainCat;
        this.subCategories = mainCat.children || [];
        
        // If there's a sub-category in breadcrumb
        if (breadcrumb.length > 1) {
          const subItem = breadcrumb[1];
          const subCat = this.subCategories.find(c => c.id === subItem.id);
          
          if (subCat) {
            this.selectedSubCategory = subCat;
            this.viewMode = 'lessons';
            
            // Load lessons
            this.lessonService.getLessonsByCategoryId(subCat.id!).subscribe(lessons => {
              this.lessons = lessons;
            });
          }
        } else {
          this.viewMode = 'sub';
        }
      }
    }, 500);
  }

  /**
   * Get lesson count for a category
   */
  getLessonCount(categoryId: string | undefined): number {
    if (!categoryId) return 0;
    return this.lessonCounts.get(categoryId) || 0;
  }

  /**
   * Get total lesson count for main category (including all sub-categories)
   */
  getTotalLessonCount(mainCategory: CategoryTree): number {
    let total = 0;
    if (mainCategory.id) {
      total += this.getLessonCount(mainCategory.id);
    }
    mainCategory.children?.forEach(sub => {
      if (sub.id) {
        total += this.getLessonCount(sub.id);
      }
    });
    return total;
  }
}