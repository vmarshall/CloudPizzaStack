#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("@aws-cdk/core");
const the_state_machine_stack_1 = require("../lib/the-state-machine-stack");
const app = new cdk.App();
new the_state_machine_stack_1.TheStateMachineStack(app, 'CloudPizzaStack');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlLXN0YXRlLW1hY2hpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0aGUtc3RhdGUtbWFjaGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1Q0FBcUM7QUFDckMscUNBQXFDO0FBQ3JDLDRFQUFzRTtBQUV0RSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLDhDQUFvQixDQUFDLEdBQUcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgVGhlU3RhdGVNYWNoaW5lU3RhY2sgfSBmcm9tICcuLi9saWIvdGhlLXN0YXRlLW1hY2hpbmUtc3RhY2snO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IFRoZVN0YXRlTWFjaGluZVN0YWNrKGFwcCwgJ0Nsb3VkUGl6emFTdGFjaycpOyJdfQ==