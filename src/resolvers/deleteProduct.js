export function request(ctx){
    console.log("request from delete product =====> ", ctx)
    return {
        operation: "DeleteItem",
        key: {
            'product_id': {'S': ctx.arguments.productId},

        },
        condition: {
            expression: 'attribute_exists(product_id)',
        },
    }
}

export function response(ctx){
    console.log("response of deleteProduct =====> ", ctx)
    if (ctx.result !== null){
        return "Product Deleted Successfully"
    }
    return "Don't Have Product With This Product id"
}