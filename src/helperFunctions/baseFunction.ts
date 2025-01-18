import * as path from 'path';
import * as appsync from "aws-cdk-lib/aws-appsync"


export function createAppSyncFunction(
    scope: any,
    id: string,
    api: appsync.GraphqlApi,
    dataSource: appsync.BaseDataSource,
    functionName: string,
    filePath: string
): appsync.AppsyncFunction {
    return new appsync.AppsyncFunction(scope, id, {
        name: functionName,
        api,
        dataSource,
        code: appsync.Code.fromAsset(path.resolve(filePath)),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
    })
}


