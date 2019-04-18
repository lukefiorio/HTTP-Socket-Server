'use strict';

const dataset = require('./data.js');

const net = require('net');

const response = `HTTP/1.1 200 OK
Content-Length: 4

asdf
`;

// this creates a server
const server = net
  .createServer((socket) => {
    socket.setEncoding('utf8');
    socket.on('data', (data) => {
      // this is the request
      //console.log(data);

      // do work here
      let myResponse = '';
      const endIndex = data.indexOf(' HTTP/1.1');
      let headValue = data.substring(5, endIndex);
      let replyLength = 0;
      let replyContent = '';
      //console.log(headValue);
      for (let i = 0; i < contentObjs.length; i++) {
        //console.log(contentObjs[i].fileName);
        if (headValue === contentObjs[i].fileName) {
          replyContent = contentObjs[i].content;
          replyLength = contentObjs[i].content.length;
          console.log(replyLength);
        }
      }
      console.log(replyLength);
      myResponse = `HTTP/1.1 200 OK
Date: ${new Date()}
Content-Type: text/html; charset=utf-8
Content-Length: 827

${replyContent}`;

      //           myResponse = `HTTP/1.1 200 OK
      // Date: ${new Date()}
      // Content-Type: text/html; charset=utf-8
      // Content-Length: ${contentObjs[i].content.length}

      // ${contentObjs[i].content}`;
      //   }
      // }
      //console.log(myResponse);
      // send response back here
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

const contentObjs = [
  {
    fileName: '/404.html',
    content: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Element not found!</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>404</h1>
      <h2>Element not found!</h2>
      <p>
        <a href="/">back</a>
      </p>
    </body>
    </html>`,
  },
  {
    fileName: '/helium.html',
    content: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>The Elements - Helium</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>Helium</h1>
      <h2>H</h2>
      <h3>Atomic number 2</h3>
      <p>Helium is a chemical element with symbol He and atomic number 2. It is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas that heads the noble gas group in the periodic table. Its boiling and melting points are the lowest among all the elements and it exists only as a gas except in extremely cold conditions.</p>
      <p><a href="/">back</a></p>
    </body>
    </html>`,
  },
  {
    fileName: '/hydrogen.html',
    content: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>The Elements - Hydrogen</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>Hydrogen</h1>
      <h2>H</h2>
      <h3>Atomic number 1</h3>
      <p>Hydrogen is a chemical element with chemical symbol H and atomic number 1. With an atomic weight of 1.00794 u, hydrogen is the lightest element on the periodic table. Its monatomic form (H) is the most abundant chemical substance in the universe, constituting roughly 75% of all baryonic mass. Non-remnant stars are mainly composed of hydrogen in its plasma state. The most common isotope of hydrogen, termed protium (name rarely used, symbol 1H), has a single proton and zero neutrons.</p>
      <p><a href="/">back</a></p>
    </body>
    </html>`,
  },
  {
    fileName: '/index.html',
    content: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>The Elements</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>The Elements</h1>
      <h2>These are all the known elements.</h2>
      <h3>These are 2</h3>
      <ol>
        <li>
          <a href="/hydrogen.html">Hydrogen</a>
        </li>
        <li>
          <a href="/helium.html">Helium</a>
        </li>
      </ol>
    </body>
    </html>`,
  },
  {
    fileName: '/styles.css',
    content: `@import url(http://fonts.googleapis.com/css?family=Open+Sans|Roboto+Slab);

    /* http://meyerweb.com/eric/tools/css/reset/
       v2.0 | 20110126
       License: none (public domain)
    */

    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
      display: block;
    }
    body {
      line-height: 1;
    }
    ol, ul {
      list-style: none;
    }
    blockquote, q {
      quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
      content: '';
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    /* STYLES */

    body{
      background-color: #3F3F4E;
      font-family: 'Open Sans', 'Helvetica', sans-serif;
      padding: 50px;
      max-width: 500px;
      margin: auto;
    }

    h1, h2, h3, h4, h5, h6{
      font-family: 'Roboto Slab', 'Helvetica', sans-serif;
      color: #B4D12B;
      margin-bottom: 20px;
    }

    h1{
      font-size: 50px;
      line-height: 55px;
    }

    h2{
      font-size: 30px;
      line-height: 38px;
      color: #879642;
    }

    h3{
      font-size: 25px;
      line-height: 30px;
      color: #F2FFC1;
    }

    p{
      color: #C6C5AC;
      font-family: 'Open Sans', 'Helvetica', sans-serif;
      line-height: 26px;
      font-size: 15px;
    }

    ul{

    }

    li{
      line-height: 26px;
      font-size: 15px;
    }

    a{
      color: #F2FFC1;
      text-decoration: none;
      border-bottom: 1px dashed #E3DE8B;
    }

    a:hover{
      color: #C6C5AC;
      border-bottom: 1px dashed #C6C5AC;
    }`,
  },
];

//console.log(contentObjs);
