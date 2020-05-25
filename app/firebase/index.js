import * as firebase from 'firebase/app';
import firebaseConfig from './config';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const provider = new firebase.auth.EmailAuthProvider();
export const auth = firebaseApp.auth();
export const firestore = firebaseApp.firestore();
