
export function request(ctx){
    console.log("request for getAllUsers ctx ==============================> ", ctx)
    return {
        operation: "Scan"
    }
}

export function response(ctx){
    console.log("response of getAllUsers ctx ==============================> ", ctx)
    return ctx.result.items
}
