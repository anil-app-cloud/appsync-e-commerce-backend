export function request(ctx) {
    console.log("request from userExit or not =>>>>>>>>>>>>>>> ", ctx)
    const { email } = ctx.arguments.userInput;
    return {
        operation: "Query",
        index: "email_index",
        query: {
            expression: "#email = :email",
            expressionNames: {
                "#email": "email",
            },
            expressionValues: {
                ":email": { "S": email },
            },
        },
    };
}

export function response(ctx) {
    console.log("response of userExit or not =>>>>>>>>>>>>>>> ", ctx)
    const is_existing_user = ctx.result.items && ctx.result.items.length > 0;
    return {
        is_existing_user,
        userDetails: ctx.arguments.userInput,
    };
}
