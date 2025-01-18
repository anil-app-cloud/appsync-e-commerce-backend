
export function request(ctx) {
    console.log("request for getAllProducts ctx ==============================> ", ctx)
    return {
        version: "2018-05-29",
        operation: "Scan",
    }
}

export function response(ctx){
    console.log("response of getAllProducts ctx ==============================> ", ctx)
    return ctx.result.items
}