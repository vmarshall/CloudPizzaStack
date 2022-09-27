"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheStateMachineStack = void 0;
const cdk = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const apigw = require("@aws-cdk/aws-apigatewayv2");
const sfn = require("@aws-cdk/aws-stepfunctions");
const tasks = require("@aws-cdk/aws-stepfunctions-tasks");
const aws_iam_1 = require("@aws-cdk/aws-iam");
class TheStateMachineStack extends cdk.Stack {
    constructor(scope, id, props) {
        var _a;
        super(scope, id, props);
        /**
         * Step Function Starts Here
         */
        //The first thing we need to do is see if they are asking for pineapple on a pizza
        let pineappleCheckLambda = new lambda.Function(this, 'pineappleCheckLambdaHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.Code.fromAsset('lambda-fns'),
            handler: 'orderPizza.handler'
        });
        let fetchAddressLambda = new lambda.Function(this, 'fetchAddressLambdaHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.Code.fromAsset('lambda-fns'),
            handler: 'lookupAddress.handler',
        });
        let fetchCookPizzaLambda = new lambda.Function(this, 'fetchCookPizzaLambdaHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.Code.fromAsset('lambda-fns'),
            handler: 'cookPizza.handler'
        });
        let reportPizzaErrorLambda = new lambda.Function(this, 'reportPizzaErrorLambdaHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.Code.fromAsset('lambda-fns'),
            handler: 'reportPizzaError.handler'
        });
        // Step functions are built up of steps, we need to define our first step
        const orderPizza = new tasks.LambdaInvoke(this, "Order Pizza Job", {
            lambdaFunction: pineappleCheckLambda,
            inputPath: '$.flavour',
            resultPath: '$.pineappleAnalysis',
            payloadResponseOnly: true
        });
        // Pizza Order failure step defined
        const pineappleDetected = new sfn.Fail(this, 'Sorry, We Dont add Pineapple', {
            cause: 'They asked for Pineapple',
            error: 'Failed To Make Pizza',
        });
        // If they didnt ask for pineapple let's cook the pizza
        const cookPizza = new sfn.Succeed(this, 'Lets make your pizza', {
            outputPath: '$.pineappleAnalysis'
        });
        // If they didnt ask for pineapple let's cook the pizza
        const fetchAddress = new sfn.Succeed(this, 'Fetching Customer Address', {
            outputPath: '$.customerAddress'
        });
        //Express Step function definition
        const definition = sfn.Chain
            .start(orderPizza)
            .next(new sfn.Choice(this, 'With Pineapple?') // Logical choice added to flow
            // Look at the "status" field
            .when(sfn.Condition.booleanEquals('$.pineappleAnalysis.containsPineapple', true), pineappleDetected) // Fail for pineapple
            .otherwise(cookPizza));
        let stateMachine = new sfn.StateMachine(this, 'StateMachine', {
            definition,
            timeout: cdk.Duration.minutes(5),
            tracingEnabled: true,
            stateMachineType: sfn.StateMachineType.STANDARD
        });
        /**
         * HTTP API Definition
         */
        // defines an API Gateway HTTP API resource backed by our step function
        // We need to give our HTTP API permission to invoke our step function
        const httpApiRole = new aws_iam_1.Role(this, 'HttpApiRole', {
            assumedBy: new aws_iam_1.ServicePrincipal('apigateway.amazonaws.com'),
            inlinePolicies: {
                AllowSFNExec: new aws_iam_1.PolicyDocument({
                    statements: [
                        new aws_iam_1.PolicyStatement({
                            actions: ['states:StartSyncExecution'],
                            effect: aws_iam_1.Effect.ALLOW,
                            resources: [stateMachine.stateMachineArn]
                        })
                    ]
                })
            }
        });
        const api = new apigw.HttpApi(this, 'the-state-machine-api', {
            createDefaultStage: true,
        });
        // create an AWS_PROXY integration between the HTTP API and our Step Function
        const integ = new apigw.CfnIntegration(this, 'Integ', {
            apiId: api.httpApiId,
            integrationType: 'AWS_PROXY',
            connectionType: 'INTERNET',
            integrationSubtype: 'StepFunctions-StartSyncExecution',
            credentialsArn: httpApiRole.roleArn,
            requestParameters: {
                Input: "$request.body",
                StateMachineArn: stateMachine.stateMachineArn
            },
            payloadFormatVersion: '1.0',
            timeoutInMillis: 10000,
        });
        new apigw.CfnRoute(this, 'DefaultRoute', {
            apiId: api.httpApiId,
            routeKey: apigw.HttpRouteKey.DEFAULT.key,
            target: `integrations/${integ.ref}`,
        });
        // output the URL of the HTTP API
        new cdk.CfnOutput(this, 'HTTP API Url', {
            value: (_a = api.url) !== null && _a !== void 0 ? _a : 'Something went wrong with the deploy'
        });
    }
}
exports.TheStateMachineStack = TheStateMachineStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlLXN0YXRlLW1hY2hpbmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0aGUtc3RhdGUtbWFjaGluZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsOENBQStDO0FBQy9DLG1EQUFvRDtBQUNwRCxrREFBbUQ7QUFDbkQsMERBQTJEO0FBQzNELDhDQUFtRztBQUVuRyxNQUFhLG9CQUFxQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2pELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7O1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCOztXQUVHO1FBRUgsa0ZBQWtGO1FBQ2xGLElBQUksb0JBQW9CLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSw2QkFBNkIsRUFBRTtZQUNsRixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7WUFDekMsT0FBTyxFQUFFLG9CQUFvQjtTQUM5QixDQUFDLENBQUM7UUFFSCxJQUFJLGtCQUFrQixHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsMkJBQTJCLEVBQUU7WUFDOUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDO1lBQ3pDLE9BQU8sRUFBRSx1QkFBdUI7U0FDakMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxvQkFBb0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLDZCQUE2QixFQUFFO1lBQ2xGLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztZQUN6QyxPQUFPLEVBQUUsbUJBQW1CO1NBQzdCLENBQUMsQ0FBQztRQUVILElBQUksc0JBQXNCLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSwrQkFBK0IsRUFBRTtZQUN0RixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7WUFDekMsT0FBTyxFQUFFLDBCQUEwQjtTQUNwQyxDQUFDLENBQUM7UUFFSCx5RUFBeUU7UUFDekUsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUNqRSxjQUFjLEVBQUUsb0JBQW9CO1lBQ3BDLFNBQVMsRUFBRSxXQUFXO1lBQ3RCLFVBQVUsRUFBRSxxQkFBcUI7WUFDakMsbUJBQW1CLEVBQUUsSUFBSTtTQUMxQixDQUFDLENBQUE7UUFFRixtQ0FBbUM7UUFDbkMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLDhCQUE4QixFQUFFO1lBQzNFLEtBQUssRUFBRSwwQkFBMEI7WUFDakMsS0FBSyxFQUFFLHNCQUFzQjtTQUM5QixDQUFDLENBQUM7UUFFSCx1REFBdUQ7UUFDdkQsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxzQkFBc0IsRUFBRTtZQUM5RCxVQUFVLEVBQUUscUJBQXFCO1NBQ2xDLENBQUMsQ0FBQztRQUVILHVEQUF1RDtRQUN2RCxNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLDJCQUEyQixFQUFFO1lBQ3RFLFVBQVUsRUFBRSxtQkFBbUI7U0FDaEMsQ0FBQyxDQUFDO1FBRUgsa0NBQWtDO1FBQ2xDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxLQUFLO2FBQ3pCLEtBQUssQ0FBQyxVQUFVLENBQUM7YUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQywrQkFBK0I7WUFDM0UsNkJBQTZCO2FBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyx1Q0FBdUMsRUFBRSxJQUFJLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLHFCQUFxQjthQUN6SCxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUUzQixJQUFJLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUM1RCxVQUFVO1lBQ1YsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNoQyxjQUFjLEVBQUUsSUFBSTtZQUNwQixnQkFBZ0IsRUFBRSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsUUFBUTtTQUNoRCxDQUFDLENBQUM7UUFFSDs7V0FFRztRQUNILHVFQUF1RTtRQUd2RSxzRUFBc0U7UUFDdEUsTUFBTSxXQUFXLEdBQUcsSUFBSSxjQUFJLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNoRCxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQywwQkFBMEIsQ0FBQztZQUMzRCxjQUFjLEVBQUU7Z0JBQ2QsWUFBWSxFQUFFLElBQUksd0JBQWMsQ0FBQztvQkFDL0IsVUFBVSxFQUFFO3dCQUNWLElBQUkseUJBQWUsQ0FBQzs0QkFDbEIsT0FBTyxFQUFFLENBQUMsMkJBQTJCLENBQUM7NEJBQ3RDLE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7NEJBQ3BCLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUM7eUJBQzFDLENBQUM7cUJBQ0g7aUJBQ0YsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRTtZQUMzRCxrQkFBa0IsRUFBRSxJQUFJO1NBQ3pCLENBQUMsQ0FBQztRQUVILDZFQUE2RTtRQUM3RSxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUNwRCxLQUFLLEVBQUUsR0FBRyxDQUFDLFNBQVM7WUFDcEIsZUFBZSxFQUFFLFdBQVc7WUFDNUIsY0FBYyxFQUFFLFVBQVU7WUFDMUIsa0JBQWtCLEVBQUUsa0NBQWtDO1lBQ3RELGNBQWMsRUFBRSxXQUFXLENBQUMsT0FBTztZQUNuQyxpQkFBaUIsRUFBRTtnQkFDakIsS0FBSyxFQUFFLGVBQWU7Z0JBQ3RCLGVBQWUsRUFBRSxZQUFZLENBQUMsZUFBZTthQUM5QztZQUNELG9CQUFvQixFQUFFLEtBQUs7WUFDM0IsZUFBZSxFQUFFLEtBQUs7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDdkMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxTQUFTO1lBQ3BCLFFBQVEsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHO1lBQ3hDLE1BQU0sRUFBRSxnQkFBZ0IsS0FBSyxDQUFDLEdBQUcsRUFBRTtTQUNwQyxDQUFDLENBQUM7UUFFSCxpQ0FBaUM7UUFDakMsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDdEMsS0FBSyxFQUFFLE1BQUEsR0FBRyxDQUFDLEdBQUcsbUNBQUksc0NBQXNDO1NBQ3pELENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTVIRCxvREE0SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgbGFtYmRhID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWxhbWJkYScpO1xuaW1wb3J0IGFwaWd3ID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXl2MicpO1xuaW1wb3J0IHNmbiA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1zdGVwZnVuY3Rpb25zJyk7XG5pbXBvcnQgdGFza3MgPSByZXF1aXJlKCdAYXdzLWNkay9hd3Mtc3RlcGZ1bmN0aW9ucy10YXNrcycpO1xuaW1wb3J0IHsgRWZmZWN0LCBQb2xpY3lEb2N1bWVudCwgUG9saWN5U3RhdGVtZW50LCBSb2xlLCBTZXJ2aWNlUHJpbmNpcGFsIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5cbmV4cG9ydCBjbGFzcyBUaGVTdGF0ZU1hY2hpbmVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvKipcbiAgICAgKiBTdGVwIEZ1bmN0aW9uIFN0YXJ0cyBIZXJlXG4gICAgICovXG5cbiAgICAvL1RoZSBmaXJzdCB0aGluZyB3ZSBuZWVkIHRvIGRvIGlzIHNlZSBpZiB0aGV5IGFyZSBhc2tpbmcgZm9yIHBpbmVhcHBsZSBvbiBhIHBpenphXG4gICAgbGV0IHBpbmVhcHBsZUNoZWNrTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAncGluZWFwcGxlQ2hlY2tMYW1iZGFIYW5kbGVyJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzEyX1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYS1mbnMnKSxcbiAgICAgIGhhbmRsZXI6ICdvcmRlclBpenphLmhhbmRsZXInXG4gICAgfSk7XG5cbiAgICBsZXQgZmV0Y2hBZGRyZXNzTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnZmV0Y2hBZGRyZXNzTGFtYmRhSGFuZGxlcicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMl9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdsYW1iZGEtZm5zJyksXG4gICAgICBoYW5kbGVyOiAnbG9va3VwQWRkcmVzcy5oYW5kbGVyJyxcbiAgICB9KTtcblxuICAgIGxldCBmZXRjaENvb2tQaXp6YUxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ2ZldGNoQ29va1BpenphTGFtYmRhSGFuZGxlcicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMl9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdsYW1iZGEtZm5zJyksXG4gICAgICBoYW5kbGVyOiAnY29va1BpenphLmhhbmRsZXInXG4gICAgfSk7XG5cbiAgICBsZXQgcmVwb3J0UGl6emFFcnJvckxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ3JlcG9ydFBpenphRXJyb3JMYW1iZGFIYW5kbGVyJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzEyX1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYS1mbnMnKSxcbiAgICAgIGhhbmRsZXI6ICdyZXBvcnRQaXp6YUVycm9yLmhhbmRsZXInXG4gICAgfSk7XG5cbiAgICAvLyBTdGVwIGZ1bmN0aW9ucyBhcmUgYnVpbHQgdXAgb2Ygc3RlcHMsIHdlIG5lZWQgdG8gZGVmaW5lIG91ciBmaXJzdCBzdGVwXG4gICAgY29uc3Qgb3JkZXJQaXp6YSA9IG5ldyB0YXNrcy5MYW1iZGFJbnZva2UodGhpcywgXCJPcmRlciBQaXp6YSBKb2JcIiwge1xuICAgICAgbGFtYmRhRnVuY3Rpb246IHBpbmVhcHBsZUNoZWNrTGFtYmRhLFxuICAgICAgaW5wdXRQYXRoOiAnJC5mbGF2b3VyJyxcbiAgICAgIHJlc3VsdFBhdGg6ICckLnBpbmVhcHBsZUFuYWx5c2lzJyxcbiAgICAgIHBheWxvYWRSZXNwb25zZU9ubHk6IHRydWVcbiAgICB9KVxuXG4gICAgLy8gUGl6emEgT3JkZXIgZmFpbHVyZSBzdGVwIGRlZmluZWRcbiAgICBjb25zdCBwaW5lYXBwbGVEZXRlY3RlZCA9IG5ldyBzZm4uRmFpbCh0aGlzLCAnU29ycnksIFdlIERvbnQgYWRkIFBpbmVhcHBsZScsIHtcbiAgICAgIGNhdXNlOiAnVGhleSBhc2tlZCBmb3IgUGluZWFwcGxlJyxcbiAgICAgIGVycm9yOiAnRmFpbGVkIFRvIE1ha2UgUGl6emEnLFxuICAgIH0pO1xuXG4gICAgLy8gSWYgdGhleSBkaWRudCBhc2sgZm9yIHBpbmVhcHBsZSBsZXQncyBjb29rIHRoZSBwaXp6YVxuICAgIGNvbnN0IGNvb2tQaXp6YSA9IG5ldyBzZm4uU3VjY2VlZCh0aGlzLCAnTGV0cyBtYWtlIHlvdXIgcGl6emEnLCB7XG4gICAgICBvdXRwdXRQYXRoOiAnJC5waW5lYXBwbGVBbmFseXNpcydcbiAgICB9KTtcblxuICAgIC8vIElmIHRoZXkgZGlkbnQgYXNrIGZvciBwaW5lYXBwbGUgbGV0J3MgY29vayB0aGUgcGl6emFcbiAgICBjb25zdCBmZXRjaEFkZHJlc3MgPSBuZXcgc2ZuLlN1Y2NlZWQodGhpcywgJ0ZldGNoaW5nIEN1c3RvbWVyIEFkZHJlc3MnLCB7XG4gICAgICBvdXRwdXRQYXRoOiAnJC5jdXN0b21lckFkZHJlc3MnXG4gICAgfSk7XG5cbiAgICAvL0V4cHJlc3MgU3RlcCBmdW5jdGlvbiBkZWZpbml0aW9uXG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IHNmbi5DaGFpblxuICAgICAgLnN0YXJ0KG9yZGVyUGl6emEpXG4gICAgICAubmV4dChuZXcgc2ZuLkNob2ljZSh0aGlzLCAnV2l0aCBQaW5lYXBwbGU/JykgLy8gTG9naWNhbCBjaG9pY2UgYWRkZWQgdG8gZmxvd1xuICAgICAgICAvLyBMb29rIGF0IHRoZSBcInN0YXR1c1wiIGZpZWxkXG4gICAgICAgIC53aGVuKHNmbi5Db25kaXRpb24uYm9vbGVhbkVxdWFscygnJC5waW5lYXBwbGVBbmFseXNpcy5jb250YWluc1BpbmVhcHBsZScsIHRydWUpLCBwaW5lYXBwbGVEZXRlY3RlZCkgLy8gRmFpbCBmb3IgcGluZWFwcGxlXG4gICAgICAgIC5vdGhlcndpc2UoY29va1BpenphKSk7XG5cbiAgICBsZXQgc3RhdGVNYWNoaW5lID0gbmV3IHNmbi5TdGF0ZU1hY2hpbmUodGhpcywgJ1N0YXRlTWFjaGluZScsIHtcbiAgICAgIGRlZmluaXRpb24sXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICAgIHRyYWNpbmdFbmFibGVkOiB0cnVlLFxuICAgICAgc3RhdGVNYWNoaW5lVHlwZTogc2ZuLlN0YXRlTWFjaGluZVR5cGUuU1RBTkRBUkRcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEhUVFAgQVBJIERlZmluaXRpb25cbiAgICAgKi9cbiAgICAvLyBkZWZpbmVzIGFuIEFQSSBHYXRld2F5IEhUVFAgQVBJIHJlc291cmNlIGJhY2tlZCBieSBvdXIgc3RlcCBmdW5jdGlvblxuXG5cbiAgICAvLyBXZSBuZWVkIHRvIGdpdmUgb3VyIEhUVFAgQVBJIHBlcm1pc3Npb24gdG8gaW52b2tlIG91ciBzdGVwIGZ1bmN0aW9uXG4gICAgY29uc3QgaHR0cEFwaVJvbGUgPSBuZXcgUm9sZSh0aGlzLCAnSHR0cEFwaVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdhcGlnYXRld2F5LmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIGlubGluZVBvbGljaWVzOiB7XG4gICAgICAgIEFsbG93U0ZORXhlYzogbmV3IFBvbGljeURvY3VtZW50KHtcbiAgICAgICAgICBzdGF0ZW1lbnRzOiBbXG4gICAgICAgICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAgICAgYWN0aW9uczogWydzdGF0ZXM6U3RhcnRTeW5jRXhlY3V0aW9uJ10sXG4gICAgICAgICAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgICByZXNvdXJjZXM6IFtzdGF0ZU1hY2hpbmUuc3RhdGVNYWNoaW5lQXJuXVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5IdHRwQXBpKHRoaXMsICd0aGUtc3RhdGUtbWFjaGluZS1hcGknLCB7XG4gICAgICBjcmVhdGVEZWZhdWx0U3RhZ2U6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBjcmVhdGUgYW4gQVdTX1BST1hZIGludGVncmF0aW9uIGJldHdlZW4gdGhlIEhUVFAgQVBJIGFuZCBvdXIgU3RlcCBGdW5jdGlvblxuICAgIGNvbnN0IGludGVnID0gbmV3IGFwaWd3LkNmbkludGVncmF0aW9uKHRoaXMsICdJbnRlZycsIHtcbiAgICAgIGFwaUlkOiBhcGkuaHR0cEFwaUlkLFxuICAgICAgaW50ZWdyYXRpb25UeXBlOiAnQVdTX1BST1hZJyxcbiAgICAgIGNvbm5lY3Rpb25UeXBlOiAnSU5URVJORVQnLFxuICAgICAgaW50ZWdyYXRpb25TdWJ0eXBlOiAnU3RlcEZ1bmN0aW9ucy1TdGFydFN5bmNFeGVjdXRpb24nLFxuICAgICAgY3JlZGVudGlhbHNBcm46IGh0dHBBcGlSb2xlLnJvbGVBcm4sXG4gICAgICByZXF1ZXN0UGFyYW1ldGVyczoge1xuICAgICAgICBJbnB1dDogXCIkcmVxdWVzdC5ib2R5XCIsXG4gICAgICAgIFN0YXRlTWFjaGluZUFybjogc3RhdGVNYWNoaW5lLnN0YXRlTWFjaGluZUFyblxuICAgICAgfSxcbiAgICAgIHBheWxvYWRGb3JtYXRWZXJzaW9uOiAnMS4wJyxcbiAgICAgIHRpbWVvdXRJbk1pbGxpczogMTAwMDAsXG4gICAgfSk7XG5cbiAgICBuZXcgYXBpZ3cuQ2ZuUm91dGUodGhpcywgJ0RlZmF1bHRSb3V0ZScsIHtcbiAgICAgIGFwaUlkOiBhcGkuaHR0cEFwaUlkLFxuICAgICAgcm91dGVLZXk6IGFwaWd3Lkh0dHBSb3V0ZUtleS5ERUZBVUxULmtleSxcbiAgICAgIHRhcmdldDogYGludGVncmF0aW9ucy8ke2ludGVnLnJlZn1gLFxuICAgIH0pO1xuXG4gICAgLy8gb3V0cHV0IHRoZSBVUkwgb2YgdGhlIEhUVFAgQVBJXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0hUVFAgQVBJIFVybCcsIHtcbiAgICAgIHZhbHVlOiBhcGkudXJsID8/ICdTb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIHRoZSBkZXBsb3knXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==