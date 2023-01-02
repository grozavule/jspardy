require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const DatabaseMigrationController = require('./controllers/DatabaseMigrationController');
const AuthController = require('./controllers/AuthController');
const CategoryController = require('./controllers/CategoryController');

const {SERVER_PORT} = process.env;

const app = express();
app.use(express.json());
app.use(express.static('client'));
app.use(cors());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/index.html')));
app.get('/game', (req, res) => res.sendFile(path.join(__dirname, '../client/game.html')));
app.get('/end', (req, res) => res.sendFile(path.join(__dirname, '../client/end.html')));

app.get('/api/categories', CategoryController.getCategories);

app.get('/api/db/migrate', DatabaseMigrationController.populate);//creates the database
app.get('/api/db/categories', DatabaseMigrationController.populateCategories);//retrieves categories from API and saves them to db

app.post('/api/register', AuthController.register);
app.post('/api/login', AuthController.login);

app.listen(SERVER_PORT, () => console.log(`Server running on ${SERVER_PORT}`));