"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@aws-cdk/assert");
const cdk = require("@aws-cdk/core");
const TheStateMachine = require("../lib/the-state-machine-stack");
test('API Gateway Proxy Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TheStateMachine.TheStateMachineStack(app, 'CloudPizzaStack');
    // THEN
    assert_1.expect(stack).to(assert_1.haveResourceLike("AWS::ApiGatewayV2::Integration", {
        "IntegrationType": "AWS_PROXY",
        "ConnectionType": "INTERNET",
        "IntegrationSubtype": "StepFunctions-StartSyncExecution",
        "PayloadFormatVersion": "1.0",
        "RequestParameters": {
            "Input": "$request.body",
            "StateMachineArn": {}
        },
        "TimeoutInMillis": 10000
    }));
});
test('State Machine Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TheStateMachine.TheStateMachineStack(app, 'CloudPizzaStack');
    // THEN
    assert_1.expect(stack).to(assert_1.haveResourceLike("AWS::StepFunctions::StateMachine", {
        "DefinitionString": {
            "Fn::Join": [
                "",
                [
                    "{\"StartAt\":\"Order Pizza Job\",\"States\":{\"Order Pizza Job\":{\"Next\":\"With Pineapple?\",\"Retry\":[{\"ErrorEquals\":[\"Lambda.ServiceException\",\"Lambda.AWSLambdaException\",\"Lambda.SdkClientException\"],\"IntervalSeconds\":2,\"MaxAttempts\":6,\"BackoffRate\":2}],\"Type\":\"Task\",\"InputPath\":\"$.flavour\",\"ResultPath\":\"$.pineappleAnalysis\",\"Resource\":\"",
                    {},
                    "\"},\"With Pineapple?\":{\"Type\":\"Choice\",\"Choices\":[{\"Variable\":\"$.pineappleAnalysis.containsPineapple\",\"BooleanEquals\":true,\"Next\":\"Sorry, We Dont add Pineapple\"}],\"Default\":\"Lets make your pizza\"},\"Lets make your pizza\":{\"Type\":\"Succeed\",\"OutputPath\":\"$.pineappleAnalysis\"},\"Sorry, We Dont add Pineapple\":{\"Type\":\"Fail\",\"Error\":\"Failed To Make Pizza\",\"Cause\":\"They asked for Pineapple\"}},\"TimeoutSeconds\":300}"
                ]
            ]
        },
        "StateMachineType": "STANDARD",
        "TracingConfiguration": {
            "Enabled": true
        }
    }));
});
test('Order Pizza Lambda Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TheStateMachine.TheStateMachineStack(app, 'CloudPizzaStack');
    // THEN
    assert_1.expect(stack).to(assert_1.haveResourceLike("AWS::Lambda::Function", {
        "Handler": "orderPizza.handler"
    }));
});
test('Cook Pizza Lambda Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TheStateMachine.TheStateMachineStack(app, 'CloudPizzaStack');
    // THEN
    assert_1.expect(stack).to(assert_1.haveResourceLike("AWS::Lambda::Function", {
        "Handler": "cookPizza.handler"
    }));
});
test('Lookup Address Lambda Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TheStateMachine.TheStateMachineStack(app, 'CloudPizzaStack');
    // THEN
    assert_1.expect(stack).to(assert_1.haveResourceLike("AWS::Lambda::Function", {
        "Handler": "lookupAddress.handler"
    }));
});
test('report Pizza Error Lambda Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TheStateMachine.TheStateMachineStack(app, 'CloudPizzaStack');
    // THEN
    assert_1.expect(stack).to(assert_1.haveResourceLike("AWS::Lambda::Function", {
        "Handler": "reportPizzaError.handler"
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlLXN0YXRlLW1hY2hpbmUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRoZS1zdGF0ZS1tYWNoaW5lLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBd0U7QUFDeEUscUNBQXFDO0FBQ3JDLGtFQUFtRTtBQUVuRSxJQUFJLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzFCLE9BQU87SUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUMvRSxPQUFPO0lBQ1AsZUFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyx5QkFBZ0IsQ0FBQyxnQ0FBZ0MsRUFBRTtRQUNyRSxpQkFBaUIsRUFBRSxXQUFXO1FBQzlCLGdCQUFnQixFQUFFLFVBQVU7UUFDNUIsb0JBQW9CLEVBQUUsa0NBQWtDO1FBQ3hELHNCQUFzQixFQUFFLEtBQUs7UUFDN0IsbUJBQW1CLEVBQUU7WUFDbkIsT0FBTyxFQUFFLGVBQWU7WUFDeEIsaUJBQWlCLEVBQUUsRUFDbEI7U0FDRjtRQUNELGlCQUFpQixFQUFFLEtBQUs7S0FDekIsQ0FDQSxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUdILElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7SUFDakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDMUIsT0FBTztJQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBZSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQy9FLE9BQU87SUFDUCxlQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLHlCQUFnQixDQUFDLGtDQUFrQyxFQUFFO1FBQ3ZFLGtCQUFrQixFQUFFO1lBQ2xCLFVBQVUsRUFBRTtnQkFDVixFQUFFO2dCQUNGO29CQUNFLHVYQUF1WDtvQkFDdlgsRUFDQztvQkFDRCwyY0FBMmM7aUJBQzVjO2FBQ0Y7U0FDRjtRQUNELGtCQUFrQixFQUFFLFVBQVU7UUFDOUIsc0JBQXNCLEVBQUU7WUFDdEIsU0FBUyxFQUFFLElBQUk7U0FDaEI7S0FDRixDQUNBLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtJQUN0QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxQixPQUFPO0lBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFlLENBQUMsb0JBQW9CLENBQUMsR0FBRyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDL0UsT0FBTztJQUNQLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMseUJBQWdCLENBQUMsdUJBQXVCLEVBQUU7UUFDNUQsU0FBUyxFQUFFLG9CQUFvQjtLQUNoQyxDQUNBLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtJQUNyQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxQixPQUFPO0lBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFlLENBQUMsb0JBQW9CLENBQUMsR0FBRyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDL0UsT0FBTztJQUNQLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMseUJBQWdCLENBQUMsdUJBQXVCLEVBQUU7UUFDNUQsU0FBUyxFQUFFLG1CQUFtQjtLQUMvQixDQUNBLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtJQUN6QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxQixPQUFPO0lBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFlLENBQUMsb0JBQW9CLENBQUMsR0FBRyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDL0UsT0FBTztJQUNQLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMseUJBQWdCLENBQUMsdUJBQXVCLEVBQUU7UUFDNUQsU0FBUyxFQUFFLHVCQUF1QjtLQUNuQyxDQUNBLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtJQUM3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxQixPQUFPO0lBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFlLENBQUMsb0JBQW9CLENBQUMsR0FBRyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDL0UsT0FBTztJQUNQLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMseUJBQWdCLENBQUMsdUJBQXVCLEVBQUU7UUFDNUQsU0FBUyxFQUFFLDBCQUEwQjtLQUN0QyxDQUNBLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhwZWN0IGFzIGV4cGVjdENESywgaGF2ZVJlc291cmNlTGlrZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgVGhlU3RhdGVNYWNoaW5lID0gcmVxdWlyZSgnLi4vbGliL3RoZS1zdGF0ZS1tYWNoaW5lLXN0YWNrJyk7XG5cbnRlc3QoJ0FQSSBHYXRld2F5IFByb3h5IENyZWF0ZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gIC8vIFdIRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgVGhlU3RhdGVNYWNoaW5lLlRoZVN0YXRlTWFjaGluZVN0YWNrKGFwcCwgJ0Nsb3VkUGl6emFTdGFjaycpO1xuICAvLyBUSEVOXG4gIGV4cGVjdENESyhzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZShcIkFXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvblwiLCB7XG4gICAgXCJJbnRlZ3JhdGlvblR5cGVcIjogXCJBV1NfUFJPWFlcIixcbiAgICBcIkNvbm5lY3Rpb25UeXBlXCI6IFwiSU5URVJORVRcIixcbiAgICBcIkludGVncmF0aW9uU3VidHlwZVwiOiBcIlN0ZXBGdW5jdGlvbnMtU3RhcnRTeW5jRXhlY3V0aW9uXCIsXG4gICAgXCJQYXlsb2FkRm9ybWF0VmVyc2lvblwiOiBcIjEuMFwiLFxuICAgIFwiUmVxdWVzdFBhcmFtZXRlcnNcIjoge1xuICAgICAgXCJJbnB1dFwiOiBcIiRyZXF1ZXN0LmJvZHlcIixcbiAgICAgIFwiU3RhdGVNYWNoaW5lQXJuXCI6IHtcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiVGltZW91dEluTWlsbGlzXCI6IDEwMDAwXG4gIH1cbiAgKSk7XG59KTtcblxuXG50ZXN0KCdTdGF0ZSBNYWNoaW5lIENyZWF0ZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gIC8vIFdIRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgVGhlU3RhdGVNYWNoaW5lLlRoZVN0YXRlTWFjaGluZVN0YWNrKGFwcCwgJ0Nsb3VkUGl6emFTdGFjaycpO1xuICAvLyBUSEVOXG4gIGV4cGVjdENESyhzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZShcIkFXUzo6U3RlcEZ1bmN0aW9uczo6U3RhdGVNYWNoaW5lXCIsIHtcbiAgICBcIkRlZmluaXRpb25TdHJpbmdcIjoge1xuICAgICAgXCJGbjo6Sm9pblwiOiBbXG4gICAgICAgIFwiXCIsXG4gICAgICAgIFtcbiAgICAgICAgICBcIntcXFwiU3RhcnRBdFxcXCI6XFxcIk9yZGVyIFBpenphIEpvYlxcXCIsXFxcIlN0YXRlc1xcXCI6e1xcXCJPcmRlciBQaXp6YSBKb2JcXFwiOntcXFwiTmV4dFxcXCI6XFxcIldpdGggUGluZWFwcGxlP1xcXCIsXFxcIlJldHJ5XFxcIjpbe1xcXCJFcnJvckVxdWFsc1xcXCI6W1xcXCJMYW1iZGEuU2VydmljZUV4Y2VwdGlvblxcXCIsXFxcIkxhbWJkYS5BV1NMYW1iZGFFeGNlcHRpb25cXFwiLFxcXCJMYW1iZGEuU2RrQ2xpZW50RXhjZXB0aW9uXFxcIl0sXFxcIkludGVydmFsU2Vjb25kc1xcXCI6MixcXFwiTWF4QXR0ZW1wdHNcXFwiOjYsXFxcIkJhY2tvZmZSYXRlXFxcIjoyfV0sXFxcIlR5cGVcXFwiOlxcXCJUYXNrXFxcIixcXFwiSW5wdXRQYXRoXFxcIjpcXFwiJC5mbGF2b3VyXFxcIixcXFwiUmVzdWx0UGF0aFxcXCI6XFxcIiQucGluZWFwcGxlQW5hbHlzaXNcXFwiLFxcXCJSZXNvdXJjZVxcXCI6XFxcIlwiLFxuICAgICAgICAgIHtcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiXFxcIn0sXFxcIldpdGggUGluZWFwcGxlP1xcXCI6e1xcXCJUeXBlXFxcIjpcXFwiQ2hvaWNlXFxcIixcXFwiQ2hvaWNlc1xcXCI6W3tcXFwiVmFyaWFibGVcXFwiOlxcXCIkLnBpbmVhcHBsZUFuYWx5c2lzLmNvbnRhaW5zUGluZWFwcGxlXFxcIixcXFwiQm9vbGVhbkVxdWFsc1xcXCI6dHJ1ZSxcXFwiTmV4dFxcXCI6XFxcIlNvcnJ5LCBXZSBEb250IGFkZCBQaW5lYXBwbGVcXFwifV0sXFxcIkRlZmF1bHRcXFwiOlxcXCJMZXRzIG1ha2UgeW91ciBwaXp6YVxcXCJ9LFxcXCJMZXRzIG1ha2UgeW91ciBwaXp6YVxcXCI6e1xcXCJUeXBlXFxcIjpcXFwiU3VjY2VlZFxcXCIsXFxcIk91dHB1dFBhdGhcXFwiOlxcXCIkLnBpbmVhcHBsZUFuYWx5c2lzXFxcIn0sXFxcIlNvcnJ5LCBXZSBEb250IGFkZCBQaW5lYXBwbGVcXFwiOntcXFwiVHlwZVxcXCI6XFxcIkZhaWxcXFwiLFxcXCJFcnJvclxcXCI6XFxcIkZhaWxlZCBUbyBNYWtlIFBpenphXFxcIixcXFwiQ2F1c2VcXFwiOlxcXCJUaGV5IGFza2VkIGZvciBQaW5lYXBwbGVcXFwifX0sXFxcIlRpbWVvdXRTZWNvbmRzXFxcIjozMDB9XCJcbiAgICAgICAgXVxuICAgICAgXVxuICAgIH0sXG4gICAgXCJTdGF0ZU1hY2hpbmVUeXBlXCI6IFwiU1RBTkRBUkRcIixcbiAgICBcIlRyYWNpbmdDb25maWd1cmF0aW9uXCI6IHtcbiAgICAgIFwiRW5hYmxlZFwiOiB0cnVlXG4gICAgfVxuICB9XG4gICkpO1xufSk7XG5cbnRlc3QoJ09yZGVyIFBpenphIExhbWJkYSBDcmVhdGVkJywgKCkgPT4ge1xuICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAvLyBXSEVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFRoZVN0YXRlTWFjaGluZS5UaGVTdGF0ZU1hY2hpbmVTdGFjayhhcHAsICdDbG91ZFBpenphU3RhY2snKTtcbiAgLy8gVEhFTlxuICBleHBlY3RDREsoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoXCJBV1M6OkxhbWJkYTo6RnVuY3Rpb25cIiwge1xuICAgIFwiSGFuZGxlclwiOiBcIm9yZGVyUGl6emEuaGFuZGxlclwiXG4gIH1cbiAgKSk7XG5cbn0pO1xuXG50ZXN0KCdDb29rIFBpenphIExhbWJkYSBDcmVhdGVkJywgKCkgPT4ge1xuICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAvLyBXSEVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFRoZVN0YXRlTWFjaGluZS5UaGVTdGF0ZU1hY2hpbmVTdGFjayhhcHAsICdDbG91ZFBpenphU3RhY2snKTtcbiAgLy8gVEhFTlxuICBleHBlY3RDREsoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoXCJBV1M6OkxhbWJkYTo6RnVuY3Rpb25cIiwge1xuICAgIFwiSGFuZGxlclwiOiBcImNvb2tQaXp6YS5oYW5kbGVyXCJcbiAgfVxuICApKTtcblxufSk7XG5cbnRlc3QoJ0xvb2t1cCBBZGRyZXNzIExhbWJkYSBDcmVhdGVkJywgKCkgPT4ge1xuICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAvLyBXSEVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFRoZVN0YXRlTWFjaGluZS5UaGVTdGF0ZU1hY2hpbmVTdGFjayhhcHAsICdDbG91ZFBpenphU3RhY2snKTtcbiAgLy8gVEhFTlxuICBleHBlY3RDREsoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoXCJBV1M6OkxhbWJkYTo6RnVuY3Rpb25cIiwge1xuICAgIFwiSGFuZGxlclwiOiBcImxvb2t1cEFkZHJlc3MuaGFuZGxlclwiXG4gIH1cbiAgKSk7XG5cbn0pO1xuXG50ZXN0KCdyZXBvcnQgUGl6emEgRXJyb3IgTGFtYmRhIENyZWF0ZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gIC8vIFdIRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgVGhlU3RhdGVNYWNoaW5lLlRoZVN0YXRlTWFjaGluZVN0YWNrKGFwcCwgJ0Nsb3VkUGl6emFTdGFjaycpO1xuICAvLyBUSEVOXG4gIGV4cGVjdENESyhzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZShcIkFXUzo6TGFtYmRhOjpGdW5jdGlvblwiLCB7XG4gICAgXCJIYW5kbGVyXCI6IFwicmVwb3J0UGl6emFFcnJvci5oYW5kbGVyXCJcbiAgfVxuICApKTtcblxufSk7XG5cblxuIl19