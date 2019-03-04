const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const app = express();
app.use(bodyParser.json())

var routes = require('../src/server/routes');
app.use(cors());

app.use('/api', routes);

const port = 5001;

app.listen(port, () => `Server started on port ${port}`)