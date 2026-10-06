import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    // Attempt reading from server to test online connectivity
    await getDocFromServer(doc(db, 'resume_profiles', 'active_profile'));
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    // Any permission or missing document error still confirms server contact
    return true;
  }
}
