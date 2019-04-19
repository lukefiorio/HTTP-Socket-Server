'use strict';

const net = require('net');
const stream = require('stream');
const http = require('http');
const EventEmitter = require('events');
//const WebSocket = require('ws');
//const connection = new WebSocket('ws://localhost:8080/index.html');
//console.log(connection);

const client = net.createConnection(8080, 'localhost');
client.setEncoding('utf8');
console.log(client);

client.on('connect', function() {
  client.write(`GET /helium.html HTTP/1.1`);
  console.log('on connect: Connect');
});

client.on('data', function(data) {
  console.log('on data:', data);
});

client.on('end', function() {
  console.log('on end: done');
});
