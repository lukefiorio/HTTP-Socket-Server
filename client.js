'use strict';

const process = require('process');
const net = require('net');
// const stream = require('stream');
// const http = require('http');
// const EventEmitter = require('events');

function makeConnection(port, host, uri) {
  const client = net.createConnection(port, host);
  client.setEncoding('utf8');

  client.on('connect', function() {
    client.write(`GET ${uri} HTTP/1.1
Host: ${host}
Date: ${new Date()}
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36

`);
    console.log(`Connected to ${host}`);
  });

  client.on('data', function(data) {
    console.log(data);
  });

  client.on('end', function() {
    console.log(`Ended connection to ${host}`);
  });
}

// each " "-delimited string entered in terminal are stored in an array as arguments
const argArray = process.argv;

if (argArray.length < 3) {
  console.log(`\n\tPlease specify a host/uri after "node client.js"\n`);
  console.log(`\tYou can request localhost using "localhost/[uri]", form example "localhost/helium.html"`);
  console.log(`\tTyping only "localhost" will request to "localhost/index.html"\n`);
  console.log(`\tYou can request outside of local using [webAddress]/[uri]`);
  console.log(`\tFor example: "espn.com", or "manoabbq.com/PartyPack.html"\n`);
  return;
} else {
  let myPort = 0;
  let myHost = '';
  let myUri = '';
  // argArray[2] is the terminal input after "node client.js"
  const findSlash = argArray[2].indexOf('/');
  // if inputting local host, determine whether any file was specified (find '/')
  // if no file specified, provide index.html
  if (argArray[2].indexOf('localhost') >= 0) {
    myPort = 8080;
    myHost = 'localhost';
    if (findSlash === -1 || findSlash === argArray[2].length - 1) {
      myUri = '/index.html';
    } else {
      myUri = argArray[2].substring(findSlash, argArray[2].length);
    }
    // if looking outside of localhost then parse argument into host/uri based on '/'
  } else {
    myPort = 80;
    if (findSlash === -1) {
      myHost = argArray[2];
      myUri = '/';
    } else {
      myHost = argArray[2].substring(0, findSlash);
      myUri = argArray[2].substring(findSlash, argArray[2].length);
    }
  }
  makeConnection(myPort, myHost, myUri);
}
