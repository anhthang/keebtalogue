import { useQuery } from 'h3'
import { del } from '../../lib/firestore'

export default defineEventHandler(async (event) => {
    try {
        const { col, doc, field } = useQuery(event.req)

        await del(col, doc, field)

        return { success: true }
    } catch (error) {
        return { error: error.message }
    }
})
