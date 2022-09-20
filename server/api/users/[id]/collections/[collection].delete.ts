import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)

    const { collection, id: uid } = event.context.params

    const { data, error } = await client
        .from('user_collection_items')
        .delete()
        .eq('uid', uid)
        .eq('collection_id', collection)
        .then(() =>
            client
                .from('user_collections')
                .delete()
                .eq('id', collection)
                .eq('uid', uid)
        )

    return data
})
