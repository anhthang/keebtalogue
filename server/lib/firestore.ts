import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    deleteDoc,
    deleteField,
    doc,
    query,
    where,
    setDoc,
    collectionGroup,
    Timestamp,
    updateDoc,
    FieldValue,
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

export const addDocument = async (
    col: string,
    docId: string,
    document: Object
) => {
    await setDoc(doc(firestoreDb, col, docId), document, {
        merge: true,
    })
}

export const updateDocument = async (
    col: string,
    docId: string,
    document: { [x: string]: any }
) => {
    await updateDoc(doc(firestoreDb, col, docId), document)
}

export const add = async (col: string, document: Object) => {
    const colRef = collection(firestoreDb, col)

    const docRef = await addDoc(colRef, document)

    return docRef
}

export const del = async (col, docId, field) => {
    const docRef = doc(firestoreDb, col, docId)
    return field
        ? await updateDoc(docRef, { [field]: deleteField() })
        : await deleteDoc(docRef)
}
