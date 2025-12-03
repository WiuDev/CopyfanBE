const express = require('express');
const cors = require('cors');
const routes = require('./src/routes/routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setTimeout(15000, () => {
    return res.status(408).json({ error: "Request timeout" });
  });
  next();
});
app.use('/', routes);

module.exports = app;