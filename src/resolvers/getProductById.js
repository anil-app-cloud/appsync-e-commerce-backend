export function request(ctx){
    console.log("request from getProductById ctx ====================> ", ctx)
    const {id} = ctx.args
    return {
        operation: "GetItem",
        key: {
            "product_id" : {"S": id}
        }
    }
}

export function response(ctx){
    console.log("response of getProductById ctx ====================> ", ctx)
    return ctx.result
}