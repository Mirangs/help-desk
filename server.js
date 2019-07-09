const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const redisClient = require('redis').createClient({
  url: 'redis://redistogo:a2252390ebb4c84474fa2bb8e16592b9@porgy.redistogo.com:11423/'
});
const RedisStore = require('connect-redis')(session);

const rootRouter = require('./routes/rootRouter');
const registerRouter = require('./routes/registerRouter');
const userDeskRouter = require('./routes/userDeskRouter');
const adminPanelRouter = require('./routes/adminPanelRouter');

dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ 
  store: new RedisStore({client: redisClient}),
  resave: true,
  rolling: true,
  saveUninitialized: false,
  secret: 'ukrpatent',
  cookie: {
    maxAge: 60 * 60 * 1000,
    httpOnly: false
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/', rootRouter);
app.use('/register', registerRouter);
app.use('/user-desk', userDeskRouter);
app.use('/admin-panel', adminPanelRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server is listening port ${process.env.PORT}`)
);
