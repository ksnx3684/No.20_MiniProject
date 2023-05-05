const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const router = require('./routes');

app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

app.listen(port, () => {
  console.log('Server open on port', port);
});
