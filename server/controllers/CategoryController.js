const sequelize = require('../includes/database');

//selects 'count' number of categories at random
const selectRandomCategories = (categories, count, selected = []) => {
    if(count <= 0)
    {
        return selected;
    }
    else
    {
        let randomIndex = Math.floor(Math.random() * categories.length);
        selected.push(categories[randomIndex]);
        categories.splice(randomIndex, 1);
        return selectRandomCategories(categories, --count, selected);
    }
}

const CategoryController = {
    //retrieves all categories from the database unless a count query string variable is sent to specify how many categories are needed
    getCategories: (req, res) => {
        let {count} = req.query;
        sequelize.query(`
            select * from categories;
        `)
        .then(dbRes => {
            let categories = dbRes[0];
            if(count > 0)
            {
                let randomCategories = selectRandomCategories(categories, count);
                res.status(200).send(randomCategories);
                return;
            }
            else
            {
                res.status(200).send(categories);
                return;
            }
        })
        .catch(error => {
            console.log(error);
            res.status(400).send(error);
        })
    }
}

module.exports = CategoryController;