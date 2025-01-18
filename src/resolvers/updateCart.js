// src/resolvers/cartUpdated.js

export function request(ctx) {
    console.log("Request for cartUpdated subscription context =>", ctx);
    return {
        version: "2018-05-29",
        operation: "Query",
        query: {
            expression: "user_id = :user_id",
            expressionValues: {
                ":user_id": util.dynamodb.toDynamoDB(ctx.args.userId),
            },
        },
    };
}

export function response(ctx) {
    console.log("Response for cartUpdated subscription =>", ctx);
    const validProducts = ctx.result.items.filter(product => product.product_id != null);
    return validProducts;
}
