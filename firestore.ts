// firestore.ts
import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { db } from "./firebaseConfig";

const PAGE_SIZE = 5;

export async function getInitialPosts() {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(PAGE_SIZE)
  );
  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];
  return { posts, lastVisible };
}

export async function getNextPosts(lastVisible: any) {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    startAfter(lastVisible),
    limit(PAGE_SIZE)
  );
  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const newLastVisible = snapshot.docs[snapshot.docs.length - 1];
  return { posts, lastVisible: newLastVisible };
}
