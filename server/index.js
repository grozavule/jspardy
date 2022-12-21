require('dotenv').config();
const express = require('express');
const cors = require('cors');

const DatabaseMigrationController = require('./controllers/DatabaseMigrationController');

const {SERVER_PORT} = process.env;

const app = express();
app.use(express.json());
app.use(express.static('client'));
app.use(cors());

app.get('/', (req, res) => res.sendFile('index.html'));
app.get('/db-migrate', DatabaseMigrationController.populate);

app.listen(SERVER_PORT, () => console.log(`Server running on ${SERVER_PORT}`));