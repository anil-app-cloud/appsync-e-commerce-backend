export function request(ctx){
    console.log("request from getCartIterms ctx ====================> ", ctx)
    const {userId} = ctx.args 

    return {
        operation: "GetItem",
        key: {"user_id": {"S": userId}},
    }
}

export function response(ctx){
    console.log("response of getCartIterms ctx ====================> ", ctx)
    return ctx.result.products
}