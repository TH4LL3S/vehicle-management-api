const express = require('express');
const carRoutes = require('./routes/carRoutes');
const driverRoutes = require('./routes/driverRoutes');
const usageRoutes = require('./routes/usageRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'ok'
  });
});

app.use('/cars', carRoutes);
app.use('/drivers', driverRoutes);
app.use('/usages', usageRoutes);

app.use(errorHandler);

module.exports = app;