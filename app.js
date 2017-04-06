/**
 * Created by Virgil on 11.03.2017
 */

// Require modules
var sqlite3 = require('sqlite3').verbose();
var AWS = require("aws-sdk");

//AWS Cloud Configuration
//run on local DynamoDB instance
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

//Create connection to database
try{
    //var db = new sqlite3.Database('./db/sensor_logger.db');
    var db = new sqlite3.Database('/home/pi/Documents/Personal Projects/Cloud Sensors Data Logger/SQLITE_DB/Sensors.db')
}catch (err){
    console.log("Could not connect to database")
}

//Create DynamoDb service instance
var dynamodb = new AWS.DynamoDB(); // used for real AWS account
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "SensorReadings";

var stmt = "SELECT * FROM " + table;

db.each(stmt, function(err, row){
    console.log(row.Id, row.Sensor_No, row.Sensor_Type, row.Temperature, row.Humidity, row.Pressure, row.Datestamp);

    var params = {
    TableName: table,
        Item:{
            "Id":           row.Id,
            "SensorNumber": row.Sensor_No,
            "Type":         String(row.Sensor_Type),
            "Temperature":  String(row.Temperature),
            "Pressure":     String(row.Pressure),
            "Humidity":     String(row.Humidity),
            "Datestamp":    row.Datestamp.toLocaleString(),
        },
    "ConditionExpression": "attribute_not_exists(Id) and attribute_not_exists(SensorNumber)"
    };

    docClient.put(params, function(err, data){
        if (err)
            console.log(JSON.stringify(err, null, 2));
        else
            console.log(JSON.stringify(data, null, 2));
    });

    console.log("Sensor value with id = " + row.Id + " has been processed and added successfully");
});

db.close();



