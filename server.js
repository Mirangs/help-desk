const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');

const rootRouter = require('./routes/rootRouter');
const registerRouter = require('./routes/registerRouter');
const userDeskRouter = require('./routes/userDeskRouter');

dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/', rootRouter);
app.use('/register', registerRouter);
app.use('/user-desk', userDeskRouter);

app.listen(process.env.PORT, () => console.log(`Server is listening port ${process.env.PORT}`));