import {util} from "@aws-appsync/utils"

export function request(ctx){
    console.log("request from createUser", ctx)    
    const { is_existing_user, userDetails } = ctx.prev.result;

    if (is_existing_user) {    
        return util.error("User Already Exists With This Email", "EmailAlreadyExists", {}, {
            email: userDetails.email
        });
    }
    const { name, email, address } = userDetails;
    const id = util.autoId()
    

    return {
        operation: "PutItem",
        key: {
           "user_id": {"S": id}
        },
        attributeValues: {
            "name": {"S": name},
            "email": {"S": email},
            "address": {"S": address}
        }
    }
}

export function response(ctx){
    console.log("response of createUser ctx =============> ", ctx)

    return ctx.result
}