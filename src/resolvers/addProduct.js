
import {util} from '@aws-appsync/utils'
export function request(ctx) {
    console.log("request from createProduct", ctx)
    const { name, price,discount } = ctx.arguments.userInput;
    const id = util.autoId();
  
    return {
      operation: 'PutItem',
      key: {
        'product_id': { 'S': id }
      },
      attributeValues: {
        'name': { 'S': name },
        'price': {'N': price },
        'discount': {'N': discount }
      }
    };
}

export function response(ctx) {
    return ctx.result;
}