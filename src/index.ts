import * as dotenv from "dotenv";
import { FirebaseConfig, User, FirestoreService } from "./FirestoreService";
dotenv.config();

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
  //   await firestoreService.addUsers();

  //  // update data method
  await firestoreService.updateUsers();

  // delete data method
  //   await firestoreService.deleteUsers();

  // get data method
  const users = await firestoreService.getUsers();
  console.log(users);
}

main();
