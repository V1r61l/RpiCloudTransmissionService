/**
 * Created by xps on 11-Mar-17.
 */

var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-central-1",
    endpoint: "http://192.168.0.100:8000/",
    // accessKeyId default can be used while using the downloadable version of DynamoDB.
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    accessKeyId: "fakeMyKeyId",
    // secretAccessKey default can be used while using the downloadable version of DynamoDB.
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    secretAccessKey: "fakeSecretAccessKey"
});

console.log("Connecting to localhost port 8000 ...");
var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "SensorReadings",
    KeySchema:[
        { AttributeName: "Id", KeyType: "HASH"},  //Partition key
        { AttributeName: "SensorNumber", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "Id", AttributeType: "N" },
        { AttributeName: "SensorNumber", AttributeType: "N" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err)
        console.log(JSON.stringify(err, null, 2));
    else
        console.log(JSON.stringify(data, null, 2));
});