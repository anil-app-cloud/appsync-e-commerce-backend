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

    if (userInput.email !== undefined && userInput.email !== null) {
        updateExpression.push('#email = :email');
        expressionNames['#email'] = 'email';
        expressionValues[':email'] = { 'S': userInput.email };
    }

    if (userInput.address !== undefined && userInput.address !== null) {
        updateExpression.push('#address = :address');
        expressionNames['#address'] = 'address';
        expressionValues[':address'] = { 'S': userInput.address};
    }
 
    return {
        operation: 'UpdateItem',
        key: {
            'user_id': { 'S': userInput.user_id },
        },
        update: {
            expression: 'SET ' + updateExpression.join(', '),
            expressionNames: expressionNames,
            expressionValues: expressionValues,
        },
        condition: {
            expression: 'attribute_exists(user_id)',
        },
    };
}

export function response(ctx) {
    console.log("response of userUpdater ctx =========> ", ctx);
    return ctx.result;
}
