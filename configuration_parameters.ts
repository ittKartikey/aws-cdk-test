import * as cdk from 'aws-cdk-lib';

export interface EnvProps extends cdk.StackProps{
  BCBSA_API_DEPLOYMENT_STAGE_ENV_NAME: string,
  BCBSA_USERS_DYNAMO_DB_TABLE_NAME: string,
  BCBSA_USERS_POSTING_LAMBDA_NAME: string,
  BCBSA_USERS_SEARCH_LAMBDA_NAME: string,
  BCBSA_USERS_S3_BUCKET_NAME: string,
  BCBSA_REST_API_ENDPOINT_NAME: string,
}

export const devEnvProps: EnvProps = {
  env: { 
    account: "467600343464",
    region: "us-east-1", 
  },
  BCBSA_API_DEPLOYMENT_STAGE_ENV_NAME: "dev",
  BCBSA_USERS_DYNAMO_DB_TABLE_NAME: "bcbsa-users-dynamodb-table",
  BCBSA_USERS_POSTING_LAMBDA_NAME: "bcbsa-users-dynamodb-data-posting-lambda",
  BCBSA_USERS_SEARCH_LAMBDA_NAME: "bcbsa-search-users-dynamodb-lambda",
  BCBSA_USERS_S3_BUCKET_NAME: "bcbsa-users-csv-s3-bucket",
  BCBSA_REST_API_ENDPOINT_NAME: "bcbsa-lambda-rest-api-endpoint",
}

