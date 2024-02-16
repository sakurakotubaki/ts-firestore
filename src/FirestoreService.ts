import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, collection, getDocs, addDoc, updateDoc, deleteDoc, DocumentData } from "firebase/firestore/lite";

export interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  measurementId: string | undefined;
}

export interface User {
  name: string;
}

export class FirestoreService {
  private db: Firestore;

  constructor(firebaseConfig: FirebaseConfig) {
    const app: FirebaseApp = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  // jboy, minn, yui, taiseが配列に配列に入っている。for文でループして追加する
    async addUsers(): Promise<void> {
        const usersCol = collection(this.db, "users");
        const users = ["jboy", "minn", "yui", "taise"];
        for (const user of users) {
        await addDoc(usersCol, { name: user });
        }
    }

    // forEachを使って、jboyという名前のドキュメンをJboyさんにupadateする
    async updateUsers(): Promise<void> {
        const userRef = collection(this.db, "users");
        const userSnapshot = await getDocs(userRef);
        userSnapshot.forEach((doc) => {
        if (doc.data().name === "jboy") {
            updateDoc(doc.ref, { name: "Jboyさん" });
        }
        });
    }


  // forEachを使って全てのドキュメントを削除する
    // async deleteUsers(): Promise<void> {
    //     const userRef = collection(this.db, "users");
    //     const userSnapshot = await getDocs(userRef);
    //     userSnapshot.forEach((doc) => {
    //     deleteDoc(doc.ref);// refはドキュメントの参照
    //     });
    // }

  // forEachを使って特定の条件に一致するドキュメントを削除する
    // async deleteUsers(): Promise<void> {
    //     const userRef = collection(this.db, "users");
    //     const userSnapshot = await getDocs(userRef);
    //     userSnapshot.forEach((doc) => {
    //     if (doc.data().name === "icchy") {
    //         deleteDoc(doc.ref);
    //     }
    //     });
    // }

  // Get a list of users from your database
  async getUsers(): Promise<DocumentData[]> {
    const userRef = collection(this.db, "users");
    const userSnapshot = await getDocs(userRef);
    const userList = userSnapshot.docs.map((doc) => doc.data());
    return userList;
  }
}