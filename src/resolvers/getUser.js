export function request(ctx){
    console.log("request for getUser ctx ==============================> ", ctx)
    const {id} = ctx.args 

    return {
        operation: "GetItem", 
        key: {"user_id": {"S": id}} 
    }
}

export function response(ctx) {
    console.log("response of getUser ctx ==============================> ", ctx)
    return ctx.result
}