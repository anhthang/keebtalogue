import { useQuery } from 'h3'
import { del } from '../../lib/firestore'

export default defineEventHandler(async (event) => {
    try {
        const { col, doc } = useQuery(event.req)

        await del(col, doc)

        return { success: true }
    } catch (error) {
        return { error: error.message }
    }
})
