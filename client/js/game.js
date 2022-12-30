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
import { QuestionNotFoundError } from './classes/QuestionNotFoundError.js';
import { AxiosError } from './classes/AxiosError.js';

const gameboard = new Gameboard();
const gameContainer = document.querySelector('#gameboard-container');

let playerScoreContainer = document.querySelector('#player-score');
let player = JSON.parse(user);
playerScoreContainer.innerHTML = `${player.first_name}'s Score: <span id="score">${gameboard.getPlayerScore()}</span>`;

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

const showQuestion = (categoryId, questionId) => {
    let category = gameboard.getCategory(categoryId);
    let question = category.getQuestion(questionId);

    console.log(categoryId, category);
    console.log(questionId, question);

    //create the modal container
    let modal = document.createElement('div');
    modal.classList.add('modal');
    modal.classList.add('question-modal');
    
    //create the modal title
    let modalCategoryTitle = document.createElement('span');
    modalCategoryTitle.textContent = category.categoryName;
    let modalQuestionValue = document.createElement('span');
    modalQuestionValue.textContent = question.value + ' points';

    //create the modal body container
    let modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    //create the modal body elements
    let modalQuestionTitle = document.createElement('h1');
    modalQuestionTitle.classList.add('title');
    modalQuestionTitle.textContent = 'Question:';
    let modalQuestionBody = document.createElement('p');
    modalQuestionBody.textContent = question.question;

    let modalBodySeparator = document.createElement('hr');
    modalBodySeparator.classList.add('modal-separator');

    //create the modal button
    let modalButton = document.createElement('button');
    modalButton.classList.add('modal-btn');
    modalButton.textContent = 'Submit';

    let modalButtonsContainer = document.createElement('div');
    modalButtonsContainer.classList.add('buttons-container');
    modalButtonsContainer.appendChild(modalButton);
    
    let answerForm = document.createElement('form');
    let answerLabel = document.createElement('label');
    answerLabel.setAttribute('for', 'answer');
    answerLabel.textContent = 'Answer:';
    let answerInput = document.createElement('input');
    answerInput.setAttribute('type', 'text');
    answerInput.setAttribute('id', 'answer-input');
    answerForm.appendChild(answerLabel);
    answerForm.appendChild(answerInput);
    answerForm.appendChild(modalButtonsContainer);
    answerForm.addEventListener('submit', e => {
        e.preventDefault();
        let answer = document.querySelector('#answer-input').value;
        closeModal();

        //compares the user's answer to the question's answer, updated the user's score, and displays the outcome of the answer to the user
        let userAnsweredCorrectly = answer.toLowerCase() === question.answer.toLowerCase();
        let newScore = gameboard.updatePlayerScore(question.value, userAnsweredCorrectly);
        document.querySelector('#score').textContent = newScore;
        if(userAnsweredCorrectly)
        {
            createModalMessage(`That's correct!`, 'info');
        }
        else
        {
            createModalMessage(`Wrong! The correct answer was ${question.answer}`, 'warning');
        }
    });

    modalBody.appendChild(modalQuestionTitle);
    modalBody.appendChild(modalQuestionBody);
    modalBody.appendChild(modalBodySeparator);
    modalBody.appendChild(answerForm);

    let modalTitleContainer = document.createElement('header');
    modalTitleContainer.classList.add('titlebar');
    modalTitleContainer.appendChild(modalCategoryTitle);
    modalTitleContainer.appendChild(modalQuestionValue);
    
    modal.appendChild(modalTitleContainer);
    modal.appendChild(modalBody);
    //modal.appendChild(modalButtonsContainer);

    document.body.appendChild(modal);
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
                    let categoryId = e.target.getAttribute('data-category');
                    let questionId = e.target.getAttribute('data-question');

                    try 
                    {
                        showQuestion(categoryId, questionId);
                    } 
                    catch(error) 
                    {
                        if(error instanceof QuestionNotFoundError)
                        {
                            createModalMessage(`Your question could not be found`, 'error');
                        }
                        else
                        {
                            throw error;
                        }
                    }
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