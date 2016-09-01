const express = require('express');
const app = express();
const port = process.env.PORT || 2500;

app.use(express.static('.'));

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
