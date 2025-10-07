/**
 * Seed script to populate TypingLessons collection
 * 
 * IMPORTANT: Before running this script, you need to:
 * 1. Run the category seeder first to populate TypingLessonCategories
 * 2. Get the actual document IDs from Firestore
 * 3. Replace the placeholder IDs in sample-lessons.json with real IDs
 */

import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import { LessonCategoryService } from '../services/lesson-category.service';
import { LessonCategory } from '../models/lesson-category.interface';
import { forkJoin } from 'rxjs';

export interface LessonSeedData {
  title: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  categoryId: string;
  order: number;
  estimatedTime: number;
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class LessonSeeder {
  private collectionName = 'TypingLessons';
  private categoryMap: Map<string, string> = new Map(); // name -> id

  constructor(
    private firestore: Firestore,
    private categoryService: LessonCategoryService
  ) {}

  /**
   * Load category map (name to ID mapping)
   */
  async loadCategoryMap(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.categoryService.getAllCategories().subscribe({
        next: (categories) => {
          categories.forEach(cat => {
            if (cat.id) {
              this.categoryMap.set(cat.Cate_Name.toLowerCase().replace(/\s+/g, '_'), cat.id);
            }
          });
          console.log('Category map loaded:', this.categoryMap.size, 'categories');
          resolve();
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          reject(error);
        }
      });
    });
  }

  /**
   * Generate sample lessons with actual category IDs
   */
  generateSampleLessons(): LessonSeedData[] {
    const lessons: LessonSeedData[] = [];

    // Helper function to get category ID
    const getCatId = (name: string): string => {
      const id = this.categoryMap.get(name);
      if (!id) {
        console.warn(`Category not found: ${name}`);
        return '';
      }
      return id;
    };

    // Home Row Keys lessons
    const homeRowId = getCatId('home_row_keys');
    if (homeRowId) {
      lessons.push(
        {
          title: "Home Row Foundation",
          content: "asdf jkl; asdf jkl; fdsa ;lkj fdsa ;lkj asdf jkl; asdf jkl;",
          difficulty: "easy",
          categoryId: homeRowId,
          order: 1,
          estimatedTime: 3,
          tags: ["home-row", "foundation", "beginner"]
        },
        {
          title: "Home Row Practice",
          content: "fff jjj ddd kkk sss lll aaa ;;; fff jjj ddd kkk sss lll aaa ;;;",
          difficulty: "easy",
          categoryId: homeRowId,
          order: 2,
          estimatedTime: 5,
          tags: ["home-row", "practice"]
        }
      );
    }

    // Letter Practice lessons
    const letterPracticeId = getCatId('letter_practice');
    if (letterPracticeId) {
      lessons.push({
        title: "Common Letter Combinations",
        content: "the and for are but not you all can her was one our out day get has him his how man new now old see two way who boy did its let put say she too use",
        difficulty: "easy",
        categoryId: letterPracticeId,
        order: 1,
        estimatedTime: 5,
        tags: ["letters", "common-words"]
      });
    }

    // Common Words lessons
    const commonWordsId = getCatId('common_words');
    if (commonWordsId) {
      lessons.push({
        title: "Frequently Used Words",
        content: "about after again back because before between both call came come could down each even find first from give good great hand help here just know last little long look made make many more most much must never next only other over part place right said same should still such take than that their them then there these they thing think this those through time under very want well were what when where which while will with work would year your",
        difficulty: "medium",
        categoryId: commonWordsId,
        order: 1,
        estimatedTime: 8,
        tags: ["common-words", "vocabulary"]
      });
    }

    // Simple Sentences lessons
    const simpleSentencesId = getCatId('simple_sentences');
    if (simpleSentencesId) {
      lessons.push({
        title: "Simple Sentences Practice",
        content: "The quick brown fox jumps over the lazy dog. A journey of a thousand miles begins with a single step. Practice makes perfect. Time flies when you are having fun.",
        difficulty: "easy",
        categoryId: simpleSentencesId,
        order: 1,
        estimatedTime: 5,
        tags: ["sentences", "phrases"]
      });
    }

    // Punctuation Basics lessons
    const punctuationId = getCatId('punctuation_basics');
    if (punctuationId) {
      lessons.push({
        title: "Basic Punctuation",
        content: "Hello, world! How are you? I am fine, thank you. Let's practice typing. It's a beautiful day. Don't worry, be happy!",
        difficulty: "easy",
        categoryId: punctuationId,
        order: 1,
        estimatedTime: 4,
        tags: ["punctuation", "comma", "period"]
      });
    }

    // Paragraphs lessons
    const paragraphsId = getCatId('paragraphs');
    if (paragraphsId) {
      lessons.push({
        title: "Paragraph Typing",
        content: "In 1976, The Bay Area Rapid Transit District, known as BART, published a report on the possibilities of extending the system eastward. This was advanced planning by definition—the inaugural commuter trains would not start rolling until the following year. But considering how long it took to build a system as complex as BART, initially envisioned in the 1950s, thinking ahead made sense.",
        difficulty: "medium",
        categoryId: paragraphsId,
        order: 1,
        estimatedTime: 10,
        tags: ["paragraphs", "long-text"]
      });
    }

    // Capitalization lessons
    const capitalizationId = getCatId('capitalization');
    if (capitalizationId) {
      lessons.push({
        title: "Capitalization Practice",
        content: "JavaScript is a programming language. Python is popular for Data Science. HTML and CSS are used for Web Development. The United States of America is in North America. Monday is the first day of the week.",
        difficulty: "medium",
        categoryId: capitalizationId,
        order: 1,
        estimatedTime: 6,
        tags: ["capitalization", "proper-nouns"]
      });
    }

    // JavaScript lessons
    const javascriptId = getCatId('javascript');
    if (javascriptId) {
      lessons.push({
        title: "JavaScript Functions",
        content: "function greet(name) { return 'Hello, ' + name + '!'; } const add = (a, b) => a + b; let result = add(5, 3); console.log(result);",
        difficulty: "medium",
        categoryId: javascriptId,
        order: 1,
        estimatedTime: 8,
        tags: ["javascript", "functions", "code"]
      });
    }

    // Python lessons
    const pythonId = getCatId('python');
    if (pythonId) {
      lessons.push({
        title: "Python Basics",
        content: "def greet(name): return f'Hello, {name}!' def add(a, b): return a + b result = add(5, 3) print(result)",
        difficulty: "medium",
        categoryId: pythonId,
        order: 1,
        estimatedTime: 7,
        tags: ["python", "functions", "code"]
      });
    }

    // HTML & CSS lessons
    const htmlCssId = getCatId('html_&_css');
    if (htmlCssId) {
      lessons.push({
        title: "HTML Structure",
        content: "<!DOCTYPE html> <html> <head> <title>My Page</title> </head> <body> <h1>Welcome</h1> <p>This is a paragraph.</p> </body> </html>",
        difficulty: "easy",
        categoryId: htmlCssId,
        order: 1,
        estimatedTime: 6,
        tags: ["html", "markup", "web"]
      });
    }

    // Basic Numbers lessons
    const basicNumbersId = getCatId('basic_numbers');
    if (basicNumbersId) {
      lessons.push({
        title: "Number Practice 0-9",
        content: "0123456789 9876543210 1234567890 0987654321 1357924680 2468013579",
        difficulty: "easy",
        categoryId: basicNumbersId,
        order: 1,
        estimatedTime: 4,
        tags: ["numbers", "digits"]
      });
    }

    // Common Symbols lessons
    const commonSymbolsId = getCatId('common_symbols');
    if (commonSymbolsId) {
      lessons.push({
        title: "Common Symbols",
        content: "@ # $ % & * ( ) - _ = + [ ] { } | \\ / < > ? ! ~ `",
        difficulty: "medium",
        categoryId: commonSymbolsId,
        order: 1,
        estimatedTime: 5,
        tags: ["symbols", "special-characters"]
      });
    }

    // Short Stories lessons
    const shortStoriesId = getCatId('short_stories');
    if (shortStoriesId) {
      lessons.push(
        {
          title: "Short Story: The Beginning",
          content: "Once upon a time, in a small village nestled between rolling hills, there lived a young girl named Emma. She had always dreamed of adventure, of seeing the world beyond the familiar streets of her hometown. One day, she decided it was time to make that dream come true.",
          difficulty: "medium",
          categoryId: shortStoriesId,
          order: 1,
          estimatedTime: 8,
          tags: ["story", "narrative", "fiction"]
        },
        {
          title: "The Lost Key",
          content: "Sarah searched everywhere for her house key. She checked her pockets, her bag, and even retraced her steps back to the store. Just when she was about to give up, she remembered leaving it on the kitchen counter that morning.",
          difficulty: "easy",
          categoryId: shortStoriesId,
          order: 2,
          estimatedTime: 5,
          tags: ["story", "short", "fiction"]
        }
      );
    }

    // Proper Posture lessons
    const properPostureId = getCatId('proper_posture');
    if (properPostureId) {
      lessons.push(
        {
          title: "Sitting Position Basics",
          content: "Sit up straight with your back against the chair. Keep your feet flat on the floor. Position your screen at eye level. Relax your shoulders and keep your wrists straight while typing.",
          difficulty: "easy",
          categoryId: properPostureId,
          order: 1,
          estimatedTime: 3,
          tags: ["posture", "ergonomics", "health"]
        },
        {
          title: "Hand Placement Guide",
          content: "Place your fingers on the home row keys. Your left fingers should rest on A S D F and your right fingers on J K L semicolon. Keep your thumbs hovering over the space bar. Maintain a curved finger position.",
          difficulty: "easy",
          categoryId: properPostureId,
          order: 2,
          estimatedTime: 4,
          tags: ["posture", "hand-position", "technique"]
        }
      );
    }

    // Typing Basics lessons
    const typingBasicsId = getCatId('typing_basics');
    if (typingBasicsId) {
      lessons.push(
        {
          title: "Touch Typing Introduction",
          content: "Touch typing means typing without looking at the keyboard. Each finger is responsible for specific keys. Practice makes perfect. Start slowly and focus on accuracy before speed.",
          difficulty: "easy",
          categoryId: typingBasicsId,
          order: 1,
          estimatedTime: 5,
          tags: ["basics", "introduction", "technique"]
        },
        {
          title: "Finger Responsibility",
          content: "Left pinky: Q A Z. Left ring: W S X. Left middle: E D C. Left index: R F V T G B. Right index: Y H N U J M. Right middle: I K comma. Right ring: O L period. Right pinky: P semicolon slash.",
          difficulty: "medium",
          categoryId: typingBasicsId,
          order: 2,
          estimatedTime: 6,
          tags: ["basics", "fingers", "technique"]
        }
      );
    }

    // Speed Building lessons
    const speedBuildingId = getCatId('speed_building');
    if (speedBuildingId) {
      lessons.push(
        {
          title: "Speed Drill: Common Words",
          content: "the and for are but not you all can her was one our out day get has him his how man new now old see two way who boy did its let put say she too use",
          difficulty: "medium",
          categoryId: speedBuildingId,
          order: 1,
          estimatedTime: 5,
          tags: ["speed", "drill", "practice"]
        },
        {
          title: "Speed Challenge: Quick Phrases",
          content: "as soon as possible. thank you very much. have a great day. see you later. talk to you soon. best regards. kind regards. looking forward. at your earliest convenience.",
          difficulty: "medium",
          categoryId: speedBuildingId,
          order: 2,
          estimatedTime: 6,
          tags: ["speed", "phrases", "challenge"]
        }
      );
    }

    // Accuracy Training lessons
    const accuracyTrainingId = getCatId('accuracy_training');
    if (accuracyTrainingId) {
      lessons.push(
        {
          title: "Accuracy Focus: Similar Letters",
          content: "minimum aluminum vacuum continuum millennium aquarium terrarium auditorium equilibrium compendium",
          difficulty: "hard",
          categoryId: accuracyTrainingId,
          order: 1,
          estimatedTime: 7,
          tags: ["accuracy", "difficult", "precision"]
        },
        {
          title: "Precision Practice",
          content: "accommodate necessary definitely separate occurrence conscience maintenance privilege guarantee committee",
          difficulty: "hard",
          categoryId: accuracyTrainingId,
          order: 2,
          estimatedTime: 8,
          tags: ["accuracy", "spelling", "precision"]
        }
      );
    }

    // Complex Text lessons
    const complexTextId = getCatId('complex_text');
    if (complexTextId) {
      lessons.push(
        {
          title: "Advanced Paragraph",
          content: "The implementation of sophisticated algorithms requires meticulous attention to detail and comprehensive understanding of computational complexity. Developers must consider various factors including time complexity, space complexity, and algorithmic efficiency when designing solutions.",
          difficulty: "hard",
          categoryId: complexTextId,
          order: 1,
          estimatedTime: 10,
          tags: ["advanced", "technical", "complex"]
        }
      );
    }

    // Technical Writing lessons
    const technicalWritingId = getCatId('technical_writing');
    if (technicalWritingId) {
      lessons.push(
        {
          title: "Technical Documentation",
          content: "The API endpoint accepts POST requests with JSON payload. Authentication requires Bearer token in the Authorization header. Response format includes status code, data object, and error messages if applicable.",
          difficulty: "hard",
          categoryId: technicalWritingId,
          order: 1,
          estimatedTime: 8,
          tags: ["technical", "documentation", "api"]
        }
      );
    }

    // Speed Tests lessons
    const speedTestsId = getCatId('speed_tests');
    if (speedTestsId) {
      lessons.push(
        {
          title: "1-Minute Speed Test",
          content: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. The five boxing wizards jump quickly. Sphinx of black quartz judge my vow.",
          difficulty: "medium",
          categoryId: speedTestsId,
          order: 1,
          estimatedTime: 2,
          tags: ["speed-test", "timed", "challenge"]
        }
      );
    }

    // Endurance Training lessons
    const enduranceTrainingId = getCatId('endurance_training');
    if (enduranceTrainingId) {
      lessons.push(
        {
          title: "Long Form Practice",
          content: "In the realm of professional typing, endurance plays a crucial role in maintaining consistent performance throughout extended periods. Regular practice sessions help build muscle memory and reduce fatigue. It is essential to take short breaks every twenty minutes to prevent strain and maintain optimal performance levels. Proper posture and ergonomic setup contribute significantly to long-term typing comfort and efficiency.",
          difficulty: "hard",
          categoryId: enduranceTrainingId,
          order: 1,
          estimatedTime: 15,
          tags: ["endurance", "long-form", "stamina"]
        }
      );
    }

    // SQL lessons
    const sqlId = getCatId('sql');
    if (sqlId) {
      lessons.push(
        {
          title: "SQL Query Basics",
          content: "SELECT * FROM users WHERE age > 18 ORDER BY name ASC; INSERT INTO products (name, price) VALUES ('Laptop', 999.99); UPDATE orders SET status = 'shipped' WHERE id = 123;",
          difficulty: "medium",
          categoryId: sqlId,
          order: 1,
          estimatedTime: 7,
          tags: ["sql", "database", "queries"]
        }
      );
    }

    // Java lessons
    const javaId = getCatId('java');
    if (javaId) {
      lessons.push(
        {
          title: "Java Class Structure",
          content: "public class HelloWorld { public static void main(String[] args) { System.out.println(\"Hello, World!\"); } }",
          difficulty: "medium",
          categoryId: javaId,
          order: 1,
          estimatedTime: 6,
          tags: ["java", "programming", "oop"]
        }
      );
    }

    // Special Characters (Programming) lessons
    const specialCharsProgId = getCatId('special_characters');
    if (specialCharsProgId) {
      lessons.push(
        {
          title: "Programming Symbols",
          content: "{ } [ ] ( ) < > ; : , . ? / \\ | & * ^ % $ # @ ! ~ ` - _ = +",
          difficulty: "hard",
          categoryId: specialCharsProgId,
          order: 1,
          estimatedTime: 6,
          tags: ["symbols", "programming", "special-chars"]
        }
      );
    }

    // Number Combinations lessons
    const numberCombinationsId = getCatId('number_combinations');
    if (numberCombinationsId) {
      lessons.push(
        {
          title: "Number Sequences",
          content: "123 456 789 147 258 369 111 222 333 444 555 666 777 888 999 101 202 303 404 505",
          difficulty: "easy",
          categoryId: numberCombinationsId,
          order: 1,
          estimatedTime: 5,
          tags: ["numbers", "sequences", "practice"]
        }
      );
    }

    // Data Entry lessons
    const dataEntryId = getCatId('data_entry');
    if (dataEntryId) {
      lessons.push(
        {
          title: "Data Entry Practice",
          content: "Invoice #12345 Date: 01/15/2024 Amount: $1,234.56 Customer ID: C-9876 Phone: 555-123-4567 ZIP: 94102",
          difficulty: "medium",
          categoryId: dataEntryId,
          order: 1,
          estimatedTime: 6,
          tags: ["data-entry", "numbers", "mixed"]
        }
      );
    }

    // Mixed Text & Numbers lessons
    const mixedTextNumbersId = getCatId('mixed_text_&_numbers');
    if (mixedTextNumbersId) {
      lessons.push(
        {
          title: "Alphanumeric Practice",
          content: "Order ABC123 shipped on 12/25/2023. Total: $456.78. Tracking: 1Z999AA10123456784. Contact: support@example.com or call 1-800-555-0199.",
          difficulty: "medium",
          categoryId: mixedTextNumbersId,
          order: 1,
          estimatedTime: 7,
          tags: ["mixed", "alphanumeric", "practical"]
        }
      );
    }

    // Advanced Punctuation lessons
    const advancedPunctuationId = getCatId('advanced_punctuation');
    if (advancedPunctuationId) {
      lessons.push(
        {
          title: "Complex Punctuation",
          content: "\"Hello,\" she said. It's a beautiful day—isn't it? The book (published in 2020) was excellent. Here's what I need: milk, eggs, and bread. She asked, \"Are you coming?\"",
          difficulty: "medium",
          categoryId: advancedPunctuationId,
          order: 1,
          estimatedTime: 6,
          tags: ["punctuation", "quotes", "advanced"]
        }
      );
    }

    // Math Symbols lessons
    const mathSymbolsId = getCatId('math_symbols');
    if (mathSymbolsId) {
      lessons.push(
        {
          title: "Mathematical Expressions",
          content: "2 + 2 = 4. 10 - 5 = 5. 3 × 4 = 12. 15 ÷ 3 = 5. x² + y² = z². a > b. c < d. m ≥ n. p ≤ q.",
          difficulty: "medium",
          categoryId: mathSymbolsId,
          order: 1,
          estimatedTime: 5,
          tags: ["math", "symbols", "equations"]
        }
      );
    }

    // Special Characters (Symbols) lessons
    const specialCharsSymId = getCatId('special_characters');
    if (specialCharsSymId && specialCharsSymId !== specialCharsProgId) {
      lessons.push(
        {
          title: "Rare Symbols Practice",
          content: "~ ` | \\ / ^ _ « » © ® ™ € £ ¥ § ¶ † ‡ • ° ± × ÷",
          difficulty: "hard",
          categoryId: specialCharsSymId,
          order: 1,
          estimatedTime: 7,
          tags: ["symbols", "rare", "special"]
        }
      );
    }

    // Classic Literature lessons
    const classicLiteratureId = getCatId('classic_literature');
    if (classicLiteratureId) {
      lessons.push(
        {
          title: "Literary Excerpt",
          content: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.",
          difficulty: "medium",
          categoryId: classicLiteratureId,
          order: 1,
          estimatedTime: 8,
          tags: ["literature", "classic", "dickens"]
        }
      );
    }

    // News Articles lessons
    const newsArticlesId = getCatId('news_articles');
    if (newsArticlesId) {
      lessons.push(
        {
          title: "News Writing Style",
          content: "Local officials announced today that the new community center will open next month. The facility includes a gymnasium, swimming pool, and meeting rooms. Mayor Johnson stated that the project came in under budget and ahead of schedule.",
          difficulty: "medium",
          categoryId: newsArticlesId,
          order: 1,
          estimatedTime: 7,
          tags: ["news", "journalism", "current-events"]
        }
      );
    }

    return lessons.filter(l => l.categoryId !== '');
  }

  /**
   * Seed lessons to Firestore
   */
  async seedLessons(): Promise<string> {
    try {
      // Load category map first
      await this.loadCategoryMap();

      // Generate lessons
      const lessons = this.generateSampleLessons();
      
      if (lessons.length === 0) {
        return 'No lessons to seed. Make sure categories are seeded first!';
      }

      const lessonsRef = collection(this.firestore, this.collectionName);
      let successCount = 0;
      let errorCount = 0;

      console.log(`Starting to seed ${lessons.length} lessons...`);

      for (const lesson of lessons) {
        try {
          await addDoc(lessonsRef, lesson);
          successCount++;
          console.log(`✓ Added: ${lesson.title}`);
        } catch (error) {
          errorCount++;
          console.error(`✗ Failed to add ${lesson.title}:`, error);
        }
      }

      const message = `Seeding completed! Success: ${successCount}, Errors: ${errorCount}`;
      console.log(message);
      return message;
    } catch (error) {
      const errorMessage = `Error seeding lessons: ${error}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Clear all lessons from Firestore
   */
  async clearLessons(): Promise<string> {
    try {
      const lessonsRef = collection(this.firestore, this.collectionName);
      const snapshot = await getDocs(lessonsRef);
      
      let deleteCount = 0;
      console.log('Starting to clear lessons...');

      for (const document of snapshot.docs) {
        await deleteDoc(doc(this.firestore, this.collectionName, document.id));
        deleteCount++;
        console.log(`✓ Deleted: ${document.data()['title']}`);
      }

      const message = `Cleared ${deleteCount} lessons`;
      console.log(message);
      return message;
    } catch (error) {
      const errorMessage = `Error clearing lessons: ${error}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Reset lessons (clear and re-seed)
   */
  async resetLessons(): Promise<string> {
    try {
      await this.clearLessons();
      await this.seedLessons();
      return 'Lessons reset successfully!';
    } catch (error) {
      throw new Error(`Error resetting lessons: ${error}`);
    }
  }

  /**
   * Get count of lessons in Firestore
   */
  async getLessonCount(): Promise<number> {
    const lessonsRef = collection(this.firestore, this.collectionName);
    const snapshot = await getDocs(lessonsRef);
    return snapshot.size;
  }
}
