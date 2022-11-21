// app.js 
const sls = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');
const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
app.use(bodyParser.json({ strict: false }));
// Create User endpoint
app.post('/gcp', function (req, res) {
  const { userId, name, gcpid, endtoendid, remittanceinfo, clientref, amount, status } = req.body;
const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
      gcpid: gcpid,
      endtoendid: endtoendid,
      remittanceinfo: remittanceinfo,
      clientref: clientref,
      amount: amount,
      status: status,
    },
  };
dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: `Could not create transaction ${userId}` });
    }
    res.json({ userId, name, gcpid, endtoendid, remittanceinfo, clientref, amount, status });
  });
})
// Get User endpoint
app.get('/gcp/:userId', function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  }
dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: `Could not get transaction ${userId}` });
    }
    if (result.Item) {
      const {userId, name, gcpid, endtoendid, remittanceinfo, clientref, amount, status} = result.Item;
      res.json({ userId, status });
    } else {
      res.status(404).json({ error: `Transaction ${userId} not found` });
    }
  });
})
module.exports.server = sls(app)