import { EnvStackProps } from '../configuration_parameters'
import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy ,aws_lambda as lambda, aws_dynamodb as dynamodb, aws_apigateway as apigateway, aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as cdk from 'aws-cdk-lib';
import path = require('path');


export class CdkAssignmentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EnvStackProps ) {
    super(scope, id, props);

    const bcbsaUserDBTable = new dynamodb.Table(this, 'bcbsaUserDynamoDBTable', {
      tableName: props.BCBSA_USERS_DYNAMO_DB_TABLE_NAME,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY
    })
    
    const bcbsaUserDynamoDBDataPostingLambda = new lambda.Function(this, 'bcbsaUserDynamoDBDataPostingLambda', {
      functionName: props.BCBSA_USERS_POSTING_LAMBDA_NAME,
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.main',
      code: lambda.Code.fromAsset(path.join(__dirname, 'bcbsa_post_users_lambda_dynamoDb')),
      environment:{
        "DYNAMODB_TABLE_NAME" : props.BCBSA_USERS_DYNAMO_DB_TABLE_NAME
      }
    });
    bcbsaUserDBTable.grantWriteData(bcbsaUserDynamoDBDataPostingLambda);
    
    const bcbsaSearchUsersDynamoDBLambda = new lambda.Function(this, 'bcbsaSearchUsersDynamoDBLambda', {
      functionName: props.BCBSA_USERS_SEARCH_LAMBDA_NAME,
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.main',
      code: lambda.Code.fromAsset(path.join(__dirname, 'bcbsa_search_users_lambda_dynamoDb')),
      environment:{
        "DYNAMODB_TABLE_NAME" : props.BCBSA_USERS_DYNAMO_DB_TABLE_NAME,
        "S3_BUCKET_NAME": props.BCBSA_USERS_S3_BUCKET_NAME
      }
    });
    bcbsaUserDBTable.grantReadData(bcbsaSearchUsersDynamoDBLambda)
    
    const bcbsaUsersCSVS3Bucket = new s3.Bucket(this, 'bcbsaUsersCSVS3Bucket',{
      bucketName: props.BCBSA_USERS_S3_BUCKET_NAME,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY
    });
    bcbsaUsersCSVS3Bucket.grantWrite(bcbsaSearchUsersDynamoDBLambda)

    const bcbsaLambdaRestApiEndpoint = new apigateway.RestApi(this, 'bcbsaLambdaRestApiEndpoint', {
      restApiName: props.BCBSA_REST_API_ENDPOINT_NAME,
    });
    bcbsaLambdaRestApiEndpoint.applyRemovalPolicy(RemovalPolicy.DESTROY)
    
    const bcbsaUsersResource = bcbsaLambdaRestApiEndpoint.root.addResource('users');
    const bcbsaUsersLambdaIntegration = new apigateway.LambdaIntegration(bcbsaUserDynamoDBDataPostingLambda);
    bcbsaUsersResource.addMethod('POST', bcbsaUsersLambdaIntegration);
    
    const bcbsaSearchUsersResource = bcbsaUsersResource.addResource('search_users');
    const bcbsaSearchUsersLambdaIntegration = new apigateway.LambdaIntegration(bcbsaSearchUsersDynamoDBLambda);
    bcbsaSearchUsersResource.addMethod('POST', bcbsaSearchUsersLambdaIntegration)
  }
}
