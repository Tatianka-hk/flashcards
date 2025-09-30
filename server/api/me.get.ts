export default defineEventHandler((event) => {
    // @ts-expect-error injected by middleware
    const userId: string | undefined = event.context.userId
    if (!userId) {
        return { isAuth: false }
    }

    return { isAuth: true, userId }
})
