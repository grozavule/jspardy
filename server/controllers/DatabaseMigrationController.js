require('dotenv').config();
let {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

const Sequelize = require('sequelize');
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false
});

const DatabaseMigrationController = {
    populate: (req, res) => {
        sequelize.query(`
            create table users (
                user_id SERIAL PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                email_address VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL
            );
            create table games (
                game_id SERIAL PRIMARY KEY,
                game_name VARCHAR(50) NOT NULL
            );
            create table user_games (
                user_id INTEGER NOT NULL REFERENCES users(user_id),
                game_id INTEGER NOT NULL REFERENCES games(game_id),
                PRIMARY KEY(user_id, game_id)
            );
            create table categories (
                category_id SERIAL PRIMARY KEY,
                category_name VARCHAR(50)
            );
            create table questions (
                question_id SERIAL PRIMARY KEY,
                answer TEXT NOT NULL,
                question TEXT NOT NULL,
                value INTEGER NOT NULL,
                category_id INTEGER NOT NULL REFERENCES categories(category_id)
            );
            create table game_questions (
                game_id INTEGER NOT NULL REFERENCES games(game_id),
                question_id INTEGER NOT NULL REFERENCES questions(question_id),
                PRIMARY KEY(game_id, question_id)
            );
        `)
        .then(db => res.sendStatus(200))
        .catch(error => res.status(400).send(error.response.data));
    }
}

module.exports = DatabaseMigrationController;