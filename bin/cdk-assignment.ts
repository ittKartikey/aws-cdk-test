#!/usr/bin/env node
import { devEnvProps } from '../configuration_parameters';
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkAssignmentStack } from '../lib/cdk-assignment-stack';


const app = new cdk.App();

new CdkAssignmentStack(app, 'CdkAssignmentStack', devEnvProps);