const http = require('http');
const express = require('express');
const app = express();
const port = 2500;

app.get('/', (req, res) => {
    res.send('Hello world.');
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
