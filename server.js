'use strict';

const myReplies = require('./data.js');
const net = require('net');

const response = `HTTP/1.1 200 OK
Content-Length: 4

asdf
`;

// create a server
const server = net
  .createServer((socket) => {
    socket.setEncoding('utf8');
    socket.on('data', (data) => {
      let myResponse = '';
      const startIndex = data.indexOf(' /');
      const endIndex = data.indexOf(' HTTP/1.1');
      let headerFile = data.substring(startIndex + 2, endIndex);
      let replyLength = 0;
      let replyContent = '';

      for (let i = 0; i < myReplies.length; i++) {
        if (headerFile === myReplies[i].fileName) {
          replyContent = myReplies[i].content;
          replyLength = myReplies[i].content.length;
        }
      }

      myResponse = `HTTP/1.1 200 OK
Date: ${new Date()}
Content-Type: text/html; charset=utf-8
Content-Length: ${replyLength}

${replyContent}`;
      // send back response
      socket.end(myResponse);
    });
  })
  // handle errors on the server
  .on('error', (err) => {
    console.log(err);
  });

// this starts the server
server.listen(8080, () => {
  console.log('Server is UP');
});
