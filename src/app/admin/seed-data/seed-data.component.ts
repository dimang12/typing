import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategorySeeder } from '../../scripts/seed-categories';
import { LessonSeeder } from '../../scripts/seed-lessons';

@Component({
  selector: 'app-seed-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seed-data.component.html',
  styleUrls: ['./seed-data.component.css']
})
export class SeedDataComponent {
  isLoading = false;
  message = '';
  categoryCount = 0;
  lessonCount = 0;

  constructor(
    private categorySeeder: CategorySeeder,
    private lessonSeeder: LessonSeeder
  ) {
    this.loadCounts();
  }

  async loadCounts() {
    try {
      this.categoryCount = await this.categorySeeder.getCategoryCount();
      this.lessonCount = await this.lessonSeeder.getLessonCount();
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  }

  async seedCategories() {
    if (!confirm('Are you sure you want to seed categories? This will add all categories from the JSON file.')) {
      return;
    }

    this.isLoading = true;
    this.message = 'Seeding categories...';

    try {
      const result = await this.categorySeeder.seedCategories();
      this.message = result;
      await this.loadCounts();
    } catch (error) {
      this.message = `Error: ${error}`;
    } finally {
      this.isLoading = false;
    }
  }

  async clearCategories() {
    if (!confirm('⚠️ WARNING: This will delete ALL categories from Firestore. Are you sure?')) {
      return;
    }

    this.isLoading = true;
    this.message = 'Clearing categories...';

    try {
      const result = await this.categorySeeder.clearCategories();
      this.message = result;
      await this.loadCounts();
    } catch (error) {
      this.message = `Error: ${error}`;
    } finally {
      this.isLoading = false;
    }
  }

  async resetCategories() {
    if (!confirm('⚠️ WARNING: This will delete ALL existing categories and re-seed them. Are you sure?')) {
      return;
    }

    this.isLoading = true;
    this.message = 'Resetting categories...';

    try {
      const result = await this.categorySeeder.resetCategories();
      this.message = result;
      await this.loadCounts();
    } catch (error) {
      this.message = `Error: ${error}`;
    } finally {
      this.isLoading = false;
    }
  }

  // Lesson seeding methods
  async seedLessons() {
    if (!confirm('Are you sure you want to seed lessons? Make sure categories are seeded first!')) {
      return;
    }

    this.isLoading = true;
    this.message = 'Seeding lessons...';

    try {
      const result = await this.lessonSeeder.seedLessons();
      this.message = result;
      await this.loadCounts();
    } catch (error) {
      this.message = `Error: ${error}`;
    } finally {
      this.isLoading = false;
    }
  }

  async clearLessons() {
    if (!confirm('⚠️ WARNING: This will delete ALL lessons from Firestore. Are you sure?')) {
      return;
    }

    this.isLoading = true;
    this.message = 'Clearing lessons...';

    try {
      const result = await this.lessonSeeder.clearLessons();
      this.message = result;
      await this.loadCounts();
    } catch (error) {
      this.message = `Error: ${error}`;
    } finally {
      this.isLoading = false;
    }
  }

  async resetLessons() {
    if (!confirm('⚠️ WARNING: This will delete ALL existing lessons and re-seed them. Are you sure?')) {
      return;
    }

    this.isLoading = true;
    this.message = 'Resetting lessons...';

    try {
      const result = await this.lessonSeeder.resetLessons();
      this.message = result;
      await this.loadCounts();
    } catch (error) {
      this.message = `Error: ${error}`;
    } finally {
      this.isLoading = false;
    }
  }
}