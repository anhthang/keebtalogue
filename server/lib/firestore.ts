import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    setDoc,
    collectionGroup,
    Timestamp,
    updateDoc,
    FieldValue
} from 'firebase/firestore'
import { firestoreDb } from './firebase'

export const getCollection = async (col: string) => {
    const colRef = collection(firestoreDb, col)

    const snapshot = await getDocs(colRef)

    const docs = Array.from(snapshot.docs).map((doc) => {
        return {
            ...doc.data(),
            id: doc.id,
        }
    })

    return docs
}

export const getDocument = async (col: string, docId: string) => {
    const docRef = doc(firestoreDb, col, docId)
    const docSnap = await getDoc(docRef)

    return {
        ...docSnap.data(),
    }
}

export const addDocument = async (col: string, docId: string, document: Object) => {
    await setDoc(doc(collection(firestoreDb, col), docId), document, { merge: true })
}

export const updateDocument = async (col: string, docId: string, key: string, value: any) => {
    await updateDoc(doc(collection(firestoreDb, col), docId), key, value)
}

export const add = async (col: string, document: Object) => {
    const colRef = collection(firestoreDb, col)

    const docRef = await addDoc(colRef, document)

    return docRef
}

export const del = async (col, id) => {
    const docRef = doc(firestoreDb, col, id)
    return await deleteDoc(docRef)
}
