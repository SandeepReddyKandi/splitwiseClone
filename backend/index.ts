import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import { DB_URL, DEFAULT_PORT } from './config/config';
import getLogger from './utils/logger';
import userRouter from './routes/user_router';
import groupRouter from './routes/groups_router';
import expenseRouter from './routes/expense_router';
import publishKafkaMessage from './kafka-producer';

const app = express();

// call the `produce` function and log an error if it occurs
publishKafkaMessage({key: 'Init', value: 'Backend is running!'})

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
  console.log('Connected')
  getLogger().log('MongoDb is connected');
});

app.use('/user/', userRouter);
app.use('/groups/', groupRouter);
app.use('/expenses/', expenseRouter);

app.use('/static/public', express.static(`${__dirname}/public`));
// set port, listen for requests
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  getLogger().info(`Server is running on port ${PORT}.`);
});

