import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LessonCategoryService } from '../../../services/lesson-category.service';
import { LessonService, TypingLesson } from '../../../services/lesson.service';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { StateService } from '../../../services/state.service';
import { CategoryTree } from '../../../models/lesson-category.interface';

@Component({
  selector: 'app-lessons-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lessons-menu.component.html',
  styleUrls: ['./lessons-menu.component.css']
})
export class LessonsMenuComponent implements OnInit {
  @Output() closeMenu = new EventEmitter<void>();
  
  mainCategories: CategoryTree[] = [];
  subCategories: CategoryTree[] = [];
  lessons: TypingLesson[] = [];
  
  selectedMainCategory: CategoryTree | null = null;
  selectedSubCategory: CategoryTree | null = null;
  
  viewMode: 'main' | 'sub' | 'lessons' = 'main';

  constructor(
    private categoryService: LessonCategoryService,
    private lessonService: LessonService,
    private breadcrumbService: BreadcrumbService,
    private stateService: StateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMainCategories();
  }

  loadMainCategories(): void {
    // Use getCategoryTree so each main category includes its `children` array
    this.categoryService.getCategoryTree().subscribe(categories => {
      this.mainCategories = categories;
      console.log('Loaded main categories (with children):', categories);
    });
  }

  onMainCategoryClick(category: CategoryTree): void {
    this.selectedMainCategory = category;
    this.viewMode = 'sub';
    
    // Load sub-categories
    this.categoryService.getSubCategories(category.Cate_Name).subscribe(subCats => {
      this.subCategories = subCats;
      console.log('Loaded sub-categories:', subCats);
    });
    
    // Update breadcrumb
    this.breadcrumbService.setBreadcrumb([{
      id: category.id!,
      name: category.Cate_Name,
      type: 'main'
    }]);
  }

  onSubCategoryClick(subCategory: CategoryTree): void {
    this.selectedSubCategory = subCategory;
    this.viewMode = 'lessons';
    
    // Load lessons for this sub-category
    this.lessonService.getLessonsByCategoryId(subCategory.id!).subscribe(lessons => {
      this.lessons = lessons;
      console.log('Loaded lessons:', lessons);
    });
    
    // Update breadcrumb
    const current = this.breadcrumbService.getCurrentBreadcrumb();
    this.breadcrumbService.setBreadcrumb([
      ...current,
      {
        id: subCategory.id!,
        name: subCategory.Cate_Name,
        type: 'sub'
      }
    ]);
  }

  onLessonClick(lesson: TypingLesson): void {
    // Set the selected lesson in state service
    this.stateService.setSelectedLesson(lesson);
    
    // Close the menu
    this.closeMenu.emit();
  }

  onBackToMain(): void {
    this.selectedMainCategory = null;
    this.selectedSubCategory = null;
    this.viewMode = 'main';
    this.breadcrumbService.clearBreadcrumb();
  }

  onBackToSub(): void {
    this.selectedSubCategory = null;
    this.viewMode = 'sub';
    this.breadcrumbService.navigateToLevel(0);
  }

  getCategoryIcon(category: CategoryTree): string {
    return category.Icon || 'folder';
  }

  getCategoryColor(category: CategoryTree): string {
    return category.Color || 'bg-gray-500';
  }

  onClose(): void {
    this.closeMenu.emit();
  }
}