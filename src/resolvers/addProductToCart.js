export function request(ctx) {
    console.log("request from cart ctx ====================> ", ctx)
    const { userId, product } = ctx.args;
    
    return {
        version: "2018-05-29",
        operation: "UpdateItem",
        key: {
            user_id: util.dynamodb.toDynamoDB(userId)
        },
        update: {
            expression: "SET products = list_append(if_not_exists(products, :emptyList), :newProduct)",
            expressionValues: {
                ":emptyList": util.dynamodb.toDynamoDB([]),
                ":newProduct": util.dynamodb.toDynamoDB([{
                    product_id: product.product_id,
                    name: product.name,
                    price: product.price,
                    discount: product.discount || 0
                }])
            }
        },
        condition: {
            expression: "attribute_exists(user_id)"
        }
    };
}

export function response(ctx) {
    console.log("response from cart ctx ===========================> ", ctx)
    return ctx.result;
}