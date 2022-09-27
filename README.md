# Cloud Pizza

 Deployed State Machine:

```
{
  "StartAt": "Order Pizza Job",
  "States": {
    "Order Pizza Job": {
      "Next": "With Pineapple?",
      "Retry": [
        {
          "ErrorEquals": [
            "Lambda.ServiceException",
            "Lambda.AWSLambdaException",
            "Lambda.SdkClientException"
          ],
          "IntervalSeconds": 2,
          "MaxAttempts": 6,
          "BackoffRate": 2
        }
      ],
      "Type": "Task",
      "InputPath": "$.flavour",
      "ResultPath": "$.pineappleAnalysis",
      "Resource": "arn:aws:lambda:us-west-2:936871487948:function:TheStateMachineStack-pineappleCheckLambdaHandlerFD-3PRfACbYpwNq"
    },
    "With Pineapple?": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.pineappleAnalysis.containsPineapple",
          "BooleanEquals": true,
          "Next": "Sorry, Can't Make Pizza"
        }
      ],
      "Default": "Lookup Address Job"
    },
    "Lookup Address Job": {
      "Next": "Lets make your pizza",
      "Retry": [
        {
          "ErrorEquals": [
            "Lambda.ServiceException",
            "Lambda.AWSLambdaException",
            "Lambda.SdkClientException"
          ],
          "IntervalSeconds": 2,
          "MaxAttempts": 6,
          "BackoffRate": 2
        }
      ],
      "Type": "Task",
      "InputPath": "$.flavour",
      "ResultPath": "$.pineappleAnalysis",
      "Resource": "arn:aws:lambda:us-west-2:936871487948:function:TheStateMachineStack-pineappleCheckLambdaHandlerFD-3PRfACbYpwNq"
    },
    "Lets make your pizza": {
      "Type": "Succeed",
      "OutputPath": "$.pineappleAnalysis"
    },
    "Sorry, Can't Make Pizza": {
      "Type": "Fail",
      "Error": "Failed To Make Pizza",
      "Cause": "They asked for Pineapple, or Failed to Lookup Address"
    }
  },
  "TimeoutSeconds": 300
}
```

### Added A Few More Typescript Functions to CDK Definition

```
lambda-fns/lookupAddress.ts
lambda-fns/cookPizza.ts
lambda-fns/reportPizzaError.ts
```

### Added Basic Tests to the-state-machine.test.d.ts

```
test('Cook Pizza Lambda Created', ( ...
test('Lookup Address Lambda Created', ( ...
test('report Pizza Error Lambda Created', (...
```

### Test new deployment from command line

```
curl -X "POST" "https://28mgnmyr8k.execute-api.us-west-2.amazonaws.com/accounts/me/integrations/calendar" \
     -H 'Content-Type: text/plain; charset=utf-8' \
     -d $'{
    "flavour": "ham",
	"name": "John Smith"
}

```

#### RESULT: 

```
{
  
  "name": "55a579a0-bd9d-403c-b37b-4677ce00fd5a",
  ...
  "output": "{\"containsPineapple\":false}",
  ...
  "status": "SUCCEEDED"
  ...
}


```

OR:

```
curl -X "POST" "https://28mgnmyr8k.execute-api.us-west-2.amazonaws.com/accounts/me/integrations/calendar" \
     -H 'Content-Type: text/plain; charset=utf-8' \
     -d $'{
    "flavour": "pineapple",
	"name": "John Smith"
}
```

FAIL RESULT:

```

{
  "billingDetails": {
    "billedDurationInMilliseconds": 100,
    "billedMemoryUsedInMB": 64
  },
  "cause": "They asked for Pineapple, or Failed to Lookup Address",
  "error": "Failed To Make Pizza",
  "executionArn": "arn:aws:states:us-west-2:936871487948:express:StateMachine2E01A3A5-nlhFVEA8NgFN:4215fca3-d557-4e54-a7da-bc229c650e72:77e3c4df-372c-4d4d-bcb8-9f6a90b112dc",
  "input": "{\n    \"flavour\": \"pineapple\",\n\t\"name\": \"John Smith\"\n}\n",
  "inputDetails": {
    "__type": "com.amazonaws.swf.base.model#CloudWatchEventsExecutionDataDetails",
    "included": true
  },
  "name": "4215fca3-d557-4e54-a7da-bc229c650e72",
  "outputDetails": {
    "__type": "com.amazonaws.swf.base.model#CloudWatchEventsExecutionDataDetails",
    "included": true
  },
  "startDate": 1.664262316241E9,
  "stateMachineArn": "arn:aws:states:us-west-2:936871487948:stateMachine:StateMachine2E01A3A5-nlhFVEA8NgFN",
  "status": "FAILED",
  "stopDate": 1.664262316335E9,
  "traceHeader": "Root=1-6332a0ac-9496e57710f24f24d2fa4912;Sampled=1"
}

```
