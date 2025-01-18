export function request(ctx){
    console.log("request from deleteCart =====> ", ctx)
    return {
        operation: "DeleteItem",
        key: {
            'user_id': {'S': ctx.arguments.userId},

        },
        condition: {
            expression: 'attribute_exists(user_id)',
        },
    }
}

export function response(ctx){
    console.log("response of deleteCart =====> ", ctx)
    if (ctx.result !== null){ 
        return "User Deleted Successfully"
    }
    return  "Don't Have User With This User Id"
}