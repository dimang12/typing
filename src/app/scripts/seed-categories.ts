/**
 * Seed script to populate TypingLessonCategories collection
 * 
 * Usage:
 * 1. Import this component in your app
 * 2. Add a button in your admin panel to trigger seedCategories()
 * 3. Or call it from ngOnInit in a temporary component
 */

import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import categoriesData from '../../assets/typing-lesson-categories.json';

@Injectable({
  providedIn: 'root'
})
export class CategorySeeder {
  private collectionName = 'TypingLessonCategories';

  constructor(private firestore: Firestore) {}

  /**
   * Seed categories to Firestore
   * @returns Promise with result message
   */
  async seedCategories(): Promise<string> {
    try {
      const categoriesRef = collection(this.firestore, this.collectionName);
      let successCount = 0;
      let errorCount = 0;

      console.log('Starting to seed categories...');

      for (const category of categoriesData) {
        try {
          await addDoc(categoriesRef, {
            Cate_Name: category.Cate_Name,
            Color: category.Color,
            Description: category.Description,
            Icon: category.Icon,
            Ordering: category.Ordering,
            Parent_Id: category.Parent_Id
          });
          successCount++;
          console.log(`✓ Added: ${category.Cate_Name}`);
        } catch (error) {
          errorCount++;
          console.error(`✗ Failed to add ${category.Cate_Name}:`, error);
        }
      }

      const message = `Seeding completed! Success: ${successCount}, Errors: ${errorCount}`;
      console.log(message);
      return message;
    } catch (error) {
      const errorMessage = `Error seeding categories: ${error}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Clear all categories from Firestore (use with caution!)
   * @returns Promise with result message
   */
  async clearCategories(): Promise<string> {
    try {
      const categoriesRef = collection(this.firestore, this.collectionName);
      const snapshot = await getDocs(categoriesRef);
      
      let deleteCount = 0;
      console.log('Starting to clear categories...');

      for (const document of snapshot.docs) {
        await deleteDoc(doc(this.firestore, this.collectionName, document.id));
        deleteCount++;
        console.log(`✓ Deleted: ${document.data()['Cate_Name']}`);
      }

      const message = `Cleared ${deleteCount} categories`;
      console.log(message);
      return message;
    } catch (error) {
      const errorMessage = `Error clearing categories: ${error}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Reset categories (clear and re-seed)
   * @returns Promise with result message
   */
  async resetCategories(): Promise<string> {
    try {
      await this.clearCategories();
      await this.seedCategories();
      return 'Categories reset successfully!';
    } catch (error) {
      throw new Error(`Error resetting categories: ${error}`);
    }
  }

  /**
   * Get count of categories in Firestore
   * @returns Promise with count
   */
  async getCategoryCount(): Promise<number> {
    const categoriesRef = collection(this.firestore, this.collectionName);
    const snapshot = await getDocs(categoriesRef);
    return snapshot.size;
  }
}
