import * as mongoose from 'mongoose';

const express = require('express');
const bodyParser = require('body-parser');
const { DB_URL, DEFAULT_PORT } = require('./config/config');
const cors = require('cors');

const app = express();
const logger = require('./utils/logger').getLogger();

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

mongoose.connect(DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.once('open', () => {
  logger.log('MongoDb is connected');
});

app.use('/user/', require('./routes/user_router'));
app.use('/groups/', require('./routes/groups_router'));
app.use('/expenses/', require('./routes/expense_router'));

app.use('/static/public', express.static(`${__dirname}/public`));
// set port, listen for requests
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}.`);
});

