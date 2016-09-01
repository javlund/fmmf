const pg = require('pg');
const express = require('express');
const app = express();
const port = process.env.PORT || 2500;

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if(err) {
    throw err;
  }
  console.log('Connected to database');
  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

app.use(express.static('.'));

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
