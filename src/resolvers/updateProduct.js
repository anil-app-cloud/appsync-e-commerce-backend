export function request(ctx) {
    console.log("request from userUpdater ctx =========> ", ctx);
    const { userInput } = ctx.arguments;
    const updateExpression = [];
    const expressionNames = {};
    const expressionValues = {};

    if (userInput.name !== undefined && userInput.name !== null) {
        updateExpression.push('#name = :name');
        expressionNames['#name'] = 'name';
        expressionValues[':name'] = { 'S': userInput.name };
    }

    if (userInput.price !== undefined && userInput.price !== null) {
        updateExpression.push('#price = :price');
        expressionNames['#price'] = 'price';
        expressionValues[':price'] = { 'N': userInput.price };
    }

    if (userInput.discount !== undefined && userInput.discount !== null) {
        updateExpression.push('#discount = :discount');
        expressionNames['#discount'] = 'discount';
        expressionValues[':discount'] = { 'N': userInput.discount};
    }
 
    return {
        operation: 'UpdateItem',
        key: {
            'product_id': { 'S': userInput.product_id },
        },
        update: {
            expression: 'SET ' + updateExpression.join(', '),
            expressionNames: expressionNames,
            expressionValues: expressionValues,
        },
        condition: {
            expression: 'attribute_exists(product_id)',
        },
    };
}

export function response(ctx) {
    console.log("response of userUpdater ctx =========> ", ctx);
    return ctx.result;
}
