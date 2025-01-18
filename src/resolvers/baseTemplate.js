
export function request(ctx) {
    const { input } = ctx.arguments

    return {
        operation: "Invoke",
        payload: input
    }
}


export function response(ctx) {
    return ctx.prev.result
}
