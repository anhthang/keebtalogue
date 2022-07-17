import { useQuery, useBody } from 'h3'
import { addDocument } from '../../lib/firestore'

export default defineEventHandler(async (event) => {
    try {
        const query = useQuery(event.req)
        const body = await useBody(event.req)

        await addDocument(query.col as string, query.doc as string, body)

        return { success: true }
    } catch (error) {
        return { error: error.message }
    }
})
