//verify that the user is logged in
let user = sessionStorage.getItem('user');
if(!user)
{
    navigateToHome();
}

const gameContainer = document.querySelector('#gameboard-container');

const fetchCategories = (numCategories = 6) => {
    //get random categories
    let promise = new Promise((resolve, reject) => {
        axios.get(`/api/categories?count=${numCategories}`)
        .then(res => {
            resolve(res.data);
        })
        .catch(error => reject(new Error(error.response.data)));
    });
    return promise;
}

const fetchQuestions = category => {
    let promise = new Promise((resolve, reject) => {
        axios.get(`${TRIVIA_API_BASE_URL}/api/category?id=${category.jsservice_id}`)
        .then(res => {
            if(res.data.clues.length < 5)
            {
                reject(new Error('Too few questions'));
            }
            resolve(res.data);
        })
        .catch(error => reject(new Error(error)));
    });
    return promise;
}

const buildCategory = (category) => {
    let promise = fetchQuestions(category);
    promise.then(
        questions => {
            let categoryTitle = document.createElement('header');
            categoryTitle.classList.add('game-square');
            categoryTitle.textContent = category.category_name;

            let categoryContainer = document.createElement('section');
            categoryContainer.classList.add('category-container');
            categoryContainer.appendChild(categoryTitle);

            let questionValue = 100;
            questions.clues.forEach(question => {
                //limit the number of questions to 5 and the highest question value to 500
                if(questionValue > 500)
                {
                    return;
                }
                let questionBox = document.createElement('div');
                questionBox.classList.add('game-square');
                questionBox.textContent = questionValue;
                questionValue += 100;

                categoryContainer.appendChild(questionBox);
            });
            gameContainer.appendChild(categoryContainer);
        }
    ).catch(error => {
        console.log(error);
        let categoryPromise = fetchCategories(1);
        categoryPromise.then(
            categories => {
                buildCategory(categories[0]);
            }
        ).catch(error => console.log(error));
    });
}

const buildGame = () => {
    //request 6 randomly chosen categories
    let categoryPromise = fetchCategories(6);
    categoryPromise.then(
        categories => {
            categories.forEach(category => buildCategory(category));
        }
    );
}

buildGame();