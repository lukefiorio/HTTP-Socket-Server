'use strict';

const process = require('process');
const net = require('net');
const fs = require('fs');

let headerObj = {};
let allData = '';
let dataCnt = 0;

function makeConnection(port, host, uri, method, fileName) {
  const client = net.createConnection(port, host);
  client.setEncoding('utf8');

  client.on('connect', function() {
    client.write(`${method} ${uri} HTTP/1.1
Host: ${host}
Date: ${new Date()}
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36
Connection: close

`);
    console.log(`Connected to ${host}`);
  });

  client.on('data', function(data) {
    allData += data;
    dataCnt++;
    console.log('Received Data Packet #', dataCnt);
  });

  client.on('end', function() {
    const header = allData.substring(0, allData.indexOf(`\r\n\r`));
    const headerArr = header.split(`\r\n`);
    // handle first line of header separately
    const spaceIndex1 = headerArr[0].indexOf(' ');
    const spaceIndex2 = headerArr[0].indexOf(' ', spaceIndex1 + 1);
    headerObj.HTTP = headerArr[0].substring(0, spaceIndex1);
    headerObj.StatusCode = headerArr[0].substring(spaceIndex1 + 1, spaceIndex2);
    headerObj.StatusMessage = headerArr[0].substring(spaceIndex2 + 1, headerArr[0].length);
    // remaining header lines can be parsed based on ':'
    let colonIndex = 0;
    let keyName = '';
    let keyValue = '';
    for (let i = 1; i < headerArr.length; i++) {
      colonIndex = headerArr[i].indexOf(':');
      // remove hyphens because they store the keyName as a string otherwise
      keyName = headerArr[i].substring(0, colonIndex).replace('-', '');
      keyValue = headerArr[i].substring(colonIndex + 2, headerArr[i].length);
      headerObj[keyName] = keyValue;
    }

    // display output based on request type
    if (method === 'HEAD') {
      console.log(`HEADER:\n`, header);
      console.log(`\nHEADER (as an Object):\n`, headerObj);
    } else {
      console.log(`RESPONSE:\n`, allData);
    }

    if (fileName !== '') {
      fs.writeFile(fileName, allData, function(err) {
        if (err) {
          return console.log(err);
        }
      });
    }

    console.log(`\nEnded connection to ${host}`);
    return headerObj;
  });
}

// each " "-delimited string entered in terminal is stored as an argument in the [process.argv] array
const argArray = process.argv;
if (argArray.length < 3) {
  console.log(`\n\tPlease specify a host/uri after "node client.js"\n`);
  console.log(`\tUse the following format to make requests:`);
  console.log(`\t\targument 1 [required]:\tnode`);
  console.log(`\t\targument 2 [required]:\tclient.js`);
  console.log(`\t\targument 3 [optional]:\t[method]`);
  console.log(`\t\targument 4 [optional]:\t[-save filename.extension]\n`);
  console.log(`\tYou can request localhost using "localhost/[uri]", form example "localhost/helium.html"`);
  console.log(`\tTyping only "localhost" will request to "localhost/index.html"\n`);
  console.log(`\tYou can request outside of local using [webAddress]/[uri]`);
  console.log(`\tFor example: "espn.com", or "manoabbq.com/PartyPack.html"\n`);
  console.log(`\tYou may optionally specify a request method after your host/uri. Default = GET.`);
  console.log(`\tFor example: "node client.js devleague.com GET" or "node client.js manoabbq.com HEAD"\n`);
  console.log(`\tYou may optionally save the server response using "-save [filename.extentsion]"`);
  console.log(`\tFor example: "node client.js manoabbq.com -save myBBQ.txt"\n`);
  return;
} else {
  let myMethod = 'GET';
  let myPort = 0;
  let myHost = '';
  let myUri = '';
  // if have any optional arguments
  let saveIndex = 0;
  const searchStr = '-SAVE';
  let myFileName = '';
  if (argArray.length >= 4) {
    saveIndex = argArray.findIndex(function(elem) {
      return elem.toUpperCase() === searchStr;
    });

    if (saveIndex === -1) {
      myMethod = argArray[3].toUpperCase();
    } else {
      if (argArray.length <= saveIndex + 1) {
        console.log('Please specify a filename and extension to save to');
        return;
      }
      myFileName = argArray[saveIndex + 1];
    }
  }
  // argArray[2] is the terminal input after "node client.js"
  const findSlash = argArray[2].indexOf('/');
  // if inputting local host, determine whether any file was specified (search for '/')
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
  makeConnection(myPort, myHost, myUri, myMethod, myFileName);
}
