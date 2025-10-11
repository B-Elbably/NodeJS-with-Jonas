const fs = require('fs');
const http = require('http');
const path = require('path');
const { default: slugify } = require('slugify');
const url = require('url');
const replaceTemplate = require(`${__dirname}/modules/replaceTemp`);
// TODO: File Manipulation

// -- (Blocking - Sync)
// const textIn = fs.readFileSync("./txt/file.txt", "utf-8");
// console.log(textIn);
// const textOut = `Edited\n${textIn}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("Sync Done!!");

// -- (Non-blocking - Async)
fs.readFile('./txt/file.txt', 'utf-8', (err, data1) => {
  if (err) return console.log('Error!!');
});

// $============^^New STEP^^======================
// TODO: SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8',
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-cards.html`,
  'utf-8',
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8',
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // console.log(query);
  // console.log(pathName);
  const pathName = pathname;
  // !!Overview Page
  if (pathName == '/' || pathName == '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%CARDS%}', cardsHtml);
    res.end(output);
  }
  // !!api Page
  else if (pathName == '/api') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data);
  }
  // !!Product Page
  else if (pathName == '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  // !! Not found!
  else {
    res.writeHead(404, {
      'content-type': 'text/html',
    });
    res.end('<h1>No!!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log("Listen I'n in port 8000");
});
