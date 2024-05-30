import os
import json
import boto3
from datetime import datetime
import csv

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['DYNAMODB_TABLE_NAME'])
s3 = boto3.client('s3')
bucket_name = os.environ['S3_BUCKET_NAME']

def get_verified_users_list(bcbsa_user_ids):
    bcbsa_update_users_details = []
    
    for bcbsa_user_id in bcbsa_user_ids:
        response = table.get_item(
            Key={'id': bcbsa_user_id}
        )
        bcbsa_user = response.get('Item')
        
        if bcbsa_user and bcbsa_user.get('is_id_verified'):
            verification_dates = bcbsa_user.get('verification_dates')
            latest_verification_date = max(verification_dates)
            bcbsa_update_users_details.append({
                'id': bcbsa_user_id,
                'name': bcbsa_user.get('name'),
                'age': bcbsa_user.get('age'),
                'is_id_verified': bcbsa_user.get('is_id_verified'),
                'last_verification_date': latest_verification_date
            })
    return bcbsa_update_users_details

def get_users_csv_record(bcbsa_updated_users_details):
    bcbsa_csv_users_data = [['id', 'name', 'age', 'is_id_verified', 'last_verification_date']]
    for user_detail in bcbsa_updated_users_details:
        bcbsa_csv_users_data.append([
            user_detail['id'],
            user_detail['name'],
            user_detail['age'],
            user_detail['is_id_verified'],
            user_detail['last_verification_date']
        ])
        
    s3_file_local_path = f'/tmp/{datetime.now().strftime("%Y-%m-%d_%H-%M-%S")}.csv'
    s3_file_key = f'csv_files/{datetime.now().strftime("%Y-%m-%d_%H-%M-%S")}.csv'
    
    with open(s3_file_local_path, 'w') as s3_file:
        writer = csv.writer(s3_file)
        writer.writerows(bcbsa_csv_users_data)
    
    return {
        "local_path": s3_file_local_path,
        "file_key": s3_file_key
    }

def main(event, context):
    try:
        request_body = json.loads(event['body'])
        bcbsa_user_ids = request_body.get('user_ids', [])
        
        bcbsa_updated_users_details = get_verified_users_list(bcbsa_user_ids)
        
        if not bcbsa_updated_users_details:
            raise Exception('No users found.')

        s3_user_csv_record = get_users_csv_record(bcbsa_updated_users_details)
       
        s3.upload_file(s3_user_csv_record["local_path"], bucket_name, s3_user_csv_record["file_key"])
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                's3_key': s3_user_csv_record["file_key"],
                'timestamp': datetime.now().isoformat(),
                'status_message': 'Successfully added file to S3 Bucket.'
            })
        }
        
    except Exception as err:
        return {
            'statusCode': 500,
            'body': json.dumps({'Error': str(err)})
        }