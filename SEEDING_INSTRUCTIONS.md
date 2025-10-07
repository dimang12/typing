# Category Seeding Instructions

## Overview
This guide explains how to populate the `TypingLessonCategories` collection in Firestore with 40 pre-defined categories.

## Category Structure

### Fields
- **Cate_Name**: Category name (e.g., "Introduction", "Basic")
- **Color**: Tailwind CSS color class (e.g., "bg-blue-500")
- **Description**: Brief description of the category
- **Icon**: Material icon name (e.g., "book", "keyboard")
- **Ordering**: Display order number
- **Parent_Id**: Reference to parent category name (lowercase) or `null` for main categories

### Hierarchy
- **Main Categories** (Parent_Id = null): 8 categories
  - Introduction
  - Basic
  - Intermediate
  - Advanced
  - Programming
  - Numbers
  - Symbols
  - Stories

- **Sub-Categories** (Parent_Id = parent name): 32 categories
  - Each main category has 3-6 sub-categories

## How to Seed Categories

### Method 1: Using the Admin Panel (Recommended)

1. **Navigate to the seed page:**
   ```
   http://localhost:4200/admin/seed
   ```

2. **Choose an action:**
   - **Seed Categories**: Adds all 40 categories from JSON to Firestore
   - **Reset Categories**: Clears existing and re-seeds from JSON
   - **Clear All Categories**: Removes all categories (⚠️ use with caution)

3. **Click the button** and confirm the action

4. **Monitor the console** for detailed logs

### Method 2: Using the Service Directly

```typescript
import { CategorySeeder } from './scripts/seed-categories';

constructor(private seeder: CategorySeeder) {}

async seedData() {
  try {
    const result = await this.seeder.seedCategories();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Category List (40 Total)

### 1. Introduction (3 sub-categories)
- Home Row Keys
- Proper Posture
- Typing Basics

### 2. Basic (4 sub-categories)
- Letter Practice
- Common Words
- Simple Sentences
- Punctuation Basics

### 3. Intermediate (4 sub-categories)
- Paragraphs
- Capitalization
- Speed Building
- Accuracy Training

### 4. Advanced (4 sub-categories)
- Complex Text
- Technical Writing
- Speed Tests
- Endurance Training

### 5. Programming (6 sub-categories)
- JavaScript
- Python
- HTML & CSS
- Java
- SQL
- Special Characters

### 6. Numbers (4 sub-categories)
- Basic Numbers
- Number Combinations
- Data Entry
- Mixed Text & Numbers

### 7. Symbols (4 sub-categories)
- Common Symbols
- Advanced Punctuation
- Math Symbols
- Special Characters

### 8. Stories (3 sub-categories)
- Short Stories
- Classic Literature
- News Articles

## Using Categories in Your App

### Get All Categories
```typescript
import { LessonCategoryService } from './services/lesson-category.service';

constructor(private categoryService: LessonCategoryService) {}

ngOnInit() {
  this.categoryService.getAllCategories().subscribe(categories => {
    console.log('All categories:', categories);
  });
}
```

### Get Main Categories Only
```typescript
this.categoryService.getMainCategories().subscribe(mainCategories => {
  console.log('Main categories:', mainCategories);
});
```

### Get Sub-Categories
```typescript
this.categoryService.getSubCategories('introduction').subscribe(subCats => {
  console.log('Introduction sub-categories:', subCats);
});
```

### Get Category Tree (Hierarchical)
```typescript
this.categoryService.getCategoryTree().subscribe(tree => {
  console.log('Category tree:', tree);
  // tree[0].children will contain sub-categories
});
```

## Firestore Structure Example

```
TypingLessonCategories/
├── [auto-id-1]
│   ├── Cate_Name: "Introduction"
│   ├── Color: "bg-blue-500"
│   ├── Description: "Get started with typing basics..."
│   ├── Icon: "book"
│   ├── Ordering: 1
│   └── Parent_Id: null
│
├── [auto-id-2]
│   ├── Cate_Name: "Home Row Keys"
│   ├── Color: "bg-blue-400"
│   ├── Description: "Master the foundation keys..."
│   ├── Icon: "keyboard"
│   ├── Ordering: 1
│   └── Parent_Id: "introduction"
│
└── ... (38 more categories)
```

## Parent_Id Reference System

The `Parent_Id` field uses the **lowercase name** of the parent category:

- Main category "Introduction" → `Parent_Id: null`
- Sub-category "Home Row Keys" → `Parent_Id: "introduction"`
- Sub-category "JavaScript" → `Parent_Id: "programming"`

This allows for flexible querying and hierarchical organization.

## Troubleshooting

### Categories not appearing?
1. Check Firebase console for the collection
2. Verify Firestore rules allow read/write
3. Check browser console for errors

### Duplicate categories?
Use the "Reset Categories" button to clear and re-seed

### Need to modify categories?
1. Edit `src/assets/typing-lesson-categories.json`
2. Run "Reset Categories" to update Firestore

## Next Steps

After seeding categories:
1. Update the lessons menu to use `LessonCategoryService`
2. Create lessons and link them to categories
3. Build the category navigation UI
4. Implement filtering by category and sub-category

## Files Reference

- **JSON Data**: `src/assets/typing-lesson-categories.json`
- **Interface**: `src/app/models/lesson-category.interface.ts`
- **Service**: `src/app/services/lesson-category.service.ts`
- **Seeder**: `src/app/scripts/seed-categories.ts`
- **Admin UI**: `src/app/admin/seed-data/seed-data.component.ts`
