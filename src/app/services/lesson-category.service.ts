import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { LessonCategory, CategoryTree } from '../models/lesson-category.interface';

@Injectable({
  providedIn: 'root'
})
export class LessonCategoryService {
  private collectionName = 'TypingLessonCategories';

  constructor(private firestore: Firestore) {}

  /**
   * Get all categories
   * @returns Observable<LessonCategory[]>
   */
  getAllCategories(): Observable<LessonCategory[]> {
    const categoriesRef = collection(this.firestore, this.collectionName);
    const q = query(categoriesRef, orderBy('Ordering', 'asc'));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as LessonCategory))
      )
    );
  }

  /**
   * Get main categories (Parent_Id is null)
   * @returns Observable<LessonCategory[]>
   */
  getMainCategories(): Observable<LessonCategory[]> {
    return this.getAllCategories().pipe(
      map(categories => 
        categories
          .filter(cat => cat.Parent_Id === null)
          .sort((a, b) => a.Ordering - b.Ordering)
      )
    );
  }

  /**
   * Get sub-categories by parent name
   * @param parentName - The Cate_Name of the parent category
   * @returns Observable<LessonCategory[]>
   */
  getSubCategories(parentName: string): Observable<LessonCategory[]> {
    const parentNameLower = parentName.toLowerCase();
    return this.getAllCategories().pipe(
      map(categories => 
        categories
          .filter(cat => cat.Parent_Id?.toLowerCase() === parentNameLower)
          .sort((a, b) => a.Ordering - b.Ordering)
      )
    );
  }

  /**
   * Get category tree structure (hierarchical)
   * @returns Observable<CategoryTree[]>
   */
  getCategoryTree(): Observable<CategoryTree[]> {
    return this.getAllCategories().pipe(
      map(categories => {
        const mainCategories = categories.filter(cat => cat.Parent_Id === null);
        
        return mainCategories.map(main => {
          const mainNameLower = main.Cate_Name.toLowerCase();
          const children = categories
            .filter(cat => cat.Parent_Id?.toLowerCase() === mainNameLower)
            .sort((a, b) => a.Ordering - b.Ordering);
          
          return {
            ...main,
            children: children.length > 0 ? children : undefined
          };
        }).sort((a, b) => a.Ordering - b.Ordering);
      })
    );
  }

  /**
   * Get a category by name
   * @param categoryName - The name of the category
   * @returns Observable<LessonCategory | undefined>
   */
  getCategoryByName(categoryName: string): Observable<LessonCategory | undefined> {
    const nameLower = categoryName.toLowerCase();
    return this.getAllCategories().pipe(
      map(categories => 
        categories.find(cat => cat.Cate_Name.toLowerCase() === nameLower)
      )
    );
  }

  /**
   * Add a new category
   * @param category - The category to add
   * @returns Promise<string> - The ID of the added document
   */
  async addCategory(category: Omit<LessonCategory, 'id'>): Promise<string> {
    const categoriesRef = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(categoriesRef, category);
    return docRef.id;
  }
}
