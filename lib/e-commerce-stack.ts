import * as cdk from 'aws-cdk-lib';
import * as appsync from "aws-cdk-lib/aws-appsync"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import { Construct } from 'constructs';
import {createAppSyncFunction} from "../src/helperFunctions/baseFunction"
import * as path from "path"
import { createTracing } from 'trace_events';
import { getuid } from 'process';


export class ECommerceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "e-commerce", {
      name: "e-commerce-api",
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, "../src/schema/schema.graphql"))
    })

    const productTable = new dynamodb.Table(this, "products-table", {
      partitionKey: {
        name: "product_id",
        type: dynamodb.AttributeType.STRING
      },
      tableName: "product-table",
      removalPolicy: cdk.RemovalPolicy.DESTROY,

    })


    const userTable = new dynamodb.Table(this, "users-table", {
      partitionKey: {
        name: "user_id",
        type: dynamodb.AttributeType.STRING,
      },
      tableName: "user-table",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })
      userTable.addGlobalSecondaryIndex(
        {indexName: "email_index",
        partitionKey: {name: "email", type: dynamodb.AttributeType.STRING},
        projectionType: dynamodb.ProjectionType.ALL,
        }

      )

    const cartTable = new dynamodb.Table(this, "cart-table", {
      partitionKey: {
        name: "user_id", 
        type: dynamodb.AttributeType.STRING,
      },
      tableName: "cart-table",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    const productDbSource = api.addDynamoDbDataSource("products", productTable)
    const userDbSource = api.addDynamoDbDataSource("user", userTable)
    const cartDbSource = api.addDynamoDbDataSource("cart", cartTable) 


    const addProduct = createAppSyncFunction(
      this, 
      "addProduct",
      api,
      productDbSource,
      "productAdding",
      path.join(__dirname, "../src/resolvers/addProduct.js")
    )

      new appsync.Resolver(this, "createProduct", {
        api,
        typeName: "Mutation",
        fieldName: "createProduct",
        pipelineConfig: [addProduct],
        code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      })

    const checkUserExit = createAppSyncFunction(
      this,
      "checkUser",
      api,
      userDbSource,
      "checkUserExit",
      path.join(__dirname, "../src/resolvers/checkUserExitOrNot.js"),
    )
    
    const addUser = createAppSyncFunction(
      this, 
      "addingUser",
      api,
      userDbSource,
      "addUser",
      path.join(__dirname, "../src/resolvers/addUser.js")
    )

    const createCart = createAppSyncFunction(
      this,
      "cartForUser",
      api,
      cartDbSource,
      "addCartToUser",
      path.join(__dirname, "../src/resolvers/addCart.js")
    )

    new appsync.Resolver(this, "createUser", {
      api,
      typeName: "Mutation",
      fieldName: "createUser",
      pipelineConfig: [checkUserExit, addUser, createCart],
      code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    })

    const addProductTocart = createAppSyncFunction(
      this, 
      "addingProduct",
      api,
      cartDbSource,
      "addProductToCart",
      path.join(__dirname, "../src/resolvers/addProductToCart.js")
    )

      new appsync.Resolver(this, "addingItemToCart", {
        api,
        typeName: "Mutation",
        fieldName: "addToCart",
        pipelineConfig: [addProductTocart],
        code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      })

    
      // const cartUpdatedFunction = createAppSyncFunction(
      //  this,
      //  "subscriptionCart",
      //  api,
      //  cartDbSource,
      //  "subscriptionCart",
      //  path.join(__dirname, "../src/resolvers/updateCart.js"), 
      // );

      //   new appsync.Resolver(this, "CartUpdatedSubscription", {
      //     api,
      //     typeName: "Subscription",
      //     fieldName: "cartUpdated",
      //     pipelineConfig: [cartUpdatedFunction],
      //     code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
      //     runtime: appsync.FunctionRuntime.JS_1_0_0,
      //   });


    const getAllProducts = createAppSyncFunction(
      this, 
      "getAllProducts",
      api,
      productDbSource,
      "getProducts",
      path.join(__dirname, "../src/resolvers/getProducts.js")
    )
      new appsync.Resolver(this, "getAllProductsResolver", {
        api, 
        typeName: "Query",
        fieldName: "getProducts",
        pipelineConfig: [getAllProducts],
        code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      })
    const getSingleProduct = createAppSyncFunction(
      this, 
      "getProduct",
      api,
      productDbSource,
      "getProductById",
      path.join(__dirname, "../src/resolvers/getProductById.js"),
    )
      new appsync.Resolver(this, "getSingleProductResolver", {
        api,
        typeName: "Query",
        fieldName: "getProductById",
        pipelineConfig: [getSingleProduct],
        code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      })


    const getAllUsers = createAppSyncFunction(
      this,
      "getAllUsers", 
      api,
      userDbSource,
      "getUsers",
      path.join(__dirname, "../src/resolvers/getUsers.js"),
    ) 

      new appsync.Resolver(this, "getAllUsersResolver", {
        api, 
        typeName: "Query",
        fieldName: "getUsers",
        pipelineConfig: [getAllUsers],
        code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }) 
    
    const getUserById = createAppSyncFunction(
      this, 
      "getUserById",
      api,
      userDbSource,
      "GetUser",
      path.join(__dirname, "../src/resolvers/getUser.js"),
    )

      new appsync.Resolver(this, "getUserResolver", {
        api,
        typeName: "Query",
        fieldName: "getUserById",
        pipelineConfig: [getUserById],
        code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      })
    
    const getCartItems = createAppSyncFunction(
      this, 
      "getAllCartItems",
      api,
      cartDbSource,
      "getCartItems",
      path.join(__dirname, "../src/resolvers/getCartItems.js"),
    )

      new appsync.Resolver(this, "getCartItemsResolver", {
        api, 
        typeName: "Query",
        fieldName: "getCartItemsByUser",
        pipelineConfig: [getCartItems],
        code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      })
    
    const getAllCarts = createAppSyncFunction(
      this,
      "getAllCarts",
      api,
      cartDbSource,
      "getCarts",
      path.join(__dirname, "../src/resolvers/getAllCarts.js"),
    )
      
      new appsync.Resolver(this, "getCatsReslover", {
        api,
        typeName: "Query",
        fieldName: "getAllCarts",
        pipelineConfig: [getAllCarts],
        code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
            
      })

    const getUpdateUser = createAppSyncFunction(
      this,
      "getUpdateUser",
      api,
      userDbSource,
      "userUpdater",
      path.join(__dirname, "../src/resolvers/updateUser.js"),
    )

      new appsync.Resolver(this, "userUpdateResolver", {
        api,
        typeName: "Mutation",
        fieldName: "updateUser",
        pipelineConfig: [getUpdateUser],
        code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }) 
    
    const getUpdateProduct = createAppSyncFunction(
      this,
      "getUpdateProduct",
      api,
      productDbSource,
      "updateProduct",
      path.join(__dirname, "../src/resolvers/updateProduct.js"),
    )

      new appsync.Resolver(this, "productUpdateResolver", {
        api,
        typeName: "Mutation",
        fieldName: "updateProduct",
        pipelineConfig: [getUpdateProduct],
        code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      })

    
    const getDeleteProduct = createAppSyncFunction(
      this,
      "getDeleteProduct",
      api,
      productDbSource,
      "deleteProduct",
      path.join(__dirname, "../src/resolvers/deleteProduct.js"),
    )
      new appsync.Resolver(this, "deleteProductResolver", {
        api,
        typeName: "Mutation",
        fieldName: "deleteProduct",
        pipelineConfig: [getDeleteProduct],
        code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      })

    const getDeleteUser = createAppSyncFunction(
      this, 
      "getDeleteUser",
      api,
      userDbSource,
      "deleteUser",
      path.join(__dirname, "../src/resolvers/deleteUser.js"),
    )

    const getDeleteCart = createAppSyncFunction(
      this, 
      "getDeleteCart",
      api,
      cartDbSource,
      "deleteCart",
      path.join(__dirname, "../src/resolvers/deleteCart.js"),
    )

      new appsync.Resolver(this, "deleteUserResolver", {
        api,
        typeName: "Mutation",
        fieldName: "deleteUser",
        pipelineConfig: [getDeleteUser, getDeleteCart],
        code: appsync.Code.fromAsset(path.join(__dirname, "../src/resolvers/baseTemplate.js")),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      })


  }
}
