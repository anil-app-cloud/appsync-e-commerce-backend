export function request(ctx){
    console.log("request from getCarts ctx ====================> ", ctx)
    return {operation: "Scan"}
}

export function response(ctx){
    console.log("response of getCarts ctx ====================> ", ctx)
    return ctx.result.items
}