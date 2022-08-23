const dotenv = require('dotenv').config();
const express = require('express');
const mountRoutes = require('./routes')

const app = express();

const cors = require('cors');
const port = process.env.PORT || 3008;
mountRoutes(app)

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to the Homemade API');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
