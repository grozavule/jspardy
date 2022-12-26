const axios = require('axios');
const sequelize = require('../includes/database');
const {JSERVICE_URL} = process.env;

const stripSpecialChars = str => str.replaceAll(/\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:/g, '')

const retrieveCategories = () => {
    let categories = [];
    let promise = new Promise(async (resolve, reject) => {
        for(let i = 0; i <= 2500; i += 100)
        {
            await axios.get(`${JSERVICE_URL}/api/categories?count=100&offset=${i}`)
            .then(res => {
                categories.push.apply(categories, res.data);
            })
            .catch(error => reject(new Error(error.response.data)));
        }
        resolve(categories);
    });
    return promise;
}

const DatabaseMigrationController = {
    populate: (req, res) => {
        sequelize.query(`
            create table users (
                user_id SERIAL PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                email_address VARCHAR(100) NOT NULL UNIQUE,
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
                category_name VARCHAR(50),
                jsservice_id INTEGER NOT NULL UNIQUE
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
    },
    populateCategories: (req, res) => {
        let promise = retrieveCategories();
        promise.then(
            categories => {
                let insertQuery = `insert into categories (category_name, jsservice_id) values \n`;
                categories.forEach(category => insertQuery += `('${stripSpecialChars(category.title)}', ${category.id}),\n`);
                
                //trim off the final comma from the insert query
                sequelize.query(insertQuery.substring(0, insertQuery.length - 2))
                .then(dbRes => res.sendStatus(200))
                .catch(error => {
                    console.log(error);
                    res.status(400).send(error);
                });
            },
            error => {
                console.log(error);
                res.status(400).send(error);
            }
        );
    }
}

module.exports = DatabaseMigrationController;