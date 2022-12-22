require('dotenv').config();
const express = require('express');
const cors = require('cors');

const DatabaseMigrationController = require('./controllers/DatabaseMigrationController');
const AuthController = require('./controllers/AuthController');

const {SERVER_PORT} = process.env;

const app = express();
app.use(express.json());
app.use(express.static('client'));
app.use(cors());

app.get('/', (req, res) => res.sendFile('index.html'));
app.get('/game', (req, res) => res.sendFile('game.html'));

app.get('/db-migrate', DatabaseMigrationController.populate);//creates the database

app.post('/api/register', AuthController.register);

app.listen(SERVER_PORT, () => console.log(`Server running on ${SERVER_PORT}`));