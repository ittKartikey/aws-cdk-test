1. Create a post api that inserts data into dynamodb
Dynamodb fields - (id, name, age, is_id_verified, verification_dates)

Request payload :-
"users": [
{ "id": "00101", "name": "test", "age": 20, "is_id_verified": true, "verification_dates": ["16/05/2024", "16/04/2024", "16/01/2024"] },
{ "id": "00102", "name": "test 2", "age": 22, "is_id_verified": false, "verification_dates": ["10/04/2024", "16/04/2024", "15/01/2024"] },
{ "id": "00103", "name": "test 3", "age": 20, "is_id_verified": false, "verification_dates": ["26/03/2024", "16/04/2024", "13/01/2024"] },
{ "id": "00104", "name": "test 4", "age": 25, "is_id_verified": true, "verification_dates": ["06/11/2024", "16/12/2024", "12/01/2024"] },
{ "id": "00105", "name": "test 5", "age": 26, "is_id_verified": true, "verification_dates": ["16/10/2024", "16/04/2024", "18/01/2024"] },
{ "id": "00106", "name": "test 6", "age": 20, "is_id_verified": false, "verification_dates": ["14/05/2024", "16/11/2024", "19/01/2024"] },
{ "id": "00107", "name": "test 7", "age": 21, "is_id_verified": true, "verification_dates": ["12/01/2024", "16/04/2024", "16/05/2024"] },
{ "id": "00108", "name": "test 8", "age": 28, "is_id_verified": true, "verification_dates": ["11/09/2024", "16/01/2024", "16/06/2024"] },
{ "id": "00109", "name": "test 9", "age": 29, "is_id_verified": false, "verification_dates": ["10/08/2024", "16/03/2024", "16/07/2024"] },
{ "id": "00110", "name": "test 10", "age": 30, "is_id_verified": true, "verification_dates": ["16/05/2024", "16/02/2024", "16/02/2024"] }
]

Response :- 
status message (success or fail)

2. Create a second post api 
a.) By which user can pass a list of user ids
b.) Find the complete user details (name, age, is_id_verified, verification_dates) of all user ids that are sent using api for user whose "is_id_verified" is true in db and for "verification_dates" only take the greater date from the list.
c.) Create a csv file and store it into s3 (rename "verification_dates" to "last_verification_date" while creating csv as it will have only recent date)

Example of csv file for one id ("00101") :-

id,name,age,is_id_verified,last_verification_date
00101,test,20,true,16/05/2024

Request payload :- list of ids
"user_ids": [ "00101", "00102", "00103", "00104" ]

Response :- 
a.) s3 file key, timestamp of csv file inserted
b.) status message (success or fail)