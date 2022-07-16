import { useQuery } from 'h3'
import { getCollection, getDocument } from '../../lib/firestore'

export default defineEventHandler(async (event) => {
    try {
        const query = useQuery(event.req)

        const docs = query.doc
            ? await getDocument(query.col as string, query.doc as string)
            : await getCollection(query.col as string)

        return { result: docs }
    } catch (error) {
        return { result: [], error: error.message }
    }
})
