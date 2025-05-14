import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  // Create a new document
  async create(collectionName: string, data: any) {
    try {
      const docRef = await addDoc(collection(this.firestore, collectionName), {
        ...data,
        createdAt: new Date()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  // Get all documents from a collection
  async getAll(collectionName: string) {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Get a single document by ID
  async getById(collectionName: string, id: string) {
    try {
      const docRef = doc(this.firestore, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Document not found');
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  // Update a document
  async update(collectionName: string, id: string, data: any) {
    try {
      const docRef = doc(this.firestore, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return { id, ...data };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Delete a document
  async delete(collectionName: string, id: string) {
    try {
      const docRef = doc(this.firestore, collectionName, id);
      await deleteDoc(docRef);
      return { id };
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Query documents with conditions
  async query(collectionName: string, field: string, operator: any, value: any) {
    try {
      const q = query(
        collection(this.firestore, collectionName),
        where(field, operator, value)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }
} 