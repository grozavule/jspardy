const sequelize = require('../includes/database');
const bcrypt = require('bcryptjs');

const retrieveUserByEmail = email => {
    let promise = new Promise((resolve, reject) => {
        sequelize.query(`
            select * from users where email_address='${email}';
        `)
        .then(dbRes => {
            if(dbRes[0].length > 0)
            {
                resolve(dbRes[0])
            }
            throw new Error(`User does not exist`);
        })
        .catch(error => reject(new Error(error.message)));
    });
    return promise;
}

const AuthController = {
    login: (req, res) => {
        let {email, password} = req.body;

        let promise = retrieveUserByEmail(email);
        promise.then(
            users => {
                let {user_id, first_name, last_name, email_address, password: passwordHash} = users[0];
                if(bcrypt.compareSync(password, passwordHash))
                {
                    delete users[0].password;
                    res.status(200).send(users[0]);
                }
                else
                {
                    res.status(400).send(`Invalid username or password`);
                }
            },
            error => res.status(400).send(`Invalid username/password`)
        );
    },
    register: (req, res) => {
        let {firstName, lastName, emailAddress, password} = req.body;
        
        //check if the email addres has already been used
        let promise = retrieveUserByEmail(emailAddress);
        promise.then(
            users => {
                //if the user doe
                if(users.length <= 0)
                {
                    //hash the password sent in the registration form
                    let salt = bcrypt.genSaltSync(10);
                    password = bcrypt.hashSync(password, salt);

                    //create the new user in the database
                    sequelize.query(`
                        insert into users (first_name, last_name, email_address, password) values
                        ('${firstName}', '${lastName}', '${emailAddress}', '${password}');
                    `)
                    .then(dbRes => res.status(200).send(`Your user has been successfully created!`))
                    .catch(error => res.status(400).send(error.response.data));
                }
                else
                {
                    res.status(400).send(`This email address has already been registered. Please log in.`);
                }
            },
            error => res.status(400).send(error.response.data)
        );

    }
}

module.exports = AuthController;