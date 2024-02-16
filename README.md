# TypeScript で Firestore を使う

環境構築をする

```bash
npm init -y
```

TypeScript を install する

```bash
npm install --save-dev typescript
```

firebase の package を追加する

```bash
npm install firebase
```

環境変数を追加する

```bash
npm i dotenv
```

dotenv のような CommonJS モジュールは、TypeScript では import \* as 構文を使用してインポートする必要がある。

```ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import * as dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// Get a list of cities from your database
async function getUsers(db) {
  const citiesCol = collection(db, "users");
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}

getUsers(db)
  .then((users) => {
    console.log(users);
  })
  .then(() => {
    console.log("done");
  })
  .catch((error) => {
    console.log("Error getting document:", error);
  });
```

`index.ts`をトランスパイルする

```bash
npx tsc src/index.ts
```

関数を実行する

```bash
node src/index.js
```

動くサンプル:

```ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore/lite";
import * as dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// Add a new document with a generated id.
async function addUsers(db: any): Promise<void> {
  const usersCol = collection(db, "users");
  await addDoc(usersCol, {
    name: "icchy",
  });
}

// Get a list of cities from your database
async function getUsers(db: any): Promise<any> {
  const userRef = collection(db, "users");
  const userSnapshot = await getDocs(userRef);
  const userList = userSnapshot.docs.map((doc) => doc.data());
  return userList;
}

// add data method
addUsers(db);

// get data method
getUsers(db);
```

成功するとこんな感じでデータが取れる

```bash
[ { name: 'hoge' }, { name: 'fuga' } ]
```

クラスにまとめてみた。

```ts
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  collection,
  getDocs,
  addDoc,
  DocumentData,
} from "firebase/firestore/lite";
import * as dotenv from "dotenv";
dotenv.config();

interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  measurementId: string | undefined;
}

interface User {
  name: string;
}

class FirestoreService {
  private db: Firestore;

  constructor(firebaseConfig: FirebaseConfig) {
    const app: FirebaseApp = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  // Add a new document with a generated id.
  async addUsers(user: User): Promise<void> {
    const usersCol = collection(this.db, "users");
    await addDoc(usersCol, user);
  }

  // Get a list of users from your database
  async getUsers(): Promise<DocumentData[]> {
    const userRef = collection(this.db, "users");
    const userSnapshot = await getDocs(userRef);
    const userList = userSnapshot.docs.map((doc) => doc.data());
    return userList;
  }
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const firestoreService = new FirestoreService(firebaseConfig);

async function main() {
  // add data method
  await firestoreService.addUsers({ name: "icchy" });

  // Promiseが解決された後に結果を表示する必要がある

  // get data method
  const users = await firestoreService.getUsers();
  console.log(users);
}

main();
```
