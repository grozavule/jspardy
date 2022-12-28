//verify that the user is logged in
let user = sessionStorage.getItem('user');
if(!user)
{
    navigateToHome();
}

import { Gameboard } from './classes/Gameboard.js';
import { Category } from './classes/Category.js';
import { Question } from './classes/Question.js';
import { CategoryQuestionAmountError } from './classes/CategoryQuestionAmountError.js';

const gameboard = new Gameboard();
const gameContainer = document.querySelector('#gameboard-container');

const fetchCategories = numCategories => {
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
        axios.get(`${TRIVIA_API_BASE_URL}/api/category?id=${category.jServiceId}`)
        .then(res => {
            if(res.data.clues.length < 5)
            {
                reject(new CategoryQuestionAmountError('Too few questions', category));
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
                questionBox.addEventListener('click', e => {
                    alert(`Category: ${category.categoryId} - Question: ${question.id}`);
                });

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
                    let {category_id, category_name, jsservice_id} = categories[0];
                    let category = new Category(category_id, category_name, jsservice_id);
                    gameboard.addCategory(category);
                    buildCategory(category);
                }
            ).catch(error => console.log(error));
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
                let {category_id, category_name, jsservice_id} = category;
                let gameCategory = new Category(category_id, category_name, jsservice_id);
                gameboard.addCategory(gameCategory);
                buildCategory(gameCategory);
            });
        }
    );
}

buildGame();
//console.log(gameboard);