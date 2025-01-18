export function request(ctx){
    console.log("request from deleteUser =====> ", ctx)
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
    console.log("response of deleteUser =====> ", ctx)
    if (ctx.result !== null){ 
        return "User Deleted Successfully"
    }
    return util.error("User Id Not Exits", "Don't Have User With This User id", "Don't Have User With This User id"); 
}