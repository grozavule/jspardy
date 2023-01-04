//verify that the user is logged in
let user = JSON.parse(sessionStorage.getItem('user'));
if(!user)
{
    navigateToHome();
}
user.gameScore = 0;
sessionStorage.setItem('user', JSON.stringify(user));
console.log(user);

import { Gameboard } from './classes/Gameboard.js';
import { Category } from './classes/Category.js';
import { Question } from './classes/Question.js';
import { CategoryQuestionAmountError } from './classes/CategoryQuestionAmountError.js';
import { AxiosError } from './classes/AxiosError.js';

const gameboard = new Gameboard();
const gameContainer = document.querySelector('#gameboard-container');
let playerScoreContainer = document.querySelector('#player-score');
playerScoreContainer.innerHTML = `${user.first_name}'s Score: <span id="score">${gameboard.getPlayerScore()}</span>`;

const shiftGameboard = e => {
    const contentContainer = document.querySelector('#game');
    const gameboardContainer = document.querySelector('#gameboard-container');
    const categoryContainer = document.querySelector('.category-container');
    const rightArrow = document.querySelector('#arrow-right');
    const leftArrow = document.querySelector('#arrow-left');

    let categoryWidth = categoryContainer.offsetWidth;
    let margin = getComputedStyle(categoryContainer).margin.split(' ').map(value => parseInt(value));
    let categoriesOnScreen = Math.floor(contentContainer.offsetWidth / (categoryWidth + margin[1] + margin[3]));//calculates how many categories can fit in the content window

    let newPosition = 0;
    let currentLeftPosition = parseInt(getComputedStyle(gameboardContainer).left);
    const arrowId = (e.target.id) ? e.target.id : e.currentTarget.id;
    console.log(arrowId, currentLeftPosition, categoriesOnScreen);
    switch(arrowId){
        case 'arrow-left':
            newPosition = currentLeftPosition - (categoryWidth + margin[1] + margin[3]);
            gameboardContainer.style.left = newPosition + 'px';
            break;
        case 'arrow-right':
            newPosition = currentLeftPosition + categoryWidth + margin[1] + margin[3];
            gameboardContainer.style.left = currentLeftPosition + categoryWidth + margin[1] + margin[3] + 'px';
            break;
    }
    console.log(newPosition);
    //hide the right arrow if the gameboard is at its original position
    if(newPosition >= 0)
    {
        rightArrow.style.display='none';
    }
    else
    {
        rightArrow.style.display='block';
    }
    //hide the left arrow if the gameboard is shifted to the last column on the right
    if(newPosition <= 0 - gameboardContainer.offsetWidth + (categoriesOnScreen * (categoryWidth + margin[1] + margin[3])))
    {
        leftArrow.style.display='none';
    }
    else
    {
        leftArrow.style.display='block';
    }
    
}

const arrows = document.querySelectorAll('.arrow');
arrows.forEach(arrow => {
    arrow.addEventListener('click', shiftGameboard);
});

//retrieves categories from the database
const fetchCategories = numCategories => {
    //get random categories
    let promise = new Promise((resolve, reject) => {
        axios.get(`/api/categories?count=${numCategories}`)
        .then(res => {
            resolve(res.data);
        })
        .catch(error => reject(new AxiosError(error.message)));
    });
    return promise;
}

//retrieves questions for a given category from the API
const fetchQuestions = category => {
    let promise = new Promise((resolve, reject) => {
        axios.get(`${TRIVIA_API_BASE_URL}/api/category?id=${category.jServiceId}`)
        .then(res => {
            if(res.data.clues.length < 5)
            {
                reject(new CategoryQuestionAmountError('Too few questions', category));
            }
            resolve(res.data);
        })
        .catch(error => reject(new AxiosError(error.message)));
    });
    return promise;
}

//creates the UI elements for a category
const buildCategory = (category) => {
    let promise = fetchQuestions(category);
    promise.then(
        questions => {
            let categoryTitle = document.createElement('header');
            categoryTitle.classList.add('game-square');
            categoryTitle.textContent = category.categoryName;

            let categoryContainer = document.createElement('section');
            categoryContainer.classList.add('category-container');
            categoryContainer.appendChild(categoryTitle);

            let questionValue = 100;
            questions.clues.slice(0,5).forEach(question => {
                gameboard.addQuestion(category.categoryId, new Question(question.id, question.answer, question.question, questionValue, question.categoryId));

                let questionBox = document.createElement('div');
                questionBox.classList.add('game-square');
                questionBox.setAttribute('data-category', category.categoryId);
                questionBox.setAttribute('data-question', question.id);
                questionBox.textContent = questionValue;
                questionBox.addEventListener('click', gameboard.displayQuestion);

                questionValue += 100;

                categoryContainer.appendChild(questionBox);
            });
            gameContainer.appendChild(categoryContainer);
        }
    ).catch(error => {
        console.log(error);
        
        //if a category has too few questions, it will throw an error, which will be caught here
        //this catch block will retrieve another category to replace the one with too few questions
        if(error instanceof CategoryQuestionAmountError)
        {
            gameboard.removeCategory(error.category.categoryId);
            let categoryPromise = fetchCategories(1);
            categoryPromise.then(
                categories => {
                    let {category_id, category_name, jservice_id} = categories[0];
                    let category = new Category(category_id, category_name, jservice_id);
                    gameboard.addCategory(category);
                    buildCategory(category);
                }
            ).catch(error => console.log(error));
        }
        //if Axios can't retrieve questions from the trivia API... 
        else if(error instanceof AxiosError)
        {
            createModalMessage(`The game is struggling to find questions for you. Please try again later.`, 'error');
        }
    });
}

//creates the UI elements of the game
const buildGame = () => {
    //request 6 randomly chosen categories
    let categoryPromise = fetchCategories(6);
    categoryPromise.then(
        categories => {
            categories.forEach(category => {
                let {category_id, category_name, jservice_id} = category;
                let gameCategory = new Category(category_id, category_name, jservice_id);
                gameboard.addCategory(gameCategory);
                buildCategory(gameCategory);
            });
        }
    );
}

buildGame();