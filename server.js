const app = require('express')();
const { json, static } = require('express');
const cors = require('cors');
const errorMiddleware = require('./src/middleware/error');
const routes = require('./src/routes');
const pagesRoute = require('./src/routes/pages');
const { version } = require('./package.json');
const Subscription = require('./src/models/subscription');
const User = require('./src/models/user');

// configure express app
app.use(json());
app.use(cors());

// set static files middleware
app.use('/static', static('./src/public'));

// set ejs as view engine
app.set('views', './src/pages');
app.set('view engine', 'ejs');

// validate if we have all the env variables setup.
require('./src/utils/util').validateEnvVar();

// use database
require('./src/db/mongoose');

// API routes
app.use('/api', routes);

// static pages routes
app.use('/', pagesRoute);

/* ----- start server ----- */

const { PORT = 3000 } = process.env;
const message = `[Service:Node] App v${version} running on port ${PORT}`;

app.get('/reset', resetAppData);

// main entry point
app.get('/', (_req, res) => res.send(message));

// use custom middleware for errors
app.use(errorMiddleware);

app.listen(PORT, () => console.info(message));

async function resetAppData(req, res) {
  await User.deleteMany();

  await Subscription.deleteMany();
  await Subscription.insertMany([
    {
      name: 'Free Trial',
      pricePerMonth: 0,
    },
    {
      name: 'Basic',
      pricePerMonth: 299,
    },
    {
      name: 'Premium',
      pricePerMonth: 799,
    },
  ]);

  res.send({
    success: true,
    message: 'Data reset successful',
  });
}
