const sequelize = require('../includes/database');
const bcrypt = require('bcryptjs');

const checkDuplicateEmail = email => {
    let promise = new Promise((resolve, reject) => {
        sequelize.query(`
            select from users where email_address='${email}';
        `)
        .then(dbRes => resolve(dbRes[0].length))
        .catch(error => reject(new Error(error.response.data)));
    });
    return promise;
}

const AuthController = {
    register: (req, res) => {
        let {firstName, lastName, emailAddress, password} = req.body;
        
        //check if the email addres has already been used
        let promise = checkDuplicateEmail(emailAddress);
        promise.then(
            userCount => {
                //if the user doe
                if(userCount <= 0)
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