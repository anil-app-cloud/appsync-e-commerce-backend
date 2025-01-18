import { util } from "@aws-appsync/utils";

export function request(ctx) {
    console.log("ctx result after user login", ctx)
    const userId = ctx.prev.result.user_id; 
    const cartId = util.autoId(); 

    return {
        operation: "PutItem", 
        key: {
            "user_id": { "S": userId }
            
        },
        attributeValues: {
           "cart_id": { "S": cartId }, 
            "products": { "L": [] }   
        },
    };
}

export function response(ctx) {
    console.log("response of cart ctx =================> ", ctx)
    return ctx.prev.result; 
}
